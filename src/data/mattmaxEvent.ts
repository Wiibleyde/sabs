export interface MattMaxEvent {
	name: string;
	year: string;
	venue: string;
	/** ISO 8601 with offset - Paris time (UTC+1 in November). */
	startsAt: string;
	/** Shown once the countdown hits zero. */
	liveText: string;
	href: string;
}

export const MATTMAX_EVENT: MattMaxEvent = {
	name: "MATT'MAX",
	year: "2026",
	venue: "KORTZ CENTER",
	startsAt: "2026-11-19T20:00:00+01:00",
	liveText: "LE SHOW COMMENCE",
	href: "/mattmax",
};
