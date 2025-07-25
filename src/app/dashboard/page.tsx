'use client';

import { DashboardLayout } from '@/components/dasboard/DashboardLayout';
import { DashboardHeader } from '@/components/dasboard/DashboardHeader';
import { DashboardGrid } from '@/components/dasboard/DashboardGrid';
import { useState, useEffect } from 'react';

const PinLoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const [pin, setPin] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/v1/auth/pin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ pin }),
            });

            if (response.ok) {
                onSuccess();
            } else {
                const data = await response.json();
                setError(data.error || 'PIN incorrect');
                setPin('');
            }
        } catch {
            setError('Erreur de connexion');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 w-full max-w-md mx-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                            SABS
                        </span>{' '}
                        Dashboard
                    </h1>
                    <p className="text-white/70 text-sm">Entrez votre code PIN pour accéder</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-purple-400"
                            placeholder="••••"
                            maxLength={4}
                            disabled={isLoading}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={pin.length !== 4 || isLoading}
                        className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl disabled:opacity-50"
                    >
                        {isLoading ? 'Vérification...' : 'Accéder au Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default function DashboardPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Vérifier si déjà connecté
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/v1/auth/pin', {
                    method: 'GET',
                    credentials: 'include',
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setIsAuthenticated(data.authenticated);
                }
            } catch {
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white/70">Vérification de la session...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <PinLoginForm onSuccess={() => setIsAuthenticated(true)} />;
    }

    return (
        <DashboardLayout>
            <DashboardHeader />
            <DashboardGrid />
        </DashboardLayout>
    );
}
