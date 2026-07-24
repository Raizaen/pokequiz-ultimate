# Architecture de la V3 Alpha

La V3 ne dépend pas du code de la V2.5. L’archive historique reste à la racine du dépôt.

## Modules

- `domain/` : contrats TypeScript du jeu.
- `engine/` : règles pures et testables (validation, tentatives, score, chronomètre, sélection).
- `data/` : banque initiale de questions, indépendante de l’interface.
- `storage/` : persistance locale de la partie.
- `components/` : composants d’interface réutilisables.
- `styles/` : identité visuelle rétro/moderne.

## Principes

Le moteur ne dépend ni de React ni de Pokémon. Une question décrit son type, ses réponses acceptées, sa durée et sa valeur. Les QCM autorisent un essai ; les questions ouvertes en autorisent trois. L’interface appelle le moteur et sauvegarde chaque nouvel état dans `localStorage`.

La configuration d’une partie est elle aussi indépendante de l’interface. Elle définit le mode (`mixed` ou `category`), la catégorie éventuelle et un palier de difficulté. Le sélecteur filtre la banque avant d’effectuer le tirage aléatoire.

## Prochains jalons

1. Rotation persistante et anti-répétition par catégorie.
2. Éditeur et import/export JSON.
3. IndexedDB pour la banque étendue.
4. Questions visuelles et médias remplaçables.
5. Mode animateur et clients mobiles.
