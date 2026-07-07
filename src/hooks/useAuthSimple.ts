"use client";

import { useCallback, useEffect, useState } from "react";

interface AuthState {
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

const AUTH_ENDPOINT = "/api/v1/auth/pin";
const LOGOUT_ENDPOINT = "/api/v1/auth/logout";

const loggedOut = (error: string | null = null): AuthState => ({
	isAuthenticated: false,
	isLoading: false,
	error,
});

export function useAuthSimple() {
	const [authState, setAuthState] = useState<AuthState>({
		isAuthenticated: false,
		isLoading: true,
		error: null,
	});

	const checkAuthentication = useCallback(async (): Promise<boolean> => {
		try {
			const response = await fetch(AUTH_ENDPOINT, {
				method: "GET",
				credentials: "include",
				cache: "no-store",
			});

			if (!response.ok) {
				setAuthState(loggedOut());
				return false;
			}

			const data = await response.json();
			const isAuth = Boolean(data.authenticated);
			setAuthState({ isAuthenticated: isAuth, isLoading: false, error: null });
			return isAuth;
		} catch {
			setAuthState(loggedOut("Erreur de vérification"));
			return false;
		}
	}, []);

	const login = useCallback(
		async (pin: string): Promise<{ success: boolean; error?: string }> => {
			setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

			try {
				const response = await fetch(AUTH_ENDPOINT, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
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
					return { success: true };
				}

				const error = data.error || "PIN incorrect";
				setAuthState(loggedOut(error));
				return { success: false, error };
			} catch {
				const error = "Erreur de connexion";
				setAuthState(loggedOut(error));
				return { success: false, error };
			}
		},
		[],
	);

	const logout = useCallback(async (): Promise<void> => {
		setAuthState(loggedOut());
		try {
			await fetch(LOGOUT_ENDPOINT, { method: "POST", credentials: "include" });
		} catch {
			setAuthState(loggedOut());
		}
	}, []);

	useEffect(() => {
		checkAuthentication();
	}, [checkAuthentication]);

	return { ...authState, login, logout, checkAuthentication };
}
