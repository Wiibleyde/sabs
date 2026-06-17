"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>/\\[]{}=+";
const COLORS = ["#40c395", "#615388", "#b64457", "#dcb836"];

interface Cell {
	char: string;
	color: string;
}

/**
 * Canvas grid of brand-colored glyphs that flicker like broadcast static.
 * Sizes itself to its parent; meant to sit absolutely behind section content
 * at low opacity (client-only — uses canvas + window).
 */
export function LetterGlitch({
	className = "",
	fontSize = 16,
	glitchSpeed = 60,
}: {
	className?: string;
	fontSize?: number;
	glitchSpeed?: number;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const parent = canvas?.parentElement;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !parent || !ctx) return;

		const charWidth = fontSize * 0.65;
		const lineHeight = fontSize * 1.4;
		let cells: Cell[] = [];
		let columns = 0;

		const pick = (set: string[]) =>
			set[Math.floor(Math.random() * set.length)] ?? set[0];
		const pickGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

		const resize = () => {
			const dpr = window.devicePixelRatio || 1;
			const { width, height } = parent.getBoundingClientRect();
			canvas.width = width * dpr;
			canvas.height = height * dpr;
			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			columns = Math.max(1, Math.ceil(width / charWidth));
			const rows = Math.max(1, Math.ceil(height / lineHeight));
			cells = Array.from({ length: columns * rows }, () => ({
				char: pickGlyph(),
				color: pick(COLORS),
			}));
		};

		const draw = () => {
			const { width, height } = parent.getBoundingClientRect();
			ctx.clearRect(0, 0, width, height);
			ctx.font = `${fontSize}px monospace`;
			ctx.textBaseline = "top";
			for (let i = 0; i < cells.length; i++) {
				const cell = cells[i];
				if (!cell) continue;
				ctx.fillStyle = cell.color;
				ctx.fillText(
					cell.char,
					(i % columns) * charWidth,
					Math.floor(i / columns) * lineHeight,
				);
			}
		};

		let raf = 0;
		let last = 0;
		const loop = (time: number) => {
			if (time - last > glitchSpeed) {
				last = time;
				const mutations = Math.max(1, Math.floor(cells.length * 0.04));
				for (let n = 0; n < mutations; n++) {
					const cell = cells[Math.floor(Math.random() * cells.length)];
					if (cell) {
						cell.char = pickGlyph();
						cell.color = pick(COLORS);
					}
				}
				draw();
			}
			raf = requestAnimationFrame(loop);
		};

		resize();
		draw();
		raf = requestAnimationFrame(loop);

		const observer = new ResizeObserver(() => {
			resize();
			draw();
		});
		observer.observe(parent);

		return () => {
			cancelAnimationFrame(raf);
			observer.disconnect();
		};
	}, [fontSize, glitchSpeed]);

	return <canvas ref={canvasRef} className={className} />;
}
