# Astral Letters

Application full-stack de lectures astrologiques personnalisées, avec calcul réel du thème natal via `pyswisseph`, capture de leads, offres Stripe, emails, génération PDF et dashboard admin.

## Architecture

```
.
├── apps
│   ├── astro-service          # Microservice FastAPI (calcul astral réel)
│   │   ├── app/main.py
│   │   └── requirements.txt
│   └── web                    # Application Next.js (frontend + API)
│       ├── app
│       │   ├── (marketing)
│       │   ├── admin           # Dashboard admin
│       │   ├── merci           # Confirmation / reprise paiement
│       │   ├── resultat        # Redirect legacy
│       │   ├── resultat/[id]   # Page résultat dynamique + paywall
│       │   ├── tarifs          # Page offres
│       │   ├── api
│       │   │   ├── admin/regenerate-pdf
│       │   │   ├── astro
│       │   │   ├── checkout
│       │   │   ├── intake
│       │   │   └── webhooks/stripe
│       │   ├── globals.css
│       │   ├── layout.tsx
│       │   └── page.tsx        # Landing page
│       ├── components
│       │   ├── emails          # Templates emails (React Email)
│       │   ├── forms           # Formulaire de capture
│       │   ├── marketing       # Composants marketing
│       │   ├── pdf             # Templates PDF
│       │   └── ui              # Design system (Button, Card, Badge, Input)
│       └── lib
│           ├── astro.ts        # Client vers le microservice Python
│           ├── astro-i18n.ts   # Traductions signes/planètes FR
│           ├── automation.ts   # Service d'automatisation (interfaces)
│           ├── checkout.ts     # Builder de liens checkout
│           ├── content.ts      # Moteur d'interprétation
│           ├── email.tsx       # Couche d'envoi emails
│           ├── env.ts          # Variables d'environnement validées
│           ├── pdf-generator.ts # Génération PDF via Puppeteer
│           ├── prisma.ts       # Client Prisma
│           ├── reports.ts      # Création et régénération de rapports
│           ├── schemas.ts      # Validation Zod
│           ├── storage.ts      # Stockage fichiers (local / Supabase)
│           ├── stripe.ts       # Client Stripe
│           └── stripe-sync.ts  # Synchronisation webhooks Stripe
├── prisma
│   └── schema.prisma
├── scripts
│   └── seed.ts
└── .env.example
```

## Pipeline de calcul astrologique

```
Lieu de naissance
    ↓ Nominatim (géocodage)
latitude / longitude
    ↓ timezonefinder
fuseau horaire
    ↓ conversion
datetime UTC
    ↓ pyswisseph / Swiss Ephemeris
thème natal complet
    ↓ moteur d'interprétation
lecture personnalisée
    ↓ templates
email + PDF
```

**Important** : Les calculs utilisateur sont toujours réels. L'interprétation est générée côté serveur à partir des données astrales calculées.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page premium avec formulaire de capture |
| `/resultat/[id]` | Page résultat personnalisée + paywall |
| `/tarifs` | Page offres détaillée |
| `/merci` | Confirmation / reprise paiement |
| `/admin` | Dashboard admin |

## API

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/intake` | POST | Capture lead + calcul astro + PDF teaser + emails |
| `/api/astro` | POST | Proxy vers le microservice Python |
| `/api/checkout` | GET | Création de session Stripe Checkout |
| `/api/webhooks/stripe` | POST | Webhook Stripe |
| `/api/admin/regenerate-pdf` | POST | Régénération PDF depuis l'admin |

## Base de données

Schéma Prisma avec les tables suivantes :

- `users` — utilisateurs avec rôle, timezone
- `leads` — captures email avec source et consentement
- `birth_profiles` — données de naissance géocodées
- `natal_charts` — thème natal calculé (JSON complet)
- `offers` — plans d'abonnement et offres one-shot
- `subscriptions` — abonnements avec synchronisation Stripe
- `generated_reports` — rapports/lectures générés
- `newsletter_logs` — historique des emails envoyés
- `payments` — paiements Stripe
- `audit_logs` — journal d'audit

## Installation

### 1. Variables d'environnement

```bash
cp .env.example .env
```

Variables principales :

| Variable | Obligatoire | Description |
|----------|:-----------:|-------------|
| `DATABASE_URL` | Non* | PostgreSQL (fonctionne sans en mode local) |
| `ASTRO_SERVICE_URL` | Oui | URL du microservice Python |
| `NEXT_PUBLIC_APP_URL` | Oui | URL du frontend |
| `RESEND_API_KEY` | Non | Clé Resend (emails en mode console sinon) |
| `STRIPE_SECRET_KEY` | Non | Clé Stripe (checkout désactivé sinon) |
| `STRIPE_WEBHOOK_SECRET` | Non | Secret webhook Stripe |
| `STRIPE_PRICE_*` | Non | Price IDs Stripe pour chaque offre |
| `SUPABASE_URL` | Non | URL Supabase (stockage local sinon) |

*Sans `DATABASE_URL`, l'application fonctionne avec un stockage JSON local dans `.data/`.

### 2. Frontend Next.js

```bash
npm install
npm run db:generate    # Générer le client Prisma
npm run dev            # Lancer en développement
```

### 3. Base de données (optionnel)

```bash
# Avec PostgreSQL local ou Supabase
npm run db:migrate     # Appliquer les migrations
npm run db:seed        # Données de démonstration
```

### 4. Microservice Python

```bash
cd apps/astro-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Moteur astrologique

Le microservice Python calcule :

- **Géocodage** : lieu → coordonnées GPS (Nominatim)
- **Fuseau horaire** : coordonnées → timezone (timezonefinder)
- **Conversion UTC** : datetime local → UTC
- **Positions planétaires** : Soleil, Lune, Mercure, Vénus, Mars, Jupiter, Saturne, Uranus, Neptune, Pluton (pyswisseph)
- **Maisons** : système Placidus, 12 maisons
- **Ascendant & Milieu du ciel** : calculés depuis les maisons
- **Aspects** : conjonction, sextile, carré, trigone, opposition (orbe ≤ 6°)
- **Transits** : positions planétaires du moment

Si l'heure de naissance est absente : fallback à 12:00 avec flag `is_approximate_time = true`.

## Interprétation

Le moteur d'interprétation (`lib/content.ts`) transforme les données astrales en contenu lisible :

| Variant | Contenu |
|---------|---------|
| `free` | Aperçu gratuit (intro, énergie, 2 conseils) |
| `weekly` | Update hebdomadaire (intro courte, 2 jours clés) |
| `monthly` | Lecture mensuelle complète |
| `premium-pdf` | PDF premium (tout + conseils étendus) |

Sections : introduction personnalisée, énergie générale, amour, travail/argent, énergie/bien-être, jours clés, conseils concrets, conclusion.

**Important** : la base est réelle (calculs), l'interprétation est générée côté serveur.

## PDF

Deux templates HTML/CSS premium :

1. **PDF teaser gratuit** — couverture, trio S/L/A, aperçu du mois, CTA upgrade
2. **PDF premium complet** — couverture, profil astral, lecture du mois, amour, travail, énergie, jours clés, conseils, conclusion

Pipeline : HTML → Puppeteer → PDF A4 → stockage local ou Supabase Storage.

## Emails

Templates React Email inclus :

- Bienvenue
- Livraison PDF gratuit
- Conversion (gratuit → payant)
- Newsletter mensuelle
- Update hebdomadaire
- Relance panier

Couche d'abstraction (`lib/automation.ts`) avec providers :
- **Resend** (actif si `RESEND_API_KEY` configuré)
- **Brevo** (stub prêt à implémenter)
- **Console** (mode développement)

## Stripe

Offres configurées :

| Slug | Nom | Prix | Type |
|------|-----|------|------|
| `essentiel` | Essentiel | 7€/mois | Abonnement |
| `plus` | Plus | 12€/mois | Abonnement |
| `premium` | Premium | 19€/mois | Abonnement |
| `rapport-natal` | Rapport natal premium | 29€ | One-shot |

Pour brancher Stripe :

1. Créer les produits et prix dans le dashboard Stripe
2. Renseigner les `STRIPE_PRICE_*` dans `.env`
3. Configurer le webhook vers `/api/webhooks/stripe`
4. Renseigner `STRIPE_WEBHOOK_SECRET`

## Automatisation future

L'architecture est prête pour :

- **Génération mensuelle automatique** : lecture + PDF + email pour chaque abonné
- **Génération hebdomadaire** : update léger + email
- **Brevo** : remplacer Resend via l'abstraction provider
- **Queue de tâches** : BullMQ ou Inngest pour déporter les jobs longs

Les interfaces sont définies dans `lib/automation.ts`.

## Design

Palette :
- Fond principal : `#FAF8F6`
- Surface : `#FFFFFF`
- Texte principal : `#0F0F0F`
- Accent profond (prune) : `#3A1F3D` — CTA, éléments importants
- Accent secondaire (or) : `#C8A96A` — badges, icônes
- Bordures : `#EAE3DC`

## Limites connues

- **Nominatim** : pas fait pour du fort trafic sans instance dédiée
- **Resend free tier** : volume d'envoi limité
- **Puppeteer** : nécessite Chrome headless (peut poser problème sur certains hébergeurs)
- **PDF** : suffisant pour le MVP, évoluable vers Playwright ou Browserless
- **Webhooks Stripe** : traitement synchrone, à déporter sur une queue en production

## Stack

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS v4 |
| UI | shadcn/ui, Framer Motion, Lucide Icons |
| Backend API | Next.js API Routes |
| Calcul astral | FastAPI, pyswisseph, timezonefinder |
| Base de données | PostgreSQL (Prisma ORM) |
| Emails | React Email, Resend |
| PDF | HTML/CSS → Puppeteer |
| Paiement | Stripe |
| Stockage | Local / Supabase Storage |

# Vercel Trigger: Monorepo Root Directory Update
