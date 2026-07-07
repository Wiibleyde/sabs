"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type RefObject, useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Runs `setup` inside a scoped gsap.context on mount and reverts every
 * animation it created on unmount. `setup` usually sets an initial hidden
 * state then wires a ScrollTrigger or timeline.
 */
export function useGsapContext(
	scopeRef: RefObject<HTMLElement | null>,
	setup: () => void,
) {
	// biome-ignore lint/correctness/useExhaustiveDependencies: mount-only; refs are stable
	useEffect(() => {
		const ctx = gsap.context(setup, scopeRef);
		return () => ctx.revert();
	}, []);
}
