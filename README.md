# TikTok Live Gift Tracker & Jackpot System

Ce dépôt décrit une architecture de référence pour construire une application capable de :

- se connecter en temps réel à un live TikTok,
- comptabiliser les cadeaux reçus (type, valeur, quantité et utilisateur),
- afficher un tableau de bord dynamique,
- appliquer des règles personnalisables pour un tirage au sort automatique,
- annoncer le gagnant du jackpot avec des animations,
- exporter les résultats en fin de session.

Le projet est organisé comme un **blueprint** : il fournit les spécifications techniques, les modèles de données, les flux temps réel et des exemples de code que vous pouvez adapter à votre propre environnement.

## Sommaire

1. [Architecture globale](#architecture-globale)
2. [Fonctionnalités clés](#fonctionnalités-clés)
3. [Composants techniques](#composants-techniques)
4. [Modèle de données](#modèle-de-données)
5. [Flux temps réel](#flux-temps-réel)
6. [Règles du tirage et jackpot](#règles-du-tirage-et-jackpot)
7. [Tableau de bord & UI](#tableau-de-bord--ui)
8. [Export et reporting](#export-et-reporting)
9. [Sécurité et conformité](#sécurité-et-conformité)
10. [Plan de déploiement](#plan-de-déploiement)
11. [Prochaines étapes](#prochaines-étapes)

## Architecture globale

```
┌───────────────────────────────────┐
│         TikTok Live Stream        │
│ (API officielle ou TikTok Live JS)│
└───────────────────────────────────┘
                 │
         WebSocket / SSE
                 │
┌───────────────────────────────────┐
│       Ingestion temps réel        │◄───────── Authentification (OAuth)
│  (Node.js + TikTok Live Connector)│
└───────────────────────────────────┘
                 │ événements normalisés
┌───────────────────────────────────┐
│       Event Bus / Stream          │  (Kafka / Redis Streams / RabbitMQ)
└───────────────────────────────────┘
                 │
┌───────────────────────────────────┐          ┌─────────────────────────┐
│ Service Comptage & Jackpot        │◄────────►│ Base de données (Postgres│
│  - agrégation des cadeaux         │          │ + Redis pour cache)     │
│  - application des règles         │          └─────────────────────────┘
└───────────────────────────────────┘
                 │
         API GraphQL/REST
                 │
┌───────────────────────────────────┐
│   Tableau de bord temps réel      │ (React / Next.js)
└───────────────────────────────────┘
```

## Fonctionnalités clés

| Domaine | Description |
| --- | --- |
| Connexion au live | Authentification sécurisée avec le compte TikTok créateur et souscription aux événements cadeaux. |
| Comptabilisation | Normalisation des cadeaux (type, quantité, valeur monétaire), agrégation par utilisateur et cumul global. |
| Tableau de bord | Graphiques en temps réel, top donateurs, progression vers des paliers personnalisés. |
| Paramétrage | Définition de la durée de session, seuils de participation, poids des cadeaux, règles de tirage. |
| Tirage & Jackpot | Sélection automatique du gagnant selon les règles définies, animation visuelle, notifications. |
| Export | Génération de CSV/Excel avec historique de session, journaux de tirage, preuve de transparence. |

## Composants techniques

### Backend (Node.js + TypeScript)

- **Framework** : NestJS ou Express + Socket.IO pour la simplicité.
- **TikTok Live Connector** : utilisation de [`tiktok-live-connector`](https://www.npmjs.com/package/tiktok-live-connector) ou API officielle si accessible.
- **Base de données** : PostgreSQL pour la persistance des sessions, Redis pour la file temps réel et le cache.
- **Message Broker** : Redis Streams, Kafka ou RabbitMQ pour découpler ingestion et traitement.
- **API** : REST ou GraphQL (Apollo Server) exposant les statistiques et actions (démarrer/stopper session, lancer tirage).
- **Authentification** : OAuth 2.0 avec TikTok. Stockage sécurisé des tokens (HashiCorp Vault, AWS Secrets Manager ou KMS).

### Frontend (React / Next.js)

- Dashboard responsive avec charts (Recharts, ECharts) et composants UI (Chakra UI, MUI, Tailwind).
- WebSocket client pour recevoir les mises à jour temps réel via Socket.IO ou GraphQL Subscriptions.
- Configuration des règles (formulaire multi-étapes, validation avec React Hook Form + Zod).
- Animation de tirage (Canvas, Lottie, Framer Motion).

### Services auxiliaires

- **Worker** : micro-service pour le tirage (exécution en tâche planifiée ou déclenchée).
- **Exporter** : service asynchrone pour générer des rapports (ex. Node + `csv-writer`, `exceljs`).

## Modèle de données

### Tables principales

| Table | Champs clés | Description |
| --- | --- | --- |
| `sessions` | `id`, `tiktok_live_id`, `start_time`, `end_time`, `status`, `config` (JSONB) | Représente un live tracké. |
| `gifts` | `id`, `session_id`, `user_id`, `gift_type`, `quantity`, `value`, `timestamp` | Événements cadeaux individuels. |
| `users` | `id`, `tiktok_user_id`, `display_name`, `avatar_url`, `created_at` | Donateurs identifiés. |
| `entries` | `id`, `session_id`, `user_id`, `weight`, `gift_id`, `created_at` | Tickets de participation pour le tirage. |
| `draws` | `id`, `session_id`, `winner_user_id`, `rule_snapshot`, `performed_at` | Historique des tirages effectués. |
| `exports` | `id`, `session_id`, `status`, `file_path`, `generated_at` | Rapports générés. |

### Modèle Redis (optionnel)

- `session:{id}:stats` : cumul des cadeaux, total entrées, top 10 donateurs.
- `session:{id}:events` : stream temps réel pour le frontend.
- `session:{id}:entries` : Sorted Set pour pondérer les chances de tirage.

## Flux temps réel

1. **Connexion** : l’opérateur démarre une session depuis le dashboard. Le backend initialise la connexion TikTok et stocke le token d’accès.
2. **Ingestion** : chaque cadeau est reçu via WebSocket, transformé en événement standardisé, puis poussé dans le broker.
3. **Traitement** : le service de comptage met à jour PostgreSQL/Redis, calcule les statistiques et génère les entrées de tirage selon les règles.
4. **Diffusion** : le frontend reçoit les mises à jour via WebSocket/SSE (ex. `session:update`, `gift:received`, `draw:pending`).
5. **Tirage** : lorsque les conditions sont réunies (timer, seuil de cadeaux, palier atteint), le service de tirage sélectionne un gagnant et diffuse l’événement `draw:winner`.

## Règles du tirage et jackpot

Les règles peuvent être modélisées sous forme de configuration JSON stockée dans `sessions.config`. Exemple :

```json
{
  "entryRules": [
    { "giftType": "Lion", "weight": 50 },
    { "giftType": "Rose", "weight": 1 },
    { "minValue": 1000, "bonusWeight": 25 }
  ],
  "drawTrigger": {
    "type": "timer",
    "intervalMinutes": 15
  },
  "jackpot": {
    "accumulation": true,
    "resetOnWin": false,
    "display": {
      "theme": "neon",
      "sound": "jackpot.mp3"
    }
  }
}
```

Le service de tirage doit :

1. Calculer les tickets de participation selon les règles (poids par type de cadeau ou valeur monétaire).
2. Utiliser un générateur pseudo-aléatoire sécurisé (`crypto.randomInt` ou service externe type AWS KMS) pour garantir l’équité.
3. Sauvegarder un snapshot des règles et du tirage (`rule_snapshot`) pour audit.
4. Diffuser le résultat au frontend avec les métadonnées (gagnant, cadeau déclencheur, total jackpot).

## Tableau de bord & UI

### Écrans principaux

1. **Vue Session** :
   - Statistiques globales (totaux, progression vers objectif).
   - Flux d’événements en direct (listes des derniers cadeaux).
   - Top contributeurs + pourcentage de chances de gagner.
2. **Configuration** :
   - Formulaire pour définir la durée, les seuils, les règles de pondération.
   - Activation/désactivation du jackpot, choix des effets visuels.
3. **Tirage** :
   - Animation d’attente, roue ou tirage aléatoire.
   - Historique des gagnants précédents.
4. **Rapports** :
   - Liste des exports générés, liens de téléchargement, horodatage.

### Stack recommandée

- Next.js 14 (App Router) avec SSR pour la page principale.
- Tailwind CSS + Framer Motion pour les animations.
- Charting : `@nivo/line` ou `recharts`.
- Authentification opérateur : NextAuth.js avec providers (Google, email) + RBAC.

## Export et reporting

- Génération de CSV/Excel via une file (BullMQ ou Temporal) afin de ne pas bloquer le traitement temps réel.
- Colonnes recommandées : `timestamp`, `user`, `gift_type`, `quantity`, `value`, `session_id`, `jackpot_total`, `winner`.
- Possibilité d’exporter les logs du tirage (pour preuve d’équité) avec hash SHA-256 des entrées.

## Sécurité et conformité

- Stockage chiffré des tokens et des données sensibles (AES-256, TLS).
- Audit des accès : journalisation des actions opérateur (connexion, démarrage de session, tirage manuel).
- Conformité RGPD : durée de conservation limitée, anonymisation sur demande, politique de consentement.
- Monitoring : métriques Prometheus + Grafana, alertes sur erreurs d’ingestion ou déconnexions.

## Plan de déploiement

1. **Développement local** : Docker Compose avec services (Postgres, Redis, backend, frontend).
2. **CI/CD** : GitHub Actions pour lint/test/build, déploiement sur conteneurs.
3. **Production** : Kubernetes (GKE/AKS/EKS) ou services managés (Render, Railway). Utiliser des secrets manager et un certificat TLS.
4. **Observabilité** : intégrer OpenTelemetry pour tracer ingestion → tirage, centraliser les logs (ELK, Datadog).

## Prochaines étapes

1. Initialiser le monorepo (Turborepo) avec packages `apps/backend`, `apps/frontend`, `packages/shared`.
2. Implémenter le connecteur TikTok Live et les schémas d’événements TypeScript.
3. Configurer la base de données et migrations (Prisma ou TypeORM).
4. Créer le dashboard Next.js avec authentification opérateur.
5. Mettre en place le moteur de tirage (service worker + tests unitaires de pondération).
6. Automatiser les exports et intégrer un stockage (S3, GCS) pour les fichiers générés.
7. Couvrir le projet par des tests (unitaires, end-to-end avec Playwright) et du monitoring.

Pour toute question ou besoin d’assistance supplémentaire, n’hésitez pas à ouvrir une issue ou à contacter le mainteneur.
