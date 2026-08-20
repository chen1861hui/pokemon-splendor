import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { randomBytes, randomUUID } from "node:crypto";
import { addPlayer, advanceExpiredTurns, chooseTrainerCard, createLobby, performAction, pokemonCatalog, publicGame, restartFinishedGame, setSilhouetteMode, setTurnTimer, startGame } from "./src/game.js";

const port = Number(process.env.PORT) || 4173;
const publicDirectory = join(process.cwd(), "public");
const rooms = new Map();

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

function roomCode() {
  let code;
  do code = randomBytes(3).toString("hex").toUpperCase();
  while (rooms.has(code));
  return code;
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

function getRoom(code) {
  const room = rooms.get(code.toUpperCase());
  if (!room) throw new Error("Room not found.");
  room.lastSeenAt = Date.now();
  advanceExpiredTurns(room.game);
  return room;
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

  if (request.method === "POST" && url.pathname === "/api/rooms") {
    const { name } = await readJson(request);
    if (!name?.trim()) throw new Error("Enter a player name.");
    const credentials = playerCredentials(name);
    const code = roomCode();
    rooms.set(code, { game: createLobby(credentials), lastSeenAt: Date.now() });
    return sendJson(response, 201, { code, playerId: credentials.id, playerKey: credentials.key });
  }

  const match = url.pathname.match(/^\/api\/rooms\/([A-F0-9]{6})(?:\/(join|trainer|timer|silhouette|start|actions|finish))?$/i);
  if (!match) return false;
  const [, code, operation] = match;
  const room = getRoom(code);

  if (request.method === "GET" && !operation) {
    const playerId = request.headers["x-player-id"];
    const playerKey = request.headers["x-player-key"];
    const viewer = playerId || playerKey ? authenticate(room, playerId, playerKey) : null;
    return sendJson(response, 200, publicGame(room.game, viewer?.id));
  }
  if (request.method !== "POST") return sendJson(response, 405, { error: "Method not allowed." });
  const data = await readJson(request);

  if (operation === "join") {
    const credentials = playerCredentials(data.name);
    addPlayer(room.game, credentials);
    return sendJson(response, 200, { code: code.toUpperCase(), playerId: credentials.id, playerKey: credentials.key });
  }

  const player = authenticate(room, data.playerId, data.playerKey);
  if (operation === "trainer") {
    chooseTrainerCard(room.game, player.id, data.trainerCardId);
    return sendJson(response, 200, publicGame(room.game, player.id));
  }
  if (operation === "timer") {
    if (player.id !== room.game.hostId) throw new Error("Only the room host can change the turn timer.");
    setTurnTimer(room.game, Number(data.seconds));
    return sendJson(response, 200, publicGame(room.game, player.id));
  }
  if (operation === "silhouette") {
    if (player.id !== room.game.hostId) throw new Error("Only the room host can change mystery silhouettes.");
    setSilhouetteMode(room.game, data.enabled);
    return sendJson(response, 200, publicGame(room.game, player.id));
  }
  if (operation === "start") {
    startGame(room.game);
    return sendJson(response, 200, publicGame(room.game, player.id));
  }
  if (operation === "actions") {
    performAction(room.game, player.id, data.action);
    return sendJson(response, 200, publicGame(room.game, player.id));
  }
  if (operation === "finish") {
    restartFinishedGame(room.game, player.id);
    return sendJson(response, 200, publicGame(room.game, player.id));
  }
  return false;
}

async function serveStatic(response, pathname) {
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
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
  const expiry = Date.now() - 12 * 60 * 60 * 1000;
  for (const [code, room] of rooms) {
    if (room.lastSeenAt < expiry) rooms.delete(code);
  }
}, 60 * 60 * 1000).unref();

setInterval(() => {
  for (const room of rooms.values()) advanceExpiredTurns(room.game);
}, 250).unref();

server.listen(port, () => {
  console.log(`Pokémon Splendor is running at http://localhost:${port}`);
});
