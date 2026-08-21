import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("every referenced interface element is registered and present in the HTML", async () => {
  const [appSource, html] = await Promise.all([
    readFile(new URL("../public/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/index.html", import.meta.url), "utf8")
  ]);
  const registrySource = appSource.match(/const elements = Object\.fromEntries\(\[([\s\S]*?)\]\.map/);
  assert.ok(registrySource, "The interface element registry should be present.");

  const referenced = new Set([...appSource.matchAll(/elements\.([A-Za-z0-9_]+)/g)].map((match) => match[1]));
  const registered = new Set([...registrySource[1].matchAll(/"([A-Za-z0-9_]+)"/g)].map((match) => match[1]));
  const htmlIds = new Set([...html.matchAll(/id="([^"]+)"/g)].map((match) => match[1]));

  assert.deepEqual([...referenced].filter((id) => !registered.has(id)), []);
  assert.deepEqual([...registered].filter((id) => !htmlIds.has(id)), []);
});

test("caught cards expose hover details and opponent reservations stay masked", async () => {
  const [appSource, styles] = await Promise.all([
    readFile(new URL("../public/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/styles.css", import.meta.url), "utf8")
  ]);

  assert.match(appSource, /data-details-id/);
  assert.match(appSource, /data-reserved-id/);
  assert.match(appSource, /collectionDetailsMarkup/);
  assert.match(appSource, /evolutionRequirement/);
  assert.match(appSource, /aria-disabled/);
  assert.match(appSource, /player\.reservedCount/);
  assert.match(appSource, /privateCards/);
  assert.match(styles, /\.collection-hover-card/);
});

test("landing page starts with Pikachu and grows an interactive caught-Pokémon background", async () => {
  const [appSource, html, styles] = await Promise.all([
    readFile(new URL("../public/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/index.html", import.meta.url), "utf8"),
    readFile(new URL("../public/styles.css", import.meta.url), "utf8")
  ]);

  assert.match(html, /id="heroPokemonCollection"/);
  assert.match(html, /id="heroMascot"/);
  assert.doesNotMatch(html, /class="hero-pokemon"/);
  assert.match(appSource, /name: "Pikachu", nameZh: "皮卡丘", pokedexId: 25/);
  assert.match(appSource, /caughtPokemon\.has\(card\.pokedexId\)/);
  assert.match(appSource, /return \[pikachu, \.\.\.collected\];/);
  assert.doesNotMatch(appSource, /collected\.slice\(/);
  assert.match(appSource, /function landingPokemonLayout\(index, count\)/);
  assert.match(appSource, /const goldenAngle = Math\.PI \* \(3 - Math\.sqrt\(5\)\)/);
  assert.match(appSource, /const y = 82 \+ Math\.sin\(angle\) \* radius \* 12/);
  assert.doesNotMatch(appSource, /const columns = Math\.ceil/);
  assert.match(appSource, /mascot \? "landing-mascot"/);
  assert.match(appSource, /const initialSprite = pokemonAnimatedSpriteUrl\(card\.pokedexId\)/);
  assert.match(appSource, /class="landing-pokemon /);
  assert.match(appSource, /class="pokedex-pokemon-preview"/);
  assert.match(appSource, /playPokemonPreview\(button\)/);
  assert.match(styles, /\.hero-pokemon-collection/);
  assert.match(styles, /\.hero-heading \{ display: flex;/);
  assert.match(styles, /\.hero-mascot \.landing-pokemon/);
  assert.match(styles, /\.hero-pokemon-showcase \{ position: absolute;/);
  assert.match(styles, /\.landing-pokemon \{[^}]*position: absolute;[^}]*border: 0;[^}]*background: transparent;/);
  assert.match(styles, /\.landing-pokemon\.preview-playing img/);
  assert.match(styles, /\.pokedex-pokemon-preview\.preview-playing img/);
});

test("header provides persistent local WAV BGM with a music-only toggle", async () => {
  const [appSource, html, styles, serverSource] = await Promise.all([
    readFile(new URL("../public/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/index.html", import.meta.url), "utf8"),
    readFile(new URL("../public/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../server.js", import.meta.url), "utf8")
  ]);

  assert.match(html, /id="bgmSelect"/);
  assert.match(html, /id="soundButton"/);
  assert.match(appSource, /<optgroup label=/);
  assert.doesNotMatch(appSource, /const bgmTracks/);
  assert.doesNotMatch(appSource, /townBgmLocations/);
  assert.doesNotMatch(appSource, /AudioContext/);
  assert.match(appSource, /pokemon-splendor-bgm/);
  assert.match(appSource, /pokemon-splendor-bgm-enabled/);
  assert.match(appSource, /async function loadMusicCatalog\(\)/);
  assert.match(appSource, /api\("\/api\/music"\)/);
  assert.match(appSource, /new Audio\(localTrack\.url\)/);
  assert.match(appSource, /activeBgmAudio\.loop = true/);
  assert.match(appSource, /bgmLocal/);
  assert.match(appSource, /elements\.bgmSelect\.disabled = !localBgmTracks\.length/);
  assert.match(appSource, /elements\.bgmSelect\.addEventListener\("change"/);
  assert.match(appSource, /elements\.soundButton\.addEventListener\("click"/);
  assert.match(appSource, /if \(!bgmEnabled\) return;/);
  const cryFunction = appSource.match(/function playPokemonCry[\s\S]*?\n}\n\nfunction playNextGameAnimation/);
  assert.ok(cryFunction);
  assert.doesNotMatch(cryFunction[0], /bgmEnabled/);
  assert.match(serverSource, /url\.pathname === "\/api\/music"/);
  assert.match(serverSource, /endsWith\("\.wav"\)/);
  assert.match(serverSource, /"\.wav": "audio\/wav"/);
  assert.match(styles, /\.music-nav-control select/);
  assert.match(styles, /\.sound-button\[aria-pressed="true"\]/);
});

test("lobby exposes a synchronized optional turn timer", async () => {
  const [appSource, html] = await Promise.all([
    readFile(new URL("../public/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/index.html", import.meta.url), "utf8")
  ]);

  assert.match(html, /id="timerEnabled"/);
  assert.match(html, /id="timerSeconds"/);
  assert.match(html, /id="turnTimer"/);
  assert.match(html, /class="bank-game-status"/);
  assert.doesNotMatch(html, /<div class="game-status">/);
  assert.match(appSource, /updateLobbyOption\("timer"/);
  assert.match(appSource, /renderTurnTimer/);
});

test("room exit controls confirm guest leave and host disband actions", async () => {
  const [appSource, html, styles, serverSource] = await Promise.all([
    readFile(new URL("../public/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/index.html", import.meta.url), "utf8"),
    readFile(new URL("../public/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../server.js", import.meta.url), "utf8")
  ]);

  assert.match(html, /id="exitRoomButton"/);
  assert.match(html, /id="endGameButton"/);
  assert.match(html, /id="exitRoomDialog"/);
  assert.match(html, /id="confirmExitRoom"/);
  assert.match(appSource, /disbandRoomMessage/);
  assert.match(appSource, /openRoomActionDialog\("end"\)/);
  assert.match(appSource, /session\?\.playerId === game\?\.hostId \? "disband" : "leave"/);
  assert.match(appSource, /clearSession\(\)/);
  assert.match(styles, /\.confirmation-dialog/);
  assert.match(styles, /\.danger-button/);
  assert.match(serverSource, /finish\|end\|leave\|disband/);
  assert.match(serverSource, /endGame\(room\.game, player\.id\)/);
  assert.match(serverSource, /removePlayer\(room\.game, player\.id\)/);
  assert.match(serverSource, /rooms\.delete\(code\.toUpperCase\(\)\)/);
});

test("game UI exposes cleanup, evolution, hidden reservation, and play-again control", async () => {
  const [appSource, html, styles] = await Promise.all([
    readFile(new URL("../public/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/index.html", import.meta.url), "utf8"),
    readFile(new URL("../public/styles.css", import.meta.url), "utf8")
  ]);

  assert.match(appSource, /returnTokens/);
  assert.match(appSource, /evolveCard/);
  assert.match(appSource, /reserveTopCard/);
  assert.match(html, /id="restartGame"/);
  assert.match(html, /id="gameAnimation"/);
  assert.match(html, /rel="icon" type="image\/png" href="\/assets\/balls\/poke-ball\.png"/);
  assert.doesNotMatch(html, /id="continueGame"/);
  assert.match(appSource, /coverPokedexId/);
  assert.match(appSource, /grass-layer grass-front/);
  assert.match(appSource, /class="card-footer"/);
  assert.match(appSource, /data-card-id="\$\{card\.id\}"/);
  assert.match(appSource, /class="card-details"/);
  assert.match(appSource, /trainerPixelSpriteUrl\("red-gen3"\)/);
  assert.match(appSource, /trainerPixelSpriteUrl\("brock-gen3"\)/);
  assert.match(appSource, /trainerPixelSpriteUrl\("misty-gen3"\)/);
  assert.match(appSource, /trainerPixelSpriteUrl\("giovanni-gen3"\)/);
  assert.match(appSource, /giovanniTrainer: "Giovanni & Persian"/);
  assert.match(appSource, /redTrainer: "Red & Pikachu"/);
  assert.match(appSource, /data-trainer-sprite/);
  assert.match(appSource, /class="trainer-partner-art"/);
  assert.match(appSource, /pokemonAnimatedSpriteUrl\(trainerCard\.pokedexId\)/);
  assert.match(styles, /\.trainer-choice \{[^}]*border: 0;[^}]*background: transparent;/);
  assert.match(styles, /\.trainer-choice-art \{[^}]*overflow: hidden;/);
  assert.match(styles, /\.trainer-main-art \{[^}]*width: auto;[^}]*height: 100%;/);
  assert.match(styles, /\.lobby-card \{ width: min\(1120px, 100%\);/);
  assert.match(appSource, /welcome-active/);
  assert.match(styles, /body\.welcome-active \{ overflow: hidden; \}/);
  assert.match(styles, /\.deck-cover-art/);
  assert.match(styles, /\.deck-cover-art \{[^}]*border: 0;[^}]*background: transparent;[^}]*box-shadow: none;/);
  assert.doesNotMatch(appSource, /<b>\?<\/b>/);
  assert.match(styles, /\.grass-layer/);
  assert.match(html, /id="silhouetteEnabled"/);
  assert.match(appSource, /updateLobbyOption\("silhouette"/);
  assert.match(styles, /\.mystery-silhouette/);
  assert.match(appSource, /unknownPokemon/);
  assert.match(appSource, /caughtPokedexIds/);
  assert.match(appSource, /pokemonDisplayName/);
  assert.match(appSource, /data-pokemon-preview/);
  assert.match(appSource, /PokeAPI\/sprites/);
  assert.match(appSource, /PokeAPI\/cries/);
  assert.match(appSource, /pokemonPixelSpriteUrl/);
  assert.match(appSource, /pokemonAnimatedSpriteUrl/);
  assert.match(appSource, /data-pokemon-sprite/);
  assert.match(appSource, /installImageFallbacks/);
  assert.match(styles, /img\[data-pokemon-sprite\], img\[data-trainer-sprite\] \{ image-rendering: pixelated; \}/);
  assert.match(styles, /@keyframes trainer-pixel-idle/);
  assert.match(styles, /@keyframes trainer-partner-idle/);
  assert.match(appSource, /previewPokemon/);
  assert.match(appSource, /pokemon-nameplate/);
  assert.match(appSource, /card\.points > 0 \? `<strong class="card-points">/);
  assert.match(appSource, /card\.points > 0 \? `<span class="collection-points">/);
  assert.match(appSource, /evolutionCardMarkup/);
  assert.match(appSource, /Array\.from\(\{ length: required \}/);
  assert.match(styles, /\.evolution-card-rule/);
  assert.match(styles, /\.evolution-card-rule \{[^}]*flex-direction: column;[^}]*right: 16px;/);
  assert.doesNotMatch(appSource, /preview-hint/);
  assert.match(styles, /\.pokemon-art\.preview-playing/);
  assert.match(styles, /height: clamp\(84px, 12\.5vh, 130px\)/);
  assert.match(styles, /\.card-footer \{ position: absolute;[^}]*background: transparent;[^}]*pointer-events: none;/);
  assert.match(styles, /\.cost-list \{[^}]*flex-direction: column;/);
  assert.match(styles, /\.cost-token img \{ width: 21px; height: 21px;/);
  assert.match(styles, /\.card-actions button \{ min-height: 32px;/);
  assert.match(styles, /\.cost-token img \{ width: 18px; height: 18px; \}/);
  assert.match(styles, /\.card-actions button \{ min-height: 22px;/);
  assert.match(styles, /\.card-points \{ width: 40px; height: 40px;/);
  assert.match(styles, /\.bonus-gem \{ width: 42px; height: 42px;/);
  assert.match(styles, /\.card-points, \.bonus-gem \{ width: 30px; height: 30px; \}/);
  assert.match(appSource, /function gameTransition/);
  assert.match(appSource, /function presentGameTransition/);
  assert.match(appSource, /function playPokemonCry/);
  assert.match(appSource, /type: "caught"/);
  assert.match(appSource, /type: "reserve"/);
  assert.match(appSource, /type: "evolve"/);
  assert.match(appSource, /type: "victory"/);
  assert.match(appSource, /type: "reveal"/);
  assert.match(appSource, /if \(!isPokemonMystery\(card\)\) playPokemonCry/);
  assert.match(appSource, /image\.src = `\$\{image\.dataset\.animatedSrc\}\?reveal=/);
  assert.match(appSource, /pendingRevealCardIds\.add\(cardId\)/);
  assert.match(appSource, /cardElement\?\.classList\.remove\("market-card-pending-reveal"\)/);
  assert.match(styles, /\.market-card-pending-reveal \{ opacity: 0; pointer-events: none; \}/);
  assert.match(styles, /@keyframes catch-pokeball-throw/);
  assert.match(styles, /@keyframes catch-capture-flash/);
  assert.match(styles, /@keyframes reserve-card-slide/);
  assert.match(styles, /@keyframes evolution-target-arrive/);
  assert.match(styles, /@keyframes victory-emblem-arrive/);
  assert.match(styles, /@keyframes market-card-reveal/);
  assert.match(styles, /@keyframes replacement-grass-shake/);
  assert.match(styles, /\.rare-animation/);
  assert.match(styles, /\.legendary-animation/);
  assert.match(html, /id="backgroundSelect"/);
  assert.match(appSource, /pokemon-splendor-background/);
  assert.match(appSource, /elements\.backgroundSelect\.addEventListener/);
  assert.doesNotMatch(appSource, /updateLobbyOption\("background"/);
  assert.doesNotMatch(appSource, /elements\.startGame\.classList\.toggle\("hidden", !isHost\)/);
  assert.doesNotMatch(styles, /splendor-case\.(?:jpg|png)/);
  assert.match(styles, /--game-map-image/);
  assert.match(styles, /body:is\(\.game-active, \.welcome-active\):not\(\[data-game-background="current"\]\)/);
  assert.match(styles, /\.market-panel \{ background: rgba\(246,251,255,\.68\)/);
  assert.match(styles, /\.trainers-section \{[^}]*background: rgba\(246,251,255,\.7\)/);
});
