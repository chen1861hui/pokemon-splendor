# Pokémon Splendor

A lightweight private browser game inspired by Splendor's token-and-card loop. It uses a dependency-free Node server, server-validated rules, and private six-character room codes.

The interface supports English and Simplified Chinese. Use the language switch in the header; the selection is saved in the browser. The header Pokédex automatically keeps a browser-local checklist of Pokémon caught by the current player across multiple games.

The landing page starts with Pikachu and places every collected Pokédex species into the interactive hero background. The responsive layout scales the full collection to fit; click a sprite there or in the Pokédex to replay its animation and cry.

For solo or mixed play, the room host can add up to three Normal CPU Trainers from the lobby. One human plus at least one CPU can start immediately. Server-controlled opponents follow the same validated rules as human Trainers and automatically handle catching, reserving, ball collection and returns, evolution, and final-round scoring. Normal CPUs prioritize useful balls before general reservations, pause briefly before main actions, and reserve early only to protect an evolution target. If a human joins a full bot-filled lobby, one CPU automatically yields its seat.

The header loads only user-supplied `.wav` files from `public/assets/musics`; no generated soundtrack is used. New WAV files appear automatically after restarting the server, while incomplete cloud placeholders and non-WAV files are ignored. The persistent BGM toggle controls only background music; Pokémon cries remain active. BGM starts only after player interaction to comply with browser autoplay rules.

Pokémon use Generation V game-style pixel sprites throughout the interface. Market and owned/reserved cards use animated sprites; dense checklist and avatar views use matching static pixel sprites for smoother loading. Click a revealed market Pokémon to restart its animation and play its latest cry. Sprites and cries come from the PokeAPI repositories, with the previous local artwork retained as an automatic fallback. Mystery-mode cards do not expose the name or cry before they are caught.

## Run locally

Requirements: Node.js 20 or newer.

```bash
npm start
```

Open `http://localhost:4173`, create a room, and share the displayed link. Everyone must be able to reach the computer running the server; for remote friends, deploy the project to a Node-compatible host.

## Rules in this prototype

- Supports 2–4 trainers.
- The host can end the current match and return everyone to the lobby, guests can leave their seat, and the host can disband the room for everyone. Each action requires confirmation and browser Pokédex progress remains saved locally.
- Each trainer claims one of four Kanto character tiles in the lobby: Red, Brock, Misty, or Giovanni. All four use matching Generation III Pokémon Showdown trainer sprites with a lightweight idle animation.
- Each deck uses a tier-colored “Who am I?” cover with a random Pokémon silhouette. The silhouette changes whenever that deck reveals or removes a card without changing deck order.
- The host may optionally silhouette market, reserve, and uncaught Pokédex artwork until each Pokémon is caught.
- On a turn, take three different energy tokens (or all available colors when fewer than three remain), take two matching tokens when at least four remain, catch one market/reserved Pokémon, or reserve one Stage Pokémon.
- A Stage Pokémon may be reserved face-up or blindly from the top of its deck. Trainers may reserve at most three cards.
- A reservation grants one Master Ball when available. Trainers take first, then return tokens until they hold at most 10.
- Recruited Pokémon provide a permanent discount matching their type.
- After the main action and token cleanup, an eligible Pokémon may evolve for free from the market or the trainer's reserve. The old card is tucked and no longer scores or grants its bonus.
- The 90-card pool contains 35 Stage 1, 30 Stage 2, 15 Stage 3, 5 Rare, and 5 Legendary/Mythical cards. The Stage decks reveal four each; each special deck reveals one.
- Rare and Legendary/Mythical Pokémon cannot be reserved. Their printed catch cost includes one required Master Ball, they grant two matching permanent discounts, Rare Pokémon score 0, and Legendary/Mythical Pokémon score 2.
- Reaching 18 points triggers the final round. Ties compare tucked cards, then face-up Pokémon. After scoring, the host may start a fresh game while browser Pokédex progress is retained.

Rooms are stored in server memory and expire after 12 hours without activity.

The catalog is validated at startup for all official deck counts, point distributions, bonus distributions, evolution links, Master Ball requirements, and printed numerical cost patterns. The supplied card-sheet preview and independent rules/pattern references agree with the transcription. A scan of every physical card is still required to independently certify every species-specific color assignment.

## Verify

```bash
npm test
```

Pokémon names, sprites, cries, and other Pokémon media are used only as private prototype content and remain the property of their respective rights holders. Use original or properly licensed names, artwork, audio, and branding before any public distribution.
