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
  // Où en était l'utilisateur, pour reprendre au même endroit (F5, réouverture de l'appli)
  ui: {
    route: "",             // dernière page affichée (sans « #/ »)
    scroll: {},            // route -> position de défilement
    slide: 0,              // diapositive de « Le jeu en 2 min »
    gloss: "",             // dernière recherche du glossaire
    open: {},              // blocs dépliés (« Détails », sections repliables) : clé -> true
  },
  tools: {},               // valeurs saisies dans les assistants : id d'outil -> objet
};

function clone(o) { return JSON.parse(JSON.stringify(o)); }

const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

/** Fusionne la sauvegarde dans les valeurs par défaut (les objets vides par défaut acceptent toute clé). */
function merge(base, extra) {
  if (!isObj(extra)) return base;
  if (Object.keys(base).length === 0) return { ...extra };
  for (const k of Object.keys(base)) {
    if (!(k in extra)) continue;
    base[k] = isObj(base[k]) ? merge(base[k], extra[k]) : extra[k];
  }
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

let wiped = false;

export function save() {
  if (wiped) return;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* stockage indisponible */ }
}

/** Efface la sauvegarde et empêche toute réécriture avant le rechargement. */
export function wipe() {
  wiped = true;
  try { localStorage.removeItem(KEY); } catch { /* rien */ }
}

let saveTimer;
/** Sauvegarde différée, pour les changements fréquents (défilement, saisie). */
export function saveSoon() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(save, 250);
}
// Ne rien perdre si l'onglet est fermé pendant le délai
addEventListener("pagehide", save);

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

/** Objet d'état persistant d'un outil, initialisé avec ses valeurs par défaut. */
export function toolState(id, defaults) {
  state.tools[id] = { ...defaults, ...(state.tools[id] || {}) };
  return state.tools[id];
}

/** Bloc déplié ou non (persisté). */
export const isOpen = (key) => !!state.ui.open[key];
export function setOpen(key, open) {
  if (open) state.ui.open[key] = true;
  else delete state.ui.open[key];
  saveSoon();
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
