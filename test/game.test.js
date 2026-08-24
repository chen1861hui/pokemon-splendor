import test from "node:test";
import assert from "node:assert/strict";
import { addPlayer, advanceExpiredTurns, chooseTrainerCard, createLobby, endGame, paymentForCard, performAction, pokemonCatalog, publicGame, removePlayer, restartFinishedGame, setSilhouetteMode, setTurnTimer, startGame } from "../src/game.js";

function startedGame() {
  const game = createLobby({ id: "p1", key: "k1", name: "Red" });
  addPlayer(game, { id: "p2", key: "k2", name: "Blue" });
  chooseTrainerCard(game, "p1", "ash");
  chooseTrainerCard(game, "p2", "brock");
  startGame(game, () => 0.5);
  return game;
}

test("starts with three Stage rows plus Rare and Legendary Pokémon", () => {
  const game = startedGame();
  assert.equal(game.status, "playing");
  assert.equal(game.supply.poke, 4);
  assert.equal(game.supply.master, 5);
  assert.deepEqual(game.market.map((tier) => tier.length), [4, 4, 4, 1, 1]);
  assert.deepEqual(game.decks.map((deck) => deck.length), [31, 26, 11, 4, 4]);
  assert.equal(game.market[3][0].kind, "rare");
  assert.equal(game.market[4][0].kind, "legendary");
});

test("requires exclusive Trainer card choices before starting", () => {
  const game = createLobby({ id: "p1", key: "k1", name: "Red" });
  addPlayer(game, { id: "p2", key: "k2", name: "Blue" });
  chooseTrainerCard(game, "p1", "ash");
  assert.throws(() => chooseTrainerCard(game, "p2", "ash"), /already been chosen/);
  assert.throws(() => startGame(game), /Every player must choose/);
  chooseTrainerCard(game, "p2", "brock");
  startGame(game, () => 0.5);
  assert.equal(game.players[0].trainerCardId, "ash");
  assert.equal(game.players[1].trainerCardId, "brock");
});

test("orders players and turns by the chosen Trainer characters", () => {
  const game = createLobby({ id: "p1", key: "k1", name: "Misty player" });
  addPlayer(game, { id: "p2", key: "k2", name: "Giovanni player" });
  addPlayer(game, { id: "p3", key: "k3", name: "Red player" });
  chooseTrainerCard(game, "p1", "misty");
  chooseTrainerCard(game, "p2", "rocket");
  chooseTrainerCard(game, "p3", "ash");

  startGame(game, () => 0.5);

  assert.deepEqual(game.players.map((player) => player.id), ["p3", "p1", "p2"]);
  assert.equal(game.players[game.turnIndex].id, "p3");
  assert.equal(game.lastAction, "Red player takes the first turn");
});

test("a guest can leave the lobby and frees their Trainer card", () => {
  const game = createLobby({ id: "p1", key: "k1", name: "Red" });
  addPlayer(game, { id: "p2", key: "k2", name: "Blue" });
  chooseTrainerCard(game, "p2", "brock");

  removePlayer(game, "p2");

  assert.deepEqual(game.players.map((player) => player.id), ["p1"]);
  addPlayer(game, { id: "p3", key: "k3", name: "Green" });
  chooseTrainerCard(game, "p3", "brock");
  assert.equal(game.players[1].trainerCardId, "brock");
  assert.throws(() => removePlayer(game, "p1"), /host must disband/);
});

test("an active guest leaving returns held balls and advances their turn", () => {
  const game = createLobby({ id: "p1", key: "k1", name: "Red" });
  addPlayer(game, { id: "p2", key: "k2", name: "Blue" });
  addPlayer(game, { id: "p3", key: "k3", name: "Green" });
  chooseTrainerCard(game, "p1", "ash");
  chooseTrainerCard(game, "p2", "brock");
  chooseTrainerCard(game, "p3", "misty");
  startGame(game, () => 0.5);
  performAction(game, "p1", { type: "takeTokens", tokens: ["poke", "great", "ultra"] });
  game.players[1].tokens.heal = 2;
  game.supply.heal -= 2;
  const healSupply = game.supply.heal;

  removePlayer(game, "p2");

  assert.deepEqual(game.players.map((player) => player.id), ["p1", "p3"]);
  assert.equal(game.players[game.turnIndex].id, "p3");
  assert.equal(game.turnPhase, "action");
  assert.equal(game.supply.heal, healSupply + 2);
});

test("a two-player game returns the host to the lobby when the guest leaves", () => {
  const game = startedGame();
  game.players[0].points = 7;
  game.players[0].tokens.poke = 2;

  removePlayer(game, "p2");

  assert.equal(game.status, "lobby");
  assert.equal(game.players.length, 1);
  assert.equal(game.players[0].points, 0);
  assert.equal(game.players[0].tokens.poke, 0);
  assert.deepEqual(game.market.map((row) => row.length), [0, 0, 0, 0, 0]);
  assert.equal(game.turnStartedAt, null);
});

test("the host can end the current game and return every Trainer to the same lobby", () => {
  const game = startedGame();
  game.players[0].points = 9;
  game.players[0].tokens.master = 1;

  assert.throws(() => endGame(game, "p2"), /Only the room host/);
  endGame(game, "p1");

  assert.equal(game.status, "lobby");
  assert.deepEqual(game.players.map((player) => player.trainerCardId), ["ash", "brock"]);
  assert.equal(game.players[0].points, 0);
  assert.equal(game.players[0].tokens.master, 0);
  assert.deepEqual(game.market.map((row) => row.length), [0, 0, 0, 0, 0]);
  assert.equal(game.lastAction, "Game ended by host");
  assert.throws(() => endGame(game, "p1"), /has not started/);
});

test("optional turn timer advances to the next trainer when time expires", () => {
  const game = createLobby({ id: "p1", key: "k1", name: "Red" });
  addPlayer(game, { id: "p2", key: "k2", name: "Blue" });
  chooseTrainerCard(game, "p1", "ash");
  chooseTrainerCard(game, "p2", "brock");
  setTurnTimer(game, 60);
  startGame(game, () => 0.5);
  const startedAt = game.turnStartedAt;

  assert.equal(advanceExpiredTurns(game, startedAt + 59_999), false);
  assert.equal(advanceExpiredTurns(game, startedAt + 60_000), true);
  assert.equal(game.turnIndex, 1);
  assert.equal(game.lastAction, "Red's turn timed out");
  assert.equal(game.turnStartedAt, startedAt + 60_000);
});

test("turn timer accepts off or 15–600 seconds only", () => {
  const game = createLobby({ id: "p1", key: "k1", name: "Red" });
  setTurnTimer(game, 0);
  setTurnTimer(game, 15);
  setTurnTimer(game, 600);
  assert.throws(() => setTurnTimer(game, 14), /15–600/);
  assert.throws(() => setTurnTimer(game, 601), /15–600/);
  assert.throws(() => setTurnTimer(game, 30.5), /15–600/);
});

test("the optional silhouette setting is configured in the lobby and retained for play again", () => {
  const game = createLobby({ id: "p1", key: "k1", name: "Red" });
  setSilhouetteMode(game, true);
  assert.equal(game.silhouetteMode, true);
  addPlayer(game, { id: "p2", key: "k2", name: "Blue" });
  chooseTrainerCard(game, "p1", "ash");
  chooseTrainerCard(game, "p2", "brock");
  startGame(game, () => 0.5);
  assert.equal(game.silhouetteMode, true);
  assert.throws(() => setSilhouetteMode(game, false), /only be changed in the lobby/);
});

test("provides the complete public Pokémon checklist without card costs", () => {
  const catalog = pokemonCatalog();
  assert.equal(catalog.length, 90);
  assert.equal(catalog.filter((card) => card.kind === "stage" && card.tier === 1).length, 35);
  assert.equal(catalog.filter((card) => card.kind === "stage" && card.tier === 2).length, 30);
  assert.equal(catalog.filter((card) => card.kind === "stage" && card.tier === 3).length, 15);
  assert.equal(catalog.filter((card) => card.kind === "rare").length, 5);
  assert.equal(catalog.filter((card) => card.kind === "legendary").length, 5);
  assert.equal(catalog.find((card) => card.name === "Mew").classification, "mythical");
  assert.equal(catalog.filter((card) => card.name === "Nidoran♀").length, 3);
  assert.equal(catalog[0].cost, undefined);
});

test("card data preserves printed points, catch costs, bonuses, and evolution requirements", () => {
  const game = startedGame();
  const cards = [...game.market.flat(), ...game.decks.flat()];
  const cardsNamed = (name) => cards.filter((card) => card.name === name)
    .sort((left, right) => left.id.localeCompare(right.id, undefined, { numeric: true }));
  const normalizedCosts = (namedCards) => namedCards.map((card) => ({
    cost: card.cost,
    masterCost: card.masterCost,
    points: card.points,
    bonus: card.bonus,
    bonusAmount: card.bonusAmount,
    evolution: card.evolution
  }));

  assert.equal(cards.length, 90);
  assert.deepEqual(normalizedCosts(cardsNamed("Bulbasaur")), [
    { cost: { poke: 3, ultra: 2 }, masterCost: 0, points: 1, bonus: "quick", bonusAmount: 1,
      evolution: { evolvesTo: "Ivysaur", requiredBonuses: { heal: 3 } } },
    { cost: { quick: 4 }, masterCost: 0, points: 1, bonus: "quick", bonusAmount: 1,
      evolution: { evolvesTo: "Ivysaur", requiredBonuses: { heal: 3 } } }
  ]);
  assert.deepEqual(normalizedCosts(cardsNamed("Bellsprout")), [
    { cost: { ultra: 2, great: 1 }, masterCost: 0, points: 0, bonus: "poke", bonusAmount: 1,
      evolution: { evolvesTo: "Weepinbell", requiredBonuses: { heal: 2 } } },
    { cost: { heal: 2, poke: 2 }, masterCost: 0, points: 0, bonus: "poke", bonusAmount: 1,
      evolution: { evolvesTo: "Weepinbell", requiredBonuses: { heal: 2 } } },
    { cost: { quick: 3 }, masterCost: 0, points: 0, bonus: "poke", bonusAmount: 1,
      evolution: { evolvesTo: "Weepinbell", requiredBonuses: { heal: 2 } } }
  ]);

  const mew = cardsNamed("Mew")[0];
  assert.deepEqual(mew.cost, { ultra: 3, quick: 3, poke: 3 });
  assert.equal(mew.masterCost, 1);
  assert.equal(mew.points, 2);
  assert.equal(mew.bonus, "great");
  assert.equal(mew.bonusAmount, 2);
  assert.equal(mew.classification, "mythical");
});

test("uses the official ball supply for three and four players", () => {
  const threePlayerGame = createLobby({ id: "p1", key: "k1", name: "Red" });
  addPlayer(threePlayerGame, { id: "p2", key: "k2", name: "Blue" });
  addPlayer(threePlayerGame, { id: "p3", key: "k3", name: "Green" });
  chooseTrainerCard(threePlayerGame, "p1", "ash");
  chooseTrainerCard(threePlayerGame, "p2", "brock");
  chooseTrainerCard(threePlayerGame, "p3", "misty");
  startGame(threePlayerGame, () => 0.5);
  assert.equal(threePlayerGame.supply.poke, 5);
  assert.equal(threePlayerGame.supply.master, 5);

  const fourPlayerGame = createLobby({ id: "p1", key: "k1", name: "Red" });
  addPlayer(fourPlayerGame, { id: "p2", key: "k2", name: "Blue" });
  addPlayer(fourPlayerGame, { id: "p3", key: "k3", name: "Green" });
  addPlayer(fourPlayerGame, { id: "p4", key: "k4", name: "Yellow" });
  chooseTrainerCard(fourPlayerGame, "p1", "ash");
  chooseTrainerCard(fourPlayerGame, "p2", "brock");
  chooseTrainerCard(fourPlayerGame, "p3", "misty");
  chooseTrainerCard(fourPlayerGame, "p4", "rocket");
  startGame(fourPlayerGame, () => 0.5);
  assert.equal(fourPlayerGame.supply.poke, 7);
  assert.equal(fourPlayerGame.supply.master, 5);
});

test("taking three different tokens updates supply and advances the turn", () => {
  const game = startedGame();
  performAction(game, "p1", { type: "takeTokens", tokens: ["poke", "great", "ultra"] });
  assert.equal(game.players[0].tokens.poke, 1);
  assert.equal(game.supply.poke, 3);
  assert.equal(game.turnIndex, 1);
});

test("taking a pair requires at least four tokens in the bank", () => {
  const game = startedGame();
  performAction(game, "p1", { type: "takeTokens", tokens: ["poke", "poke"] });
  performAction(game, "p2", { type: "takeTokens", tokens: ["great", "ultra", "heal"] });
  assert.throws(
    () => performAction(game, "p1", { type: "takeTokens", tokens: ["poke", "poke"] }),
    /At least four/
  );
});

test("taking fewer colors is allowed only when fewer than three colors remain", () => {
  const game = startedGame();
  game.supply.ultra = 0;
  game.supply.heal = 0;
  game.supply.quick = 0;
  performAction(game, "p1", { type: "takeTokens", tokens: ["poke", "great"] });
  assert.equal(game.players[0].tokens.poke, 1);
  assert.equal(game.turnIndex, 1);
});

test("a trainer takes first and then returns excess tokens to ten", () => {
  const game = startedGame();
  game.players[0].tokens = { poke: 2, great: 2, ultra: 2, heal: 2, quick: 1, master: 0 };
  performAction(game, "p1", { type: "takeTokens", tokens: ["poke", "great", "ultra"] });
  assert.equal(game.turnPhase, "discard");
  assert.equal(game.turnIndex, 0);
  performAction(game, "p1", { type: "returnTokens", tokens: { poke: 1, great: 1 } });
  assert.equal(Object.values(game.players[0].tokens).reduce((sum, count) => sum + count, 0), 10);
  assert.equal(game.turnIndex, 1);
});

test("only the active player can act", () => {
  const game = startedGame();
  assert.throws(
    () => performAction(game, "p2", { type: "takeTokens", tokens: ["poke", "great", "ultra"] }),
    /Wait for your turn/
  );
});

test("reserve removes a market card, refills it, and grants a Master Ball token", () => {
  const game = startedGame();
  const card = game.market[0][0];
  const deckSize = game.decks[0].length;
  const previousCover = game.deckCovers[0];
  performAction(game, "p1", { type: "reserveCard", cardId: card.id });
  assert.equal(game.players[0].reserved[0].id, card.id);
  assert.equal(game.players[0].tokens.master, 1);
  assert.equal(game.supply.master, 4);
  assert.equal(game.market[0].length, 4);
  assert.equal(game.decks[0].length, deckSize - 1);
  assert.notEqual(game.deckCovers[0], previousCover);
});

test("Rare and Legendary Pokémon cannot be reserved", () => {
  const game = startedGame();
  assert.throws(
    () => performAction(game, "p1", { type: "reserveCard", cardId: game.market[3][0].id }),
    /cannot be reserved/
  );
});

test("a hidden card can be reserved from the top of a Stage deck", () => {
  const game = startedGame();
  const topCard = game.decks[1].at(-1);
  performAction(game, "p1", { type: "reserveTopCard", tierIndex: 1 });
  assert.equal(game.players[0].reserved[0].id, topCard.id);
  assert.equal(game.decks[1].some((card) => card.id === topCard.id), false);
});

test("special Pokémon require a Master Ball and grant a double bonus", () => {
  const game = startedGame();
  const card = game.market[4][0];
  for (const [type, count] of Object.entries(card.cost)) game.players[0].tokens[type] = count;
  assert.throws(
    () => performAction(game, "p1", { type: "buyCard", cardId: card.id }),
    /not have enough tokens/
  );

  game.players[0].tokens.master = 1;
  performAction(game, "p1", { type: "buyCard", cardId: card.id });
  assert.equal(game.players[0].tokens.master, 0);
  assert.equal(game.players[0].bonuses[card.bonus], 2);
});

test("payment calculation applies permanent discounts before Master Ball tokens", () => {
  const player = {
    tokens: { poke: 1, great: 0, ultra: 0, heal: 0, quick: 0, master: 1 },
    bonuses: { poke: 1, great: 0, ultra: 0, heal: 0, quick: 0 }
  };
  const card = { cost: { poke: 3 } };
  assert.deepEqual(paymentForCard(player, card), {
    poke: 1, great: 0, ultra: 0, heal: 0, quick: 0, master: 1
  });
});

test("buying a card pays the bank and grants its score and discount", () => {
  const game = startedGame();
  const card = game.market[0][0];
  for (const type of Object.keys(card.cost)) game.players[0].tokens[type] = card.cost[type];
  const pointsBefore = game.players[0].points;
  performAction(game, "p1", { type: "buyCard", cardId: card.id });
  assert.equal(game.players[0].cards[0].id, card.id);
  assert.equal(game.players[0].bonuses[card.bonus], 1);
  assert.equal(game.players[0].points, pointsBefore + card.points);
  assert.deepEqual(game.caughtPokedexIds, [card.pokedexId]);
  assert.equal(game.turnIndex, 1);
});

test("public game state hides player credentials and upcoming deck order", () => {
  const publicState = publicGame(startedGame());
  assert.equal(publicState.players[0].key, undefined);
  assert.equal(typeof publicState.decks[0].remaining, "number");
  assert.equal(publicState.decks[0][0], undefined);
});

test("reserved Pokémon details are visible only to their owner", () => {
  const game = startedGame();
  const originalMarketIds = game.market[0].map((card) => card.id);
  const replacementCardId = game.decks[0].at(-1).id;
  const reservedCard = game.market[0][1];
  performAction(game, "p1", { type: "reserveCard", cardId: reservedCard.id });

  assert.deepEqual(game.market[0].map((card) => card.id), [
    originalMarketIds[0], replacementCardId, originalMarketIds[2], originalMarketIds[3]
  ]);

  const ownerState = publicGame(game, "p1");
  const opponentState = publicGame(game, "p2");
  assert.equal(ownerState.players[0].reservedCount, 1);
  assert.equal(ownerState.players[0].reserved[0].id, reservedCard.id);
  assert.equal(opponentState.players[0].reservedCount, 1);
  assert.deepEqual(opponentState.players[0].reserved, []);
  assert.equal(opponentState.lastAction, "Red reserved a Pokémon");
  assert.equal(JSON.stringify(opponentState).includes(reservedCard.id), false);
});

test("cards expose sourced evolution targets and permanent-bonus requirements", () => {
  const game = startedGame();
  const cards = [...game.market.flat(), ...game.decks.flat()];
  const charmander = cards.find((card) => card.name === "Charmander");
  const charmeleon = cards.find((card) => card.name === "Charmeleon");
  const charizard = cards.find((card) => card.name === "Charizard");

  assert.deepEqual(charmander.evolution, { evolvesTo: "Charmeleon", requiredBonuses: { quick: 3 } });
  assert.deepEqual(charmeleon.evolution, { evolvesTo: "Charizard", requiredBonuses: { poke: 4 } });
  assert.equal(charizard.evolution, null);
});

test("eligible evolution replaces the source and tucks it without paying tokens", () => {
  const game = startedGame();
  const allCards = [...game.market.flat(), ...game.decks.flat()];
  const source = allCards.find((card) => card.name === "Charmander");
  const target = allCards.find((card) => card.name === "Charmeleon");
  game.players[0].cards.push(source);
  game.players[0].bonuses[source.bonus] += source.bonusAmount;
  game.players[0].points += source.points;
  game.players[0].bonuses.quick = Math.max(game.players[0].bonuses.quick, 3);
  game.players[0].reserved.push(target);

  performAction(game, "p1", { type: "takeTokens", tokens: ["poke", "great", "ultra"] });
  assert.equal(game.turnPhase, "evolve");
  performAction(game, "p1", { type: "evolveCard", cardId: target.id, sourceCardId: source.id });
  assert.equal(game.players[0].cards.some((card) => card.id === source.id), false);
  assert.equal(game.players[0].cards.some((card) => card.id === target.id), true);
  assert.equal(game.players[0].tucked[0].id, source.id);
  assert.equal(game.turnIndex, 1);
});

function finishedGame() {
  const game = startedGame();
  game.players[0].points = 18;
  performAction(game, "p1", { type: "takeTokens", tokens: ["poke", "great", "ultra"] });
  assert.equal(game.finalRoundTriggered, true);
  assert.equal(game.status, "playing");
  performAction(game, "p2", { type: "takeTokens", tokens: ["poke", "great", "ultra"] });
  assert.equal(game.status, "finished");
  return game;
}

test("18 points completes the round before tie-break scoring", () => {
  const game = finishedGame();
  assert.equal(game.winnerId, "p1");
  assert.equal(game.turnIndex, 0);
});

test("the host can play again after final scoring", () => {
  const restarted = finishedGame();
  restarted.caughtPokedexIds = [25];
  restartFinishedGame(restarted, "p1", () => 0.5);
  assert.equal(restarted.status, "playing");
  assert.equal(restarted.players[0].points, 0);
  assert.equal(restarted.players[0].cards.length, 0);
  assert.deepEqual(restarted.caughtPokedexIds, []);
});
