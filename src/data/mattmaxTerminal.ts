export type LineTone =
	| "default"
	| "accent"
	| "muted"
	| "error"
	| "warn"
	| "banner"
	| "prompt";

export interface TerminalLine {
	text: string;
	tone?: LineTone;
}

export interface TerminalCommand {
	name: string;
	/** Shown by `help`. */
	description: string;
	/** Answers only when the command is run through `sudo`. */
	requiresSudo?: boolean;
	output: TerminalLine[];
}

export const PROMPT_USER = "public";
export const PROMPT_HOST = "mattmax";

/** Only thing printed on boot - the prompt follows straight after. */
export const BANNER: TerminalLine[] = [
	{ text: "> CONNEXION...", tone: "muted" },
	{ text: "> SIGNAL ACQUIS", tone: "banner" },
	{ text: "" },
];

export const HELP_HEADER: TerminalLine[] = [
	{ text: "Commandes disponibles :", tone: "accent" },
];

export const CLEAR_COMMAND = "clear";
export const HELP_COMMAND = "help";
export const DATE_COMMAND = "date";
export const SUDO_COMMAND = "sudo";

export const SUDO_USAGE: TerminalLine[] = [
	{ text: "usage : sudo <commande>", tone: "muted" },
];

/** Commands with a fixed output. `help`, `clear` and `date` are built at runtime. */
export const COMMANDS: TerminalCommand[] = [
	{
		name: "whoami",
		description: "Votre identité sur cette machine",
		output: [
			{ text: `${PROMPT_USER} (non authentifié)`, tone: "default" },
			{ text: "groupes : spectateurs, curieux", tone: "muted" },
		],
	},
	{
		name: "what",
		description: "De quoi il s'agit",
		requiresSudo: true,
		output: [{ text: "Un festival.", tone: "accent" }],
	},
	{
		name: "who",
		description: "Qui est derrière",
		requiresSudo: true,
		output: [
			{ text: "Organisé par Matt' & Max.", tone: "accent" },
			{ text: "Avec tout le staff SABS." },
			{ text: "Et des artistes : `sudo lineup`." },
			{ text: "N'importe qui peut en faire partie.", tone: "warn" },
		],
	},
	{
		name: "lineup",
		description: "Les artistes à l'affiche",
		requiresSudo: true,
		output: [
			{ text: "Artistes confirmés :", tone: "accent" },
			{ text: "  > Hayes" },
			{ text: "  > Sasha" },
			{ text: "  > Bara" },
			{ text: "  > Isis Shahin" },
			{ text: "  > Zentorno Project" },
			{ text: "  > Elfo" },
			{ text: "  > DJ Snaki" },
			{ text: "  > ??? [données chiffrées]", tone: "warn" },
			{ text: "Artiste mystère. Signal hors de l'île.", tone: "muted" },
		],
	},
	{
		name: "partners",
		description: "Les partenaires de l'événement",
		output: [
			{ text: "Partenaires :", tone: "accent" },
			{ text: "  > Alosa" },
			{ text: "  > Gordo Farm" },
			{ text: "  > Weazel News" },
			{ text: "  > Benny's" },
			{ text: "  > G6" },
			{ text: "  > Taxi" },
			{ text: "Merci à eux.", tone: "muted" },
		],
	},
	{
		name: "tombola",
		description: "La tombola du festival",
		requiresSudo: true,
		output: [
			{ text: "Tombola MATT'MAX 2026", tone: "accent" },
			{ text: "Plein de lots à gagner.", tone: "warn" },
			{ text: "Tickets en vente auprès des membres d'Alosa et Gordo Farm." },
			{ text: "Tirage en direct pendant le festival.", tone: "muted" },
		],
	},
	{
		name: "where",
		description: "Où ça se passe",
		requiresSudo: true,
		output: [{ text: "Le Kortz Center.", tone: "accent" }],
	},
	{
		name: "when",
		description: "Quand ça se passe",
		requiresSudo: true,
		output: [{ text: "Le 19 novembre.", tone: "accent" }],
	},
];

export function permissionDeniedLines(name: string): TerminalLine[] {
	return [
		{ text: `mattmax-sh: ${name}: permission denied`, tone: "error" },
		{
			text: `${PROMPT_USER} n'a pas les droits sur cette information.`,
			tone: "muted",
		},
	];
}

export function unknownCommandLines(input: string): TerminalLine[] {
	return [
		{ text: `mattmax-sh: commande introuvable : ${input}`, tone: "error" },
		{ text: "Tapez `help` pour la liste des commandes.", tone: "muted" },
	];
}
