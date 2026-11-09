export interface MattMaxEvent {
	name: string;
	year: string;
	venue: string;
	/**
	 * ISO 8601 with offset - Paris time. `null` while the festival is postponed
	 * without a new date: the countdowns show `dateError` instead.
	 */
	startsAt: string | null;
	/** Shown once the countdown hits zero. */
	liveText: string;
	/** Shown in place of the countdown while `startsAt` is `null`. */
	dateError: string;
	/** Second line under `dateError`, large countdown only. */
	dateErrorDetail: string;
	href: string;
}

export const MATTMAX_EVENT: MattMaxEvent = {
	name: "MATT'MAX",
	year: "2026",
	venue: "KORTZ CENTER",
	startsAt: null,
	liveText: "LE SHOW COMMENCE",
	dateError: "ERR: DATE_NOT_FOUND",
	dateErrorDetail: "Festival reporté - nouvelle date à venir",
	href: "/mattmax",
};
