"use client";

import SmallLogo from "@public/img/sabs/small-logo-white.png";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface PinAuthProps {
	onAuthenticated: () => void;
}

export function PinAuth({ onAuthenticated }: PinAuthProps) {
	const [pin, setPin] = useState("");
	const [showPin, setShowPin] = useState(false);
	const { login, isLoading, error, isAuthenticated } = useAuth();

	useEffect(() => {
		if (isAuthenticated) setTimeout(onAuthenticated, 100);
	}, [isAuthenticated, onAuthenticated]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const result = await login(pin);
		if (result.success) onAuthenticated();
		else setPin("");
	};

	const handlePinChange = (value: string) => {
		if (value.length <= 4 && /^\d*$/.test(value)) setPin(value);
	};

	return (
		<div className="min-h-screen flex items-center justify-center fade-in bg-sabs-bg">
			{/* Top gradient bar */}
			<div className="fixed top-0 left-0 right-0 h-1 sabs-gradient-bg" />

			<div className="w-full max-w-sm mx-4">
				{/* Logo + title */}
				<div className="text-center mb-10">
					<div className="inline-flex items-center gap-3 mb-6">
						<Image
							src={SmallLogo}
							alt="SABS"
							width={32}
							height={32}
							className="opacity-90"
						/>
						<span className="text-xl font-black tracking-wider text-white">
							SABS
						</span>
					</div>
					<h1 className="sabs-gradient-text text-3xl font-black tracking-tighter mb-2">
						Dashboard
					</h1>
					<p className="text-sm font-light text-sabs-muted">
						Entrez votre code PIN pour accéder
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label
							htmlFor="pin"
							className="block text-center text-xs font-bold tracking-[0.3em] uppercase mb-3 text-sabs-muted"
						>
							Code PIN
						</label>
						<div className="relative flex items-center rounded-xl overflow-hidden bg-sabs-bg-4 border border-sabs-border focus-within:border-sabs-green focus-within:ring-2 focus-within:ring-sabs-green/10 transition-all duration-300">
							<input
								id="pin"
								type={showPin ? "text" : "password"}
								value={pin}
								onChange={(e) => handlePinChange(e.target.value)}
								className="flex-1 px-5 py-4 bg-transparent text-white text-center text-2xl tracking-[0.6em] font-mono focus:outline-none placeholder-sabs-muted-3"
								placeholder="••••"
								maxLength={4}
								autoComplete="off"
								disabled={isLoading}
								inputMode="numeric"
							/>
							<button
								type="button"
								onClick={() => setShowPin(!showPin)}
								className="px-4 text-sabs-muted hover:text-white transition-colors"
								disabled={isLoading}
							>
								{showPin ? (
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<title>Masquer</title>
										<path d="M3 3l18 18M10.584 10.587a2 2 0 002.828 2.83M9.363 5.365A9.466 9.466 0 0112 5c4.418 0 8.418 2.467 10.5 6.5a9.476 9.476 0 01-1.904 2.592M6.726 6.726A9.466 9.466 0 001.5 11.5C3.582 15.533 7.582 18 12 18a9.472 9.472 0 005.274-1.726" />
									</svg>
								) : (
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<title>Afficher</title>
										<path d="M1.5 11.5C3.582 7.467 7.582 5 12 5s8.418 2.467 10.5 6.5C20.418 15.533 16.418 18 12 18S3.582 15.533 1.5 11.5z" />
										<circle cx="12" cy="11.5" r="2.5" />
									</svg>
								)}
							</button>
						</div>
					</div>

					{error && (
						<div className="px-4 py-3 rounded-lg text-sm text-center bg-sabs-red/10 border border-sabs-red/30 text-sabs-red">
							{error}
						</div>
					)}

					<button
						type="submit"
						disabled={pin.length !== 4 || isLoading}
						className="w-full py-4 rounded-xl font-bold text-sm tracking-[0.2em] uppercase sabs-gradient-bg text-sabs-bg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
					>
						{isLoading ? (
							<span className="flex items-center justify-center gap-2">
								<div className="w-4 h-4 border-2 border-sabs-bg/30 border-t-sabs-bg rounded-full animate-spin" />
								Vérification...
							</span>
						) : (
							"Accéder au Dashboard"
						)}
					</button>
				</form>

				<p className="text-center text-xs mt-8 text-sabs-muted-3">
					Accès sécurisé — SABS
				</p>
			</div>
		</div>
	);
}
