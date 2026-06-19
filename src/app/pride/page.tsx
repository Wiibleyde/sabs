import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Pride 🏳️‍🌈",
	description: "Pride",
};

const STRIPES = [
	"#E40303",
	"#FF8C00",
	"#FFED00",
	"#008026",
	"#004DFF",
	"#750787",
];

export default function PridePage() {
	return (
		<main className="fixed inset-0 flex flex-row">
			{STRIPES.map((color) => (
				<div key={color} className="flex-1" style={{ backgroundColor: color }} />
			))}
		</main>
	);
}
