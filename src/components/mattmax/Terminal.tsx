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

/** `mm-*` tokens live in globals.css - Matt' Max 2026 DA, pink stays rare. */
const TONE_CLASS: Record<LineTone, string> = {
	default: "text-mm-mint/85",
	accent: "font-extrabold text-mm-mint text-shadow-mm",
	muted: "text-mm-teal",
	error: "text-mm-pink text-shadow-mm-pink",
	warn: "font-extrabold text-mm-pink",
	banner: "font-extrabold tracking-[0.08em] text-mm-mint text-shadow-mm-split",
	prompt: "text-mm-mint/85",
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
			<span className="text-mm-teal">&gt;&nbsp;</span>
			<span className="font-extrabold text-mm-mint">{PROMPT_USER}</span>
			<span className="text-mm-dim">@</span>
			<span className="font-extrabold text-mm-mint">{PROMPT_HOST}</span>
			<span className="text-mm-dim">:~$&nbsp;</span>
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
		<div className="flex min-h-0 w-full max-w-4xl flex-1 flex-col normal-case">
			<div className="flex min-h-0 flex-1 flex-col overflow-hidden border border-mm-rule/40 bg-mm-bg/90 shadow-[0_0_60px_rgb(0_255_204/0.08)] backdrop-blur-sm">
				<div className="h-px w-full bg-linear-to-r from-transparent via-mm-rule to-transparent" />

				<div className="flex items-center justify-between border-b border-mm-rule/20 px-4 py-2.5 text-[10px] uppercase tracking-[0.3em] sm:text-xs">
					<span className="font-extrabold text-mm-pink">{"signal//"}</span>
					<span className="text-mm-teal">
						{PROMPT_USER}@{PROMPT_HOST}: ~
					</span>
					<span className="flex items-center gap-2 text-mm-teal">
						<span className="mm-cursor h-1.5 w-1.5 rounded-full bg-mm-pink" />
						live
					</span>
				</div>

				{/* biome-ignore lint/a11y/noStaticElementInteractions: click-to-focus is a convenience; the input itself stays keyboard reachable */}
				<div
					onMouseDown={handleSurfaceMouseDown}
					className="relative min-h-0 w-full flex-1 cursor-text"
				>
					<div className="mm-scanlines pointer-events-none absolute inset-0 z-10" />
					<div className="mm-vignette pointer-events-none absolute inset-0 z-10 opacity-60" />
					<div
						ref={scrollRef}
						role="log"
						aria-live="polite"
						aria-label="Sortie du terminal"
						className="h-full overflow-y-auto px-4 py-4 text-[13px] leading-relaxed [scrollbar-width:none] sm:text-sm [&::-webkit-scrollbar]:hidden"
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
									className="mm-input flex-1 bg-transparent text-mm-mint caret-mm-mint outline-none"
								/>
							</form>
						)}
					</div>
				</div>
			</div>

			<p className="mt-2 shrink-0 text-center text-[11px] text-mm-dim">
				`help` pour les commandes · ↑ ↓ historique · Tab complétion
			</p>
		</div>
	);
}
