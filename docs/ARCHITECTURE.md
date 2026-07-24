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

Le moteur ne dépend ni de React ni de Pokémon. Une question décrit son type, ses réponses acceptées, sa durée et sa valeur. Les QCM simples et multiples autorisent un essai ; les questions ouvertes en autorisent trois. Pour un QCM multiple, le moteur compare les ensembles normalisés de choix sans tenir compte de leur ordre. L’interface appelle le moteur et sauvegarde chaque nouvel état dans `localStorage`.

La configuration d’une partie est elle aussi indépendante de l’interface. Elle définit le mode (`mixed` ou `category`), la catégorie éventuelle et un palier de difficulté. Le sélecteur filtre la banque avant d’effectuer le tirage aléatoire.

## Données PokéAPI

Le script `scripts/generate-pokeapi-bank.mjs` importe puis met en cache les faits Pokémon, les capacités, les objets et le catalogue de sprites. Les générateurs alternent plusieurs modèles grâce au champ `template`, dont les tests contrôlent la diversité. L’application ne dépend donc pas de l’API au moment de jouer, à l’exception des fichiers PNG des sprites. Le mélange Fisher–Yates utilise l’aléatoire cryptographique du navigateur et déduplique les questions par identifiant avant le tirage.

Les questions éditoriales ajoutent un périmètre de génération, une justification de difficulté et un dossier de validation sourcé. Les règles de rédaction sont détaillées dans [`QUESTION_AUTHORING.md`](QUESTION_AUTHORING.md).

## Prochains jalons

1. Rotation persistante et anti-répétition par catégorie.
2. Éditeur et import/export JSON.
3. IndexedDB pour la banque étendue.
4. Questions visuelles et médias remplaçables.
5. Mode animateur et clients mobiles.
