import Link from "next/link";
import { EventCountdown } from "@/components/mattmax/EventCountdown";
import { MATTMAX_EVENT } from "@/data/mattmaxEvent";
import { jetBrainsMono } from "@/lib/fonts";

/** Sticky event strip at the top of the landing page, in the Matt' Max DA. */
export function MattMaxBanner() {
	return (
		<Link
			href={MATTMAX_EVENT.href}
			aria-label={`${MATTMAX_EVENT.name} ${MATTMAX_EVENT.year} - ${MATTMAX_EVENT.venue}, ouvrir le terminal`}
			className={`${jetBrainsMono.className} group sticky top-0 z-40 block overflow-hidden border-b border-mm-rule/30 bg-mm-bg/95 uppercase backdrop-blur-sm`}
		>
			<div className="mm-scanlines pointer-events-none absolute inset-0" />
			<div className="mm-sweep pointer-events-none absolute inset-0" />

			<div className="relative mx-auto flex h-11 max-w-7xl items-center justify-between gap-3 px-4 sm:h-12 sm:px-6">
				<div className="flex min-w-0 items-center gap-3 sm:gap-5">
					<span className="flex items-baseline gap-2 whitespace-nowrap font-extrabold tracking-[0.08em]">
						<span className="text-mm-teal">&gt;</span>
						<span className="text-sm text-mm-mint text-shadow-mm-split sm:text-base">
							{MATTMAX_EVENT.name}
						</span>
						<span className="text-[10px] tracking-[0.5em] text-mm-pink sm:text-xs">
							{MATTMAX_EVENT.year}
						</span>
					</span>
					<span
						aria-hidden
						className="hidden h-4 w-px bg-mm-rule/40 md:block"
					/>
					<span className="hidden truncate text-[11px] font-medium tracking-[0.3em] text-mm-teal md:block">
						{MATTMAX_EVENT.venue}
					</span>
				</div>

				<div className="flex items-center gap-4">
					<EventCountdown />
					<span className="hidden items-center gap-1 whitespace-nowrap border border-mm-rule/40 px-2.5 py-1 text-[10px] font-extrabold tracking-[0.2em] text-mm-mint transition-colors group-hover:border-mm-mint group-hover:bg-mm-mint group-hover:text-mm-bg lg:flex">
						&gt; terminal
					</span>
				</div>
			</div>
		</Link>
	);
}
