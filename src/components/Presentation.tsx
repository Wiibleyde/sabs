"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
	{
		colorClass: "text-sabs-green",
		borderClass: "border-t-sabs-green",
		bgClass: "bg-sabs-green/10",
		icon: (
			<svg
				width="28"
				height="28"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<title>Régie caméra</title>
				<path d="M15 10l4.553-2.069A1 1 0 0121 8.845V15.155a1 1 0 01-1.447.894L15 14v-4z" />
				<rect x="3" y="8" width="12" height="8" rx="2" />
				<circle cx="7" cy="12" r="1" fill="currentColor" stroke="none" />
			</svg>
		),
		title: "Régie caméra",
		desc: "Captation multicaméra professionnelle avec direction technique et mixage vidéo en temps réel.",
	},
	{
		colorClass: "text-sabs-gold",
		borderClass: "border-t-sabs-gold",
		bgClass: "bg-sabs-gold/10",
		icon: (
			<svg
				width="28"
				height="28"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<title>Régie lumière</title>
				<circle cx="12" cy="12" r="4" />
				<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
			</svg>
		),
		title: "Régie lumière",
		desc: "Conception et pilotage d'ambiances lumineuses adaptées à chaque scène, du mapping à l'éclairage de scène.",
	},
	{
		colorClass: "text-sabs-purple",
		borderClass: "border-t-sabs-purple",
		bgClass: "bg-sabs-purple/10",
		icon: (
			<svg
				width="28"
				height="28"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<title>Sur mesure</title>
				<path d="M12 2L2 7l10 5 10-5-10-5z" />
				<path d="M2 17l10 5 10-5" />
				<path d="M2 12l10 5 10-5" />
			</svg>
		),
		title: "Sur mesure",
		desc: "Chaque projet est unique — nous adaptons nos compétences et notre matériel à n'importe quelle demande.",
	},
];

export function Presentation() {
	const sectionRef = useRef<HTMLElement>(null);
	const headingRef = useRef<HTMLDivElement>(null);
	const textRef = useRef<HTMLDivElement>(null);
	const cardsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.set([headingRef.current, textRef.current], { opacity: 0, y: 50 });
			if (cardsRef.current) {
				gsap.set(Array.from(cardsRef.current.children), { opacity: 0, y: 40 });
			}

			ScrollTrigger.create({
				trigger: sectionRef.current,
				start: "top 70%",
				onEnter: () => {
					const tl = gsap.timeline();
					tl.to(headingRef.current, {
						opacity: 1,
						y: 0,
						duration: 0.9,
						ease: "power3.out",
					})
						.to(
							textRef.current,
							{ opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
							"-=0.5",
						)
						.to(
							cardsRef.current ? Array.from(cardsRef.current.children) : [],
							{
								opacity: 1,
								y: 0,
								duration: 0.7,
								ease: "power2.out",
								stagger: 0.12,
							},
							"-=0.4",
						);
				},
			});
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	return (
		<section
			ref={sectionRef}
			id="presentation"
			className="relative min-h-screen flex items-center py-20 md:py-28 bg-sabs-bg-2"
		>
			{/* Left accent bar */}
			<div className="absolute left-0 top-0 bottom-0 w-1 sabs-gradient-bg" />

			<div className="container mx-auto px-6 sm:px-10 md:px-16 max-w-6xl">
				{/* Heading */}
				<div ref={headingRef} className="mb-12 md:mb-16">
					<p className="text-xs font-semibold tracking-[0.4em] uppercase mb-4 text-sabs-green">
						À propos
					</p>
					<h2 className="text-[clamp(2.5rem,7vw,5rem)] font-black leading-none tracking-tighter text-white mb-6">
						Qu&apos;est-ce que <span className="sabs-gradient-text">SABS</span>{" "}
						?
					</h2>
					<div className="sabs-gradient-bg rounded-full w-16 h-0.5" />
				</div>

				{/* Description */}
				<div ref={textRef} className="mb-16 md:mb-20 max-w-3xl">
					<p className="text-[clamp(1rem,2.5vw,1.25rem)] font-light leading-relaxed mb-6 text-sabs-muted">
						<span className="font-semibold text-white">SABS</span> est une micro
						entreprise spécialisée dans la gestion de{" "}
						<span className="font-medium text-sabs-green">
							rediffusions en direct multicaméra
						</span>{" "}
						pour tout type d&apos;événement.
					</p>
					<p className="text-[clamp(0.9rem,2vw,1.1rem)] font-light leading-relaxed text-sabs-muted">
						Nous nous engageons à offrir une couverture professionnelle et
						immersive, transformant chaque moment en une expérience
						audiovisuelle de qualité.
					</p>
				</div>

				{/* Feature cards */}
				<div
					ref={cardsRef}
					className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
				>
					{FEATURES.map((feature) => (
						<div
							key={feature.title}
							className={`relative p-7 rounded-2xl transition-colors duration-300 bg-sabs-bg-3 hover:bg-sabs-bg-hover border-t-2 ${feature.borderClass}`}
						>
							<div
								className={`mb-5 inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bgClass} ${feature.colorClass}`}
							>
								{feature.icon}
							</div>
							<h3 className="text-lg font-bold mb-3 text-white">
								{feature.title}
							</h3>
							<p className="text-sm font-light leading-relaxed text-sabs-muted">
								{feature.desc}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
