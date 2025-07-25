'use client';

import { useState, useEffect, useCallback } from 'react';

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export function useAuthSimple() {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        isLoading: true,
        error: null
    });

    // Vérifier l'authentification
    const checkAuthentication = useCallback(async (): Promise<boolean> => {
        try {
            const response = await fetch('/api/v1/auth/pin', {
                method: 'GET',
                credentials: 'include',
                cache: 'no-store'
            });

            if (response.ok) {
                const data = await response.json();
                const isAuth = data.authenticated || false;
                
                setAuthState(prev => ({
                    ...prev,
                    isAuthenticated: isAuth,
                    isLoading: false,
                    error: null
                }));
                
                return isAuth;
            } else {
                setAuthState(prev => ({
                    ...prev,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null
                }));
                return false;
            }
        } catch {
            setAuthState(prev => ({
                ...prev,
                isAuthenticated: false,
                isLoading: false,
                error: 'Erreur de vérification'
            }));
            return false;
        }
    }, []);

    // Connexion
    const login = useCallback(async (pin: string): Promise<{ success: boolean; error?: string }> => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await fetch('/api/v1/auth/pin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ pin }),
            });

            const data = await response.json();

            if (response.ok) {
                setAuthState({
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                });
                return { success: true };
            } else {
                setAuthState(prev => ({
                    ...prev,
                    isAuthenticated: false,
                    isLoading: false,
                    error: data.error || 'PIN incorrect'
                }));
                return { success: false, error: data.error || 'PIN incorrect' };
            }
        } catch {
            const errorMessage = 'Erreur de connexion';
            setAuthState(prev => ({
                ...prev,
                isAuthenticated: false,
                isLoading: false,
                error: errorMessage
            }));
            return { success: false, error: errorMessage };
        }
    }, []);

    // Déconnexion
    const logout = useCallback(async (): Promise<void> => {
        try {
            // Mise à jour immédiate de l'état local
            setAuthState({
                isAuthenticated: false,
                isLoading: false,
                error: null
            });

            // Appel API pour nettoyer le cookie
            await fetch('/api/v1/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch {
            // Même en cas d'erreur, on déconnecte localement
            setAuthState({
                isAuthenticated: false,
                isLoading: false,
                error: null
            });
        }
    }, []);

    // Vérification initiale
    useEffect(() => {
        checkAuthentication();
    }, [checkAuthentication]);

    return {
        ...authState,
        login,
        logout,
        checkAuthentication
    };
}
