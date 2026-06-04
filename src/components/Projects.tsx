"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
	COMPETENCIES,
	type Competency,
	type Project,
	type ProjectMedia,
	projects,
} from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

const CARD_ACCENTS = [
	{
		borderClass: "border-t-sabs-green",
		textClass: "text-sabs-green",
		badgeClass: "bg-sabs-green/10 border-sabs-green/30 text-sabs-green",
		shadowColor: "rgba(64,195,149,0.18)",
	},
	{
		borderClass: "border-t-sabs-purple",
		textClass: "text-sabs-purple",
		badgeClass: "bg-sabs-purple/10 border-sabs-purple/30 text-sabs-purple",
		shadowColor: "rgba(97,83,136,0.18)",
	},
	{
		borderClass: "border-t-sabs-red",
		textClass: "text-sabs-red",
		badgeClass: "bg-sabs-red/10 border-sabs-red/30 text-sabs-red",
		shadowColor: "rgba(182,68,87,0.18)",
	},
	{
		borderClass: "border-t-sabs-gold",
		textClass: "text-sabs-gold",
		badgeClass: "bg-sabs-gold/10 border-sabs-gold/30 text-sabs-gold",
		shadowColor: "rgba(220,184,54,0.18)",
	},
];

const COMPETENCY_CLASSES: Record<Competency, string> = {
	"Régie Vidéo": "bg-sabs-purple/10 border-sabs-purple/30 text-sabs-purple",
	"Régie Lumière": "bg-sabs-gold/10 border-sabs-gold/30 text-sabs-gold",
	"Mise en scène": "bg-sabs-green/10 border-sabs-green/30 text-sabs-green",
	Caméraman: "bg-sabs-red/10 border-sabs-red/30 text-sabs-red",
	"Diffusion en direct/rediffusion":
		"bg-sabs-green/10 border-sabs-green/30 text-sabs-green",
	"Régie mapping écran": "bg-sabs-red/10 border-sabs-red/30 text-sabs-red",
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
			<video
				src={media.url}
				controls
				className="w-full h-full object-contain"
			/>
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

function ProjectModal({
	project,
	onClose,
}: { project: Project; onClose: () => void }) {
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
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
			onClick={onClose}
			onKeyDown={(e) => e.key === "Escape" && onClose()}
		>
			<div
				className="relative w-full max-w-4xl bg-sabs-bg-3 rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
			>
				{/* Header */}
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
						className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-sabs-bg-4 border border-sabs-border text-sabs-muted hover:text-white transition-colors ml-4"
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

				{/* Media area */}
				<div className="relative flex-1 min-h-0 bg-black" style={{ aspectRatio: isImage ? undefined : "16/9", minHeight: "300px" }}>
					{isImage ? (
						<div className="relative w-full" style={{ minHeight: "300px", maxHeight: "60vh" }}>
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
						<div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
							<div className="absolute inset-0">
								<MediaViewer media={media} />
							</div>
						</div>
					)}

					{/* Prev/Next over media */}
					{total > 1 && (
						<>
							<button
								type="button"
								onClick={() => setCurrent((c) => (c - 1 + total) % total)}
								className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 border border-white/10 text-white hover:bg-black/80 transition-colors"
								aria-label="Précédent"
							>
								<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<title>Précédent</title>
									<path d="M15 18l-6-6 6-6" />
								</svg>
							</button>
							<button
								type="button"
								onClick={() => setCurrent((c) => (c + 1) % total)}
								className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 border border-white/10 text-white hover:bg-black/80 transition-colors"
								aria-label="Suivant"
							>
								<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<title>Suivant</title>
									<path d="M9 6l6 6-6 6" />
								</svg>
							</button>
						</>
					)}
				</div>

				{/* Thumbnails strip (when >1 media) */}
				{total > 1 && (
					<div className="flex gap-2 px-6 py-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0 border-t border-sabs-border">
						{project.medias.map((m, i) => {
							const thumb = getMediaThumbnail(m);
							return (
								<button
									key={`${project.id}-thumb-${i}`}
									type="button"
									onClick={() => setCurrent(i)}
									className={`relative flex-shrink-0 w-16 h-10 rounded-lg overflow-hidden border-2 transition-all ${
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
												<svg className="w-4 h-4 text-sabs-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
													<title>Lien</title>
													<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
												</svg>
											) : (
												<svg className="w-4 h-4 text-sabs-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
													<title>Vidéo</title>
													<path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
												</svg>
											)}
										</div>
									)}
								</button>
							);
						})}
					</div>
				)}

				{/* Footer: description + dots */}
				{(project.description || total > 1) && (
					<div className="px-6 py-4 border-t border-sabs-border shrink-0">
						{project.description && (
							<p className="text-sm text-sabs-muted leading-relaxed mb-3">
								{project.description}
							</p>
						)}
						{total > 1 && (
							<div className="flex items-center gap-1.5 justify-center">
								{Array.from({ length: total }).map((_, i) => (
									<button
										key={`dot-${i}`}
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

function ProjectCard({
	project,
	index,
	grid = false,
	onClick,
}: {
	project: Project;
	index: number;
	grid?: boolean;
	onClick: () => void;
}) {
	const thumbnailUrl = getProjectThumbnail(project);
	const [showAll, setShowAll] = useState(false);
	const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
	const num = String(index + 1).padStart(2, "0");
	const visible = showAll
		? project.competencies
		: project.competencies.slice(0, 3);
	const remaining = project.competencies.length - 3;
	const firstMedia = project.medias[0];
	const isVideo =
		firstMedia?.type === "youtube" || firstMedia?.type === "twitch";
	const mediaCount = project.medias.length;

	return (
		<div
			data-project-card
			role="button"
			tabIndex={0}
			onClick={onClick}
			onKeyDown={(e) => e.key === "Enter" && onClick()}
			className={`group block rounded-2xl overflow-hidden bg-sabs-bg-3 border-t-2 transition-all duration-500 hover:-translate-y-1 cursor-pointer ${accent.borderClass} ${
				grid ? "w-full" : "flex-shrink-0 snap-start w-5/6 max-w-sm sm:w-80"
			}`}
			style={{ "--shadow-color": accent.shadowColor } as React.CSSProperties}
			onMouseEnter={(e) => {
				(e.currentTarget as HTMLElement).style.boxShadow =
					`0 24px 48px -8px ${accent.shadowColor}`;
			}}
			onMouseLeave={(e) => {
				(e.currentTarget as HTMLElement).style.boxShadow = "none";
			}}
		>
			{/* Thumbnail */}
			<div className="relative w-full aspect-video overflow-hidden bg-sabs-bg-4">
				{thumbnailUrl ? (
					<Image
						src={thumbnailUrl}
						alt={project.title}
						fill
						className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
						sizes={
							grid
								? "(max-width: 640px) 100vw, 50vw"
								: "(max-width: 640px) 83vw, 320px"
						}
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center">
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
				)}

				{/* Dark gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-sabs-bg/80 via-sabs-bg/10 to-transparent pointer-events-none" />

				{/* Big number watermark */}
				<div
					className="absolute bottom-2 right-4 font-black leading-none select-none pointer-events-none text-white"
					style={{ fontSize: grid ? "7rem" : "5rem", opacity: 0.07 }}
					aria-hidden="true"
				>
					{num}
				</div>

				{/* Platform badge */}
				{(firstMedia?.type === "youtube" || firstMedia?.type === "twitch") && (
					<span
						className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-bold tracking-widest uppercase rounded-full border ${accent.badgeClass}`}
					>
						{firstMedia.type}
					</span>
				)}

				{/* Media count badge */}
				{mediaCount > 1 && (
					<span className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full bg-black/60 border border-white/10 text-white">
						<svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
							<title>Galerie</title>
							<rect x="3" y="3" width="7" height="7" rx="1" />
							<rect x="14" y="3" width="7" height="7" rx="1" />
							<rect x="3" y="14" width="7" height="7" rx="1" />
							<rect x="14" y="14" width="7" height="7" rx="1" />
						</svg>
						{mediaCount}
					</span>
				)}

				{/* Play button */}
				{isVideo && (
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
				)}
			</div>

			{/* Info */}
			<div className={`${grid ? "p-7" : "p-5"}`}>
				<div className="flex items-start justify-between gap-3 mb-2">
					<p
						className={`text-xs font-semibold tracking-[0.2em] uppercase ${accent.textClass}`}
					>
						{formatDate(project.date)}
					</p>
					<span
						className="text-xs font-black text-white/10 leading-none shrink-0"
						aria-hidden="true"
					>
						{num}
					</span>
				</div>

				<h3
					className={`font-black text-white leading-tight mb-4 ${grid ? "text-2xl md:text-3xl" : "text-xl"}`}
				>
					{project.title}
				</h3>

				{project.description && (
					<p className="text-sm leading-relaxed mb-4 line-clamp-2 text-sabs-muted">
						{project.description}
					</p>
				)}

				<div className="flex flex-wrap gap-1.5 items-center">
					{visible.map((comp) => (
						<span
							key={comp}
							className={`px-2.5 py-1 text-xs font-medium rounded-full border ${COMPETENCY_CLASSES[comp]}`}
						>
							{comp}
						</span>
					))}
					{!showAll && remaining > 0 && (
						<button
							type="button"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								setShowAll(true);
							}}
							className="px-2.5 py-1 text-xs font-medium rounded-full bg-sabs-bg-hover border border-sabs-border-2 text-sabs-muted hover:text-white transition-colors"
						>
							+{remaining}
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

export function Projects() {
	const sectionRef = useRef<HTMLElement>(null);
	const headingRef = useRef<HTMLDivElement>(null);
	const gridRef = useRef<HTMLDivElement>(null);
	const filtersRef = useRef<HTMLDivElement>(null);
	const animatedRef = useRef(false);
	const [activeFilter, setActiveFilter] = useState<Competency | null>(null);
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);

	const filteredProjects = activeFilter
		? projects.filter((p) => p.competencies.includes(activeFilter))
		: projects;

	const useGrid = filteredProjects.length <= 4;

	const handleScroll = (dir: "left" | "right") => {
		if (!gridRef.current) return;
		const card = gridRef.current.querySelector("[data-project-card]");
		const cardWidth = card ? (card as HTMLElement).offsetWidth : 320;
		const gap = window.innerWidth >= 768 ? 20 : 16;
		gridRef.current.scrollBy({
			left: dir === "right" ? cardWidth + gap : -(cardWidth + gap),
			behavior: "smooth",
		});
	};

	// Reset animation guard when filter changes so new items can animate in
	// biome-ignore lint/correctness/useExhaustiveDependencies: animatedRef is a ref, not state
	useEffect(() => {
		animatedRef.current = false;
	}, [activeFilter]);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.set([headingRef.current, filtersRef.current], { opacity: 0, y: 40 });
			if (gridRef.current)
				gsap.set(Array.from(gridRef.current.children), { opacity: 0, y: 50 });

			ScrollTrigger.create({
				trigger: sectionRef.current,
				start: "top 65%",
				onEnter: () => {
					if (animatedRef.current) return;
					animatedRef.current = true;
					const tl = gsap.timeline();
					tl.to(headingRef.current, {
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
							gridRef.current ? Array.from(gridRef.current.children) : [],
							{
								opacity: 1,
								y: 0,
								duration: 0.8,
								ease: "power3.out",
								stagger: 0.15,
							},
							"-=0.3",
						);
				},
			});
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	return (
		<section
			ref={sectionRef}
			id="projects"
			className="relative min-h-screen flex flex-col justify-center py-20 md:py-28 bg-sabs-bg"
		>
			<div className="absolute right-0 top-0 bottom-0 w-1 sabs-gradient-bg" />

			<div className="container mx-auto px-6 sm:px-10 md:px-16 max-w-6xl">
				{/* Heading */}
				<div ref={headingRef} className="mb-10 md:mb-12">
					<p className="text-xs font-semibold tracking-[0.4em] uppercase mb-4 text-sabs-green">
						Portfolio
					</p>
					<h2 className="text-[clamp(2.5rem,7vw,5rem)] font-black leading-none tracking-tighter text-white mb-4">
						Nos <span className="sabs-gradient-text">Réalisations</span>
					</h2>
					<p className="text-base font-light text-sabs-muted">
						Découvrez nos projets récents et les compétences mises en œuvre.
					</p>
				</div>

				{/* Filters */}
				<div ref={filtersRef} className="flex flex-wrap gap-2 mb-10">
					<button
						type="button"
						onClick={() => setActiveFilter(null)}
						className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
							activeFilter === null
								? "sabs-gradient-bg text-sabs-bg"
								: "bg-sabs-bg-3 text-sabs-muted border border-sabs-border hover:text-white"
						}`}
					>
						Tous
					</button>
					{COMPETENCIES.map((comp) => (
						<button
							key={comp}
							type="button"
							onClick={() =>
								setActiveFilter(comp === activeFilter ? null : comp)
							}
							className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
								activeFilter === comp
									? "sabs-gradient-bg text-sabs-bg"
									: "bg-sabs-bg-3 text-sabs-muted border border-sabs-border hover:text-white"
							}`}
						>
							{comp}
						</button>
					))}
				</div>

				{/* Grid (≤4) or horizontal scroll (5+) */}
				{useGrid ? (
					<div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						{filteredProjects.map((project, index) => (
							<ProjectCard
								key={project.id}
								project={project}
								index={index}
								grid
								onClick={() => setSelectedProject(project)}
							/>
						))}
					</div>
				) : (
					<div className="flex items-center gap-3 -mx-4 sm:-mx-6 md:mx-0">
						<button
							type="button"
							onClick={() => handleScroll("left")}
							className="hidden md:flex flex-shrink-0 w-10 h-10 items-center justify-center rounded-full bg-sabs-bg-3 border border-sabs-border text-sabs-muted hover:text-sabs-green transition-colors"
							aria-label="Précédent"
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
								<title>Précédent</title>
								<path d="M15 18l-6-6 6-6" />
							</svg>
						</button>

						<div
							ref={gridRef}
							className="flex-1 flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory pb-4 px-4 sm:px-6 md:px-0 min-w-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
						>
							{filteredProjects.map((project, index) => (
								<ProjectCard
									key={project.id}
									project={project}
									index={index}
									onClick={() => setSelectedProject(project)}
								/>
							))}
						</div>

						<button
							type="button"
							onClick={() => handleScroll("right")}
							className="hidden md:flex flex-shrink-0 w-10 h-10 items-center justify-center rounded-full bg-sabs-bg-3 border border-sabs-border text-sabs-muted hover:text-sabs-green transition-colors"
							aria-label="Suivant"
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
								<title>Suivant</title>
								<path d="M9 6l6 6-6 6" />
							</svg>
						</button>
					</div>
				)}

				{filteredProjects.length === 0 && (
					<p className="text-center py-20 text-lg font-light text-sabs-muted-3">
						Aucun projet pour cette compétence.
					</p>
				)}
			</div>

			{selectedProject && (
				<ProjectModal
					project={selectedProject}
					onClose={() => setSelectedProject(null)}
				/>
			)}
		</section>
	);
}
