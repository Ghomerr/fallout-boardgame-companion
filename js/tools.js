// Outils interactifs intégrés aux fiches : assistant de combat, de test, piste d'XP, piste de PV.

import { gi, ui, fmt, vatsSvg, stepper, toggle, renderBlocks, callout } from "./ui.js";
import { state, isCoop, influenceTarget, coopTarget, update } from "./store.js";

/* ====================================================================== Montage */

const TOOLS = { combat: combatTool, test: testTool, xp: xpTool, hp: hpTool };

/** Monte tous les outils présents dans `root` ([data-tool]). */
export function mountTools(root) {
  root.querySelectorAll("[data-tool]").forEach((el) => TOOLS[el.dataset.tool]?.(el));
}

/** Branche steppers / interrupteurs d'un outil sur un objet d'état local. */
function bindControls(el, data, rerender) {
  el.addEventListener("click", (e) => {
    const b = e.target.closest("[data-step]");
    if (!b) return;
    const s = b.closest("[data-stepper]");
    const k = s.dataset.stepper;
    data[k] = Math.min(+s.dataset.max, Math.max(+s.dataset.min, data[k] + +b.dataset.step));
    rerender();
  });
  el.addEventListener("change", (e) => {
    const t = e.target.closest("[data-toggle]");
    if (!t) return;
    data[t.dataset.toggle] = t.checked;
    rerender();
  });
}

const field = (label, control, hint) =>
  `<div class="field"><div class="lbl">${fmt(label)}${hint ? `<small>${fmt(hint)}</small>` : ""}</div>${control}</div>`;

const line = (a, b) => `<div class="line"><span>${fmt(a)}</span><span>${fmt(String(b))}</span></div>`;

/* ====================================================================== Combat */

function combatTool(el) {
  const d = {
    level: 2, armored: false, radiation: false, eRanged: false, loot: false, retreat: false,
    armor: 0, yRanged: false, adj: false, hp: 16,
    weaponLetters: 1, rested: false, allies: 0,
    dots: 1, matches: 1,
  };

  const render = () => {
    const coopRules = isCoop() ? state.coop.rules : {};
    const rangeAdv = !!coopRules.rangeAdv;
    const assist = !!coopRules.assist;
    const canAdj = d.yRanged || d.eRanged;
    const adj = d.adj && canAdj;

    // Bonus à distance (règle de base) ou avantage à distance (règle coop optionnelle)
    let bonusYou = 0, bonusEnemy = 0, enemyBlocked = false, youBlocked = false;
    if (adj) {
      if (!rangeAdv) {
        if (d.yRanged && !d.eRanged) bonusYou = 1;
        if (d.eRanged && !d.yRanged) bonusEnemy = 1;
      } else {
        if (d.yRanged && !d.eRanged) enemyBlocked = true;
        if (d.eRanged && !d.yRanged) youBlocked = true;
      }
    }

    const rerolls = d.weaponLetters + (d.rested ? 1 : 0) + (assist ? d.allies : 0);
    const hitsIn = enemyBlocked ? 0 : Math.max(0, d.dots + bonusEnemy - d.armor);
    const dmg = hitsIn * d.level;
    const rads = d.radiation && dmg > 0 ? d.level : 0;
    const left = d.hp - dmg - rads;
    const dead = left <= 0;
    const need = d.level + (d.armored ? 1 : 0);
    const hitsOut = youBlocked ? 0 : d.matches + bonusYou;
    const killed = !dead && hitsOut >= need;

    el.innerHTML = `
      <section class="card tool">
        <div class="tool-title">${ui("fight")}<h3>Assistant de combat</h3></div>
        <p class="muted small">Renseignez la situation, lancez vos vrais dés, puis entrez ce que vous voyez. L'assistant fait les comptes.</p>

        <div class="tool-section"><span class="eyebrow">1 · L'ennemi</span>
          ${field("Niveau de l'ennemi", stepper("level", d.level, 1, 6))}
          ${field(":armor: Blindé", toggle("armored", d.armored, "Blindé"), "1 touche de plus pour le tuer")}
          ${field(":radiation: Radiation", toggle("radiation", d.radiation, "Radiation"))}
          ${field(":ranged: Ennemi à distance", toggle("eRanged", d.eRanged, "Ennemi à distance"))}
          ${field(":loot: Butin", toggle("loot", d.loot, "Butin"))}
          ${field(":retreat: Repli", toggle("retreat", d.retreat, "Repli"))}
        </div>

        <div class="tool-section"><span class="eyebrow">2 · Vous</span>
          ${field("PV restants avant le combat", stepper("hp", d.hp, 1, 16), "PV − rads")}
          ${field(":armor: Armure de votre tenue", stepper("armor", d.armor, 0, 4))}
          ${field(":ranged: Votre arme est à distance", toggle("yRanged", d.yRanged, "Arme à distance"))}
          ${canAdj ? field("Combat entre deux cases voisines", toggle("adj", d.adj, "Cases voisines"), "Tir à distance d'une case à l'autre") : ""}
        </div>

        <div class="tool-section"><span class="eyebrow">3 · Relances</span>
          ${field("Lettres de votre arme que vous possédez", stepper("weaponLetters", d.weaponLetters, 0, 4), "1 relance par lettre")}
          ${field(":sun: Défausser « Bien reposé »", toggle("rested", d.rested, "Bien reposé"))}
          ${assist ? field(":users: Alliés dans votre case", stepper("allies", d.allies, 0, 3), "Règle coop « Assistance »") : ""}
          <div class="result"><div class="line"><span>Relances disponibles</span><span class="big">${rerolls}</span></div>
          <p class="muted small">${fmt("Chaque relance : relancez autant de dés que vous voulez. Gardez de préférence les dés qui touchent l'ennemi **sans** :hit:.")}</p></div>
        </div>

        <div class="tool-section"><span class="eyebrow">4 · Les dés après relances</span>
          ${field("Nombre de :hit: visibles", stepper("dots", d.dots, 0, 9), "Sur les 3 dés")}
          ${field("Dés avec une zone pleine en commun avec l'ennemi", stepper("matches", d.matches, 0, 3), "Max 1 touche par dé")}
        </div>

        <div class="result" aria-live="polite">
          ${line("Coups reçus", `${d.dots} :hit:${bonusEnemy ? " + 1 (tir)" : ""} − ${d.armor} armure = <b>${hitsIn}</b>`)}
          ${enemyBlocked ? line("Avantage à distance", "l'ennemi ne vous blesse pas") : ""}
          ${line("Dégâts subis", `${hitsIn} × niv. ${d.level} = <b>${dmg}</b>`)}
          ${rads ? line("Rads subies", `+${rads} :radiation:`) : ""}
          ${line("PV restants après", `<b>${Math.max(0, left)}</b>`)}
          <hr>
          ${dead
            ? `<div class="big ko">${ui("skull")} Vous êtes tué à l'étape 3</div><p class="small muted">Le combat s'arrête avant que vous frappiez : l'ennemi reste en place.</p>`
            : `${line("Vos touches", `${d.matches}${bonusYou ? " + 1 (tir)" : ""}${youBlocked ? " (bloquées)" : ""} = <b>${hitsOut}</b> / ${need} nécessaires`)}
               ${killed
                 ? `<div class="big ok">Ennemi tué !</div>
                    ${line("XP gagnée", `+${d.level}`)}
                    ${d.loot ? line("Butin", "piochez 1 carte :loot:") : ""}
                    ${isCoop() && state.coop.rules.capKill ? line("Prime coop", "+1 :caps:") : ""}
                    <p class="small muted">Défaussez son jeton. Un nouveau jeton du même type arrive face cachée sur la case d'icône la plus proche.</p>`
                 : `<div class="big ko">L'ennemi survit</div>
                    ${d.retreat ? `<p class="small">${fmt(":retreat: Il se replie : retournez son jeton **face cachée**.")}</p>` : `<p class="small muted">Il reste actif. Les touches ne se gardent pas pour le prochain combat.</p>`}`}`}
        </div>
      </section>`;
  };

  bindControls(el, d, render);
  render();
}

/* ====================================================================== Test */

function testTool(el) {
  const d = { diff: 2, letters: 1, rested: false, allies: 0, dots: 2 };
  const render = () => {
    const assist = isCoop() && state.coop.rules.assist;
    const rerolls = d.letters + (d.rested ? 1 : 0) + (assist ? d.allies : 0);
    const ok = d.dots >= d.diff;
    el.innerHTML = `
      <section class="card tool">
        <div class="tool-title">${ui("dice")}<h3>Assistant de test</h3></div>
        <div class="tool-section">
          ${field("Difficulté du test", stepper("diff", d.diff, 1, 6))}
          ${field("Lettres du test que vous possédez", stepper("letters", d.letters, 0, 3), "1 relance par lettre")}
          ${field(":sun: Défausser « Bien reposé »", toggle("rested", d.rested, "Bien reposé"))}
          ${assist ? field(":users: Alliés dans votre case", stepper("allies", d.allies, 0, 3), "Règle coop « Assistance »") : ""}
        </div>
        <div class="result"><div class="line"><span>Relances disponibles</span><span class="big">${rerolls}</span></div>
          <p class="small muted">${fmt("Relancez les dés **sans** :hit: pour en obtenir plus.")}</p></div>
        <div class="tool-section">${field(":hit: obtenus après relances", stepper("dots", d.dots, 0, 9))}</div>
        <div class="result" aria-live="polite"><div class="big ${ok ? "ok" : "ko"}">${ok ? "Réussite !" : "Échec"}</div>
          <p class="small muted">${fmt(`${d.dots} :hit: pour une difficulté de ${d.diff}. Appliquez le résultat « ${ok ? "succeed" : "fail"} » de la carte.`)}</p></div>
      </section>`;
  };
  bindControls(el, d, render);
  render();
}

/* ====================================================================== Piste d'XP */

const LETTERS = ["S", "P", "E", "C", "I", "A", "L"];

function xpTool(el) {
  const d = { owned: new Set(["S", "P"]), peg: 0, levels: 0, flash: false };

  const render = () => {
    const owned = LETTERS.filter((l) => d.owned.has(l));
    const k = owned.length;
    const toNext = k + 1 - d.peg;
    // Position du pion : 0 = trou de départ, i = sous le i-ème jeton possédé
    const pegLetter = d.peg === 0 ? null : owned[d.peg - 1];
    el.innerHTML = `
      <section class="card tool${d.flash ? " levelup" : ""}">
        <div class="tool-title">${ui("xp")}<h3>Simulateur de piste d'XP</h3></div>
        <p class="muted small">Touchez les lettres pour choisir les jetons que vous possédez, puis gagnez de l'XP.</p>
        <div class="xp-track" role="group" aria-label="Piste S.P.E.C.I.A.L.">
          <div class="xp-slot"><div class="xp-token start">départ</div><i class="xp-hole${d.peg === 0 ? " peg" : ""}"></i></div>
          ${LETTERS.map((l) => `
            <div class="xp-slot">
              <button class="xp-token${d.owned.has(l) ? " on" : ""}" data-letter="${l}" aria-pressed="${d.owned.has(l)}" aria-label="Jeton ${l}">${gi(l)}</button>
              <i class="xp-hole${d.owned.has(l) ? "" : " off"}${pegLetter === l ? " peg" : ""}"></i>
            </div>`).join("")}
        </div>
        <div class="result">
          ${line("Jetons possédés", k)}
          ${line("XP par niveau", `${k} + 1 = <b>${k + 1}</b>`)}
          ${line("XP avant le prochain niveau", `<b>${toNext}</b>`)}
          ${line("Niveaux gagnés (simulation)", d.levels)}
        </div>
        ${d.flash ? callout("tip", ["**Niveau supérieur !** Piochez 2 jetons S.P.E.C.I.A.L. et gardez-en un.", "Nouvelle lettre → posez-la (touchez-la ci-dessus pour l'ajouter). Lettre déjà possédée → prenez une **aptitude**."], "Level up") : ""}
        <div class="btn-row">
          <button class="btn" data-xp="1">${ui("plus")} 1 XP</button>
          <button class="btn ghost" data-xp="reset">${ui("reset")} Recommencer</button>
        </div>
      </section>`;
  };

  el.addEventListener("click", (e) => {
    const t = e.target.closest("[data-letter]");
    if (t) {
      const l = t.dataset.letter;
      if (d.owned.has(l)) { if (d.owned.size > 1) d.owned.delete(l); } else d.owned.add(l);
      d.peg = Math.min(d.peg, d.owned.size);
      d.flash = false;
      return render();
    }
    const x = e.target.closest("[data-xp]");
    if (!x) return;
    if (x.dataset.xp === "reset") Object.assign(d, { peg: 0, levels: 0, flash: false });
    else if (d.peg >= d.owned.size) Object.assign(d, { peg: 0, levels: d.levels + 1, flash: true });
    else Object.assign(d, { peg: d.peg + 1, flash: false });
    render();
  });
  render();
}

/* ====================================================================== PV / rads */

function hpTool(el) {
  const d = { hp: 16, rads: 0 };
  const render = () => {
    const left = d.hp - d.rads;
    const cells = Array.from({ length: 17 }, (_, i) => {
      const cls = [i > d.rads && i <= d.hp ? "alive" : "", i > 0 && i <= d.rads ? "rad" : "", i === d.hp ? "hp-peg" : "", i === d.rads ? "rad-peg" : ""].join(" ");
      return `<i class="${cls}">${i}</i>`;
    }).join("");
    el.innerHTML = `
      <section class="card tool">
        <div class="tool-title">${ui("heart")}<h3>Votre piste de PV</h3></div>
        <div class="hp-track" aria-hidden="true">${cells}</div>
        <label class="field"><span class="lbl">PV (pion rouge) : <b>${d.hp}</b></span></label>
        <input type="range" min="0" max="16" value="${d.hp}" data-range="hp" aria-label="PV">
        <label class="field"><span class="lbl">Rads (pion vert) : <b>${d.rads}</b></span></label>
        <input type="range" min="0" max="16" value="${d.rads}" data-range="rads" aria-label="Rads">
        <div class="result" aria-live="polite">
          ${left > 0 ? `<div class="big ok">${left} PV restants</div>` : `<div class="big ko">${ui("skull")} Mort (PV ≤ rads)</div>`}
          <p class="small muted">${d.hp} PV − ${d.rads} rads</p>
        </div>
      </section>`;
  };
  el.addEventListener("input", (e) => {
    const r = e.target.closest("[data-range]");
    if (!r) return;
    d[r.dataset.range] = +r.value;
    const pos = r.dataset.range;
    render();
    el.querySelector(`[data-range="${pos}"]`).focus();
  });
  render();
}

/* ====================================================================== Blocs HTML */

/** Exemple illustré de résolution V.A.T.S. */
export function combatExample() {
  const enemy = { body: true, legs: true };
  const dice = [
    { z: { head: true }, hits: 1 },
    { z: { legs: true }, hits: 0 },
    { z: { arms: true, body: true }, hits: 1 },
  ];
  const match = (z) => Object.keys(z).some((k) => z[k] && enemy[k]);
  const dots = (n) => `<span class="hits">${Array.from({ length: n }, () => gi("hit")).join("")}</span>`;
  return `
    <section class="card">
      <h3>Exemple illustré</h3>
      <p class="muted small">Faces simplifiées pour l'explication (zones pleines = zones touchées) : comparez-les avec vos vrais dés.</p>
      <div class="vats-row">
        <div class="vats-card enemy">${vatsSvg(enemy, { label: "Ennemi vulnérable au corps et aux jambes" })}<span class="cap">Ennemi niv. 2<br>corps + jambes</span></div>
        ${dice.map((x, i) => `<div class="vats-card${match(x.z) ? " match" : ""}">${vatsSvg(x.z, { label: `Dé ${i + 1}` })}${dots(x.hits)}<span class="cap">Dé ${i + 1}${match(x.z) ? "<br>✔ touche" : "<br>raté"}</span></div>`).join("")}
      </div>
      <ul class="bullets">
        <li>${fmt("**Vos touches** : le dé 2 (jambes) et le dé 3 (corps) correspondent → **2 touches** ≥ niveau 2 : l'ennemi est **tué**.")}</li>
        <li>${fmt("**Ses coups** : 2 :hit: sur les dés, − 1 d'armure = 1 :hit: × niveau 2 = **2 dégâts** pour vous.")}</li>
        <li>${fmt("**Récompense** : +2 XP.")}</li>
      </ul>
    </section>`;
}

/** Bloc « Victoire », selon le mode. */
export function victoryBlock(ctx, { summary = true, coopRules = isCoop() } = {}) {
  const n = state.players;
  const comp = [
    { t: "summary", text: `Soyez le premier à réunir **${influenceTarget(n)} influence** :influence: (${n} joueur${n > 1 ? "s" : ""}).` },
    { t: "table", head: ["Joueurs", "Influence pour gagner"], num: true, hl: n - 1, rows: [["1 joueur", 11], ["2 joueurs", 10], ["3 joueurs", 9], ["4 joueurs", 8]] },
    { t: "h", text: "L'influence" },
    { t: "bullets", items: [
      "Chaque **carte Agenda** vaut **1 influence** + des conditions pour en gagner davantage (ex. selon l'avance d'une faction).",
      "Maximum **4 cartes Agenda** en main ; le nombre de cartes est public, leur contenu secret.",
      "Dès que vous atteignez le total requis : **déclarez la victoire** et révélez vos cartes.",
      "Plusieurs survivants l'atteignent en même temps ? **Victoire partagée**, même si l'un a plus d'influence.",
    ] },
    { t: "warn", label: "Fin brutale", text: "Si une faction atteint le bout de sa piste de puissance, la partie s'arrête : sans survivant au total requis, **tout le monde perd**." },
  ];
  const coop = [
    { t: "summary", text: `Ensemble : réunissez **${coopTarget(n)} cartes Agenda** :influence:, **puis** menez votre faction alliée au bout de sa piste.` },
    { t: "card", title: "Victoire si…", blocks: [{ t: "bullets", items: [
      `L'équipe a au moins **${coopTarget(n)} cartes Agenda** (cumulées, 1 carte = 1 point, pas de limite de main) ;`,
      "**et** la faction alliée atteint la fin de la piste de puissance.",
    ] }] },
    { t: "card", title: "Défaite si…", blocks: [{ t: "bullets", items: [
      { text: "Un survivant est tué ;", ruleOff: "respawn" },
      "la faction **ennemie** atteint la fin de la piste ;",
      "la faction **alliée** arrive au bout **avant** que vous ayez assez de cartes Agenda.",
    ] }] },
    { t: "warn", label: "Timing", text: "Tout l'enjeu : réunir les cartes Agenda **avant** de pousser votre faction jusqu'au bout. Dosez vos quêtes !" },
  ];
  if (summary) coop.push({ t: "p", text: "Le texte d'influence bonus des cartes Agenda est **ignoré** en coop. [Toutes les règles coop](#/coop)" });
  const blocks = coopRules ? coop : comp;
  return renderBlocks(summary ? blocks : blocks.filter((b) => b.t !== "summary"), ctx);
}

/** Choix de la faction alliée (coop). */
export function factionPicker() {
  const f = state.coop.friendly;
  return `<div class="seg" role="group" aria-label="Faction alliée">
    <button data-action="friendly" data-value="star" aria-pressed="${f === "star"}">${gi("star", "c-star")} Étoile</button>
    <button data-action="friendly" data-value="shield" aria-pressed="${f === "shield"}">${gi("shield", "c-shield")} Bouclier</button>
  </div>`;
}

export function setFriendly(v) {
  update((s) => { s.coop.friendly = v; });
}
