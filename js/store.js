// État de l'application, persisté dans le navigateur (localStorage).

const KEY = "fallout-companion:v1";

const DEFAULTS = {
  mode: "comp",            // "comp" (compétitif, règles de base) | "coop" (règles coop non officielles)
  players: 2,              // 1 à 4
  coop: {
    friendly: "star",      // faction alliée : "star" | "shield"
    targetDelta: 0,        // ajustement de difficulté (+/- cartes Agenda à réunir)
    rules: {               // règles optionnelles du document coop
      rangeAdv: false,
      freeTiles: false,
      roleplay: false,
      assist: false,
      capKill: false,
      respawn: false,      // variante maison : réapparition standard au lieu de la défaite
    },
  },
  setupDone: {},           // id d'étape -> true
  game: { round: 1, current: 0, first: 0, actions: 0, agendas: 0 },
  seenIntro: false,
};

function clone(o) { return JSON.parse(JSON.stringify(o)); }

function merge(base, extra) {
  if (!extra || typeof extra !== "object") return base;
  for (const k of Object.keys(base)) {
    if (!(k in extra)) continue;
    const b = base[k], e = extra[k];
    base[k] = b && typeof b === "object" && !Array.isArray(b) ? merge(b, e) : e;
  }
  // setupDone a des clés dynamiques
  if (extra.setupDone) base.setupDone = { ...extra.setupDone };
  return base;
}

function load() {
  try {
    return merge(clone(DEFAULTS), JSON.parse(localStorage.getItem(KEY) || "null"));
  } catch {
    return clone(DEFAULTS);
  }
}

export const state = load();
const listeners = new Set();

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* stockage indisponible */ }
}

/** Modifie l'état via une fonction, sauvegarde et notifie les abonnés. */
export function update(fn) {
  fn(state);
  save();
  listeners.forEach((l) => l(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export const isCoop = () => state.mode === "coop";

/** Influence (compétitif) nécessaire pour gagner selon le nombre de joueurs. */
export const influenceTarget = (n = state.players) => ({ 1: 11, 2: 10, 3: 9, 4: 8 })[n];

/** Cartes Agenda à réunir en coop (6/7/8/9), ajustables. */
export const coopTarget = (n = state.players) =>
  Math.max(1, ({ 1: 6, 2: 7, 3: 8, 4: 9 })[n] + state.coop.targetDelta);

export function resetGame() {
  update((s) => { s.game = clone(DEFAULTS.game); });
}

export function resetSetup() {
  update((s) => { s.setupDone = {}; });
}
