import { cards as sourcedCards } from "./cards.js";

export const gemTypes = ["poke", "great", "ultra", "heal", "quick"];
export const allTokenTypes = [...gemTypes, "master"];
export const targetScore = 18;
export const trainerCardIds = ["ash", "brock", "misty", "rocket"];
export const minimumTurnSeconds = 15;
export const maximumTurnSeconds = 600;

const pokedexIds = {
  Abra: 63, Aerodactyl: 142, Alakazam: 65, Ampharos: 181, Arcanine: 59, Articuno: 144, Bellsprout: 69,
  Blastoise: 9, Bulbasaur: 1, Celebi: 251, Charizard: 6, Charmander: 4, Charmeleon: 5,
  Drowzee: 96, Electabuzz: 125, Entei: 244, Exeggutor: 103, Gastly: 92, Golduck: 55,
  Gengar: 94, Golem: 76, Growlithe: 58, Haunter: 93, Hypno: 97, Ivysaur: 2,
  Ditto: 132, Eevee: 133, Jirachi: 385, Jolteon: 135, Kadabra: 64, Lapras: 131, Magnemite: 81, Magmar: 126, Manaphy: 490,
  Mew: 151, Mewtwo: 150, Moltres: 146, Ninetales: 38, Oddish: 43, Pikachu: 25,
  Poliwag: 60, Poliwrath: 62, Psyduck: 54, Raichu: 26, Raikou: 243, Rapidash: 78,
  Sceptile: 254, Shaymin: 492, Snorlax: 143,
  Squirtle: 7, Starmie: 121, Suicune: 245, Venusaur: 3, Voltorb: 100, Vulpix: 37,
  Victreebel: 71, Vileplume: 45, Wartortle: 8, Weepinbell: 70, Zapdos: 145
};

const pokemonByTier = [
  ["Charmander", "Squirtle", "Bulbasaur", "Pikachu", "Abra", "Vulpix", "Psyduck", "Oddish", "Magnemite", "Gastly", "Growlithe", "Poliwag", "Bellsprout", "Voltorb", "Drowzee"],
  ["Charmeleon", "Wartortle", "Ivysaur", "Raichu", "Kadabra", "Arcanine", "Golduck", "Weepinbell", "Electabuzz", "Haunter", "Magmar", "Starmie", "Exeggutor", "Jolteon", "Hypno"],
  ["Charizard", "Blastoise", "Venusaur", "Alakazam", "Ninetales", "Vileplume", "Poliwrath", "Victreebel", "Gengar", "Arcanine", "Golem", "Rapidash", "Sceptile", "Ampharos", "Electabuzz"]
];

const specialPokemon = [
  {
    kind: "rare",
    cards: [
      { name: "Lapras", bonus: "poke", cost: { ultra: 3, great: 2 } },
      { name: "Ditto", bonus: "great", cost: { heal: 3, quick: 2 } },
      { name: "Eevee", bonus: "ultra", cost: { quick: 3, poke: 2 } },
      { name: "Aerodactyl", bonus: "quick", cost: { great: 3, heal: 2 } },
      { name: "Snorlax", bonus: "heal", cost: { poke: 3, ultra: 2 } }
    ]
  },
  {
    kind: "legendary",
    cards: [
      { name: "Articuno", bonus: "quick", cost: { poke: 3, heal: 3, ultra: 3 } },
      { name: "Zapdos", bonus: "poke", cost: { heal: 3, great: 3, quick: 3 } },
      { name: "Moltres", bonus: "heal", cost: { great: 3, quick: 3, ultra: 3 } },
      { name: "Mewtwo", bonus: "ultra", cost: { heal: 3, poke: 3, great: 3 } },
      { name: "Mew", bonus: "great", cost: { ultra: 3, quick: 3, poke: 3 } }
    ]
  }
];

const evolutionRules = {
  Bulbasaur: { evolvesTo: "Ivysaur", requiredBonuses: { heal: 3 } },
  Ivysaur: { evolvesTo: "Venusaur", requiredBonuses: { great: 4 } },
  Charmander: { evolvesTo: "Charmeleon", requiredBonuses: { quick: 3 } },
  Charmeleon: { evolvesTo: "Charizard", requiredBonuses: { poke: 4 } },
  Squirtle: { evolvesTo: "Wartortle", requiredBonuses: { ultra: 3 } },
  Wartortle: { evolvesTo: "Blastoise", requiredBonuses: { heal: 4 } },
  Abra: { evolvesTo: "Kadabra", requiredBonuses: { poke: 3 } },
  Kadabra: { evolvesTo: "Alakazam", requiredBonuses: { ultra: 4 } },
  Gastly: { evolvesTo: "Haunter", requiredBonuses: { ultra: 3 } },
  Haunter: { evolvesTo: "Gengar", requiredBonuses: { poke: 3 } },
  Bellsprout: { evolvesTo: "Weepinbell", requiredBonuses: { heal: 2 } },
  Weepinbell: { evolvesTo: "Victreebel", requiredBonuses: { heal: 4 } }
};

const tierPatterns = [
  [
    { points: 0, values: [2, 1, 1] },
    { points: 0, values: [0, 2, 2] },
    { points: 0, values: [3, 0, 1] },
    { points: 1, values: [0, 0, 4] },
    { points: 0, values: [1, 1, 2] }
  ],
  [
    { points: 1, values: [3, 2, 2] },
    { points: 2, values: [5, 0, 2] },
    { points: 1, values: [2, 3, 3] },
    { points: 3, values: [0, 6, 0] },
    { points: 2, values: [4, 2, 1] }
  ],
  [
    { points: 3, values: [5, 3, 3] },
    { points: 4, values: [7, 0, 3] },
    { points: 4, values: [3, 6, 3] },
    { points: 5, values: [0, 7, 3] },
    { points: 3, values: [4, 4, 5] }
  ]
];

function emptyTokens() {
  return Object.fromEntries(allTokenTypes.map((type) => [type, 0]));
}

function emptyBonuses() {
  return Object.fromEntries(gemTypes.map((type) => [type, 0]));
}

function buildCards() {
  const stageDecks = pokemonByTier.map((names, tierIndex) => names.map((name, index) => {
    const bonus = gemTypes[index % gemTypes.length];
    const pattern = tierPatterns[tierIndex][index % tierPatterns[tierIndex].length];
    const costTypes = [
      gemTypes[(index + 1) % gemTypes.length],
      gemTypes[(index + 2) % gemTypes.length],
      gemTypes[(index + 3) % gemTypes.length]
    ];
    const cost = {};
    pattern.values.forEach((value, valueIndex) => {
      if (value > 0) cost[costTypes[valueIndex]] = value;
    });

    return {
      id: `tier-${tierIndex + 1}-card-${index + 1}`,
      name,
      pokedexId: pokedexIds[name],
      kind: "stage",
      tier: tierIndex + 1,
      bonus,
      bonusAmount: 1,
      points: pattern.points,
      cost,
      evolution: evolutionRules[name] ?? null
    };
  }));

  const specialDecks = specialPokemon.map(({ kind, cards }) => cards.map(({ name, bonus, cost }, index) => {
    return {
      id: `${kind}-card-${index + 1}`,
      name,
      pokedexId: pokedexIds[name],
      kind,
      tier: null,
      bonus,
      bonusAmount: 2,
      masterCost: 1,
      points: kind === "rare" ? 0 : 2,
      cost
    };
  }));

  return [...stageDecks, ...specialDecks];
}

const sourceColorToToken = {
  red: "poke",
  blue: "great",
  black: "ultra",
  pink: "heal",
  yellow: "quick"
};

function remapSourceColors(values = {}) {
  return Object.fromEntries(Object.entries(values)
    .filter(([color, count]) => sourceColorToToken[color] && count > 0)
    .map(([color, count]) => [sourceColorToToken[color], count]));
}

function buildSourcedCards() {
  const speciesNames = new Map(sourcedCards.map((card) => [card.speciesId, card.name]));
  const decks = [[], [], [], [], []];
  for (const card of sourcedCards) {
    const kind = card.kind === "normal" ? "stage" : card.kind;
    const convertedCard = {
      id: card.id,
      name: card.name,
      nameZh: card.nameZh,
      pokedexId: card.dexId,
      kind,
      classification: card.speciesId === "MEW" ? "mythical" : kind,
      tier: kind === "stage" ? card.stage : null,
      bonus: sourceColorToToken[card.bonus],
      bonusAmount: card.bonusAmount,
      masterCost: card.cost.master ?? 0,
      points: card.points,
      cost: remapSourceColors(card.cost),
      evolution: card.evolvesToSpeciesId ? {
        evolvesTo: speciesNames.get(card.evolvesToSpeciesId),
        requiredBonuses: remapSourceColors(card.evolveCost)
      } : null
    };
    const deckIndex = kind === "stage" ? card.stage - 1 : kind === "rare" ? 3 : 4;
    decks[deckIndex].push(convertedCard);
  }
  return decks;
}

function assertCardData(condition, message) {
  if (!condition) throw new Error(`Invalid Pokémon card catalog: ${message}`);
}

function sortedCostValues(card) {
  return Object.values(card.cost).sort((left, right) => right - left).join(",");
}

function validateCardCatalog(decks) {
  const expectedDeckSizes = [35, 30, 15, 5, 5];
  assertCardData(decks.length === expectedDeckSizes.length, "five decks are required");
  decks.forEach((deck, index) => assertCardData(
    deck.length === expectedDeckSizes[index],
    `deck ${index + 1} must contain ${expectedDeckSizes[index]} cards`
  ));

  const cards = decks.flat();
  assertCardData(new Set(cards.map((card) => card.id)).size === cards.length, "card IDs must be unique");
  for (const card of cards) {
    assertCardData(card.name && card.nameZh && Number.isInteger(card.pokedexId), `${card.id} needs valid species data`);
    assertCardData(["stage", "rare", "legendary"].includes(card.kind), `${card.id} has an invalid deck category`);
    assertCardData(gemTypes.includes(card.bonus), `${card.id} has an invalid bonus color`);
    assertCardData(Number.isInteger(card.points) && card.points >= 0, `${card.id} has invalid points`);
    assertCardData(Object.entries(card.cost).every(([type, count]) =>
      gemTypes.includes(type) && Number.isInteger(count) && count > 0), `${card.id} has an invalid capture cost`);

    if (card.kind === "stage") {
      assertCardData([1, 2, 3].includes(card.tier), `${card.id} has an invalid stage`);
      assertCardData(card.bonusAmount === 1 && card.masterCost === 0, `${card.id} must grant one standard bonus`);
      assertCardData(card.tier === 3 ? card.evolution === null : Boolean(card.evolution), `${card.id} has invalid evolution data`);
    } else {
      assertCardData(card.tier === null && card.evolution === null, `${card.id} cannot evolve`);
      assertCardData(card.bonusAmount === 2 && card.masterCost === 1, `${card.id} must require one Master Ball and grant two bonuses`);
      assertCardData(card.kind === "rare" ? card.points === 0 : card.points === 2, `${card.id} has invalid special-card points`);
    }
  }

  const stageCards = cards.filter((card) => card.kind === "stage");
  const stagePointCounts = [
    new Map([[0, 25], [1, 10]]),
    new Map([[1, 10], [2, 10], [3, 10]]),
    new Map([[3, 5], [4, 5], [5, 5]])
  ];
  for (const stage of [1, 2, 3]) {
    const cardsAtStage = stageCards.filter((card) => card.tier === stage);
    for (const [points, expected] of stagePointCounts[stage - 1]) {
      assertCardData(cardsAtStage.filter((card) => card.points === points).length === expected,
        `Stage ${stage} must contain ${expected} cards worth ${points} points`);
    }
  }

  for (const type of gemTypes) {
    assertCardData(stageCards.filter((card) => card.bonus === type).length === 16,
      `standard cards must contain 16 ${type} bonuses`);
    assertCardData(cards.filter((card) => card.kind !== "stage" && card.bonus === type).length === 2,
      `special cards must contain two ${type} bonuses`);
  }

  const speciesGroups = new Map();
  for (const card of stageCards) {
    const key = `${card.tier}:${card.name}`;
    if (!speciesGroups.has(key)) speciesGroups.set(key, []);
    speciesGroups.get(key).push(card);
  }
  const expectedPatterns = {
    "1:0:3": ["3", "2,2", "2,1"],
    "1:0:2": ["2,1,1", "1,1,1,1"],
    "1:1:2": ["4", "3,2"],
    "2:1:2": ["3,2,2", "3,2,2"],
    "2:2:2": ["5,2", "4,2,1"],
    "2:3:2": ["6", "4,4,1"],
    "3:3:1": ["5,2,2"],
    "3:4:1": ["6,4"],
    "3:5:1": ["7,3"]
  };
  for (const group of speciesGroups.values()) {
    const [first] = group;
    const patternKey = `${first.tier}:${first.points}:${group.length}`;
    assertCardData(expectedPatterns[patternKey] !== undefined, `${first.name} has an unexpected card pattern`);
    assertCardData(
      group.map(sortedCostValues).sort().join("|") === [...expectedPatterns[patternKey]].sort().join("|"),
      `${first.name} has an invalid capture-cost pattern`
    );
    assertCardData(group.every((card) => card.bonus === first.bonus
      && card.points === first.points
      && JSON.stringify(card.evolution) === JSON.stringify(first.evolution)),
    `${first.name} variants must share their printed bonus, points, and evolution requirement`);

    if (first.evolution) {
      const targets = stageCards.filter((card) => card.name === first.evolution.evolvesTo);
      const requirements = Object.values(first.evolution.requiredBonuses);
      assertCardData(targets.some((card) => card.tier === first.tier + 1), `${first.name} needs a target in the next Stage deck`);
      assertCardData(requirements.length === 1 && [2, 3, 4].includes(requirements[0]), `${first.name} has an invalid evolution requirement`);
    }
  }

  for (const card of cards.filter((candidate) => candidate.kind === "rare")) {
    assertCardData(sortedCostValues(card) === "3,2", `${card.name} must cost printed standard balls 3 + 2`);
  }
  for (const card of cards.filter((candidate) => candidate.kind === "legendary")) {
    assertCardData(sortedCostValues(card) === "3,3,3", `${card.name} must cost three groups of 3 standard balls`);
  }
}

const sourcedCatalog = buildSourcedCards();
validateCardCatalog(sourcedCatalog);
const cardCatalog = sourcedCatalog;

export function pokemonCatalog() {
  return cardCatalog.flat().map(({ id, name, nameZh, pokedexId, kind, classification, tier }) => ({
    id, name, nameZh, pokedexId, kind, classification, tier
  }));
}

function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function createPlayer({ id, key, name }) {
  return {
    id,
    key,
    name: name.trim().slice(0, 24),
    trainerCardId: null,
    tokens: emptyTokens(),
    bonuses: emptyBonuses(),
    cards: [],
    reserved: [],
    tucked: [],
    points: 0
  };
}

function resetPlayerProgress(player) {
  player.tokens = emptyTokens();
  player.bonuses = emptyBonuses();
  player.cards = [];
  player.reserved = [];
  player.tucked = [];
  player.points = 0;
}

export function createLobby(host) {
  return {
    status: "lobby",
    hostId: host.id,
    players: [createPlayer(host)],
    supply: emptyTokens(),
    decks: [[], [], [], [], []],
    deckCovers: [null, null, null, null, null],
    market: [[], [], [], [], []],
    turnIndex: 0,
    turnPhase: "action",
    pendingActionMessage: null,
    turnDurationSeconds: 0,
    silhouetteMode: false,
    caughtPokedexIds: [],
    turnStartedAt: null,
    winnerId: null,
    finalRoundTriggered: false,
    revision: 0,
    lastAction: "Room created"
  };
}

export function setTurnTimer(game, seconds) {
  if (game.status !== "lobby") throw new Error("The turn timer can only be changed in the lobby.");
  if (!Number.isInteger(seconds) || (seconds !== 0 && (seconds < minimumTurnSeconds || seconds > maximumTurnSeconds))) {
    throw new Error(`Choose 0 to disable the timer, or ${minimumTurnSeconds}–${maximumTurnSeconds} seconds.`);
  }
  game.turnDurationSeconds = seconds;
  game.revision += 1;
}

export function setSilhouetteMode(game, enabled) {
  if (game.status !== "lobby") throw new Error("Mystery silhouettes can only be changed in the lobby.");
  if (typeof enabled !== "boolean") throw new Error("Choose whether mystery silhouettes are enabled.");
  game.silhouetteMode = enabled;
  game.revision += 1;
}

export function chooseTrainerCard(game, playerId, trainerCardId) {
  if (game.status !== "lobby") throw new Error("Trainer cards can only be changed in the lobby.");
  if (!trainerCardIds.includes(trainerCardId)) throw new Error("Choose a valid Trainer card.");
  const player = game.players.find((candidate) => candidate.id === playerId);
  if (!player) throw new Error("Player not found.");
  const owner = game.players.find((candidate) => candidate.id !== playerId && candidate.trainerCardId === trainerCardId);
  if (owner) throw new Error("That Trainer card has already been chosen.");
  player.trainerCardId = trainerCardId;
  game.revision += 1;
  game.lastAction = `${player.name} chose the ${trainerCardId} Trainer card`;
}

export function addPlayer(game, player) {
  if (game.status !== "lobby") throw new Error("This game has already started.");
  if (game.players.length >= 4) throw new Error("This room is full.");
  if (!player.name?.trim()) throw new Error("Enter a player name.");
  game.players.push(createPlayer(player));
  game.revision += 1;
  game.lastAction = `${player.name.trim().slice(0, 24)} joined the room`;
}

function returnPlayerTokens(game, player) {
  for (const type of allTokenTypes) {
    game.supply[type] += player.tokens[type];
  }
}

function resetGameToLobby(game, message) {
  for (const player of game.players) resetPlayerProgress(player);
  game.status = "lobby";
  game.supply = emptyTokens();
  game.decks = [[], [], [], [], []];
  game.deckCovers = [null, null, null, null, null];
  game.market = [[], [], [], [], []];
  game.turnIndex = 0;
  game.turnPhase = "action";
  game.pendingActionMessage = null;
  game.caughtPokedexIds = [];
  game.turnStartedAt = null;
  game.winnerId = null;
  game.finalRoundTriggered = false;
  game.lastAction = message;
}

export function endGame(game, playerId) {
  if (playerId !== game.hostId) throw new Error("Only the room host can end the game.");
  if (game.status === "lobby") throw new Error("The game has not started yet.");
  resetGameToLobby(game, "Game ended by host");
  game.revision += 1;
}

export function removePlayer(game, playerId) {
  const playerIndex = game.players.findIndex((player) => player.id === playerId);
  if (playerIndex === -1) throw new Error("Player not found.");
  if (playerId === game.hostId) throw new Error("The room host must disband the room.");

  const departingPlayer = game.players[playerIndex];
  const wasCurrentPlayer = game.status === "playing" && playerIndex === game.turnIndex;
  if (game.status === "playing") returnPlayerTokens(game, departingPlayer);
  game.players.splice(playerIndex, 1);

  if (game.status !== "lobby" && game.players.length < 2) {
    resetGameToLobby(game, `${departingPlayer.name} left the room`);
  } else if (game.status === "playing") {
    if (playerIndex < game.turnIndex) game.turnIndex -= 1;
    else if (wasCurrentPlayer) game.turnIndex %= game.players.length;

    if (wasCurrentPlayer) {
      game.turnPhase = "action";
      game.pendingActionMessage = null;
      game.turnStartedAt = game.turnDurationSeconds > 0 ? Date.now() : null;
      if (game.finalRoundTriggered && game.turnIndex === 0) {
        const winner = winnerForGame(game);
        game.status = "finished";
        game.winnerId = winner.id;
        game.turnStartedAt = null;
        game.lastAction = `${winner.name} wins with ${winner.points} points!`;
      } else {
        game.lastAction = `${departingPlayer.name} left the room`;
      }
    } else {
      game.lastAction = `${departingPlayer.name} left the room`;
    }
  } else if (game.status === "finished") {
    const winner = winnerForGame(game);
    game.winnerId = winner.id;
    game.lastAction = `${departingPlayer.name} left the room`;
  } else {
    game.lastAction = `${departingPlayer.name} left the room`;
  }

  game.revision += 1;
}

function refreshDeckCover(game, tierIndex, random = Math.random) {
  const previousPokedexId = game.deckCovers[tierIndex];
  const differentSpecies = game.decks[tierIndex].filter((card) => card.pokedexId !== previousPokedexId);
  const candidates = differentSpecies.length > 0 ? differentSpecies : game.decks[tierIndex];
  game.deckCovers[tierIndex] = candidates.length > 0
    ? candidates[Math.floor(random() * candidates.length)].pokedexId
    : null;
}

function drawMarketCard(game, tierIndex, random = Math.random, cardIndex = null) {
  const nextCard = game.decks[tierIndex].pop();
  if (nextCard) {
    if (Number.isInteger(cardIndex)) game.market[tierIndex].splice(cardIndex, 0, nextCard);
    else game.market[tierIndex].push(nextCard);
  }
  refreshDeckCover(game, tierIndex, random);
}

export function startGame(game, random = Math.random, restart = false) {
  if (game.status !== "lobby" && !(restart && game.status === "finished")) throw new Error("This game has already started.");
  if (game.players.length < 2) throw new Error("At least two players are required.");
  if (game.players.some((player) => !player.trainerCardId)) throw new Error("Every player must choose a Trainer card.");

  game.players.sort((left, right) =>
    trainerCardIds.indexOf(left.trainerCardId) - trainerCardIds.indexOf(right.trainerCardId)
  );
  const tokenCount = game.players.length === 2 ? 4 : game.players.length === 3 ? 5 : 7;
  for (const player of game.players) resetPlayerProgress(player);
  game.supply = Object.fromEntries([
    ...gemTypes.map((type) => [type, tokenCount]),
    ["master", 5]
  ]);
  game.caughtPokedexIds = [];
  game.decks = cardCatalog.map((deck) => shuffle(deck, random));
  game.deckCovers = [null, null, null, null, null];
  game.market = [[], [], [], [], []];
  const marketSizes = [4, 4, 4, 1, 1];
  for (let deckIndex = 0; deckIndex < marketSizes.length; deckIndex += 1) {
    for (let cardIndex = 0; cardIndex < marketSizes[deckIndex]; cardIndex += 1) drawMarketCard(game, deckIndex, random);
  }
  game.status = "playing";
  game.turnIndex = 0;
  game.turnPhase = "action";
  game.pendingActionMessage = null;
  game.winnerId = null;
  game.finalRoundTriggered = false;
  game.turnStartedAt = game.turnDurationSeconds > 0 ? Date.now() : null;
  game.revision += 1;
  game.lastAction = `${game.players[0].name} takes the first turn`;
}

function totalTokens(player) {
  return allTokenTypes.reduce((total, type) => total + player.tokens[type], 0);
}

function currentPlayer(game, playerId) {
  if (game.status !== "playing") throw new Error("The game is not currently active.");
  const player = game.players[game.turnIndex];
  if (player.id !== playerId) throw new Error("Wait for your turn.");
  return player;
}

function winnerForGame(game) {
  return [...game.players].sort((left, right) =>
    right.points - left.points
    || right.tucked.length - left.tucked.length
    || right.cards.length - left.cards.length
    || game.players.indexOf(left) - game.players.indexOf(right)
  )[0];
}

function completeTurn(game, message) {
  game.lastAction = message;
  game.pendingActionMessage = null;
  game.turnPhase = "action";
  if (!game.finalRoundTriggered && game.players.some((player) => player.points >= targetScore)) {
    game.finalRoundTriggered = true;
  }
  const nextTurnIndex = (game.turnIndex + 1) % game.players.length;
  game.turnIndex = nextTurnIndex;
  if (game.finalRoundTriggered && nextTurnIndex === 0) {
    const winner = winnerForGame(game);
    game.status = "finished";
    game.winnerId = winner.id;
    game.turnStartedAt = null;
    game.lastAction = `${winner.name} wins with ${winner.points} points!`;
    game.revision += 1;
    return;
  }
  game.turnStartedAt = game.turnDurationSeconds > 0 ? Date.now() : null;
  game.revision += 1;
}

function evolutionOptions(game, player) {
  const targets = [...game.market.flat(), ...player.reserved];
  return targets.flatMap((target) => player.cards
    .filter((source) => source.evolution?.evolvesTo === target.name)
    .filter((source) => Object.entries(source.evolution.requiredBonuses)
      .every(([type, required]) => player.bonuses[type] >= required))
    .map((source) => ({ source, target })));
}

function finishMainAction(game, player, message) {
  game.lastAction = message;
  game.pendingActionMessage = message;
  if (totalTokens(player) > 10) {
    game.turnPhase = "discard";
    game.revision += 1;
    return;
  }
  if (evolutionOptions(game, player).length > 0) {
    game.turnPhase = "evolve";
    game.revision += 1;
    return;
  }
  completeTurn(game, message);
}

function autoReturnExcessTokens(game, player) {
  let excess = Math.max(0, totalTokens(player) - 10);
  for (const type of [...allTokenTypes].reverse()) {
    const count = Math.min(excess, player.tokens[type]);
    player.tokens[type] -= count;
    game.supply[type] += count;
    excess -= count;
  }
}

export function advanceExpiredTurns(game, now = Date.now()) {
  if (game.status !== "playing" || game.turnDurationSeconds <= 0 || !Number.isFinite(game.turnStartedAt)) return false;
  const durationMilliseconds = game.turnDurationSeconds * 1000;
  const originalTurnStartedAt = game.turnStartedAt;
  const expiredTurns = Math.floor((now - game.turnStartedAt) / durationMilliseconds);
  if (expiredTurns < 1) return false;

  for (let index = 0; index < expiredTurns && game.status === "playing"; index += 1) {
    const player = game.players[game.turnIndex];
    autoReturnExcessTokens(game, player);
    completeTurn(game, `${player.name}'s turn timed out`);
  }
  if (game.status === "playing") game.turnStartedAt = originalTurnStartedAt + expiredTurns * durationMilliseconds;
  return true;
}

function takeTokens(game, player, selectedTypes) {
  if (!Array.isArray(selectedTypes)) throw new Error("Choose tokens to take.");
  if (!selectedTypes.every((type) => gemTypes.includes(type))) throw new Error("Master Ball tokens cannot be taken directly.");

  const uniqueTypes = new Set(selectedTypes);
  const takesPair = selectedTypes.length === 2 && uniqueTypes.size === 1;
  const availableTypes = gemTypes.filter((type) => game.supply[type] > 0).length;
  const differentTokenCount = Math.min(3, availableTypes);
  const takesDifferent = differentTokenCount > 0 && selectedTypes.length === differentTokenCount && uniqueTypes.size === differentTokenCount;
  if (!takesPair && !takesDifferent) throw new Error(`Take two matching tokens or ${differentTokenCount} different available tokens.`);

  if (takesPair) {
    const [type] = selectedTypes;
    if (game.supply[type] < 4) throw new Error(`At least four ${type} tokens must remain before taking a pair.`);
  } else {
    for (const type of selectedTypes) {
      if (game.supply[type] < 1) throw new Error(`No ${type} tokens remain.`);
    }
  }

  for (const type of selectedTypes) {
    game.supply[type] -= 1;
    player.tokens[type] += 1;
  }
  finishMainAction(game, player, `${player.name} took ${selectedTypes.join(", ")} tokens`);
}

function findMarketCard(game, cardId) {
  for (let tierIndex = 0; tierIndex < game.market.length; tierIndex += 1) {
    const cardIndex = game.market[tierIndex].findIndex((card) => card.id === cardId);
    if (cardIndex !== -1) return { tierIndex, cardIndex, card: game.market[tierIndex][cardIndex] };
  }
  return null;
}

function recordCaughtPokemon(game, card) {
  game.caughtPokedexIds ??= [];
  if (!game.caughtPokedexIds.includes(card.pokedexId)) game.caughtPokedexIds.push(card.pokedexId);
}

function reserveCard(game, player, cardId) {
  if (player.reserved.length >= 3) throw new Error("You may reserve at most three cards.");
  const location = findMarketCard(game, cardId);
  if (!location) throw new Error("That card is no longer in the market.");
  if (location.card.kind !== "stage") throw new Error("Rare and Legendary Pokémon cannot be reserved.");

  game.market[location.tierIndex].splice(location.cardIndex, 1);
  player.reserved.push(location.card);
  drawMarketCard(game, location.tierIndex, Math.random, location.cardIndex);
  if (game.supply.master > 0) {
    game.supply.master -= 1;
    player.tokens.master += 1;
  }
  finishMainAction(game, player, `${player.name} reserved a Pokémon`);
}

function reserveTopCard(game, player, tierIndex) {
  if (player.reserved.length >= 3) throw new Error("You may reserve at most three cards.");
  if (!Number.isInteger(tierIndex) || tierIndex < 0 || tierIndex > 2) throw new Error("Choose a Stage 1–3 deck.");
  const card = game.decks[tierIndex].pop();
  if (!card) throw new Error("That Stage deck is empty.");
  refreshDeckCover(game, tierIndex);
  player.reserved.push(card);
  if (game.supply.master > 0) {
    game.supply.master -= 1;
    player.tokens.master += 1;
  }
  finishMainAction(game, player, `${player.name} reserved a hidden Pokémon`);
}

export function paymentForCard(player, card) {
  const payment = emptyTokens();
  let masterNeeded = card.masterCost ?? 0;
  for (const type of gemTypes) {
    const required = Math.max(0, (card.cost[type] ?? 0) - player.bonuses[type]);
    const coloredPayment = Math.min(required, player.tokens[type]);
    payment[type] = coloredPayment;
    masterNeeded += required - coloredPayment;
  }
  payment.master = masterNeeded;
  return masterNeeded <= player.tokens.master ? payment : null;
}

function buyCard(game, player, cardId) {
  const marketLocation = findMarketCard(game, cardId);
  const reservedIndex = player.reserved.findIndex((card) => card.id === cardId);
  const card = marketLocation?.card ?? player.reserved[reservedIndex];
  if (!card) throw new Error("That card is not available to you.");

  const payment = paymentForCard(player, card);
  if (!payment) throw new Error("You do not have enough tokens to recruit that Pokémon.");

  for (const type of allTokenTypes) {
    player.tokens[type] -= payment[type];
    game.supply[type] += payment[type];
  }
  if (marketLocation) {
    game.market[marketLocation.tierIndex].splice(marketLocation.cardIndex, 1);
    drawMarketCard(game, marketLocation.tierIndex, Math.random, marketLocation.cardIndex);
  } else {
    player.reserved.splice(reservedIndex, 1);
  }
  player.cards.push(card);
  recordCaughtPokemon(game, card);
  player.bonuses[card.bonus] += card.bonusAmount ?? 1;
  player.points += card.points;

  finishMainAction(game, player, `${player.name} recruited ${card.name}`);
}

function returnTokens(game, player, returnedTokens) {
  if (game.turnPhase !== "discard") throw new Error("You do not need to return any Poké Balls.");
  if (!returnedTokens || typeof returnedTokens !== "object" || Array.isArray(returnedTokens)) throw new Error("Choose Poké Balls to return.");
  const excess = totalTokens(player) - 10;
  let returnedCount = 0;
  for (const [type, count] of Object.entries(returnedTokens)) {
    if (!allTokenTypes.includes(type) || !Number.isInteger(count) || count < 0 || count > player.tokens[type]) {
      throw new Error("Choose valid Poké Balls from your supply.");
    }
    returnedCount += count;
  }
  if (returnedCount !== excess) throw new Error(`Return exactly ${excess} Poké Ball${excess === 1 ? "" : "s"}.`);
  for (const type of allTokenTypes) {
    const count = returnedTokens[type] ?? 0;
    player.tokens[type] -= count;
    game.supply[type] += count;
  }
  if (evolutionOptions(game, player).length > 0) {
    game.turnPhase = "evolve";
    game.revision += 1;
    return;
  }
  completeTurn(game, game.pendingActionMessage);
}

function evolveCard(game, player, targetCardId, sourceCardId) {
  if (game.turnPhase !== "evolve") throw new Error("Evolution is only available after your main action.");
  const option = evolutionOptions(game, player).find(({ source, target }) =>
    target.id === targetCardId && (!sourceCardId || source.id === sourceCardId));
  if (!option) throw new Error("That Pokémon cannot evolve with your current bonuses.");
  const { source, target } = option;
  const sourceIndex = player.cards.findIndex((card) => card.id === source.id);
  const marketLocation = findMarketCard(game, target.id);
  const reservedIndex = player.reserved.findIndex((card) => card.id === target.id);
  if (marketLocation) {
    game.market[marketLocation.tierIndex].splice(marketLocation.cardIndex, 1);
    drawMarketCard(game, marketLocation.tierIndex, Math.random, marketLocation.cardIndex);
  } else if (reservedIndex !== -1) {
    player.reserved.splice(reservedIndex, 1);
  } else {
    throw new Error("That evolution is no longer available.");
  }
  player.cards.splice(sourceIndex, 1, target);
  recordCaughtPokemon(game, target);
  player.tucked.push(source);
  player.bonuses[source.bonus] -= source.bonusAmount ?? 1;
  player.bonuses[target.bonus] += target.bonusAmount ?? 1;
  player.points += target.points - source.points;
  completeTurn(game, `${player.name} evolved ${source.name} into ${target.name}`);
}

export function restartFinishedGame(game, playerId, random = Math.random) {
  if (game.status !== "finished") throw new Error("The game has not finished yet.");
  if (playerId !== game.hostId) throw new Error("Only the room host can choose what happens next.");
  return startGame(game, random, true);
}

export function performAction(game, playerId, action) {
  advanceExpiredTurns(game);
  const player = currentPlayer(game, playerId);
  if (!action || typeof action.type !== "string") throw new Error("Choose an action.");

  if (action.type === "returnTokens") return returnTokens(game, player, action.tokens);
  if (action.type === "evolveCard") return evolveCard(game, player, action.cardId, action.sourceCardId);
  if (action.type === "skipEvolution") {
    if (game.turnPhase !== "evolve") throw new Error("There is no evolution to skip.");
    return completeTurn(game, game.pendingActionMessage);
  }
  if (game.turnPhase !== "action") throw new Error("Finish the current end-of-turn step first.");
  if (action.type === "takeTokens") return takeTokens(game, player, action.tokens);
  if (action.type === "reserveCard") return reserveCard(game, player, action.cardId);
  if (action.type === "reserveTopCard") return reserveTopCard(game, player, action.tierIndex);
  if (action.type === "buyCard") return buyCard(game, player, action.cardId);
  throw new Error("Unknown game action.");
}

export function publicGame(game, viewerId = null) {
  return {
    ...game,
    serverNow: Date.now(),
    players: game.players.map(({ key, ...player }) => ({
      ...player,
      reservedCount: player.reserved.length,
      reserved: player.id === viewerId ? player.reserved : [],
      tuckedCount: player.tucked.length,
      tucked: player.id === viewerId ? player.tucked : []
    })),
    decks: game.decks.map((deck, index) => ({
      remaining: deck.length,
      coverPokedexId: game.deckCovers[index]
    }))
  };
}
