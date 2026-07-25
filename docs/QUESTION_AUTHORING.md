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

## Pack pilote Objets

`src/data/curated/itemsPilot.ts` couvre les usages en combat, les Baies, les Balls et les objets d’évolution. Les QCM multiples servent à comparer des familles d’objets ou des conditions d’activation sans réduire la catégorie à une succession de définitions.

## Pack pilote Pokédex

`src/data/curated/pokedexPilot.ts` alterne numéros nationaux, types, talents, statistiques, évolutions et mensurations. Les comparaisons et QCM multiples sont privilégiés dès qu’ils apportent davantage qu’une simple restitution de fiche.

## Pack pilote Jeux principaux

`src/data/curated/gamesPilot.ts` traverse les générations par les régions, personnages, mécaniques, scénarios, remakes et contenus d’après-Ligue. Les questions dépendantes d’une version nomment toujours précisément le ou les jeux concernés.
