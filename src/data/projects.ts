export type Competency =
	| "Régie Vidéo"
	| "Régie Lumière"
	| "Mise en scène"
	| "Caméraman"
	| "Diffusion en direct/rediffusion"
	| "Régie mapping écran"
	| "Pyrotechnie";

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
	accent?: "rainbow"; // overrides the index-based card accent
}

export const COMPETENCIES: Competency[] = [
	"Régie Vidéo",
	"Régie Lumière",
	"Mise en scène",
	"Caméraman",
	"Diffusion en direct/rediffusion",
	"Régie mapping écran",
	"Pyrotechnie",
];

export const projects: Project[] = [
	{
		id: "course-sur-terre-tropos-2026",
		title: "Course sur terre - Tropos",
		description:
			"Régie vidéo et diffusion en direct pour la course organisée par A.R.C.",
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
		description:
			"Régie vidéo et diffusion en direct pour le triathlon organisé par le LSMS.",
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
	{
		id: "pride-2026",
		title: "Pride 2026",
		date: "2026-06-28",
		medias: [
			{
				type: "youtube",
				url: "https://youtu.be/awmGw73R4gk",
			},
		],
		competencies: ["Pyrotechnie", "Régie Lumière", "Régie mapping écran"],
		description:
			"Feu d'artifice avec projection lumineuse et pyrotechnie pour la Pride 2026.",
		accent: "rainbow",
	},
	{
		id: "crowley-combat-club-1",
		title: "Crowley Combat Club",
		date: "2026-07-23",
		medias: [
			{
				type: "image",
				url: "/img/events/ccc/ccc1.png",
			},
			{
				type: "image",
				url: "/img/events/ccc/ccc2.png",
			},
		],
		competencies: ["Régie Lumière", "Régie mapping écran"],
		description:
			"Régie lumière et mapping écran pour le premier événement de Crowley Combat Club.",
	},
	{
		id: "openning-olympiades-1",
		title: "Cérémonie d'ouverture des olympiades",
		date: "2026-07-27",
		medias: [
			{
				type: "youtube",
				url: "https://youtu.be/MsIjVUfpvks",
			},
		],
		competencies: ["Pyrotechnie", "Régie Lumière", "Régie mapping écran"],
		description:
			"Feu d'artifice avec projection lumineuse et pyrotechnie pour la cérémonie d'ouverture des olympiades",
	},
	{
		id: "olympiades-rcbandito-race-1",
		title: "RC Bandito Race",
		date: "2026-07-31",
		medias: [
			{
				type: "youtube",
				url: "https://youtu.be/gJADNMQQuPA?si=-OrGxDNM8i0wzBFK",
			},
		],
		competencies: [
			"Caméraman",
			"Diffusion en direct/rediffusion",
			"Régie Vidéo",
		],
		description:
			"Régie vidéo pour la course de RC Bandito organisée par la CFLS.",
	},
];
