# EcoEATS — Clean Architecture TypeScript

Plateforme de livraison de repas éthique, conçue selon les principes de la **Clean Architecture** (Robert C. Martin).

---

## Architecture

```
packages/
  domain/        → Entités, Value Objects, Services métier, Erreurs typées
  application/   → Use Cases + Ports (interfaces)
  infrastructure → Adaptateurs concrets (In-Memory, PostgreSQL, Haversine, Paiement simulé)
  interface/     → Routes Express, Middleware erreurs
apps/
  api-express/   → Serveur Express (framework 1)
```

## Règle de dépendance

```
interface → application → domain   ✅
infrastructure → application       ✅
Jamais de dépendance vers l'extérieur depuis le domain ✅
```

---

## Démarrage rapide

```bash
# Installer les dépendances
npm install

# Lancer avec l'adaptateur In-Memory (défaut)
npm run start:express

# Lancer avec PostgreSQL
DB_ADAPTER=postgresql DATABASE_URL="postgresql://..." npm run start:express

# Tests
npm test
```

L'API démarre sur **http://localhost:3000**

---

## Endpoints API

### Client
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/restaurants` | Lister les restaurants |
| GET | `/api/restaurants/:id/menu` | Voir le menu d'un restaurant |
| POST | `/api/panier/articles` | Ajouter un plat au panier |
| DELETE | `/api/panier/:clientId` | Vider le panier |
| POST | `/api/commandes` | Passer la commande |
| POST | `/api/commandes/:id/payer` | Payer + obtenir la facture |

### Restaurateur
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/restaurant/:id/plats` | Ajouter un plat |
| PATCH | `/api/plats/:id` | Modifier un plat |
| DELETE | `/api/plats/:id` | Supprimer un plat |
| POST | `/api/commandes/:id/accepter` | Accepter une commande |
| POST | `/api/commandes/:id/refuser` | Refuser une commande |
| POST | `/api/commandes/:id/prete` | Marquer prête pour collecte |

### Livreur
| Méthode | Route | Description |
|---------|-------|-------------|
| PATCH | `/api/livreurs/:id/statut` | Se déclarer disponible/indisponible |
| POST | `/api/commandes/:id/attribuer-livreur` | Attribuer le livreur le plus proche |
| POST | `/api/commandes/:id/livree` | Terminer la livraison |

---

## Règles métier implémentées

- ✅ **Panier 1 restaurant** : `PanierConflitRestaurantError` si on ajoute un plat d'un autre restaurant
- ✅ **Stock journalier** : `PlatEnRuptureError` si stock = 0
- ✅ **Prix** : plats + frais livraison (0.50€/km Haversine) + 10% frais service
- ✅ **Livreur le plus proche** : algorithme de sélection par distance Haversine
- ✅ **Rémunération livreur** : 2€ prise en charge + 1€/km + pourboire intégral (0% commission)
- ✅ **Workflow commande** : machine à états (EN_ATTENTE → PAYEE → ACCEPTEE → EN_PREPARATION → PRETE → EN_LIVRAISON → LIVREE)

## Démonstration Plug & Play

```bash
# Démarrer In-Memory
npm run start:express
# Tester : curl http://localhost:3000/health → "adapter": "in-memory"

# Redémarrer PostgreSQL
DB_ADAPTER=postgresql npm run start:express  
# Tester : curl http://localhost:3000/health → "adapter": "postgresql"
# Même comportement, zéro changement dans le Domain ou l'Application
```
