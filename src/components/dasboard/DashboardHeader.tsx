"use client";

import { Be_Vietnam_Pro } from "next/font/google";
import { useLogout } from "@/hooks/useLogout";

const BeVietnam = Be_Vietnam_Pro({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export function DashboardHeader() {
	const { logoutWithConfirm } = useLogout({
		confirmMessage: "Êtes-vous sûr de vouloir vous déconnecter ?",
		redirectAfter: true,
		redirectUrl: "/dashboard",
		redirectDelay: 300,
	});

	return (
		<div
			className="text-center mb-8 md:mb-12 relative"
			style={{ fontFamily: BeVietnam.style.fontFamily }}
		>
			{/* Bouton de déconnexion */}
			<button
				type="button"
				onClick={logoutWithConfirm}
				className="absolute top-0 right-0 md:right-4 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 hover:text-red-700 border border-red-500/20 hover:border-red-500/30 rounded-lg transition-all duration-300 text-sm font-medium"
				title="Se déconnecter"
			>
				<svg
					className="w-4 h-4 inline mr-2"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<title>Se déconnecter</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
					/>
				</svg>
				Déconnexion
			</button>

			<h1 className="text-3xl sm:text-4xl md:text-5xl font-thin text-gray-900 mb-4 tracking-[-0.02em]">
				Tableau de bord{" "}
				<span className="text-sabs-primary font-medium">SABS</span>
			</h1>
			<div className="w-16 md:w-24 h-[2px] bg-gradient-to-r from-sabs-gradient-1 via-sabs-gradient-2 to-sabs-primary mx-auto mb-4 md:mb-6 rounded-full"></div>
			<p className="text-base md:text-lg text-gray-600 font-light max-w-2xl mx-auto">
				Surveillance en temps réel des connexions RTMP et de l&apos;état du
				système
			</p>
		</div>
	);
}
