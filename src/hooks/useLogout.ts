"use client";

import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthProvider";

interface UseLogoutOptions {
	confirmMessage?: string;
	redirectAfter?: boolean;
	redirectUrl?: string;
	redirectDelay?: number;
}

export function useLogout(options: UseLogoutOptions = {}) {
	const { logout } = useAuth();

	const {
		confirmMessage = "Êtes-vous sûr de vouloir vous déconnecter ?",
		redirectAfter = false,
		redirectUrl = "/dashboard",
		redirectDelay = 300,
	} = options;

	const redirect = useCallback(() => {
		if (!redirectAfter) return;
		setTimeout(() => {
			window.location.href = redirectUrl;
		}, redirectDelay);
	}, [redirectAfter, redirectUrl, redirectDelay]);

	const logoutWithConfirm = useCallback(async (): Promise<boolean> => {
		if (!confirm(confirmMessage)) return false;
		await logout();
		redirect();
		return true;
	}, [logout, confirmMessage, redirect]);

	const logoutSilent = useCallback(async (): Promise<void> => {
		await logout();
		redirect();
	}, [logout, redirect]);

	return { logoutWithConfirm, logoutSilent, logout };
}
