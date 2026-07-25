# Guide éditorial des questions

## Cycle de validation

Une question éditoriale possède un statut :

- `draft` : idée initiale, non jouable dans une future interface d’édition ;
- `review` : formulation et réponse relues, source encore à confirmer ;
- `validated` : réponse, périmètre et source vérifiés.

Une question validée indique sa date de vérification et au moins une source précise. Lorsque la mécanique varie selon les jeux, `generationScope` délimite les générations concernées.

## Difficulté

- ★ : connaissance emblématique ou immédiatement accessible ;
- ★★ : connaissance courante d’un joueur régulier ;
- ★★★ : mécanique moins fréquente ou condition composée ;
- ★★★★ : détail spécialisé, génération ou jeu précis ;
- ★★★★★ : valeur exacte ou interaction particulièrement pointue.

Le champ `difficultyReason` explique le classement afin qu’une relecture puisse le contester ou l’ajuster.

## Qualité attendue

Chaque question doit :

1. avoir une réponse unique ou un ensemble de réponses explicitement défini ;
2. préciser le jeu ou la génération lorsqu’une règle a changé ;
3. éviter les formulations absolues comme « le seul » sans preuve exhaustive ;
4. proposer des distracteurs plausibles mais clairement faux ;
5. fournir une explication qui apporte davantage que la simple répétition de la réponse ;
6. utiliser un identifiant stable et un modèle (`template`) identifiable.

## Pack pilote Labo

`src/data/curated/laboPilot.ts` sert de référence. Il combine QCM simple, QCM multiple et réponse ouverte autour de méthodes d’évolution classiques, régionales et atypiques.

## Pack pilote Capacités

`src/data/curated/movesPilot.ts` applique les mêmes règles aux caractéristiques de combat. Les questions dépendantes d’un équilibrage historique délimitent explicitement les générations concernées. Le pack couvre puissance, précision, PP, priorité, catégorie de dégâts, météo, effets secondaires et capacités signatures.

## Pack pilote Stratégie

`src/data/curated/strategyPilot.ts` privilégie les situations et interactions utiles en combat plutôt qu’un unique modèle fondé sur les statistiques de base. Il couvre EV, IV, natures, STAB, statuts, objets tenus, météo, écrans et interactions de talents. Les changements historiques sont toujours rattachés à une génération précise.

### Stats en Ordre

`src/data/curated/statOrderQuestions.ts` utilise le type natif `stat-order` et alimente la catégorie autonome `Stats en Ordre`. La banque contient dix séries pour chacune des six statistiques de base : PV, Attaque, Défense, Attaque Spéciale, Défense Spéciale et Vitesse. Une série contient cinq Pokémon disponibles dans Pokémon Champions et cinq valeurs distinctes. Le premier Pokémon sert de repère ; les quatre suivants sont insérés et confirmés successivement avant la validation finale. Chaque position exacte rapporte cinq points.

### Lieu Perdu

`src/data/curated/paldeaLostPlaceQuestions.ts` et `sinnohLostPlaceQuestions.ts` utilisent le type `map-location`. La banque contient 50 cibles à Paldea et 30 à Sinnoh, normalisées sur des cartes de 100 × 100. Le joueur peut sélectionner une région ou mélanger les deux avant la partie. La carte partagée fait répondre les joueurs successivement sans montrer les marqueurs déjà validés. Elle accepte le déplacement direct, le zoom à la molette et les contrôles dédiés. À la révélation, la solution, les positions, les traits, les écarts numériques, une appréciation de précision et les points deviennent visibles. Chaque résultat est archivé afin de produire en fin de partie un classement cartographique, les distances moyennes, les meilleurs et pires clics et une carte de synthèse par région.

## Pack pilote Objets

`src/data/curated/itemsPilot.ts` couvre les usages en combat, les Baies, les Balls et les objets d’évolution. Les QCM multiples servent à comparer des familles d’objets ou des conditions d’activation sans réduire la catégorie à une succession de définitions.

## Pack pilote Pokédex

`src/data/curated/pokedexPilot.ts` alterne numéros nationaux, types, talents, statistiques, évolutions et mensurations. Les comparaisons et QCM multiples sont privilégiés dès qu’ils apportent davantage qu’une simple restitution de fiche.

## Pack pilote Jeux principaux

`src/data/curated/gamesPilot.ts` traverse les générations par les régions, personnages, mécaniques, scénarios, remakes et contenus d’après-Ligue. Les questions dépendantes d’une version nomment toujours précisément le ou les jeux concernés.

## Pack pilote Lore

`src/data/curated/lorePilot.ts` s’appuie sur les mythes et événements explicitement décrits dans les jeux. Les formulations distinguent les légendes racontées par les personnages, les faits montrés à l’écran et les origines volontairement laissées mystérieuses.

## Pack pilote Anime

`src/data/curated/animePilot.ts` couvre les séries centrées sur Sacha par les compagnons, objectifs, équipes et résultats en Ligue. Chaque question précise l’arc ou la compétition lorsque le contexte est nécessaire pour garantir une réponse unique.

## Pack initial Spin-off

`src/data/curated/spinOffQuestions.ts` rend la catégorie jouable dès son activation avec 50 questions validées. Le pack équilibre Snap, Donjon Mystère, Ranger, Colosseum/XD, GO, UNITE, Masters EX et plusieurs jeux autonomes.
