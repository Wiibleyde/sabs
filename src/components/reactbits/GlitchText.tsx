"use client";

/**
 * Broadcast-signal glitch for the brand title.
 * Keeps the SABS gradient fill; two clipped clones flash offset slices
 * on a long loop (mostly quiet, brief glitch burst). Glitch keyframes live
 * in globals.css under `.sabs-glitch`.
 */
export function GlitchText({
	children,
	className = "",
}: {
	children: string;
	className?: string;
}) {
	return (
		<span
			className={`sabs-glitch sabs-gradient-text ${className}`}
			data-text={children}
		>
			{children}
		</span>
	);
}
