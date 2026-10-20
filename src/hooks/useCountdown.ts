"use client";

import { useEffect, useState } from "react";

export interface CountdownParts {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	/** True once the target is reached. */
	done: boolean;
}

function partsUntil(target: number, now: number): CountdownParts {
	const total = Math.max(0, Math.floor((target - now) / 1000));
	return {
		days: Math.floor(total / 86400),
		hours: Math.floor((total % 86400) / 3600),
		minutes: Math.floor((total % 3600) / 60),
		seconds: total % 60,
		done: total === 0,
	};
}

/**
 * Ticks once per second towards `iso`. Returns `null` until mounted so the
 * server render and the first client render match.
 */
export function useCountdown(iso: string): CountdownParts | null {
	const [parts, setParts] = useState<CountdownParts | null>(null);

	useEffect(() => {
		const target = new Date(iso).getTime();
		const tick = () => setParts(partsUntil(target, Date.now()));
		tick();
		const id = setInterval(tick, 1000);
		return () => clearInterval(id);
	}, [iso]);

	return parts;
}
