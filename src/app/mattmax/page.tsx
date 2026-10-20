import Lockup from "@public/img/mattmax2026/logo.png";
import Square from "@public/img/mattmax2026/logo-small.png";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EventCountdown } from "@/components/mattmax/EventCountdown";
import { Terminal } from "@/components/mattmax/Terminal";
import { MATTMAX_EVENT } from "@/data/mattmaxEvent";
import { jetBrainsMono } from "@/lib/fonts";

export const metadata: Metadata = {
	title: "MATT'MAX 2026 - SABS",
	description: "Terminal MATT'MAX 2026 - SABS présente, au Kortz Center.",
	icons: { icon: Square.src },
};

/** Four L-shaped corners framing the screen - never a full border. */
const CORNERS = [
	"top-4 left-4 border-t-2 border-l-2",
	"top-4 right-4 border-t-2 border-r-2",
	"bottom-4 left-4 border-b-2 border-l-2",
	"bottom-4 right-4 border-b-2 border-r-2",
];

export default function MattMaxPage() {
	return (
		<main
			className={`${jetBrainsMono.className} relative flex h-svh flex-col items-center overflow-hidden bg-mm-bg px-4 py-6 uppercase sm:py-8`}
		>
			<div className="mm-grid pointer-events-none absolute inset-0" />
			<div className="mm-scanlines pointer-events-none absolute inset-0" />
			<div className="mm-sweep pointer-events-none absolute inset-0" />
			<div className="mm-vignette pointer-events-none absolute inset-0" />
			{CORNERS.map((corner) => (
				<span
					key={corner}
					aria-hidden
					className={`pointer-events-none fixed h-8 w-8 border-mm-mint opacity-80 shadow-[0_0_10px_rgb(0_255_204/0.35)] sm:h-12 sm:w-12 ${corner}`}
				/>
			))}

			<div className="relative z-10 flex min-h-0 w-full flex-1 flex-col items-center">
				<p className="mb-2 shrink-0 text-[10px] font-medium tracking-[0.6em] text-mm-teal sm:text-xs">
					SABS PRÉSENTE
				</p>
				<h1 className="mb-4 w-full max-w-md shrink-0">
					<Image
						src={Lockup}
						alt={`> ${MATTMAX_EVENT.name} ${MATTMAX_EVENT.year}`}
						priority
						className="mx-auto h-auto max-h-[16svh] w-auto"
					/>
				</h1>

				<Terminal />

				<div className="mt-4 flex shrink-0 flex-col items-center gap-2">
					<EventCountdown size="large" />
					<p className="text-xs font-extrabold tracking-[0.5em] text-mm-mint text-shadow-mm sm:text-sm">
						{MATTMAX_EVENT.venue}
					</p>
				</div>

				<Link
					href="/"
					className="mt-3 shrink-0 text-[11px] font-medium tracking-[0.3em] text-mm-dim transition-colors hover:text-mm-mint"
				>
					&lt; retour à sabs
				</Link>
			</div>
		</main>
	);
}
