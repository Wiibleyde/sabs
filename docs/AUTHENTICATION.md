# 🔐 Système d'Authentification SABS

Un système d'authentification robuste et réutilisable basé sur des codes PIN et des tokens JWT pour les applications Next.js.

## 📋 Table des matières

- [🚀 Installation et Configuration](#-installation-et-configuration)
- [🏗️ Architecture](#️-architecture)
- [📖 Guide d'utilisation](#-guide-dutilisation)
- [🔧 API Reference](#-api-reference)
- [🎨 Personnalisation](#-personnalisation)
- [🛡️ Sécurité](#️-sécurité)
- [🔍 Dépannage](#-dépannage)

## 🚀 Installation et Configuration

### 1. Variables d'environnement

Créez un fichier `.env.local` avec :

```env
# Code PIN pour l'authentification (changez en production)
DASHBOARD_PIN=2444

# Clé secrète pour les tokens JWT (générez une clé complexe en production)
JWT_SECRET=votre-cle-secrete-jwt-complexe
```

### 2. Dépendances requises

```bash
npm install jsonwebtoken @types/jsonwebtoken
```

## 🏗️ Architecture

Le système d'authentification est composé de plusieurs modules :

```
src/
├── hooks/
│   ├── useAuthSimple.ts      # Hook principal d'authentification
│   └── useLogout.ts          # Hook pour la déconnexion
├── contexts/
│   └── AuthProvider.tsx      # Contexte React pour partager l'état
├── components/auth/
│   ├── AuthGuard.tsx         # Interface d'authentification
│   └── ProtectedRoute.tsx    # Composant de protection de routes
└── app/api/v1/auth/
    ├── pin/route.ts          # API d'authentification
    └── logout/route.ts       # API de déconnexion
```

## 📖 Guide d'utilisation

### Utilisation basique

La façon la plus simple de protéger une page :

```tsx
'use client';

import { AuthProvider } from '@/contexts/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function MaPageProtegee() {
    return (
        <AuthProvider>
            <ProtectedRoute>
                <div>
                    <h1>Contenu protégé</h1>
                    <p>Seuls les utilisateurs authentifiés peuvent voir ceci.</p>
                </div>
            </ProtectedRoute>
        </AuthProvider>
    );
}
```

### Utilisation avec personnalisation

```tsx
'use client';

import { AuthProvider } from '@/contexts/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function AdminPage() {
    return (
        <AuthProvider>
            <ProtectedRoute
                fallbackTitle="Administration SABS"
                fallbackSubtitle="Accès administrateur - Entrez votre code PIN"
                showLoader={true}
            >
                <div className="admin-dashboard">
                    {/* Votre contenu admin */}
                </div>
            </ProtectedRoute>
        </AuthProvider>
    );
}
```

### Utilisation des hooks dans les composants

```tsx
'use client';

import { useAuth } from '@/contexts/AuthProvider';
import { useLogout } from '@/hooks/useLogout';

function MonComposant() {
    const { isAuthenticated, isLoading, login } = useAuth();
    const { logoutWithConfirm } = useLogout();

    const handleManualLogin = async () => {
        const result = await login('2444');
        if (result.success) {
            console.log('Connexion réussie !');
        }
    };

    return (
        <div>
            <p>Statut : {isAuthenticated ? 'Connecté' : 'Déconnecté'}</p>
            <button onClick={logoutWithConfirm}>
                Se déconnecter
            </button>
        </div>
    );
}
```

## 🔧 API Reference

### Hook `useAuth()`

```tsx
const {
    isAuthenticated,      // boolean - État de connexion
    isLoading,           // boolean - Chargement en cours
    error,               // string | null - Message d'erreur
    login,               // Function - Connexion avec PIN
    logout,              // Function - Déconnexion
    checkAuthentication  // Function - Vérification manuelle
} = useAuth();
```

### Hook `useLogout(options)`

```tsx
const { logoutWithConfirm, logoutSilent } = useLogout({
    confirmMessage: 'Voulez-vous vous déconnecter ?',
    redirectAfter: true,
    redirectUrl: '/dashboard',
    redirectDelay: 300
});
```

### Composant `ProtectedRoute`

```tsx
<ProtectedRoute
    fallbackTitle="Titre personnalisé"           // Titre de l'écran de connexion
    fallbackSubtitle="Sous-titre personnalisé"   // Sous-titre
    className="ma-classe-css"                     // Classes CSS additionnelles
    showLoader={true}                             // Afficher l'écran de chargement
>
    {children}
</ProtectedRoute>
```

### API Routes

#### POST `/api/v1/auth/pin`
```json
// Request
{
    "pin": "2444"
}

// Response (succès)
{
    "success": true,
    "message": "PIN valide",
    "authenticated": true
}

// Response (erreur)
{
    "error": "PIN incorrect"
}
```

#### GET `/api/v1/auth/pin`
```json
// Response
{
    "authenticated": true
}
```

#### POST `/api/v1/auth/logout`
```json
// Response
{
    "success": true,
    "message": "Déconnexion réussie"
}
```

## 🎨 Personnalisation

### Styles personnalisés

Le composant `AuthGuard` accepte des classes CSS personnalisées :

```tsx
<ProtectedRoute
    className="mon-theme-sombre"
    fallbackTitle="Mon App"
>
    {children}
</ProtectedRoute>
```

### Interface d'authentification personnalisée

Vous pouvez utiliser directement le composant `AuthGuard` :

```tsx
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/contexts/AuthProvider';

function MonAuthCustom() {
    const { login } = useAuth();
    
    return (
        <AuthGuard
            onLogin={login}
            title="Mon Application"
            subtitle="Saisissez votre code d'accès"
            className="bg-blue-900"
        />
    );
}
```

### Modification du PIN

1. Changez la variable `DASHBOARD_PIN` dans votre `.env.local`
2. Redémarrez votre serveur de développement

### Durée de session personnalisée

Modifiez le fichier `src/app/api/v1/auth/pin/route.ts` :

```tsx
// Changez la durée d'expiration
return sign(payload, JWT_SECRET, { expiresIn: '12h' }); // 12 heures au lieu de 24h
```

## 🛡️ Sécurité

### Bonnes pratiques implementées

- ✅ **Tokens JWT signés** cryptographiquement
- ✅ **Cookies HttpOnly** (non accessibles en JavaScript)
- ✅ **SameSite strict** pour prévenir les attaques CSRF
- ✅ **Validation côté serveur** de tous les tokens
- ✅ **Expiration automatique** des sessions
- ✅ **Nettoyage automatique** des cookies invalides

### Recommandations pour la production

1. **Utilisez une clé JWT complexe** :
```env
JWT_SECRET=une-cle-tres-longue-et-complexe-avec-des-caracteres-speciaux-123456789
```

2. **Changez le PIN par défaut** :
```env
DASHBOARD_PIN=votre-pin-securise
```

3. **Activez HTTPS** en production

4. **Configurez des en-têtes de sécurité** dans `next.config.ts`

### Audit de sécurité

Le système a été conçu selon les standards de sécurité :
- 🔒 Pas de stockage de mots de passe en plain text
- 🔒 Tokens avec expiration forcée
- 🔒 Validation stricte côté serveur
- 🔒 Protection contre les attaques par force brute (rate limiting recommandé)

## 🔍 Dépannage

### Problèmes courants

#### "useAuth must be used within an AuthProvider"
```tsx
// ❌ Incorrect
function MonComposant() {
    const { isAuthenticated } = useAuth(); // Erreur !
}

// ✅ Correct
<AuthProvider>
    <MonComposant />
</AuthProvider>
```

#### Session ne persiste pas
Vérifiez que :
1. Les cookies sont activés dans le navigateur
2. La variable `JWT_SECRET` est définie
3. Vous utilisez `credentials: 'include'` dans les requêtes fetch

#### PIN incorrect alors qu'il est bon
1. Vérifiez la variable `DASHBOARD_PIN` dans `.env.local`
2. Redémarrez le serveur après modification du `.env`
3. Vérifiez qu'il n'y a pas d'espaces avant/après le PIN

#### Interface ne se met pas à jour après connexion
```tsx
// Utilisez le composant ProtectedRoute au lieu de gérer manuellement les états
<ProtectedRoute>
    <MonContenu />
</ProtectedRoute>
```

### Logs de débogage

Activez les logs en ajoutant dans votre composant :

```tsx
const { isAuthenticated, isLoading } = useAuth();
console.log('Auth state:', { isAuthenticated, isLoading });
```

### Support

Pour des problèmes spécifiques :
1. Vérifiez la console du navigateur pour les erreurs
2. Vérifiez les logs du serveur Next.js
3. Testez l'API directement avec curl :

```bash
# Test de connexion
curl -X POST http://localhost:3000/api/v1/auth/pin \
  -H "Content-Type: application/json" \
  -d '{"pin":"2444"}' \
  -v

# Test de vérification
curl -X GET http://localhost:3000/api/v1/auth/pin \
  -H "Cookie: dashboard-session=TOKEN" \
  -v
```

---

## 📄 Licence

Ce système d'authentification fait partie du projet SABS et suit la même licence.

## 🤝 Contribution

Pour contribuer au système d'authentification :
1. Respectez les standards de sécurité existants
2. Ajoutez des tests pour toute nouvelle fonctionnalité
3. Documentez les changements dans ce README
