# EcoEATS — Clean Architecture 

EcoEATS est une plateforme de livraison de repas éthique et transparente, conçue pour connecter Clients, Restaurateurs et Livreurs tout en assurant une flexibilité technologique totale grâce aux principes de la Clean Architecture.

---

## Architecture du Projet

Le projet est structuré en Monorepo avec une séparation stricte des responsabilités (SOLID) :

### Packages Partagés (/packages)
- **domain** : Le cœur métier (Entités, Value Objects). Zéro dépendance externe.
- **application** : Orchestration via les Use Cases et définition des Ports.
- **infrastructure** : Adaptateurs concrets (Prisma/PostgreSQL, In-Memory, Services tiers).
- **interface** : Contrats et logique partagée pour les APIs.

### Applications (/apps)
- **api-express** : Backend principal en Express.js.
- **api-nestjs** : Backend modulaire en NestJS.
- **client-web** : Interface React pour les clients.
- **livreur-web** : Interface React pour les livreurs.
- **restaurateur-web** : Interface React pour les restaurateurs.
- **admin-web** : Interface React pour l'administration.

---

## Démarrage Rapide (Docker)

Le projet est entièrement conteneurisé. Une seule commande suffit pour lancer l'écosystème complet (Base de données + 2 APIs + 4 Frontends) :

```bash
docker compose up -d --build
```

### Récapitulatif des Accès

| Application | URL | Rôle |
| :--- | :--- | :--- |
| **Client** | http://localhost:5173 | Passer des commandes |
| **Livreur** | http://localhost:5174 | Gérer les livraisons |
| **Restaurateur** | http://localhost:5175 | Gérer le menu & stocks |
| **Admin** | http://localhost:5176 | Pilotage global |
| **API Express** | http://localhost:3000 | Core Engine |
| **API NestJS** | http://localhost:3001 | Auth & Support |

---

## Concepts Plug & Play Implémentés

Pour prouver la robustesse de l'architecture, le projet intègre :
- **Multi-Frameworks** : La même logique métier est consommée par Express et NestJS.
- **Multi-Adapteurs DB** : Basculement instantané entre In-Memory et PostgreSQL (Prisma) via une variable d'environnement (DB_ADAPTER).

---

## Règles Métier Implémentées
- **Panier Intelligent** : Un panier ne peut contenir des articles que d'un seul restaurant.
- **Stock en Temps Réel** : Un plat avec un stock de 0 disparaît automatiquement des options commandables.
- **Calcul de Gains Équitable** : Formule fixe pour les livreurs sans commission plateforme.
- **Statut Expert** : Les livreurs expérimentés peuvent gérer deux livraisons simultanées.

---

## Tests
```bash
npm test # Lance les tests unitaires sur toutes les couches
```

---
*Projet réalisé dans le cadre pédagogique Clean Architecture.*
