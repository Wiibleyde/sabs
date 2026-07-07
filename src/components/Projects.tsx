"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	COMPETENCIES,
	type Competency,
	type Project,
	type ProjectMedia,
	projects,
} from "@/data/projects";
import { useGsapContext } from "@/hooks/useGsapContext";
import { ScrollReveal } from "./reactbits/ScrollReveal";

const RAINBOW_GRADIENT =
	"linear-gradient(90deg,#e40303,#ff8c00,#ffed00,#008026,#004dff,#750787)";
// Full literal so Tailwind JIT emits it; `image:` hint forces a background-image.
const RAINBOW_TEXT_CLASS =
	"text-transparent bg-clip-text bg-[image:linear-gradient(90deg,#e40303,#ff8c00,#ffed00,#008026,#004dff,#750787)]";

// Brand color rotation (r,g,b) used for accent line, date text and hover glow.
const ACCENTS = [
	{ rgb: "64,195,149", text: "text-sabs-green" },
	{ rgb: "97,83,136", text: "text-sabs-purple" },
	{ rgb: "182,68,87", text: "text-sabs-red" },
	{ rgb: "220,184,54", text: "text-sabs-gold" },
];

interface Accent {
	text: string;
	line: string;
	glow: string;
}

function getAccent(project: Project, index: number): Accent {
	if (project.accent === "rainbow") {
		return {
			text: RAINBOW_TEXT_CLASS,
			line: RAINBOW_GRADIENT,
			glow: "rgba(228,3,3,0.35)",
		};
	}
	const a = ACCENTS[index % ACCENTS.length];
	return {
		text: a.text,
		line: `rgb(${a.rgb})`,
		glow: `rgba(${a.rgb},0.35)`,
	};
}

function glowStyle(accent: Accent): React.CSSProperties {
	return { "--glow": accent.glow } as React.CSSProperties;
}

const COMPETENCY_CLASSES: Record<Competency, string> = {
	"Régie Vidéo": "bg-sabs-purple/10 border-sabs-purple/30 text-sabs-purple",
	"Régie Lumière": "bg-sabs-gold/10 border-sabs-gold/30 text-sabs-gold",
	"Mise en scène": "bg-sabs-green/10 border-sabs-green/30 text-sabs-green",
	Caméraman: "bg-sabs-red/10 border-sabs-red/30 text-sabs-red",
	"Diffusion en direct/rediffusion":
		"bg-sabs-green/10 border-sabs-green/30 text-sabs-green",
	"Régie mapping écran": "bg-sabs-red/10 border-sabs-red/30 text-sabs-red",
	Pyrotechnie: "bg-sabs-gold/10 border-sabs-gold/30 text-sabs-gold",
};

function getYouTubeId(url: string): string | null {
	const m = url.match(
		/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\n?#]+)/,
	);
	return m ? m[1] : null;
}

function getMediaThumbnail(media: ProjectMedia): string | null {
	if (media.type === "youtube") {
		const id = getYouTubeId(media.url);
		return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
	}
	if (media.type === "image") return media.url;
	return null;
}

function getProjectThumbnail(p: Project): string | null {
	for (const m of p.medias) {
		const thumb = getMediaThumbnail(m);
		if (thumb) return thumb;
	}
	return null;
}

function formatDate(iso: string): string {
	const [y, m, d] = iso.split("-").map(Number);
	return new Date(y, m - 1, d).toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

function isVideoMedia(media?: ProjectMedia): boolean {
	return media?.type === "youtube" || media?.type === "twitch";
}

function CompetencyPills({
	competencies,
	max = 3,
}: {
	competencies: Competency[];
	max?: number;
}) {
	const visible = competencies.slice(0, max);
	const remaining = competencies.length - max;
	return (
		<div className="flex flex-wrap gap-1.5 items-center">
			{visible.map((comp) => (
				<span
					key={comp}
					className={`px-2.5 py-1 text-[11px] font-medium rounded-full border ${COMPETENCY_CLASSES[comp]}`}
				>
					{comp}
				</span>
			))}
			{remaining > 0 && (
				<span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-sabs-bg-hover border border-sabs-border-2 text-sabs-muted">
					+{remaining}
				</span>
			)}
		</div>
	);
}

function PlayOverlay() {
	return (
		<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
			<div className="w-14 h-14 rounded-full flex items-center justify-center sabs-gradient-bg shadow-2xl">
				<svg
					className="w-5 h-5 translate-x-px text-sabs-bg"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<title>Lire</title>
					<path d="M8 5v14l11-7z" />
				</svg>
			</div>
		</div>
	);
}

function GalleryBadge({ count }: { count: number }) {
	return (
		<span className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full bg-black/60 border border-white/10 text-white backdrop-blur-sm">
			<svg
				className="w-3 h-3"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth="2"
			>
				<title>Galerie</title>
				<rect x="3" y="3" width="7" height="7" rx="1" />
				<rect x="14" y="3" width="7" height="7" rx="1" />
				<rect x="3" y="14" width="7" height="7" rx="1" />
				<rect x="14" y="14" width="7" height="7" rx="1" />
			</svg>
			{count}
		</span>
	);
}

function ThumbnailFallback() {
	return (
		<div className="w-full h-full flex items-center justify-center bg-sabs-bg-4">
			<svg
				className="w-12 h-12 text-sabs-muted-3"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth="1"
			>
				<title>Média</title>
				<rect x="2" y="7" width="15" height="10" rx="2" />
				<path d="M17 10l4-2v8l-4-2" />
			</svg>
		</div>
	);
}

function MediaViewer({ media }: { media: ProjectMedia }) {
	if (media.type === "youtube") {
		const id = getYouTubeId(media.url);
		if (!id) return null;
		return (
			<iframe
				src={`https://www.youtube.com/embed/${id}?autoplay=0`}
				title="YouTube video"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
				className="w-full h-full"
			/>
		);
	}
	if (media.type === "image") {
		return (
			<Image
				src={media.url}
				alt="Média"
				fill
				className="object-contain"
				sizes="(max-width: 768px) 100vw, 80vw"
			/>
		);
	}
	if (media.type === "video") {
		return (
			<video src={media.url} controls className="w-full h-full object-contain">
				<track kind="captions" />
			</video>
		);
	}
	if (media.type === "link") {
		return (
			<div className="flex flex-col items-center justify-center h-full gap-4">
				<svg
					className="w-16 h-16 text-sabs-muted-3"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth="1.5"
				>
					<title>Lien externe</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
					/>
				</svg>
				<a
					href={media.url}
					target="_blank"
					rel="noopener noreferrer"
					className="px-6 py-3 rounded-full sabs-gradient-bg text-sabs-bg font-bold text-sm tracking-wider hover:opacity-90 transition-opacity"
				>
					Ouvrir le lien
				</a>
			</div>
		);
	}
	return null;
}

function NavButton({
	direction,
	onClick,
}: {
	direction: "prev" | "next";
	onClick: () => void;
}) {
	const isPrev = direction === "prev";
	const label = isPrev ? "Précédent" : "Suivant";
	return (
		<button
			type="button"
			onClick={onClick}
			className={`absolute ${isPrev ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 border border-white/10 text-white hover:bg-black/80 transition-colors`}
			aria-label={label}
		>
			<svg
				className="w-4 h-4"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<title>{label}</title>
				<path d={isPrev ? "M15 18l-6-6 6-6" : "M9 6l6 6-6 6"} />
			</svg>
		</button>
	);
}

function ProjectModal({
	project,
	onClose,
}: {
	project: Project;
	onClose: () => void;
}) {
	const [current, setCurrent] = useState(0);
	const total = project.medias.length;
	const media = project.medias[current];
	const isImage = media.type === "image";

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowRight") setCurrent((c) => (c + 1) % total);
			if (e.key === "ArrowLeft") setCurrent((c) => (c - 1 + total) % total);
		};
		window.addEventListener("keydown", handler);
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", handler);
			document.body.style.overflow = "";
		};
	}, [onClose, total]);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
			<button
				type="button"
				className="absolute inset-0 w-full h-full cursor-default"
				onClick={onClose}
				aria-label="Fermer"
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-label={project.title}
				className="relative w-full max-w-4xl bg-sabs-bg-3 rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
			>
				<div className="flex items-center justify-between px-6 py-4 border-b border-sabs-border shrink-0">
					<div>
						<p className="text-xs font-semibold tracking-[0.2em] uppercase text-sabs-green mb-0.5">
							{formatDate(project.date)}
						</p>
						<h3 className="text-xl font-black text-white leading-tight">
							{project.title}
						</h3>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-sabs-bg-4 border border-sabs-border text-sabs-muted hover:text-white transition-colors ml-4"
						aria-label="Fermer"
					>
						<svg
							className="w-4 h-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>Fermer</title>
							<path d="M18 6L6 18M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div
					className="relative flex-1 min-h-0 bg-black"
					style={{
						aspectRatio: isImage ? undefined : "16/9",
						minHeight: "300px",
					}}
				>
					{isImage ? (
						<div
							className="relative w-full"
							style={{ minHeight: "300px", maxHeight: "60vh" }}
						>
							<Image
								src={media.url}
								alt="Média"
								width={1200}
								height={800}
								className="w-full h-full object-contain max-h-[60vh]"
								sizes="(max-width: 768px) 100vw, 80vw"
							/>
						</div>
					) : (
						<div
							className="relative w-full"
							style={{ paddingBottom: "56.25%" }}
						>
							<div className="absolute inset-0 h-full">
								<MediaViewer media={media} />
							</div>
						</div>
					)}

					{total > 1 && (
						<>
							<NavButton
								direction="prev"
								onClick={() => setCurrent((c) => (c - 1 + total) % total)}
							/>
							<NavButton
								direction="next"
								onClick={() => setCurrent((c) => (c + 1) % total)}
							/>
						</>
					)}
				</div>

				{total > 1 && (
					<div className="flex gap-2 px-6 py-3 overflow-x-auto scrollbar-none shrink-0 border-t border-sabs-border">
						{project.medias.map((m, i) => {
							const thumb = getMediaThumbnail(m);
							return (
								<button
									key={m.url}
									type="button"
									onClick={() => setCurrent(i)}
									className={`relative shrink-0 w-16 h-10 rounded-lg overflow-hidden border-2 transition-all ${
										i === current
											? "border-sabs-green"
											: "border-transparent opacity-50 hover:opacity-80"
									}`}
									aria-label={`Média ${i + 1}`}
								>
									{thumb ? (
										<Image
											src={thumb}
											alt={`Média ${i + 1}`}
											fill
											className="object-cover"
											sizes="64px"
										/>
									) : (
										<div className="w-full h-full bg-sabs-bg-4 flex items-center justify-center">
											{m.type === "link" ? (
												<svg
													className="w-4 h-4 text-sabs-muted"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													strokeWidth="1.5"
												>
													<title>Lien</title>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
													/>
												</svg>
											) : (
												<svg
													className="w-4 h-4 text-sabs-muted"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													strokeWidth="1.5"
												>
													<title>Vidéo</title>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
													/>
												</svg>
											)}
										</div>
									)}
								</button>
							);
						})}
					</div>
				)}

				{(project.description || total > 1) && (
					<div className="px-6 py-4 border-t border-sabs-border shrink-0">
						{project.description && (
							<p className="text-sm text-sabs-muted leading-relaxed mb-3">
								{project.description}
							</p>
						)}
						{total > 1 && (
							<div className="flex items-center gap-1.5 justify-center">
								{project.medias.map((m, i) => (
									<button
										key={m.url}
										type="button"
										onClick={() => setCurrent(i)}
										className={`rounded-full transition-all ${
											i === current
												? "w-4 h-1.5 bg-sabs-green"
												: "w-1.5 h-1.5 bg-sabs-muted-3 hover:bg-sabs-muted"
										}`}
										aria-label={`Média ${i + 1}`}
									/>
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

/** Large hero card for the most recent project. */
function FeaturedCard({
	project,
	index,
	onClick,
}: {
	project: Project;
	index: number;
	onClick: () => void;
}) {
	const thumbnailUrl = getProjectThumbnail(project);
	const accent = getAccent(project, index);
	const isVideo = isVideoMedia(project.medias[0]);
	const mediaCount = project.medias.length;

	return (
		<button
			type="button"
			data-reveal
			onClick={onClick}
			style={glowStyle(accent)}
			className="group relative w-full text-left rounded-3xl overflow-hidden bg-sabs-bg-3 border border-sabs-border transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_-20px_var(--glow)]"
		>
			<div
				className="absolute top-0 inset-x-0 h-1 z-20"
				style={{ background: accent.line }}
			/>

			<div className="grid md:grid-cols-2">
				<div className="relative aspect-video md:aspect-auto md:min-h-85 overflow-hidden">
					{thumbnailUrl ? (
						<Image
							src={thumbnailUrl}
							alt={project.title}
							fill
							className="object-cover transition-transform duration-700 group-hover:scale-105"
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
					) : (
						<ThumbnailFallback />
					)}
					{/* seam gradient blending media into content */}
					<div className="absolute inset-0 bg-linear-to-t from-sabs-bg-3/80 via-transparent to-transparent md:bg-linear-to-r md:from-transparent md:to-sabs-bg-3" />
					{mediaCount > 1 && <GalleryBadge count={mediaCount} />}
					{isVideo && <PlayOverlay />}
				</div>

				<div className="relative flex flex-col justify-center p-7 md:p-10">
					<div className="flex items-center gap-3 mb-4">
						<span className="text-[11px] font-black tracking-[0.3em] uppercase px-3 py-1 rounded-full border border-sabs-border-2 text-sabs-muted">
							À la une
						</span>
						<span
							className={`text-xs font-bold tracking-[0.2em] uppercase ${accent.text}`}
						>
							{formatDate(project.date)}
						</span>
					</div>

					<h3 className="font-black text-white leading-[1.05] tracking-tight text-3xl md:text-4xl lg:text-5xl mb-4">
						{project.title}
					</h3>

					{project.description && (
						<p className="text-sm md:text-base leading-relaxed text-sabs-muted mb-6 max-w-prose line-clamp-3">
							{project.description}
						</p>
					)}

					<div className="mb-6">
						<CompetencyPills competencies={project.competencies} max={5} />
					</div>

					<span className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover:gap-3 transition-all">
						Voir le projet
						<svg
							className="w-4 h-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>Ouvrir</title>
							<path d="M5 12h14M13 6l6 6-6 6" />
						</svg>
					</span>
				</div>
			</div>
		</button>
	);
}

/** Compact card used in the grid below the feature. */
function ProjectCard({
	project,
	index,
	onClick,
}: {
	project: Project;
	index: number;
	onClick: () => void;
}) {
	const thumbnailUrl = getProjectThumbnail(project);
	const accent = getAccent(project, index);
	const firstMedia = project.medias[0];
	const isVideo = isVideoMedia(firstMedia);
	const mediaCount = project.medias.length;

	return (
		<button
			type="button"
			data-reveal
			onClick={onClick}
			style={glowStyle(accent)}
			className="group relative flex flex-col text-left rounded-2xl overflow-hidden bg-sabs-bg-3 border border-sabs-border transition-all duration-500 hover:-translate-y-1 hover:border-sabs-border-2 hover:shadow-[0_24px_50px_-16px_var(--glow)]"
		>
			<div
				className="absolute top-0 inset-x-0 h-0.5 z-20"
				style={{ background: accent.line }}
			/>

			<div className="relative w-full aspect-video overflow-hidden">
				{thumbnailUrl ? (
					<Image
						src={thumbnailUrl}
						alt={project.title}
						fill
						className="object-cover transition-transform duration-700 group-hover:scale-105"
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					/>
				) : (
					<ThumbnailFallback />
				)}
				<div className="absolute inset-0 bg-linear-to-t from-sabs-bg-3/90 via-sabs-bg/10 to-transparent pointer-events-none" />

				{isVideo && (
					<span
						className={`absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full bg-black/60 border border-white/10 text-white backdrop-blur-sm`}
					>
						{firstMedia.type}
					</span>
				)}
				{mediaCount > 1 && <GalleryBadge count={mediaCount} />}
				{isVideo && <PlayOverlay />}
			</div>

			<div className="flex flex-col flex-1 p-5">
				<p
					className={`text-xs font-semibold tracking-[0.18em] uppercase mb-2 ${accent.text}`}
				>
					{formatDate(project.date)}
				</p>

				<h3 className="font-black text-white leading-tight text-lg mb-3">
					{project.title}
				</h3>

				{project.description && (
					<p className="text-sm leading-relaxed mb-4 line-clamp-2 text-sabs-muted">
						{project.description}
					</p>
				)}

				<div className="mt-auto">
					<CompetencyPills competencies={project.competencies} max={3} />
				</div>
			</div>
		</button>
	);
}

function FilterPill({
	active,
	label,
	onClick,
}: {
	active: boolean;
	label: string;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
				active
					? "sabs-gradient-bg text-sabs-bg"
					: "bg-sabs-bg-3 text-sabs-muted border border-sabs-border hover:text-white hover:border-sabs-border-2"
			}`}
		>
			{label}
		</button>
	);
}

export function Projects() {
	const sectionRef = useRef<HTMLElement>(null);
	const headingRef = useRef<HTMLDivElement>(null);
	const filtersRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const animatedRef = useRef(false);
	const [activeFilter, setActiveFilter] = useState<Competency | null>(null);
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);

	const closeModal = useCallback(() => setSelectedProject(null), []);

	// Most recent project is featured; the rest fill the grid.
	const [featured, ...rest] = useMemo(() => {
		const filtered = activeFilter
			? projects.filter((p) => p.competencies.includes(activeFilter))
			: projects;
		return [...filtered].sort((a, b) => b.date.localeCompare(a.date));
	}, [activeFilter]);

	useGsapContext(sectionRef, () => {
		const reveals = contentRef.current
			? Array.from(contentRef.current.querySelectorAll("[data-reveal]"))
			: [];
		gsap.set([headingRef.current, filtersRef.current], { opacity: 0, y: 40 });
		gsap.set(reveals, { opacity: 0, y: 50 });

		ScrollTrigger.create({
			trigger: sectionRef.current,
			start: "top 65%",
			onEnter: () => {
				if (animatedRef.current) return;
				animatedRef.current = true;
				gsap
					.timeline()
					.to(headingRef.current, {
						opacity: 1,
						y: 0,
						duration: 0.9,
						ease: "power3.out",
					})
					.to(
						filtersRef.current,
						{ opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
						"-=0.5",
					)
					.to(
						reveals,
						{
							opacity: 1,
							y: 0,
							duration: 0.8,
							ease: "power3.out",
							stagger: 0.12,
						},
						"-=0.3",
					);
			},
		});
	});

	return (
		<section
			ref={sectionRef}
			id="projects"
			className="relative min-h-screen flex flex-col justify-center py-20 md:py-28 bg-sabs-bg"
		>
			<div className="absolute right-0 top-0 bottom-0 w-1 sabs-gradient-bg-vertical" />

			<div className="container mx-auto px-6 sm:px-10 md:px-16 max-w-6xl">
				<div ref={headingRef} className="mb-10 md:mb-12">
					<p className="text-xs font-semibold tracking-[0.4em] uppercase mb-4 text-sabs-green">
						Portfolio
					</p>
					<ScrollReveal
						as="h2"
						highlight="Réalisations"
						start="top 65%"
						className="text-[clamp(2.5rem,7vw,5rem)] font-black leading-none tracking-tighter text-white mb-4"
					>
						Nos Réalisations
					</ScrollReveal>
					<p className="text-base font-light text-sabs-muted">
						Découvrez nos projets récents et les compétences mises en œuvre.
					</p>
				</div>

				<div ref={filtersRef} className="flex flex-wrap gap-2 mb-10">
					<FilterPill
						active={activeFilter === null}
						label="Tous"
						onClick={() => setActiveFilter(null)}
					/>
					{COMPETENCIES.map((comp) => (
						<FilterPill
							key={comp}
							active={activeFilter === comp}
							label={comp}
							onClick={() =>
								setActiveFilter(comp === activeFilter ? null : comp)
							}
						/>
					))}
				</div>

				<div ref={contentRef} className="flex flex-col gap-6">
					{featured && (
						<FeaturedCard
							project={featured}
							index={0}
							onClick={() => setSelectedProject(featured)}
						/>
					)}

					{rest.length > 0 && (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{rest.map((project, i) => (
								<ProjectCard
									key={project.id}
									project={project}
									index={i + 1}
									onClick={() => setSelectedProject(project)}
								/>
							))}
						</div>
					)}
				</div>

				{!featured && (
					<p className="text-center py-20 text-lg font-light text-sabs-muted-3">
						Aucun projet pour cette compétence.
					</p>
				)}
			</div>

			{selectedProject && (
				<ProjectModal project={selectedProject} onClose={closeModal} />
			)}
		</section>
	);
}
