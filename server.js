import { createServer } from "node:http";
import { readFile, readdir } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { randomBytes, randomUUID } from "node:crypto";
import { addPlayer, advanceExpiredTurns, chooseTrainerCard, createLobby, endGame, performAction, pokemonCatalog, publicGame, removePlayer, restartFinishedGame, setSilhouetteMode, setTurnTimer, startGame } from "./src/game.js";
import { createRoomStore } from "./src/room-store.js";

const port = Number(process.env.PORT) || 4173;
const publicDirectory = join(process.cwd(), "public");
const musicDirectory = join(publicDirectory, "assets", "musics");
const roomStore = createRoomStore();
const roomTouchIntervalMilliseconds = 60_000;

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav"
};

async function musicCatalog() {
  try {
    const entries = await readdir(musicDirectory, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && /\.(wav|mp3)$/i.test(entry.name))
      .map((entry) => ({
        id: `local:${entry.name}`,
        name: entry.name.replace(/\.(wav|mp3)$/i, ""),
        url: `/assets/musics/${encodeURIComponent(entry.name)}`
      }))
      .sort((left, right) => left.name.localeCompare(right.name, "en", { numeric: true }));
  } catch {
    return [];
  }
}

function roomCode() {
  return randomBytes(3).toString("hex").toUpperCase();
}

function playerCredentials(name) {
  return { id: randomUUID(), key: randomBytes(18).toString("base64url"), name };
}

function sendJson(response, status, data) {
  response.writeHead(status, { "content-type": contentTypes[".json"], "cache-control": "no-store" });
  response.end(JSON.stringify(data));
}

async function readJson(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 50_000) throw new Error("Request is too large.");
  }
  try {
    return body ? JSON.parse(body) : {};
  } catch {
    throw new Error("Invalid request data.");
  }
}

function turnHasExpired(game, now) {
  return game.status === "playing"
    && game.turnDurationSeconds > 0
    && Number.isFinite(game.turnStartedAt)
    && now - game.turnStartedAt >= game.turnDurationSeconds * 1000;
}

async function getRoom(code) {
  let room = await roomStore.get(code);
  if (!room) throw new Error("Room not found.");
  const now = Date.now();
  if (turnHasExpired(room.game, now) || now - room.lastSeenAt >= roomTouchIntervalMilliseconds) {
    room = await updateRoom(code, (currentRoom) => currentRoom);
  }
  return room;
}

async function updateRoom(code, updater) {
  return roomStore.update(code, (room) => {
    advanceExpiredTurns(room.game);
    return updater(room);
  });
}

async function createStoredRoom(credentials) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const code = roomCode();
    const created = await roomStore.create(code, { game: createLobby(credentials), lastSeenAt: Date.now() });
    if (created) return code;
  }
  throw new Error("Unable to create a unique room. Try again.");
}

function authenticate(room, playerId, playerKey) {
  const player = room.game.players.find((candidate) => candidate.id === playerId && candidate.key === playerKey);
  if (!player) throw new Error("Your player session is not valid for this room.");
  return player;
}

async function handleApi(request, response, url) {
  if (request.method === "GET" && url.pathname === "/api/catalog") {
    return sendJson(response, 200, pokemonCatalog());
  }
  if (request.method === "GET" && url.pathname === "/api/music") {
    return sendJson(response, 200, await musicCatalog());
  }

  if (request.method === "POST" && url.pathname === "/api/rooms") {
    const { name } = await readJson(request);
    if (!name?.trim()) throw new Error("Enter a player name.");
    const credentials = playerCredentials(name);
    const code = await createStoredRoom(credentials);
    return sendJson(response, 201, { code, playerId: credentials.id, playerKey: credentials.key });
  }

  const match = url.pathname.match(/^\/api\/rooms\/([A-F0-9]{6})(?:\/(join|trainer|timer|silhouette|start|actions|finish|end|leave|disband))?$/i);
  if (!match) return false;
  const [, code, operation] = match;

  if (request.method === "GET" && !operation) {
    const room = await getRoom(code);
    const playerId = request.headers["x-player-id"];
    const playerKey = request.headers["x-player-key"];
    const viewer = playerId || playerKey ? authenticate(room, playerId, playerKey) : null;
    return sendJson(response, 200, publicGame(room.game, viewer?.id));
  }
  if (request.method !== "POST") return sendJson(response, 405, { error: "Method not allowed." });
  const data = await readJson(request);

  if (operation === "join") {
    const credentials = playerCredentials(data.name);
    await updateRoom(code, (room) => addPlayer(room.game, credentials));
    return sendJson(response, 200, { code: code.toUpperCase(), playerId: credentials.id, playerKey: credentials.key });
  }

  if (operation === "disband") {
    await roomStore.remove(code, (room) => {
      const player = authenticate(room, data.playerId, data.playerKey);
      if (player.id !== room.game.hostId) throw new Error("Only the room host can disband the room.");
    });
    return sendJson(response, 200, { disbanded: true });
  }

  const result = await updateRoom(code, (room) => {
    const player = authenticate(room, data.playerId, data.playerKey);
    if (operation === "end") endGame(room.game, player.id);
    else if (operation === "leave") removePlayer(room.game, player.id);
    else if (operation === "trainer") chooseTrainerCard(room.game, player.id, data.trainerCardId);
    else if (operation === "timer") {
      if (player.id !== room.game.hostId) throw new Error("Only the room host can change the turn timer.");
      setTurnTimer(room.game, Number(data.seconds));
    } else if (operation === "silhouette") {
      if (player.id !== room.game.hostId) throw new Error("Only the room host can change mystery silhouettes.");
      setSilhouetteMode(room.game, data.enabled);
    } else if (operation === "start") startGame(room.game);
    else if (operation === "actions") performAction(room.game, player.id, data.action);
    else if (operation === "finish") restartFinishedGame(room.game, player.id);
    else throw new Error("Unknown room operation.");
    return operation === "leave" ? { left: true } : publicGame(room.game, player.id);
  });
  return sendJson(response, 200, result);
}

async function serveStatic(response, pathname) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return false;
  }
  const requestedPath = decodedPath === "/" ? "/index.html" : decodedPath;
  const relativePath = normalize(requestedPath).replace(/^[/\\]+/, "");
  const filePath = join(publicDirectory, relativePath);
  if (!filePath.startsWith(publicDirectory)) return false;
  try {
    const body = await readFile(filePath);
    const extension = extname(filePath);
    const headers = { "content-type": contentTypes[extension] ?? "application/octet-stream" };
    if ([".html", ".css", ".js"].includes(extension)) headers["cache-control"] = "no-cache";
    response.writeHead(200, headers);
    response.end(body);
    return true;
  } catch {
    return false;
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host ?? "localhost"}`);
  try {
    if (url.pathname.startsWith("/api/")) {
      const handled = await handleApi(request, response, url);
      if (!handled && !response.writableEnded) sendJson(response, 404, { error: "Not found." });
      return;
    }
    if (!await serveStatic(response, url.pathname)) sendJson(response, 404, { error: "Not found." });
  } catch (error) {
    sendJson(response, 400, { error: error.message || "Unable to complete the request." });
  }
});

setInterval(() => {
  roomStore.cleanupExpired();
}, 60 * 60 * 1000).unref();

setInterval(() => {
  for (const room of roomStore.localRooms()) advanceExpiredTurns(room.game);
}, 250).unref();

server.listen(port, () => {
  console.log(`Pokémon Splendor is running at http://localhost:${port}`);
});
