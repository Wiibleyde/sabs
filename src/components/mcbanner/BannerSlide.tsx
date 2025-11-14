"use client";
import { gsap } from "gsap";
import { type ReactNode, useEffect, useRef } from "react";

// Nouveau composant réutilisable
export function BannerSlide({
	icon,
	iconColor,
	bgGradient,
	borderColor,
	url,
	urlBg,
	urlBorder,
}: {
	icon: ReactNode;
	iconColor: string;
	bgGradient: string;
	borderColor: string;
	url: string;
	urlBg: string;
	urlBorder: string;
}) {
	const urlRef = useRef<HTMLHeadingElement>(null);
	const iconRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const tl = gsap.timeline();
		tl.fromTo(
			iconRef.current,
			{ scale: 0, rotation: -180 },
			{ scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" },
		).fromTo(
			urlRef.current,
			{ opacity: 0, y: 20 },
			{ opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
			"-=0.2",
		);
	}, []);

	return (
		<div
			className={`w-full h-full flex items-center justify-center p-4 m-2 rounded-2xl backdrop-blur-md border ${borderColor} shadow-xl relative overflow-hidden ${bgGradient}`}
		>
			<div
				className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse`}
			></div>
			<div
				ref={iconRef}
				className={`text-4xl mr-4 ${iconColor} drop-shadow-lg`}
			>
				{icon}
			</div>
			<h2
				ref={urlRef}
				className={`text-lg text-white font-bold ${urlBg} px-4 py-2 rounded-full border ${urlBorder}`}
			>
				{url}
			</h2>
		</div>
	);
}
