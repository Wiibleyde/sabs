"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createElement, type ElementType, useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Word-by-word reveal on scroll: each word rises and unblurs with a stagger.
 * Words listed in `highlight` get the SABS gradient fill.
 * `start` should match the parent section's ScrollTrigger so the wrapper
 * fade and the word reveal run together rather than the reveal completing
 * while the wrapper is still hidden.
 */
export function ScrollReveal({
	children,
	highlight,
	as: Tag = "h2",
	className = "",
	start = "top 80%",
}: {
	children: string;
	highlight?: string;
	as?: ElementType;
	className?: string;
	start?: string;
}) {
	const ref = useRef<HTMLElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const words = el.querySelectorAll("[data-reveal-word]");
		const ctx = gsap.context(() => {
			gsap.set(words, { opacity: 0.12, filter: "blur(10px)", y: 24 });
			ScrollTrigger.create({
				trigger: el,
				start,
				once: true,
				onEnter: () => {
					gsap.to(words, {
						opacity: 1,
						filter: "blur(0px)",
						y: 0,
						duration: 0.8,
						ease: "power3.out",
						stagger: 0.08,
					});
				},
			});
		}, el);

		return () => ctx.revert();
	}, [start]);

	const highlightSet = new Set((highlight ?? "").split(/\s+/).filter(Boolean));

	// Split on whitespace (kept), assigning each word a key stable across
	// repeated words so we never key on the array index.
	const counts: Record<string, number> = {};
	const tokens = children.split(/(\s+)/).map((token) => {
		const isSpace = /\s+/.test(token) || token === "";
		if (isSpace) return { token, isSpace, key: token };
		const occurrence = (counts[token] ?? 0) + 1;
		counts[token] = occurrence;
		return { token, isSpace, key: `${token}-${occurrence}` };
	});

	return createElement(
		Tag,
		{ ref, className },
		tokens.map(({ token, isSpace, key }) =>
			isSpace ? (
				token
			) : (
				<span
					key={key}
					data-reveal-word
					className={`inline-block ${highlightSet.has(token) ? "sabs-gradient-text pb-[0.2em]" : ""}`}
				>
					{token}
				</span>
			),
		),
	);
}
