export type Competency =
	| "Régie Vidéo"
	| "Régie Lumière"
	| "Mise en scène"
	| "Caméraman"
	| "Diffusion en direct/rediffusion";

export type ProjectMediaType =
	| "youtube"
	| "twitch"
	| "image"
	| "video"
	| "link";

export interface ProjectMedia {
	type: ProjectMediaType;
	url: string;
}

export interface Project {
	id: string;
	title: string;
	date: string; // ISO format: YYYY-MM-DD
	media: ProjectMedia;
	competencies: Competency[];
	description?: string;
}

export const COMPETENCIES: Competency[] = [
	"Régie Vidéo",
	"Régie Lumière",
	"Mise en scène",
	"Caméraman",
	"Diffusion en direct/rediffusion",
];

export const COMPETENCY_COLORS: Record<Competency, string> = {
	"Régie Vidéo": "from-violet-500 to-purple-600",
	"Régie Lumière": "from-amber-400 to-yellow-500",
	"Mise en scène": "from-blue-500 to-indigo-600",
	Caméraman: "from-emerald-400 to-teal-500",
	"Diffusion en direct/rediffusion": "from-red-500 to-orange-500",
};

export const projects: Project[] = [
	{
		id: "course-sur-terre-tropos-2026",
		title: "Course sur terre - Tropos",
		date: "2026-04-21",
		media: {
			type: "youtube",
			url: "https://youtu.be/C4agP4iUgOQ",
		},
		competencies: [
			"Caméraman",
			"Diffusion en direct/rediffusion",
			"Régie Vidéo",
		],
	},
];
