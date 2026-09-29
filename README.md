# Vote API

API REST de gestion de sondages développée avec **NestJS**, **TypeScript**, **TypeORM** et **MySQL**.

L'application permet de créer des sondages avec plusieurs options, de gérer les utilisateurs et les votes, d'empêcher un utilisateur de voter plusieurs fois pour le même sondage et de fermer automatiquement les sondages lorsque leur date d'expiration est atteinte.

## Technologies utilisées

- **Node.js**
- **NestJS**
- **TypeScript**
- **TypeORM**
- **MySQL**
- **class-validator**
- **@nestjs/schedule**
- **REST API**
- **curl** pour les tests

## Fonctionnalités

- Gestion des utilisateurs
- Création et gestion des sondages
- Ajout de plusieurs options à un sondage
- Vote des utilisateurs
- Un seul vote par utilisateur et par sondage
- Affichage des résultats et des pourcentages
- Fermeture automatique des sondages à leur date d'expiration
- Validation des données envoyées à l'API
- Suppression des sondages et des options

## Structure du projet

```text
vote_api/
├── src/
│   ├── users/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   │
│   ├── polls/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── polls.controller.ts
│   │   ├── polls.service.ts
│   │   └── polls.module.ts
│   │
│   ├── options/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── options.controller.ts
│   │   ├── options.service.ts
│   │   └── options.module.ts
│   │
│   ├── votes/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── votes.controller.ts
│   │   ├── votes.service.ts
│   │   └── votes.module.ts
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

## Prérequis

Avant d'installer le projet, il faut avoir installé :

- Node.js
- npm
- MySQL
- Git

Vérifier les versions :

```bash
node --version
npm --version
mysql --version
git --version
```

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/andrianavalonaango-dev/vote_api.git
```

Entrer dans le projet :

```bash
cd vote_api
```

### 2. Installer les dépendances

```bash
npm install
```

## Configuration de la base de données

Le projet utilise **MySQL**.

Créer la base de données :

```sql
CREATE DATABASE vote_db;
```

Créer l'utilisateur MySQL utilisé par l'application :

```sql
CREATE USER 'vote_user'@'localhost' IDENTIFIED BY 'vote_password';
```

Donner les droits :

```sql
GRANT ALL PRIVILEGES ON vote_db.* TO 'vote_user'@'localhost';
```

Puis :

```sql
FLUSH PRIVILEGES;
```

## Configuration des variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=vote_user
DB_PASSWORD=vote_password
DB_DATABASE=vote_db
PORT=3000
```

> Le fichier `.env` contient des informations sensibles et ne doit pas être envoyé sur GitHub.

## Lancement du projet

### Mode développement

```bash
npm run start:dev
```

L'API sera disponible à :

```text
http://localhost:3000
```

### Mode normal

```bash
npm run start
```

### Compiler le projet

```bash
npm run build
```

### Lancer la version compilée

```bash
npm run start:prod
```

## API

### Utilisateurs

Créer un utilisateur :

```http
POST /users
```

Récupérer tous les utilisateurs :

```http
GET /users
```

Récupérer un utilisateur :

```http
GET /users/:id
```

Supprimer un utilisateur :

```http
DELETE /users/:id
```

### Sondages

Créer un sondage :

```http
POST /polls
```

Récupérer tous les sondages :

```http
GET /polls
```

Récupérer un sondage :

```http
GET /polls/:id
```

Modifier un sondage :

```http
PATCH /polls/:id
```

Supprimer un sondage :

```http
DELETE /polls/:id
```

Récupérer les résultats :

```http
GET /polls/:id/results
```

### Options

Ajouter une option à un sondage :

```http
POST /polls/:pollId/options
```

Récupérer les options d'un sondage :

```http
GET /polls/:pollId/options
```

Récupérer toutes les options :

```http
GET /options
```

Récupérer une option :

```http
GET /options/:id
```

Supprimer une option :

```http
DELETE /options/:id
```

### Votes

Voter dans un sondage :

```http
POST /polls/:pollId/vote
```

Récupérer les votes d'un sondage :

```http
GET /polls/:pollId/votes
```

Récupérer tous les votes :

```http
GET /votes
```

Récupérer un vote :

```http
GET /votes/:id
```

## Exemple de création d'un utilisateur

```bash
curl -X POST http://localhost:3000/users \
-H "Content-Type: application/json" \
-d '{
  "name": "Ango",
  "email": "ango@gmail.com",
  "password": "password123"
}'
```

## Exemple de création d'un sondage

Le sondage peut être configuré pour expirer dans 5 minutes :

```bash
curl -X POST http://localhost:3000/polls \
-H "Content-Type: application/json" \
-d "{
  \"title\": \"Quel langage de programmation préférez-vous ?\",
  \"description\": \"Choisissez votre langage de programmation préféré.\",
  \"expiresAt\": \"$(date -u -d '+5 minutes' '+%Y-%m-%dT%H:%M:%SZ')\"
}"
```

## Ajouter une option

Exemple :

```bash
curl -X POST http://localhost:3000/polls/1/options \
-H "Content-Type: application/json" \
-d '{
  "text": "JavaScript"
}'
```

Autres exemples :

```bash
curl -X POST http://localhost:3000/polls/1/options \
-H "Content-Type: application/json" \
-d '{
  "text": "Python"
}'
```

```bash
curl -X POST http://localhost:3000/polls/1/options \
-H "Content-Type: application/json" \
-d '{
  "text": "PHP"
}'
```

## Voter

Exemple :

```bash
curl -X POST http://localhost:3000/polls/1/vote \
-H "Content-Type: application/json" \
-d '{
  "userId": 1,
  "optionId": 1
}'
```

Un utilisateur ne peut voter qu'une seule fois pour le même sondage.

## Consulter les résultats

```bash
curl http://localhost:3000/polls/1/results
```

Exemple de résultat :

```json
{
  "pollId": 1,
  "title": "Quel langage de programmation préférez-vous ?",
  "totalVotes": 2,
  "results": [
    {
      "optionId": 1,
      "text": "JavaScript",
      "votes": 1,
      "percentage": 50
    },
    {
      "optionId": 2,
      "text": "Python",
      "votes": 1,
      "percentage": 50
    }
  ]
}
```

## Fermeture automatique des sondages

Les sondages possèdent une date d'expiration définie avec `expiresAt`.

Un système de tâche planifiée vérifie automatiquement les sondages chaque minute.

Lorsqu'un sondage atteint sa date d'expiration :

```text
status = "active"
```

devient :

```text
status = "closed"
```

Le système permet donc de fermer automatiquement les sondages sans intervention manuelle.

## Tests

Lancer les tests unitaires :

```bash
npm run test
```

Lancer les tests end-to-end :

```bash
npm run test:e2e
```

Afficher la couverture des tests :

```bash
npm run test:cov
```

## Build

Pour vérifier que le projet peut être compilé :

```bash
npm run build
```

Si la compilation réussit, le dossier `dist/` est généré.

## Git

Pour récupérer la dernière version du projet :

```bash
git pull origin main
```

Pour envoyer des modifications :

```bash
git add .
git commit -m "description des modifications"
git push origin main
```

## Repository

GitHub :

https://github.com/andrianavalonaango-dev/vote_api

