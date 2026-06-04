"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
	COMPETENCIES,
	type Competency,
	type Project,
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
};

function getYouTubeId(url: string): string | null {
	const m = url.match(
		/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\n?#]+)/,
	);
	return m ? m[1] : null;
}

function getThumbnailUrl(p: Project): string | null {
	if (p.media.type === "youtube") {
		const id = getYouTubeId(p.media.url);
		return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
	}
	if (p.media.type === "image") return p.media.url;
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

function ProjectCard({
	project,
	index,
	grid = false,
}: {
	project: Project;
	index: number;
	grid?: boolean;
}) {
	const thumbnailUrl = getThumbnailUrl(project);
	const [showAll, setShowAll] = useState(false);
	const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
	const num = String(index + 1).padStart(2, "0");
	const visible = showAll
		? project.competencies
		: project.competencies.slice(0, 3);
	const remaining = project.competencies.length - 3;
	const isVideo =
		project.media.type === "youtube" || project.media.type === "twitch";

	return (
		<Link
			data-project-card
			href={project.media.url}
			target="_blank"
			rel="noopener noreferrer"
			className={`group block rounded-2xl overflow-hidden bg-sabs-bg-3 border-t-2 transition-all duration-500 hover:-translate-y-1 ${accent.borderClass} ${
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
				{(project.media.type === "youtube" ||
					project.media.type === "twitch") && (
					<span
						className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-bold tracking-widest uppercase rounded-full border ${accent.badgeClass}`}
					>
						{project.media.type}
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
		</Link>
	);
}

export function Projects() {
	const sectionRef = useRef<HTMLElement>(null);
	const headingRef = useRef<HTMLDivElement>(null);
	const gridRef = useRef<HTMLDivElement>(null);
	const filtersRef = useRef<HTMLDivElement>(null);
	const animatedRef = useRef(false);
	const [activeFilter, setActiveFilter] = useState<Competency | null>(null);

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
								<ProjectCard key={project.id} project={project} index={index} />
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
		</section>
	);
}
