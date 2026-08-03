export interface Service {
	text: string;
	/** Tailwind background class for the bullet dot. */
	dotClass: string;
}

export const SERVICES: Service[] = [
	{ text: "Régie caméra", dotClass: "bg-sabs-green" },
	{ text: "Régie lumière", dotClass: "bg-sabs-purple" },
	{ text: "Mise en scène", dotClass: "bg-sabs-red" },
	{ text: "Solutions sur mesure", dotClass: "bg-sabs-gold" },
	{ text: "Feu d'artifice", dotClass: "bg-sabs-green" },
];
