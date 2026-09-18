"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
	BANNER,
	CLEAR_COMMAND,
	COMMANDS,
	DATE_COMMAND,
	HELP_COMMAND,
	HELP_HEADER,
	type LineTone,
	PROMPT_HOST,
	PROMPT_USER,
	permissionDeniedLines,
	SUDO_COMMAND,
	SUDO_USAGE,
	type TerminalLine,
	unknownCommandLines,
} from "@/data/mattmaxTerminal";

const BOOT_DELAY_MS = 110;

/** `term-*` tokens live in globals.css - a green CRT, deliberately off-brand. */
const TONE_CLASS: Record<LineTone, string> = {
	default: "text-term",
	accent: "text-term-bright text-shadow-term",
	muted: "text-term-dim",
	error: "text-term-glow text-shadow-term-strong",
	warn: "text-term-lime",
	banner: "text-term text-shadow-term-banner",
	prompt: "text-term",
};

/** Spacer printed after a command's output. */
const BLANK_LINE: TerminalLine = { text: "" };

const BUILTIN_NAMES = [HELP_COMMAND, CLEAR_COMMAND, DATE_COMMAND, SUDO_COMMAND];

const ALL_NAMES = [...BUILTIN_NAMES, ...COMMANDS.map((c) => c.name)];

/** `help` output is derived from the command list so it can never drift. */
function helpLines(): TerminalLine[] {
	const pad = Math.max(...ALL_NAMES.map((n) => n.length)) + 2;
	const describe = (name: string, description: string): TerminalLine => ({
		text: `  ${name.padEnd(pad)}${description}`,
	});
	return [
		...HELP_HEADER,
		describe(HELP_COMMAND, "Afficher cette aide"),
		describe(CLEAR_COMMAND, "Nettoyer l'écran"),
		describe(DATE_COMMAND, "Heure locale de la régie"),
		describe(SUDO_COMMAND, "Exécuter une commande en root"),
		...COMMANDS.map((c) =>
			describe(
				c.name,
				c.requiresSudo ? `${c.description} (root)` : c.description,
			),
		),
	];
}

function Prompt() {
	return (
		<>
			<span className="text-term-bright">{PROMPT_USER}</span>
			<span className="text-term-dim">@</span>
			<span className="text-term-bright">{PROMPT_HOST}</span>
			<span className="text-term-dim">:~$&nbsp;</span>
		</>
	);
}

export function Terminal() {
	const [lines, setLines] = useState<TerminalLine[]>([]);
	const [input, setInput] = useState("");
	const [history, setHistory] = useState<string[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [booted, setBooted] = useState(false);
	const scrollRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setLines([]);
		const timers = BANNER.map((line, index) =>
			setTimeout(
				() => setLines((prev) => [...prev, line]),
				index * BOOT_DELAY_MS,
			),
		);
		timers.push(
			setTimeout(() => setBooted(true), BANNER.length * BOOT_DELAY_MS),
		);
		return () => {
			for (const timer of timers) clearTimeout(timer);
		};
	}, []);

	useEffect(() => {
		const node = scrollRef.current;
		if (node && lines.length > 0) node.scrollTop = node.scrollHeight;
	}, [lines]);

	useEffect(() => {
		if (booted) inputRef.current?.focus();
	}, [booted]);

	const runCommand = useCallback((raw: string) => {
		const entered = raw.trim();
		const echo: TerminalLine = { text: entered, tone: "prompt" };

		if (entered === "") {
			setLines((prev) => [...prev, echo]);
			return;
		}

		setHistory((prev) => [...prev, entered]);
		setHistoryIndex(-1);

		const words = entered.split(/\s+/).map((word) => word.toLowerCase());
		const elevated = words[0] === SUDO_COMMAND;
		const name = elevated ? (words[1] ?? "") : words[0];

		if (elevated && name === "") {
			setLines((prev) => [...prev, echo, ...SUDO_USAGE, BLANK_LINE]);
			return;
		}

		if (name === CLEAR_COMMAND) {
			setLines([]);
			return;
		}

		if (name === HELP_COMMAND) {
			setLines((prev) => [...prev, echo, ...helpLines(), BLANK_LINE]);
			return;
		}

		if (name === DATE_COMMAND) {
			setLines((prev) => [
				...prev,
				echo,
				{ text: new Date().toLocaleString("fr-FR"), tone: "accent" },
				BLANK_LINE,
			]);
			return;
		}

		const command = COMMANDS.find((c) => c.name === name);

		let output: TerminalLine[];
		if (!command) {
			output = unknownCommandLines(name);
		} else if (command.requiresSudo && !elevated) {
			output = permissionDeniedLines(name);
		} else {
			output = command.output;
		}

		setLines((prev) => [...prev, echo, ...output, BLANK_LINE]);
	}, []);

	/** Click anywhere on the log to keep typing, without stealing text selection. */
	const handleSurfaceMouseDown = (event: React.MouseEvent) => {
		if (window.getSelection()?.toString()) return;
		if (event.target !== inputRef.current) {
			event.preventDefault();
			inputRef.current?.focus();
		}
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		runCommand(input);
		setInput("");
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Tab") {
			event.preventDefault();
			const typed = input.trimStart().toLowerCase();
			if (!typed) return;
			// Complete the command after `sudo `, not the `sudo` itself.
			const elevated = typed.startsWith(`${SUDO_COMMAND} `);
			const prefix = elevated ? typed.slice(SUDO_COMMAND.length + 1) : typed;
			if (!prefix) return;
			const match = ALL_NAMES.find((n) => n.startsWith(prefix));
			if (match) setInput(elevated ? `${SUDO_COMMAND} ${match}` : match);
			return;
		}

		if (event.key === "ArrowUp") {
			event.preventDefault();
			if (history.length === 0) return;
			const next =
				historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
			setHistoryIndex(next);
			setInput(history[next]);
			return;
		}

		if (event.key === "ArrowDown") {
			event.preventDefault();
			if (historyIndex < 0) return;
			const next = historyIndex + 1;
			if (next >= history.length) {
				setHistoryIndex(-1);
				setInput("");
				return;
			}
			setHistoryIndex(next);
			setInput(history[next]);
		}
	};

	return (
		<div className="w-full max-w-4xl">
			<div className="overflow-hidden rounded-lg border border-term-border bg-term-bg shadow-[0_0_60px_rgb(51_255_102/0.12)]">
				<div className="h-px w-full bg-linear-to-r from-transparent via-term to-transparent" />

				<div className="flex items-center gap-2 border-b border-term-border-2 bg-term-bg-2 px-4 py-2.5">
					<span className="h-2.5 w-2.5 rounded-full bg-term/80" />
					<span className="h-2.5 w-2.5 rounded-full bg-term/45" />
					<span className="h-2.5 w-2.5 rounded-full bg-term/20" />
					<span className="ml-3 font-mono text-xs text-term-dim">
						{PROMPT_USER}@{PROMPT_HOST}: ~
					</span>
				</div>

				{/* biome-ignore lint/a11y/noStaticElementInteractions: click-to-focus is a convenience; the input itself stays keyboard reachable */}
				<div
					onMouseDown={handleSurfaceMouseDown}
					className="relative w-full cursor-text"
				>
					<div className="term-scanlines pointer-events-none absolute inset-0 z-10" />
					<div className="term-vignette pointer-events-none absolute inset-0 z-10" />
					<div
						ref={scrollRef}
						role="log"
						aria-live="polite"
						aria-label="Sortie du terminal"
						className="h-[60vh] min-h-80 overflow-y-auto px-4 py-4 font-mono text-[13px] leading-relaxed sm:text-sm"
					>
						{lines.map((line, index) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: append-only log, lines are never reordered
								key={index}
								className={`whitespace-pre-wrap wrap-break-word ${TONE_CLASS[line.tone ?? "default"]}`}
							>
								{line.tone === "prompt" ? (
									<>
										<Prompt />
										{line.text}
									</>
								) : (
									line.text || "\u00a0"
								)}
							</div>
						))}

						{booted && (
							<form onSubmit={handleSubmit} className="flex items-center">
								<Prompt />
								<input
									ref={inputRef}
									value={input}
									onChange={(event) => setInput(event.target.value)}
									onKeyDown={handleKeyDown}
									autoComplete="off"
									autoCorrect="off"
									autoCapitalize="off"
									spellCheck={false}
									aria-label="Saisie du terminal"
									className="flex-1 bg-transparent font-mono text-term caret-term outline-none"
								/>
							</form>
						)}
					</div>
				</div>
			</div>

			<p className="mt-4 text-center font-mono text-xs text-term-dim">
				`help` pour les commandes · ↑ ↓ historique · Tab complétion
			</p>
		</div>
	);
}
