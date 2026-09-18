import type { Metadata } from "next";
import Link from "next/link";
import { Terminal } from "@/components/mattmax/Terminal";

export const metadata: Metadata = {
	title: "Matt' Max - SABS",
	description: "Terminal Matt' Max, le duo derrière SABS.",
};

export default function MattMaxPage() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-12">
			<Terminal />
			<Link
				href="/"
				className="mt-6 font-mono text-xs text-term-dim transition-colors hover:text-term"
			>
				← retour à sabs
			</Link>
		</main>
	);
}
