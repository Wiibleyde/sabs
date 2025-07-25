'use client';

import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthProvider';

interface UseLogoutOptions {
    confirmMessage?: string;
    redirectAfter?: boolean;
    redirectUrl?: string;
    redirectDelay?: number;
}

export function useLogout(options: UseLogoutOptions = {}) {
    const { logout } = useAuth();
    
    const {
        confirmMessage = 'Êtes-vous sûr de vouloir vous déconnecter ?',
        redirectAfter = false,
        redirectUrl = '/dashboard',
        redirectDelay = 300
    } = options;

    const logoutWithConfirm = useCallback(async (): Promise<boolean> => {
        if (confirm(confirmMessage)) {
            await logout();
            
            if (redirectAfter) {
                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, redirectDelay);
            }
            
            return true;
        }
        return false;
    }, [logout, confirmMessage, redirectAfter, redirectUrl, redirectDelay]);

    const logoutSilent = useCallback(async (): Promise<void> => {
        await logout();
        
        if (redirectAfter) {
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, redirectDelay);
        }
    }, [logout, redirectAfter, redirectUrl, redirectDelay]);

    return {
        logoutWithConfirm,
        logoutSilent,
        logout
    };
}
