import type { Metadata } from "next";

// OBS overlay scenes are public but should never be indexed.
export const metadata: Metadata = {
	robots: { index: false, follow: false },
};

export default function ObsLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return children;
}
