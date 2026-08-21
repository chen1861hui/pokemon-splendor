import test from "node:test";
import assert from "node:assert/strict";
import { chooseNormalBotAction } from "../src/bot.js";
import { addNormalBot, addPlayer, chooseTrainerCard, createLobby, performAction, publicGame, removeNormalBot, setNormalBotCount, startGame } from "../src/game.js";

function startedBotGame() {
  const game = createLobby({ id: "p1", key: "k1", name: "Red" });
  chooseTrainerCard(game, "p1", "ash");
  addNormalBot(game);
  startGame(game, () => 0.5);
  return game;
}

function removeCardNamed(game, name) {
  for (const collection of [...game.market, ...game.decks]) {
    const index = collection.findIndex((card) => card.name === name);
    if (index >= 0) return collection.splice(index, 1)[0];
  }
  return null;
}

test("a Normal bot fills a PvE seat and reserves an unused Trainer character", () => {
  const game = createLobby({ id: "p1", key: "k1", name: "Red" });
  chooseTrainerCard(game, "p1", "ash");

  const bot = addNormalBot(game);

  assert.equal(bot.id, "normal-bot-1");
  assert.equal(bot.name, "CPU Trainer 1");
  assert.equal(bot.isBot, true);
  assert.equal(bot.key, null);
  assert.equal(bot.trainerCardId, "rocket");
  assert.equal(publicGame(game, "p1").players[1].isBot, true);
  startGame(game, () => 0.5);
  assert.equal(game.players.length, 2);
});

test("one human can start with three uniquely identified Normal bots", () => {
  const game = createLobby({ id: "p1", key: "k1", name: "Red" });
  chooseTrainerCard(game, "p1", "ash");

  const bots = setNormalBotCount(game, 3);

  assert.deepEqual(bots.map((bot) => bot.id), ["normal-bot-1", "normal-bot-2", "normal-bot-3"]);
  assert.equal(new Set(bots.map((bot) => bot.trainerCardId)).size, 3);
  assert.equal(new Set(game.players.map((player) => player.trainerCardId)).size, 4);
  startGame(game, () => 0.5);
  assert.equal(game.players.length, 4);
});

test("a joining human automatically takes one bot seat in a full lobby", () => {
  const game = createLobby({ id: "p1", key: "k1", name: "Red" });
  setNormalBotCount(game, 3);

  addPlayer(game, { id: "p2", key: "k2", name: "Blue" });

  assert.equal(game.players.length, 4);
  assert.equal(game.players.filter((player) => player.isBot).length, 2);
  assert.ok(game.players.some((player) => player.id === "p2"));
});

test("the Normal bot can be removed only while the room is in the lobby", () => {
  const game = createLobby({ id: "p1", key: "k1", name: "Red" });
  addNormalBot(game);
  assert.equal(removeNormalBot(game), true);
  assert.equal(removeNormalBot(game), false);
  addNormalBot(game);
  chooseTrainerCard(game, "p1", "ash");
  startGame(game, () => 0.5);
  assert.throws(() => removeNormalBot(game), /only be changed in the lobby/);
});

test("the Normal bot chooses and completes a valid main action", () => {
  const game = startedBotGame();
  performAction(game, "p1", { type: "takeTokens", tokens: ["poke", "great", "ultra"] });
  assert.equal(game.players[game.turnIndex].isBot, true);

  let botSteps = 0;
  while (game.status === "playing" && game.players[game.turnIndex].isBot && botSteps < 4) {
    const action = chooseNormalBotAction(game);
    assert.ok(action);
    if (botSteps === 0) assert.equal(action.type, "takeTokens");
    performAction(game, game.players[game.turnIndex].id, action);
    botSteps += 1;
  }

  assert.ok(botSteps >= 1);
  assert.equal(game.players[game.turnIndex].id, "p1");
});

test("three Normal bots can complete consecutive turns and return play to one human", () => {
  const game = createLobby({ id: "p1", key: "k1", name: "Red" });
  chooseTrainerCard(game, "p1", "ash");
  setNormalBotCount(game, 3);
  startGame(game, () => 0.5);
  performAction(game, "p1", { type: "takeTokens", tokens: ["poke", "great", "ultra"] });
  const botsSeen = new Set();

  let botSteps = 0;
  while (game.status === "playing" && game.players[game.turnIndex].isBot && botSteps < 12) {
    const bot = game.players[game.turnIndex];
    botsSeen.add(bot.id);
    const action = chooseNormalBotAction(game);
    assert.ok(action);
    performAction(game, bot.id, action);
    botSteps += 1;
  }

  assert.deepEqual([...botsSeen], ["normal-bot-1", "normal-bot-2", "normal-bot-3"]);
  assert.equal(game.players[game.turnIndex].id, "p1");
});

test("the Normal bot catches an affordable Pokémon", () => {
  const game = startedBotGame();
  performAction(game, "p1", { type: "takeTokens", tokens: ["poke", "great", "ultra"] });
  const bot = game.players[game.turnIndex];
  for (const type of Object.keys(bot.tokens)) bot.tokens[type] = 10;

  const action = chooseNormalBotAction(game);

  assert.equal(action.type, "buyCard");
  performAction(game, bot.id, action);
  assert.equal(bot.cards.length, 1);
});

test("the Normal bot returns exactly enough low-value balls", () => {
  const game = startedBotGame();
  performAction(game, "p1", { type: "takeTokens", tokens: ["poke", "great", "ultra"] });
  const bot = game.players[game.turnIndex];
  bot.tokens = { poke: 3, great: 2, ultra: 2, heal: 2, quick: 2, master: 1 };
  game.turnPhase = "discard";
  game.pendingActionMessage = "CPU Trainer took tokens";

  const action = chooseNormalBotAction(game);
  const returnedCount = Object.values(action.tokens).reduce((total, count) => total + count, 0);

  assert.equal(action.type, "returnTokens");
  assert.equal(returnedCount, 2);
  performAction(game, bot.id, action);
  assert.equal(Object.values(bot.tokens).reduce((total, count) => total + count, 0), 10);
});

test("the Normal bot completes an available evolution", () => {
  const game = startedBotGame();
  performAction(game, "p1", { type: "takeTokens", tokens: ["poke", "great", "ultra"] });
  const bot = game.players[game.turnIndex];
  const source = [...game.market.flat(), ...game.decks.flat()].find((card) => card.evolution);
  assert.ok(source?.evolution);
  const sourceCard = removeCardNamed(game, source.name);
  const targetCard = removeCardNamed(game, source.evolution.evolvesTo);
  assert.ok(sourceCard && targetCard);
  bot.cards.push(sourceCard);
  bot.bonuses[sourceCard.bonus] += sourceCard.bonusAmount;
  for (const [type, required] of Object.entries(sourceCard.evolution.requiredBonuses)) bot.bonuses[type] = Math.max(bot.bonuses[type], required);
  game.market[targetCard.tier - 1][0] = targetCard;
  game.turnPhase = "evolve";
  game.pendingActionMessage = "CPU Trainer took tokens";

  const action = chooseNormalBotAction(game);

  assert.deepEqual(action, { type: "evolveCard", cardId: targetCard.id, sourceCardId: sourceCard.id });
  performAction(game, bot.id, action);
  assert.ok(bot.cards.some((card) => card.id === targetCard.id));
  assert.ok(bot.tucked.some((card) => card.id === sourceCard.id));
});
