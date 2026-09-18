"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/data/projects";
import { projects } from "@/data/projects";
import { formatProjectDate, getProjectThumbnail } from "@/lib/projectMedia";

/** Seconds each card spends crossing the strip - slow enough to read. */
const SECONDS_PER_ITEM = 7;

/** Most recent projects first; the strip is a teaser, not the full portfolio. */
function recentProjects(max: number): Project[] {
	return [...projects]
		.sort((a, b) => b.date.localeCompare(a.date))
		.slice(0, max);
}

function Thumbnail({ project }: { project: Project }) {
	const src = getProjectThumbnail(project);
	// YouTube maxres thumbnails 404 on some videos - fall back to the placeholder
	// instead of leaving a broken image on an unattended screen.
	const [failed, setFailed] = useState(false);

	if (!src || failed) {
		return (
			<div className="flex h-full w-full items-center justify-center bg-sabs-bg-4">
				<svg
					className="h-5 w-5 text-sabs-muted-3"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth="1.5"
				>
					<title>Média</title>
					<rect x="2" y="7" width="15" height="10" rx="2" />
					<path d="M17 10l4-2v8l-4-2" />
				</svg>
			</div>
		);
	}

	return (
		<Image
			src={src}
			alt=""
			fill
			sizes="112px"
			className="object-cover"
			onError={() => setFailed(true)}
		/>
	);
}

function Card({ project, accent }: { project: Project; accent: string }) {
	return (
		<li className="flex w-72 shrink-0 items-center gap-3 rounded-xl border border-sabs-border bg-sabs-bg-3/80 p-2.5">
			<div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-sabs-bg-4">
				<Thumbnail project={project} />
			</div>
			<div className="min-w-0">
				<p className="truncate text-sm font-bold leading-tight text-white">
					{project.title}
				</p>
				<p
					className="mt-1 truncate text-[11px] font-semibold uppercase tracking-[0.14em]"
					style={{ color: accent }}
				>
					{formatProjectDate(project.date)}
				</p>
			</div>
		</li>
	);
}

/**
 * Bottom strip that loops through past projects - a passive nudge to go look at
 * the portfolio while the waiting scene is up. The list is rendered twice and
 * the track scrolls by exactly half its width, so the loop is seamless; the
 * trailing padding on each copy keeps both halves the same width.
 *
 * Motion is CSS-only (see .obs-marquee-track in globals.css) so it costs no JS
 * during a long wait, and stops entirely under prefers-reduced-motion.
 */
export function ProjectsMarquee({
	accent,
	label,
	max = 8,
}: {
	accent: string;
	label: string;
	max?: number;
}) {
	const items = recentProjects(max);
	if (items.length === 0) return null;

	const list = (
		<ul className="flex gap-4 pr-4">
			{items.map((project) => (
				<Card key={project.id} project={project} accent={accent} />
			))}
		</ul>
	);

	return (
		<div className="absolute inset-x-0 bottom-0 z-10">
			<div className="sabs-gradient-flow h-px w-full opacity-70" />

			<div className="bg-sabs-bg/75 py-4 backdrop-blur-sm">
				{label && (
					<p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-sabs-muted">
						{label}
					</p>
				)}

				{/* Edge fade so cards enter and leave without a hard cut */}
				<div
					className="overflow-hidden"
					style={{
						maskImage:
							"linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%)",
						WebkitMaskImage:
							"linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%)",
					}}
				>
					<div
						className="obs-marquee-track flex w-max"
						style={
							{
								"--marquee-duration": `${items.length * SECONDS_PER_ITEM}s`,
							} as React.CSSProperties
						}
					>
						{list}
						<div aria-hidden>{list}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
