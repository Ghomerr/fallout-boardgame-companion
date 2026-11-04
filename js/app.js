// Point d'entrée : routeur (hash), barre d'onglets, événements globaux, service worker.

import { ui, esc, hIcon, toast, closeSheet } from "./ui.js";
import { state, update, saveSoon, setOpen, wipe, isCoop, subscribe, resetGame, resetSetup } from "./store.js";
import * as V from "./views.js";

const $ = (id) => document.getElementById(id);

/* ====================================================================== Routes */

const TABS = [
  { route: "", label: "Accueil", icon: "home" },
  { route: "mise-en-place", label: "Préparer", icon: "setup" },
  { route: "jouer", label: "Jouer", icon: "play" },
  { route: "regles", label: "Règles", icon: "book" },
  { route: "glossaire", label: "Glossaire", icon: "search" },
];

/** Onglet actif selon la route courante. */
function tabFor(path) {
  const [head] = path.split("/");
  if (head === "action") return "jouer";
  if (["sujet", "coop", "decouvrir"].includes(head)) return "regles";
  if (head === "a-propos") return "";
  return head;
}

function resolve(path) {
  const [head, id] = path.split("/");
  switch (head) {
    case "": return V.home();
    case "decouvrir": return V.discover();
    case "mise-en-place": return V.setup();
    case "jouer": return V.play();
    case "regles": return V.rules();
    case "sujet": return V.topic(id);
    case "action": return V.action(id);
    case "glossaire": return V.glossary(id);
    case "coop": return V.coop();
    case "a-propos": return V.about();
    default: return V.notFound();
  }
}

const currentPath = () => decodeURIComponent(location.hash.replace(/^#\/?/, ""));

/* ====================================================================== Rendu */

let prevPath = null;

/** Replace la page à la position mémorisée (réessaie quand les images ont fini de charger). */
function restoreScroll(path) {
  const y = state.ui.scroll[path] || 0;
  if (!y) return;
  const apply = () => { if (currentPath() === path && Math.abs(window.scrollY - y) > 4) window.scrollTo(0, y); };
  requestAnimationFrame(apply);
  setTimeout(apply, 350);
  if (document.readyState !== "complete") addEventListener("load", apply, { once: true });
}

function render({ keepScroll = false, restore = false } = {}) {
  const path = currentPath();
  const view = resolve(path);
  const el = $("view");
  const y = window.scrollY;

  // Conteneur neuf à chaque rendu : les écouteurs posés par mount() ne s'accumulent pas.
  const page = document.createElement("div");
  page.className = "page";
  page.innerHTML = view.html;
  el.replaceChildren(page);
  view.mount?.(page);

  // Barre du haut
  $("topbar-title").innerHTML = `${hIcon(view.icon || "sparkle")}<span>${esc(view.title)}</span>`;
  const back = $("back-btn");
  back.hidden = view.back === undefined;
  back.dataset.target = view.back ?? "";

  const pill = $("mode-pill");
  pill.classList.toggle("is-coop", isCoop());
  pill.innerHTML = `${ui(isCoop() ? "users" : "user")}<span class="pill-txt">${isCoop() ? "Coop" : "Compét."} · </span>${state.players}J`;
  pill.title = `Mode ${isCoop() ? "coopératif" : "compétitif"}, ${state.players} joueur${state.players > 1 ? "s" : ""} — toucher pour changer de mode`;

  // Onglets
  const active = tabFor(path);
  $("tabbar").querySelectorAll(".tab").forEach((t) => {
    if (t.dataset.route === active) t.setAttribute("aria-current", "page");
    else t.removeAttribute("aria-current");
  });

  if (keepScroll) {
    window.scrollTo(0, y);
  } else if (path !== prevPath) {
    window.scrollTo(0, 0);
    el.classList.remove("is-entering");
    void el.offsetWidth;
    el.classList.add("is-entering");
    el.focus({ preventScroll: true });
    if (restore) restoreScroll(path);
  }
  prevPath = path;
  if (state.ui.route !== path) { state.ui.route = path; saveSoon(); }
  document.title = `${view.title} · Fallout – Compagnon`;
}

function buildTabbar() {
  $("tabbar").innerHTML = TABS.map((t) => `<a class="tab" href="#/${t.route}" data-route="${t.route}">${ui(t.icon)}<span>${t.label}</span></a>`).join("");
  $("back-btn").innerHTML = ui("back");
}

/* ====================================================================== Actions globales */

const ACTIONS = {
  mode(v) { update((s) => { s.mode = v; }); toast(v === "coop" ? "Mode coopératif activé" : "Mode compétitif activé"); },
  players(v) { update((s) => { s.players = +v; s.game.current %= +v; s.game.first %= +v; }); },
  friendly(v) { update((s) => { s.coop.friendly = v; }); },
  "setup-check"(v) { update((s) => { s.setupDone[v] = !s.setupDone[v]; }); },
  "setup-more"(v, btn) {
    const box = document.querySelector(`#step-${v} .check-more`);
    box.hidden = !box.hidden;
    btn.setAttribute("aria-expanded", String(!box.hidden));
    setOpen(`setup:${v}`, !box.hidden);
  },
  "reset-setup"() { resetSetup(); },
  pip(v) {
    const i = +v;
    update((s) => { s.game.actions = s.game.actions > i ? i : i + 1; });
  },
  "next-turn"() {
    const g = state.game, n = state.players;
    const last = (g.first + n - 1) % n;
    if (g.current === last) return V.endRoundSheet();
    update((s) => { s.game.current = (s.game.current + 1) % n; s.game.actions = 0; });
  },
  "next-round"(v) {
    const n = state.players;
    update((s) => {
      // Paquet épuisé : le joueur à droite du premier joueur (celui qui joue en dernier) devient premier joueur.
      if (v === "pass") s.game.first = (s.game.first + n - 1) % n;
      s.game.round += 1;
      s.game.current = s.game.first;
      s.game.actions = 0;
    });
    closeSheet();
    toast(`Manche ${state.game.round} — au tour du joueur ${state.game.current + 1}`);
  },
  "reset-game"() {
    if (confirm("Remettre la manche, les tours et les compteurs à zéro ?")) { resetGame(); toast("Nouvelle partie"); }
  },
  "reset-all"() {
    if (!confirm("Effacer tous vos réglages et votre progression ?")) return;
    wipe();
    location.replace(location.pathname);
  },
};

document.addEventListener("click", (e) => {
  // Lien vers un terme du glossaire : ouvre une feuille sans quitter la page
  const g = e.target.closest("[data-gloss]");
  if (g && !e.target.closest("#sheet")) {
    e.preventDefault();
    return V.openGlossSheet(g.dataset.gloss);
  }
  if (e.target.closest("[data-close-sheet]") || e.target.id === "sheet-backdrop") closeSheet();

  const a = e.target.closest("[data-action]");
  if (a && ACTIONS[a.dataset.action]) {
    e.preventDefault();
    ACTIONS[a.dataset.action](a.dataset.value, a);
  }
});

document.addEventListener("change", (e) => {
  const t = e.target.closest("[data-toggle]");
  if (!t || t.closest("[data-tool]")) return;
  const k = t.dataset.toggle;
  if (k.startsWith("coop:")) {
    const rule = k.slice(5);
    update((s) => { s.coop.rules[rule] = t.checked; });
  } else if (k === "wake") {
    setWakeLock(t.checked);
  }
});

// Sections repliables : mémorise lesquelles sont ouvertes (« toggle » ne remonte pas : écoute en capture)
document.addEventListener("toggle", (e) => {
  const key = e.target.dataset?.openKey;
  if (key) setOpen(key, e.target.open);
}, true);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSheet();
});

$("back-btn").addEventListener("click", () => {
  // Revenir en arrière si on vient de l'application, sinon aller à la page parente
  if (navStack.length > 1) history.back();
  else location.hash = `#/${$("back-btn").dataset.target}`;
});

$("mode-pill").addEventListener("click", () => {
  ACTIONS.mode(isCoop() ? "comp" : "coop");
});

/* ====================================================================== Écran allumé */

async function setWakeLock(on) {
  window.__wantWake = on;
  try {
    if (on) {
      window.__wakeLock = await navigator.wakeLock.request("screen");
      window.__wakeLock.addEventListener("release", () => { window.__wakeLock = null; });
      toast("L'écran restera allumé");
    } else {
      await window.__wakeLock?.release();
      window.__wakeLock = null;
    }
  } catch {
    toast("Fonction non disponible sur cet appareil");
    render({ keepScroll: true });
  }
}
// Le verrou est relâché quand l'onglet est masqué : on le reprend au retour.
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && window.__wantWake && !window.__wakeLock) setWakeLock(true);
});

/* ====================================================================== Démarrage */

// Pile de navigation interne : sert à détecter un retour arrière pour retrouver la position de lecture.
const navStack = [];
window.addEventListener("hashchange", () => {
  closeSheet();
  const path = currentPath();
  const isBack = navStack.length > 1 && navStack[navStack.length - 2] === path;
  if (isBack) navStack.pop();
  else navStack.push(path);
  render({ restore: isBack });
});

// Mémorise la position de défilement de chaque page
addEventListener("scroll", () => {
  state.ui.scroll[currentPath()] = Math.round(window.scrollY);
  saveSoon();
}, { passive: true });

// Re-rendu sur changement d'état, en conservant la position de défilement
subscribe(() => render({ keepScroll: true }));

// La position est gérée par l'appli (le rendu est asynchrone pour le navigateur).
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

// Réouverture de l'appli (icône d'accueil, nouvel onglet) : reprendre là où on s'était arrêté.
if (!location.hash && state.ui.route) history.replaceState(null, "", `#/${state.ui.route}`);

buildTabbar();
navStack.push(currentPath());
render({ restore: true });

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
