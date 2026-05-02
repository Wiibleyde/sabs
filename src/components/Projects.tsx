"use client";

import { gsap } from "gsap";
import { Be_Vietnam_Pro } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import GlassSurface from "@/components/ui/GlassSurface";
import {
	COMPETENCIES,
	COMPETENCY_COLORS,
	type Competency,
	type Project,
	projects,
} from "@/data/projects";

const BeVietnam = Be_Vietnam_Pro({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

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
	if (project.media.type === "image") {
		return project.media.url;
	}
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

function ProjectCard({ project }: { project: Project; index: number }) {
	const thumbnailUrl = getThumbnailUrl(project);
	const [showAllCompetencies, setShowAllCompetencies] = useState(false);
	const visibleCompetencies = showAllCompetencies
		? project.competencies
		: project.competencies.slice(0, 2);
	const remainingCount = project.competencies.length - 2;

	return (
		<Link
			data-project-card
			href={project.media.url}
			target="_blank"
			rel="noopener noreferrer"
			className="group flex-shrink-0 snap-start w-[83vw] max-w-[360px] sm:w-72 lg:w-80 block bg-[#0c1524] rounded-2xl border border-white/10 hover:border-sabs-primary/25 shadow-[0_8px_28px_0_rgba(0,0,0,0.40)] hover:shadow-[0_16px_40px_0_rgba(0,0,0,0.55)] transition-all duration-300 overflow-hidden"
		>
			{/* Thumbnail */}
			<div className="relative w-full aspect-video bg-gray-800 overflow-hidden">
				{thumbnailUrl ? (
					<Image
						src={thumbnailUrl}
						alt={project.title}
						fill
						className="object-cover saturate-[1.05] contrast-110 group-hover:scale-[1.03] transition-transform duration-700"
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<svg
							className="w-12 h-12 text-gray-600"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Projet</title>
							<path d="M8 5v14l11-7z" />
						</svg>
					</div>
				)}

				<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/5" />

				{/* Play indicator – GlassSurface */}
				{(project.media.type === "youtube" ||
					project.media.type === "twitch") && (
					<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
						<GlassSurface
							width={52}
							height={52}
							borderRadius={26}
							blur={14}
							backgroundOpacity={0.18}
							brightness={65}
							opacity={0.95}
						>
							<svg
								className="w-4 h-4 text-white translate-x-[1px]"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<title>Lire</title>
								<path d="M8 6.8v10.4a1 1 0 0 0 1.52.85l8.1-5.2a1 1 0 0 0 0-1.7l-8.1-5.2A1 1 0 0 0 8 6.8z" />
							</svg>
						</GlassSurface>
					</div>
				)}

				{/* Platform badge */}
				<div className="absolute top-2 right-2">
					{project.media.type === "youtube" && (
						<span className="px-2 py-1 bg-black/60 text-white text-[11px] font-semibold rounded-md backdrop-blur-sm border border-white/25">
							YouTube
						</span>
					)}
					{project.media.type === "twitch" && (
						<span className="px-2 py-1 bg-black/60 text-white text-[11px] font-semibold rounded-md backdrop-blur-sm border border-white/25">
							Twitch
						</span>
					)}
				</div>
			</div>

			{/* Card body */}
			<div className="p-4 md:p-5 border-t border-white/10">
				<p className="text-gray-400/85 text-[11px] font-medium mb-2 tracking-[0.12em] uppercase">
					{formatDate(project.date)}
				</p>
				<h3 className="text-white font-semibold text-xl md:text-2xl mb-3 leading-tight">
					{project.title}
				</h3>
				{project.description && (
					<p className="text-gray-300/90 text-sm mb-3 leading-relaxed line-clamp-2">
						{project.description}
					</p>
				)}

				{/* Competency badges */}
				<div className="flex flex-wrap gap-2 items-center">
					{visibleCompetencies.map((comp) => (
						<span
							key={comp}
							className={`px-2.5 py-1 text-[11px] font-medium rounded-full text-white bg-gradient-to-r ${COMPETENCY_COLORS[comp]}`}
						>
							{comp}
						</span>
					))}
					{!showAllCompetencies && remainingCount > 0 && (
						<button
							type="button"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								setShowAllCompetencies(true);
							}}
							className="px-2.5 py-1 text-[11px] font-medium rounded-full text-gray-200 bg-white/10 border border-white/15 hover:bg-white/20 hover:border-white/30 transition-all duration-200 cursor-pointer"
						>
							+{remainingCount}
						</button>
					)}
				</div>
			</div>
		</Link>
	);
}

export function Projects() {
	const containerRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const dividerRef = useRef<HTMLDivElement>(null);
	const subtitleRef = useRef<HTMLParagraphElement>(null);
	const filtersRef = useRef<HTMLDivElement>(null);
	const gridRef = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);
	const [activeFilter, setActiveFilter] = useState<Competency | null>(null);

	const filteredProjects = activeFilter
		? projects.filter((p) => p.competencies.includes(activeFilter))
		: projects;

	const handleScroll = (direction: "left" | "right") => {
		if (!gridRef.current) {
			return;
		}

		const card = gridRef.current.querySelector("[data-project-card]");
		const cardWidth = card ? (card as HTMLDivElement).offsetWidth : 360;
		const gap = window.innerWidth >= 768 ? 24 : 16;
		const offset = cardWidth + gap;

		gridRef.current.scrollBy({
			left: direction === "right" ? offset : -offset,
			behavior: "smooth",
		});
	};

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !isVisible) {
						setIsVisible(true);

						const tl = gsap.timeline({ delay: 0.2 });

						tl.to(titleRef.current, {
							opacity: 1,
							y: 0,
							duration: 0.8,
							ease: "power2.out",
						})
							.to(
								dividerRef.current,
								{
									opacity: 1,
									scaleX: 1,
									duration: 0.6,
									ease: "power2.out",
								},
								"-=0.4",
							)
							.to(
								subtitleRef.current,
								{
									opacity: 1,
									y: 0,
									duration: 0.6,
									ease: "power2.out",
								},
								"-=0.2",
							)
							.to(
								filtersRef.current?.children || [],
								{
									opacity: 1,
									y: 0,
									duration: 0.5,
									ease: "power2.out",
									stagger: 0.07,
								},
								"-=0.1",
							)
							.to(
								gridRef.current?.children || [],
								{
									opacity: 1,
									y: 0,
									duration: 0.6,
									ease: "back.out(1.2)",
									stagger: 0.15,
								},
								"-=0.1",
							);
					}
				});
			},
			{ threshold: 0.15, rootMargin: "0px 0px -80px 0px" },
		);

		if (containerRef.current) {
			observer.observe(containerRef.current);
		}

		return () => observer.disconnect();
	}, [isVisible]);

	useEffect(() => {
		gsap.set([titleRef.current, subtitleRef.current], {
			opacity: 0,
			y: 50,
		});

		gsap.set(dividerRef.current, {
			opacity: 1,
			scaleX: 0,
			transformOrigin: "center",
		});

		gsap.set(filtersRef.current?.children || [], {
			opacity: 0,
			y: 20,
		});

		gsap.set(gridRef.current?.children || [], {
			opacity: 0,
			y: 30,
		});
	}, []);

	return (
		<div
			className="snap-start min-h-screen relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 py-12 md:py-16"
			style={{ fontFamily: BeVietnam.style.fontFamily }}
			id="projects"
		>
			{/* Background glow */}
			<div className="absolute inset-0 opacity-[0.04]">
				<div
					className="absolute inset-0"
					style={{
						backgroundImage: `radial-gradient(circle at 20% 30%, #3bd1ab 0%, transparent 60%), 
                                     radial-gradient(circle at 80% 70%, #61437f 0%, transparent 60%)`,
					}}
				/>
			</div>

			{/* Floating particles */}
			<div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-gradient-to-r from-sabs-primary to-sabs-gradient-1 rounded-full animate-pulse [animation-duration:3s] shadow-lg shadow-sabs-primary/30" />
			<div className="absolute top-3/4 right-1/4 w-1 h-1 bg-gradient-to-r from-sabs-gradient-2 to-sabs-gradient-3 rounded-full animate-pulse [animation-delay:1s] [animation-duration:4s] shadow-lg shadow-sabs-gradient-2/30" />
			<div className="absolute top-1/2 left-2/3 w-2 h-2 bg-gradient-to-r from-sabs-gradient-1 to-sabs-primary rounded-full animate-pulse [animation-delay:2s] [animation-duration:5s] shadow-lg shadow-sabs-gradient-1/30" />

			<div
				ref={containerRef}
				className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8"
			>
				<div className="max-w-6xl mx-auto">
					{/* Header */}
					<div className="text-center mb-8 md:mb-10">
						<h2
							ref={titleRef}
							className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-thin text-white mb-4 tracking-[-0.02em] px-4"
						>
							Nos{" "}
							<span className="text-sabs-primary font-medium">
								Réalisations
							</span>
						</h2>
						<div
							ref={dividerRef}
							className="w-16 md:w-24 h-[2px] bg-gradient-to-r from-sabs-gradient-1 via-sabs-gradient-2 to-sabs-primary mx-auto mb-4 md:mb-6 rounded-full"
						/>
						<p
							ref={subtitleRef}
							className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed px-4"
						>
							Découvrez nos projets récents et les compétences mises en œuvre.
						</p>
					</div>

					{/* Filter buttons */}
					<div
						ref={filtersRef}
						className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-10 px-4"
					>
						<button
							type="button"
							onClick={() => setActiveFilter(null)}
							className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
								activeFilter === null
									? "bg-sabs-primary text-gray-900 border-sabs-primary shadow-lg shadow-sabs-primary/30"
									: "bg-white/10 text-gray-300 border-white/20 hover:bg-white/20 hover:text-white"
							}`}
						>
							Tous
						</button>
						{COMPETENCIES.map((competency) => (
							<button
								key={competency}
								type="button"
								onClick={() =>
									setActiveFilter(
										competency === activeFilter ? null : competency,
									)
								}
								className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
									activeFilter === competency
										? "bg-sabs-primary text-gray-900 border-sabs-primary shadow-lg shadow-sabs-primary/30"
										: "bg-white/10 text-gray-300 border-white/20 hover:bg-white/20 hover:text-white"
								}`}
							>
								{competency}
							</button>
						))}
					</div>

					{/* Projects horizontal scroller */}
					{/* Rail wrapper: negative margin mobile only so cards bleed to edges; arrows flank on md+ */}
					<div className="flex items-center gap-0 md:gap-4 -mx-4 sm:-mx-6 md:mx-0">
						{/* Left arrow – desktop only */}
						<button
							type="button"
							onClick={() => handleScroll("left")}
							className="hidden md:flex flex-shrink-0 w-9 h-9 rounded-full border border-white/20 bg-white/5 text-white hover:bg-sabs-primary/15 hover:border-sabs-primary/50 hover:text-sabs-primary transition-all duration-300 items-center justify-center"
							aria-label="Voir les projets précédents"
						>
							<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
								<title>Précédent</title>
								<path
									d="M15 18l-6-6 6-6"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>

						{/* Scroll rail */}
						<div
							ref={gridRef}
							className="flex-1 flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory pb-4 px-4 sm:px-6 md:px-0 min-w-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
						>
							{filteredProjects.map((project, index) => (
								<ProjectCard
									key={`${project.id}-${project.date}-${project.title}-${index}`}
									project={project}
									index={index}
								/>
							))}
						</div>

						{/* Right arrow – desktop only */}
						<button
							type="button"
							onClick={() => handleScroll("right")}
							className="hidden md:flex flex-shrink-0 w-9 h-9 rounded-full border border-white/20 bg-white/5 text-white hover:bg-sabs-primary/15 hover:border-sabs-primary/50 hover:text-sabs-primary transition-all duration-300 items-center justify-center"
							aria-label="Voir les projets suivants"
						>
							<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
								<title>Suivant</title>
								<path
									d="M9 6l6 6-6 6"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>
					</div>

					{filteredProjects.length > 1 && (
						<p className="text-center text-gray-500 text-xs mt-4 font-light tracking-wide md:hidden">
							← Faites défiler →
						</p>
					)}
					{filteredProjects.length === 0 && (
						<div className="text-center py-16">
							<p className="text-gray-500 text-lg font-light">
								Aucun projet pour cette compétence.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
