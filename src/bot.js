import { allTokenTypes, gemTypes, paymentForCard } from "./game.js";

function tokenTotal(tokens) {
  return allTokenTypes.reduce((total, type) => total + (tokens[type] ?? 0), 0);
}

function evolutionOptions(game, player) {
  return [...game.market.flat(), ...player.reserved].flatMap((target) => player.cards
    .filter((source) => source.evolution?.evolvesTo === target.name)
    .filter((source) => Object.entries(source.evolution.requiredBonuses)
      .every(([type, required]) => player.bonuses[type] >= required))
    .map((source) => ({ source, target })));
}

function coloredDeficits(player, card) {
  return Object.fromEntries(gemTypes.map((type) => [
    type,
    Math.max(0, (card.cost[type] ?? 0) - player.bonuses[type] - player.tokens[type])
  ]));
}

function missingTokenCount(player, card) {
  const coloredMissing = Object.values(coloredDeficits(player, card)).reduce((total, count) => total + count, 0);
  return Math.max(0, coloredMissing + (card.masterCost ?? 0) - player.tokens.master);
}

function bonusDemand(game, player) {
  const demand = Object.fromEntries(gemTypes.map((type) => [type, 0]));
  for (const card of [...game.market.flat(), ...player.reserved]) {
    for (const type of gemTypes) {
      demand[type] += Math.max(0, (card.cost[type] ?? 0) - player.bonuses[type]);
    }
  }
  return demand;
}

function cardScore(game, player, card) {
  const demand = bonusDemand(game, player);
  const evolutionTarget = player.cards.some((source) => source.evolution?.evolvesTo === card.name);
  return card.points * 14
    + (card.bonusAmount ?? 1) * 4
    + (card.tier ?? 3)
    + Math.min(8, demand[card.bonus] ?? 0) * 0.7
    + (evolutionTarget ? 18 : 0)
    - missingTokenCount(player, card) * 2;
}

function bestByScore(items, score) {
  return [...items].sort((left, right) => score(right) - score(left) || left.id.localeCompare(right.id))[0] ?? null;
}

function chooseEvolution(game, player) {
  const options = evolutionOptions(game, player);
  if (!options.length) return { type: "skipEvolution" };
  const best = [...options].sort((left, right) => {
    const leftValue = (left.target.points - left.source.points) * 12 + (left.target.bonusAmount ?? 1) * 3;
    const rightValue = (right.target.points - right.source.points) * 12 + (right.target.bonusAmount ?? 1) * 3;
    return rightValue - leftValue || left.target.id.localeCompare(right.target.id);
  })[0];
  return { type: "evolveCard", cardId: best.target.id, sourceCardId: best.source.id };
}

function chooseReturnedTokens(game, player) {
  let excess = tokenTotal(player.tokens) - 10;
  const returned = {};
  const demand = bonusDemand(game, player);
  const types = [...gemTypes, "master"].sort((left, right) => {
    const leftValue = left === "master" ? Number.POSITIVE_INFINITY : demand[left];
    const rightValue = right === "master" ? Number.POSITIVE_INFINITY : demand[right];
    return leftValue - rightValue || left.localeCompare(right);
  });
  for (const type of types) {
    if (excess <= 0) break;
    const count = Math.min(excess, player.tokens[type]);
    if (count > 0) returned[type] = count;
    excess -= count;
  }
  return { type: "returnTokens", tokens: returned };
}

function chooseTokens(game, player) {
  const candidates = [...game.market.flat(), ...player.reserved];
  const target = bestByScore(candidates, (card) => cardScore(game, player, card) - missingTokenCount(player, card) * 4);
  const deficits = target ? coloredDeficits(player, target) : Object.fromEntries(gemTypes.map((type) => [type, 0]));
  const demand = bonusDemand(game, player);
  const available = gemTypes.filter((type) => game.supply[type] > 0)
    .sort((left, right) => deficits[right] - deficits[left] || demand[right] - demand[left] || left.localeCompare(right));
  const pairType = available.find((type) => game.supply[type] >= 4 && deficits[type] >= 2);
  if (pairType) return { type: "takeTokens", tokens: [pairType, pairType] };
  const count = Math.min(3, available.length);
  return count > 0 ? { type: "takeTokens", tokens: available.slice(0, count) } : null;
}

function chooseMainAction(game, player) {
  const eligibleEvolutionTargetIds = new Set(evolutionOptions(game, player).map(({ target }) => target.id));
  const availableCards = [...game.market.flat(), ...player.reserved];
  const affordable = availableCards.filter((card) => paymentForCard(player, card) && !eligibleEvolutionTargetIds.has(card.id));
  const catchTarget = bestByScore(affordable, (card) => cardScore(game, player, card));
  if (catchTarget) return { type: "buyCard", cardId: catchTarget.id };

  const reservable = player.reserved.length < 3
    ? game.market.flat().filter((card) => card.kind === "stage")
    : [];
  const reserveTarget = bestByScore(reservable, (card) => cardScore(game, player, card));
  const isEvolutionTarget = reserveTarget
    && player.cards.some((source) => source.evolution?.evolvesTo === reserveTarget.name);
  const shouldProtectHighValueCard = reserveTarget && tokenTotal(player.tokens) >= 8 && reserveTarget.points >= 3;
  if (reserveTarget && (isEvolutionTarget || shouldProtectHighValueCard)) {
    return { type: "reserveCard", cardId: reserveTarget.id };
  }

  const tokenAction = chooseTokens(game, player);
  if (tokenAction) return tokenAction;
  if (reserveTarget) return { type: "reserveCard", cardId: reserveTarget.id };
  const deckIndex = game.decks.findIndex((deck, index) => index < 3 && deck.length > 0);
  if (player.reserved.length < 3 && deckIndex >= 0) return { type: "reserveTopCard", tierIndex: deckIndex };
  return null;
}

export function chooseNormalBotAction(game) {
  if (game.status !== "playing") return null;
  const player = game.players[game.turnIndex];
  if (!player?.isBot) return null;
  if (game.turnPhase === "discard") return chooseReturnedTokens(game, player);
  if (game.turnPhase === "evolve") return chooseEvolution(game, player);
  return chooseMainAction(game, player);
}
