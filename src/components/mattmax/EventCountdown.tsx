"use client";

import { MATTMAX_EVENT } from "@/data/mattmaxEvent";
import { useCountdown } from "@/hooks/useCountdown";

type Size = "compact" | "large";

const SIZE_CLASS: Record<
	Size,
	{ row: string; value: string; unit: string; sep: string; live: string }
> = {
	compact: {
		row: "gap-1.5 sm:gap-2",
		value: "text-sm sm:text-base text-mm-mint text-shadow-mm",
		unit: "text-[9px] sm:text-[10px] text-mm-teal",
		sep: "text-sm sm:text-base text-mm-dim",
		live: "text-xs sm:text-sm text-mm-pink text-shadow-mm-pink",
	},
	large: {
		row: "gap-3 sm:gap-6",
		value: "mm-stripes text-[clamp(2rem,min(8vw,9svh),4.5rem)] leading-none",
		unit: "mt-1 text-[10px] sm:text-xs tracking-[0.4em] text-mm-teal",
		sep: "text-[clamp(1.6rem,min(6vw,7svh),3.5rem)] leading-none text-mm-dim",
		live: "text-[clamp(1.5rem,5vw,3rem)] tracking-[0.08em] text-mm-pink text-shadow-mm-pink",
	},
};

const pad = (n: number) => n.toString().padStart(2, "0");

/** Countdown to MATT'MAX 2026, in the event DA. Shows `--` until mounted. */
export function EventCountdown({ size = "compact" }: { size?: Size }) {
	const parts = useCountdown(MATTMAX_EVENT.startsAt);
	const cls = SIZE_CLASS[size];

	if (parts?.done) {
		return (
			<p className={`font-extrabold uppercase ${cls.live}`}>
				&gt; {MATTMAX_EVENT.liveText}
				<span className="mm-cursor">_</span>
			</p>
		);
	}

	const cells: [string, string][] = [
		[parts ? pad(parts.days) : "--", "J"],
		[parts ? pad(parts.hours) : "--", "H"],
		[parts ? pad(parts.minutes) : "--", "M"],
		[parts ? pad(parts.seconds) : "--", "S"],
	];

	return (
		<div
			role="timer"
			aria-label={
				parts
					? `${parts.days} jours, ${parts.hours} heures, ${parts.minutes} minutes avant ${MATTMAX_EVENT.name}`
					: `Compte à rebours ${MATTMAX_EVENT.name}`
			}
			className={`flex items-start font-extrabold tabular-nums ${cls.row}`}
		>
			{cells.map(([value, unit], index) => (
				<div key={unit} className={`flex items-start ${cls.row}`}>
					{index > 0 && (
						<span aria-hidden className={cls.sep}>
							:
						</span>
					)}
					<span
						className={
							size === "large"
								? "flex flex-col items-center"
								: "flex items-baseline gap-0.5"
						}
					>
						<span className={cls.value}>{value}</span>
						<span className={cls.unit}>{unit}</span>
					</span>
				</div>
			))}
		</div>
	);
}
