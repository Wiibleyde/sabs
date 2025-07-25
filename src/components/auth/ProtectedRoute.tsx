'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { AuthGuard } from './AuthGuard';

interface ProtectedRouteProps {
    children: ReactNode;
    fallbackTitle?: string;
    fallbackSubtitle?: string;
    className?: string;
    showLoader?: boolean;
}

export function ProtectedRoute({ 
    children, 
    fallbackTitle,
    fallbackSubtitle,
    className,
    showLoader = true
}: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, login } = useAuth();

    // Écran de chargement
    if (isLoading && showLoader) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white/70">Vérification de la session...</p>
                </div>
            </div>
        );
    }

    // Écran d'authentification
    if (!isAuthenticated) {
        return (
            <AuthGuard
                onLogin={login}
                isLoading={isLoading}
                title={fallbackTitle}
                subtitle={fallbackSubtitle}
                className={className}
            >
                {children}
            </AuthGuard>
        );
    }

    // Contenu protégé
    return <>{children}</>;
}
