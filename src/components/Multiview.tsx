"use client";

import { Children, type ReactNode, type Ref, useEffect, useRef } from "react";

/**
 * Broadcast-style multiview monitor wall.
 *
 * Compound component: `<Multiview>` renders the monitor frame (header bar +
 * grid), `<MultiviewTile>` renders one feed. Tiles accept any content as
 * children (Image, video, iframe…); without children they display a
 * "no signal" placeholder. Tiles carry a `data-mv-tile` attribute so parents
 * can target them for animations (e.g. GSAP staggers).
 *
 * ```tsx
 * <Multiview label="SABS · Multiview">
 *   <MultiviewTile title="Cam A" subtitle="Plateau" accent="#40c395">
 *     <Image src="/feed.jpg" alt="Cam A" fill className="object-cover" />
 *   </MultiviewTile>
 *   <MultiviewTile title="Cam B" subtitle="Régie" accent="#b64457" />
 * </Multiview>
 * ```
 */

// SVG feTurbulence static — cheap CRT noise, no animation cost.
const NOISE_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

const SCANLINES_BG =
	"repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)";

/** Live clock timecode (HH:MM:SS:FF), updated outside React renders. */
export function Timecode({
	fps = 25,
	className = "tabular-nums",
}: {
	fps?: number;
	className?: string;
}) {
	const ref = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const frameMs = 1000 / fps;
		const pad = (n: number) => String(n).padStart(2, "0");
		const id = setInterval(() => {
			if (!ref.current) return;
			const now = new Date();
			const ff = pad(Math.floor(now.getMilliseconds() / frameMs));
			ref.current.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}:${ff}`;
		}, frameMs);
		return () => clearInterval(id);
	}, [fps]);

	return (
		<span ref={ref} className={className}>
			00:00:00:00
		</span>
	);
}

export interface MultiviewTileProps {
	/** Lower-third main line. Lower-third hidden when no title and no subtitle. */
	title?: string;
	/** Lower-third second line, colored with `accent`. */
	subtitle?: string;
	/** Accent color (lower-third bar + subtitle). */
	accent?: string;
	/** Feed state. Defaults to true when children are provided. */
	live?: boolean;
	liveLabel?: string;
	standbyLabel?: string;
	/** Hide the top-right status badge. */
	showStatus?: boolean;
	/** Big ghost text centered in the placeholder (e.g. initials). */
	placeholderText?: string;
	/** Small label under the ghost text. */
	noSignalLabel?: string;
	/** Fully custom placeholder; replaces the default one. */
	placeholder?: ReactNode;
	noise?: boolean;
	scanlines?: boolean;
	vignette?: boolean;
	/** Zoom feed content on hover. */
	hoverZoom?: boolean;
	aspectClassName?: string;
	className?: string;
	/** Feed content (Image, video, iframe…). Absolutely positioned to fill. */
	children?: ReactNode;
}

export function MultiviewTile({
	title,
	subtitle,
	accent = "#40c395",
	live,
	liveLabel = "Live",
	standbyLabel = "Standby",
	showStatus = true,
	placeholderText,
	noSignalLabel = "No Signal",
	placeholder,
	noise = true,
	scanlines = true,
	vignette = true,
	hoverZoom = true,
	aspectClassName = "aspect-video",
	className = "",
	children,
}: MultiviewTileProps) {
	// Children.toArray drops null/undefined/booleans, so `{cond && <Image/>}` works.
	const hasFeed = Children.toArray(children).length > 0;
	const isLive = live ?? hasFeed;

	return (
		<div
			data-mv-tile
			className={`group relative bg-black overflow-hidden ${aspectClassName} ${className}`}
		>
			{hasFeed ? (
				<div
					className={`absolute inset-0 ${
						hoverZoom
							? "transition-transform duration-700 group-hover:scale-[1.03]"
							: ""
					}`}
				>
					{children}
				</div>
			) : (
				(placeholder ?? (
					<div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
						{placeholderText && (
							<span className="text-5xl md:text-6xl font-black tracking-widest text-white/8 select-none">
								{placeholderText}
							</span>
						)}
						<span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-white/25">
							{noSignalLabel}
						</span>
					</div>
				))
			)}

			{/* CRT effects — full strength on standby only; a live feed stays clean */}
			{noise && !hasFeed && (
				<div
					className="absolute inset-0 pointer-events-none opacity-30 group-hover:opacity-10 transition-opacity duration-500"
					style={{ backgroundImage: NOISE_BG }}
				/>
			)}
			{scanlines && (
				<div
					className={`absolute inset-0 pointer-events-none ${hasFeed ? "opacity-30" : ""}`}
					style={{ backgroundImage: SCANLINES_BG }}
				/>
			)}
			{vignette && (
				<div
					className={`absolute inset-0 pointer-events-none ${
						hasFeed
							? "bg-[radial-gradient(ellipse_at_center,transparent_65%,rgba(0,0,0,0.35)_100%)]"
							: "bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)]"
					}`}
				/>
			)}

			{showStatus && (
				<div className="absolute top-3 right-3 flex items-center gap-1.5">
					<span
						className={`w-1.5 h-1.5 rounded-full ${
							isLive ? "bg-sabs-red animate-pulse" : "bg-white/25"
						}`}
					/>
					<span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/50">
						{isLive ? liveLabel : standbyLabel}
					</span>
				</div>
			)}

			{(title || subtitle) && (
				<div className="absolute bottom-3 left-3 right-3 flex">
					<div className="flex items-stretch max-w-full">
						<div
							className="w-1 shrink-0 rounded-l-sm"
							style={{ background: accent }}
						/>
						<div className="bg-black/70 backdrop-blur-sm border-y border-r border-white/10 rounded-r-sm px-3 py-2 min-w-0">
							{title && (
								<p className="text-sm md:text-base font-bold text-white leading-tight truncate">
									{title}
								</p>
							)}
							{subtitle && (
								<p
									className="text-[9px] md:text-[10px] font-semibold tracking-[0.2em] uppercase"
									style={{ color: accent }}
								>
									{subtitle}
								</p>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export interface MultiviewProps {
	/** Header bar left label. */
	label?: ReactNode;
	/** Header bar right side. Defaults to a blinking REC dot + timecode. */
	headerRight?: ReactNode;
	/** Hide the whole header bar. */
	showHeader?: boolean;
	/** Timecode frame rate for the default header. */
	fps?: number;
	/** Grid column classes. */
	columnsClassName?: string;
	className?: string;
	gridClassName?: string;
	ref?: Ref<HTMLDivElement>;
	children: ReactNode;
}

export function Multiview({
	label = "Multiview",
	headerRight,
	showHeader = true,
	fps = 25,
	columnsClassName = "grid-cols-1 sm:grid-cols-2",
	className = "",
	gridClassName = "gap-px bg-sabs-border",
	ref,
	children,
}: MultiviewProps) {
	return (
		<div
			ref={ref}
			className={`rounded-2xl overflow-hidden border border-sabs-border bg-sabs-bg-3 ${className}`}
		>
			{showHeader && (
				<div className="flex items-center justify-between px-4 md:px-5 py-2.5 border-b border-sabs-border text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-sabs-muted">
					<span>{label}</span>
					{headerRight ?? (
						<span className="flex items-center gap-2">
							<span className="w-1.5 h-1.5 rounded-full bg-sabs-red animate-pulse" />
							Rec <Timecode fps={fps} />
						</span>
					)}
				</div>
			)}

			<div className={`grid ${columnsClassName} ${gridClassName}`}>
				{children}
			</div>
		</div>
	);
}
