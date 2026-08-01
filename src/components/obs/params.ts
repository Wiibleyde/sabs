/**
 * Query-param config for OBS browser-source overlay scenes.
 *
 * Every screen is text-customizable from the URL so a streamer can edit copy
 * without redeploying — e.g. /obs/brb?title=Pause%20technique&accent=gold.
 *
 * Shared params (all screens):
 *   title     main heading
 *   subtitle  secondary line
 *   hint      small footer line (bottom of screen)
 *   label     status-pill text
 *   accent    green | purple | red | gold (brand color used for accents)
 *   logo      1|0 — show/hide the SABS logo (default 1)
 *   glitch    1|0 — glitch effect on the title
 *   projects  1|0 — bottom strip auto-scrolling through past projects,
 *                   as a reminder to go look at the portfolio (default 0)
 *   projectsLabel  copy above that strip
 *
 * Per-screen params:
 *   starting-soon: until — ISO datetime, renders a live countdown
 */

export type ObsVariant = "starting-soon" | "brb" | "ended" | "loading";

export const OBS_ACCENTS = ["green", "purple", "red", "gold"] as const;
export type ObsAccent = (typeof OBS_ACCENTS)[number];

export const OBS_BACKGROUNDS = ["aurora", "none"] as const;
export type ObsBackground = (typeof OBS_BACKGROUNDS)[number];

export interface ObsSceneConfig {
	variant: ObsVariant;
	label: string;
	title: string;
	subtitle: string;
	hint: string;
	accent: ObsAccent;
	bg: ObsBackground;
	showLogo: boolean;
	glitch: boolean;
	/** Auto-scrolling reminder strip of past projects along the bottom. */
	showProjects: boolean;
	projectsLabel: string;
	/** ISO datetime for the starting-soon countdown. */
	until?: string;
}

/** Copy above the project strip when the URL doesn't override it. */
const PROJECTS_LABEL = "En attendant, revoyez nos réalisations";

interface VariantDefaults {
	label: string;
	title: string;
	subtitle: string;
	accent: ObsAccent;
	glitch: boolean;
}

const DEFAULTS: Record<ObsVariant, VariantDefaults> = {
	"starting-soon": {
		label: "Bientôt",
		title: "Bientôt en direct",
		subtitle: "Le live commence dans un instant",
		accent: "green",
		glitch: true,
	},
	brb: {
		label: "En pause",
		title: "Pause",
		subtitle: "On revient très vite",
		accent: "gold",
		glitch: false,
	},
	ended: {
		label: "Terminé",
		title: "Merci d'avoir suivi",
		subtitle: "Le live est terminé",
		accent: "red",
		glitch: true,
	},
	loading: {
		label: "Chargement",
		title: "Chargement",
		subtitle: "Connexion au flux…",
		accent: "purple",
		glitch: false,
	},
};

export type ObsSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
	return Array.isArray(value) ? value[0] : value;
}

function flag(
	value: string | string[] | undefined,
	fallback: boolean,
): boolean {
	const raw = first(value);
	if (raw === undefined) return fallback;
	return raw === "1" || raw === "true";
}

/** Merge URL search params over per-screen defaults into a typed scene config. */
export function resolveObsConfig(
	variant: ObsVariant,
	raw: ObsSearchParams,
): ObsSceneConfig {
	const defaults = DEFAULTS[variant];
	const accentRaw = first(raw.accent) as ObsAccent | undefined;
	const accent =
		accentRaw && OBS_ACCENTS.includes(accentRaw) ? accentRaw : defaults.accent;
	const bgRaw = first(raw.bg) as ObsBackground | undefined;
	const bg = bgRaw && OBS_BACKGROUNDS.includes(bgRaw) ? bgRaw : "aurora";

	return {
		variant,
		label: first(raw.label) ?? defaults.label,
		title: first(raw.title) ?? defaults.title,
		subtitle: first(raw.subtitle) ?? defaults.subtitle,
		hint: first(raw.hint) ?? "",
		accent,
		bg,
		showLogo: flag(raw.logo, true),
		glitch: flag(raw.glitch, defaults.glitch),
		showProjects: flag(raw.projects, true),
		projectsLabel: first(raw.projectsLabel) ?? PROJECTS_LABEL,
		until: first(raw.until),
	};
}
