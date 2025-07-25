'use client';

import { DashboardLayout } from '@/components/dasboard/DashboardLayout';
import { DashboardHeader } from '@/components/dasboard/DashboardHeader';
import { DashboardGrid } from '@/components/dasboard/DashboardGrid';
import { AuthProvider } from '@/contexts/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function DashboardPage() {
    return (
        <AuthProvider>
            <ProtectedRoute
                fallbackTitle="SABS Dashboard"
                fallbackSubtitle="Entrez votre code PIN pour accéder au tableau de bord"
            >
                <DashboardLayout>
                    <DashboardHeader />
                    <DashboardGrid />
                </DashboardLayout>
            </ProtectedRoute>
        </AuthProvider>
    );
}
