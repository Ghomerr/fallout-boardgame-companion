// Étapes de mise en place. Source : Rules Reference « Complete Setup » + règles coop (Agenda Deck Setup).
// text / details peuvent être des fonctions (state) => contenu, pour s'adapter au nombre de joueurs.

const FACTION = { star: ":star: Étoile", shield: ":shield: Bouclier" };
const other = (f) => (f === "star" ? "shield" : "star");

export const SETUP_STEPS = [
  {
    id: "faction",
    mode: "coop",
    icon: "users",
    title: "Choisir la faction alliée",
    text: (s) => `Mettez-vous d'accord : vous soutenez **${FACTION[s.coop.friendly]}**. L'autre faction est l'ennemie.`,
    details: (s) => [
      { t: "p", text: "Les deux factions du scénario sont représentées par :star: et :shield:. Votre choix change la composition du paquet Agenda et vos conditions de victoire." },
      { t: "html", html: (ctx) => ctx.factionPicker() },
      { t: "p", text: `Objectif de l'équipe : **${s.coopTarget} cartes Agenda** avant que votre faction n'atteigne le bout de sa piste.` },
    ],
  },
  {
    id: "scenario",
    icon: "map",
    title: "Choisir le scénario",
    text: "Choisissez ensemble un scénario et posez sa **feuille** sur la table.",
    details: [
      { t: "p", text: "Côté **A** : la mise en place et le plan de la carte. Côté **B** : les factions, ce que représentent leurs jetons et la piste de puissance." },
    ],
  },
  {
    id: "carte",
    icon: "explore",
    title: "Construire la carte",
    text: "Mélangez séparément les tuiles :dangerous: et :deadly:, puis reproduisez le plan au dos de la feuille de scénario.",
    details: [
      { t: "bullets", items: [
        "Les tuiles montrées face visible sur le plan sont posées face visible.",
        "Aux emplacements face cachée, posez une tuile **au hasard** du bon type (:dangerous: ou :deadly:), **face cachée**.",
        "Orientez toutes les tuiles : leurs **flèches** dans le même sens que celle de la tuile de départ.",
      ] },
      { t: "img", src: "img/photo-tuiles.jpg", alt: "Tuiles de carte", caption: "La tuile de départ « Crossroads Camp » et deux autres tuiles.", credit: "Photo : Zatu Games" },
    ],
  },
  {
    id: "reserve",
    icon: "bag",
    title: "Préparer la réserve",
    text: "Faites des piles de jetons : **S.P.E.C.I.A.L.**, **Capsules**, **traits** et **ennemis**.",
    details: [
      { t: "bullets", items: [
        "Jetons S.P.E.C.I.A.L. : **face cachée**, mélangés.",
        "Jetons ennemis : face cachée, mélangés, **une pile par type** (:critter: :human: :robot: :monster: :mutant:).",
      ] },
      { t: "img", src: "img/photo-ennemis.jpg", alt: "Piles de jetons ennemis triées par type", caption: "Une pile par type d'ennemi, face cachée.", credit: "Photo : Zatu Games" },
    ],
  },
  {
    id: "rencontres",
    icon: "encounter",
    title: "Paquets de rencontres",
    text: "Prenez les cartes de rencontre avec une **étoile ★ en haut à gauche** (au lieu d'un numéro). Triez-les par dos (:wasteland: Désolation / :settlement: Colonie) et mélangez chaque paquet.",
    details: [
      { t: "warn", text: "Les cartes avec un **numéro** en haut à gauche forment la **bibliothèque** : rangez-les à part, triées par numéro, sans les lire." },
      { t: "img", src: "img/photo-cartes.jpg", alt: "Paquets de cartes", caption: "Paquets de rencontres (en haut) et autres paquets (en bas).", credit: "Photo : Zatu Games" },
    ],
  },
  {
    id: "agenda",
    mode: "comp",
    icon: "influence",
    title: "Paquet Agenda",
    text: (s) => `Retirez les cartes Agenda dont le **chiffre en bas à gauche** est **supérieur à ${s.players}** (nombre de joueurs). Mélangez.`,
    details: (s) => [
      { t: "p", text: `À ${s.players} joueur${s.players > 1 ? "s" : ""}, gardez les cartes marquées ${["1+", "2+", "3+", "4"].slice(0, s.players).map((x) => `**${x}**`).join(", ")}.` },
      { t: "p", text: "Ces cartes servent deux fois : objectifs secrets (influence) **et** activation des ennemis en fin de manche (icônes en bas)." },
    ],
  },
  {
    id: "agenda-coop",
    mode: "coop",
    icon: "influence",
    title: "Paquet Agenda (10 cartes)",
    text: (s) => `Formez un paquet de **10 cartes** : les **6 sans icône de faction** + les **4 de la faction ennemie** (${FACTION[other(s.coop.friendly)]}).`,
    details: (s) => [
      { t: "img", src: "img/coop-agenda.jpg", alt: "Trois piles de cartes Agenda : Étoile, sans faction, Bouclier", caption: "Triez les cartes en 3 piles selon les icônes du bas : :star: (gauche), **sans faction** (milieu, 6 cartes), :shield: (droite)." },
      { t: "steps", items: [
        ["Séparez en 3 piles", "Celles avec :star: en bas, celles avec :shield:, et les 6 sans icône de faction."],
        ["Gardez 6 + 4", `Les 6 du milieu + les 4 de la faction **ennemie** (${FACTION[other(s.coop.friendly)]}).`],
        ["Écartez le reste", `Les 4 cartes de votre faction alliée (${FACTION[s.coop.friendly]}) et toute autre carte Agenda ne servent pas.`],
        ["Mélangez", "Ce paquet sert à l'activation des ennemis **et** aux cartes Agenda gagnées en récompense."],
      ] },
    ],
  },
  {
    id: "decks",
    icon: "card",
    title: "Autres paquets",
    text: "Mélangez les paquets **Butin** :loot: et **Atouts** :caps:, face cachée. Gardez à portée : bibliothèque, aptitudes, Atouts uniques et les 3 dés V.A.T.S.",
    details: [
      { t: "tip", text: "Rangez les Atouts uniques par ordre alphabétique : vous les chercherez par leur nom." },
    ],
  },
  {
    id: "boutique",
    icon: "shop",
    title: "Créer la boutique",
    text: "Posez **4 cartes Atout** face visible en ligne près de la carte.",
  },
  {
    id: "survivants",
    icon: "user",
    title: "Choisir les survivants",
    text: "Tirez au sort le **premier joueur** : il prend le paquet Agenda à sa droite. Chacun (sens horaire) choisit un survivant.",
    details: [
      { t: "bullets", items: [
        "Prenez la **figurine**, la **carte de personnage** et le **jeton S.P.E.C.I.A.L.** marqué de sa silhouette au dos.",
        "Placez la figurine sur une case libre de la tuile **Crossroads Camp**.",
      ] },
    ],
  },
  {
    id: "plateaux",
    icon: "heart",
    title: "Préparer les plateaux",
    text: "Pions : **vert sur 0**, **rouge sur 16**, **gris** à gauche de la piste d'XP. Jeton S.P.E.C.I.A.L. de départ + **1 au hasard**. **1 carte Agenda** secrète. **3 Capsules**.",
    details: (s) => [
      { t: "bullets", items: [
        "Pion vert = rads (0), pion rouge = PV (16), pion gris = XP.",
        "Placez votre jeton S.P.E.C.I.A.L. de départ dans son emplacement, puis piochez-en un au hasard (si c'est le même, repiochez).",
        { text: "Piochez une carte Agenda et **gardez-la secrète**.", mode: "comp" },
        { text: "Piochez une carte Agenda : en coop, elle compte dans le total de l'équipe.", mode: "coop" },
        "Prenez 3 Capsules.",
      ] },
    ],
  },
  {
    id: "depart",
    icon: "flag",
    title: "Effets de départ",
    text: "Appliquez les effets de début de partie de la feuille de scénario. Posez les ennemis indiqués, puis les pions :star: et :shield: en haut de la piste de puissance.",
    details: [
      { t: "bullets", items: [
        "Chaque icône d'ennemi **visible sur la carte** reçoit un jeton au hasard de ce type, **face visible**.",
        "Mettez en jeu la ou les quêtes de départ indiquées par le scénario.",
        "Les deux pions de faction démarrent sur la **case du haut** de la piste.",
      ] },
    ],
  },
];
