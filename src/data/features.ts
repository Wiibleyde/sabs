/** Keys the matching SVG icon in `Presentation.tsx`. */
export type FeatureId = "camera" | "lumiere" | "sur-mesure";

export interface Feature {
	id: FeatureId;
	colorClass: string;
	borderClass: string;
	bgClass: string;
	title: string;
	desc: string;
}

export const FEATURES: Feature[] = [
	{
		id: "camera",
		colorClass: "text-sabs-green",
		borderClass: "border-t-sabs-green",
		bgClass: "bg-sabs-green/10",
		title: "Régie caméra",
		desc: "Captation multicaméra professionnelle avec direction technique et mixage vidéo en temps réel.",
	},
	{
		id: "lumiere",
		colorClass: "text-sabs-gold",
		borderClass: "border-t-sabs-gold",
		bgClass: "bg-sabs-gold/10",
		title: "Régie lumière",
		desc: "Conception et pilotage d'ambiances lumineuses adaptées à chaque scène, du mapping à l'éclairage de scène.",
	},
	{
		id: "sur-mesure",
		colorClass: "text-sabs-purple",
		borderClass: "border-t-sabs-purple",
		bgClass: "bg-sabs-purple/10",
		title: "Sur mesure",
		desc: "Chaque projet est unique - nous adaptons nos compétences et notre matériel à n'importe quelle demande.",
	},
];
