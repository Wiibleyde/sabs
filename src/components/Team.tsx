"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { TEAM } from "@/data/team";
import { useGsapContext } from "@/hooks/useGsapContext";
import { Multiview, MultiviewTile } from "./Multiview";
import { ScrollReveal } from "./reactbits/ScrollReveal";

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.toUpperCase();
}

export function Team() {
	const sectionRef = useRef<HTMLElement>(null);
	const headingRef = useRef<HTMLDivElement>(null);
	const textRef = useRef<HTMLDivElement>(null);
	const monitorRef = useRef<HTMLDivElement>(null);

	useGsapContext(sectionRef, () => {
		const tiles = sectionRef.current
			? Array.from(sectionRef.current.querySelectorAll("[data-mv-tile]"))
			: [];
		gsap.set([headingRef.current, textRef.current], { opacity: 0, y: 50 });
		gsap.set(monitorRef.current, { opacity: 0, y: 40 });
		gsap.set(tiles, { opacity: 0, scale: 0.96 });

		ScrollTrigger.create({
			trigger: sectionRef.current,
			start: "top 70%",
			onEnter: () => {
				gsap
					.timeline()
					.to(headingRef.current, {
						opacity: 1,
						y: 0,
						duration: 0.9,
						ease: "power3.out",
					})
					.to(
						textRef.current,
						{ opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
						"-=0.5",
					)
					.to(
						monitorRef.current,
						{ opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
						"-=0.4",
					)
					.to(
						tiles,
						{
							opacity: 1,
							scale: 1,
							duration: 0.5,
							ease: "power2.out",
							stagger: 0.15,
						},
						"-=0.3",
					);
			},
		});
	});

	return (
		<section
			ref={sectionRef}
			id="team"
			className="relative py-20 md:py-28 bg-sabs-bg-4"
		>
			<div className="absolute left-0 top-0 bottom-0 w-1 sabs-gradient-bg-vertical" />

			<div className="relative z-10 container mx-auto px-6 sm:px-10 md:px-16 max-w-6xl">
				<div ref={headingRef} className="mb-8 md:mb-10">
					<p className="text-xs font-semibold tracking-[0.4em] uppercase mb-4 text-sabs-green">
						L&apos;équipe
					</p>
					<ScrollReveal
						as="h2"
						highlight="Équipe"
						start="top 70%"
						className="text-[clamp(2.5rem,7vw,5rem)] font-black leading-none tracking-tighter text-white mb-6"
					>
						Notre Équipe
					</ScrollReveal>
					<div className="sabs-gradient-bg rounded-full w-16 h-0.5" />
				</div>

				<div ref={textRef} className="mb-12 md:mb-16 max-w-3xl">
					<p className="text-[clamp(1rem,2.5vw,1.25rem)] font-light leading-relaxed text-sabs-muted">
						Derrière SABS, une{" "}
						<span className="font-semibold text-white">
							petite équipe soudée
						</span>{" "}
						de passionnés. Chacun sa spécialité - caméra, lumière, régie - mais
						une seule façon de travailler :{" "}
						<span className="font-medium text-sabs-green">
							sur le terrain, ensemble
						</span>
						, au service de vos événements.
					</p>
				</div>

				<Multiview ref={monitorRef} label="SABS · Multiview">
					{TEAM.map((member) => (
						<MultiviewTile
							key={member.name}
							title={member.name}
							subtitle={member.role}
							accent={member.accent}
							placeholderText={getInitials(member.name)}
						>
							{member.photo ? (
								<Image
									src={member.photo}
									alt={member.name}
									fill
									className="object-cover"
									sizes="(max-width: 640px) 100vw, 50vw"
								/>
							) : null}
						</MultiviewTile>
					))}
				</Multiview>
			</div>
		</section>
	);
}
