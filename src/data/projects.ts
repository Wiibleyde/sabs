export type Competency =
	| "Régie Vidéo"
	| "Régie Lumière"
	| "Mise en scène"
	| "Caméraman"
	| "Diffusion en direct/rediffusion"
	| "Régie mapping écran";

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
	medias: ProjectMedia[];
	competencies: Competency[];
	description?: string;
}

export const COMPETENCIES: Competency[] = [
	"Régie Vidéo",
	"Régie Lumière",
	"Mise en scène",
	"Caméraman",
	"Diffusion en direct/rediffusion",
	"Régie mapping écran",
];

export const COMPETENCY_COLORS: Record<Competency, string> = {
	"Régie Vidéo": "from-violet-500 to-purple-600",
	"Régie Lumière": "from-amber-400 to-yellow-500",
	"Mise en scène": "from-blue-500 to-indigo-600",
	Caméraman: "from-emerald-400 to-teal-500",
	"Diffusion en direct/rediffusion": "from-red-500 to-orange-500",
	"Régie mapping écran": "from-pink-500 to-rose-500",
};

export const projects: Project[] = [
	{
		id: "course-sur-terre-tropos-2026",
		title: "Course sur terre - Tropos",
		date: "2026-04-21",
		medias: [
			{
				type: "youtube",
				url: "https://youtu.be/C4agP4iUgOQ",
			},
		],
		competencies: [
			"Caméraman",
			"Diffusion en direct/rediffusion",
			"Régie Vidéo",
		],
	},
	{
		id: "triathlon-2026",
		title: "Triathlon 2026",
		date: "2026-05-15",
		medias: [
			{
				type: "image",
				url: "https://mindcity-rp.fr/photo/photo_6a076ff4109045.09318455.png",
			},
		],
		competencies: [
			"Caméraman",
			"Diffusion en direct/rediffusion",
			"Régie Vidéo",
		],
	},
	{
		id: "hayes-spc-2026",
		title: "Hayes - Septem Peccata Capitalia",
		date: "2026-05-26",
		medias: [
			{
				type: "youtube",
				url: "https://youtu.be/to-_Bhen280",
			},
			{
				type: "youtube",
				url: "https://youtu.be/aFBW4qw1rE4",
			},
		],
		competencies: ["Régie Lumière", "Régie mapping écran", "Mise en scène"],
		description:
			"Régie lumière et mapping écran pour la performance de Hayes pour son concert Septem Peccata Capitalia.",
	},
	{
		id: "drift-dock-2026",
		title: "Événement de drift par TerraDrift",
		date: "2026-06-03",
		medias: [
			{
				type: "image",
				url: "/img/events/drift-dock-2026/sasha.png",
			},
			{
				type: "image",
				url: "/img/events/drift-dock-2026/hayes.png",
			},
			{
				type: "image",
				url: "/img/events/drift-dock-2026/aki.png",
			},
			{
				type: "image",
				url: "/img/events/drift-dock-2026/matt-max.png",
			},
		],
		competencies: ["Régie Lumière", "Régie mapping écran"],
		description:
			"Régie lumière et mapping écran pour l'événement de drift organisé par TerraDrift.",
	},
];
