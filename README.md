# Senior Zen – Librairie d’ebooks digitaux

Application Next.js 14 (App Router) + TypeScript + TailwindCSS pour la librairie "Senior Zen". L’objectif est de vendre des ebooks individuels, des bundles et un abonnement mensuel tout en offrant un espace bibliothèque sécurisé et une administration légère.

## Stack principale

- [Next.js 14](https://nextjs.org/) avec App Router et rendu côté serveur.
- TypeScript strict + ESLint.
- [TailwindCSS](https://tailwindcss.com/) pour le design, mode sombre intégré.
- [Prisma](https://www.prisma.io/) + PostgreSQL (Neon conseillé).
- [NextAuth.js](https://next-auth.js.org/) pour l’authentification (email + mot de passe ou magic link via Resend).
- [Stripe](https://stripe.com/) pour les paiements (produits unitaires, bundles, abonnement).
- [Resend](https://resend.com/) pour l’envoi des emails transactionnels.
- Stockage des PDF sur S3/R2 (liens présignés et filigrane côté serveur).

## Démarrage local

```bash
npm install
npm run dev
```

> L’installation nécessite Node.js 18+. Par défaut l’application écoute sur `http://localhost:3000`.

### Variables d’environnement

Copier `.env.example` vers `.env.local` puis compléter :

- `DATABASE_URL` : URL Postgres (Neon conseillé).
- `NEXTAUTH_SECRET` : chaîne aléatoire (openssl rand -base64 32).
- `STRIPE_SECRET_KEY` : clé secrète.
- `STRIPE_WEBHOOK_SECRET` : secret du webhook (Stripe CLI ou Dashboard).
- `STRIPE_MONTHLY_PRICE_ID` : ID du prix abonnement.
- `NEXT_PUBLIC_APP_URL` : URL publique (http://localhost:3000 en dev).
- `RESEND_KEY` : clé API Resend.
- `S3_*` : configuration du bucket S3 ou R2.
- `DOWNLOAD_SIGNING_SECRET` : clé utilisée pour signer les liens de téléchargement.

## Base de données & Prisma

1. Initialiser la base :
   ```bash
   npx prisma migrate dev
   ```
2. Seed du catalogue (12 ebooks, 2 bundles, coupons, billets de blog) :
   ```bash
   npm run seed
   ```
3. Le schéma couvre `User`, `Product`, `Order`, `OrderItem`, `Entitlement`, `Post`, `Coupon`, `Subscription` + tables NextAuth.

## Stripe

1. Créer les produits (ebooks, bundles) dans Stripe ou utiliser les prix générés via le checkout dynamique.
2. Créer un prix récurrent pour le Club Senior Zen (mensuel) et renseigner `STRIPE_MONTHLY_PRICE_ID`.
3. Configurer un webhook Stripe vers `https://votre-domaine/api/webhooks/stripe` (événements `checkout.session.completed`, `invoice.payment_succeeded`).
4. Les coupons peuvent être créés via l’admin (`/admin`) ou importés du seed.
5. Pour les tests locaux :
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

## Resend

- Vérifier un domaine et créer l’expéditeur `bonjour@seniorzen.fr`.
- Les emails envoyés :
  - Confirmation d’achat (lien vers `/library`).
  - Bienvenue abonnement (après `invoice.payment_succeeded`).
  - Emails NextAuth (magic link).

## Stockage S3 / R2

- Les PDF sont stockés sous `ebooks/<slug>.pdf`.
- `src/lib/s3.ts` fournit des helpers pour les uploads (admin) et les liens présignés.
- Les téléchargements passent par `/api/signed-download` qui génère une URL signée et journalise IP / User Agent.

## Authentification

- NextAuth Credentials (email + mot de passe hashé bcrypt) et provider email (magic link via Resend).
- Middleware protège `/account`, `/library`, `/admin`.
- La page `/library` illustre l’accès aux ebooks achetés.

## Administration

- `/admin` :
  - Création / édition produit (`POST /api/admin/products`).
  - Import CSV (à brancher sur `/api/admin/uploads`).
  - Génération de coupons (`POST /api/admin/coupons`).
  - Upload S3 (presigned URLs).
- Accès à protéger par rôle (à implémenter via NextAuth session).

## Tests & qualité

- Tests Vitest : `npm run test` (ex : signature des URLs de téléchargement).
- Lint : `npm run lint`.
- Build : `npm run build`.

## Déploiement

### Vercel

1. Créer un projet Vercel, connecter le dépôt.
2. Définir les variables d’environnement (Stripe, Resend, S3, DB).
3. Activer le webhook Stripe vers l’URL Vercel.

### Docker / Render

`Dockerfile` fourni pour exécuter Next.js en mode production :

```bash
docker build -t senior-zen .
docker run -p 3000:3000 --env-file .env.production senior-zen
```

### Base de données

- Neon ou Supabase pour Postgres managé.
- Exécuter les migrations via `npm run prisma:migrate` au démarrage.

## Contenu

- 12 ebooks seedés (fiches complètes : sommaire, bullets, images, avis).
- 2 bundles, 1 offre d’abonnement.
- Blog en MDX (`src/content/blog`).
- Pages SEO : sitemap, robots, meta OG + JSON-LD (Product & Article).
- Page Accessibilité, FAQ, Contact, Légal.

## Structure des dossiers

```
src/
  app/              # pages et API routes (App Router)
  components/       # UI (cards, header, footer, etc.)
  content/blog      # articles MDX
  lib/              # Prisma, Stripe, auth, emails, utils
  types/            # extensions NextAuth
prisma/             # schema + seed
public/             # assets (covers, PDFs)
```

## Anti-partage & sécurité

- Liens de téléchargement signés (`src/lib/downloads.ts`).
- Limitation du nombre de téléchargements (à persister en DB via `Entitlement`).
- Possibilité de filigraner les PDF via une lambda (à intégrer via S3 + fonction serverless).
- Webhooks Stripe => création des droits d’accès (Entitlements) + emails de confirmation.

## Roadmap / bonus

- Ajouter un module d’avis avec modération (table `Review`).
- Programme d’affiliation via coupons paramétrables (`?ref=`).
- Génération automatique de facture PDF (Stripe Billing + API).
