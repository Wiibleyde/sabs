"use client";

import { Be_Vietnam_Pro } from "next/font/google";
import useSWR from "swr";
import type { SRTConnectionItem } from "@/mediamtx";
import { RTMPErrorPlaceholder } from "./RTMPErrorPlaceholder";
import { RTMPLoadingPlaceholder } from "./RTMPLoadingPlaceholder";
import { SRTSection } from "./SRTSection";

const BeVietnam = Be_Vietnam_Pro({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

const fetcher = (...args: Parameters<typeof fetch>) =>
	fetch(...args).then((res) => res.json());

export function SRTStatus() {
	const { data, error } = useSWR<{
		activePublishConnections: SRTConnectionItem[];
		activeReadConnections: SRTConnectionItem[];
	}>("/api/v1/sabs/srt/status", fetcher, { refreshInterval: 2000 });

	if (error)
		return (
			<div
				className="space-y-4"
				style={{ fontFamily: BeVietnam.style.fontFamily }}
			>
				<RTMPErrorPlaceholder type="publish" />
				<RTMPErrorPlaceholder type="read" />
			</div>
		);

	if (!data)
		return (
			<div
				className="space-y-4"
				style={{ fontFamily: BeVietnam.style.fontFamily }}
			>
				<RTMPLoadingPlaceholder type="publish" />
				<RTMPLoadingPlaceholder type="read" />
			</div>
		);

	return (
		<div
			className="space-y-4"
			style={{ fontFamily: BeVietnam.style.fontFamily }}
		>
			<SRTSection
				type="publish"
				connections={data.activePublishConnections || []}
				title="Publication SRT"
			/>
			<SRTSection
				type="read"
				connections={data.activeReadConnections || []}
				title="Lecture SRT"
			/>
		</div>
	);
}
