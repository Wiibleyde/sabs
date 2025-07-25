'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuthSimple } from '@/hooks/useAuthSimple';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (pin: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    checkAuthentication: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const authData = useAuthSimple();
    
    return (
        <AuthContext.Provider value={authData}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
