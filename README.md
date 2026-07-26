# PokéQuiz Ultimate

Application web de quiz Pokémon conçue pour des parties privées de 1 à 8 joueurs. La V3 Alpha inaugure un nouveau socle React + TypeScript, indépendant de l’ancienne V2.5 conservée dans le dépôt comme archive historique.

**Jouer en ligne : https://pokequiz-ultimate.vercel.app**

## Fonctionnalités de l’Alpha

- menu principal et reprise d’une partie sauvegardée ;
- configuration de 1 à 8 joueurs ;
- mode « Questions en vrac » ou partie dédiée à une catégorie ;
- catalogue exhaustif des sprites disponibles : les 1025 espèces nationales et leurs formes spéciales ;
- filtre Sprites permettant de jouer une, plusieurs ou toutes les générations ;
- variantes Sprites configurables : normal, silhouette, révélation progressive, chromatique, zoom et retourné ;
- cadrage Fragment adaptatif fondé sur les pixels visibles de chaque sprite ;
- révélation progressive synchronisée avec un score décroissant de 20, 15, 10 puis 5 points ;
- préchargement des images de la question en cours et des deux suivantes ;
- épreuve visuelle « Qui est l’intrus ? » intégrée au Labo ;
- catégorie Pokémon Pokopia avec 50 questions vérifiées et filtre de spoilers ;
- récapitulatif de configuration avant lancement et statistiques détaillées au podium ;
- rotation des questions entre les parties et cache local des images déjà consultées ;
- difficulté Découverte, Confirmé, Expert ou Tous niveaux ;
- timer configurable de 10, 15, 20 ou 30 secondes, avec un mode sans limite ;
- choix du nombre de questions selon la sélection disponible ;
- épreuve cartographique « Lieu Perdu » avec 50 lieux à Paldea, 30 à Sinnoh et sélection de la région ;
- récapitulatif cartographique final avec distances, tirs parfaits, meilleurs clics et cartes de synthèse ;
- QCM avec un seul essai par joueur ;
- QCM multiples avec plusieurs propositions à cocher ;
- questions ouvertes avec trois essais ;
- validation tolérante aux accents, espaces, casse et ponctuation ;
- chronomètre, score automatique et révélation expliquée ;
- tirage aléatoire de dix questions respectant le mode et la difficulté ;
- ordre aléatoire et déduplication stricte des questions au sein d’une partie ;
- sauvegarde locale automatique ;
- podium final ;
- au moins 50 questions dans chaque catégorie jouable ;
- catégories Capacités et Objets indépendantes, avec plusieurs modèles de questions chacune ;
- premier pack éditorial Labo de 20 questions validées, sourcées et calibrées ;
- pack éditorial Capacités de 20 questions validées, dont quatre QCM multiples ;
- tests unitaires du moteur.
- espace d’administration protégé par Supabase Auth et règles d’accès en base ;

La mise en place du compte administrateur est décrite dans
[`docs/ADMINISTRATION.md`](docs/ADMINISTRATION.md).

## Lancer le projet

Prérequis : Node.js 20.19+ ou 22.12+.

```bash
npm install
npm run dev
```

Puis ouvrir l’adresse indiquée par Vite, généralement `http://localhost:5173`.

## Vérifications

```bash
npm run lint
npm test
npm run build
```

## Structure

```text
src/
├── components/   Interface réutilisable
├── data/         Banque de questions
├── domain/       Modèles du jeu
├── engine/       Règles métier testables
├── storage/      Sauvegarde locale
└── styles/       Identité visuelle
```

Les choix d’architecture sont détaillés dans [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

Les données structurées sont mises en cache dans `src/data/generated`. Elles proviennent de PokéAPI et peuvent être régénérées avec `npm run questions:sync`. Les images restent chargées depuis le dépôt public de sprites PokéAPI : la catégorie Sprites nécessite donc une connexion internet.
