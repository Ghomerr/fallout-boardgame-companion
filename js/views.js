// Vues de l'application. Chaque vue renvoie { title, html, back?, mount?(root) }.

import { gi, ui, icon, fmt, esc, renderBlocks, callout, figure, heading, hIcon, stepper, toggle, openSheet, sheetHead, norm, visible } from "./ui.js";
import { state, update, save, saveSoon, isOpen, isCoop, influenceTarget, coopTarget } from "./store.js";
import { ACTIONS, ACTION_BY_ID } from "./data/actions.js";
import { TOPICS, TOPIC_BY_ID, TOPIC_GROUPS } from "./data/topics.js";
import { GLOSSARY } from "./data/glossary.js";
import { SETUP_STEPS } from "./data/setup.js";
import { mountTools, combatExample, victoryBlock, factionPicker } from "./tools.js";

/* ====================================================================== Contexte commun */

/** Titre et icône d'une route interne (pour les liens « Voir aussi »). */
export function routeInfo(route) {
  const [kind, id] = route.split("/");
  if (kind === "action" && ACTION_BY_ID[id]) return { t: ACTION_BY_ID[id].title, i: ACTION_BY_ID[id].icon, d: ACTION_BY_ID[id].short };
  if (kind === "sujet" && TOPIC_BY_ID[id]) return { t: TOPIC_BY_ID[id].title, i: TOPIC_BY_ID[id].icon, d: TOPIC_BY_ID[id].short };
  return ({
    coop: { t: "Mode coopératif", i: "users", d: "Règles et réglages coop" },
    jouer: { t: "En jeu", i: "play", d: "Les actions du tour" },
    "mise-en-place": { t: "Mise en place", i: "setup", d: "Installer la partie" },
    decouvrir: { t: "Découvrir le jeu", i: "sparkle", d: "Le jeu en 2 minutes" },
    glossaire: { t: "Glossaire", i: "search", d: "Tous les termes" },
  })[route] || { t: route, i: "chev" };
}

function linkCard(route, t, d, i) {
  return `<a class="link-card" href="#/${route}">
    <span class="icon-badge">${icon(i)}</span>
    <span class="body"><span class="t">${fmt(t)}</span>${d ? `<span class="d">${fmt(d)}</span>` : ""}</span>
    ${ui("chev", "chev")}</a>`;
}

function links(items, title = "Voir aussi") {
  return `<section>${heading(esc(title), "link")}<div class="link-list" style="margin-top:12px">${items
    .map((r) => { const x = routeInfo(r); return linkCard(r, x.t, x.d, x.i); })
    .join("")}</div></section>`;
}

const CTX = { links, linkCard, combatExample, victoryBlock: () => victoryBlock(CTX), factionPicker };

const modeLabel = () => (isCoop() ? "Coopératif" : "Compétitif");

function settingsCard() {
  const p = state.players;
  return `<section class="card settings-card">
    <span class="eyebrow">${ui("compass")} Votre partie</span>
    <div class="seg coop" role="group" aria-label="Mode de jeu">
      <button data-action="mode" data-value="comp" aria-pressed="${!isCoop()}">${ui("user")} Compétitif</button>
      <button data-action="mode" data-value="coop" aria-pressed="${isCoop()}">${ui("users")} Coopératif</button>
    </div>
    <div class="field"><div class="lbl">Nombre de joueurs</div>
      <div class="seg" role="group" aria-label="Nombre de joueurs" style="width:190px">
        ${[1, 2, 3, 4].map((n) => `<button data-action="players" data-value="${n}" aria-pressed="${p === n}">${n}</button>`).join("")}
      </div>
    </div>
    <p class="small muted">${fmt(isCoop()
      ? `**Coop** : l'équipe doit réunir **${coopTarget()} cartes Agenda** et mener sa faction alliée au bout de sa piste. [Règles coop](#/coop)`
      : `**Compétitif** (règles officielles) : le premier à **${influenceTarget()} influence** :influence: gagne.`)}</p>
  </section>`;
}

/* ====================================================================== Accueil */

export function home() {
  return {
    title: "Fallout",
    icon: "home",
    html: `
      <section class="hero"><div class="in">
        <span class="eyebrow">${ui("sparkle")} Compagnon de jeu</span>
        <h2>Survivre aux Terres désolées</h2>
        <p>Tout pour jouer à <strong>Fallout, le jeu de plateau</strong>, sans lire le livret.</p>
      </div></section>

      <div class="quick-grid">
        <a class="quick primary" href="#/decouvrir"><span class="icon-badge">${ui("sparkle")}</span>
          <span><span class="t">${state.seenIntro ? "Revoir le jeu en 2 min" : "Nouveau ? Le jeu en 2 min"}</span><br><span class="d">Les idées clés, sans jargon.</span></span></a>
        <a class="quick" href="#/mise-en-place"><span class="icon-badge">${ui("setup")}</span><span><span class="t">Préparer</span><br><span class="d">La mise en place pas à pas</span></span></a>
        <a class="quick" href="#/jouer"><span class="icon-badge">${ui("play")}</span><span><span class="t">Jouer</span><br><span class="d">Le tour et les actions</span></span></a>
        <a class="quick" href="#/sujet/combat"><span class="icon-badge">${ui("fight")}</span><span><span class="t">Combat</span><br><span class="d">Dés V.A.T.S. + assistant</span></span></a>
        <a class="quick" href="#/sujet/niveau"><span class="icon-badge">${ui("xp")}</span><span><span class="t">Niveaux</span><br><span class="d">XP, S.P.E.C.I.A.L., aptitudes</span></span></a>
        <a class="quick" href="#/sujet/victoire"><span class="icon-badge">${ui("trophy")}</span><span><span class="t">Victoire</span><br><span class="d">Comment gagner</span></span></a>
        <a class="quick" href="#/glossaire"><span class="icon-badge">${ui("search")}</span><span><span class="t">Glossaire</span><br><span class="d">Un mot → son explication</span></span></a>
      </div>

      ${settingsCard()}

      <a class="link-card" href="#/coop"><span class="icon-badge" style="color:var(--blue)">${ui("users")}</span>
        <span class="body"><span class="t">Jouer en coopération</span><span class="d">Règles coop (non officielles) et options</span></span>${ui("chev", "chev")}</a>
      <a class="link-card" href="#/a-propos"><span class="icon-badge">${ui("info")}</span>
        <span class="body"><span class="t">À propos</span><span class="d">Sources, crédits, installation</span></span>${ui("chev", "chev")}</a>`,
  };
}

/* ====================================================================== Découvrir */

function slides() {
  const n = state.players;
  return [
    { i: "user", title: "Bienvenue dans les Terres désolées", lead: "Un jeu d'aventure pour **1 à 4 joueurs**. Chacun incarne un **survivant** qui explore une région ravagée par la guerre nucléaire.",
      text: "Vous allez fouiller des ruines, croiser des personnages, combattre des créatures, accomplir des quêtes… et faire des choix qui changent le destin de la région.",
      img: ["img/photo-tuiles.jpg", "Tuiles de carte hexagonales"] },
    isCoop()
      ? { i: "influence", title: "Votre but, ensemble", lead: `Réunir **${coopTarget(n)} cartes Agenda** :influence: en équipe, **puis** mener votre faction alliée au bout de sa piste.`,
          text: "Mais attention au timing : si votre faction gagne trop tôt, vous perdez. Et un seul survivant tué fait perdre tout le monde !",
          img: ["img/photo-cartes.jpg", "Paquets de cartes"] }
      : { i: "influence", title: "Votre but", lead: `Être le premier à gagner **${influenceTarget(n)} influence** :influence:.`,
          text: "L'influence vient des **cartes Agenda**, des objectifs secrets : chacune vaut 1 point, plus des bonus si leurs conditions sont remplies (souvent : telle faction est en tête).",
          img: ["img/photo-cartes.jpg", "Paquets de cartes"] },
    { i: "star", title: "Deux factions s'affrontent", lead: "Chaque scénario oppose deux factions, :star: et :shield:.",
      text: "Vos quêtes les font avancer sur une **piste de puissance**. Si l'une arrive au bout, la partie s'arrête net. À vous de choisir qui aider… ou trahir." },
    { i: "play", title: "Votre tour : 2 actions", lead: "À votre tour, faites **2 actions** parmi six (deux fois la même si vous voulez) :",
      html: `<div class="action-grid">${ACTIONS.map((a) => `<div class="action-tile" style="min-height:0"><span class="icon-badge">${icon(a.icon)}</span><span class="t">${a.title}</span><span class="d">${fmt(a.short)}</span></div>`).join("")}</div>` },
    { i: "dice", title: "Les dés V.A.T.S.", lead: "Trois dés pour les **tests** et les **combats**.",
      text: "Chaque face montre une **silhouette** dont certaines zones sont pleines, et parfois des symboles ✱ (:hit:). En **test**, on compte les :hit:. En **combat**, les zones pleines communes avec l'ennemi le touchent… et les :hit: vous blessent !",
      img: ["img/photo-des.jpg", "Les trois dés V.A.T.S. et un jeton ennemi"], credit: "Photo : Board Game Quest" },
    { i: "xp", title: "Devenir plus fort", lead: "Tuer des ennemis et réussir des quêtes rapporte de l'**XP**.",
      text: "En montant de niveau, vous gagnez des jetons **S.P.E.C.I.A.L.** (Force, Perception…) qui donnent des relances, ou des **aptitudes**. Armes, tenues et compagnons s'achètent ou se trouvent.",
      img: ["img/photo-special.jpg", "Jetons S.P.E.C.I.A.L."] },
    { i: "round", title: "Le danger se réveille", lead: "Après le tour de chacun, on révèle une **carte Agenda** : les icônes en bas disent **quels ennemis bougent et attaquent**.",
      text: "Puis une nouvelle manche commence. Prêt ? On installe la partie !",
      img: ["img/photo-ennemis.jpg", "Jetons ennemis"], last: true },
  ];
}

export function discover() {
  const list = slides();
  return {
    title: "Le jeu en 2 min",
    icon: "sparkle",
    back: "",
    html: `
      <div class="slides" id="slides" aria-roledescription="carrousel">
        ${list.map((s, i) => `
          <article class="slide" aria-roledescription="diapositive" aria-label="${i + 1} sur ${list.length}">
            <div class="slide-main">
              <span class="slide-num">${String(i + 1).padStart(2, "0")} / ${String(list.length).padStart(2, "0")}</span>
              <span class="icon-badge lg">${icon(s.i, s.i === "star" ? "c-star" : "")}</span>
              <h2>${esc(s.title)}</h2>
              <p class="lead">${fmt(s.lead)}</p>
              ${s.text ? `<p class="muted">${fmt(s.text)}</p>` : ""}
              ${s.html || ""}
            </div>
            ${s.img ? figure(s.img[0], s.img[1], "", s.credit || "Photo : Zatu Games") : ""}
            ${s.last ? `<a class="btn block" href="#/mise-en-place">${ui("setup")} Préparer la partie</a>` : ""}
          </article>`).join("")}
      </div>
      <div class="dots" id="dots">${list.map((_, i) => `<button aria-label="Diapositive ${i + 1}" data-slide="${i}"${i === Math.min(state.ui.slide, list.length - 1) ? ' aria-current="true"' : ""}></button>`).join("")}</div>
      <div class="slides-nav">
        <button class="btn ghost" data-slide-nav="-1">${ui("back")} Précédent</button>
        <button class="btn" data-slide-nav="1">Suivant ${ui("next")}</button>
      </div>`,
    mount(root) {
      if (!state.seenIntro) { state.seenIntro = true; save(); }
      const box = root.querySelector("#slides");
      const dots = [...root.querySelectorAll("[data-slide]")];
      const cur = () => Math.round(box.scrollLeft / box.clientWidth);
      const go = (i) => box.scrollTo({ left: Math.max(0, Math.min(list.length - 1, i)) * box.clientWidth, behavior: "smooth" });
      // Reprend à la dernière diapositive vue
      requestAnimationFrame(() => { box.scrollLeft = Math.min(state.ui.slide, list.length - 1) * box.clientWidth; });
      box.addEventListener("scroll", () => {
        const c = cur();
        dots.forEach((d, i) => d.setAttribute("aria-current", i === c));
        if (state.ui.slide !== c) { state.ui.slide = c; saveSoon(); }
      }, { passive: true });
      root.addEventListener("click", (e) => {
        const d = e.target.closest("[data-slide]");
        if (d) go(+d.dataset.slide);
        const n = e.target.closest("[data-slide-nav]");
        if (n) go(cur() + +n.dataset.slideNav);
      });
    },
  };
}

/* ====================================================================== Mise en place */

function resolve(v) {
  const s = { ...state, coopTarget: coopTarget() };
  return typeof v === "function" ? v(s) : v;
}

export function setup() {
  const steps = SETUP_STEPS.filter(visible);
  const done = steps.filter((s) => state.setupDone[s.id]).length;
  const pct = Math.round((done / steps.length) * 100);
  return {
    title: "Mise en place",
    icon: "setup",
    html: `
      ${settingsCard()}
      <section>
        <div class="turn-head"><h3 class="card-title">${hIcon("setup")}${done} / ${steps.length} étapes</h3>
          <button class="btn ghost small" data-action="reset-setup">${ui("reset")} Tout décocher</button></div>
        <div class="progress" style="margin-top:10px" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>
      </section>
      <ol class="check-list">
        ${steps.map((s, i) => {
          const det = resolve(s.details);
          const isDone = !!state.setupDone[s.id];
          return `<li class="check-item${isDone ? " done" : ""}" id="step-${s.id}">
            <div class="check-head">
              <button class="check-box" data-action="setup-check" data-value="${s.id}" aria-pressed="${isDone}" aria-label="Étape ${i + 1} faite">${ui("check")}</button>
              <div class="body">
                <div class="t"><span class="mono muted">${i + 1}.</span> ${esc(s.title)}${s.mode === "coop" ? '<span class="tag">COOP</span>' : ""}</div>
                <div class="d">${fmt(resolve(s.text))}</div>
                ${det ? `<button class="check-toggle" data-action="setup-more" data-value="${s.id}" aria-expanded="${isOpen(`setup:${s.id}`)}">${ui("info")} Détails</button>` : ""}
              </div>
            </div>
            ${det ? `<div class="check-more"${isOpen(`setup:${s.id}`) ? "" : " hidden"}>${renderBlocks(det, CTX)}</div>` : ""}
          </li>`;
        }).join("")}
      </ol>
      ${done === steps.length
        ? `<section class="card" style="border-color:var(--green-dim)">${heading("Tout est prêt !", "check", { cls: "card-title" })}<p>Le premier joueur commence. Bonne chance, survivant.</p><a class="btn block" href="#/jouer">${ui("play")} Lancer la partie</a></section>`
        : `<a class="btn ghost block" href="#/jouer">${ui("play")} Passer au mode « En jeu »</a>`}`,
  };
}

/* ====================================================================== En jeu */

export function play() {
  const g = state.game;
  const n = state.players;
  const order = Array.from({ length: n }, (_, i) => (g.first + i) % n);
  const isLast = g.current === order[n - 1];
  return {
    title: "En jeu",
    icon: "play",
    html: `
      <section class="card turn-card">
        <div class="turn-head">
          <span class="round-badge">MANCHE <b>${g.round}</b></span>
          <div class="player-dots" aria-label="Ordre des joueurs">
            ${Array.from({ length: n }, (_, i) => `<i class="${i === g.current ? "cur" : ""}${i === g.first ? " first" : ""}" title="Joueur ${i + 1}${i === g.first ? " (premier joueur)" : ""}">${i + 1}</i>`).join("")}
          </div>
        </div>
        <h3 class="card-title" style="color:#fff">${hIcon("user")}${n > 1 ? `Au tour du joueur ${g.current + 1}` : "À vous de jouer"}</h3>
        <div class="pips">
          ${[0, 1].map((i) => `<button class="pip${g.actions > i ? " used" : ""}" data-action="pip" data-value="${i}" aria-pressed="${g.actions > i}">${ui(g.actions > i ? "check" : "play")} Action ${i + 1}</button>`).join("")}
        </div>
        <div class="btn-row">
          <a class="btn ghost small" href="#/sujet/debut-tour">${ui("info")} Début de tour</a>
          <button class="btn small" data-action="next-turn">${isLast ? `${ui("round")} Fin de manche` : `Tour suivant ${ui("next")}`}</button>
        </div>
      </section>

      ${isCoop()
        ? `<section class="card"><div class="counter-row"><span class="icon-badge" style="color:var(--blue)">${gi("influence")}</span>
            <div class="body"><div class="t" style="font:600 1rem var(--font-head);text-transform:uppercase">Cartes Agenda de l'équipe</div>
            <div class="small muted">Objectif : ${coopTarget()} avant que la faction alliée ne finisse sa piste</div>
            <div class="meter">${Array.from({ length: coopTarget() }, (_, i) => `<i class="${i < g.agendas ? "on" : ""}"></i>`).join("")}</div></div>
            ${stepper("agendas", g.agendas, 0, 20)}</div></section>`
        : `<p class="small muted">${fmt(`Objectif : **${influenceTarget()} influence** :influence: · [Comment gagner](#/sujet/victoire)`)}</p>`}

      <section>
        ${heading("Les 6 actions", "play")}
        <div class="action-grid" style="margin-top:12px">
          ${ACTIONS.map((a) => `<a class="action-tile" href="#/action/${a.id}">
            ${a.restricted ? `<span class="flag" title="Impossible avec un ennemi actif dans votre case">${ui("warn")}</span>` : ""}
            <span class="icon-badge">${icon(a.icon)}</span><span class="t">${a.title}</span><span class="d">${fmt(a.short)}</span></a>`).join("")}
        </div>
        <p class="small muted" style="margin-top:10px">${fmt(":warn: = impossible si un **ennemi actif** est dans votre case.")}</p>
      </section>

      <section>
        ${heading("Pendant la partie", "clock")}
        <div class="link-list" style="margin-top:12px">
          ${["sujet/combat", "sujet/test", "sujet/fin-manche", "sujet/niveau", "sujet/sante", "sujet/ennemis", "sujet/boutique", "sujet/resultats"]
            .map((r) => { const x = routeInfo(r); return linkCard(r, x.t, x.d, x.i); }).join("")}
        </div>
      </section>

      <section class="card">
        <div class="field"><div class="lbl">${ui("sun")} Garder l'écran allumé<small>Pratique pendant la partie</small></div>${toggle("wake", !!window.__wakeLock, "Garder l'écran allumé")}</div>
        <div class="field"><div class="lbl">Nouvelle partie<small>Remet la manche et les compteurs à zéro</small></div>
          <button class="btn ghost small" data-action="reset-game">${ui("reset")} Réinitialiser</button></div>
      </section>`,
    mount(root) {
      root.addEventListener("click", (e) => {
        const b = e.target.closest("[data-stepper='agendas'] [data-step]");
        if (!b) return;
        update((s) => { s.game.agendas = Math.max(0, Math.min(20, s.game.agendas + +b.dataset.step)); });
      });
    },
  };
}

/** Feuille « fin de manche » ouverte depuis le mode En jeu. */
export function endRoundSheet() {
  const n = state.players;
  openSheet(`
    ${sheetHead(`Fin de la manche ${state.game.round}`, "round")}
    <ol class="steps">
      <li><span class="st">Révélez une carte Agenda</span><span class="sd">Le premier joueur retourne la carte du dessus.</span></li>
      <li><span class="st">Activez les ennemis</span><span class="sd">${fmt("Types en bas de la carte, de gauche à droite. Actifs : 1 case vers le survivant le plus proche, ou attaque s'il est déjà là (ou à côté avec :ranged:).")}</span></li>
      <li><span class="st">Réveillez les inactifs</span><span class="sd">Les jetons face cachée de ces types se retournent (sans bouger).</span></li>
      <li><span class="st">Défaussez la carte</span></li>
    </ol>
    ${callout("info", isCoop()
      ? "Paquet Agenda vide ? Mélangez la défausse, le joueur à droite du premier joueur devient premier joueur, et **seule la faction ennemie** avance d'une case."
      : n === 1
        ? "Paquet Agenda vide ? Mélangez la défausse ; seule la faction **la moins puissante** avance d'une case (les deux si égalité)."
        : "Paquet Agenda vide ? Mélangez la défausse, le joueur à droite du premier joueur devient premier joueur, et **chaque faction** avance d'une case.", "Paquet épuisé")}
    <div class="btn-row">
      <button class="btn" data-action="next-round">${ui("next")} Manche suivante</button>
    </div>
    ${n > 1 ? `<button class="btn ghost block" data-action="next-round" data-value="pass">${ui("round")} Paquet épuisé : manche suivante + nouveau 1er joueur</button>` : ""}
    <a class="btn ghost block" href="#/sujet/fin-manche" data-close-sheet>Tous les détails</a>`);
}

/* ====================================================================== Règles (index) */

export function rules() {
  return {
    title: "Règles",
    icon: "book",
    html: `
      <p class="lead">Tout le jeu, découpé en petites fiches.</p>
      <section>${heading("Les actions", "play")}
        <div class="action-grid" style="margin-top:12px">
          ${ACTIONS.map((a) => `<a class="action-tile" href="#/action/${a.id}" style="min-height:0"><span class="icon-badge">${icon(a.icon)}</span><span class="t">${a.title}</span></a>`).join("")}
        </div></section>
      ${TOPIC_GROUPS.map(([g, label, gIcon]) => `
        <section>${heading(esc(label), gIcon)}
          <div class="link-list" style="margin-top:12px">
            ${TOPICS.filter((t) => t.group === g).map((t) => linkCard(`sujet/${t.id}`, t.title, t.short, t.icon)).join("")}
          </div></section>`).join("")}
      <section>${heading("Variantes", "users")}
        <div class="link-list" style="margin-top:12px">
          ${linkCard("coop", "Mode coopératif", "Règles coop non officielles + options", "users")}
        </div></section>`,
  };
}

/* ====================================================================== Fiche sujet / action */

function pageHead(title, en, ic) {
  return `<header class="page-head"><span class="icon-badge lg">${icon(ic, ic === "star" ? "c-star" : "")}</span>
    <div class="body"><span class="en">${esc(en)}</span><h2>${esc(title)}</h2></div></header>`;
}

export function topic(id) {
  const t = TOPIC_BY_ID[id];
  if (!t) return notFound();
  return {
    title: t.title,
    icon: t.icon,
    back: "regles",
    html: `${pageHead(t.title, t.en, t.icon)}${renderBlocks(t.blocks, CTX)}${t.links ? links(t.links) : ""}`,
    mount: mountTools,
  };
}

export function action(id) {
  const a = ACTION_BY_ID[id];
  if (!a) return notFound();
  return {
    title: a.title,
    icon: a.icon,
    back: "jouer",
    html: `
      ${pageHead(a.title, `Action · ${a.en}`, a.icon)}
      ${renderBlocks([{ t: "summary", text: a.summary }])}
      <section class="card"><span class="eyebrow">${ui("clock")} Quand ?</span>
        <div class="cond-list">${a.when.map(([k, txt]) => `<div class="cond ${k}">${ui(k === "ok" ? "check" : "close")}<span>${fmt(txt)}</span></div>`).join("")}</div>
      </section>
      ${renderBlocks(a.blocks, CTX)}
      ${a.links ? links(a.links) : ""}`,
    mount: mountTools,
  };
}

/* ====================================================================== Glossaire */

function glossItem(g, q) {
  const hl = (s) => {
    if (!q) return fmt(s);
    // Surligne la requête (insensible aux accents) sans casser le balisage
    const plain = s.replace(/\*\*|:\w+:|\[|\]\([^)]*\)/g, "");
    const i = norm(plain).indexOf(q);
    return i < 0 ? fmt(s) : `${esc(plain.slice(0, i))}<mark>${esc(plain.slice(i, i + q.length))}</mark>${esc(plain.slice(i + q.length))}`;
  };
  return `<button class="gloss-item" data-gloss="${g.id}">
    <div class="t">${icon(g.icon)} <span>${hl(g.fr)}</span> <span class="en">${esc(g.en)}</span></div>
    <div class="d">${fmt(g.def)}</div></button>`;
}

function glossResults(qRaw) {
  const q = norm(qRaw);
  const sorted = [...GLOSSARY].sort((a, b) => a.fr.localeCompare(b.fr, "fr"));
  if (!q) {
    let last = "";
    return sorted.map((g) => {
      const L = norm(g.fr)[0].toUpperCase();
      const head = L !== last ? `<div class="gloss-letter">${(last = L)}</div>` : "";
      return head + glossItem(g);
    }).join("");
  }
  const score = (g) => {
    const fr = norm(g.fr), en = norm(g.en);
    if (fr.startsWith(q) || en.startsWith(q)) return 3;
    if (fr.includes(q) || en.includes(q) || norm(g.alias || "").includes(q)) return 2;
    if (norm(g.def).includes(q)) return 1;
    return 0;
  };
  const hits = sorted.map((g) => [score(g), g]).filter(([s]) => s).sort((a, b) => b[0] - a[0]);
  return hits.length
    ? hits.map(([, g]) => glossItem(g, q)).join("")
    : `<div class="empty">${ui("search")}<p>Aucun résultat pour « ${esc(qRaw)} ».</p><p class="small">Essayez le terme anglais imprimé sur la carte.</p></div>`;
}

export function openGlossSheet(id) {
  const g = GLOSSARY.find((x) => x.id === id);
  if (!g) return;
  const info = g.link ? routeInfo(g.link) : null;
  openSheet(`
    ${sheetHead(g.fr.replace(/:\w+:/g, "").trim(), g.icon)}
    <p class="mono muted">Sur le matériel : « ${esc(g.en)} »</p>
    <p class="lead">${fmt(g.def)}</p>
    ${info ? `<a class="btn block" href="#/${g.link}" data-close-sheet>${ui("book")} En savoir plus : ${esc(info.t)}</a>` : ""}`);
}

export function glossary(id) {
  return {
    title: "Glossaire",
    icon: "search",
    html: `
      <label class="search">${ui("search")}
        <input id="gloss-q" type="search" placeholder="Tapez un mot (FR ou EN)…" autocomplete="off" enterkeyhint="search" aria-label="Rechercher un terme" value="${esc(state.ui.gloss)}">
        <button id="gloss-clear" aria-label="Effacer"${state.ui.gloss ? "" : " hidden"}>${ui("close")}</button>
      </label>
      <div class="gloss-list" id="gloss-list">${glossResults(state.ui.gloss)}</div>`,
    mount(root) {
      const inp = root.querySelector("#gloss-q");
      const list = root.querySelector("#gloss-list");
      const clr = root.querySelector("#gloss-clear");
      const run = () => {
        list.innerHTML = glossResults(inp.value);
        clr.hidden = !inp.value;
        state.ui.gloss = inp.value;
        saveSoon();
      };
      inp.addEventListener("input", run);
      clr.addEventListener("click", () => { inp.value = ""; run(); inp.focus(); });
      if (id) openGlossSheet(id);
    },
  };
}

/* ====================================================================== Coop */

const COOP_RULES = [
  ["rangeAdv", "Avantage à distance", "Plus de touche bonus pour :ranged:. À la place, une cible sans :ranged: à 1 case ne peut pas blesser l'attaquant à distance."],
  ["freeTiles", "Placement libre des tuiles", "Les tuiles révélées en explorant peuvent être orientées comme vous voulez."],
  ["roleplay", "Jeu de rôle de faction", "Résolvez les quêtes dans l'intérêt de votre faction alliée."],
  ["assist", "Assistance", "+1 relance par autre survivant dans votre case pendant un test ou un combat."],
  ["capKill", "Prime", "+1 Capsule :caps: par ennemi tué en combat."],
];

export function coop() {
  const r = state.coop.rules;
  const f = state.coop.friendly;
  const enemyF = f === "star" ? "shield" : "star";
  return {
    title: "Mode coopératif",
    icon: "users",
    back: "",
    html: `
      ${pageHead("Mode coopératif", "Fallout Board Game Coop Rules v4 · non officiel", "users")}
      ${isCoop() ? "" : `<section class="card" style="border-color:var(--blue)"><p>Vous êtes en mode <strong>compétitif</strong>. Activez le mode coop pour adapter toute l'application (mise en place, combat, victoire…).</p>
        <button class="btn block" data-action="mode" data-value="coop" style="background:var(--blue);border-color:var(--blue);color:#04182b">${ui("users")} Activer le mode coop</button></section>`}
      ${renderBlocks([{ t: "summary", text: "Tous les survivants jouent **dans le même camp**, alliés à une faction. Toutes les règles de base s'appliquent, sauf ce qui suit." }])}

      <section class="card">${heading("Votre faction alliée", "star", { cls: "card-title" })}${factionPicker()}
        <p class="small muted">${fmt(`Alliée : ${gi(f, f === "star" ? "c-star" : "c-shield")} · Ennemie : ${gi(enemyF, enemyF === "star" ? "c-star" : "c-shield")}`)}</p></section>

      <section class="card">${heading("Objectif", "flag", { cls: "card-title" })}
        <div class="field"><div class="lbl">Cartes Agenda à réunir<small>${state.players} survivant${state.players > 1 ? "s" : ""} · base ${({ 1: 6, 2: 7, 3: 8, 4: 9 })[state.players]} ${state.coop.targetDelta ? `(${state.coop.targetDelta > 0 ? "+" : ""}${state.coop.targetDelta} difficulté)` : ""}</small></div>
          ${stepper("coopTarget", coopTarget(), 1, 20)}</div>
        ${renderBlocks([{ t: "table", head: ["Survivants", "Cartes Agenda"], num: true, hl: state.players - 1, rows: [["Solo", 6], ["2", 7], ["3", 8], ["4", 9]] }])}
        <p class="small muted">Les cartes sont comptées pour toute l'équipe : 1 carte = 1 point, pas de limite de main, et le texte d'influence bonus est ignoré.</p>
      </section>

      ${victoryBlock(CTX, { summary: false, coopRules: true })}

      <section class="card">${heading("Le paquet Agenda (10 cartes)", "influence", { cls: "card-title" })}
        ${figure("img/coop-agenda.jpg", "Trois piles de cartes Agenda", "Gauche : :star: · milieu : sans faction (6) · droite : :shield:")}
        ${renderBlocks([{ t: "bullets", items: [
          `Gardez les **6 cartes sans faction** + les **4 de la faction ennemie** (${gi(enemyF)}). Le reste ne sert pas.`,
          "Ce paquet sert à l'**activation des ennemis** en fin de manche **et** aux cartes Agenda gagnées en récompense de quête.",
          "Paquet vide : mélangez la défausse et avancez **uniquement la faction ennemie** d'une case.",
        ] }])}
      </section>

      <section class="card">${heading("Règles optionnelles", "setup", { cls: "card-title" })}
        <p class="small muted">Cochez celles que vous utilisez : l'application les rappellera au bon moment (combat, exploration…).</p>
        ${COOP_RULES.map(([k, t, d]) => `<div class="field"><div class="lbl"><strong>${t}</strong><small>${fmt(d)}</small></div>${toggle(`coop:${k}`, r[k], t)}</div>`).join("")}
        <div class="field"><div class="lbl"><strong>Variante : réapparition</strong><small>Maison, hors document : un survivant tué réapparaît (règles de base) au lieu de faire perdre l'équipe. Plus indulgent.</small></div>${toggle("coop:respawn", r.respawn, "Réapparition")}</div>
      </section>

      ${callout("tip", "Regroupez-vous : avec l'**Assistance**, chaque allié dans votre case donne une relance. Et campez ensemble pour vous échanger l'équipement.", "Conseil d'équipe")}
      ${links(["mise-en-place", "sujet/victoire", "sujet/combat"])}`,
    mount(root) {
      root.addEventListener("click", (e) => {
        const b = e.target.closest("[data-stepper='coopTarget'] [data-step]");
        if (!b) return;
        update((s) => { s.coop.targetDelta += +b.dataset.step; });
      });
    },
  };
}

/* ====================================================================== À propos */

export function about() {
  return {
    title: "À propos",
    icon: "info",
    back: "",
    html: `
      <section class="card">${heading("Cette application", "info", { cls: "card-title" })}
        <p>Aide de jeu <strong>non officielle</strong>, faite par des fans, pour jouer à <em>Fallout : le jeu de plateau</em> (Fantasy Flight Games) en français. Elle ne remplace pas le matériel du jeu.</p>
        <p class="small muted">Fonctionne hors connexion une fois chargée. Les réglages sont enregistrés sur cet appareil.</p></section>
      <section class="card">${heading("Installer sur votre téléphone", "install", { cls: "card-title" })}
        <ul class="bullets">
          <li><strong>Android (Chrome)</strong> : menu ⋮ → « Installer l'application » / « Ajouter à l'écran d'accueil ».</li>
          <li><strong>iPhone (Safari)</strong> : bouton Partager → « Sur l'écran d'accueil ».</li>
        </ul></section>
      <section class="card">${heading("Sources", "book", { cls: "card-title" })}
        <ul class="bullets">
          <li>Règles : <em>Fallout: The Board Game – Rules Reference</em> (Fantasy Flight Games). Icônes extraites de ce document.</li>
          <li>Coopération : <em>Fallout Board Game Coop Rules v4.0</em> (règles de fans, non officielles).</li>
          <li>Photos du matériel : article « How to play Fallout » de Zatu Games ; photo des dés : critique du jeu par Board Game Quest.</li>
        </ul>
        <p class="small muted">Fallout est une marque de Bethesda Softworks / ZeniMax. Toutes les marques appartiennent à leurs propriétaires.</p></section>
      <section class="card">${heading("Données", "data", { cls: "card-title" })}
        <button class="btn ghost block" data-action="reset-all">${ui("reset")} Effacer tous mes réglages</button></section>`,
  };
}

export function notFound() {
  return { title: "Introuvable", icon: "help", back: "", html: `<div class="empty"><p>Cette page n'existe pas.</p><a class="btn" href="#/">Accueil</a></div>` };
}
