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

const CARD_ACCENTS: Array<{
	borderClass: string;
	textClass: string;
	badgeBg: string;
}> = [
	{
		borderClass: "border-t-sabs-green",
		textClass: "text-sabs-green",
		badgeBg: "bg-sabs-green/10 border-sabs-green/20 text-sabs-green",
	},
	{
		borderClass: "border-t-sabs-purple",
		textClass: "text-sabs-purple",
		badgeBg: "bg-sabs-purple/10 border-sabs-purple/20 text-sabs-purple",
	},
	{
		borderClass: "border-t-sabs-red",
		textClass: "text-sabs-red",
		badgeBg: "bg-sabs-red/10 border-sabs-red/20 text-sabs-red",
	},
	{
		borderClass: "border-t-sabs-gold",
		textClass: "text-sabs-gold",
		badgeBg: "bg-sabs-gold/10 border-sabs-gold/20 text-sabs-gold",
	},
];

const COMPETENCY_CLASSES: Record<Competency, string> = {
	"Régie Vidéo": "bg-sabs-purple/10 border-sabs-purple/20 text-sabs-purple",
	"Régie Lumière": "bg-sabs-gold/10 border-sabs-gold/20 text-sabs-gold",
	"Mise en scène": "bg-sabs-green/10 border-sabs-green/20 text-sabs-green",
	Caméraman: "bg-sabs-red/10 border-sabs-red/20 text-sabs-red",
	"Diffusion en direct/rediffusion":
		"bg-sabs-green/10 border-sabs-green/20 text-sabs-green",
};

function getYouTubeId(url: string): string | null {
	const match = url.match(
		/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\n?#]+)/,
	);
	return match ? match[1] : null;
}

function getThumbnailUrl(project: Project): string | null {
	if (project.media.type === "youtube") {
		const id = getYouTubeId(project.media.url);
		return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
	}
	if (project.media.type === "image") return project.media.url;
	return null;
}

function formatDate(isoDate: string): string {
	const [year, month, day] = isoDate.split("-").map(Number);
	const date = new Date(year, month - 1, day);
	return date.toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
	const thumbnailUrl = getThumbnailUrl(project);
	const [showAll, setShowAll] = useState(false);
	const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
	const visible = showAll
		? project.competencies
		: project.competencies.slice(0, 2);
	const remaining = project.competencies.length - 2;

	return (
		<Link
			data-project-card
			href={project.media.url}
			target="_blank"
			rel="noopener noreferrer"
			className={`group flex-shrink-0 snap-start w-5/6 max-w-sm sm:w-72 lg:w-80 block rounded-xl overflow-hidden transition-all duration-300 bg-sabs-bg-3 border-t-2 ${accent.borderClass}`}
		>
			{/* Thumbnail */}
			<div className="relative w-full aspect-video overflow-hidden bg-sabs-bg-4">
				{thumbnailUrl ? (
					<Image
						src={thumbnailUrl}
						alt={project.title}
						fill
						className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
						sizes="(max-width: 640px) 83vw, (max-width: 1024px) 288px, 320px"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<svg
							className="w-10 h-10 text-sabs-muted-3"
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
				<div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-sabs-bg/70 via-transparent to-transparent" />

				{/* Platform badge */}
				{(project.media.type === "youtube" ||
					project.media.type === "twitch") && (
					<div className="absolute top-3 right-3">
						<span
							className={`px-2.5 py-1 text-xs font-bold tracking-widest uppercase rounded-full border ${accent.badgeBg} bg-sabs-bg/80`}
						>
							{project.media.type}
						</span>
					</div>
				)}

				{/* Play overlay */}
				{(project.media.type === "youtube" ||
					project.media.type === "twitch") && (
					<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
						<div className="w-12 h-12 rounded-full flex items-center justify-center sabs-gradient-bg">
							<svg
								className="w-4 h-4 translate-x-px text-sabs-bg"
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

			{/* Body */}
			<div className="p-5">
				<p
					className={`text-xs font-semibold tracking-[0.2em] uppercase mb-2 ${accent.textClass}`}
				>
					{formatDate(project.date)}
				</p>
				<h3 className="text-white font-bold text-lg leading-tight mb-3">
					{project.title}
				</h3>
				{project.description && (
					<p className="text-sm leading-relaxed mb-3 line-clamp-2 text-sabs-muted">
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
							className="px-2.5 py-1 text-xs font-medium rounded-full transition-all duration-200 text-sabs-muted bg-sabs-bg-hover border border-sabs-border-2 hover:text-white"
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
	const [isVisible, setIsVisible] = useState(false);
	const [activeFilter, setActiveFilter] = useState<Competency | null>(null);

	const filteredProjects = activeFilter
		? projects.filter((p) => p.competencies.includes(activeFilter))
		: projects;

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

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.set([headingRef.current, filtersRef.current], { opacity: 0, y: 40 });
			if (gridRef.current)
				gsap.set(Array.from(gridRef.current.children), { opacity: 0, y: 30 });

			ScrollTrigger.create({
				trigger: sectionRef.current,
				start: "top 70%",
				onEnter: () => {
					if (isVisible) return;
					setIsVisible(true);
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
								duration: 0.6,
								ease: "power2.out",
								stagger: 0.1,
							},
							"-=0.3",
						);
				},
			});
		}, sectionRef);

		return () => ctx.revert();
	}, [isVisible]);

	return (
		<section
			ref={sectionRef}
			id="projects"
			className="relative min-h-screen flex flex-col justify-center py-20 md:py-28 bg-sabs-bg"
		>
			{/* Right accent */}
			<div className="absolute right-0 top-0 bottom-0 w-1 sabs-gradient-bg" />

			<div className="container mx-auto px-6 sm:px-10 md:px-16 max-w-6xl">
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
								? "sabs-gradient-bg text-sabs-bg border-transparent"
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
									? "sabs-gradient-bg text-sabs-bg border-transparent"
									: "bg-sabs-bg-3 text-sabs-muted border border-sabs-border hover:text-white"
							}`}
						>
							{comp}
						</button>
					))}
				</div>

				{/* Scroller */}
				<div className="flex items-center gap-3 -mx-4 sm:-mx-6 md:mx-0">
					<button
						type="button"
						onClick={() => handleScroll("left")}
						className="hidden md:flex flex-shrink-0 w-10 h-10 items-center justify-center rounded-full bg-sabs-bg-3 border border-sabs-border text-sabs-muted hover:text-sabs-green transition-colors duration-300"
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
						className="hidden md:flex flex-shrink-0 w-10 h-10 items-center justify-center rounded-full bg-sabs-bg-3 border border-sabs-border text-sabs-muted hover:text-sabs-green transition-colors duration-300"
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

				{filteredProjects.length > 1 && (
					<p className="text-center text-xs mt-4 tracking-widest md:hidden text-sabs-muted-3">
						← Faites défiler →
					</p>
				)}
				{filteredProjects.length === 0 && (
					<div className="text-center py-20">
						<p className="text-lg font-light text-sabs-muted-3">
							Aucun projet pour cette compétence.
						</p>
					</div>
				)}
			</div>
		</section>
	);
}
