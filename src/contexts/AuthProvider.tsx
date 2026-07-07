"use client";

import { createContext, type ReactNode, useContext, useMemo } from "react";
import { useAuthSimple } from "@/hooks/useAuthSimple";

type AuthContextType = ReturnType<typeof useAuthSimple>;

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const {
		isAuthenticated,
		isLoading,
		error,
		login,
		logout,
		checkAuthentication,
	} = useAuthSimple();

	const value = useMemo<AuthContextType>(
		() => ({
			isAuthenticated,
			isLoading,
			error,
			login,
			logout,
			checkAuthentication,
		}),
		[isAuthenticated, isLoading, error, login, logout, checkAuthentication],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
