"use client";

import Background from "@public/img/mattmax2025/PROJET_SO1.png";
import Image from "next/image";

export default function MattMaxEventPage() {
	return (
		<div className="relative h-dvh w-full overflow-hidden">
			{/* Background Image */}
			<div className="fixed inset-0 -z-10">
				<Image
					src={Background}
					alt="Event Background"
					fill
					className="object-cover"
					priority
					quality={100}
				/>
				<div className="absolute inset-0 bg-black/70" />
			</div>

			{/* Content Container */}
			<div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-2">
				{/* MattMax Logo */}
				<div className="mb-12">
					<Image
						src="/img/mattmax2025/MattMax logo.svg"
						alt="MattMax Logo"
						width={300}
						height={150}
						className="w-auto h-24 md:h-32 lg:h-40 drop-shadow-2xl"
						priority
					/>
				</div>

				{/* Thank You Card */}
				<div className="px-8 py-10 md:px-16 md:py-14 max-w-3xl bg-black/70 rounded-3xl border border-white/20 shadow-2xl">
					<div className="text-center space-y-8">
						{/* Title */}
						<div className="space-y-3">
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
								Merci à Tous !
							</h1>
							<div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full" />
						</div>

						{/* Thank You Message */}
						<div className="space-y-6 text-white/90">
							<p className="text-lg md:text-xl leading-relaxed">
								L&apos;événement MattMax du{" "}
								<span className="font-semibold text-purple-300">
									21 novembre 2025
								</span>{" "}
								a été un succès incroyable grâce à vous tous !
							</p>

							<div className="pt-4 space-y-4">
								<p className="text-base md:text-lg">
									Un immense merci à tous les{" "}
									<span className="font-semibold text-purple-300">
										artistes
									</span>{" "}
									qui ont fait vibrer cette soirée avec leur talent et leur
									énergie.
								</p>
								<p className="text-base md:text-lg">
									Merci à toute l&apos;
									<span className="font-semibold text-purple-300">
										équipe technique
									</span>{" "}
									et aux{" "}
									<span className="font-semibold text-purple-300">
										organisateurs
									</span>{" "}
									qui ont travaillé sans relâche pour rendre cet événement
									possible.
								</p>
								<p className="text-base md:text-lg">
									Et surtout, merci à{" "}
									<span className="font-semibold text-purple-300">vous</span>,
									le public, pour votre présence et votre enthousiasme qui ont
									fait de cette soirée un moment inoubliable.
								</p>
							</div>
						</div>

						{/* Decorative Element */}
						<div className="pt-6">
							<div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full border border-purple-400/30">
								<p className="text-lg md:text-xl font-light text-purple-200">
									À bientôt pour de nouvelles aventures !
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Animated Background Gradient Orbs */}
			<div className="fixed inset-0 -z-5 overflow-hidden pointer-events-none">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
			</div>
		</div>
	);
}
