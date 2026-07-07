"use client";

import { useState } from "react";
import { beVietnam } from "@/lib/fonts";

const PIN_LENGTH = 4;

interface AuthGuardProps {
	onLogin: (pin: string) => Promise<{ success: boolean; error?: string }>;
	isLoading?: boolean;
	title?: string;
	subtitle?: string;
	className?: string;
}

export function AuthGuard({
	onLogin,
	isLoading: externalLoading = false,
	title = "SABS Dashboard",
	subtitle = "Entrez votre code PIN pour accéder",
	className = "",
}: AuthGuardProps) {
	const [pin, setPin] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [showPinDots, setShowPinDots] = useState(true);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const result = await onLogin(pin);
			if (!result.success) {
				setError(result.error || "PIN incorrect");
				setPin("");
			}
		} catch {
			setError("Erreur de connexion");
			setPin("");
		} finally {
			setIsLoading(false);
		}
	};

	const handlePinChange = (value: string) => {
		setPin(value.replace(/\D/g, "").slice(0, PIN_LENGTH));
		setError("");
	};

	const loading = isLoading || externalLoading;
	const [firstWord, ...restWords] = title.split(" ");
	const restTitle = restWords.join(" ");

	return (
		<div
			className={`min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 ${beVietnam.className} ${className}`}
		>
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/4 left-1/4 w-3 h-3 bg-linear-to-r from-purple-400 to-pink-400 rounded-full animate-bounce [animation-delay:0s] [animation-duration:3s]"></div>
				<div className="absolute top-3/4 right-1/4 w-2 h-2 bg-linear-to-r from-blue-400 to-purple-400 rounded-full animate-bounce [animation-delay:1s] [animation-duration:4s]"></div>
				<div className="absolute top-1/2 left-1/3 w-2.5 h-2.5 bg-linear-to-r from-pink-400 to-purple-400 rounded-full animate-bounce [animation-delay:2s] [animation-duration:5s]"></div>
				<div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-linear-to-r from-purple-300 to-pink-300 rounded-full animate-bounce [animation-delay:0.5s] [animation-duration:3.5s]"></div>
			</div>

			<div className="relative z-10 w-full max-w-md mx-4">
				<div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 transform transition-all duration-500 hover:scale-105">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-white mb-2">
							<span className="text-transparent bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text">
								{firstWord}
							</span>
							{restTitle && ` ${restTitle}`}
						</h1>
						<p className="text-white/70 text-sm">{subtitle}</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="relative">
							<label
								htmlFor="pin"
								className="block text-white/80 text-sm font-medium mb-3 text-center"
							>
								Code PIN ({PIN_LENGTH} chiffres)
							</label>

							<div className="relative">
								<input
									id="pin"
									type={showPinDots ? "password" : "text"}
									value={pin}
									onChange={(e) => handlePinChange(e.target.value)}
									className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 placeholder-white/40"
									placeholder="••••"
									maxLength={PIN_LENGTH}
									autoComplete="off"
									disabled={loading}
								/>

								<button
									type="button"
									onClick={() => setShowPinDots(!showPinDots)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
									disabled={loading}
								>
									{showPinDots ? (
										<svg
											className="w-5 h-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<title>Cacher le code PIN</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
											/>
										</svg>
									) : (
										<svg
											className="w-5 h-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<title>Afficher le mot de passe</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
											/>
										</svg>
									)}
								</button>
							</div>
						</div>

						{error && (
							<div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm text-center animate-pulse">
								{error}
							</div>
						)}

						<button
							type="submit"
							disabled={pin.length !== PIN_LENGTH || loading}
							className="w-full py-4 px-6 bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl transition-all duration-300 hover:from-purple-600 hover:to-pink-600 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent"
						>
							{loading ? (
								<div className="flex items-center justify-center space-x-2">
									<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
									<span>Vérification...</span>
								</div>
							) : (
								"Accéder au Dashboard"
							)}
						</button>
					</form>

					<div className="mt-6 text-center text-white/50 text-xs">
						<p>🔒 Accès sécurisé au tableau de bord</p>
					</div>
				</div>
			</div>
		</div>
	);
}
