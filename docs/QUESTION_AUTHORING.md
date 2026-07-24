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
