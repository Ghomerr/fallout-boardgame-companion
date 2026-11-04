// Les 6 actions de base. Source : Rules Reference (Actions, Move/Explore/Fight/Encounter/Quest/Camp Action).
// Syntaxe du texte : voir fmt() dans ui.js.

export const ACTIONS = [
  {
    id: "deplacer",
    title: "Se déplacer",
    en: "Move",
    icon: "move",
    short: "2 points de mouvement",
    summary: "Vous gagnez **2 points de mouvement**. Chaque point vous fait avancer d'**une case adjacente**.",
    when: [["ok", "Toujours possible."]],
    blocks: [
      { t: "steps", items: [
        ["Choisissez une case voisine", "Deux cases sont adjacentes si elles partagent une bordure (les lignes blanches séparent les cases)."],
        ["Dépensez 1 point", "Votre figurine entre dans la case. Recommencez avec le 2e point."],
        ["Surveillez le terrain", "Bordure **rouge** = terrain difficile : 1 point de plus pour y entrer. Bordure **verte** = irradié : vous subissez 1 rad :radiation: en y entrant."],
      ] },
      { t: "tip", text: "Vous pouvez **couper votre déplacement en deux** : 1 case, puis votre autre action (fouiller, combattre…), puis la 2e case. C'est la seule action qui peut être interrompue." },
      { t: "info", text: "Pour entrer en terrain difficile, les 2 points peuvent venir de **deux actions Se déplacer** différentes (ex. : 4 points sur le tour = 1 case normale + 1 case difficile + …)." },
      { t: "warn", text: "Entrer dans la case d'un ennemi **Agressif** :aggressive: déclenche **immédiatement un combat** (sans coûter d'action)." },
      { t: "p", text: "Une tuile face cachée doit d'abord être révélée avec l'action [Explorer](#/action/explorer) avant d'y entrer." },
    ],
    links: ["action/explorer", "sujet/carte", "sujet/ennemis"],
  },
  {
    id: "explorer",
    title: "Explorer",
    en: "Explore",
    icon: "explore",
    short: "Révéler une tuile voisine",
    summary: "Depuis une case **à côté d'une tuile face cachée**, retournez cette tuile pour découvrir une nouvelle zone.",
    when: [["ok", "Vous êtes dans une case adjacente à une tuile face cachée."]],
    blocks: [
      { t: "steps", items: [
        ["Retournez la tuile", "Orientez-la pour que sa **flèche** pointe dans la même direction que celle de la tuile de départ."],
        ["Placez les ennemis", "Pour **chaque icône d'ennemi** imprimée sur la tuile, piochez un jeton au hasard de ce type et posez-le **face visible** (actif) sur cette case."],
        ["Replacez les ennemis déjà présents", "Si des ennemis se trouvaient sur la tuile quand elle était face cachée, **vous** choisissez sur quelles cases de la tuile les poser."],
      ] },
      { t: "coop", rule: "freeTiles", label: "Règle optionnelle active", text: "**Placement libre** : vous pouvez orienter la tuile révélée dans le sens de votre choix." },
      { t: "icons", items: [
        { i: "dangerous", t: "Tuile dangereuse", en: "Dangerous", d: "Danger modéré." },
        { i: "deadly", t: "Tuile mortelle", en: "Deadly", d: "Ennemis plus coriaces : soyez bien équipé avant d'y aller." },
      ] },
      { t: "tip", text: "Explorer ne vous déplace pas : il faut ensuite une action Se déplacer pour entrer sur la nouvelle tuile. Certaines quêtes se valident juste en explorant (ex. « explorer une tuile :deadly: »)." },
    ],
    links: ["action/deplacer", "sujet/carte"],
  },
  {
    id: "combattre",
    title: "Combattre",
    en: "Fight",
    icon: "fight",
    short: "Attaquer un ennemi",
    summary: "Attaquez un **ennemi actif** (face visible) dans **votre case** — ou dans une case **voisine** si votre arme est **à distance** :ranged:.",
    when: [
      ["ok", "Un ennemi actif est dans votre case."],
      ["ok", "Ou : il est dans une case adjacente et votre arme a l'icône :ranged:."],
      ["no", "Impossible contre un ennemi inactif (jeton face cachée)."],
    ],
    blocks: [
      { t: "p", text: "Le combat se joue avec les **3 dés V.A.T.S.** en 5 étapes : lancer, relancer, encaisser, frapper, gagner de l'XP." },
      { t: "html", html: (ctx) => ctx.linkCard("sujet/combat", "Comment se déroule un combat", "Les 5 étapes + l'assistant de combat", "fight") },
      { t: "info", mode: "comp", text: "**Arme à distance** :ranged: : si vous attaquez depuis une case adjacente un ennemi **sans** :ranged:, vous infligez **1 touche bonus**." },
      { t: "coop", rule: "rangeAdv", label: "Règle optionnelle active", text: "**Avantage à distance** : pas de touche bonus. À la place, si vous tirez depuis une case adjacente sur un ennemi sans :ranged:, **il ne peut pas vous blesser** pendant ce combat." },
      { t: "info", mode: "coop", text: "**Arme à distance** :ranged: : si vous attaquez depuis une case adjacente un ennemi **sans** :ranged:, vous infligez **1 touche bonus** (sauf si la règle optionnelle « Avantage à distance » est activée)." },
      { t: "p", text: "Plusieurs ennemis dans la case ? **Vous choisissez** lequel combattre." },
      { t: "warn", mode: "comp", text: "Si vous avez déclaré votre **loyauté** à une faction, vous ne pouvez pas combattre ses ennemis." },
    ],
    links: ["sujet/combat", "sujet/ennemis", "sujet/niveau"],
  },
  {
    id: "rencontre",
    title: "Rencontre",
    en: "Encounter",
    icon: "encounter",
    short: "Lire une carte d'histoire",
    restricted: true,
    summary: "Sur une case avec une **icône de rencontre**, piochez la carte correspondante : une petite histoire avec des **choix**.",
    when: [
      ["ok", "Votre case porte une icône :wasteland: :settlement: :vault84: ou :vault109:."],
      ["no", "Pas d'ennemi actif dans votre case."],
      ["no", "Une seule rencontre par tour."],
    ],
    blocks: [
      { t: "steps", items: [
        ["Le joueur à votre droite pioche", "Il lit l'introduction et le **texte en gras** de chaque option numérotée — sans lire la suite !"],
        ["Vous choisissez une option", "Certaines options exigent une condition (ex. : être *Vilipendé*, être *Super mutant*)."],
        ["Vous résolvez", "Souvent un [test](#/sujet/test) ou un [combat](#/sujet/combat) : appliquez le résultat « succeed » (réussite) ou « fail » (échec)."],
        ["Rangez la carte", "« Trash » : elle retourne dans la boîte. Sinon, glissez-la **sous** son paquet."],
      ] },
      { t: "icons", items: [
        { i: "wasteland", t: "Désolation", en: "Wasteland", d: "Ruines et zones abandonnées : on y fouille pour trouver du butin." },
        { i: "settlement", t: "Colonie", en: "Settlement", d: "Lieux habités : on y fait souvent ses achats à la [boutique](#/sujet/boutique)." },
        { i: "vault84", t: "Abris 84 et 109", en: "Vaults", d: "Paquets ajoutés en cours de partie. Chaque paquet ne se joue qu'à l'abri du même numéro." },
      ] },
      { t: "info", text: "Le **chiffre** à côté de l'icône sur la carte = son niveau. Sur la carte de rencontre, remplacez chaque icône de ce type par ce chiffre (ex. « gagnez :settlement: Capsules » à une colonie de niveau 3 = 3 Capsules)." },
      { t: "warn", text: "Option marquée **FORCED** : si sa condition est remplie, vous **devez** la choisir. Sinon, vous ne pouvez pas la prendre." },
      { t: "p", mode: "comp", text: "En **solo**, lisez vous-même uniquement le texte normalement lu à voix haute, choisissez, puis lisez le résultat." },
    ],
    links: ["sujet/test", "sujet/resultats", "sujet/boutique"],
  },
  {
    id: "quete",
    title: "Quête",
    en: "Quest",
    icon: "quest",
    short: "Remplir un objectif :quest:",
    restricted: true,
    summary: "Tentez un **objectif de quête marqué :quest:** dont vous remplissez la condition (le plus souvent : être sur une case précise).",
    when: [
      ["ok", "Vous remplissez la condition écrite après :quest: (souvent : être dans telle case)."],
      ["no", "Pas d'ennemi actif dans votre case."],
    ],
    blocks: [
      { t: "steps", items: [
        ["Vérifiez la condition", "Tout ce qui est dans la **partie blanche** de l'objectif doit être rempli."],
        ["Faites l'action Quête", "Résolvez les instructions **de gauche à droite** (souvent un test ou un combat)."],
        ["Réussite → récompenses", "Appliquez les [résultats](#/sujet/resultats) de la barre sous l'objectif, de gauche à droite."],
      ] },
      { t: "info", label: "Deux sortes d'objectifs", text: [
        "**Objectif à action** :quest: : il faut dépenser une action Quête.",
        "**Objectif déclenché** (« tuer un ennemi :human: », « explorer une tuile :deadly: ») : il se valide **tout seul** dès que vous accomplissez la tâche, sans action.",
      ] },
      { t: "p", text: "Les quêtes rapportent souvent des **cartes Agenda** :influence: ou font progresser une **faction** :star: :shield: — choisissez qui vous aidez !" },
      { t: "coop", rule: "roleplay", label: "Règle optionnelle active", text: "**Jeu de rôle de faction** : résolvez les quêtes de la façon qui aide votre faction alliée. Tuer un ennemi qui valide un objectif de l'autre faction ne compte que si vous l'annoncez explicitement." },
    ],
    links: ["sujet/resultats", "sujet/factions", "sujet/test"],
  },
  {
    id: "camper",
    title: "Camper",
    en: "Camp",
    icon: "camp",
    short: "Soins, repos, échanges",
    restricted: true,
    summary: "Reprenez votre souffle : **+3 PV**, redressez vos cartes épuisées, devenez **Bien reposé** et échangez avec vos voisins.",
    when: [["no", "Pas d'ennemi actif dans votre case."]],
    blocks: [
      { t: "p", text: "Faites tout ceci, **dans l'ordre de votre choix** :" },
      { t: "icons", items: [
        { i: "heart", t: "Récupérer 3 PV", d: "Avancez votre pion rouge de 3 crans (sans dépasser le maximum)." },
        { i: "round", t: "Redresser vos cartes", d: "Toutes vos cartes épuisées (tournées) se redressent — c'est **obligatoire**. Un compagnon dont la condition (bas de carte) n'est plus remplie est alors défaussé." },
        { i: "sun", t: "Devenir Bien reposé", d: "Ce trait vous donnera **1 relance** plus tard (à défausser pendant un test ou un combat)." },
        { i: "users", t: "Échanger", d: "Avec les survivants de **votre case ou d'une case voisine** : objets, compagnons, cartes Agenda, Capsules. Les deux doivent être d'accord." },
      ] },
      { t: "warn", text: "Impossible d'échanger : traits, jetons S.P.E.C.I.A.L., aptitudes, et la carte de départ de la Goule. Les promesses s'échangent… mais n'engagent personne !" },
      { t: "coop", mode: "coop", text: "En coopération, le campement est le **moment clé pour s'organiser** : regroupez-vous pour vous passer armes, tenues et Capsules." },
    ],
    links: ["sujet/equipement", "sujet/traits", "sujet/sante"],
  },
];

export const ACTION_BY_ID = Object.fromEntries(ACTIONS.map((a) => [a.id, a]));
