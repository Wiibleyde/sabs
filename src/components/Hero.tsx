"use client";

import WhiteLogo from "@public/img/sabs/logo-white.png";
import { gsap } from "gsap";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef } from "react";

const ParticleField = dynamic(
	() => import("./three/ParticleField").then((m) => m.ParticleField),
	{ ssr: false },
);

export function Hero() {
	const logoRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const subtitleRef = useRef<HTMLParagraphElement>(null);
	const lineRef = useRef<HTMLDivElement>(null);
	const ctaRef = useRef<HTMLButtonElement>(null);
	const scrollRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const tl = gsap.timeline({ delay: 0.3 });

		gsap.set(
			[
				logoRef.current,
				titleRef.current,
				subtitleRef.current,
				lineRef.current,
				ctaRef.current,
				scrollRef.current,
			],
			{ opacity: 0, y: 32 },
		);

		tl.to(logoRef.current, {
			opacity: 1,
			y: 0,
			duration: 0.9,
			ease: "power3.out",
		})
			.to(
				titleRef.current,
				{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
				"-=0.5",
			)
			.to(
				subtitleRef.current,
				{ opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
				"-=0.4",
			)
			.to(
				lineRef.current,
				{ opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
				"-=0.3",
			)
			.to(
				ctaRef.current,
				{ opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
				"-=0.2",
			)
			.to(
				scrollRef.current,
				{ opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
				"-=0.1",
			);

		gsap.to(scrollRef.current, {
			y: 8,
			duration: 1.4,
			ease: "power2.inOut",
			yoyo: true,
			repeat: -1,
			delay: 1.5,
		});
	}, []);

	const scrollDown = () => {
		document
			.getElementById("presentation")
			?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<section
			id="hero"
			className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-sabs-bg"
		>
			{/* ThreeJS particles */}
			<div className="absolute inset-0 z-0">
				<ParticleField />
			</div>

			{/* Radial vignette */}
			<div
				className="absolute inset-0 z-0 pointer-events-none"
				style={{
					background:
						"radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, var(--color-sabs-bg) 85%)",
				}}
			/>

			{/* Content */}
			<div className="relative z-10 flex flex-col items-center px-4 text-center">
				<div ref={logoRef} className="mb-10">
					<Image
						src={WhiteLogo}
						alt="SABS"
						width={110}
						height={110}
						className="drop-shadow-2xl"
						priority
					/>
				</div>

				<h1
					ref={titleRef}
					className="sabs-gradient-text text-[clamp(5rem,18vw,14rem)] font-black leading-none tracking-tighter mb-3 select-none"
				>
					SABS
				</h1>

				<p
					ref={subtitleRef}
					className="text-sabs-muted text-[clamp(0.75rem,2vw,1.1rem)] font-light tracking-[0.35em] uppercase mb-8"
				>
					San Andreas Broadcast Service
				</p>

				<div
					ref={lineRef}
					className="sabs-gradient-bg mb-10 rounded-full h-0.5 w-32 sm:w-48 md:w-56"
				/>

				<button
					ref={ctaRef}
					type="button"
					onClick={scrollDown}
					className="group px-10 py-4 rounded-full text-sm font-semibold tracking-[0.2em] uppercase text-sabs-green border border-sabs-green/40 bg-transparent transition-all duration-300 hover:text-sabs-bg hover:border-transparent hover:[background:linear-gradient(90deg,var(--color-sabs-green)_0%,var(--color-sabs-purple)_31%,var(--color-sabs-red)_71%,var(--color-sabs-gold)_100%)]"
				>
					Découvrir
				</button>
			</div>

			{/* Scroll indicator */}
			<button
				ref={scrollRef}
				type="button"
				onClick={scrollDown}
				className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 bg-transparent border-none p-0 cursor-pointer"
			>
				<span className="text-xs tracking-[0.3em] uppercase text-sabs-muted-3">
					Défiler
				</span>
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
					<title>Défiler vers le bas</title>
					<path
						d="M5 8l5 5 5-5"
						stroke="var(--color-sabs-green)"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>
		</section>
	);
}
