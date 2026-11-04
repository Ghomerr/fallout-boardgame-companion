// Fiches thématiques. Source : Rules Reference (glossaire) + règles coop non officielles (FBGC v4).

const ZATU = "Photo : Zatu Games";
const BGQ = "Photo : Board Game Quest";

export const TOPICS = [
  /* ------------------------------------------------------------------ Combat */
  {
    id: "combat",
    title: "Combat",
    en: "Fight",
    icon: "fight",
    group: "jeu",
    short: "Dés V.A.T.S., touches, dégâts",
    blocks: [
      { t: "summary", text: "Lancez les **3 dés V.A.T.S.** Les :hit: vous blessent. Chaque dé dont une **zone pleine** correspond à une zone pleine de la silhouette de l'ennemi le touche. Assez de touches = ennemi tué." },
      { t: "img", src: "img/photo-des.jpg", alt: "Les trois dés V.A.T.S. noirs à côté d'un jeton ennemi Radroach", caption: "Les 3 dés V.A.T.S. : chaque face montre une silhouette dont certaines zones sont **pleines**, et parfois des symboles ✱ (les :hit:). À droite, un jeton ennemi : **niveau** (chiffre), **points faibles** (zones pleines de sa silhouette) et **capacité** (ici :radiation:).", credit: BGQ },
      { t: "h", text: "Les 5 étapes" },
      { t: "steps", items: [
        ["Lancer les dés", "Lancez les 3 dés V.A.T.S."],
        ["Relancer", "Votre arme montre des lettres S.P.E.C.I.A.L. : **1 relance par lettre que vous possédez**. Chaque relance permet de relancer **autant de dés que vous voulez**, une relance à la fois."],
        ["Encaisser les coups de l'ennemi", "Comptez les :hit: sur les dés, retirez-en autant que l'**armure** :armor: de votre tenue. Chaque :hit: restant = **dégâts égaux au niveau de l'ennemi**."],
        ["Frapper l'ennemi", "Chaque dé qui a **au moins une zone pleine (verte) en commun** avec la silhouette de l'ennemi = **1 touche** (max 1 par dé). Touches ≥ niveau de l'ennemi → **il est tué**."],
        ["Gagner de l'XP", "Ennemi tué → gagnez **autant d'XP que son niveau**. Tué ou non, le combat est terminé."],
      ] },
      { t: "html", html: (ctx) => ctx.combatExample() },
      { t: "tool", id: "combat" },
      { t: "h", text: "À retenir" },
      { t: "bullets", items: [
        "Les touches **ne se cumulent pas** d'un combat à l'autre : un ennemi survivant est « neuf » au prochain combat.",
        "Si vous mourez sans tuer l'ennemi, il **reste** actif sur sa case.",
        "Capacités « **avant un combat** » : à utiliser avant de lancer les dés. « **Pendant un combat** » : à n'importe quelle étape.",
        "**Bien reposé** : défaussez ce trait pendant un combat pour gagner **1 relance**.",
        { text: "**Piocher et combattre** (« draw and fight ») : prenez un ennemi du type indiqué dans la réserve, combattez-le, puis défaussez-le quoi qu'il arrive. Pour une quête ou une rencontre, vous ne réussissez que si vous le **tuez**." },
      ] },
      { t: "coop", rule: "assist", label: "Règle optionnelle active", text: "**Assistance** : +1 relance pour **chaque autre survivant dans votre case** pendant un combat ou un test." },
      { t: "coop", rule: "capKill", label: "Règle optionnelle active", text: "**Prime** : +1 Capsule :caps: pour chaque ennemi tué en combat." },
      { t: "coop", rule: "rangeAdv", label: "Règle optionnelle active", text: "**Avantage à distance** : plus de touche bonus pour :ranged:. À la place, une cible sans :ranged: située à 1 case **ne peut pas infliger de dégâts** à l'attaquant à distance (elle peut toujours relancer et utiliser ses cartes)." },
    ],
    links: ["action/combattre", "sujet/ennemis", "sujet/sante", "sujet/niveau"],
  },

  /* ------------------------------------------------------------------ Test */
  {
    id: "test",
    title: "Test",
    en: "Test",
    icon: "dice",
    group: "jeu",
    short: "Réussir une épreuve avec les dés",
    blocks: [
      { t: "summary", text: "Un test indique des **lettres S.P.E.C.I.A.L.** et une **difficulté**. Lancez les 3 dés : il faut au moins autant de :hit: que la difficulté." },
      { t: "p", text: "Exemple sur une carte : **:P: 2** → test de Perception, difficulté 2." },
      { t: "img", src: "img/photo-des.jpg", alt: "Les trois dés V.A.T.S.", caption: "En test, comptez seulement les symboles ✱ (:hit:) visibles sur les 3 dés.", credit: BGQ },
      { t: "steps", items: [
        ["Lancer les dés", "Lancez les 3 dés V.A.T.S."],
        ["Relancer", "**1 relance par lettre du test que vous possédez.** Chaque relance : relancez autant de dés que vous voulez."],
        ["Compter les :hit:", "Nombre de :hit: **≥ difficulté** → réussite. Sinon → échec. Appliquez le résultat indiqué (s'il n'y en a pas : rien ne se passe)."],
      ] },
      { t: "info", text: "Dans un test, les **silhouettes V.A.T.S.** des dés ne servent à rien : seuls les :hit: comptent. (En combat, c'est l'inverse pour vous : les :hit: sont les coups que **vous** prenez !)" },
      { t: "tool", id: "test" },
      { t: "coop", rule: "assist", label: "Règle optionnelle active", text: "**Assistance** : +1 relance par autre survivant présent dans votre case." },
      { t: "p", mode: "comp", text: "En **solo**, si une quête demande qu'un autre survivant fasse un test, considérez qu'il obtient **3** :hit:." },
    ],
    links: ["sujet/combat", "sujet/niveau", "action/rencontre"],
  },

  /* ------------------------------------------------------------------ Niveau */
  {
    id: "niveau",
    title: "XP & niveaux",
    en: "XP / Leveling Up",
    icon: "xp",
    group: "jeu",
    short: "Monter de niveau, S.P.E.C.I.A.L., aptitudes",
    blocks: [
      { t: "summary", text: "L'XP fait avancer un pion gris sous vos jetons **S.P.E.C.I.A.L.** Quand il dépasse le dernier, vous **montez de niveau** : nouveau jeton… ou une **aptitude**." },
      { t: "img", src: "img/photo-special.jpg", alt: "Les sept jetons S.P.E.C.I.A.L. recto et verso", caption: "Les 7 jetons S.P.E.C.I.A.L. (lettres) et leur dos.", credit: ZATU },
      { t: "h", text: "Gagner de l'XP" },
      { t: "bullets", items: [
        "Tuer un ennemi : **XP = son niveau**.",
        "Résultats de quêtes et de rencontres : « **# XP** ».",
      ] },
      { t: "h", text: "La piste d'XP" },
      { t: "steps", items: [
        ["Départ", "Le pion gris démarre dans le trou **à gauche** de la piste."],
        ["Chaque XP", "Le pion avance sous le **jeton S.P.E.C.I.A.L. suivant que vous possédez** (les emplacements vides sont sautés)."],
        ["Au bout", "Le pion est sous votre dernier jeton et vous gagnez 1 XP de plus : il **revient à gauche** et vous **montez de niveau** !"],
      ] },
      { t: "tool", id: "xp" },
      { t: "h", text: "Monter de niveau" },
      { t: "steps", items: [
        ["Piochez 2 jetons S.P.E.C.I.A.L.", "Gardez-en **un**, remettez l'autre dans la réserve."],
        ["Nouveau jeton ?", "Placez-le sur votre plateau : vous gagnez une **compétence** (plus de relances) mais la piste d'XP s'allonge."],
        ["Jeton déjà possédé ?", "Défaussez-le et prenez une **aptitude** (carte Perk) qui montre cette lettre en surbrillance."],
      ] },
      { t: "tip", text: "Il faut **(nombre de jetons + 1) XP** pour monter de niveau. Beaucoup de jetons = plus de relances, mais des niveaux plus lents." },
      { t: "more", title: "Les 7 lettres S.P.E.C.I.A.L.", blocks: [
        { t: "icons", items: [
          { i: "S", t: "Force", en: "Strength", d: "Armes de mêlée lourdes, tests physiques." },
          { i: "P", t: "Perception", en: "Perception", d: "Repérer, viser, fouiller." },
          { i: "E", t: "Endurance", en: "Endurance", d: "Résister, encaisser." },
          { i: "C", t: "Charisme", en: "Charisma", d: "Négocier, convaincre." },
          { i: "I", t: "Intelligence", en: "Intelligence", d: "Science, technologie, piratage." },
          { i: "A", t: "Agilité", en: "Agility", d: "Discrétion, réflexes, armes légères." },
          { i: "L", t: "Chance", en: "Luck", d: "Les coups de pouce du destin." },
        ] },
        { t: "p", text: "Ces descriptions sont indicatives : en jeu, seule compte la **lettre** affichée par l'arme ou le test (1 lettre possédée = 1 relance)." },
      ] },
      { t: "more", title: "Les aptitudes (Perks)", blocks: [
        { t: "bullets", items: [
          "Pouvoirs puissants à **usage unique** : défaussez la carte pendant **votre tour** pour appliquer son effet.",
          "Pas pendant une action autre que Se déplacer, sauf mention contraire.",
          "Aucune aptitude avec cette lettre ? Choisissez-en une montrant **une lettre que vous possédez**. Aucune ? Pas d'aptitude.",
          "Toutes les aptitudes (pioche et mains) sont **publiques**. Défaussée, une aptitude retourne dans la pioche.",
        ] },
      ] },
      { t: "info", text: "Plusieurs XP d'un coup ? Avancez le pion de tout, puis appliquez une montée de niveau **pour chaque** niveau gagné." },
    ],
    links: ["sujet/combat", "sujet/test", "sujet/equipement"],
  },

  /* ------------------------------------------------------------------ Santé */
  {
    id: "sante",
    title: "PV, rads & mort",
    en: "HP / Rads / Killed",
    icon: "heart",
    group: "jeu",
    short: "Points de vie, radiations, que faire si on meurt",
    blocks: [
      { t: "summary", text: "**PV restants = PV − rads.** Les radiations « mangent » votre barre de vie par l'autre bout. Quand les deux pions se croisent : vous êtes **mort**." },
      { t: "steps", items: [
        ["Pion rouge = PV", "Démarre tout à droite (**16**). Les dégâts le font reculer."],
        ["Pion vert = rads :radiation:", "Démarre à **0**. Les radiations le font avancer."],
        ["Mort", "Si PV ≤ rads, vous êtes tué."],
      ] },
      { t: "tool", id: "hp" },
      { t: "h", text: "D'où viennent les dégâts ?" },
      { t: "bullets", items: [
        "**Combat** : chaque :hit: non annulé = dégâts égaux au **niveau de l'ennemi**.",
        "**Terrain irradié** (bordure verte) : +1 rad en y entrant.",
        "**Ennemi :radiation:** : s'il vous inflige au moins 1 dégât, vous subissez aussi **autant de rads que son niveau**.",
      ] },
      { t: "p", text: "**Se soigner** : action [Camper](#/action/camper) (+3 PV), objets de soin (aid), certaines rencontres." },
      { t: "h", text: "Si vous mourez" },
      { t: "danger", mode: "coop", ruleOff: "respawn", label: "En coopération", text: "Un survivant tué = **toute l'équipe perd la partie** (règle « Une seule vie »)." },
      { t: "coop", rule: "respawn", label: "Variante maison active", text: "Vous avez choisi d'appliquer la **réapparition standard** ci-dessous au lieu de la défaite immédiate." },
      { t: "p", mode: "coop", ruleOff: "respawn", text: "Pour information, voici la réapparition des règles de base (mode compétitif) :" },
      { t: "steps", items: [
        ["Votre tour s'arrête", "Pendant un combat, celui-ci s'arrête aussi."],
        ["Réapparition", "Placez votre figurine sur **n'importe quelle case de la tuile de départ**."],
        ["Pertes", "Défaussez **tout votre inventaire** (vous gardez l'équipement équipé)."],
        ["Remise à niveau", "PV au **maximum**. Les rads, elles, **ne changent pas**."],
      ] },
      { t: "warn", text: "Si vous êtes encore mort avec tous vos PV (rads au maximum), vous êtes **éliminé** : vous perdez et toutes vos affaires sont défaussées." },
    ],
    links: ["sujet/combat", "action/camper", "sujet/carte"],
  },

  /* ------------------------------------------------------------------ Ennemis */
  {
    id: "ennemis",
    title: "Ennemis",
    en: "Enemies",
    icon: "human",
    group: "jeu",
    short: "Types, capacités, actif / inactif",
    blocks: [
      { t: "summary", text: "Chaque ennemi a un **type**, un **niveau**, des **points faibles V.A.T.S.** et jusqu'à **2 capacités**. Face cachée, il dort ; face visible, il chasse." },
      { t: "img", src: "img/photo-ennemis.jpg", alt: "Piles de jetons ennemis par type", caption: "Le dos des jetons indique le **type** ; la face, le niveau, les zones vulnérables et les capacités.", credit: ZATU },
      { t: "h", text: "Actif ou inactif ?" },
      { t: "bullets", items: [
        "**Face cachée = inactif** : on ne peut ni le regarder, ni le combattre, ni le cibler. Il **n'empêche pas** de Camper, faire une Rencontre ou une Quête dans sa case.",
        "**Face visible = actif** : il bloque Camper / Rencontre / Quête dans sa case et peut vous attaquer.",
        "Un ennemi inactif se retourne quand son **type est activé** en [fin de manche](#/sujet/fin-manche).",
      ] },
      { t: "h", text: "Les 5 types" },
      { t: "icons", items: [
        { i: "critter", t: "Bestioles", en: "Critter", d: "Insectes géants, animaux mutants…" },
        { i: "human", t: "Humains", en: "Human", d: "Pillards, mercenaires…" },
        { i: "robot", t: "Robots", en: "Robot", d: "Protectrons, tourelles…" },
        { i: "monster", t: "Monstres", en: "Monster", d: "Les grosses créatures (Écorcheurs…)." },
        { i: "mutant", t: "Super mutants", en: "Super Mutant", d: "Brutes vertes surarmées." },
      ] },
      { t: "p", text: "Les jetons de **faction** :star: :shield: représentent souvent des ennemis propres au scénario (voir la feuille de scénario). Une valeur « X » ou « Y » dépend de la position de la faction sur sa piste." },
      { t: "h", text: "Les capacités" },
      { t: "icons", items: [
        { i: "aggressive", t: "Agressif", en: "Aggressive", d: "Il entre dans votre case, ou vous dans la sienne → **combat immédiat** (gratuit). Être placé ou se réveiller dans votre case ne déclenche rien." },
        { i: "armor", t: "Blindé", en: "Armor", d: "Il faut **1 touche de plus** pour le tuer." },
        { i: "loot", t: "Butin", en: "Loot", d: "Si vous le tuez, piochez **1 carte Butin**." },
        { i: "radiation", t: "Radiation", en: "Radiation", d: "S'il vous inflige au moins 1 dégât, vous subissez **autant de rads que son niveau**." },
        { i: "ranged", t: "À distance", en: "Ranged", d: "À son activation, il **vous attaque depuis une case voisine**. Si vous n'avez pas d'arme :ranged:, il inflige **1 :hit: en plus**." },
        { i: "retreat", t: "Repli", en: "Retreat", d: "Si vous ne le tuez pas, il **se retourne face cachée** (inactif) sur place." },
      ] },
      { t: "coop", rule: "rangeAdv", label: "Règle optionnelle active", text: "**Avantage à distance** : l'ennemi :ranged: n'inflige pas de :hit: bonus, mais si vous n'avez pas d'arme :ranged:, vous ne pouvez pas le blesser quand il tire depuis une case voisine." },
      { t: "h", text: "Quand un ennemi est tué" },
      { t: "steps", items: [
        ["Défaussez son jeton", "Vous gagnez l'XP (= son niveau), même s'il meurt hors combat."],
        ["Un remplaçant arrive", "Piochez un jeton **du même type** et posez-le **face cachée** sur la case à icône de ce type **la plus proche**. Égalité : le premier joueur choisit."],
      ] },
      { t: "info", text: "Pas de remplaçant pour un **jeton de faction** ni pour un ennemi de « piocher et combattre »." },
    ],
    links: ["sujet/fin-manche", "sujet/combat", "action/combattre"],
  },

  /* ------------------------------------------------------------------ Fin de manche */
  {
    id: "fin-manche",
    title: "Fin de manche",
    en: "End of Round",
    icon: "round",
    group: "tour",
    short: "Carte Agenda, activation des ennemis",
    blocks: [
      { t: "summary", text: "Quand tout le monde a joué, le **premier joueur** révèle une carte Agenda : les **icônes en bas** de la carte indiquent quels types d'ennemis se réveillent et bougent." },
      { t: "steps", items: [
        ["Révélez la carte", "Le premier joueur retourne la carte du dessus du paquet **Agenda**."],
        ["Lisez le bas de la carte", "Les icônes d'ennemis :critter: :human: :robot: :monster: :mutant: :star: :shield: sont activées **de gauche à droite**, un type entièrement avant le suivant."],
        ["Les ennemis actifs agissent", "Chacun avance d'**1 case** vers le survivant le plus proche (en ignorant le terrain). S'il est **déjà dans sa case** — ou à côté avec :ranged: — il l'**attaque** au lieu de bouger."],
        ["Les inactifs se réveillent", "Les ennemis de ce type face cachée se retournent : ils sont actifs, mais **ne bougent pas** cette fois-ci."],
        ["Défaussez la carte", "Puis le premier joueur commence la manche suivante."],
      ] },
      { t: "more", title: "Égalités et cas particuliers", blocks: [
        { t: "bullets", items: [
          "Deux survivants aussi proches → l'ennemi vise celui qui a le **moins de PV restants**, puis celui qui joue **le plus tôt** dans l'ordre du tour.",
          "Plusieurs ennemis attaquent le même survivant → **il choisit** l'ordre des combats.",
          "Plusieurs cases possibles pour avancer → le **premier joueur** choisit.",
          "Les ennemis traversent les tuiles face cachée (une tuile cachée = 1 case).",
          "Un ennemi :aggressive: qui entre dans votre case vous attaque aussitôt.",
          { mode: "comp", text: "Les ennemis d'une faction **ignorent** les survivants loyaux à cette faction." },
        ] },
      ] },
      { t: "h", text: "Paquet Agenda épuisé" },
      { t: "steps", items: [
        ["Nouveau paquet", "Mélangez la défausse Agenda pour former un nouveau paquet."],
        ["Nouveau premier joueur", "Le paquet passe au joueur **à droite** du premier joueur, qui devient premier joueur.", ],
        ["Les factions avancent", "Chaque faction avance d'**1 case** sur sa piste de puissance."],
      ] },
      { t: "coop", mode: "coop", text: "En coop, **seule la faction ennemie** avance d'une case quand le paquet est épuisé." },
      { t: "info", mode: "comp", text: "En **solo**, seule la faction la **moins puissante** avance (les deux si égalité)." },
    ],
    links: ["sujet/ennemis", "sujet/factions", "sujet/debut-tour"],
  },

  /* ------------------------------------------------------------------ Début de tour */
  {
    id: "debut-tour",
    title: "Déroulement d'un tour",
    en: "Turns / Rounds",
    icon: "next",
    group: "tour",
    short: "Avant, pendant et après vos 2 actions",
    blocks: [
      { t: "summary", text: "Une **manche** = chaque joueur joue un tour (sens horaire, en commençant par le premier joueur), puis la [fin de manche](#/sujet/fin-manche)." },
      { t: "h", text: "Au début de votre tour (facultatif)" },
      { t: "bullets", items: [
        "**Équipez-vous** : échangez librement vos cartes équipées avec celles de votre inventaire.",
        { mode: "comp", text: "**Loyauté** : révélez une carte Agenda :star: ou :shield: pour déclarer votre loyauté à cette faction — ou cachez-la pour la retirer." },
      ] },
      { t: "h", text: "Vos 2 actions" },
      { t: "bullets", items: [
        "Choisissez parmi : Se déplacer, Explorer, Combattre, Rencontre, Quête, Camper (ou une action donnée par une carte).",
        "**La même action peut être faite deux fois**, sauf Rencontre.",
        "Une action doit être finie avant la suivante — sauf Se déplacer, qu'on peut couper en deux.",
        "Vous pouvez **passer** une ou deux actions : elles sont perdues.",
      ] },
      { t: "h", text: "Pendant votre tour" },
      { t: "bullets", items: [
        "Objets non équipables (soins, drogues, magazines) : utilisables depuis l'inventaire selon leur texte.",
        "Aptitudes : à défausser pendant votre tour (pas au milieu d'une action autre que Se déplacer).",
      ] },
      { t: "p", text: "Quand vous avez fini, c'est au joueur suivant (sens horaire)." },
    ],
    links: ["sujet/fin-manche", "sujet/equipement", "sujet/factions"],
  },

  /* ------------------------------------------------------------------ Équipement */
  {
    id: "equipement",
    title: "Équipement & cartes",
    en: "Items / Inventory",
    icon: "bag",
    group: "objets",
    short: "Arme, tenue, compagnon, inventaire",
    blocks: [
      { t: "summary", text: "Vous avez **3 emplacements** (1 arme, 1 tenue, 1 compagnon) + un **inventaire de 3 cartes**. Seules les cartes **équipées** font effet." },
      { t: "img", src: "img/photo-cartes.jpg", alt: "Les différents paquets de cartes du jeu", caption: "En haut : rencontres (Désolation, Colonie) et leurs faces. En bas : personnages, aptitudes, Agenda, Atouts, Butin, Atouts uniques.", credit: ZATU },
      { t: "icons", items: [
        { i: "weapon", t: "Arme", en: "Weapon", d: "Donne **1 relance par lettre S.P.E.C.I.A.L. imprimée que vous possédez**. Icône :ranged: = attaque à distance (case voisine)." },
        { i: "apparel", t: "Tenue", en: "Apparel", d: "Sa valeur d'**armure** annule autant de :hit: en combat." },
        { i: "companion", t: "Compagnon", en: "Companion", d: "Pouvoir à utiliser pendant votre tour en l'**épuisant**. Sa condition (bas de carte) est vérifiée quand il se redresse : non remplie → défaussé." },
      ] },
      { t: "h", text: "Inventaire" },
      { t: "bullets", items: [
        "**3 cartes maximum** (sous l'emplacement de droite du plateau). En trop ? Défaussez au choix jusqu'à 3.",
        "Les cartes équipées **ne comptent pas** dans l'inventaire.",
        "Soins (aid), drogues et magazines **s'utilisent depuis l'inventaire**.",
        "Équipement et inventaire sont **visibles de tous**.",
        "Nouvelle carte équipable ? Équipez-la tout de suite si vous voulez (l'ancienne passe dans l'inventaire). Sinon, échanges au **début de votre tour**.",
      ] },
      { t: "h", text: "Épuiser une carte" },
      { t: "p", text: "Utiliser certains pouvoirs **épuise** la carte : tournez-la de 90°. Elle ne resservira pas avant d'être redressée, en général en [campant](#/action/camper). Si redresser a un coût, payez-le ou elle reste épuisée." },
      { t: "h", text: "Les paquets de cartes" },
      { t: "icons", items: [
        { i: "loot", t: "Butin", en: "Loot", d: "Objets, compagnons ou événements trouvés dans les Terres désolées. Un événement s'applique puis se défausse." },
        { i: "caps", t: "Atouts", en: "Assets", d: "Ce qui se vend à la [boutique](#/sujet/boutique) : objets et compagnons." },
        { i: "sparkle", t: "Atouts uniques", en: "Unique Assets", d: "Objets et personnages légendaires gagnés par quêtes/rencontres. Introuvable ? Prenez-en un au hasard." },
        { i: "user", t: "Carte de personnage", en: "Character card", d: "Propre à votre survivant. Si ce n'est ni un objet ni un compagnon, elle ne s'échange ni ne se défausse." },
      ] },
    ],
    links: ["sujet/boutique", "action/camper", "sujet/combat"],
  },

  /* ------------------------------------------------------------------ Boutique */
  {
    id: "boutique",
    title: "Boutique & Capsules",
    en: "Shop / Caps",
    icon: "shop",
    group: "objets",
    short: "Acheter, vendre, recruter",
    blocks: [
      { t: "summary", text: "La boutique est une rangée de **4 cartes Atout** face visible. Une carte (souvent une rencontre de colonie :settlement:) vous dit « **Shop #** » : vous faites # transactions." },
      { t: "steps", items: [
        ["Réapprovisionnement", "Piochez **1 Atout** et ajoutez-le **à gauche** de la rangée."],
        ["Faites # transactions parmi…", "**Acheter** : payez son coût en Capsules :caps:, prenez la carte.<br>**Vendre** : défaussez une carte (équipée ou inventaire), gagnez sa **valeur − 1**.<br>**Recruter** : prenez un compagnon — seulement si vous avez le **trait ou la lettre S.P.E.C.I.A.L.** de son coin supérieur droit (rien d'indiqué = libre)."],
        ["Remise à 4 cartes", "S'il reste plus de 4 cartes, défaussez celles **de droite** ; moins de 4, complétez."],
      ] },
      { t: "h", text: "Les Capsules :caps:" },
      { t: "bullets", items: [
        "Monnaie des Terres désolées. Vous en avez **3** au départ, sans limite ensuite.",
        "Un jeton « 5 » vaut cinq « 1 » ; faites la monnaie quand vous voulez.",
        { rule: "capKill", text: "**Prime (règle coop)** : +1 Capsule par ennemi tué en combat." },
      ] },
    ],
    links: ["sujet/equipement", "action/rencontre", "sujet/resultats"],
  },

  /* ------------------------------------------------------------------ Résultats */
  {
    id: "resultats",
    title: "Lire les résultats",
    en: "Results",
    icon: "card",
    group: "objets",
    short: "Add, Stage, Trash… les mots-clés des cartes",
    blocks: [
      { t: "summary", text: "Quêtes et rencontres listent des **résultats** à appliquer de gauche à droite. Voici leur traduction." },
      { t: "table", head: ["Sur la carte", "Ce que vous faites"], rows: [
        ["**Add #**", "Prenez la carte n° # dans la bibliothèque, ajoutez-y (sans regarder) autant de cartes du paquet au même dos que de joueurs, mélangez et posez le tout **sur** ce paquet (le créer s'il n'existe pas)."],
        ["**Stage #**", "Prenez la carte n° # dans la bibliothèque et posez-la face visible en jeu (nouvelle quête). Appliquez sa partie haute."],
        ["**Become X**", "Gagnez le trait X (Idolâtré, Vilipendé…)."],
        ["**# XP**", "Gagnez # XP."],
        ["**# Caps**", "Gagnez # Capsules."],
        [":loot: :caps: :influence:", "Piochez 1 carte Butin / Atout / Agenda (« ×2 » = deux)."],
        ["**Shop #**", "Faites # transactions à la [boutique](#/sujet/boutique)."],
        ["**Gain the X unique asset**", "Prenez l'Atout unique X (absent ? un au hasard)."],
        [":star:+ / :shield:+", "Cette faction avance d'autant de cases que de « + »."],
        ["**Trash**", "La carte retourne **dans la boîte**."],
      ] },
      { t: "info", text: "Une icône de rencontre dans un résultat (ex. :wasteland:+1) vaut le **niveau** de la case où vous êtes, + ou − le modificateur." },
      { t: "warn", label: "Bibliothèque de cartes", text: "Les cartes numérotées en haut à gauche forment la **bibliothèque**. Ne les lisez jamais : cherchez seulement le numéro demandé." },
    ],
    links: ["action/quete", "action/rencontre", "sujet/factions"],
  },

  /* ------------------------------------------------------------------ Factions */
  {
    id: "factions",
    title: "Factions & loyauté",
    en: "Factions / Loyalty",
    icon: "star",
    group: "partie",
    short: "Piste de puissance, loyauté",
    blocks: [
      { t: "summary", text: "Deux factions :star: et :shield: se disputent la région. Vos quêtes les font avancer sur la **piste de puissance**. Si l'une arrive au bout, **la partie s'arrête**." },
      { t: "bullets", items: [
        "Les deux pions partent de la case du haut de la piste (feuille de scénario).",
        "Ils avancent avec les résultats de quêtes (:star:+, :shield:+) et quand le paquet Agenda est épuisé.",
        "La position d'une faction peut renforcer ses ennemis (valeurs « X » / « Y »).",
      ] },
      { t: "card", mode: "comp", title: "Fin de partie par une faction", blocks: [
        { t: "p", text: "Dès qu'une faction atteint (ou dépasse) la dernière case : la partie s'arrête. Les survivants qui atteignent l'influence requise grâce à cette avancée **gagnent** ; sinon, **tout le monde perd**." },
        { t: "p", text: "Les cases « au-delà » de la fin comptent quand on compare l'écart entre factions pour l'influence." },
      ] },
      { t: "card", mode: "comp", title: "Déclarer sa loyauté", blocks: [
        { t: "p", text: "Au début de votre tour, révélez une carte Agenda :star: ou :shield: et laissez-la face visible :" },
        { t: "bullets", items: [
          "Les ennemis de cette faction ne vous **empêchent plus** d'agir dans leur case.",
          "À leur activation, ils vous **ignorent**.",
          "Mais vous **ne pouvez pas les combattre**.",
        ] },
        { t: "p", text: "Une seule carte révélée à la fois. Vous pouvez la cacher au début d'un tour pour retirer votre loyauté. Elle compte toujours dans votre influence et votre limite de 4 cartes." },
      ] },
      { t: "coop", mode: "coop", text: "En coop, vous choisissez ensemble une **faction alliée** avant la partie : elle doit atteindre le bout de la piste… mais **pas avant** que vous ayez réuni assez de cartes Agenda. Voir [Mode coop](#/coop)." },
    ],
    links: ["sujet/victoire", "sujet/fin-manche", "action/quete"],
  },

  /* ------------------------------------------------------------------ Carte */
  {
    id: "carte",
    title: "Carte & terrain",
    en: "Map Tiles / Terrain",
    icon: "map",
    group: "partie",
    short: "Tuiles, cases, terrain",
    blocks: [
      { t: "img", src: "img/photo-tuiles.jpg", alt: "Trois tuiles hexagonales de la carte", caption: "Tuiles de carte. La flèche en haut sert à les orienter ; les bordures colorées signalent le terrain ; « Crossroads Camp » est la tuile de départ.", credit: ZATU },
      { t: "bullets", items: [
        "La carte se construit selon le **dos de la feuille de scénario**. Les tuiles :dangerous: et :deadly: sont posées **face cachée** au hasard.",
        "Toutes les flèches pointent dans la même direction que celle de la tuile de départ.",
        "Chaque tuile est découpée en **cases** (lignes blanches). Deux cases sont **adjacentes** si elles partagent une bordure.",
        "Autant de survivants et d'ennemis que vous voulez peuvent partager une case.",
        "Les cases importantes ont un **nom** et une **icône de rencontre** (avec parfois un niveau).",
      ] },
      { t: "icons", items: [
        { i: "dangerous", t: "Tuile dangereuse", en: "Dangerous", d: "Dos avec un triangle." },
        { i: "deadly", t: "Tuile mortelle", en: "Deadly", d: "Dos avec un hexagone : ça pique davantage." },
        { i: "move", t: "Terrain difficile", en: "Difficult · bordure rouge", d: "Coûte **1 point de mouvement en plus**. Pas assez de points ? Impossible d'y entrer." },
        { i: "radiation", t: "Terrain irradié", en: "Irradiated · bordure verte", d: "Vous subissez **1 rad** en y entrant." },
      ] },
    ],
    links: ["action/deplacer", "action/explorer", "sujet/ennemis"],
  },

  /* ------------------------------------------------------------------ Traits */
  {
    id: "traits",
    title: "Traits",
    en: "Traits",
    icon: "user",
    group: "objets",
    short: "Bien reposé, Idolâtré, Synthé…",
    blocks: [
      { t: "summary", text: "Les traits décrivent votre survivant. Ils sont sur **3 jetons recto-verso** : on ne peut jamais avoir les deux faces d'un même jeton." },
      { t: "html", html: () => `
        <div class="trait-grid">
          ${[
            ["bien-repose", "Bien reposé", "Well Rested", "Défaussez-le pendant un combat ou un test : +1 relance."],
            ["accro", "Accro", "Addicted", "Dépendance aux drogues ; certaines cartes y réagissent."],
            ["idolatre", "Idolâtré", "Idolized", "Les gens vous adorent."],
            ["vilipende", "Vilipendé", "Vilified", "Les gens vous détestent."],
            ["synthe", "Synthé", "Synth", "Vous êtes un androïde de l'Institut."],
            ["super-mutant", "Super mutant", "Super Mutant", "Vous êtes un super mutant."],
          ].map(([f, t, en, d]) => `<div class="trait-pair"><img src="img/trait-${f}.png" alt="" width="46" height="46"><div><div class="t">${t}</div><div class="d"><span class="mono">${en}</span> — ${d}</div></div></div>`).join("")}
        </div>` },
      { t: "p", text: "Paires (recto / verso) : **Idolâtré / Vilipendé**, **Synthé / Super mutant**, **Bien reposé / Accro**. Hors Bien reposé, les traits n'ont pas d'effet propre : ce sont les cartes (compagnons, rencontres, quêtes) qui y font référence." },
      { t: "bullets", items: [
        "Gagner le trait opposé ? **Retournez** le jeton (vous perdez l'autre trait).",
        "Jeton avec un **cadenas** :lock: visible : il ne peut plus être retourné (mais il peut être perdu).",
        "Perdre un trait : défaussez le jeton.",
      ] },
    ],
    links: ["action/camper", "sujet/boutique", "sujet/resultats"],
  },

  /* ------------------------------------------------------------------ Victoire */
  {
    id: "victoire",
    title: "Gagner la partie",
    en: "Winning the Game",
    icon: "trophy",
    group: "partie",
    short: "Influence, fin de partie",
    blocks: [
      { t: "html", html: (ctx) => ctx.victoryBlock() },
    ],
    links: ["sujet/factions", "coop", "sujet/fin-manche"],
  },

  /* ------------------------------------------------------------------ Solo */
  {
    id: "solo",
    title: "Jouer seul",
    en: "Solo Play",
    icon: "user",
    group: "partie",
    short: "Les ajustements à 1 joueur",
    blocks: [
      { t: "summary", text: "En solo (mode compétitif à 1 joueur), toutes les règles s'appliquent avec ces exceptions." },
      { t: "bullets", items: [
        "Il faut **11 influence** :influence: pour gagner.",
        "Une quête exige d'être dans la case d'un autre survivant ? Soyez sur une case :settlement: à la place.",
        "Un autre survivant doit faire un test ? Il obtient **3** automatiquement.",
        "Rencontres : lisez seulement le texte normalement lu à voix haute, décidez, **puis** lisez le résultat choisi.",
        "Paquet Agenda épuisé : seule la faction **la moins puissante** avance (les deux en cas d'égalité).",
      ] },
      { t: "tip", text: "Envie d'un vrai défi en solo ? Essayez le [mode coopératif](#/coop) à 1 survivant : 6 cartes Agenda à réunir." },
    ],
    links: ["sujet/victoire", "coop"],
  },
];

export const TOPIC_BY_ID = Object.fromEntries(TOPICS.map((t) => [t.id, t]));

export const TOPIC_GROUPS = [
  ["tour", "Le tour de jeu"],
  ["jeu", "Combat & progression"],
  ["objets", "Cartes & objets"],
  ["partie", "La partie"],
];
