# PokéQuiz Ultimate

Application web de quiz Pokémon conçue pour des parties privées de 1 à 8 joueurs. La V3 Alpha inaugure un nouveau socle React + TypeScript, indépendant de l’ancienne V2.5 conservée dans le dépôt comme archive historique.

## Fonctionnalités de l’Alpha

- menu principal et reprise d’une partie sauvegardée ;
- configuration de 1 à 8 joueurs ;
- mode « Questions en vrac » ou partie dédiée à une catégorie ;
- difficulté Découverte, Confirmé, Expert ou Tous niveaux ;
- QCM avec un seul essai par joueur ;
- questions ouvertes avec trois essais ;
- validation tolérante aux accents, espaces, casse et ponctuation ;
- chronomètre, score automatique et révélation expliquée ;
- tirage aléatoire de dix questions respectant le mode et la difficulté ;
- sauvegarde locale automatique ;
- podium final ;
- banque initiale de 12 questions ;
- tests unitaires du moteur.

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
