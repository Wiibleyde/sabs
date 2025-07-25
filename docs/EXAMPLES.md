# 📚 Exemples d'utilisation - Système d'authentification SABS

Cette page contient des exemples pratiques d'utilisation du système d'authentification.

## 🎯 Exemples de base

### 1. Page protégée simple

```tsx
'use client';

import { AuthProvider } from '@/contexts/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function MaPageSecurisee() {
    return (
        <AuthProvider>
            <ProtectedRoute>
                <div className="p-8">
                    <h1>Contenu sécurisé</h1>
                    <p>Seuls les utilisateurs authentifiés peuvent voir cette page.</p>
                </div>
            </ProtectedRoute>
        </AuthProvider>
    );
}
```

### 2. Page admin avec titre personnalisé

```tsx
'use client';

import { AuthProvider } from '@/contexts/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function AdminPanel() {
    return (
        <AuthProvider>
            <ProtectedRoute
                fallbackTitle="SABS Administration"
                fallbackSubtitle="Accès administrateur requis"
            >
                <div className="min-h-screen bg-gray-900 text-white p-8">
                    <h1 className="text-3xl font-bold mb-8">Panel Administrateur</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4">Utilisateurs</h2>
                            <p>Gestion des comptes utilisateurs</p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4">Logs</h2>
                            <p>Consultation des journaux système</p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4">Settings</h2>
                            <p>Configuration du système</p>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        </AuthProvider>
    );
}
```

## 🔧 Exemples avec hooks

### 3. Composant avec gestion manuelle de l'auth

```tsx
'use client';

import { useAuth } from '@/contexts/AuthProvider';
import { useLogout } from '@/hooks/useLogout';

export function UserProfile() {
    const { isAuthenticated, isLoading } = useAuth();
    const { logoutWithConfirm } = useLogout({
        confirmMessage: 'Voulez-vous vraiment vous déconnecter ?'
    });

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Profil utilisateur</h2>
            <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm ${
                    isAuthenticated 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                }`}>
                    {isAuthenticated ? 'Connecté' : 'Déconnecté'}
                </span>
                {isAuthenticated && (
                    <button
                        onClick={logoutWithConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                        Se déconnecter
                    </button>
                )}
            </div>
        </div>
    );
}
```

### 4. Formulaire de connexion personnalisé

```tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthProvider';

export function CustomLoginForm() {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const { login, isLoading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const result = await login(pin);
        if (!result.success) {
            setError(result.error || 'Erreur de connexion');
            setPin('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
            
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Code PIN</label>
                <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••"
                    maxLength={4}
                    disabled={isLoading}
                />
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={pin.length !== 4 || isLoading}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
        </form>
    );
}
```

## 🎨 Exemples de personnalisation

### 5. Thème sombre personnalisé

```tsx
'use client';

import { AuthProvider } from '@/contexts/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function DarkThemedPage() {
    return (
        <AuthProvider>
            <ProtectedRoute
                fallbackTitle="Mode Sombre"
                fallbackSubtitle="Authentification en mode sombre"
                className="from-gray-900 via-gray-800 to-black"
            >
                <div className="min-h-screen bg-gray-900 text-white">
                    <div className="container mx-auto p-8">
                        <h1 className="text-4xl font-bold mb-8">Application en mode sombre</h1>
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h2 className="text-2xl font-semibold mb-4">Dashboard sombre</h2>
                            <p className="text-gray-300">
                                Interface optimisée pour la visualisation nocturne.
                            </p>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        </AuthProvider>
    );
}
```

### 6. Multi-step authentication (conceptuel)

```tsx
'use client';

import { useState } from 'react';
import { AuthProvider } from '@/contexts/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function MultiStepContent() {
    const [step, setStep] = useState(1);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-bold mb-6">Configuration - Étape {step}/3</h1>
                
                {step === 1 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Bienvenue</h2>
                        <p className="mb-4">Configurons votre environnement...</p>
                        <button 
                            onClick={() => setStep(2)}
                            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Suivant
                        </button>
                    </div>
                )}
                
                {step === 2 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Préférences</h2>
                        <p className="mb-4">Choisissez vos options...</p>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setStep(1)}
                                className="flex-1 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Retour
                            </button>
                            <button 
                                onClick={() => setStep(3)}
                                className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                )}
                
                {step === 3 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Terminé</h2>
                        <p className="mb-4">Configuration complète !</p>
                        <button 
                            onClick={() => setStep(1)}
                            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Recommencer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MultiStepAuth() {
    return (
        <AuthProvider>
            <ProtectedRoute
                fallbackTitle="Setup Assistant"
                fallbackSubtitle="Authentification requise pour continuer"
            >
                <MultiStepContent />
            </ProtectedRoute>
        </AuthProvider>
    );
}
```

## 🔄 Exemples avancés

### 7. Provider global (dans layout.tsx)

```tsx
// app/layout.tsx
'use client';

import { AuthProvider } from '@/contexts/AuthProvider';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
            <body>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
```

### 8. Route conditionnellement protégée

```tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ConditionalProtection() {
    const searchParams = useSearchParams();
    const isPublic = searchParams.get('public') === 'true';

    const content = (
        <div className="p-8">
            <h1>Page {isPublic ? 'Publique' : 'Protégée'}</h1>
            <p>
                {isPublic 
                    ? 'Cette page est accessible à tous.'
                    : 'Cette page nécessite une authentification.'
                }
            </p>
        </div>
    );

    if (isPublic) {
        return content;
    }

    return (
        <AuthProvider>
            <ProtectedRoute>
                {content}
            </ProtectedRoute>
        </AuthProvider>
    );
}
```

## 🧪 Exemples de tests

### 9. Test d'intégration avec React Testing Library

```tsx
// __tests__/auth.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Mock fetch
global.fetch = jest.fn();

const TestComponent = () => (
    <AuthProvider>
        <ProtectedRoute>
            <div>Contenu protégé</div>
        </ProtectedRoute>
    </AuthProvider>
);

describe('Authentification', () => {
    beforeEach(() => {
        (fetch as jest.Mock).mockClear();
    });

    test('affiche le formulaire de connexion si non authentifié', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ authenticated: false })
        });

        render(<TestComponent />);

        await waitFor(() => {
            expect(screen.getByText('Entrez votre code PIN')).toBeInTheDocument();
        });
    });

    test('affiche le contenu protégé si authentifié', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ authenticated: true })
        });

        render(<TestComponent />);

        await waitFor(() => {
            expect(screen.getByText('Contenu protégé')).toBeInTheDocument();
        });
    });
});
```

Ces exemples couvrent la plupart des cas d'usage du système d'authentification SABS. N'hésitez pas à les adapter selon vos besoins spécifiques !
