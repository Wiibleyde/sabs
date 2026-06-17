"use client";

import WhiteLogo from "@public/img/sabs/logo-white.png";
import Image from "next/image";
import { Aurora } from "@/components/reactbits/Aurora";
import { GlitchText } from "@/components/reactbits/GlitchText";
import { Countdown } from "./Countdown";
import type { ObsAccent, ObsSceneConfig } from "./params";

const ACCENT_VARS: Record<ObsAccent, string> = {
	green: "var(--color-sabs-green)",
	purple: "var(--color-sabs-purple)",
	red: "var(--color-sabs-red)",
	gold: "var(--color-sabs-gold)",
};

// Symmetric brand trios — the chosen accent leads, neighbouring brand hues
// fill the flow so the aurora reads as on-brand for every accent.
const AURORA_STOPS: Record<ObsAccent, string[]> = {
	green: ["#40c395", "#615388", "#40c395"],
	purple: ["#615388", "#b64457", "#615388"],
	red: ["#b64457", "#dcb836", "#b64457"],
	gold: ["#dcb836", "#40c395", "#dcb836"],
};

function Decoration({
	config,
	accent,
}: {
	config: ObsSceneConfig;
	accent: string;
}) {
	if (config.variant === "loading") {
		return (
			<div
				className="h-12 w-12 rounded-full border-2 border-sabs-border animate-spin"
				style={{ borderTopColor: accent }}
			/>
		);
	}
	if (config.variant === "starting-soon" && config.until) {
		return <Countdown until={config.until} accent={accent} />;
	}
	return null;
}

/**
 * Full-screen branded scene for OBS browser sources (designed for 1920×1080).
 * Solid sabs-bg fill — use as a standalone OBS scene, not an overlay. All copy
 * comes from the resolved query-param config (see ./params).
 */
export function ObsScene({ config }: { config: ObsSceneConfig }) {
	const accent = ACCENT_VARS[config.accent];

	return (
		<main className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-sabs-bg select-none">
			{/* Aurora background (WebGL). One mirrored instance frames the glow
			    top + bottom in a single pass — half the GPU of two stacked
			    canvases. */}
			{config.bg === "aurora" && (
				<div className="absolute inset-0">
					<Aurora
						colorStops={AURORA_STOPS[config.accent]}
						amplitude={1.6}
						blend={0.4}
						speed={0.8}
						mirror
					/>
				</div>
			)}

			{/* Radial vignette — gentle, just enough to keep text readable */}
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					background:
						"radial-gradient(ellipse 75% 75% at 50% 50%, transparent 55%, color-mix(in srgb, var(--color-sabs-bg) 88%, transparent) 100%)",
				}}
			/>

			<div className="relative z-10 flex flex-col items-center px-6 text-center fade-in">
				{/* Status pill */}
				<div
					className="flex items-center gap-2.5 mb-10 px-4 py-2 rounded-full border"
					style={{
						borderColor: `color-mix(in srgb, ${accent} 40%, transparent)`,
						backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`,
					}}
				>
					<span className="relative flex h-2.5 w-2.5">
						<span
							className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
							style={{ backgroundColor: accent }}
						/>
						<span
							className="relative inline-flex h-2.5 w-2.5 rounded-full"
							style={{ backgroundColor: accent }}
						/>
					</span>
					<span
						className="text-xs font-semibold tracking-[0.3em] uppercase"
						style={{ color: accent }}
					>
						{config.label}
					</span>
				</div>

				{config.showLogo && (
					<Image
						src={WhiteLogo}
						alt="SABS"
						width={96}
						height={96}
						priority
						className="mb-8 drop-shadow-2xl"
					/>
				)}

				<h1 className="text-[clamp(3rem,9vw,7rem)] font-black leading-none tracking-tighter mb-5">
					{config.glitch ? (
						<GlitchText>{config.title}</GlitchText>
					) : (
						<span className="sabs-gradient-text">{config.title}</span>
					)}
				</h1>

				{config.subtitle && (
					<p className="max-w-2xl mb-8 text-sabs-muted font-light tracking-wide text-[clamp(1rem,2.2vw,1.5rem)]">
						{config.subtitle}
					</p>
				)}

				<div className="sabs-gradient-flow rounded-full h-1 w-40 sm:w-64 mb-10" />

				<Decoration config={config} accent={accent} />
			</div>

			{config.hint && (
				<p className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-xs tracking-[0.3em] uppercase text-sabs-muted-3 whitespace-nowrap">
					{config.hint}
				</p>
			)}
		</main>
	);
}
