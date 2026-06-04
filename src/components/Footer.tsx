"use client";

import SmallLogo from "@public/img/sabs/small-logo-white.png";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
	{ text: "Retransmission multicaméra", dotClass: "bg-sabs-green" },
	{ text: "Production en direct", dotClass: "bg-sabs-purple" },
	{ text: "Couverture événementielle", dotClass: "bg-sabs-red" },
	{ text: "Solutions audiovisuelles", dotClass: "bg-sabs-gold" },
];

export function Footer() {
	const footerRef = useRef<HTMLElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			if (!contentRef.current) return;
			gsap.set(Array.from(contentRef.current.children), { opacity: 0, y: 30 });

			ScrollTrigger.create({
				trigger: footerRef.current,
				start: "top 80%",
				onEnter: () => {
					gsap.to(Array.from(contentRef.current?.children ?? []), {
						opacity: 1,
						y: 0,
						duration: 0.7,
						ease: "power2.out",
						stagger: 0.1,
					});
				},
			});
		}, footerRef);

		return () => ctx.revert();
	}, []);

	return (
		<footer ref={footerRef} className="relative pt-20 pb-10 bg-sabs-bg">
			{/* Top gradient line */}
			<div className="absolute top-0 left-0 right-0 h-1 sabs-gradient-bg" />

			<div className="container mx-auto px-6 sm:px-10 md:px-16 max-w-6xl">
				<div
					ref={contentRef}
					className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16"
				>
					{/* Brand */}
					<div>
						<div className="flex items-center gap-3 mb-5">
							<Image
								src={SmallLogo}
								alt="SABS"
								width={36}
								height={36}
								className="opacity-90"
							/>
							<span className="text-xl font-black tracking-wider text-white">
								SABS
							</span>
						</div>
						<p className="text-sm font-light leading-relaxed text-sabs-muted">
							San Andreas Broadcast Service — Régie audiovisuelle
							professionnelle pour tous vos événements.
						</p>
					</div>

					{/* Services */}
					<div>
						<h3 className="text-xs font-bold tracking-[0.25em] uppercase mb-5 text-sabs-green">
							Services
						</h3>
						<ul className="space-y-3">
							{SERVICES.map((service) => (
								<li key={service.text} className="flex items-center gap-3">
									<div
										className={`w-1.5 h-1.5 rounded-full shrink-0 ${service.dotClass}`}
									/>
									<span className="text-sm font-light text-sabs-muted">
										{service.text}
									</span>
								</li>
							))}
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h3 className="text-xs font-bold tracking-[0.25em] uppercase mb-5 text-sabs-green">
							Contact
						</h3>
						<ul className="space-y-3 text-sm font-light text-sabs-muted">
							<li>max.janssens@sabs.com</li>
							<li>555-3813</li>
							<li>San Andreas, LS</li>
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs border-t border-sabs-border text-sabs-muted-3">
					<p>
						<span className="font-semibold text-sabs-green">SABS</span> — San
						Andreas Broadcast Service
					</p>
					<Link
						href="/legal-mentions"
						className="transition-colors duration-300 hover:text-white"
					>
						Mentions légales
					</Link>
				</div>
			</div>
		</footer>
	);
}
