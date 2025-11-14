"use client";

import { useCallback, useEffect, useState } from "react";

interface AuthState {
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

export function useAuth() {
	const [authState, setAuthState] = useState<AuthState>({
		isAuthenticated: false,
		isLoading: true,
		error: null,
	});

	const checkAuthentication = useCallback(async () => {
		try {
			setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

			const response = await fetch("/api/v1/auth/pin", {
				method: "GET",
				credentials: "include",
				cache: "no-store", // Éviter le cache pour des vérifications à jour
			});

			if (response.ok) {
				const data = await response.json();
				setAuthState({
					isAuthenticated: data.authenticated || false,
					isLoading: false,
					error: null,
				});
			} else {
				setAuthState({
					isAuthenticated: false,
					isLoading: false,
					error: null,
				});
			}
		} catch {
			setAuthState({
				isAuthenticated: false,
				isLoading: false,
				error: "Erreur de vérification de session",
			});
		}
	}, []);

	const login = useCallback(
		async (pin: string): Promise<{ success: boolean; error?: string }> => {
			try {
				setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

				const response = await fetch("/api/v1/auth/pin", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({ pin }),
				});

				const data = await response.json();

				if (response.ok) {
					setAuthState({
						isAuthenticated: true,
						isLoading: false,
						error: null,
					});

					// Force une vérification immédiate pour confirmer l'état
					setTimeout(() => {
						checkAuthentication();
					}, 100);

					return { success: true };
				} else {
					setAuthState((prev) => ({
						...prev,
						isLoading: false,
						error: data.error || "PIN incorrect",
					}));
					return { success: false, error: data.error || "PIN incorrect" };
				}
			} catch {
				const errorMessage = "Erreur de connexion";
				setAuthState((prev) => ({
					...prev,
					isLoading: false,
					error: errorMessage,
				}));
				return { success: false, error: errorMessage };
			}
		},
		[checkAuthentication],
	);

	const logout = useCallback(async (): Promise<void> => {
		try {
			// Mettre à jour l'état local immédiatement pour une réaction rapide
			setAuthState({
				isAuthenticated: false,
				isLoading: false,
				error: null,
			});

			await fetch("/api/v1/auth/logout", {
				method: "POST",
				credentials: "include",
			});
		} catch {
			// Même en cas d'erreur réseau, on déconnecte localement
			setAuthState({
				isAuthenticated: false,
				isLoading: false,
				error: null,
			});
		}
	}, []);

	// Vérification automatique au montage du composant
	useEffect(() => {
		checkAuthentication();
	}, [checkAuthentication]);

	// Vérification périodique de la session (toutes les 5 minutes)
	useEffect(() => {
		if (authState.isAuthenticated) {
			const interval = setInterval(checkAuthentication, 5 * 60 * 1000);
			return () => clearInterval(interval);
		}
	}, [authState.isAuthenticated, checkAuthentication]);

	return {
		...authState,
		login,
		logout,
		checkAuthentication,
	};
}
