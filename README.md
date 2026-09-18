# 📡 SABS - San Andreas Broadcast Service

Site vitrine et overlays de stream pour SABS, avec un dashboard protégé par code PIN.

## 🚀 Démarrage rapide

### Prérequis

- [Bun](https://bun.sh) 1.3+ (le lockfile du projet est `bun.lock`)
- ou Node.js 22+ si vous préférez npm

### Installation

```bash
# Clone du repository
git clone https://github.com/Wiibleyde/sabs.git
cd sabs

# Installation des dépendances
bun install

# Configuration des variables d'environnement
cp .env.example .env.local
# Modifiez .env.local avec vos valeurs

# Démarrage du serveur de développement
bun run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) pour voir l'application.

## 🐳 Docker

L'application est packagée en image Docker (build Next.js `output: "standalone"`, ~380 Mo).

### Utiliser l'image publiée

Les images sont publiées sur GitHub Container Registry :

```bash
docker pull ghcr.io/wiibleyde/sabs:latest

docker run -p 3000:3000 \
  -e DASHBOARD_PIN=2025 \
  -e JWT_SECRET=une-cle-secrete-longue \
  -e SABS_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/... \
  ghcr.io/wiibleyde/sabs:latest
```

Tags disponibles :

| Tag                    | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `latest`               | Dernier build de `main`                        |
| `20260808-143022`      | Horodatage du build (`YYYYMMDD-HHmmss`, UTC)   |

Si le package GHCR est privé, authentifiez-vous d'abord :

```bash
echo $GITHUB_TOKEN | docker login ghcr.io -u <votre-user> --password-stdin
```

### Build local

```bash
docker build -t sabs:local .
docker run -p 3000:3000 -e JWT_SECRET=dev-secret sabs:local
```

Le conteneur écoute sur le port `3000` (`PORT` et `HOSTNAME` sont surchargeables) et tourne
avec l'utilisateur non-root `node`. Toutes les variables d'environnement sont lues **au
runtime** : la même image fonctionne pour tous les environnements, aucun `--build-arg` requis.

### CI/CD

Le workflow [`.github/workflows/docker-publish.yml`](.github/workflows/docker-publish.yml)
construit et publie l'image sur chaque push sur `main` (et en déclenchement manuel via
`workflow_dispatch`). Il utilise le `GITHUB_TOKEN` du repository - aucun secret à configurer.

## 🔐 Authentification

Système d'authentification par code PIN adossé à un token JWT stocké dans un cookie
`httpOnly`.

### Accès rapide

- **Dashboard** : [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **PIN par défaut** : `2025` (configurable via `DASHBOARD_PIN`)

### Utilisation basique

```tsx
import { AuthProvider } from "@/contexts/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function MaPage() {
	return (
		<AuthProvider>
			<ProtectedRoute>
				<div>Contenu protégé</div>
			</ProtectedRoute>
		</AuthProvider>
	);
}
```

## 🏗️ Structure du projet

```
src/
├── app/
│   ├── api/v1/auth/       # Login PIN + logout
│   ├── api/v1/sabs/       # Formulaire de contact (webhook Discord)
│   ├── dashboard/         # Dashboard protégé
│   ├── legal-mentions/    # Mentions légales
│   └── obs/               # Overlays OBS (starting-soon, brb, ended, loading)
├── components/
│   ├── auth/              # AuthGuard / ProtectedRoute
│   ├── dasboard/          # Modules du dashboard (typo historique conservée)
│   ├── obs/               # Scènes OBS et parsing des query params
│   ├── reactbits/         # Effets visuels (Aurora, GlitchText, …)
│   └── three/             # Rendu WebGL
├── contexts/              # AuthProvider + hook useAuth
├── data/                  # Données statiques (projets)
├── hooks/                 # Hooks personnalisés
└── lib/                   # Session JWT, fonts, médias projets
```

## ⚙️ Configuration

### Variables d'environnement

```env
# Authentification
DASHBOARD_PIN=2025
JWT_SECRET=votre-cle-secrete-jwt

# Discord (formulaire de contact)
SABS_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

`DASHBOARD_PIN` et `JWT_SECRET` ont des valeurs par défaut dans le code pour le
développement local - **définissez-les explicitement en production**.

## 🎥 Overlays OBS

Quatre scènes prêtes à être utilisées comme *browser source* dans OBS :

- `/obs/starting-soon` - écran d'attente avec compte à rebours (`?until=2026-08-08T20:00:00Z`)
- `/obs/brb` - pause
- `/obs/ended` - fin de live
- `/obs/loading` - connexion au flux

Tout le texte est personnalisable via les query params, sans redéploiement :

```
/obs/brb?title=Pause%20technique&accent=gold&projects=1
```

Params partagés : `title`, `subtitle`, `hint`, `label`, `accent` (`green|purple|red|gold`),
`bg` (`aurora|none`), `logo`, `glitch`, `projects`, `projectsLabel`.
Voir `src/components/obs/params.ts` pour la liste complète.

## 🎯 Fonctionnalités

- ✅ Site vitrine avec animations GSAP et effets WebGL
- ✅ Overlays OBS configurables par URL
- ✅ Authentification par code PIN (JWT + cookie `httpOnly`)
- ✅ Formulaire de contact relayé vers Discord
- ✅ Design responsive
- 🚧 Dashboard de supervision (SRT / RTMP / statistiques) - en construction

## 🛡️ Sécurité

- 🔒 Tokens JWT avec expiration à 24 h
- 🔒 Cookies `httpOnly`, `sameSite: strict`, `secure` en production
- 🔒 Validation du PIN côté serveur uniquement
- 🔒 Conteneur Docker exécuté en utilisateur non-root

## 📱 Pages disponibles

- **[Accueil](http://localhost:3000)** - page d'accueil SABS
- **[Dashboard](http://localhost:3000/dashboard)** - tableau de bord protégé
- **[Mentions légales](http://localhost:3000/legal-mentions)** - informations légales
- **Overlays OBS** - voir la section dédiée ci-dessus

## 🔧 Scripts disponibles

```bash
# Développement (Turbopack)
bun run dev

# Production
bun run build
bun run start

# Qualité de code (Biome)
bun run check        # lint + format, avec écriture
bun run lint
bun run lint:fix
bun run format
```

## 🚀 Déploiement

Deux options :

- **Docker / GHCR** - voir la section [🐳 Docker](#-docker) (auto-hébergement)
- **[Vercel](https://vercel.com/new?filter=next.js)** - déploiement natif Next.js

`output: "standalone"` est activé dans `next.config.ts` pour le build Docker ; cette
option est ignorée par Vercel.
