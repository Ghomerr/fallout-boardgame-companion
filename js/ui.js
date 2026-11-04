// Utilitaires de rendu : icônes, mise en forme du texte, blocs de contenu, feuille modale, toast.

import { GAME_ICONS } from "./game-icons.js";
import { UI_ICONS } from "./icons-ui.js";
import { state, isCoop, isOpen } from "./store.js";

/* ---------------------------------------------------------------- Icônes */

/** Icône issue de la police officielle du jeu (remplissage). */
export function gi(name, cls = "") {
  const g = GAME_ICONS[name];
  if (!g) return "";
  return `<svg class="gi ${cls}" viewBox="${g[0]}" aria-hidden="true"><path transform="scale(1,-1)" d="${g[1]}"/></svg>`;
}

/** Icône d'interface (trait). */
export function ui(name, cls = "") {
  const p = UI_ICONS[name];
  if (!p) return "";
  return `<svg class="ui ${cls}" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
}

/** Icône du jeu si elle existe, sinon icône d'interface. */
export const icon = (name, cls = "") => (GAME_ICONS[name] ? gi(name, cls) : ui(name, cls));

const ICON_CLASS = { hit: "c-hit", star: "c-star", shield: "c-shield", radiation: "c-amber" };

/* ---------------------------------------------------------------- Titres illustrés */

// Pictogramme déduit du libellé d'un titre, quand aucun n'est indiqué explicitement.
const TITLE_ICONS = [
  [/voir aussi/, "link"], [/retenir|astuce/, "pin"], [/exemple/, "eye"],
  [/xp|niveau/, "xp"], [/victoire si|gagner|victoire/, "trophy"], [/défaite|mour|mort|tué/, "skull"],
  [/étape|déroul|ordre/, "list"], [/dégât|pv|soin/, "heart"],
  [/type/, "layers"], [/capacit/, "aggressive"], [/actif/, "eye"], [/ennemi/, "human"],
  [/aptitude|perk/, "sparkle"], [/s\.p\.e\.c\.i\.a\.l/, "S"], [/inventaire/, "bag"],
  [/épuis/, "round"], [/paquet|carte|résultat/, "card"], [/capsule/, "caps"], [/influence/, "influence"],
  [/loyaut/, "shield"], [/faction/, "star"], [/fin de partie|fin brutale/, "flag"],
  [/début/, "flag"], [/pendant/, "clock"], [/action/, "play"], [/objectif/, "flag"],
  [/règle|variante/, "book"], [/coop|équipe/, "users"], [/install/, "install"], [/source/, "book"], [/donnée/, "data"],
];
export function guessIcon(text = "") {
  const t = text.toLowerCase();
  return (TITLE_ICONS.find(([re]) => re.test(t)) || [, "sparkle"])[1];
}

/** Pastille d'icône placée devant un titre. */
export const hIcon = (name) => `<span class="h-ico" aria-hidden="true">${icon(name, ICON_CLASS[name] || "")}</span>`;

/** Titre précédé d'un pictogramme (explicite ou déduit du texte). */
export function heading(text, iconName, { tag = "h3", cls = "section-title" } = {}) {
  return `<${tag} class="${cls}">${hIcon(iconName || guessIcon(text.replace(/:\w+:|\*\*/g, "")))}<span>${fmt(text)}</span></${tag}>`;
}

/* ---------------------------------------------------------------- Texte */

export function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

/**
 * Mise en forme légère du contenu rédigé :
 *   :hit:              -> icône du jeu (ou d'interface)
 *   **gras**           -> <strong>
 *   [texte](g:id)      -> lien vers le glossaire (ouvre une feuille)
 *   [texte](#/route)   -> lien interne
 */
export function fmt(text = "") {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(g:([\w-]+)\)/g, '<a class="gloss-link" data-gloss="$2" href="#/glossaire/$2">$1</a>')
    .replace(/\[([^\]]+)\]\((#\/[^)]*)\)/g, '<a href="$2">$1</a>')
    .replace(/:([a-zA-Z][\w]*):/g, (m, n) => {
      if (GAME_ICONS[n]) return gi(n, ICON_CLASS[n] || "");
      if (UI_ICONS[n]) return ui(n);
      return m;
    });
}

/* ---------------------------------------------------------------- Blocs */

/** Un bloc est affiché selon le mode (comp/coop) et les règles coop optionnelles actives. */
export function visible(b) {
  if (b.mode === "coop" && !isCoop()) return false;
  if (b.mode === "comp" && isCoop()) return false;
  if (b.rule && !(isCoop() && state.coop.rules[b.rule])) return false;
  if (b.ruleOff && isCoop() && state.coop.rules[b.ruleOff]) return false;
  return true;
}

const CALLOUT = {
  tip: ["tip", "Astuce"],
  warn: ["warn", "Attention"],
  danger: ["skull", "Danger"],
  info: ["info", "Bon à savoir"],
  coop: ["users", "Mode coopératif"],
};

export function callout(kind, text, label) {
  const [ic, def] = CALLOUT[kind] || CALLOUT.info;
  return `<div class="callout ${kind}">${ui(ic)}<div class="body"><span class="label">${esc(label ?? def)}</span>${para(text)}</div></div>`;
}

function para(text) {
  return (Array.isArray(text) ? text : [text]).map((t) => `<p>${fmt(t)}</p>`).join("");
}

export function figure(src, alt, caption, credit) {
  return `<figure class="figure"><img src="${src}" alt="${esc(alt)}" loading="lazy" decoding="async">${
    caption || credit ? `<figcaption>${fmt(caption || "")}${credit ? ` <span class="credit">· ${esc(credit)}</span>` : ""}</figcaption>` : ""
  }</figure>`;
}

export function renderBlocks(blocks = [], ctx = {}) {
  return blocks.filter(visible).map((b) => renderBlock(b, ctx)).join("");
}

function renderBlock(b, ctx) {
  switch (b.t) {
    case "p": return `<div>${para(b.text)}</div>`;
    case "lead": return `<p class="lead">${fmt(b.text)}</p>`;
    case "summary": return `<div class="summary-box"><span class="eyebrow">${ui("bolt")} En bref</span><p class="lead">${fmt(b.text)}</p></div>`;
    case "h": return heading(b.text, b.i);
    case "steps":
      return `<ol class="steps">${b.items.map(([t, d]) => `<li><span class="st">${fmt(t)}</span>${d ? `<span class="sd">${fmt(d)}</span>` : ""}</li>`).join("")}</ol>`;
    case "bullets": return `<ul class="bullets">${b.items.filter((i) => typeof i === "string" || visible(i)).map((i) => `<li>${fmt(i.text ?? i)}</li>`).join("")}</ul>`;
    case "tip": case "warn": case "danger": case "info": case "coop":
      return callout(b.t, b.text, b.label);
    case "icons":
      return `<div class="icon-list">${b.items.map((i) => `
        <div class="icon-row"><span class="icon-badge">${icon(i.i, ICON_CLASS[i.i] || "")}</span>
          <div><div class="t">${esc(i.t)}${i.en ? `<span class="en">${esc(i.en)}</span>` : ""}</div><div class="d">${fmt(i.d)}</div></div>
        </div>`).join("")}</div>`;
    case "img": return figure(b.src, b.alt, b.caption, b.credit);
    case "more": {
      const key = `more:${b.title}`;
      return `<details class="more" data-open-key="${esc(key)}"${b.open || isOpen(key) ? " open" : ""}><summary>${hIcon(b.i || guessIcon(b.title))}<span>${esc(b.title)}</span>${ui("chev")}</summary><div class="inner">${renderBlocks(b.blocks, ctx)}</div></details>`;
    }
    case "card": return `<section class="card">${b.title ? heading(b.title, b.i, { cls: "card-title" }) : ""}${renderBlocks(b.blocks, ctx)}</section>`;
    case "table":
      return `<table class="table"><thead><tr>${b.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${b.rows
        .map((r, i) => `<tr${b.hl === i ? ' class="hl"' : ""}>${r.map((c, j) => `<td${j > 0 && b.num ? ' class="num"' : ""}>${fmt(String(c))}</td>`).join("")}</tr>`)
        .join("")}</tbody></table>`;
    case "html": return typeof b.html === "function" ? b.html(ctx) : b.html;
    case "tool": return `<div data-tool="${b.id}"></div>`;
    case "links": return ctx.links ? ctx.links(b.items, b.title) : "";
    default: return "";
  }
}

/* ---------------------------------------------------------------- V.A.T.S. */

/**
 * Silhouette V.A.T.S. à 4 zones (tête, corps, bras, jambes).
 * zones : { head, body, arms, legs } booléens -> zone remplie (verte).
 */
export function vatsSvg(z = {}, { tap = false, label = "" } = {}) {
  const c = (k) => `z${z[k] ? " on" : ""}`;
  const d = (k) => (tap ? ` data-zone="${k}" role="button" tabindex="0" aria-pressed="${!!z[k]}" aria-label="${ZONE_LABEL[k]}"` : "");
  // Silhouette détourée comme sur les vrais dés : zone pleine = zone touchée.
  return `<svg class="vats-svg${tap ? " tap" : ""}" viewBox="0 0 60 78" role="img" aria-label="${esc(label || "Silhouette V.A.T.S.")}">
    <circle class="${c("head")}"${d("head")} cx="30" cy="11" r="8.5"/>
    <rect class="${c("arms")}"${d("arms")} x="6" y="22" width="11" height="23" rx="5.5" transform="rotate(20 17 23)"/>
    <rect class="${c("arms")}"${d("arms")} x="43" y="22" width="11" height="23" rx="5.5" transform="rotate(-20 43 23)"/>
    <rect class="${c("legs")}"${d("legs")} x="19.5" y="47" width="10" height="28" rx="5" transform="rotate(6 25 47)"/>
    <rect class="${c("legs")}"${d("legs")} x="30.5" y="47" width="10" height="28" rx="5" transform="rotate(-6 35 47)"/>
    <rect class="${c("body")}"${d("body")} x="20" y="21" width="20" height="27" rx="6"/>
  </svg>`;
}
export const ZONE_LABEL = { head: "Tête", body: "Corps", arms: "Bras", legs: "Jambes" };

/* ---------------------------------------------------------------- Contrôles */

export function stepper(name, value, min, max) {
  return `<div class="stepper" data-stepper="${name}" data-min="${min}" data-max="${max}">
    <button type="button" data-step="-1" aria-label="Moins"${value <= min ? " disabled" : ""}>${ui("minus")}</button>
    <output aria-live="polite">${value}</output>
    <button type="button" data-step="1" aria-label="Plus"${value >= max ? " disabled" : ""}>${ui("plus")}</button>
  </div>`;
}

export function toggle(name, checked, label) {
  return `<label class="switch"><input type="checkbox" data-toggle="${name}"${checked ? " checked" : ""} aria-label="${esc(label)}"><span></span></label>`;
}

/* ---------------------------------------------------------------- Feuille modale */

const $ = (id) => document.getElementById(id);
let lastFocus = null;

export function openSheet(html) {
  lastFocus = document.activeElement;
  $("sheet-body").innerHTML = html;
  $("sheet").hidden = false;
  $("sheet-backdrop").hidden = false;
  $("sheet").scrollTop = 0;
  document.body.style.overflow = "hidden";
  ($("sheet").querySelector("[autofocus], .icon-btn, a, button") || $("sheet")).focus({ preventScroll: true });
}

export function closeSheet() {
  if ($("sheet").hidden) return;
  $("sheet").hidden = true;
  $("sheet-backdrop").hidden = true;
  document.body.style.overflow = "";
  lastFocus?.focus?.({ preventScroll: true });
}

export function sheetHead(title, iconName) {
  return `<div class="sheet-head">${iconName ? `<span class="icon-badge">${icon(iconName, ICON_CLASS[iconName] || "")}</span>` : ""}<h2 id="sheet-title">${esc(title)}</h2>
    <button class="icon-btn" data-close-sheet aria-label="Fermer">${ui("close")}</button></div>`;
}

/* ---------------------------------------------------------------- Toast */

let toastTimer;
export function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 2600);
}

/** Normalise pour la recherche : minuscules, sans accents ni ponctuation. */
export const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[.\-'’]/g, " ").replace(/\s+/g, " ").trim();
