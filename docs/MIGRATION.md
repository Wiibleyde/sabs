# 🔄 Guide de migration - Système d'authentification SABS

Ce guide vous aide à intégrer le système d'authentification SABS dans un projet existant ou à migrer depuis un autre système d'auth.

## 📦 Migration vers SABS Auth

### Depuis un système de login classique (email/password)

#### Étape 1: Installation des dépendances
```bash
npm install jsonwebtoken @types/jsonwebtoken
```

#### Étape 2: Configuration des variables d'environnement
```env
# Ajoutez à votre .env.local
DASHBOARD_PIN=votre-pin-securise
JWT_SECRET=votre-cle-jwt-complexe
```

#### Étape 3: Copiez les fichiers du système SABS
```bash
# Créez la structure
mkdir -p src/hooks src/contexts src/components/auth src/app/api/v1/auth/pin src/app/api/v1/auth/logout

# Copiez les fichiers
cp path/to/sabs/src/hooks/useAuthSimple.ts src/hooks/
cp path/to/sabs/src/hooks/useLogout.ts src/hooks/
cp path/to/sabs/src/contexts/AuthProvider.tsx src/contexts/
cp path/to/sabs/src/components/auth/* src/components/auth/
cp path/to/sabs/src/app/api/v1/auth/pin/route.ts src/app/api/v1/auth/pin/
cp path/to/sabs/src/app/api/v1/auth/logout/route.ts src/app/api/v1/auth/logout/
```

#### Étape 4: Adaptation des routes existantes
```tsx
// Avant (avec email/password)
export default function Dashboard() {
    const { user, isLoading } = useUser();
    
    if (isLoading) return <Loading />;
    if (!user) return <LoginForm />;
    
    return <DashboardContent />;
}

// Après (avec SABS Auth)
export default function Dashboard() {
    return (
        <AuthProvider>
            <ProtectedRoute>
                <DashboardContent />
            </ProtectedRoute>
        </AuthProvider>
    );
}
```

### Depuis NextAuth.js

#### Étape 1: Suppression de NextAuth
```bash
npm uninstall next-auth
```

#### Étape 2: Remplacement des providers
```tsx
// Avant (NextAuth)
import { SessionProvider } from 'next-auth/react';
import { useSession } from 'next-auth/react';

export default function App({ Component, pageProps }) {
    return (
        <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
        </SessionProvider>
    );
}

// Après (SABS Auth)
import { AuthProvider } from '@/contexts/AuthProvider';

export default function App({ Component, pageProps }) {
    return (
        <AuthProvider>
            <Component {...pageProps} />
        </AuthProvider>
    );
}
```

#### Étape 3: Migration des hooks
```tsx
// Avant (NextAuth)
import { useSession, signOut } from 'next-auth/react';

function MyComponent() {
    const { data: session, status } = useSession();
    
    if (status === 'loading') return <Loading />;
    if (!session) return <LoginButton />;
    
    return (
        <div>
            <p>Connecté en tant que {session.user.email}</p>
            <button onClick={() => signOut()}>Déconnexion</button>
        </div>
    );
}

// Après (SABS Auth)
import { useAuth } from '@/contexts/AuthProvider';
import { useLogout } from '@/hooks/useLogout';

function MyComponent() {
    const { isAuthenticated, isLoading } = useAuth();
    const { logoutWithConfirm } = useLogout();
    
    if (isLoading) return <Loading />;
    if (!isAuthenticated) return <LoginButton />;
    
    return (
        <div>
            <p>Utilisateur authentifié</p>
            <button onClick={logoutWithConfirm}>Déconnexion</button>
        </div>
    );
}
```

## 🔧 Personnalisation pour votre projet

### Modification du système d'authentification

#### Utiliser des mots de passe au lieu de PIN
```typescript
// src/app/api/v1/auth/pin/route.ts
export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json(); // Changé de 'pin' à 'password'

        if (!password) {
            return NextResponse.json(
                { error: 'Mot de passe requis' },
                { status: 400 }
            );
        }

        // Validation avec hash (recommandé)
        const bcrypt = require('bcrypt');
        const isValid = await bcrypt.compare(password, process.env.HASHED_PASSWORD);

        if (isValid) {
            // ... reste du code
        }
    } catch {
        // ...
    }
}
```

#### Authentification multi-utilisateurs
```typescript
// src/lib/users.ts
interface User {
    id: string;
    pin: string;
    role: 'admin' | 'user';
    name: string;
}

const USERS: User[] = [
    { id: '1', pin: '1234', role: 'admin', name: 'Admin' },
    { id: '2', pin: '5678', role: 'user', name: 'User' },
];

export function authenticateUser(pin: string): User | null {
    return USERS.find(user => user.pin === pin) || null;
}

// Dans route.ts
import { authenticateUser } from '@/lib/users';

export async function POST(request: NextRequest) {
    const { pin } = await request.json();
    const user = authenticateUser(pin);
    
    if (user) {
        const sessionToken = sign(
            { 
                authenticated: true, 
                userId: user.id,
                role: user.role,
                timestamp: Date.now() 
            }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );
        // ...
    }
}
```

### Intégration avec une base de données

#### Avec Prisma
```typescript
// prisma/schema.prisma
model User {
    id        String   @id @default(cuid())
    pin       String   @unique
    role      Role     @default(USER)
    name      String
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}

enum Role {
    ADMIN
    USER
}
```

```typescript
// src/lib/auth-db.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function authenticateUserDB(pin: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { pin }
        });
        return user;
    } catch {
        return null;
    }
}
```

#### Avec Supabase
```typescript
// src/lib/supabase-auth.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
);

export async function authenticateUserSupabase(pin: string) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('pin', pin)
        .single();
    
    return error ? null : data;
}
```

## 🎨 Personnalisation de l'interface

### Thème personnalisé
```tsx
// src/components/auth/CustomAuthGuard.tsx
import { AuthGuard } from './AuthGuard';

export function CompanyAuthGuard(props: any) {
    return (
        <AuthGuard
            {...props}
            title="Mon Entreprise"
            subtitle="Accès sécurisé à l'intranet"
            className="from-company-primary via-company-secondary to-company-accent"
        />
    );
}
```

### Logo personnalisé
```tsx
// src/components/auth/BrandedAuthGuard.tsx
export function BrandedAuthGuard(props: any) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-company-gradient">
            <div className="max-w-md w-full">
                {/* Logo de l'entreprise */}
                <div className="text-center mb-8">
                    <img 
                        src="/logo-company.svg" 
                        alt="Logo" 
                        className="h-16 mx-auto mb-4"
                    />
                    <h1 className="text-2xl font-bold text-white">
                        Accès Sécurisé
                    </h1>
                </div>
                
                <AuthGuard {...props} />
            </div>
        </div>
    );
}
```

## 🔐 Renforcement de la sécurité

### Rate Limiting
```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 tentatives par minute
});

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/api/v1/auth/pin')) {
        const ip = request.ip ?? '127.0.0.1';
        const { success } = await ratelimit.limit(ip);
        
        if (!success) {
            return NextResponse.json(
                { error: 'Trop de tentatives' },
                { status: 429 }
            );
        }
    }
    
    return NextResponse.next();
}
```

### Chiffrement avancé
```typescript
// src/lib/crypto.ts
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
const ALGORITHM = 'aes-256-gcm';

export function encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
    cipher.setIV(iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

export function decrypt(text: string): string {
    const [ivHex, authTagHex, encrypted] = text.split(':');
    
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
    decipher.setIV(iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
}
```

## 📱 Intégration mobile (React Native)

### Adapter pour React Native
```typescript
// src/hooks/useAuthNative.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAuthNative() {
    const login = async (pin: string) => {
        try {
            const response = await fetch('/api/v1/auth/pin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                await AsyncStorage.setItem('authToken', data.token);
                return { success: true };
            }
            
            return { success: false, error: data.error };
        } catch {
            return { success: false, error: 'Erreur réseau' };
        }
    };
    
    const logout = async () => {
        await AsyncStorage.removeItem('authToken');
    };
    
    return { login, logout };
}
```

## 🧪 Tests automatisés

### Tests avec Jest
```typescript
// __tests__/auth-integration.test.ts
import { POST } from '@/app/api/v1/auth/pin/route';
import { NextRequest } from 'next/server';

describe('API Auth', () => {
    test('authentification réussie avec PIN correct', async () => {
        const request = new NextRequest('http://localhost:3000/api/v1/auth/pin', {
            method: 'POST',
            body: JSON.stringify({ pin: process.env.DASHBOARD_PIN }),
            headers: { 'Content-Type': 'application/json' }
        });
        
        const response = await POST(request);
        const data = await response.json();
        
        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
    });
    
    test('échec avec PIN incorrect', async () => {
        const request = new NextRequest('http://localhost:3000/api/v1/auth/pin', {
            method: 'POST',
            body: JSON.stringify({ pin: 'wrong' }),
            headers: { 'Content-Type': 'application/json' }
        });
        
        const response = await POST(request);
        const data = await response.json();
        
        expect(response.status).toBe(401);
        expect(data.error).toBe('PIN incorrect');
    });
});
```

Cette documentation de migration vous permet d'adapter le système SABS Auth à vos besoins spécifiques tout en conservant sa robustesse et sa simplicité d'utilisation.
