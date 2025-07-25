# 📡 SABS - San Andreas Broadcast Service

Une plateforme de diffusion en temps réel avec dashboard sécurisé pour la gestion des flux RTMP et la surveillance système.

## 🚀 Démarrage rapide

### Prérequis
- Node.js 24+
- npm/yarn/pnpm

### Installation

```bash
# Clone du repository
git clone https://github.com/Wiibleyde/sabs.git
cd sabs

# Installation des dépendances
npm install

# Configuration des variables d'environnement
cp .env.example .env.local
# Modifiez .env.local avec vos valeurs

# Démarrage du serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) pour voir l'application.

## 🔐 Authentification

Le projet inclut un système d'authentification complet basé sur des codes PIN et des tokens JWT.

### Accès rapide
- **Dashboard** : [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **PIN par défaut** : `1234` (configurable dans `.env.local`)

### Documentation complète
📖 **[Guide d'authentification complet](./docs/AUTHENTICATION.md)**
📚 **[Exemples d'utilisation](./docs/EXAMPLES.md)**
🔄 **[Guide de migration](./docs/MIGRATION.md)**

### Utilisation basique

```tsx
import { AuthProvider } from '@/contexts/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

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
├── app/                    # Pages Next.js (App Router)
│   ├── dashboard/         # Dashboard sécurisé
│   └── api/v1/auth/       # API d'authentification
├── components/
│   ├── auth/              # Composants d'authentification
│   └── dasboard/          # Composants du dashboard
├── hooks/                 # Hooks React personnalisés
├── contexts/              # Contextes React
└── lib/                   # Utilitaires
```

## ⚙️ Configuration

### Variables d'environnement

```env
# Authentification
DASHBOARD_PIN=2587
JWT_SECRET=votre-cle-secrete-jwt

# Discord (notifications)
SABS_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# MediaMTX (streaming)
MEDIAMTX_URL=https://rtmp-api.example.com
MEDIAMTX_USERNAME=admin
MEDIAMTX_PASSWORD=motdepasse
```

## 🎯 Fonctionnalités

- ✅ **Interface moderne** avec animations fluides
- ✅ **Authentification sécurisée** par code PIN
- ✅ **Dashboard temps réel** pour la surveillance RTMP
- ✅ **Système de notifications** Discord
- ✅ **API REST** sécurisée
- ✅ **Design responsive** adaptatif
- ✅ **Architecture modulaire** réutilisable

## 🛡️ Sécurité

- 🔒 **Tokens JWT** avec expiration automatique
- 🔒 **Cookies HttpOnly** sécurisés
- 🔒 **Validation côté serveur** stricte
- 🔒 **Protection CSRF** intégrée

## 📱 Pages disponibles

- **[Accueil](http://localhost:3000)** - Page d'accueil SABS
- **[Dashboard](http://localhost:3000/dashboard)** - Tableau de bord sécurisé
- **[Mentions légales](http://localhost:3000/legal-mentions)** - Informations légales

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev

# Production
npm run build
npm run start

# Linting
npm run lint

# Type checking
npm run type-check
```

## 📖 Documentation

- 📋 **[Guide d'authentification](./docs/AUTHENTICATION.md)** - Documentation complète du système d'auth
- 🔗 **[API Reference](./docs/API.md)** - Documentation des endpoints (à venir)
- 🎨 **[Guide de style](./docs/STYLING.md)** - Conventions CSS et design (à venir)


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
