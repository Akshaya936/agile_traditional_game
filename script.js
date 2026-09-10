"use strict";
/* ============================================================
   DIGITAL AADU PULI AATTAM — script.js
   Sections: Board Data | I18N | Storage | Sound | Game State |
   Game Logic | AI | Rendering | Screens/UI wiring
   ============================================================ */

/* ============================================================
   1. BOARD DATA (source of truth — do not invent connections)
   23 positions: 1 apex + 6 + 6 + 6 + 4
   ============================================================ */
const POSITIONS = {
  1: { x: 300, y: 30 },
  2: { x: 100, y: 110 }, 3: { x: 180, y: 110 }, 4: { x: 260, y: 110 },
  5: { x: 340, y: 110 }, 6: { x: 420, y: 110 }, 7: { x: 500, y: 110 },
  8: { x: 100, y: 190 }, 9: { x: 180, y: 190 }, 10: { x: 260, y: 190 },
  11: { x: 340, y: 190 }, 12: { x: 420, y: 190 }, 13: { x: 500, y: 190 },
  14: { x: 100, y: 270 }, 15: { x: 180, y: 270 }, 16: { x: 260, y: 270 },
  17: { x: 340, y: 270 }, 18: { x: 420, y: 270 }, 19: { x: 500, y: 270 },
  20: { x: 180, y: 350 }, 21: { x: 260, y: 350 }, 22: { x: 340, y: 350 }, 23: { x: 420, y: 350 }
};

const CONNECTIONS = {
  1: [4, 5],
  2: [3, 8, 9], 3: [2, 4, 8, 9, 10], 4: [1, 3, 5, 9, 10, 11],
  5: [1, 4, 6, 10, 11, 12], 6: [5, 7, 11, 12, 13], 7: [6, 12, 13],
  8: [2, 3, 9, 14, 15], 9: [2, 3, 4, 8, 10, 14, 15, 16], 10: [3, 4, 5, 9, 11, 15, 16, 17],
  11: [4, 5, 6, 10, 12, 16, 17, 18], 12: [5, 6, 7, 11, 13, 17, 18, 19], 13: [6, 7, 12, 18, 19],
  14: [8, 9, 15, 20], 15: [8, 9, 10, 14, 16, 20, 21], 16: [9, 10, 11, 15, 17, 20, 21, 22],
  17: [10, 11, 12, 16, 18, 21, 22, 23], 18: [11, 12, 13, 17, 19, 22, 23], 19: [12, 13, 18, 23],
  20: [14, 15, 16, 21], 21: [15, 16, 17, 20, 22], 22: [16, 17, 18, 21, 23], 23: [17, 18, 19, 22]
};

const TIGER_START = [1, 4, 5];
const ALL_POS = Object.keys(POSITIONS).map(Number);
const MAX_GOATS = 15;
const CAPTURES_TO_WIN = 5;
const MOVES_FOR_DRAW = 30;

/* ============================================================
   2. I18N
   ============================================================ */
const STRINGS = {
  en: {
    title: "Digital Aadu Puli Aattam", title_short: "Aadu Puli Aattam",
    subtitle: "Experience the Tradition. Master the Strategy.",
    play: "PLAY GAME", howto: "HOW TO PLAY", levels_btn: "LEVELS",
    achievements: "ACHIEVEMENTS", about: "ABOUT", home: "Home",
    sound_on: "Sound", play_as: "Play as:", goat: "Goat", tiger: "Tiger",
    choose_mode: "Choose mode:", mode_single: "1 Player (vs Computer)", mode_two: "2 Players (Local)",
    local_match: "Two Players — Local Match",
    two_player_desc: "Pass the device back and forth. Whoever's turn it is taps their own piece — no computer opponent, no locked levels.",
    start_match: "Start Match",
    lvl1_title: "Beginner", lvl2_title: "Intermediate", lvl3_title: "Advanced",
    lvl1_l1: "Easy AI", lvl1_l2: "Hints available", lvl1_l3: "Learn the traditional rules",
    lvl2_l1: "Smarter AI", lvl2_l2: "Limited assistance", lvl2_l3: "Strategic gameplay",
    lvl3_l1: "Expert AI (Minimax)", lvl3_l2: "No automatic hints", lvl3_l3: "Maximum challenge",
    ht_objective_h: "Objective", ht_objective: "Tigers try to capture 5 Goats. Goats try to trap all three Tigers so they cannot move.",
    ht_pieces_h: "Pieces", ht_pieces_tiger: "3 Tigers", ht_pieces_goat: "15 Goats",
    ht_board_h: "Board", ht_board: "23 connected positions. Pieces move only along the drawn lines.",
    ht_first_h: "First Move", ht_first: "The Goat player always moves first.",
    ht_placement_h: "Goat Placement", ht_placement: "For the first 15 Goat turns, the Goat player places one new Goat on any empty position instead of moving.",
    ht_tigermove_h: "Tiger Movement", ht_tigermove: "A Tiger moves one step to an adjacent, empty, connected position.",
    ht_tigercap_h: "Tiger Capture", ht_tigercap: "A Tiger jumps in a straight line over an adjacent Goat and lands on the empty position beyond it. The Goat is removed.",
    ht_goatmove_h: "Goat Movement", ht_goatmove: "Once all 15 Goats are placed, the Goat player moves one Goat to an adjacent empty position each turn.",
    ht_win_h: "Winning", ht_win: "5 Goats captured → Tigers win. No legal Tiger moves → Goats win.",
    ht_draw_h: "Draw", ht_draw: "After 30 moves each with no winner, either player may claim a draw.",
    about_p1: "Aadu Puli Aattam (ஆடுபுலி ஆட்டம்) is a traditional two-player strategy board game from Tamil Nadu, India, played for generations on courtyards, temple floors, and palm-leaf boards.",
    about_p2: "Three Tigers hunt fifteen Goats across 23 connected positions, while the Goats try to work together to trap every Tiger. This digital edition recreates the traditional rules with three levels of computer opponents, from a gentle teacher to a calculating minimax-powered strategist.",
    about_p3: "This is an original implementation built for the web — no external assets were copied from any reference site.",
    reset_progress: "Reset Progress", goat_turn: "Goat Turn", tiger_turn: "Tiger Turn",
    goats_placed: "Goats Placed", goats_captured: "Goats Captured", goat_moves: "Goat Moves",
    tiger_moves: "Tiger Moves", score: "Score", hint: "Hint", pause: "Pause", restart: "Restart",
    claim_draw: "Claim Draw", invalid_move: "Invalid Move", ai_thinking: "Computer is thinking…",
    tigers_win: "Tigers Win", goats_win: "Goats Win", draw_declared: "Draw Declared",
    play_again: "Play Again", next_level: "Next Level", go_home: "Home",
    resume: "Resume", quit: "Quit to Home", paused: "Paused",
    confirm_restart: "Restart this game? Your progress in this match will be lost.",
    confirm_reset: "Reset ALL saved progress (unlocked levels, best score)? This cannot be undone.",
    yes: "Yes", cancel: "Cancel", level_locked: "Complete the previous level to unlock this one.",
    draw_available: "30 moves each have passed. Either player may now claim a draw.",
    hint_none: "No hint available right now.",
    lvl_complete_bonus: "Level Complete Bonus"
  },
  ta: {
    title: "டிஜிட்டல் ஆடுபுலி ஆட்டம்", title_short: "ஆடுபுலி ஆட்டம்",
    subtitle: "பாரம்பரியத்தை அனுபவியுங்கள். உத்தியில் வெல்லுங்கள்.",
    play: "விளையாட்டைத் தொடங்கு", howto: "எப்படி விளையாடுவது", levels_btn: "நிலைகள்",
    achievements: "சாதனைகள்", about: "பற்றி", home: "முகப்பு",
    sound_on: "ஒலி", play_as: "இதுவாக விளையாடு:", goat: "ஆடு", tiger: "புலி",
    choose_mode: "முறையைத் தேர்ந்தெடுக்கவும்:", mode_single: "1 வீரர் (கணினிக்கு எதிராக)", mode_two: "2 வீரர்கள் (உள்ளூர்)",
    local_match: "இரு வீரர்கள் — உள்ளூர் ஆட்டம்",
    two_player_desc: "சாதனத்தை மாறி மாறி பயன்படுத்தவும். யாருடைய முறையோ அவர் தங்கள் காயைத் தொடவும் — கணினி எதிராளி இல்லை, பூட்டப்பட்ட நிலைகள் இல்லை.",
    start_match: "ஆட்டத்தைத் தொடங்கு",
    lvl1_title: "தொடக்கநிலை", lvl2_title: "இடைநிலை", lvl3_title: "மேம்பட்ட நிலை",
    lvl1_l1: "எளிய AI", lvl1_l2: "உதவிக்குறிப்புகள் உண்டு", lvl1_l3: "பாரம்பரிய விதிகளைக் கற்றல்",
    lvl2_l1: "புத்திசாலி AI", lvl2_l2: "குறைந்த உதவி", lvl2_l3: "உத்தி விளையாட்டு",
    lvl3_l1: "நிபுணர் AI (Minimax)", lvl3_l2: "தானியங்கு உதவிக்குறிப்பு இல்லை", lvl3_l3: "அதிகபட்ச சவால்",
    ht_objective_h: "நோக்கம்", ht_objective: "புலிகள் 5 ஆடுகளைப் பிடிக்க முயல்கின்றன. ஆடுகள் மூன்று புலிகளையும் நகர முடியாதபடி சிக்க வைக்க முயல்கின்றன.",
    ht_pieces_h: "காய்கள்", ht_pieces_tiger: "3 புலிகள்", ht_pieces_goat: "15 ஆடுகள்",
    ht_board_h: "பலகை", ht_board: "23 இணைக்கப்பட்ட இடங்கள். கோடுகள் வழியாக மட்டுமே காய்கள் நகரும்.",
    ht_first_h: "முதல் நகர்வு", ht_first: "ஆடு வீரர் எப்போதும் முதலில் நகர்வார்.",
    ht_placement_h: "ஆடு வைப்பு", ht_placement: "முதல் 15 ஆடு முறைகளில், ஆடு வீரர் ஒரு புதிய ஆட்டை காலியான இடத்தில் வைப்பார்.",
    ht_tigermove_h: "புலி நகர்வு", ht_tigermove: "புலி அருகிலுள்ள காலியான, இணைக்கப்பட்ட இடத்திற்கு ஒரு அடி நகரும்.",
    ht_tigercap_h: "புலி பிடிப்பு", ht_tigercap: "புலி அருகிலுள்ள ஆட்டின் மேல் நேர்கோட்டில் தாவி, அதற்கு அப்பால் உள்ள காலி இடத்தில் இறங்கும். ஆடு அகற்றப்படும்.",
    ht_goatmove_h: "ஆடு நகர்வு", ht_goatmove: "15 ஆடுகளும் வைக்கப்பட்ட பிறகு, ஆடு வீரர் ஒவ்வொரு முறையும் ஒரு ஆட்டை அருகிலுள்ள காலி இடத்திற்கு நகர்த்துவார்.",
    ht_win_h: "வெற்றி", ht_win: "5 ஆடுகள் பிடிபட்டால் → புலிகள் வெற்றி. புலிக்கு நகர்வு இல்லையெனில் → ஆடுகள் வெற்றி.",
    ht_draw_h: "சமன்", ht_draw: "இருவரும் 30 நகர்வுகளுக்குப் பிறகு வெற்றி இல்லையெனில், சமன் கோரலாம்.",
    about_p1: "ஆடுபுலி ஆட்டம் என்பது தமிழ்நாட்டின் பாரம்பரிய இரு வீரர் உத்தி பலகை விளையாட்டு ஆகும்.",
    about_p2: "23 இணைக்கப்பட்ட இடங்களில் மூன்று புலிகள் பதினைந்து ஆடுகளை வேட்டையாடுகின்றன, ஆடுகள் ஒன்றிணைந்து புலிகளை சிக்க வைக்க முயல்கின்றன. இந்த டிஜிட்டல் பதிப்பில் மூன்று நிலை கணினி எதிராளிகள் உள்ளனர்.",
    about_p3: "இது இணையத்திற்காக உருவாக்கப்பட்ட ஒரு அசல் செயலாக்கமாகும் — எந்த வெளிப்புற வளங்களும் நகலெடுக்கப்படவில்லை.",
    reset_progress: "முன்னேற்றத்தை மீட்டமை", goat_turn: "ஆட்டின் முறை", tiger_turn: "புலியின் முறை",
    goats_placed: "வைக்கப்பட்ட ஆடுகள்", goats_captured: "பிடிக்கப்பட்ட ஆடுகள்", goat_moves: "ஆடு நகர்வுகள்",
    tiger_moves: "புலி நகர்வுகள்", score: "மதிப்பெண்", hint: "குறிப்பு", pause: "இடைநிறுத்து", restart: "மீண்டும் தொடங்கு",
    claim_draw: "சமன் கோரு", invalid_move: "தவறான நகர்வு", ai_thinking: "கணினி யோசிக்கிறது…",
    tigers_win: "புலிகள் வெற்றி!", goats_win: "ஆடுகள் வெற்றி!", draw_declared: "சமன் அறிவிக்கப்பட்டது",
    play_again: "மீண்டும் விளையாடு", next_level: "அடுத்த நிலை", go_home: "முகப்பு",
    resume: "தொடரவும்", quit: "முகப்புக்குச் செல்", paused: "இடைநிறுத்தப்பட்டது",
    confirm_restart: "இந்த ஆட்டத்தை மீண்டும் தொடங்கவா? முன்னேற்றம் இழக்கப்படும்.",
    confirm_reset: "அனைத்து சேமிக்கப்பட்ட முன்னேற்றத்தையும் அழிக்கவா? இதை மாற்ற முடியாது.",
    yes: "ஆம்", cancel: "ரத்து செய்", level_locked: "இந்த நிலையைத் திறக்க முந்தைய நிலையை முடிக்கவும்.",
    draw_available: "இருவரும் 30 நகர்வுகள் முடித்துவிட்டனர். இப்போது சமன் கோரலாம்.",
    hint_none: "இப்போது குறிப்பு எதுவும் இல்லை.",
    lvl_complete_bonus: "நிலை நிறைவு போனஸ்"
  }
};
let currentLang = localStorage.getItem("selectedLanguage") || "en";
function t(key) { return (STRINGS[currentLang] && STRINGS[currentLang][key]) || STRINGS.en[key] || key; }

/* ============================================================
   2b. ICONS — inline SVG references into the sprite in index.html,
   used everywhere emoji would otherwise appear.
   ============================================================ */
function icon(name, extraClass) {
  const cls = extraClass ? ` icon-${extraClass}` : "";
  return `<svg class="icon${cls}" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
}
function applyI18N() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(el => {
    const key = el.getAttribute("data-i18n-aria");
    el.setAttribute("aria-label", t(key));
  });
  document.documentElement.lang = currentLang;
}

/* ============================================================
   3. STORAGE
   ============================================================ */
const Storage = {
  load() {
    return {
      unlockedLevel: parseInt(localStorage.getItem("unlockedLevel") || "1", 10),
      bestScore: parseInt(localStorage.getItem("bestScore") || "0", 10),
      completedLevels: JSON.parse(localStorage.getItem("completedLevels") || "[]"),
      soundEnabled: (localStorage.getItem("soundEnabled") || "true") === "true"
    };
  },
  saveProgress(level, score) {
    const p = Storage.load();
    if (level >= p.unlockedLevel && level < 3) {
      localStorage.setItem("unlockedLevel", String(Math.max(p.unlockedLevel, level + 1)));
    }
    if (!p.completedLevels.includes(level)) {
      p.completedLevels.push(level);
      localStorage.setItem("completedLevels", JSON.stringify(p.completedLevels));
    }
    if (score > p.bestScore) localStorage.setItem("bestScore", String(score));
  },
  resetProgress() {
    localStorage.removeItem("unlockedLevel");
    localStorage.removeItem("bestScore");
    localStorage.removeItem("completedLevels");
  }
};

/* ============================================================
   4. SOUND (WebAudio — no external files needed)
   ============================================================ */
let audioCtx = null;
function ensureAudio() { if (!audioCtx) { try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { audioCtx = null; } } }
function playSound(type) {
  const enabled = Storage.load().soundEnabled;
  if (!enabled) return;
  ensureAudio();
  if (!audioCtx) return;
  const freqMap = { select: 520, move: 400, capture: 180, invalid: 140, win: 660, lose: 220, level: 780, click: 460 };
  const durMap = { capture: 0.28, win: 0.5, lose: 0.5, level: 0.4 };
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type === "capture" ? "sawtooth" : "sine";
  o.frequency.value = freqMap[type] || 400;
  g.gain.value = 0.08;
  o.connect(g); g.connect(audioCtx.destination);
  const dur = durMap[type] || 0.12;
  o.start();
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
  o.stop(audioCtx.currentTime + dur + 0.02);
}

/* ============================================================
   5. GAME STATE
   ============================================================ */
let state = null;
let humanSide = "goat";
let currentLevel = 1;
let aiBusy = false;
let paused = false;
let gameMode = "single"; // "single" (vs computer) or "two" (local two players)

function freshState(level) {
  const board = {};
  ALL_POS.forEach(p => (board[p] = null));
  TIGER_START.forEach((p, i) => (board[p] = { type: "tiger", id: "T" + (i + 1) }));
  return {
    level,
    currentPlayer: "goat",
    phase: "placement",
    board,
    tigers: TIGER_START.map((p, i) => ({ id: "T" + (i + 1), pos: p })),
    placedGoats: 0,
    capturedGoats: 0,
    goatMoves: 0,
    tigerMoves: 0,
    score: 0,
    gameOver: false,
    winner: null,
    selected: null,
    hintMove: null
  };
}

/* ============================================================
   6. GAME LOGIC (pure functions on a state object)
   ============================================================ */
function emptyNeighbors(s, pos) {
  return CONNECTIONS[pos].filter(n => !s.board[n]);
}

// Generic geometric jump-landing finder: A(tiger) -> B(goat) -> C(landing)
function findLanding(a, b) {
  const A = POSITIONS[a], B = POSITIONS[b];
  const dx1 = B.x - A.x, dy1 = B.y - A.y;
  const len1 = Math.hypot(dx1, dy1);
  for (const c of CONNECTIONS[b]) {
    if (c === a) continue;
    const C = POSITIONS[c];
    const dx2 = C.x - B.x, dy2 = C.y - B.y;
    const len2 = Math.hypot(dx2, dy2);
    const cross = dx1 * dy2 - dy1 * dx2;
    const dot = dx1 * dx2 + dy1 * dy2;
    const ratio = len2 / len1;
    if (Math.abs(cross) < 8 && dot > 0 && ratio > 0.8 && ratio < 1.25) return c;
  }
  return null;
}

function getTigerCaptures(s, tigerPos) {
  const caps = [];
  for (const n of CONNECTIONS[tigerPos]) {
    const occ = s.board[n];
    if (occ && occ.type === "goat") {
      const landing = findLanding(tigerPos, n);
      if (landing !== null && !s.board[landing]) caps.push({ over: n, to: landing });
    }
  }
  return caps;
}
function getTigerMoves(s, tigerPos) {
  return emptyNeighbors(s, tigerPos).map(to => ({ to }));
}
function tigerHasAnyMove(s, tigerPos) {
  return getTigerMoves(s, tigerPos).length > 0 || getTigerCaptures(s, tigerPos).length > 0;
}
function anyTigerHasMove(s) {
  return s.tigers.some(tg => tigerHasAnyMove(s, tg.pos));
}
function getGoatMoves(s, goatPos) {
  return emptyNeighbors(s, goatPos);
}

/* ---- Move generation for a side, in either phase (used by human UI + AI) ---- */
function generateActions(s, side) {
  const actions = [];
  if (side === "goat") {
    if (s.phase === "placement") {
      ALL_POS.forEach(p => { if (!s.board[p]) actions.push({ type: "place", pos: p }); });
    } else {
      ALL_POS.forEach(p => {
        const occ = s.board[p];
        if (occ && occ.type === "goat") {
          getGoatMoves(s, p).forEach(to => actions.push({ type: "move", from: p, to, pieceType: "goat" }));
        }
      });
    }
  } else {
    s.tigers.forEach(tg => {
      getTigerCaptures(s, tg.pos).forEach(c => actions.push({ type: "capture", tigerId: tg.id, from: tg.pos, over: c.over, to: c.to }));
      getTigerMoves(s, tg.pos).forEach(m => actions.push({ type: "move", from: tg.pos, to: m.to, pieceType: "tiger", tigerId: tg.id }));
    });
  }
  return actions;
}

/* ---- Apply an action, mutating state. Returns nothing (state is mutated). ---- */
function applyAction(s, action) {
  if (action.type === "place") {
    s.board[action.pos] = { type: "goat", id: "G" + (s.placedGoats + 1) };
    s.placedGoats++;
    s.goatMoves++;
    if (s.placedGoats >= MAX_GOATS) s.phase = "movement";
  } else if (action.type === "move" && action.pieceType === "goat") {
    const piece = s.board[action.from];
    s.board[action.from] = null;
    s.board[action.to] = piece;
    s.goatMoves++;
  } else if (action.type === "move" && action.pieceType === "tiger") {
    const piece = s.board[action.from];
    s.board[action.from] = null;
    s.board[action.to] = piece;
    const tg = s.tigers.find(x => x.id === action.tigerId);
    tg.pos = action.to;
    s.tigerMoves++;
  } else if (action.type === "capture") {
    const piece = s.board[action.from];
    s.board[action.from] = null;
    s.board[action.over] = null;
    s.board[action.to] = piece;
    const tg = s.tigers.find(x => x.id === action.tigerId);
    tg.pos = action.to;
    s.capturedGoats++;
    s.tigerMoves++;
    s.score += 100;
  }
}

function checkWinConditions(s) {
  if (s.capturedGoats >= CAPTURES_TO_WIN) { s.gameOver = true; s.winner = "tiger"; s.score += 500; return true; }
  if (s.phase === "movement" && !anyTigerHasMove(s)) { s.gameOver = true; s.winner = "goat"; s.score += 500; return true; }
  return false;
}
function drawAvailable(s) { return s.goatMoves >= MOVES_FOR_DRAW && s.tigerMoves >= MOVES_FOR_DRAW; }

/* ============================================================
   7. AI
   ============================================================ */
function aiSide() { return humanSide === "goat" ? "tiger" : "goat"; }

function cloneState(s) {
  return {
    ...s,
    board: { ...s.board },
    tigers: s.tigers.map(tg => ({ ...tg }))
  };
}

function evaluateBoard(s) {
  // Positive favors TIGER, negative favors GOAT
  if (s.capturedGoats >= CAPTURES_TO_WIN) return 100000;
  if (s.phase === "movement" && !anyTigerHasMove(s)) return -100000;

  let score = 0;
  score += s.capturedGoats * 150;

  let tigerMobility = 0, tigerCaptureOpps = 0;
  s.tigers.forEach(tg => {
    tigerMobility += emptyNeighbors(s, tg.pos).length;
    tigerCaptureOpps += getTigerCaptures(s, tg.pos).length;
  });
  score += tigerMobility * 6;
  score += tigerCaptureOpps * 40;

  // Goats remaining and their mobility (favors goat when high)
  let goatCount = 0, goatMobility = 0, blockedTigers = 0;
  ALL_POS.forEach(p => {
    const occ = s.board[p];
    if (occ && occ.type === "goat") {
      goatCount++;
      goatMobility += emptyNeighbors(s, p).length;
    }
  });
  s.tigers.forEach(tg => { if (!tigerHasAnyMove(s, tg.pos)) blockedTigers++; });

  score -= goatCount * 10;
  score -= goatMobility * 3;
  score -= blockedTigers * 120;

  // Encourage tigers to stay central / mobile rather than cornered (fewer available spots is bad)
  return score;
}

function minimax(s, depth, maximizing, alpha, beta) {
  if (depth === 0 || s.gameOver || s.capturedGoats >= CAPTURES_TO_WIN || (s.phase === "movement" && !anyTigerHasMove(s))) {
    return evaluateBoard(s);
  }
  const side = maximizing ? "tiger" : "goat";
  const actions = generateActions(s, side);
  if (actions.length === 0) return evaluateBoard(s);

  if (maximizing) {
    let best = -Infinity;
    for (const action of actions) {
      const ns = cloneState(s);
      applyAction(ns, action);
      checkWinConditions(ns);
      const val = minimax(ns, depth - 1, false, alpha, beta);
      best = Math.max(best, val);
      alpha = Math.max(alpha, val);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const action of actions) {
      const ns = cloneState(s);
      applyAction(ns, action);
      checkWinConditions(ns);
      const val = minimax(ns, depth - 1, true, alpha, beta);
      best = Math.min(best, val);
      beta = Math.min(beta, val);
      if (beta <= alpha) break;
    }
    return best;
  }
}

function getEasyMove(s, side) {
  const actions = generateActions(s, side);
  if (actions.length === 0) return null;
  return actions[Math.floor(Math.random() * actions.length)];
}

function getIntermediateMove(s, side) {
  const actions = generateActions(s, side);
  if (actions.length === 0) return null;
  // Prioritize captures for tiger
  if (side === "tiger") {
    const captures = actions.filter(a => a.type === "capture");
    if (captures.length) {
      // pick capture that leaves best mobility afterward
      let bestA = null, bestScore = -Infinity;
      captures.forEach(a => {
        const ns = cloneState(s); applyAction(ns, a);
        const sc = evaluateBoard(ns);
        if (sc > bestScore) { bestScore = sc; bestA = a; }
      });
      return bestA;
    }
  }
  // Greedy 1-ply evaluation for remaining moves
  let bestA = null, bestScore = side === "tiger" ? -Infinity : Infinity;
  actions.forEach(a => {
    const ns = cloneState(s); applyAction(ns, a);
    const sc = evaluateBoard(ns);
    if (side === "tiger" ? sc > bestScore : sc < bestScore) { bestScore = sc; bestA = a; }
  });
  return bestA;
}

function getAdvancedMove(s, side) {
  const actions = generateActions(s, side);
  if (actions.length === 0) return null;
  const depth = actions.length > 14 ? 3 : 4;
  let bestA = null;
  let bestScore = side === "tiger" ? -Infinity : Infinity;
  actions.forEach(a => {
    const ns = cloneState(s); applyAction(ns, a); checkWinConditions(ns);
    const sc = minimax(ns, depth - 1, side !== "tiger", -Infinity, Infinity);
    if (side === "tiger" ? sc > bestScore : sc < bestScore) { bestScore = sc; bestA = a; }
  });
  return bestA;
}

function getComputerMove(s, difficulty, side) {
  if (difficulty === "beginner") return getEasyMove(s, side);
  if (difficulty === "intermediate") return getIntermediateMove(s, side);
  return getAdvancedMove(s, side);
}
function difficultyForLevel(level) { return level === 1 ? "beginner" : level === 2 ? "intermediate" : "advanced"; }

/* ============================================================
   8. RENDERING
   ============================================================ */
function drawBoardLines() {
  const svg = document.getElementById("board-lines");
  svg.innerHTML = "";
  const drawn = new Set();
  Object.keys(CONNECTIONS).forEach(idStr => {
    const id = Number(idStr);
    CONNECTIONS[id].forEach(n => {
      const key = id < n ? `${id}-${n}` : `${n}-${id}`;
      if (drawn.has(key)) return;
      drawn.add(key);
      const a = POSITIONS[id], b = POSITIONS[n];
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", a.x); line.setAttribute("y1", a.y);
      line.setAttribute("x2", b.x); line.setAttribute("y2", b.y);
      svg.appendChild(line);
    });
  });
}

function pieceGlyph(occ) {
  if (!occ) return "";
  return occ.type === "tiger" ? icon("tiger", "tiger") : icon("goat", "goat");
}

function renderBoard() {
  const container = document.getElementById("board-nodes");
  container.innerHTML = "";
  const validTargets = getSelectedTargets();
  ALL_POS.forEach(id => {
    const pos = POSITIONS[id];
    const node = document.createElement("div");
    node.className = "node";
    node.style.left = (pos.x / 600 * 100) + "%";
    node.style.top = (pos.y / 420 * 100) + "%";
    node.dataset.pos = id;
    const occ = state.board[id];
    if (occ) {
      node.innerHTML = pieceGlyph(occ);
      node.title = occ.id;
    } else {
      node.classList.add("empty-dot");
    }
    if (state.selected === id) node.classList.add("selected");
    const capTarget = validTargets.captures.find(c => c.to === id);
    const moveTarget = validTargets.moves.find(m => m === id);
    if (capTarget) node.classList.add("valid-capture");
    else if (moveTarget !== undefined) node.classList.add("valid-move");
    if (state.hintMove && (state.hintMove.to === id || state.hintMove.from === id || state.hintMove.pos === id)) {
      node.classList.add("hint-glow");
    }
    node.addEventListener("click", () => onNodeClick(id));
    container.appendChild(node);
  });
}

function getSelectedTargets() {
  const out = { moves: [], captures: [] };
  if (state.selected === null) return out;
  const occ = state.board[state.selected];
  if (!occ) return out;
  if (occ.type === "goat" && state.phase === "movement") {
    out.moves = getGoatMoves(state, state.selected);
  } else if (occ.type === "tiger") {
    out.moves = emptyNeighbors(state, state.selected);
    out.captures = getTigerCaptures(state, state.selected);
  }
  return out;
}

function updateStatusPanel() {
  document.getElementById("c-placed").textContent = state.placedGoats;
  document.getElementById("c-captured").textContent = state.capturedGoats;
  document.getElementById("c-goatmoves").textContent = state.goatMoves;
  document.getElementById("c-tigermoves").textContent = state.tigerMoves;
  document.getElementById("c-score").textContent = state.score;
  const ti = document.getElementById("turn-indicator");
  if (state.currentPlayer === "goat") {
    ti.innerHTML = `${icon("goat", "goat")} <span>${t("goat_turn")}</span>`;
    ti.classList.remove("tiger");
  } else {
    ti.innerHTML = `${icon("tiger", "tiger")} <span>${t("tiger_turn")}</span>`;
    ti.classList.add("tiger");
  }
  const levelIcon = state.level === 1 ? "sprout" : state.level === 2 ? "leaf" : "crown";
  document.getElementById("game-level-badge").innerHTML =
    gameMode === "two"
      ? `${icon("players")} ${t("local_match")}`
      : `${t("lvl" + state.level + "_title")} &middot; ${icon(levelIcon)}`;
  const drawBtn = document.getElementById("btn-claim-draw");
  drawBtn.style.display = (!state.gameOver && drawAvailable(state)) ? "inline-block" : "none";
  if (!state.gameOver && drawAvailable(state)) showMsg(t("draw_available"));
}

function showMsg(msg) {
  const banner = document.getElementById("msg-banner");
  banner.textContent = msg;
  banner.classList.remove("hidden");
  clearTimeout(showMsg._t);
  showMsg._t = setTimeout(() => banner.classList.add("hidden"), 3200);
}

/* ============================================================
   9. INTERACTION
   ============================================================ */
function isHumanControlled(side) {
  return gameMode === "two" || side === humanSide;
}

function onNodeClick(id) {
  if (state.gameOver || aiBusy || paused) return;
  if (!isHumanControlled(state.currentPlayer)) return; // it's the computer's turn

  const occ = state.board[id];

  if (state.currentPlayer === "goat" && state.phase === "placement") {
    if (occ) { flashInvalid(); return; }
    doAction({ type: "place", pos: id });
    return;
  }

  // movement phase selection logic (for both goat-movement and tiger turns)
  if (state.selected === null) {
    if (occ && occ.type === state.currentPlayer) {
      state.selected = id;
      playSound("select");
      renderBoard();
    } else if (occ) {
      flashInvalid();
    }
    return;
  }

  if (state.selected === id) { state.selected = null; renderBoard(); return; }

  const selOcc = state.board[state.selected];
  if (occ && occ.type === state.currentPlayer) {
    // switch selection to another own piece
    state.selected = id; playSound("select"); renderBoard(); return;
  }

  if (selOcc.type === "goat") {
    const valid = getGoatMoves(state, state.selected).includes(id);
    if (!valid) { flashInvalid(); return; }
    doAction({ type: "move", from: state.selected, to: id, pieceType: "goat" });
  } else if (selOcc.type === "tiger") {
    const caps = getTigerCaptures(state, state.selected);
    const cap = caps.find(c => c.to === id);
    if (cap) {
      doAction({ type: "capture", tigerId: selOcc.id, from: state.selected, over: cap.over, to: id });
      return;
    }
    const moves = emptyNeighbors(state, state.selected);
    if (moves.includes(id)) {
      doAction({ type: "move", from: state.selected, to: id, pieceType: "tiger", tigerId: selOcc.id });
    } else {
      flashInvalid();
    }
  }
}

function flashInvalid() {
  playSound("invalid");
  showMsg(t("invalid_move"));
}

function doAction(action) {
  const wasCapture = action.type === "capture";
  applyAction(state, action);
  state.selected = null;
  state.hintMove = null;
  playSound(wasCapture ? "capture" : action.type === "place" ? "click" : "move");
  const ended = checkWinConditions(state);
  state.currentPlayer = state.currentPlayer === "goat" ? "tiger" : "goat";
  renderAll();
  if (ended) { onGameOver(); return; }
  maybeTriggerAI();
}

function maybeTriggerAI() {
  if (gameMode === "two") return;
  if (state.gameOver || paused) return;
  if (state.currentPlayer === aiSide()) {
    aiBusy = true;
    showMsg(t("ai_thinking"));
    setTimeout(() => {
      const difficulty = difficultyForLevel(state.level);
      const action = getComputerMove(state, difficulty, aiSide());
      aiBusy = false;
      if (!action) {
        // AI side has no move at all
        checkWinConditions(state);
        if (state.gameOver) { renderAll(); onGameOver(); return; }
        // Shouldn't normally happen; pass turn back defensively
        state.currentPlayer = state.currentPlayer === "goat" ? "tiger" : "goat";
        renderAll();
        return;
      }
      doAction(action);
    }, state.level === 3 ? 450 : 550);
  }
}

/* ============================================================
   10. HINT
   ============================================================ */
function showHint() {
  if (state.gameOver || !isHumanControlled(state.currentPlayer)) return;
  const action = getIntermediateMove(state, state.currentPlayer);
  if (!action) { showMsg(t("hint_none")); return; }
  state.hintMove = action;
  renderBoard();
}

/* ============================================================
   11. GAME OVER / MODALS
   ============================================================ */
function onGameOver() {
  const isTwo = gameMode === "two";
  if (!isTwo) Storage.saveProgress(state.level, state.score);
  const p = Storage.load();
  playSound(state.winner === "tiger" || state.winner === "goat" ? "win" : "lose");
  const winnerIcon = state.winner === "tiger" ? icon("tiger", "tiger") : icon("goat", "goat");
  const title = state.winner === "tiger" ? t("tigers_win") : t("goats_win");
  const nextUnlocked = !isTwo && state.level < 3 && p.unlockedLevel > state.level;
  openModal(`
    <h2>${winnerIcon} ${title}</h2>
    <div class="modal-stats">
      <div>${t("goats_captured")}: <b>${state.capturedGoats}/5</b></div>
      <div>${t("goat_moves")}: <b>${state.goatMoves}</b></div>
      <div>${t("tiger_moves")}: <b>${state.tigerMoves}</b></div>
      <div>${t("score")}: <b>${state.score}</b></div>
      ${isTwo ? "" : `<div>${t("achievements")} — Best: <b>${p.bestScore}</b></div>`}
    </div>
    <div class="modal-actions">
      <button class="btn btn-primary" id="modal-retry">${icon("restart")} ${t("play_again")}</button>
      ${nextUnlocked ? `<button class="btn btn-secondary" id="modal-next">${icon("next")} ${t("next_level")}</button>` : ""}
      <button class="btn btn-secondary" id="modal-home">${icon("home")} ${t("go_home")}</button>
    </div>
  `);
  document.getElementById("modal-retry").onclick = () => { closeModal(); isTwo ? startTwoPlayerGame() : startLevel(state.level); };
  document.getElementById("modal-home").onclick = () => { closeModal(); showScreen("home"); };
  const nb = document.getElementById("modal-next");
  if (nb) nb.onclick = () => { closeModal(); startLevel(state.level + 1); };
}

function openModal(html) {
  document.getElementById("modal-content").innerHTML = html;
  document.getElementById("modal-overlay").classList.remove("hidden");
}
function closeModal() { document.getElementById("modal-overlay").classList.add("hidden"); }

function confirmDialog(message, onYes) {
  openModal(`
    <h2>${icon("warning")}</h2>
    <p>${message}</p>
    <div class="modal-actions">
      <button class="btn btn-danger" id="modal-yes">${t("yes")}</button>
      <button class="btn btn-secondary" id="modal-cancel">${t("cancel")}</button>
    </div>
  `);
  document.getElementById("modal-yes").onclick = () => { closeModal(); onYes(); };
  document.getElementById("modal-cancel").onclick = closeModal;
}

function togglePause() {
  if (state.gameOver) return;
  paused = !paused;
  if (paused) {
    openModal(`
      <h2>${t("paused")}</h2>
      <div class="modal-actions">
        <button class="btn btn-primary" id="modal-resume">${icon("play")} ${t("resume")}</button>
        <button class="btn btn-secondary" id="modal-quit">${icon("home")} ${t("quit")}</button>
      </div>
    `);
    document.getElementById("modal-resume").onclick = () => { paused = false; closeModal(); maybeTriggerAI(); };
    document.getElementById("modal-quit").onclick = () => { paused = false; closeModal(); showScreen("home"); };
  } else {
    closeModal();
  }
}

/* ============================================================
   12. RENDER ALL
   ============================================================ */
function renderAll() {
  drawBoardLines();
  renderBoard();
  updateStatusPanel();
}

/* ============================================================
   13. LEVEL / SCREEN FLOW
   ============================================================ */
function startLevel(level) {
  const p = Storage.load();
  if (level > p.unlockedLevel) { showMsg(t("level_locked")); return; }
  gameMode = "single";
  currentLevel = level;
  state = freshState(level);
  paused = false; aiBusy = false;
  showScreen("game");
  renderAll();
  maybeTriggerAI(); // in case human plays tiger and the AI (goat) must place first
}

function startTwoPlayerGame() {
  gameMode = "two";
  currentLevel = 0;
  state = freshState(0);
  paused = false; aiBusy = false;
  showScreen("game");
  renderAll();
}

function refreshLevelCards() {
  const p = Storage.load();
  [1, 2, 3].forEach(lvl => {
    const card = document.getElementById("level-card-" + lvl);
    const unlocked = lvl <= p.unlockedLevel;
    card.classList.toggle("locked", !unlocked);
  });
}

function refreshAchievements() {
  const p = Storage.load();
  const list = document.getElementById("achv-list");
  list.innerHTML = "";
  [1, 2, 3].forEach(lvl => {
    const done = p.completedLevels.includes(lvl);
    const div = document.createElement("div");
    div.className = "achv-item" + (done ? " done" : "");
    div.innerHTML = `<span>${t("lvl" + lvl + "_title")}</span><span>${done ? icon("check") : "—"}</span>`;
    list.appendChild(div);
  });
  const best = document.createElement("div");
  best.className = "achv-item done";
  best.innerHTML = `<span>${t("score")} (${t("achievements")})</span><span>${icon("crown")} ${p.bestScore}</span>`;
  list.appendChild(best);
}

function showScreen(name) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById("screen-" + name).classList.add("active");
  if (name === "levels") refreshLevelCards();
  if (name === "achievements") refreshAchievements();
}

/* ============================================================
   14. UI WIRING
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  applyI18N();
  const p = Storage.load();
  updateSoundButton(p.soundEnabled);

  document.getElementById("btn-play").onclick = () => showScreen("levels");
  document.getElementById("btn-howto").onclick = () => showScreen("howto");
  document.getElementById("btn-levels").onclick = () => showScreen("levels");
  document.getElementById("btn-achievements").onclick = () => showScreen("achievements");
  document.getElementById("btn-about").onclick = () => showScreen("about");

  document.querySelectorAll("[data-back]").forEach(btn => {
    btn.onclick = () => showScreen(btn.getAttribute("data-back"));
  });

  document.getElementById("lang-toggle").onclick = () => {
    currentLang = currentLang === "en" ? "ta" : "en";
    localStorage.setItem("selectedLanguage", currentLang);
    applyI18N();
    if (state) renderAll();
  };

  document.getElementById("sound-toggle").onclick = () => {
    const cur = Storage.load().soundEnabled;
    localStorage.setItem("soundEnabled", String(!cur));
    updateSoundButton(!cur);
    if (!cur) playSound("click");
  };

  document.querySelectorAll(".side-btn").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".side-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      humanSide = btn.getAttribute("data-side");
    };
  });

  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const mode = btn.getAttribute("data-mode");
      document.getElementById("single-player-options").classList.toggle("hidden", mode === "two");
      document.getElementById("two-player-options").classList.toggle("hidden", mode !== "two");
    };
  });

  document.getElementById("btn-start-two-player").onclick = startTwoPlayerGame;

  document.querySelectorAll(".level-play").forEach(btn => {
    btn.onclick = (e) => {
      const card = e.target.closest(".level-card");
      const lvl = parseInt(card.getAttribute("data-level"), 10);
      startLevel(lvl);
    };
  });

  document.getElementById("btn-reset-progress").onclick = () => {
    confirmDialog(t("confirm_reset"), () => { Storage.resetProgress(); refreshAchievements(); });
  };

  document.getElementById("btn-game-home").onclick = () => {
    confirmDialog(t("confirm_restart"), () => showScreen("home"));
  };
  document.getElementById("btn-restart").onclick = () => {
    confirmDialog(t("confirm_restart"), () => (gameMode === "two" ? startTwoPlayerGame() : startLevel(state.level)));
  };
  document.getElementById("btn-pause").onclick = togglePause;
  document.getElementById("btn-hint").onclick = showHint;
  document.getElementById("btn-claim-draw").onclick = () => {
    state.gameOver = true; state.winner = "draw";
    const isTwo = gameMode === "two";
    if (!isTwo) Storage.saveProgress(state.level, state.score);
    playSound("level");
    openModal(`
      <h2>${icon("scales")} ${t("draw_declared")}</h2>
      <div class="modal-stats">
        <div>${t("goat_moves")}: <b>${state.goatMoves}</b></div>
        <div>${t("tiger_moves")}: <b>${state.tigerMoves}</b></div>
        <div>${t("score")}: <b>${state.score}</b></div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-primary" id="modal-retry">${icon("restart")} ${t("play_again")}</button>
        <button class="btn btn-secondary" id="modal-home">${icon("home")} ${t("go_home")}</button>
      </div>
    `);
    document.getElementById("modal-retry").onclick = () => { closeModal(); isTwo ? startTwoPlayerGame() : startLevel(state.level); };
    document.getElementById("modal-home").onclick = () => { closeModal(); showScreen("home"); };
  };
});

function updateSoundButton(enabled) {
  const btn = document.getElementById("sound-toggle");
  btn.innerHTML = icon(enabled ? "volume" : "volume-off") + ` <span data-i18n="sound_on">${t("sound_on")}</span>`;
}
