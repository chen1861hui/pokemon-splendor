const gemTypes = ["poke", "great", "ultra", "heal", "quick"];
const allTokenTypes = [...gemTypes, "master"];
const colors = {
  poke: "var(--poke)",
  great: "var(--great)",
  ultra: "var(--ultra)",
  heal: "var(--heal)",
  quick: "var(--quick)",
  master: "var(--master)"
};
const tokenImages = Object.fromEntries(allTokenTypes.map((type) => [type, `/assets/balls/${type === "poke" ? "poke-ball" : `${type}-ball`}.png`]));
const pokemonPixelSpriteUrl = (pokedexId) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/${pokedexId}.png`;
const pokemonAnimatedSpriteUrl = (pokedexId) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokedexId}.gif`;
const pokemon3dRenderedSpriteUrl = (pokedexId) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokedexId}.gif`;
const pokemonAnimatedArtworkUrl = (pokedexId) => model3dEnabled
  ? pokemon3dRenderedSpriteUrl(pokedexId)
  : pokemonAnimatedSpriteUrl(pokedexId);
const pokemonCryUrl = (pokedexId) => `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokedexId}.ogg`;
const trainerPixelSpriteUrl = (name) => `https://play.pokemonshowdown.com/sprites/trainers/${name}.png`;
const trainerHdArtworkUrl = (path) => `https://archives.bulbagarden.net/media/upload/${path}`;
const trainerCards = [
  { id: "ash", styleId: "red", pokedexId: 25, labelKey: "redTrainer", image: trainerPixelSpriteUrl("red-gen3"), hdImage: trainerHdArtworkUrl("0/02/Spr_Masters_Red.png"), fallbackImage: "/assets/trainers/ash-xy.svg" },
  { id: "brock", pokedexId: 95, labelKey: "brockTrainer", image: trainerPixelSpriteUrl("brock-gen3"), hdImage: trainerHdArtworkUrl("8/82/Spr_Masters_Brock.png"), fallbackImage: "/assets/trainers/brock-art.png" },
  { id: "misty", pokedexId: 54, labelKey: "mistyTrainer", image: trainerPixelSpriteUrl("misty-gen3"), hdImage: trainerHdArtworkUrl("e/e5/Spr_Masters_Misty.png"), fallbackImage: "/assets/trainers/misty-art.png" },
  { id: "rocket", styleId: "giovanni", pokedexId: 53, labelKey: "giovanniTrainer", image: trainerPixelSpriteUrl("giovanni-gen3"), hdImage: trainerHdArtworkUrl("f/fd/Spr_Masters_Giovanni.png"), fallbackImage: "/assets/trainers/team-rocket-art.png" }
];
const trainerArtworkUrl = (trainerCard) => model3dEnabled ? trainerCard.hdImage : trainerCard.image;
const gameBackgrounds = [
  { id: "current", labelKey: "backgroundCurrent", image: null },
  { id: "kanto", labelKey: "backgroundKanto", image: "/assets/backgrounds/kanto.jpg" },
  { id: "johto", labelKey: "backgroundJohto", image: "/assets/backgrounds/johto.jpg" },
  { id: "hoenn", labelKey: "backgroundHoenn", image: "/assets/backgrounds/hoenn.jpg" },
  { id: "sinnoh", labelKey: "backgroundSinnoh", image: "/assets/backgrounds/sinnoh.jpg" }
];
const translations = {
  en: {
    gameRules: "Game rules", pokedex: "Pokédex", caughtPokedex: "Caught Pokédex", multiGameChecklist: "Multi-game checklist", checklistHelp: "Pokémon you catch are checked automatically and saved on this browser across games.", caughtProgress: "{caught} / {total} caught", stagePokemon: "Stage Pokémon", rarePokemon: "Rare Pokémon", legendaryPokemon: "Legendary Pokémon", mythicalPokemon: "Mythical Pokémon", catalogLoading: "Loading the Pokémon checklist…", heroEyebrow: "A private trainer challenge", heroTitle: "Catch. Collect.", heroTitleAccent: "Become Champion.",
    heroDescription: "Catch Pokémon, collect Poké Balls, and race your friends to 18 victory points. No accounts or installation required.",
    playersFeature: "2–4 players", privateRooms: "Private rooms", liveTurns: "Live turns", pokedexPartners: "Your Pokédex partners", settings: "Settings", personalPreferences: "Personal preferences", visualSettings: "Visuals", visualSettingsHelp: "These preferences apply only on this device.", model3d: "3D-rendered Pokémon GIFs", model3dHelp: "Use animated 3D battle GIFs with matching 1024px trainer artwork. Pixel sprites remain the fallback.", audioSettings: "Audio", audioSettingsHelp: "Control music and game sounds separately.", bgm: "Background music", bgmLocal: "Background music", bgmUnavailable: "No background music", bgmOn: "BGM on", bgmOff: "BGM off", bgmHelp: "Play the selected local game track.", musicTrack: "Music track", bgmVolume: "Music volume", soundEffects: "Sound effects", soundEffectsHelp: "Pokémon cries, critical-health timer, and your-turn reminders.", sfxVolume: "Sound-effect volume", createRoom: "Create room", joinRoom: "Join room", endGame: "End game", leaveRoom: "Leave room", disbandRoom: "Disband room", cancel: "Cancel",
    endGameTitle: "End the current game?", endGameMessage: "Everyone will return to this room's lobby and the current board will be cleared. Trainer choices, settings, and browser Pokédex progress will stay saved.", leaveRoomTitle: "Leave this room?", leaveRoomMessage: "Your seat and current game progress will be removed. Your browser Pokédex will stay saved.", disbandRoomTitle: "Disband this room?", disbandRoomMessage: "The current room will close immediately for every Trainer. This cannot be undone, but everyone keeps their browser Pokédex.", gameEnded: "Game ended; everyone returned to the lobby", roomLeft: "You left the room", roomDisbanded: "Room disbanded", roomEnded: "This room has ended or is no longer available",
    trainerName: "Trainer name", trainerPlaceholder: "e.g. Red", roomCode: "Room code", createPrivateRoom: "Create private room", joinPrivateRoom: "Join private room",
    trainerLobby: "Trainer lobby", gatherTeam: "Gather your team", shareRoom: "Share this private room code with up to three friends.", copyInvite: "Click to copy invite link", trainerCard: "Trainer tile", chooseTrainerCard: "Choose character", onePerTrainer: "One tile per trainer", whoAmIPool: "Who am I?", redTrainer: "Red & Pikachu", brockTrainer: "Brock & Onix", mistyTrainer: "Misty & Psyduck", giovanniTrainer: "Giovanni & Persian", chosenBy: "Chosen by {name}", available: "Available", stageOne: "Stage 1", stageTwo: "Stage 2", stageThree: "Stage 3", chooseTrainerFirst: "Choose a Trainer tile to continue.", waitingTrainerCards: "Waiting for every trainer to choose a tile…",
    startGame: "Start game", turnTimer: "Turn timer", timerOption: "Optional turn limit", enableTimer: "Enable timer", secondsPerTurn: "seconds per turn", timerHostHelp: "The host controls this setting. Enter 15–600 seconds.", timerGuestHelp: "Only the host can change the timer.", mysteryMode: "Mystery mode", silhouetteOption: "Silhouettes until caught", enableSilhouettes: "Enable silhouettes", silhouetteHelp: "Artwork and names stay hidden until that Pokémon is caught in the current game.", silhouetteGuestHelp: "Only the host can change this option.", gameBackground: "Personal game background", backgroundCurrent: "Current", backgroundKanto: "Gen I · Kanto", backgroundJohto: "Gen II · Johto", backgroundHoenn: "Gen III · Hoenn", backgroundSinnoh: "Gen IV · Sinnoh", timeRemaining: "Time remaining", lowTimeAlert: "Low time — make your move!", pointsToWin: "points to win", ballSupply: "Poké Ball supply", chooseBalls: "Choose Poké Balls", clear: "Clear",
    takeThree: "Take 3 different", takeAvailable: "Take available colors", takePair: "Take pair", returnBalls: "Return Poké Balls", returnExact: "Choose exactly {count} ball(s) to return.", skipEvolution: "Skip evolution", chooseEvolution: "Evolve one Pokémon or skip", evolve: "Evolve", reserveDeck: "Reserve top", ballHelp: "Take three different Poké Balls (or every available color if fewer than three remain), or take a pair when four of that color remain. Return to 10 after the action.",
    wildEncounter: "Wild encounter", pokemonMarket: "Pokémon market", leagueTable: "League table", trainers: "Trainers", trainerHandbook: "Trainer handbook", howToPlay: "How to play",
    ruleIntroTitle: "Become the Pokémon Champion", ruleIntroText: "Collect Poké Balls, catch Pokémon, evolve your team, and finish with the most victory points.",
    ruleSetupTitle: "Set up the supply", ruleSetupText: "Use 4 of each standard Poké Ball for 2 trainers, 5 for 3 trainers, or all 7 for 4 trainers. Always use all 5 Master Balls.",
    ruleSetupCards: "Shuffle 35 Stage 1, 30 Stage 2, 15 Stage 3, 5 Rare, and 5 Legendary/Mythical cards. Reveal four from each Stage deck and one from each special deck.", ruleActionTitle: "Choose one action",
    ruleActionOne: "Take 3 different standard Poké Balls. If fewer types are available, take up to the available number.",
    ruleActionTwo: "Take 2 matching Poké Balls only when at least 4 of that type are in the supply before taking them.",
    ruleActionThree: "Reserve a face-up Stage card or the top card of a Stage deck, then take 1 Master Ball if available. You may reserve at most 3 cards.",
    ruleActionFour: "Catch 1 face-up or reserved Pokémon by paying its cost. Card bonuses permanently reduce matching costs.",
    ruleMasterTitle: "Master Balls and special Pokémon", ruleMasterText: "Master Balls are wild and may replace any standard ball. Every Rare and Legendary/Mythical card includes 1 required Master Ball plus its printed standard-ball cost, and grants two matching permanent bonuses. These cards cannot be reserved. At the end of your action, return balls until you hold no more than 10 total.",
    ruleEvolutionTitle: "Evolve one Pokémon", ruleEvolutionText: "After ball cleanup, you may evolve one Pokémon for free when its next stage is face-up or reserved by you and your permanent bonuses meet the evolution requirement. Tuck the earlier stage face-down; its points and bonus no longer count.",
    ruleEndTitle: "Finish the game", ruleEndText: "Reaching 18 points triggers the final round so every trainer takes the same number of turns. Most points wins. Ties go to the trainer with the most tucked cards, then the most face-up Pokémon. The host may then start a fresh game; caught Pokédex progress is kept.",
    host: "Host", ready: "Ready", waitingTrainer: "Waiting for at least one more trainer…", trainersReady: "{count} trainers ready. Any trainer can start the game.", waitingHost: "Waiting for the game to start…",
    room: "Room {code}", left: "{count} left", recruit: "Catch", reserve: "Reserve", caughtPokemon: "Caught Pokémon", reservedPokemon: "Reserved Pokémon", tuckedPokemon: "Evolved", expandPlayer: "Expand player panel", showAllPlayers: "Show all player panels", evolutionReady: "Evolution ready", evolutionWaiting: "Evolution requirement met — next stage not available", catchPokemon: "Catch {pokemon}", previewPokemon: "Play {pokemon}'s animation and cry", unknownPokemon: "Unknown Pokémon", tier: "Stage", rare: "Rare", legendary: "Legendary", mythical: "Mythical", doubleBonus: "Double permanent {ball} discount", free: "Free", noneYet: "None yet", privateCards: "Hidden from other Trainers", cost: "Catch cost", evolution: "Evolution", evolvesTo: "Evolves to {pokemon}", evolutionRequirement: "{count} permanent {ball} bonuses", bonusProgress: "Current {current}/{required}", evolutionTarget: "Target must be face-up or reserved by you", you: "you", pointsShort: "pts",
    recruitedReserved: "{caught} caught · {reserved} reserved", gameComplete: "Game complete", yourChampion: "You are the Champion!", trainerChampion: "{name} is Champion", restartGame: "Play again", hostDecision: "Start a fresh game with the same trainers and timer. Everyone keeps their browser Pokédex progress.", waitingDecision: "Waiting for the host to start the next game.", animationCaught: "{name} caught {pokemon}!", animationReserved: "{name} reserved a Pokémon", animationEvolved: "{name}'s Pokémon evolved!", animationVictory: "{name} is Champion!", rareEncounter: "Rare catch!", legendaryEncounter: "Legendary catch!", mythicalEncounter: "Mythical catch!",
    yourTurn: "Your turn", trainerTurn: "{name}'s turn", chooseAction: "Choose your action", finalRound: "Final round", finalScores: "Final scores", makeMove: "Make one move", watchingLive: "Watching live",
    inviteCopied: "Invite link copied", roomCodeToast: "Room code: {code}", permanentDiscount: "Permanent {ball} discount", roomCreated: "Room created",
    joinedRoom: "{name} joined the room", leftRoom: "{name} left the room", firstTurn: "{name} takes the first turn", tookTokens: "{name} took Poké Balls", reservedCard: "{name} reserved a Pokémon", caughtCard: "{name} caught {pokemon}", turnTimedOut: "{name}'s turn timed out", winsWith: "{name} wins with {points} points!",
    tokenPoke: "Poké Ball", tokenGreat: "Great Ball", tokenUltra: "Ultra Ball", tokenHeal: "Heal Ball", tokenQuick: "Quick Ball", tokenMaster: "Master Ball"
  },
  zh: {
    gameRules: "游戏规则", pokedex: "图鉴", caughtPokedex: "捕捉图鉴", multiGameChecklist: "多局游戏清单", checklistHelp: "你亲自捕捉的宝可梦会自动勾选，并保存在此浏览器中供多局游戏核对。", caughtProgress: "已捕捉 {caught} / {total}", stagePokemon: "阶段宝可梦", rarePokemon: "稀有宝可梦", legendaryPokemon: "传说宝可梦", mythicalPokemon: "幻之宝可梦", catalogLoading: "正在载入宝可梦清单…", heroEyebrow: "私人训练家挑战", heroTitle: "捕捉·收集", heroTitleAccent: "成为冠军！",
    heroDescription: "捕捉宝可梦、收集精灵球，与好友竞赛，率先触发18分终局。无需账号或安装。",
    playersFeature: "2–4名玩家", privateRooms: "私人房间", liveTurns: "实时回合", pokedexPartners: "你的图鉴伙伴", settings: "设置", personalPreferences: "个人偏好", visualSettings: "画面", visualSettingsHelp: "这些偏好只应用于此设备。", model3d: "3D渲染宝可梦GIF", model3dHelp: "使用3D渲染战斗GIF与统一的1024像素训练家图像；无法载入时会自动使用像素精灵图。", audioSettings: "声音", audioSettingsHelp: "可分别控制音乐与游戏音效。", bgm: "背景音乐", bgmLocal: "背景音乐", bgmUnavailable: "没有背景音乐", bgmOn: "背景音乐已开", bgmOff: "背景音乐已关", bgmHelp: "播放所选的本地游戏音乐。", musicTrack: "音乐曲目", bgmVolume: "音乐音量", soundEffects: "游戏音效", soundEffectsHelp: "宝可梦叫声、残血倒计时与轮到你的提示音。", sfxVolume: "音效音量", createRoom: "创建房间", joinRoom: "加入房间", endGame: "结束本局", leaveRoom: "离开房间", disbandRoom: "解散房间", cancel: "取消",
    endGameTitle: "确定结束当前游戏？", endGameMessage: "所有训练家会回到当前房间的大厅，当前牌面会被清除；角色选择、房间设置与浏览器捕捉图鉴都会保留。", leaveRoomTitle: "确定离开房间？", leaveRoomMessage: "你的席位与本局进度将被移除，但浏览器中的捕捉图鉴会保留。", disbandRoomTitle: "确定解散房间？", disbandRoomMessage: "房间会立即对所有训练家关闭，且无法撤销；每人的浏览器捕捉图鉴仍会保留。", gameEnded: "本局已结束，所有训练家已返回大厅", roomLeft: "你已离开房间", roomDisbanded: "房间已解散", roomEnded: "房间已结束或无法继续使用",
    trainerName: "训练家名称", trainerPlaceholder: "例如：小智", roomCode: "房间代码", createPrivateRoom: "创建私人房间", joinPrivateRoom: "加入私人房间",
    trainerLobby: "训练家大厅", gatherTeam: "集结你的队伍", shareRoom: "将私人房间代码分享给最多三位好友。", copyInvite: "点击复制邀请链接", trainerCard: "训练家板块", chooseTrainerCard: "选择角色", onePerTrainer: "每位训练家一个", whoAmIPool: "我是谁？", redTrainer: "赤红与皮卡丘", brockTrainer: "小刚与大岩蛇", mistyTrainer: "小霞与可达鸭", giovanniTrainer: "坂木与猫老大", chosenBy: "{name}已选择", available: "可选择", stageOne: "阶段 1", stageTwo: "阶段 2", stageThree: "阶段 3", chooseTrainerFirst: "请先选择一个训练家板块。", waitingTrainerCards: "等待所有训练家选择板块…",
    startGame: "开始游戏", turnTimer: "回合计时器", timerOption: "可选回合时限", enableTimer: "启用计时器", secondsPerTurn: "秒／回合", timerHostHelp: "由房主控制，请输入15–600秒。", timerGuestHelp: "只有房主可以更改计时器。", mysteryMode: "神秘模式", silhouetteOption: "捕捉前显示剪影", enableSilhouettes: "启用剪影", silhouetteHelp: "宝可梦在本局被捕捉前，其图片与名称都会保持隐藏。", silhouetteGuestHelp: "只有房主可以更改此选项。", gameBackground: "个人游戏背景", backgroundCurrent: "当前背景", backgroundKanto: "第一世代·关都", backgroundJohto: "第二世代·城都", backgroundHoenn: "第三世代·丰缘", backgroundSinnoh: "第四世代·神奥", timeRemaining: "剩余时间", lowTimeAlert: "时间不足，请尽快行动！", pointsToWin: "分触发终局", ballSupply: "精灵球供应区", chooseBalls: "选择精灵球", clear: "清除",
    takeThree: "拿3种不同球", takeAvailable: "拿取现有颜色", takePair: "拿2个同色球", returnBalls: "归还精灵球", returnExact: "请选择正好{count}个球归还。", skipEvolution: "跳过进化", chooseEvolution: "进化一只宝可梦或跳过", evolve: "进化", reserveDeck: "保留牌堆顶", ballHelp: "拿取三种不同的普通球（若不足三种则拿取全部现有颜色），或在同色球至少剩4个时拿取2个。行动后须弃至10个。",
    wildEncounter: "野外遭遇", pokemonMarket: "宝可梦展示区", leagueTable: "联盟排名", trainers: "训练家", trainerHandbook: "训练家手册", howToPlay: "游戏玩法",
    ruleIntroTitle: "成为宝可梦冠军", ruleIntroText: "收集精灵球、捕捉宝可梦、进化队伍，并获得最高胜利点数。",
    ruleSetupTitle: "设置供应区", ruleSetupText: "2名训练家时每种普通精灵球使用4个，3名时使用5个，4名时使用全部7个。大师球始终使用全部5个。",
    ruleSetupCards: "洗混35张阶段1、30张阶段2、15张阶段3、5张稀有与5张传说／幻之卡。每个阶段翻开4张，两个特殊牌堆各翻开1张。", ruleActionTitle: "选择一个行动",
    ruleActionOne: "拿取3种不同的普通精灵球。若供应区不足3种，则可拿取现有的2种或1种。",
    ruleActionTwo: "拿取2个同种精灵球，但拿取前供应区中该种球必须至少有4个。",
    ruleActionThree: "保留一张展示区的阶段牌，或抽取一个阶段牌堆顶牌；若有大师球则拿取1个。最多保留3张牌。",
    ruleActionFour: "支付费用，捕捉展示区或保留区中的1只宝可梦。卡牌奖励会永久减少同色费用。",
    ruleMasterTitle: "大师球与特殊宝可梦", ruleMasterText: "大师球是万能球，可替代任意普通精灵球。每张稀有与传说／幻之卡的费用都包含1个必须支付的大师球及卡面所示的普通球，并提供两个同色永久奖励。特殊宝可梦不能被保留。行动结束时，须将精灵球弃至最多10个。",
    ruleEvolutionTitle: "进化一只宝可梦", ruleEvolutionText: "归还超额精灵球后，若下一阶段宝可梦在展示区或由你保留，且永久奖励满足进化条件，则可免费进化一只宝可梦。将旧卡面朝下压在训练家板下；其分数与奖励不再计算。",
    ruleEndTitle: "游戏结束", ruleEndText: "任一训练家达到18分后触发最后一轮，让所有人拥有相同回合数。得分最高者获胜；平局时依次比较压在训练家板下的卡牌数、面朝上的宝可梦数量。计分后房主可开始新一局，已捕捉图鉴进度会保留。",
    host: "房主", ready: "已准备", waitingTrainer: "等待至少一位训练家加入…", trainersReady: "已有{count}位训练家准备，任何训练家都可以开始游戏。", waitingHost: "等待游戏开始…",
    room: "房间 {code}", left: "剩余 {count}", recruit: "捕捉", reserve: "保留", caughtPokemon: "已捕捉宝可梦", reservedPokemon: "已保留宝可梦", tuckedPokemon: "已进化", expandPlayer: "展开玩家面板", showAllPlayers: "显示所有玩家面板", evolutionReady: "可进化", evolutionWaiting: "进化条件已满足，下一阶段尚未出现", catchPokemon: "捕捉{pokemon}", previewPokemon: "播放{pokemon}的动画与叫声", unknownPokemon: "未知宝可梦", tier: "阶段", rare: "稀有", legendary: "传说", mythical: "幻之", doubleBonus: "永久减少两点{ball}费用", free: "免费", noneYet: "暂无", privateCards: "对其他训练家隐藏", cost: "捕捉费用", evolution: "进化", evolvesTo: "进化为{pokemon}", evolutionRequirement: "需要{count}个永久{ball}奖励", bonusProgress: "当前 {current}/{required}", evolutionTarget: "目标卡须在展示区或由你保留", you: "你", pointsShort: "分",
    recruitedReserved: "已捕捉 {caught} · 已保留 {reserved}", gameComplete: "游戏结束", yourChampion: "你成为了冠军！", trainerChampion: "{name}成为了冠军", restartGame: "再玩一局", hostDecision: "使用相同训练家与计时设置开始新一局；每人的浏览器捕捉图鉴进度会保留。", waitingDecision: "等待房主开始下一局。", animationCaught: "{name}捕捉了{pokemon}！", animationReserved: "{name}保留了一只宝可梦", animationEvolved: "{name}的宝可梦进化了！", animationVictory: "{name}成为冠军！", rareEncounter: "稀有捕捉！", legendaryEncounter: "传说捕捉！", mythicalEncounter: "幻之捕捉！",
    yourTurn: "你的回合", trainerTurn: "{name}的回合", chooseAction: "选择你的行动", finalRound: "最后一轮", finalScores: "最终得分", makeMove: "执行一个行动", watchingLive: "实时观战",
    inviteCopied: "邀请链接已复制", roomCodeToast: "房间代码：{code}", permanentDiscount: "永久减少{ball}费用", roomCreated: "房间已创建",
    joinedRoom: "{name}加入了房间", leftRoom: "{name}离开了房间", firstTurn: "{name}开始第一个回合", tookTokens: "{name}拿取了精灵球", reservedCard: "{name}保留了一只宝可梦", caughtCard: "{name}捕捉了{pokemon}", turnTimedOut: "{name}的回合超时", winsWith: "{name}以{points}分获胜！",
    tokenPoke: "精灵球", tokenGreat: "超级球", tokenUltra: "高级球", tokenHeal: "治愈球", tokenQuick: "先机球", tokenMaster: "大师球"
  }
};

const pokemonNamesZh = {
  Abra: "凯西", Aerodactyl: "化石翼龙", Alakazam: "胡地", Ampharos: "电龙", Arcanine: "风速狗", Articuno: "急冻鸟", Bellsprout: "喇叭芽", Blastoise: "水箭龟", Bulbasaur: "妙蛙种子",
  Celebi: "时拉比", Charizard: "喷火龙", Charmander: "小火龙", Charmeleon: "火恐龙", Drowzee: "催眠貘", Electabuzz: "电击兽", Entei: "炎帝", Exeggutor: "椰蛋树",
  Ditto: "百变怪", Eevee: "伊布", Gastly: "鬼斯", Gengar: "耿鬼", Golem: "隆隆岩", Golduck: "哥达鸭", Growlithe: "卡蒂狗", Haunter: "鬼斯通", Hypno: "引梦貘人", Ivysaur: "妙蛙草", Jirachi: "基拉祈", Jolteon: "雷伊布", Kadabra: "勇基拉", Lapras: "拉普拉斯",
  Magnemite: "小磁怪", Magmar: "鸭嘴火兽", Manaphy: "玛纳霏", Mew: "梦幻", Mewtwo: "超梦", Moltres: "火焰鸟", Ninetales: "九尾", Oddish: "走路草", Pikachu: "皮卡丘", Poliwag: "蚊香蝌蚪", Poliwrath: "蚊香泳士",
  Psyduck: "可达鸭", Raichu: "雷丘", Raikou: "雷公", Rapidash: "烈焰马", Sceptile: "蜥蜴王", Shaymin: "谢米", Squirtle: "杰尼龟", Starmie: "宝石海星", Suicune: "水君", Venusaur: "妙蛙花", Victreebel: "大食花", Vileplume: "霸王花",
  Snorlax: "卡比兽", Voltorb: "霹雳电球", Vulpix: "六尾", Wartortle: "卡咪龟", Weepinbell: "口呆花", Zapdos: "闪电鸟"
};

const elements = Object.fromEntries([
  "welcomeView", "lobbyView", "gameView", "roomBadge", "roomForm", "playerName", "roomCodeField", "heroMascot", "heroPokemonCollection", "bgmSelect", "soundButton", "settingsButton", "settingsDialog", "closeSettings", "model3dEnabled", "bgmEnabledInput", "bgmVolumeInput", "bgmVolumeValue", "sfxEnabledInput", "sfxVolumeInput", "sfxVolumeValue",
  "roomCode", "roomSubmit", "formError", "largeRoomCode", "lobbyPlayers", "copyInvite", "startGame", "trainerChoices", "timerEnabled", "timerSeconds", "timerHint", "silhouetteEnabled", "silhouetteHint", "backgroundSelect",
  "lobbyHint", "turnLabel", "statusMessage", "turnTimer", "marketHint", "tokenBank", "takeThree", "takePair", "endTurn",
  "gameDecision", "gameDecisionText", "restartGame",
  "clearSelection", "market", "players", "toast", "languageButton", "rulesButton", "rulesDialog", "closeRules", "pokedexButton",
  "pokedexProgress", "pokedexDialog", "closePokedex", "pokedexSummary", "pokedexMeter", "pokedexChecklist", "gameAnimation",
  "endGameButton", "exitRoomButton", "exitRoomDialog", "exitRoomTitle", "exitRoomMessage", "cancelExitRoom", "confirmExitRoom"
].map((id) => [id, document.getElementById(id)]));

let entryMode = "create";
let game = null;
let pollTimer = null;
let busy = false;
let selectedTokens = new Set();
let selectedReturns = Object.fromEntries(allTokenTypes.map((type) => [type, 0]));
let session = loadSession();
let currentLanguage = localStorage.getItem("pokemon-splendor-language") === "zh" ? "zh" : "en";
let selectedGameBackgroundId = gameBackgrounds.some(({ id }) => id === localStorage.getItem("pokemon-splendor-background"))
  ? localStorage.getItem("pokemon-splendor-background")
  : "current";
let localBgmTracks = [];
let selectedBgmId = localStorage.getItem("pokemon-splendor-bgm") ?? "";
let bgmEnabled = (localStorage.getItem("pokemon-splendor-bgm-enabled")
  ?? localStorage.getItem("pokemon-splendor-sound")) === "true";
let sfxEnabled = localStorage.getItem("pokemon-splendor-sfx-enabled") !== "false";
let bgmVolume = loadAudioVolume("pokemon-splendor-bgm-volume", 0.35);
let sfxVolume = loadAudioVolume("pokemon-splendor-sfx-volume", 0.7);
let model3dEnabled = localStorage.getItem("pokemon-splendor-3d-enabled") === "true";
let catalog = [];
let caughtPokemon = loadCaughtPokemon();
let collectionTooltip = null;
let selectedPlayerPanelId = null;
let pendingTimerSeconds = null;
let serverClockOffset = 0;
let activePokemonAudio = null;
let activeBgmAudio = null;
let activeBgmAudioId = null;
let activeTurnReminderAudio = null;
let activeTimerMusicAudio = null;
let timerMusicTurnKey = null;
let gameAnimationQueue = [];
let gameAnimationRunning = false;
let pendingRevealCardIds = new Set();
let pendingRoomAction = null;

function t(key, variables = {}) {
  const template = translations[currentLanguage][key] ?? translations.en[key] ?? key;
  return Object.entries(variables).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), template);
}

function loadAudioVolume(key, fallback) {
  const stored = localStorage.getItem(key);
  if (stored === null) return fallback;
  const saved = Number(stored);
  return Number.isFinite(saved) && saved >= 0 && saved <= 1 ? saved : fallback;
}

function ballLabel(type) {
  return t(`token${type.charAt(0).toUpperCase()}${type.slice(1)}`);
}

function pokemonName(cardOrName) {
  const card = typeof cardOrName === "object" ? cardOrName : catalog.find((candidate) => candidate.name === cardOrName);
  const name = typeof cardOrName === "object" ? cardOrName.name : cardOrName;
  return currentLanguage === "zh" ? card?.nameZh ?? pokemonNamesZh[name] ?? name : name;
}

function translateStaticContent() {
  document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  elements.languageButton.textContent = currentLanguage === "zh" ? "EN" : "中文";
  elements.languageButton.setAttribute("aria-label", currentLanguage === "zh" ? "Switch to English" : "切换为简体中文");
  renderBackgroundSelector();
  renderAudioControls();
  renderSettingsControls();
  setEntryMode(entryMode);
  renderPokedex();
  if (elements.exitRoomDialog.open && pendingRoomAction) configureRoomActionDialog(pendingRoomAction);
}

function loadCaughtPokemon() {
  try {
    const saved = JSON.parse(localStorage.getItem("pokemon-splendor-caught"));
    return new Set(Array.isArray(saved) ? saved.map(Number).filter(Number.isInteger) : []);
  } catch {
    return new Set();
  }
}

function saveCaughtPokemon() {
  localStorage.setItem("pokemon-splendor-caught", JSON.stringify([...caughtPokemon]));
}

function syncCaughtPokemon() {
  const player = myPlayer();
  if (!player) return;
  const previousSize = caughtPokemon.size;
  [...player.cards, ...player.tucked].forEach((card) => caughtPokemon.add(card.pokedexId));
  if (caughtPokemon.size !== previousSize) saveCaughtPokemon();
}

function uniqueCatalog() {
  return [...new Map(catalog.map((card) => [card.pokedexId, card])).values()];
}

function landingPokemon() {
  const pokemon = uniqueCatalog();
  const pikachu = pokemon.find((card) => card.pokedexId === 25)
    ?? { name: "Pikachu", nameZh: "皮卡丘", pokedexId: 25 };
  const collected = pokemon.filter((card) => caughtPokemon.has(card.pokedexId) && card.pokedexId !== 25);
  return [pikachu, ...collected];
}

function landingPokemonLayout(index, count) {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const radius = Math.sqrt((index + 0.7) / count);
  const angle = index * goldenAngle + 0.35;
  const x = 52 + Math.cos(angle) * radius * 46;
  const y = 82 + Math.sin(angle) * radius * 12;
  const baseSize = Math.max(54, Math.min(156, 280 / Math.sqrt(Math.max(1, count / 2))));
  const size = baseSize * (0.88 + (index % 4) * 0.04);
  const rotation = ((index * 7) % 17) - 8;
  return [x, y, size, rotation];
}

function renderLandingPokemon() {
  const [pikachu, ...pokemon] = landingPokemon();
  const buttonMarkup = (card, index, count, mascot = false) => {
    const name = pokemonName(card);
    const initialSprite = pokemonAnimatedArtworkUrl(card.pokedexId);
    const [x, y, size, rotation] = mascot ? [0, 0, 220, 5] : landingPokemonLayout(index, count);
    return `
      <button class="landing-pokemon ${mascot ? "landing-mascot" : ""}" data-cry-src="${pokemonCryUrl(card.pokedexId)}" type="button" title="${escapeHtml(name)}" aria-label="${escapeHtml(t("previewPokemon", { pokemon: name }))}" style="--hero-x:${x}%;--hero-y:${y}%;--hero-size:${size}px;--hero-rotate:${rotation}deg">
        <img data-pokemon-sprite src="${initialSprite}" data-fallback-src="/assets/pokemon/${card.pokedexId}.png" data-animated-src="${initialSprite}" alt="${escapeHtml(name)}" loading="lazy">
      </button>
    `;
  };

  elements.heroMascot.innerHTML = buttonMarkup(pikachu, 0, 1, true);
  elements.heroPokemonCollection.classList.toggle("empty", pokemon.length === 0);
  elements.heroPokemonCollection.setAttribute("role", "group");
  elements.heroPokemonCollection.setAttribute("aria-label", t("pokedexPartners"));
  elements.heroPokemonCollection.innerHTML = pokemon.map((card, index) => buttonMarkup(card, index, pokemon.length)).join("");
  [elements.heroMascot, elements.heroPokemonCollection].forEach((container) => {
    container.querySelectorAll(".landing-pokemon").forEach((button) => {
      button.addEventListener("click", () => playPokemonPreview(button));
    });
    installImageFallbacks(container);
  });
}

function renderPokedex() {
  renderLandingPokemon();
  const pokemon = uniqueCatalog();
  const caughtCount = pokemon.filter((card) => caughtPokemon.has(card.pokedexId)).length;
  const total = pokemon.length;
  elements.pokedexProgress.textContent = `${caughtCount}/${total}`;
  elements.pokedexSummary.textContent = t("caughtProgress", { caught: caughtCount, total });
  elements.pokedexMeter.style.width = `${total ? Math.round(caughtCount / total * 100) : 0}%`;

  if (!total) {
    elements.pokedexChecklist.innerHTML = `<p class="pokedex-empty">${t("catalogLoading")}</p>`;
    return;
  }

  const groups = [
    { kind: "stage", label: t("stagePokemon") },
    { kind: "rare", label: t("rarePokemon") },
    { kind: "legendary", label: `${t("legendaryPokemon")} / ${t("mythicalPokemon")}` }
  ];
  elements.pokedexChecklist.innerHTML = groups.map(({ kind, label }) => {
    const cards = pokemon.filter((card) => card.kind === kind);
    const groupCaught = cards.filter((card) => caughtPokemon.has(card.pokedexId)).length;
    return `
      <section class="pokedex-group ${kind}">
        <header><h3>${label}</h3><span>${groupCaught}/${cards.length}</span></header>
        <div class="pokedex-grid">
          ${cards.map((card) => {
            const isCaught = caughtPokemon.has(card.pokedexId);
            const mystery = isPokemonMystery(card);
            const isInteractive = isCaught && !mystery;
            const displayName = pokemonDisplayName(card);
            const sprite = `<img data-pokemon-sprite src="${pokemonPixelSpriteUrl(card.pokedexId)}" data-fallback-src="/assets/pokemon/${card.pokedexId}.png" ${isInteractive ? `data-animated-src="${pokemonAnimatedArtworkUrl(card.pokedexId)}"` : ""} alt="" loading="lazy">`;
            return `<div class="pokedex-entry ${isCaught ? "caught" : ""} ${mystery ? "mystery-silhouette" : ""}">
              <input type="checkbox" aria-label="${escapeHtml(displayName)}" ${isCaught ? "checked" : ""} disabled>
              ${isInteractive
                ? `<button class="pokedex-pokemon-preview" data-cry-src="${pokemonCryUrl(card.pokedexId)}" type="button" title="${escapeHtml(t("previewPokemon", { pokemon: displayName }))}" aria-label="${escapeHtml(t("previewPokemon", { pokemon: displayName }))}">${sprite}</button>`
                : `<span class="pokedex-pokemon-static">${sprite}</span>`}
              <span class="${mystery ? "mystery-name" : ""}">${escapeHtml(pokemonDisplayName(card))}</span>
            </div>`;
          }).join("")}
        </div>
      </section>
    `;
  }).join("");
  elements.pokedexChecklist.querySelectorAll(".pokedex-pokemon-preview").forEach((button) => {
    button.addEventListener("click", () => playPokemonPreview(button));
  });
  installImageFallbacks(elements.pokedexChecklist);
}

function localizeAction(message) {
  if (currentLanguage !== "zh" || !message) return message;
  if (message === "Room created") return t("roomCreated");
  let match = message.match(/^(.+) joined the room$/);
  if (match) return t("joinedRoom", { name: match[1] });
  match = message.match(/^(.+) left the room$/);
  if (match) return t("leftRoom", { name: match[1] });
  match = message.match(/^(.+) takes the first turn$/);
  if (match) return t("firstTurn", { name: match[1] });
  match = message.match(/^(.+) took .+ tokens$/);
  if (match) return t("tookTokens", { name: match[1] });
  match = message.match(/^(.+) reserved a Pokémon$/);
  if (match) return t("reservedCard", { name: match[1] });
  match = message.match(/^(.+) reserved a hidden Pokémon$/);
  if (match) return t("reservedCard", { name: match[1] });
  match = message.match(/^(.+) recruited (.+)$/);
  if (match) return t("caughtCard", { name: match[1], pokemon: pokemonName(match[2]) });
  match = message.match(/^(.+)'s turn timed out$/);
  if (match) return t("turnTimedOut", { name: match[1] });
  match = message.match(/^(.+) wins with (\d+) points!$/);
  if (match) return t("winsWith", { name: match[1], points: match[2] });
  return message;
}

function localizeError(message) {
  if (currentLanguage !== "zh") return message;
  const messages = {
    "Something went wrong.": "发生错误，请重试。", "Room not found.": "找不到该房间。", "Enter a player name.": "请输入训练家名称。",
    "This game has already started.": "游戏已经开始。", "This room is full.": "房间人数已满。", "At least two players are required.": "至少需要两名玩家。",
    "The game is not currently active.": "游戏目前未进行。", "Wait for your turn.": "请等待你的回合。", "Choose tokens to take.": "请选择要拿取的精灵球。",
    "Master Ball tokens cannot be taken directly.": "不能直接拿取大师球。", "You may reserve at most three cards.": "最多只能保留三张卡。",
    "That card is no longer in the market.": "该卡已不在展示区。", "That card is not available to you.": "你无法使用该卡。",
    "Rare and Legendary Pokémon cannot be reserved.": "稀有与传说宝可梦不能被保留。",
    "You do not have enough tokens to recruit that Pokémon.": "你的精灵球不足，无法捕捉该宝可梦。", "Only the room host can start the game.": "只有房主可以开始游戏。",
    "Every player must choose a Trainer card.": "每位玩家都必须选择一张训练家卡。", "Trainer cards can only be changed in the lobby.": "只能在大厅中更换训练家卡。",
    "Choose a valid Trainer card.": "请选择有效的训练家卡。", "That Trainer card has already been chosen.": "该训练家卡已被其他玩家选择。",
    "The Pokémon pool can only be changed in the lobby.": "只能在大厅中更改宝可梦牌池。", "Only the room host can change the Pokémon pool.": "只有房主可以更改宝可梦牌池。", "Choose a valid Pokémon pool mode.": "请选择有效的牌池模式。",
    "Only the room host can change the turn timer.": "只有房主可以更改回合计时器。", "The turn timer can only be changed in the lobby.": "只能在大厅中更改回合计时器。",
    "Choose 0 to disable the timer, or 15–600 seconds.": "请输入15–600秒，或输入0关闭计时器。",
    "Your player session is not valid for this room.": "你的玩家会话不属于该房间。", "Choose an action.": "请选择一个行动。", "Unknown game action.": "未知的游戏行动。",
    "The room host must disband the room.": "房主必须解散房间。", "Only the room host can disband the room.": "只有房主可以解散房间。",
    "Only the room host can end the game.": "只有房主可以结束本局。", "The game has not started yet.": "游戏尚未开始。"
  };
  if (messages[message]) return messages[message];
  let match = message.match(/^At least four (.+) tokens must remain before taking a pair\.$/);
  if (match) return `拿取两个同种球前，供应区中必须至少有4个${ballLabel(match[1])}。`;
  match = message.match(/^No (.+) tokens remain\.$/);
  if (match) return `${ballLabel(match[1])}已用完。`;
  return message;
}

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem("pokemon-splendor-session")) ?? null;
  } catch {
    return null;
  }
}

function saveSession(nextSession) {
  session = nextSession;
  localStorage.setItem("pokemon-splendor-session", JSON.stringify(session));
  history.replaceState({}, "", `/?room=${session.code}`);
}

function clearSession() {
  window.clearInterval(pollTimer);
  pollTimer = null;
  session = null;
  game = null;
  localStorage.removeItem("pokemon-splendor-session");
  history.replaceState({}, "", "/");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function installImageFallbacks(root = document) {
  root.querySelectorAll("img[data-fallback-src]").forEach((image) => {
    if (image.dataset.fallbackReady) return;
    image.dataset.fallbackReady = "true";
    image.addEventListener("error", () => {
      const renderedMatch = image.src.match(/\/other\/showdown\/(\d+)\.gif/);
      if (renderedMatch && image.dataset.pixelFallbackAttempted !== "true") {
        image.dataset.pixelFallbackAttempted = "true";
        image.src = pokemonAnimatedSpriteUrl(Number(renderedMatch[1]));
        return;
      }
      const fallbackUrl = new URL(image.dataset.fallbackSrc, location.href).href;
      if (image.dataset.fallbackAttempted !== "true" && image.src !== fallbackUrl) {
        image.dataset.fallbackAttempted = "true";
        image.src = fallbackUrl;
        return;
      }
      const finalFallbackUrl = image.dataset.finalFallbackSrc
        ? new URL(image.dataset.finalFallbackSrc, location.href).href
        : null;
      if (finalFallbackUrl && image.dataset.finalFallbackAttempted !== "true" && image.src !== finalFallbackUrl) {
        image.dataset.finalFallbackAttempted = "true";
        image.dataset.finalFallbackUsed = "true";
        image.src = finalFallbackUrl;
      }
    });
  });
}

function renderStaticPokemonArtwork() {
  document.querySelectorAll("img[data-static-pokemon-id]").forEach((image) => {
    const pokedexId = Number(image.dataset.staticPokemonId);
    if (!Number.isInteger(pokedexId)) return;
    delete image.dataset.pixelFallbackAttempted;
    const artwork = pokemonAnimatedArtworkUrl(pokedexId);
    if (image.src !== artwork) image.src = artwork;
  });
}

function gameTransition(previousGame, nextGame) {
  if (!previousGame || previousGame.status === "lobby" || nextGame.status === "lobby"
    || previousGame.status === "finished" && nextGame.status === "playing") {
    return { events: [], replacementCardIds: [] };
  }

  const events = [];
  const actionChanged = previousGame.lastAction !== nextGame.lastAction;
  const evolutionPlayer = actionChanged
    ? nextGame.players.find((player) => nextGame.lastAction?.startsWith(`${player.name} evolved `))
    : null;
  let evolutionTargetId = null;
  let evolutionEvent = null;

  for (const player of nextGame.players) {
    const previousPlayer = previousGame.players.find((candidate) => candidate.id === player.id);
    if (!previousPlayer) continue;
    const previousCardIds = new Set(previousPlayer.cards.map((card) => card.id));
    const nextCardIds = new Set(player.cards.map((card) => card.id));
    const addedCards = player.cards.filter((card) => !previousCardIds.has(card.id));
    const removedCards = previousPlayer.cards.filter((card) => !nextCardIds.has(card.id));

    if (evolutionPlayer?.id === player.id) {
      const actionText = nextGame.lastAction.slice(`${player.name} evolved `.length);
      const separatorIndex = actionText.lastIndexOf(" into ");
      const sourceName = separatorIndex >= 0 ? actionText.slice(0, separatorIndex) : "";
      const targetName = separatorIndex >= 0 ? actionText.slice(separatorIndex + 6) : "";
      const target = addedCards.find((card) => card.name === targetName) ?? addedCards.at(-1);
      const source = removedCards.find((card) => card.name === sourceName) ?? removedCards.at(-1);
      if (target) {
        evolutionTargetId = target.id;
        evolutionEvent = { type: "evolve", playerName: player.name, source, card: target };
      }
    }

    for (const card of addedCards) {
      if (card.id === evolutionTargetId) continue;
      events.push({ type: "caught", playerName: player.name, card });
    }
  }
  if (evolutionEvent) events.push(evolutionEvent);

  if (actionChanged && nextGame.lastAction?.includes(" reserved ")) {
    const player = nextGame.players.find((candidate) => nextGame.lastAction.startsWith(`${candidate.name} reserved `));
    const previousPlayer = previousGame.players.find((candidate) => candidate.id === player?.id);
    const previousReservedIds = new Set((previousPlayer?.reserved ?? []).map((card) => card.id));
    const card = player?.reserved?.find((candidate) => !previousReservedIds.has(candidate.id));
    events.push({ type: "reserve", playerName: player?.name ?? t("trainers"), card });
  }

  if (previousGame.status !== "finished" && nextGame.status === "finished") {
    const winner = nextGame.players.find((player) => player.id === nextGame.winnerId);
    events.push({ type: "victory", playerName: winner?.name ?? t("trainers") });
  }

  const previousMarketIds = new Set(previousGame.market.flat().map((card) => card.id));
  const replacementCardIds = nextGame.market.flat()
    .filter((card) => !previousMarketIds.has(card.id))
    .map((card) => card.id);
  return { events, replacementCardIds };
}

function animationSpriteMarkup(card, className) {
  if (!card) return "";
  return `<img class="${className}" data-pokemon-sprite src="${pokemonAnimatedArtworkUrl(card.pokedexId)}" data-fallback-src="/assets/pokemon/${card.pokedexId}.png" alt="${escapeHtml(pokemonName(card))}">`;
}

function animationSparkles(count = 12) {
  return Array.from({ length: count }, (_, index) => `<i style="--x:${(index * 37 + 11) % 96}%;--y:${(index * 61 + 7) % 90}%;--delay:${(index % 7) * 90}ms;--spin:${index % 2 ? 1 : -1}"></i>`).join("");
}

function gameAnimationMarkup(event) {
  if (event.type === "caught") {
    const specialLabel = event.card.classification === "mythical" ? t("mythicalEncounter")
      : event.card.kind === "legendary" ? t("legendaryEncounter")
      : event.card.kind === "rare" ? t("rareEncounter") : "";
    return `
      <div class="animation-sparkles" aria-hidden="true">${animationSparkles(event.card.kind === "legendary" ? 24 : 14)}</div>
      <div class="catch-animation-stage" aria-hidden="true">
        ${animationSpriteMarkup(event.card, "caught-animation-pokemon")}
        <span class="catch-capture-flash"></span>
        <img class="catch-pokeball" src="${tokenImages.poke}" alt="">
      </div>
      ${specialLabel ? `<p class="animation-kicker">${specialLabel}</p>` : ""}
      <h2>${t("animationCaught", { name: escapeHtml(event.playerName), pokemon: escapeHtml(pokemonName(event.card)) })}</h2>
    `;
  }
  if (event.type === "reserve") {
    return `
      <div class="reserve-animation-stage" aria-hidden="true">
        <div class="reserve-grass"></div>
        <div class="reserve-animation-card"><span>?</span><i></i></div>
        <img class="reserve-master-ball" src="${tokenImages.master}" alt="">
      </div>
      <h2>${t("animationReserved", { name: escapeHtml(event.playerName) })}</h2>
    `;
  }
  if (event.type === "evolve") {
    return `
      <div class="animation-sparkles evolution-sparkles" aria-hidden="true">${animationSparkles(20)}</div>
      <div class="evolution-animation-stage" aria-hidden="true">
        ${animationSpriteMarkup(event.source, "evolution-source-pokemon")}
        <span class="evolution-flash"></span>
        ${animationSpriteMarkup(event.card, "evolution-target-pokemon")}
      </div>
      <h2>${t("animationEvolved", { name: escapeHtml(event.playerName) })}</h2>
      <p>${event.source ? `${escapeHtml(pokemonName(event.source))} → ` : ""}${escapeHtml(pokemonName(event.card))}</p>
    `;
  }
  return `
    <div class="victory-confetti" aria-hidden="true">${animationSparkles(32)}</div>
    <div class="victory-emblem" aria-hidden="true"><span>★</span><i></i></div>
    <p class="animation-kicker">18 ${t("pointsShort")}</p>
    <h2>${t("animationVictory", { name: escapeHtml(event.playerName) })}</h2>
  `;
}

function playPokemonCry(crySource, delay = 0) {
  const play = () => {
    if (!sfxEnabled || !crySource) return;
    if (activePokemonAudio) {
      activePokemonAudio.pause();
      activePokemonAudio.currentTime = 0;
    }
    const audio = new Audio(crySource);
    activePokemonAudio = audio;
    audio.volume = sfxVolume;
    audio.addEventListener("ended", () => {
      if (activePokemonAudio === audio) activePokemonAudio = null;
    });
    audio.play().catch(() => {
      if (activePokemonAudio === audio) activePokemonAudio = null;
    });
  };
  if (delay > 0) window.setTimeout(play, delay);
  else play();
}

function playTurnReminder() {
  if (!sfxEnabled) return;
  const reminderTrack = localBgmTracks.find(({ name }) =>
    name.toLowerCase().includes("trainer appears (boy version)")
  );
  if (!reminderTrack) return;
  if (activeTurnReminderAudio) {
    activeTurnReminderAudio.pause();
    activeTurnReminderAudio.currentTime = 0;
  }
  const audio = new Audio(reminderTrack.url);
  activeTurnReminderAudio = audio;
  audio.volume = sfxVolume;
  audio.addEventListener("ended", () => {
    if (activeTurnReminderAudio === audio) activeTurnReminderAudio = null;
  });
  audio.play().catch(() => {
    if (activeTurnReminderAudio === audio) activeTurnReminderAudio = null;
  });
  window.setTimeout(() => {
    if (activeTurnReminderAudio !== audio) return;
    audio.pause();
    audio.currentTime = 0;
    activeTurnReminderAudio = null;
  }, 2600);
}

function notifyMyTurn(previousGame, nextGame) {
  const nextPlayerId = nextGame.status === "playing" ? nextGame.players[nextGame.turnIndex]?.id : null;
  if (!session || nextPlayerId !== session.playerId) return;
  const previousPlayerId = previousGame?.status === "playing"
    ? previousGame.players[previousGame.turnIndex]?.id
    : null;
  if (previousPlayerId !== session.playerId) playTurnReminder();
}

function playNextGameAnimation() {
  if (gameAnimationRunning || !gameAnimationQueue.length) return;
  const event = gameAnimationQueue.shift();
  gameAnimationRunning = true;
  if (event.type === "reveal") {
    const card = game?.market.flat().find((candidate) => candidate.id === event.cardId);
    const cardElement = elements.market.querySelector(`[data-card-id="${CSS.escape(event.cardId)}"]`);
    pendingRevealCardIds.delete(event.cardId);
    cardElement?.classList.remove("market-card-pending-reveal");
    if (!card || !cardElement) {
      gameAnimationRunning = false;
      playNextGameAnimation();
      return;
    }
    const image = cardElement.querySelector("[data-pokemon-sprite]");
    if (image?.dataset.animatedSrc) image.src = `${image.dataset.animatedSrc}?reveal=${Date.now()}`;
    cardElement.classList.add("market-card-reveal");
    if (!isPokemonMystery(card)) playPokemonCry(pokemonCryUrl(card.pokedexId), 300);
    window.setTimeout(() => {
      cardElement.classList.remove("market-card-reveal");
      gameAnimationRunning = false;
      playNextGameAnimation();
    }, 1200);
    return;
  }
  const specialClass = event.card?.kind === "legendary" ? " legendary-animation"
    : event.card?.kind === "rare" ? " rare-animation" : "";
  elements.gameAnimation.className = `game-animation ${event.type}-animation${specialClass}`;
  elements.gameAnimation.innerHTML = `<div class="game-animation-scene">${gameAnimationMarkup(event)}</div>`;
  installImageFallbacks(elements.gameAnimation);
  if (event.type === "caught") playPokemonCry(pokemonCryUrl(event.card.pokedexId));
  if (event.type === "evolve") playPokemonCry(pokemonCryUrl(event.card.pokedexId), 1350);
  const duration = event.type === "victory" ? 4300 : event.type === "evolve" ? 3200 : specialClass ? 3000 : 2300;
  window.setTimeout(() => elements.gameAnimation.classList.add("animation-leaving"), duration - 350);
  window.setTimeout(() => {
    elements.gameAnimation.className = "game-animation hidden";
    elements.gameAnimation.innerHTML = "";
    gameAnimationRunning = false;
    playNextGameAnimation();
  }, duration);
}

function presentGameTransition(transition) {
  if (!transition) return;
  for (const cardId of transition.replacementCardIds) {
    pendingRevealCardIds.add(cardId);
    elements.market.querySelector(`[data-card-id="${CSS.escape(cardId)}"]`)
      ?.classList.add("market-card-pending-reveal");
  }
  gameAnimationQueue.push(...transition.events);
  gameAnimationQueue.push(...transition.replacementCardIds.map((cardId) => ({ type: "reveal", cardId })));
  playNextGameAnimation();
}

function useGameState(nextGame) {
  notifyMyTurn(game, nextGame);
  serverClockOffset = (nextGame.serverNow ?? Date.now()) - Date.now();
  return nextGame;
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { "content-type": "application/json", ...options.headers }
  });
  const data = await response.json();
  if (!response.ok) {
    const rawMessage = data.error || "Something went wrong.";
    const error = new Error(localizeError(rawMessage));
    error.rawMessage = rawMessage;
    throw error;
  }
  return data;
}

async function loadCatalog() {
  try {
    catalog = await api("/api/catalog");
    catalog.forEach((card) => {
      if (card.nameZh) pokemonNamesZh[card.name] = card.nameZh;
    });
    renderPokedex();
  } catch (error) {
    showToast(error.message, true);
  }
}

async function loadMusicCatalog() {
  try {
    localBgmTracks = await api("/api/music");
  } catch {
    localBgmTracks = [];
  }
  if (!localBgmTracks.some(({ id }) => id === selectedBgmId)) {
    selectedBgmId = localBgmTracks.find(({ name }) => name.includes("Pallet Town Theme"))?.id
      ?? localBgmTracks[0]?.id
      ?? "";
    if (selectedBgmId) localStorage.setItem("pokemon-splendor-bgm", selectedBgmId);
    else localStorage.removeItem("pokemon-splendor-bgm");
  }
  renderAudioControls();
}

function showToast(message, isError = false) {
  elements.toast.textContent = message;
  elements.toast.classList.toggle("error", isError);
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => elements.toast.classList.remove("show"), 2400);
}

function setView(view) {
  document.body.classList.toggle("game-active", view === "game");
  document.body.classList.toggle("welcome-active", view === "welcome");
  document.body.classList.toggle("lobby-active", view === "lobby");
  elements.welcomeView.classList.toggle("hidden", view !== "welcome");
  elements.lobbyView.classList.toggle("hidden", view !== "lobby");
  elements.gameView.classList.toggle("hidden", view !== "game");
  elements.roomBadge.classList.toggle("hidden", view === "welcome");
  elements.exitRoomButton.classList.toggle("hidden", view === "welcome" || !session || !game);
  elements.endGameButton.classList.toggle("hidden", view !== "game" || !session || !game
    || session.playerId !== game.hostId || game.status === "lobby");
  if (session) elements.roomBadge.textContent = t("room", { code: session.code });
  if (session && game) {
    const isHost = session.playerId === game.hostId;
    const label = t(isHost ? "disbandRoom" : "leaveRoom");
    elements.exitRoomButton.querySelector("b").textContent = label;
    elements.exitRoomButton.title = label;
  }
}

function applyGameBackground() {
  const selected = gameBackgrounds.find((background) => background.id === selectedGameBackgroundId) ?? gameBackgrounds[0];
  document.body.dataset.gameBackground = selected.id;
  if (selected.image) document.body.style.setProperty("--game-map-image", `url('${selected.image}')`);
  else document.body.style.removeProperty("--game-map-image");
}

function renderBackgroundSelector() {
  elements.backgroundSelect.innerHTML = gameBackgrounds.map((background) =>
    `<option value="${background.id}">${t(background.labelKey)}</option>`
  ).join("");
  elements.backgroundSelect.value = selectedGameBackgroundId;
  elements.backgroundSelect.setAttribute("aria-label", t("gameBackground"));
  elements.backgroundSelect.title = t("gameBackground");
}

function renderAudioControls() {
  elements.bgmSelect.innerHTML = localBgmTracks.length ? `
    <optgroup label="${t("bgmLocal")}">
      ${localBgmTracks.map((track) => `<option value="${escapeHtml(track.id)}">${escapeHtml(track.name)}</option>`).join("")}
    </optgroup>
  ` : `<option value="">${t("bgmUnavailable")}</option>`;
  elements.bgmSelect.value = selectedBgmId;
  elements.bgmSelect.disabled = !localBgmTracks.length || !bgmEnabled;
  elements.bgmSelect.setAttribute("aria-label", t("bgm"));
  elements.bgmSelect.title = t("bgm");
  const soundLabel = t(bgmEnabled ? "bgmOn" : "bgmOff");
  elements.soundButton.setAttribute("aria-pressed", String(bgmEnabled));
  elements.soundButton.setAttribute("aria-label", soundLabel);
  elements.soundButton.title = soundLabel;
  elements.soundButton.querySelector("span").textContent = bgmEnabled ? "🔊" : "🔇";
  elements.soundButton.querySelector("b").textContent = soundLabel;
  elements.bgmEnabledInput.checked = bgmEnabled;
  elements.sfxEnabledInput.checked = sfxEnabled;
  elements.bgmVolumeInput.disabled = !bgmEnabled;
  elements.sfxVolumeInput.disabled = !sfxEnabled;
  renderAudioLevels();
}

function renderSettingsControls() {
  elements.model3dEnabled.checked = model3dEnabled;
}

function renderAudioLevels() {
  elements.bgmVolumeInput.value = String(Math.round(bgmVolume * 100));
  elements.bgmVolumeValue.textContent = `${Math.round(bgmVolume * 100)}%`;
  elements.sfxVolumeInput.value = String(Math.round(sfxVolume * 100));
  elements.sfxVolumeValue.textContent = `${Math.round(sfxVolume * 100)}%`;
}

function lowHealthTimerTrack() {
  return localBgmTracks.find(({ name }) => name.toLowerCase().includes("low-health-critical-health-pokemon"))
    ?? localBgmTracks.find(({ name }) => /low health|critical health/.test(name.toLowerCase()))
    ?? {
      id: "timer:low-health-critical-health-pokemon",
      name: "Low Health / Critical Health Pokémon",
      url: "/assets/musics/low-health-critical-health-pokemon.mp3"
    };
}

async function startBgm() {
  if (!bgmEnabled) return;
  const localTrack = localBgmTracks.find(({ id }) => id === selectedBgmId);
  if (!localTrack) return;
  if (!activeBgmAudio || activeBgmAudioId !== localTrack.id) {
    if (activeBgmAudio) activeBgmAudio.pause();
    activeBgmAudio = new Audio(localTrack.url);
    activeBgmAudio.loop = true;
    activeBgmAudio.volume = bgmVolume;
    activeBgmAudioId = localTrack.id;
  }
  activeBgmAudio.play().catch(() => {});
}

function stopBgm({ reset = false } = {}) {
  if (activeBgmAudio) {
    activeBgmAudio.pause();
    if (reset) {
      activeBgmAudio.currentTime = 0;
      activeBgmAudio = null;
      activeBgmAudioId = null;
    }
  }
}

function stopTimerMusic() {
  if (activeTimerMusicAudio) {
    activeTimerMusicAudio.pause();
    activeTimerMusicAudio.currentTime = 0;
    activeTimerMusicAudio = null;
  }
  timerMusicTurnKey = null;
}

function startLowHealthTimerMusic(turnKey) {
  if (!sfxEnabled) return false;
  const timerTrack = lowHealthTimerTrack();
  if (!timerTrack) return false;
  if (activeTimerMusicAudio && timerMusicTurnKey === turnKey) return true;
  stopTimerMusic();
  const audio = new Audio(timerTrack.url);
  activeTimerMusicAudio = audio;
  timerMusicTurnKey = turnKey;
  audio.loop = true;
  audio.volume = sfxVolume;
  audio.play().catch(() => {
    if (activeTimerMusicAudio === audio) {
      activeTimerMusicAudio = null;
      timerMusicTurnKey = null;
    }
  });
  return true;
}

function restartBgm() {
  stopBgm({ reset: true });
  if (bgmEnabled) startBgm();
}

function setBgmEnabled(enabled) {
  bgmEnabled = Boolean(enabled);
  localStorage.setItem("pokemon-splendor-bgm-enabled", String(bgmEnabled));
  localStorage.removeItem("pokemon-splendor-sound");
  if (bgmEnabled) startBgm();
  else stopBgm();
  renderAudioControls();
}

function setBgmVolume(percent) {
  const nextVolume = Number(percent);
  if (!Number.isFinite(nextVolume)) return;
  bgmVolume = Math.min(1, Math.max(0, nextVolume / 100));
  localStorage.setItem("pokemon-splendor-bgm-volume", String(bgmVolume));
  if (activeBgmAudio) activeBgmAudio.volume = bgmVolume;
  renderAudioLevels();
}

function setSfxVolume(percent) {
  const nextVolume = Number(percent);
  if (!Number.isFinite(nextVolume)) return;
  sfxVolume = Math.min(1, Math.max(0, nextVolume / 100));
  localStorage.setItem("pokemon-splendor-sfx-volume", String(sfxVolume));
  if (activePokemonAudio) activePokemonAudio.volume = sfxVolume;
  if (activeTurnReminderAudio) activeTurnReminderAudio.volume = sfxVolume;
  if (activeTimerMusicAudio) activeTimerMusicAudio.volume = sfxVolume;
  renderAudioLevels();
}

function stopSoundEffects() {
  for (const audio of [activePokemonAudio, activeTurnReminderAudio, activeTimerMusicAudio]) {
    if (!audio) continue;
    audio.pause();
    audio.currentTime = 0;
  }
  activePokemonAudio = null;
  activeTurnReminderAudio = null;
  activeTimerMusicAudio = null;
  timerMusicTurnKey = null;
}

function pokemonCardArtworkMarkup(card, mystery) {
  const artwork = pokemonAnimatedArtworkUrl(card.pokedexId);
  return `<img class="${mystery ? "mystery-silhouette" : ""}" data-pokemon-sprite src="${artwork}" data-fallback-src="/assets/pokemon/${card.pokedexId}.png" data-animated-src="${artwork}" alt="${mystery ? "" : escapeHtml(pokemonDisplayName(card))}" loading="lazy">`;
}

function setEntryMode(mode) {
  entryMode = mode;
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === mode));
  elements.roomCodeField.classList.toggle("hidden", mode !== "join");
  elements.roomCode.required = mode === "join";
  elements.roomSubmit.textContent = mode === "create" ? t("createPrivateRoom") : t("joinPrivateRoom");
  elements.formError.textContent = "";
}

function trainerInitial(name) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function trainerCardById(trainerCardId) {
  return trainerCards.find((card) => card.id === trainerCardId);
}

function trainerAvatarMarkup(player) {
  const trainerCard = trainerCardById(player.trainerCardId);
  if (!trainerCard) return `<span class="trainer-avatar">${escapeHtml(trainerInitial(player.name))}</span>`;
  return `<span class="trainer-avatar partner-avatar ${trainerCard.id}"><img data-pokemon-sprite src="${pokemonPixelSpriteUrl(trainerCard.pokedexId)}" data-fallback-src="/assets/pokemon/${trainerCard.pokedexId}.png" alt=""></span>`;
}

async function updateLobbyOption(operation, payload) {
  if (busy || !session) return;
  busy = true;
  renderLobby();
  try {
    game = useGameState(await api(`/api/rooms/${session.code}/${operation}`, {
      method: "POST",
      body: JSON.stringify({ playerId: session.playerId, playerKey: session.playerKey, ...payload })
    }));
  } catch (error) {
    showToast(error.message, true);
  } finally {
    busy = false;
    renderLobby();
  }
}

function renderLobby() {
  setView("lobby");
  applyGameBackground();
  elements.largeRoomCode.textContent = session.code;
  const isHost = session.playerId === game.hostId;
  const self = myPlayer();
  const everyTrainerChosen = game.players.every((player) => player.trainerCardId);

  elements.lobbyPlayers.innerHTML = game.players.map((player) => {
    const trainerCard = trainerCardById(player.trainerCardId);
    const status = [player.id === game.hostId ? t("host") : t("ready"), trainerCard ? t(trainerCard.labelKey) : null].filter(Boolean).join(" · ");
    return `
      <div class="lobby-player">
        ${trainerAvatarMarkup(player)}
        <strong>${escapeHtml(player.name)}</strong>
        <small>${status}</small>
      </div>
    `;
  }).join("");

  elements.trainerChoices.innerHTML = trainerCards.map((trainerCard) => {
    const owner = game.players.find((player) => player.trainerCardId === trainerCard.id);
    const selected = owner?.id === session.playerId;
    const unavailable = owner && !selected;
    return `
      <button class="trainer-choice ${trainerCard.styleId ?? trainerCard.id} ${selected ? "selected" : ""}" data-trainer-card="${trainerCard.id}" type="button" ${busy || unavailable ? "disabled" : ""}>
        <span class="trainer-choice-art">
          <img class="trainer-main-art" data-trainer-sprite data-art-mode="${model3dEnabled ? "hd" : "pixel"}" src="${trainerArtworkUrl(trainerCard)}" data-fallback-src="${trainerCard.image}" data-final-fallback-src="${model3dEnabled ? trainerCard.fallbackImage : ""}" alt="${escapeHtml(t(trainerCard.labelKey))}">
          <img class="trainer-partner-art" data-pokemon-sprite src="${pokemonAnimatedArtworkUrl(trainerCard.pokedexId)}" data-fallback-src="/assets/pokemon/${trainerCard.pokedexId}.png" alt="" aria-hidden="true">
        </span>
        <strong>${t(trainerCard.labelKey)}</strong>
        <small>${owner ? t("chosenBy", { name: escapeHtml(owner.name) }) : t("available")}</small>
      </button>
    `;
  }).join("");
  elements.trainerChoices.querySelectorAll("[data-trainer-card]").forEach((button) => {
    button.addEventListener("click", () => updateLobbyOption("trainer", { trainerCardId: button.dataset.trainerCard }));
  });

  const configuredTimerSeconds = pendingTimerSeconds ?? game.turnDurationSeconds ?? 0;
  elements.timerEnabled.checked = configuredTimerSeconds > 0;
  if (configuredTimerSeconds > 0) elements.timerSeconds.value = String(configuredTimerSeconds);
  elements.timerEnabled.disabled = busy || !isHost;
  elements.timerSeconds.disabled = busy || !isHost || configuredTimerSeconds === 0;
  elements.timerHint.textContent = isHost ? t("timerHostHelp") : t("timerGuestHelp");
  elements.silhouetteEnabled.checked = Boolean(game.silhouetteMode);
  elements.silhouetteEnabled.disabled = busy || !isHost;
  elements.silhouetteHint.textContent = isHost ? t("silhouetteHelp") : t("silhouetteGuestHelp");
  elements.startGame.disabled = game.players.length < 2 || !everyTrainerChosen || busy;
  elements.lobbyHint.textContent = !self?.trainerCardId
    ? t("chooseTrainerFirst")
    : game.players.length < 2
      ? t("waitingTrainer")
      : !everyTrainerChosen
        ? t("waitingTrainerCards")
        : t("trainersReady", { count: game.players.length });
}

function tokenMarkup(type, count, className = "mini-token") {
  return `<span class="${className}" style="--token-color:${colors[type]}" title="${ballLabel(type)}"><img src="${tokenImages[type]}" alt=""></span><span>${count}</span>`;
}

function myPlayer() {
  return game?.players.find((player) => player.id === session?.playerId);
}

function canAfford(player, card) {
  if (!player) return false;
  let masterNeeded = card.masterCost ?? 0;
  for (const type of gemTypes) {
    const required = Math.max(0, (card.cost[type] ?? 0) - player.bonuses[type]);
    masterNeeded += Math.max(0, required - player.tokens[type]);
  }
  return masterNeeded <= player.tokens.master;
}

function playerTokenTotal(player) {
  return allTokenTypes.reduce((total, type) => total + (player?.tokens[type] ?? 0), 0);
}

function evolutionRequirementMet(player, source) {
  return Boolean(source?.evolution && Object.entries(source.evolution.requiredBonuses)
    .every(([type, required]) => player?.bonuses[type] >= required));
}

function evolutionSourceForTarget(player, target) {
  return player?.cards.find((source) => source.evolution?.evolvesTo === target.name
    && evolutionRequirementMet(player, source));
}

function evolutionTargetForSource(player, source) {
  if (!source?.evolution) return null;
  return [...(game?.market?.flat() ?? []), ...(player?.reserved ?? [])].find((target) =>
    !isPokemonMystery(target)
    && target.name === source.evolution.evolvesTo
    && evolutionSourceForTarget(player, target)?.id === source.id
  ) ?? null;
}

function isPokemonRevealed(card) {
  return (game?.caughtPokedexIds ?? []).includes(card.pokedexId)
    || game?.players.some((player) => player.cards.some((ownedCard) => ownedCard.pokedexId === card.pokedexId));
}

function isPokemonMystery(card) {
  return Boolean(game?.silhouetteMode && game.status !== "lobby" && !isPokemonRevealed(card));
}

function pokemonDisplayName(card) {
  return isPokemonMystery(card) ? t("unknownPokemon") : pokemonName(card);
}

function speciesDisplayName(name) {
  const species = catalog.find((card) => card.name === name);
  return species ? pokemonDisplayName(species) : pokemonName(name);
}

function renderTokenBank(isMyTurn) {
  const player = myPlayer();
  const isDiscardPhase = isMyTurn && game.turnPhase === "discard";
  elements.tokenBank.innerHTML = allTokenTypes.map((type) => `
    <button class="token-button ${(isDiscardPhase ? selectedReturns[type] > 0 : selectedTokens.has(type)) ? "selected" : ""} ${type === "master" ? "master-token" : ""}" data-token="${type}" type="button" ${isDiscardPhase ? player.tokens[type] < 1 : type === "master" || !isMyTurn || game.turnPhase !== "action" || game.supply[type] < 1 ? "disabled" : ""}>
      <span class="token-orb" style="--token-color:${colors[type]}"><img src="${tokenImages[type]}" alt=""></span>
      <strong>${ballLabel(type)}</strong>
      <small>${isDiscardPhase ? `${selectedReturns[type]} / ${player.tokens[type]}` : t("left", { count: game.supply[type] })}</small>
    </button>
  `).join("");
  elements.tokenBank.querySelectorAll("[data-token]").forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.token;
      if (isDiscardPhase) {
        selectedReturns[type] = (selectedReturns[type] + 1) % (player.tokens[type] + 1);
        renderTokenBank(isMyTurn);
        return;
      }
      if (type === "master") return;
      if (selectedTokens.has(type)) selectedTokens.delete(type);
      else if (selectedTokens.size < 3) selectedTokens.add(type);
      renderTokenBank(isMyTurn);
      updateTokenActions(isMyTurn);
    });
  });
  updateTokenActions(isMyTurn);
}

function updateTokenActions(isMyTurn) {
  const player = myPlayer();
  const phase = game.turnPhase ?? "action";
  const isDiscardPhase = isMyTurn && phase === "discard";
  const isEvolutionPhase = isMyTurn && phase === "evolve";
  elements.takeThree.classList.toggle("hidden", isEvolutionPhase);
  elements.takePair.classList.toggle("hidden", isDiscardPhase || isEvolutionPhase);
  elements.endTurn.classList.toggle("hidden", !isEvolutionPhase);
  if (isDiscardPhase) {
    const excess = playerTokenTotal(player) - 10;
    const selectedCount = Object.values(selectedReturns).reduce((total, count) => total + count, 0);
    elements.takeThree.textContent = `${t("returnBalls")} (${selectedCount}/${excess})`;
    elements.takeThree.disabled = busy || selectedCount !== excess;
    return;
  }
  const [singleType] = selectedTokens;
  const availableColors = gemTypes.filter((type) => game.supply[type] > 0).length;
  const requiredColors = Math.min(3, availableColors);
  elements.takeThree.textContent = requiredColors === 3 ? t("takeThree") : t("takeAvailable");
  elements.takeThree.disabled = busy || !isMyTurn || phase !== "action" || requiredColors < 1 || selectedTokens.size !== requiredColors;
  elements.takePair.disabled = busy || !isMyTurn || phase !== "action" || selectedTokens.size !== 1 || game.supply[singleType] < 4;
  elements.endTurn.disabled = busy || !isEvolutionPhase;
}

function costMarkup(card) {
  const costs = [
    ...Object.entries(card.cost),
    ...(card.masterCost ? [["master", card.masterCost]] : [])
  ];
  if (!costs.length) return `<span class="helper-text">${t("free")}</span>`;
  return costs.map(([type, count]) => `
    <span class="cost-token"><img src="${tokenImages[type]}" alt="${ballLabel(type)}">${count}</span>
  `).join("");
}

function evolutionCardMarkup(card, mystery) {
  if (!card.evolution) return "";
  const targetName = mystery ? t("evolution") : speciesDisplayName(card.evolution.evolvesTo);
  const evolutionTitle = mystery ? t("evolution") : t("evolvesTo", { pokemon: targetName });
  const requirementTitle = Object.entries(card.evolution.requiredBonuses)
    .map(([type, required]) => t("evolutionRequirement", { count: required, ball: ballLabel(type) }))
    .join(", ");
  const requirements = Object.entries(card.evolution.requiredBonuses).map(([type, required]) =>
    Array.from({ length: required }, () => `<img src="${tokenImages[type]}" alt="" aria-hidden="true">`).join("")
  ).join("");
  return `
    <span class="evolution-card-rule" title="${escapeHtml(`${evolutionTitle} · ${requirementTitle}`)}" aria-label="${escapeHtml(`${evolutionTitle} · ${requirementTitle}`)}">
      ${requirements}
    </span>
  `;
}

function playPokemonPreview(button) {
  if (button.disabled) return;
  const image = button.querySelector("img");
  if (!image) return;
  button.classList.add("preview-playing");
  image.src = `${image.dataset.animatedSrc}?play=${Date.now()}`;
  window.setTimeout(() => button.classList.remove("preview-playing"), 1200);

  playPokemonCry(button.dataset.crySrc);
}

function ballCardShellMarkup(type) {
  const shell = {
    poke: `
      <rect width="100" height="44" fill="#df202c"/>
      <rect y="50" width="100" height="50" fill="#f1f2f8"/>
    `,
    great: `
      <rect width="100" height="44" fill="#1399d0"/>
      <polygon points="0,4 27,10 37,23 27,36 0,24" fill="#ff5f70"/>
      <polygon points="100,4 73,10 63,23 73,36 100,24" fill="#ff5f70"/>
      <rect y="50" width="100" height="50" fill="#f1f2f8"/>
    `,
    ultra: `
      <rect width="100" height="44" fill="#f1d166"/>
      <path d="M28 44 L32 8 Q50 -4 68 8 L72 44 Z" fill="#3d3e40"/>
      <rect y="50" width="100" height="50" fill="#f1f2f8"/>
    `,
    heal: `
      <rect width="100" height="100" fill="#fff8d9"/>
      <ellipse cx="50" cy="48" rx="31" ry="56" fill="#dda5cc"/>
      <ellipse cx="18" cy="14" rx="8" ry="12" fill="rgba(255,255,255,.92)"/>
      <ellipse cx="82" cy="14" rx="8" ry="12" fill="rgba(255,255,255,.92)"/>
    `,
    quick: `
      <rect width="100" height="100" fill="#e1bd37"/>
      <polygon points="34,0 66,0 56,22 50,14 44,22" fill="#397bc0"/>
      <polygon points="0,12 40,39 29,48 0,39" fill="#397bc0"/>
      <polygon points="100,12 60,39 71,48 100,39" fill="#397bc0"/>
      <polygon points="0,65 30,53 39,62 16,100 0,100" fill="#397bc0"/>
      <polygon points="100,65 70,53 61,62 84,100 100,100" fill="#397bc0"/>
      <polygon points="42,67 50,57 58,67 67,100 33,100" fill="#397bc0"/>
    `
  }[type] ?? "";
  const bandColor = type === "heal" ? "#67598b" : "#25282d";
  return `
    <svg class="ball-card-shell" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      ${shell}
      <rect y="44" width="100" height="6" fill="${bandColor}"/>
    </svg>
  `;
}

function cardMarkup(card, isMyTurn, player) {
  const affordable = canAfford(player, card);
  const isActionPhase = isMyTurn && game.turnPhase === "action";
  const evolutionReadySource = isPokemonMystery(card) ? null : evolutionSourceForTarget(player, card);
  const evolutionSource = isMyTurn && game.turnPhase === "evolve" ? evolutionReadySource : null;
  const mayReserve = card.kind === "stage" && (player?.reserved.length ?? 3) < 3;
  const bonusTitle = card.bonusAmount === 2
    ? t("doubleBonus", { ball: ballLabel(card.bonus) })
    : t("permanentDiscount", { ball: ballLabel(card.bonus) });
  const mystery = isPokemonMystery(card);
  const displayName = pokemonDisplayName(card);
  return `
    <article class="pokemon-card bonus-${card.bonus} ${card.bonusAmount === 2 ? "double-bonus" : ""} ${card.kind !== "stage" ? `special-card ${card.kind}` : ""} ${affordable ? "affordable" : ""} ${evolutionReadySource ? "evolution-ready" : ""} ${pendingRevealCardIds.has(card.id) ? "market-card-pending-reveal" : ""}" data-card-id="${card.id}" aria-label="${escapeHtml(`${displayName} · ${bonusTitle}${evolutionReadySource ? ` · ${t("evolutionReady")}` : ""}`)}" style="--card-color:${colors[card.bonus]}">
      ${ballCardShellMarkup(card.bonus)}
      <div class="card-top">${card.points > 0 ? `<strong class="card-points">${card.points}</strong>` : ""}</div>
      <button class="pokemon-art" data-pokemon-preview="${card.pokedexId}" data-cry-src="${pokemonCryUrl(card.pokedexId)}" type="button" aria-label="${mystery ? escapeHtml(t("unknownPokemon")) : escapeHtml(t("previewPokemon", { pokemon: displayName }))}" ${mystery ? "disabled" : ""}>
        ${pokemonCardArtworkMarkup(card, mystery)}
        <h3 class="pokemon-nameplate ${mystery ? "mystery-name" : ""}">${escapeHtml(displayName)}</h3>
        ${evolutionCardMarkup(card, mystery)}
      </button>
      <div class="card-footer">
        <div class="card-details">
          <div class="cost-list">${costMarkup(card)}</div>
        </div>
        <div class="card-actions">
          ${evolutionSource
            ? `<button class="buy-button" data-action="evolve" data-card-id="${card.id}" data-source-id="${evolutionSource.id}" type="button" ${busy ? "disabled" : ""}>${t("evolve")}</button>`
            : `<button class="buy-button" data-action="buy" data-card-id="${card.id}" type="button" ${!isActionPhase || !affordable || busy ? "disabled" : ""}>${t("recruit")}</button>
               ${card.kind === "stage" ? `<button data-action="reserve" data-card-id="${card.id}" type="button" ${!isActionPhase || !mayReserve || busy ? "disabled" : ""}>${t("reserve")}</button>` : ""}`}
        </div>
      </div>
    </article>
  `;
}

function renderMarket(isMyTurn) {
  const player = myPlayer();
  const deckRows = [
    { index: 4, kind: "legendary", label: `${t("legendary")} / ${t("mythical")}` },
    { index: 3, kind: "rare", label: t("rare") },
    { index: 2, kind: "stage", label: t("tier"), stage: 3 },
    { index: 1, kind: "stage", label: t("tier"), stage: 2 },
    { index: 0, kind: "stage", label: t("tier"), stage: 1 }
  ];
  elements.market.innerHTML = deckRows.map(({ index, kind, label, stage }) => `
    <div class="tier-row ${kind}-tier ${stage ? `stage-${stage}-tier` : ""}">
      <div class="tier-label">
        <span>${label}${stage ? ` ${stage}` : ""}</span>
        <div class="deck-cover-art" title="${t("whoAmIPool")}" aria-label="${t("whoAmIPool")}">
          <span class="grass-layer grass-back" aria-hidden="true"></span>
          ${game.decks[index].coverPokedexId ? `<img data-pokemon-sprite src="${pokemonPixelSpriteUrl(game.decks[index].coverPokedexId)}" data-fallback-src="/assets/pokemon/${game.decks[index].coverPokedexId}.png" alt="">` : '<span class="empty-deck">—</span>'}
          <span class="grass-layer grass-front" aria-hidden="true"></span>
        </div>
        <small>${t("left", { count: game.decks[index].remaining })}</small>
        ${stage ? `<button class="deck-reserve-button" data-reserve-deck="${index}" type="button" ${!isMyTurn || game.turnPhase !== "action" || (player?.reserved.length ?? 3) >= 3 || game.decks[index].remaining < 1 || busy ? "disabled" : ""}>${t("reserveDeck")}</button>` : ""}
      </div>
      <div class="card-row">${game.market[index].map((card) => cardMarkup(card, isMyTurn, player)).join("")}</div>
    </div>
  `).join("");
  elements.market.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const actionType = button.dataset.action === "buy" ? "buyCard" : button.dataset.action === "evolve" ? "evolveCard" : "reserveCard";
      sendAction({ type: actionType, cardId: button.dataset.cardId, sourceCardId: button.dataset.sourceId });
    });
  });
  elements.market.querySelectorAll("[data-pokemon-preview]").forEach((button) => {
    button.addEventListener("click", () => playPokemonPreview(button));
  });
  elements.market.querySelectorAll("[data-reserve-deck]").forEach((button) => {
    button.addEventListener("click", () => sendAction({ type: "reserveTopCard", tierIndex: Number(button.dataset.reserveDeck) }));
  });
}

function resourceMarkup(player, source) {
  const types = source === "tokens" ? allTokenTypes : gemTypes;
  return types.filter((type) => player[source][type] > 0).map((type) => `
    <span class="resource">${tokenMarkup(type, player[source][type])}</span>
  `).join("") || `<span class="helper-text">${t("noneYet")}</span>`;
}

function collectionCardMarkup(card, { reserved = false, action = null, enabled = false, sourceCardId = null, evolutionReady = false, evolutionWaiting = false } = {}) {
  const mystery = reserved && isPokemonMystery(card);
  const name = mystery ? t("unknownPokemon") : pokemonName(card);
  const evolutionStatus = evolutionReady ? t("evolutionReady") : evolutionWaiting ? t("evolutionWaiting") : "";
  const title = `${name} · ${card.points} ${t("pointsShort")}${evolutionStatus ? ` · ${evolutionStatus}` : ""}`;
  const content = `
    ${card.points > 0 ? `<span class="collection-points">${card.points}</span>` : ""}
    <img class="${mystery ? "mystery-silhouette" : ""}" data-pokemon-sprite src="${pokemonAnimatedArtworkUrl(card.pokedexId)}" data-fallback-src="/assets/pokemon/${card.pokedexId}.png" alt="" loading="lazy">
    <span class="collection-name ${mystery ? "mystery-name" : ""}">${escapeHtml(name)}</span>
  `;
  if (action) {
    return `<button class="collection-card reserved" data-reserved-id="${card.id}" data-collection-action="${action}" ${sourceCardId ? `data-source-id="${sourceCardId}"` : ""} data-details-id="${card.id}" type="button" title="${escapeHtml(title)}" aria-label="${escapeHtml(action === "evolve" ? t("evolve") : t("catchPokemon", { pokemon: name }))}" aria-disabled="${enabled ? "false" : "true"}">${content}</button>`;
  }
  return `<article class="collection-card ${reserved ? "reserved" : "caught"} ${evolutionReady ? "evolution-ready" : evolutionWaiting ? "evolution-waiting" : ""}" data-details-id="${card.id}" tabindex="0" title="${escapeHtml(title)}">${content}</article>`;
}

function collectionDetailsMarkup(card, owner) {
  const mystery = isPokemonMystery(card);
  const name = pokemonDisplayName(card);
  const tierLabel = card.kind === "stage" ? `${t("tier")} ${card.tier}` : t(card.classification ?? card.kind);
  const bonusLabel = card.bonusAmount === 2
    ? t("doubleBonus", { ball: ballLabel(card.bonus) })
    : t("permanentDiscount", { ball: ballLabel(card.bonus) });
  const evolutionMarkup = card.evolution ? (() => {
    const requirements = Object.entries(card.evolution.requiredBonuses).map(([type, required]) => `
      <span class="evolution-requirement">
        <img src="${tokenImages[type]}" alt="">
        <span>${t("evolutionRequirement", { count: required, ball: ballLabel(type) })}<small>${t("bonusProgress", { current: owner?.bonuses[type] ?? 0, required })}</small></span>
      </span>
    `).join("");
    return `
      <div class="collection-tooltip-evolution">
        <b>${t("evolution")}</b>
        <strong>→ ${escapeHtml(speciesDisplayName(card.evolution.evolvesTo))}</strong>
        ${requirements}
        <small>${t("evolutionTarget")}</small>
      </div>
    `;
  })() : "";
  return `
    <div class="collection-tooltip-heading">
      <img class="${mystery ? "mystery-silhouette" : ""}" data-pokemon-sprite src="${pokemonAnimatedArtworkUrl(card.pokedexId)}" data-fallback-src="/assets/pokemon/${card.pokedexId}.png" alt="">
      <div><strong class="${mystery ? "mystery-name" : ""}">${escapeHtml(name)}</strong><small>${tierLabel} · ${card.points} ${t("pointsShort")}</small></div>
    </div>
    <div class="collection-tooltip-bonus"><img src="${tokenImages[card.bonus]}" alt="">${escapeHtml(bonusLabel)}</div>
    <div class="collection-tooltip-cost"><b>${t("cost")}</b><span>${costMarkup(card)}</span></div>
    ${evolutionMarkup}
  `;
}

function hideCollectionTooltip() {
  if (collectionTooltip) collectionTooltip.hidden = true;
}

function showCollectionTooltip(card, owner, anchor) {
  if (!collectionTooltip) {
    collectionTooltip = document.createElement("div");
    collectionTooltip.className = "collection-hover-card";
    collectionTooltip.setAttribute("role", "tooltip");
    document.body.append(collectionTooltip);
  }
  collectionTooltip.innerHTML = collectionDetailsMarkup(card, owner);
  installImageFallbacks(collectionTooltip);
  collectionTooltip.hidden = false;
  collectionTooltip.style.visibility = "hidden";

  const anchorRect = anchor.getBoundingClientRect();
  const tooltipRect = collectionTooltip.getBoundingClientRect();
  const left = Math.min(
    window.innerWidth - tooltipRect.width - 8,
    Math.max(8, anchorRect.left + anchorRect.width / 2 - tooltipRect.width / 2)
  );
  const above = anchorRect.top - tooltipRect.height - 8;
  const top = above >= 8
    ? above
    : Math.min(window.innerHeight - tooltipRect.height - 8, anchorRect.bottom + 8);
  collectionTooltip.style.left = `${left}px`;
  collectionTooltip.style.top = `${Math.max(8, top)}px`;
  collectionTooltip.style.visibility = "visible";
}

function renderPlayers(isMyTurn) {
  hideCollectionTooltip();
  if (selectedPlayerPanelId && !game.players.some((player) => player.id === selectedPlayerPanelId)) {
    selectedPlayerPanelId = null;
  }
  elements.players.classList.toggle("player-focus-mode", Boolean(selectedPlayerPanelId));
  elements.players.innerHTML = game.players.map((player, index) => {
    const isSelf = player.id === session.playerId;
    const isActive = index === game.turnIndex && game.status === "playing";
    const panelExpanded = !selectedPlayerPanelId || selectedPlayerPanelId === player.id;
    const reservedCount = player.reservedCount ?? player.reserved.length;
    const caughtCards = player.cards.map((card) => {
      const evolutionReady = isSelf && Boolean(evolutionTargetForSource(player, card));
      return collectionCardMarkup(card, {
        evolutionReady,
        evolutionWaiting: isSelf && !evolutionReady && evolutionRequirementMet(player, card)
      });
    }).join("");
    const reservedCards = isSelf ? player.reserved.map((card) => {
      const evolutionSource = isMyTurn && game.turnPhase === "evolve" ? evolutionSourceForTarget(player, card) : null;
      return collectionCardMarkup(card, {
        reserved: true,
        action: evolutionSource ? "evolve" : "buy",
        sourceCardId: evolutionSource?.id,
        enabled: isMyTurn && !busy && (evolutionSource ? true : game.turnPhase === "action" && canAfford(player, card))
      });
    }).join("") : "";
    const reservedContent = isSelf
      ? reservedCards || `<small>${t("noneYet")}</small>`
      : reservedCount > 0 ? `<small class="private-cards">${t("privateCards")}</small>` : `<small>${t("noneYet")}</small>`;
    return `
      <article class="player-card ${isActive ? "active" : ""} ${panelExpanded ? "expanded" : "collapsed"}"${panelExpanded ? "" : ` data-collapsed-player-card="${player.id}" tabindex="0" role="button" aria-label="${escapeHtml(`${t("expandPlayer")}: ${player.name}`)}"`}>
        <div class="player-header">
          ${trainerAvatarMarkup(player)}
          <h3>${escapeHtml(player.name)}${isSelf ? ` (${t("you")})` : ""}</h3>
          <span class="player-score">${player.points} <small>${t("pointsShort")}</small></span>
          <button class="player-card-focus-toggle" data-focus-player-card="${player.id}" type="button" aria-expanded="${String(panelExpanded)}" title="${t(panelExpanded && selectedPlayerPanelId ? "showAllPlayers" : "expandPlayer")}" aria-label="${t(panelExpanded && selectedPlayerPanelId ? "showAllPlayers" : "expandPlayer")}">${panelExpanded && selectedPlayerPanelId ? "⊞" : "⤢"}</button>
        </div>
        <div class="resource-line" title="Energy tokens">${resourceMarkup(player, "tokens")}</div>
        <div class="resource-line" title="Permanent discounts">${resourceMarkup(player, "bonuses")}</div>
        <div class="player-collections">
          <section class="collection-group">
            <header><span>${t("caughtPokemon")}</span><b>${player.cards.length}</b></header>
            <div class="collection-card-list">${caughtCards || `<small>${t("noneYet")}</small>`}</div>
          </section>
          <section class="collection-group">
            <header><span>${t("reservedPokemon")}</span><b>${reservedCount}</b></header>
            <div class="collection-card-list">${reservedContent}</div>
          </section>
        </div>
        <div class="tucked-count">↳ ${t("tuckedPokemon")}: <b>${player.tuckedCount ?? player.tucked?.length ?? 0}</b></div>
      </article>
    `;
  }).join("");
  elements.players.querySelectorAll("[data-reserved-id]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.getAttribute("aria-disabled") === "true") return;
      sendAction({
        type: button.dataset.collectionAction === "evolve" ? "evolveCard" : "buyCard",
        cardId: button.dataset.reservedId,
        sourceCardId: button.dataset.sourceId
      });
    });
  });
  elements.players.querySelectorAll("[data-focus-player-card]").forEach((button) => {
    button.addEventListener("click", () => {
      const { focusPlayerCard: playerId } = button.dataset;
      selectedPlayerPanelId = selectedPlayerPanelId === playerId ? null : playerId;
      renderPlayers(isMyTurn);
    });
  });
  elements.players.querySelectorAll("[data-collapsed-player-card]").forEach((card) => {
    const focusPlayer = () => {
      selectedPlayerPanelId = card.dataset.collapsedPlayerCard;
      renderPlayers(isMyTurn);
    };
    card.addEventListener("click", focusPlayer);
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      focusPlayer();
    });
  });
  elements.players.querySelectorAll("[data-details-id]").forEach((element) => {
    const owner = game.players.find((player) => [...player.cards, ...player.reserved].some((card) => card.id === element.dataset.detailsId));
    const card = [...(owner?.cards ?? []), ...(owner?.reserved ?? [])].find((candidate) => candidate.id === element.dataset.detailsId);
    if (!card || !owner) return;
    element.addEventListener("pointerenter", () => showCollectionTooltip(card, owner, element));
    element.addEventListener("pointerleave", hideCollectionTooltip);
    element.addEventListener("focus", () => showCollectionTooltip(card, owner, element));
    element.addEventListener("blur", hideCollectionTooltip);
    element.addEventListener("keydown", (event) => {
      if (event.key === "Escape") hideCollectionTooltip();
    });
  });
}

function formatTimer(seconds) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

function renderTurnTimer() {
  const timerActive = game?.status === "playing" && game.turnDurationSeconds > 0 && Number.isFinite(game.turnStartedAt);
  elements.turnTimer.classList.toggle("hidden", !timerActive);
  if (!timerActive) {
    if (timerMusicTurnKey || activeTimerMusicAudio) stopTimerMusic();
    return;
  }

  const deadline = game.turnStartedAt + game.turnDurationSeconds * 1000;
  const secondsRemaining = Math.max(0, Math.ceil((deadline - (Date.now() + serverClockOffset)) / 1000));
  const lowTime = secondsRemaining <= 10;
  const activePlayerId = game.players[game.turnIndex]?.id;
  const alertTurnKey = `${game.turnStartedAt}:${activePlayerId}`;
  const isMyTurn = activePlayerId === session?.playerId;
  elements.turnTimer.textContent = `${lowTime ? "⚠" : "⏱"} ${formatTimer(secondsRemaining)}`;
  elements.turnTimer.title = lowTime ? t("lowTimeAlert") : t("timeRemaining");
  elements.turnTimer.setAttribute("aria-label", lowTime
    ? `${t("lowTimeAlert")} ${secondsRemaining}`
    : `${t("timeRemaining")}: ${secondsRemaining}`);
  elements.turnTimer.classList.toggle("warning", lowTime);
  if (lowTime && isMyTurn && timerMusicTurnKey !== alertTurnKey) {
    startLowHealthTimerMusic(alertTurnKey);
  } else if ((!lowTime || !isMyTurn) && timerMusicTurnKey) {
    stopTimerMusic();
  }
}

function renderGame() {
  setView("game");
  applyGameBackground();
  syncCaughtPokemon();
  renderPokedex();
  const activePlayer = game.players[game.turnIndex];
  const isMyTurn = game.status === "playing" && activePlayer?.id === session.playerId;
  const winner = game.players.find((player) => player.id === game.winnerId);
  const isHost = session.playerId === game.hostId;
  elements.gameDecision.classList.toggle("hidden", game.status !== "finished");
  elements.restartGame.classList.toggle("hidden", !isHost);
  elements.restartGame.disabled = busy;
  elements.gameDecisionText.textContent = isHost ? t("hostDecision") : t("waitingDecision");

  if (game.status === "finished") {
    elements.turnLabel.textContent = t("gameComplete");
    elements.statusMessage.textContent = winner?.id === session.playerId ? t("yourChampion") : t("trainerChampion", { name: winner?.name ?? t("trainers") });
    elements.marketHint.textContent = t("finalScores");
  } else {
    elements.turnLabel.textContent = game.finalRoundTriggered ? t("finalRound") : isMyTurn ? t("yourTurn") : t("trainerTurn", { name: activePlayer.name });
    elements.statusMessage.textContent = isMyTurn
      ? game.turnPhase === "discard"
        ? t("returnExact", { count: playerTokenTotal(myPlayer()) - 10 })
        : game.turnPhase === "evolve" ? t("chooseEvolution") : t("chooseAction")
      : localizeAction(game.lastAction);
    elements.marketHint.textContent = isMyTurn ? game.turnPhase === "action" ? t("makeMove") : t("yourTurn") : t("watchingLive");
  }

  renderTokenBank(isMyTurn);
  renderMarket(isMyTurn);
  renderPlayers(isMyTurn);
  renderTurnTimer();
}

function render() {
  renderStaticPokemonArtwork();
  if (!game || !session) {
    setView("welcome");
    installImageFallbacks();
    return;
  }
  if (game.status === "lobby") renderLobby();
  else renderGame();
  installImageFallbacks();
}

async function refreshGame({ quiet = false } = {}) {
  if (!session) return;
  try {
    const nextGame = await api(`/api/rooms/${session.code}`, {
      headers: {
        "x-player-id": session.playerId,
        "x-player-key": session.playerKey
      }
    });
    if (!game || nextGame.revision !== game.revision || nextGame.status !== game.status) {
      const transition = gameTransition(game, nextGame);
      game = useGameState(nextGame);
      render();
      presentGameTransition(transition);
    }
  } catch (error) {
    if (error.rawMessage === "Room not found." || error.message === "Room not found.") {
      clearSession();
      render();
      showToast(t("roomEnded"), true);
      return;
    }
    if (!quiet) showToast(error.message, true);
  }
}

function startPolling() {
  window.clearInterval(pollTimer);
  pollTimer = window.setInterval(() => refreshGame({ quiet: true }), 900);
}

async function sendAction(action) {
  if (busy || !session) return;
  busy = true;
  let transition = null;
  render();
  try {
    const nextGame = await api(`/api/rooms/${session.code}/actions`, {
      method: "POST",
      body: JSON.stringify({ playerId: session.playerId, playerKey: session.playerKey, action })
    });
    transition = gameTransition(game, nextGame);
    game = useGameState(nextGame);
    selectedTokens.clear();
    selectedReturns = Object.fromEntries(allTokenTypes.map((type) => [type, 0]));
  } catch (error) {
    showToast(error.message, true);
  } finally {
    busy = false;
    render();
    presentGameTransition(transition);
  }
}

document.querySelectorAll(".tab").forEach((tab) => tab.addEventListener("click", () => setEntryMode(tab.dataset.tab)));

elements.roomForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy) return;
  busy = true;
  elements.formError.textContent = "";
  elements.roomSubmit.disabled = true;
  try {
    const name = elements.playerName.value.trim();
    const code = elements.roomCode.value.trim().toUpperCase();
    const path = entryMode === "create" ? "/api/rooms" : `/api/rooms/${code}/join`;
    const credentials = await api(path, { method: "POST", body: JSON.stringify({ name }) });
    saveSession(credentials);
    await refreshGame();
    startPolling();
  } catch (error) {
    elements.formError.textContent = error.message;
  } finally {
    busy = false;
    elements.roomSubmit.disabled = false;
    render();
  }
});

elements.copyInvite.addEventListener("click", async () => {
  const inviteUrl = `${location.origin}/?room=${session.code}`;
  try {
    await navigator.clipboard.writeText(inviteUrl);
    showToast(t("inviteCopied"));
  } catch {
    showToast(t("roomCodeToast", { code: session.code }));
  }
});

elements.languageButton.addEventListener("click", () => {
  currentLanguage = currentLanguage === "en" ? "zh" : "en";
  localStorage.setItem("pokemon-splendor-language", currentLanguage);
  translateStaticContent();
  render();
});

function selectGameBackground(value) {
  selectedGameBackgroundId = gameBackgrounds.some(({ id }) => id === value)
    ? value
    : "current";
  localStorage.setItem("pokemon-splendor-background", selectedGameBackgroundId);
  applyGameBackground();
  renderBackgroundSelector();
}

elements.backgroundSelect.addEventListener("change", () => selectGameBackground(elements.backgroundSelect.value));

function selectBgm(value) {
  selectedBgmId = localBgmTracks.some(({ id }) => id === value)
    ? value
    : localBgmTracks[0]?.id ?? "";
  if (selectedBgmId) localStorage.setItem("pokemon-splendor-bgm", selectedBgmId);
  else localStorage.removeItem("pokemon-splendor-bgm");
  restartBgm();
  renderAudioControls();
}

elements.bgmSelect.addEventListener("change", () => selectBgm(elements.bgmSelect.value));

elements.soundButton.addEventListener("click", () => {
  setBgmEnabled(!bgmEnabled);
});

elements.settingsButton.addEventListener("click", () => {
  renderBackgroundSelector();
  renderAudioControls();
  renderSettingsControls();
  elements.settingsDialog.showModal();
});
elements.closeSettings.addEventListener("click", () => elements.settingsDialog.close());
elements.settingsDialog.addEventListener("click", (event) => {
  if (event.target === elements.settingsDialog) elements.settingsDialog.close();
});
elements.bgmEnabledInput.addEventListener("change", () => setBgmEnabled(elements.bgmEnabledInput.checked));
elements.bgmVolumeInput.addEventListener("input", () => setBgmVolume(elements.bgmVolumeInput.value));
elements.sfxEnabledInput.addEventListener("change", () => {
  sfxEnabled = elements.sfxEnabledInput.checked;
  localStorage.setItem("pokemon-splendor-sfx-enabled", String(sfxEnabled));
  if (!sfxEnabled) stopSoundEffects();
  renderAudioControls();
});
elements.sfxVolumeInput.addEventListener("input", () => setSfxVolume(elements.sfxVolumeInput.value));
elements.model3dEnabled.addEventListener("change", () => {
  model3dEnabled = elements.model3dEnabled.checked;
  localStorage.setItem("pokemon-splendor-3d-enabled", String(model3dEnabled));
  render();
  renderSettingsControls();
});

elements.rulesButton.addEventListener("click", () => elements.rulesDialog.showModal());
elements.closeRules.addEventListener("click", () => elements.rulesDialog.close());
elements.rulesDialog.addEventListener("click", (event) => {
  if (event.target === elements.rulesDialog) elements.rulesDialog.close();
});

elements.pokedexButton.addEventListener("click", () => {
  renderPokedex();
  elements.pokedexDialog.showModal();
});
elements.closePokedex.addEventListener("click", () => elements.pokedexDialog.close());
elements.pokedexDialog.addEventListener("click", (event) => {
  if (event.target === elements.pokedexDialog) elements.pokedexDialog.close();
});

function configureRoomActionDialog(action) {
  const translationKeys = {
    end: ["endGameTitle", "endGameMessage", "endGame"],
    leave: ["leaveRoomTitle", "leaveRoomMessage", "leaveRoom"],
    disband: ["disbandRoomTitle", "disbandRoomMessage", "disbandRoom"]
  };
  const [titleKey, messageKey, buttonKey] = translationKeys[action];
  elements.exitRoomTitle.textContent = t(titleKey);
  elements.exitRoomMessage.textContent = t(messageKey);
  elements.confirmExitRoom.textContent = t(buttonKey);
}

function openRoomActionDialog(action) {
  if (busy || !session || !game) return;
  pendingRoomAction = action;
  configureRoomActionDialog(action);
  elements.exitRoomDialog.showModal();
}

elements.exitRoomButton.addEventListener("click", () => {
  openRoomActionDialog(session?.playerId === game?.hostId ? "disband" : "leave");
});
elements.endGameButton.addEventListener("click", () => openRoomActionDialog("end"));
elements.cancelExitRoom.addEventListener("click", () => elements.exitRoomDialog.close());
elements.exitRoomDialog.addEventListener("click", (event) => {
  if (event.target === elements.exitRoomDialog) elements.exitRoomDialog.close();
});
elements.exitRoomDialog.addEventListener("close", () => {
  if (!busy) pendingRoomAction = null;
});
elements.confirmExitRoom.addEventListener("click", async () => {
  if (busy || !session || !game || !pendingRoomAction) return;
  const action = pendingRoomAction;
  const notification = t(action === "end" ? "gameEnded" : action === "disband" ? "roomDisbanded" : "roomLeft");
  busy = true;
  elements.confirmExitRoom.disabled = true;
  elements.cancelExitRoom.disabled = true;
  try {
    const nextGame = await api(`/api/rooms/${session.code}/${action}`, {
      method: "POST",
      body: JSON.stringify({ playerId: session.playerId, playerKey: session.playerKey })
    });
    elements.exitRoomDialog.close();
    if (action === "end") game = useGameState(nextGame);
    else clearSession();
    render();
    showToast(notification);
  } catch (error) {
    if (error.rawMessage === "Room not found." || error.message === "Room not found.") {
      elements.exitRoomDialog.close();
      clearSession();
      render();
      showToast(t("roomEnded"), true);
    } else {
      showToast(error.message, true);
    }
  } finally {
    busy = false;
    pendingRoomAction = null;
    elements.confirmExitRoom.disabled = false;
    elements.cancelExitRoom.disabled = false;
  }
});

elements.startGame.addEventListener("click", async () => {
  if (busy) return;
  busy = true;
  renderLobby();
  try {
    game = useGameState(await api(`/api/rooms/${session.code}/start`, {
      method: "POST",
      body: JSON.stringify({ playerId: session.playerId, playerKey: session.playerKey })
    }));
  } catch (error) {
    showToast(error.message, true);
  } finally {
    busy = false;
    render();
  }
});

async function saveTimerSetting() {
  if (busy || !session || session.playerId !== game?.hostId) return;
  if (elements.timerEnabled.checked && !elements.timerSeconds.reportValidity()) return;
  const seconds = elements.timerEnabled.checked ? Number(elements.timerSeconds.value) : 0;
  pendingTimerSeconds = seconds;
  await updateLobbyOption("timer", { seconds });
  pendingTimerSeconds = null;
  renderLobby();
}

elements.timerEnabled.addEventListener("change", saveTimerSetting);
elements.timerSeconds.addEventListener("change", () => {
  if (elements.timerEnabled.checked) saveTimerSetting();
});
elements.silhouetteEnabled.addEventListener("change", () => {
  updateLobbyOption("silhouette", { enabled: elements.silhouetteEnabled.checked });
});

elements.clearSelection.addEventListener("click", () => {
  selectedTokens.clear();
  selectedReturns = Object.fromEntries(allTokenTypes.map((type) => [type, 0]));
  renderTokenBank(game.players[game.turnIndex]?.id === session.playerId);
});
elements.takeThree.addEventListener("click", () => {
  if (game.turnPhase === "discard") sendAction({ type: "returnTokens", tokens: selectedReturns });
  else sendAction({ type: "takeTokens", tokens: [...selectedTokens] });
});
elements.takePair.addEventListener("click", () => {
  const [type] = selectedTokens;
  sendAction({ type: "takeTokens", tokens: [type, type] });
});
elements.endTurn.addEventListener("click", () => sendAction({ type: "skipEvolution" }));

async function restartFinishedGame() {
  if (busy || !session) return;
  busy = true;
  render();
  try {
    game = useGameState(await api(`/api/rooms/${session.code}/finish`, {
      method: "POST",
      body: JSON.stringify({ playerId: session.playerId, playerKey: session.playerKey })
    }));
    selectedTokens.clear();
    selectedReturns = Object.fromEntries(allTokenTypes.map((type) => [type, 0]));
  } catch (error) {
    showToast(error.message, true);
  } finally {
    busy = false;
    render();
  }
}

elements.restartGame.addEventListener("click", restartFinishedGame);
window.addEventListener("resize", hideCollectionTooltip);
window.addEventListener("scroll", hideCollectionTooltip, true);
window.setInterval(renderTurnTimer, 250);
document.addEventListener("pointerdown", () => {
  if (bgmEnabled) startBgm();
}, { once: true });
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopBgm();
    stopTimerMusic();
  } else if (bgmEnabled) {
    startBgm();
  }
});

async function initialize() {
  translateStaticContent();
  applyGameBackground();
  renderStaticPokemonArtwork();
  installImageFallbacks();
  await loadMusicCatalog();
  await loadCatalog();
  const roomFromUrl = new URLSearchParams(location.search).get("room")?.toUpperCase();
  if (roomFromUrl && session?.code && roomFromUrl !== session.code) {
    clearSession();
    setEntryMode("join");
    elements.roomCode.value = roomFromUrl;
    setView("welcome");
    return;
  }
  if (session?.code) {
    await refreshGame();
    startPolling();
    return;
  }
  if (roomFromUrl) {
    setEntryMode("join");
    elements.roomCode.value = roomFromUrl;
  }
  setView("welcome");
}

initialize();
