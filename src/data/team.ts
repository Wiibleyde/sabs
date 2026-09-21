export interface TeamMember {
	name: string;
	role: string;
	/** Path to the member photo; null renders the "no signal" placeholder. */
	photo: string | null;
	accent: string;
}

export const TEAM: TeamMember[] = [
	{
		name: "Max Janssens",
		role: "Fondateur & Directeur",
		photo: null,
		accent: "#40c395",
	},
	{
		name: "Matthieu Janssens",
		role: "Co-Directeur",
		photo: null,
		accent: "#dcb836",
	},
	{
		name: "Akilane Lowell",
		role: "Staff SABS",
		photo: "/img/sabs/members/aki.png",
		accent: "#b64457",
	},
	{
		name: "Ashley Gray",
		role: "Staff SABS",
		photo: null,
		accent: "#615388",
	},
];
