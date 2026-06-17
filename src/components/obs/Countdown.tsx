"use client";

import { useEffect, useState } from "react";

function remainingMs(until: string): number | null {
	const target = new Date(until).getTime();
	if (Number.isNaN(target)) return null;
	return Math.max(0, target - Date.now());
}

function format(ms: number): string {
	const total = Math.floor(ms / 1000);
	const hours = Math.floor(total / 3600);
	const minutes = Math.floor((total % 3600) / 60);
	const seconds = total % 60;
	const pad = (n: number) => String(n).padStart(2, "0");
	return hours > 0
		? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
		: `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Live countdown for the starting-soon scene. State starts null and fills in
 * on mount to avoid SSR/client hydration mismatch (the initial Date.now()
 * would differ between server and browser).
 */
export function Countdown({
	until,
	accent,
}: {
	until: string;
	accent: string;
}) {
	const [ms, setMs] = useState<number | null>(null);

	useEffect(() => {
		const tick = () => setMs(remainingMs(until));
		tick();
		const id = setInterval(tick, 1000);
		return () => clearInterval(id);
	}, [until]);

	if (ms === null) return null;

	return (
		<div
			className="font-black tabular-nums tracking-tight leading-none text-[clamp(2.5rem,7vw,5rem)]"
			style={{ color: accent }}
		>
			{format(ms)}
		</div>
	);
}
