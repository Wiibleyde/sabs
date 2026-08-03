export interface DashboardCard {
	title: string;
	desc: string;
	borderClass: string;
	textClass: string;
	dot: string;
}

export const COMING_SOON_CARDS: DashboardCard[] = [
	{
		title: "SRT",
		desc: "Connexions SRT en temps réel",
		borderClass: "border-t-sabs-green",
		textClass: "text-sabs-green",
		dot: "bg-sabs-green",
	},
	{
		title: "RTMP",
		desc: "Flux RTMP actifs",
		borderClass: "border-t-sabs-purple",
		textClass: "text-sabs-purple",
		dot: "bg-sabs-purple",
	},
	{
		title: "Statistiques",
		desc: "Métriques système",
		borderClass: "border-t-sabs-red",
		textClass: "text-sabs-red",
		dot: "bg-sabs-red",
	},
	{
		title: "Événements",
		desc: "Journal des activités",
		borderClass: "border-t-sabs-gold",
		textClass: "text-sabs-gold",
		dot: "bg-sabs-gold",
	},
];
