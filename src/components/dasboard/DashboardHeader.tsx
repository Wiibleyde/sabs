"use client";

import { useLogout } from "@/hooks/useLogout";

export function DashboardHeader() {
	const { logoutWithConfirm } = useLogout({
		confirmMessage: "Êtes-vous sûr de vouloir vous déconnecter ?",
		redirectAfter: true,
		redirectUrl: "/dashboard",
		redirectDelay: 300,
	});

	return (
		<div className="flex items-start justify-between mb-12">
			<div>
				<p className="text-xs font-bold tracking-[0.4em] uppercase mb-3 text-sabs-green">
					Panneau d&apos;administration
				</p>
				<h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-none tracking-tighter text-white mb-4">
					<span className="sabs-gradient-text">SABS</span> Dashboard
				</h1>
				<div className="sabs-gradient-bg rounded-full w-12 h-0.5" />
			</div>

			<button
				type="button"
				onClick={logoutWithConfirm}
				className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase bg-sabs-red/10 border border-sabs-red/30 text-sabs-red hover:bg-sabs-red/20 transition-all duration-300"
				title="Se déconnecter"
			>
				<svg
					className="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<title>Déconnexion</title>
					<path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
				</svg>
				Déconnexion
			</button>
		</div>
	);
}
