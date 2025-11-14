import { NextResponse } from "next/server";
import { MediaMTX, type SRTConnectionItem } from "@/mediamtx";

// Cache configuration
const CACHE_DURATION = 2000; // 2 seconds in milliseconds

interface CacheData {
	data: {
		activePublishConnections: SRTConnectionItem[];
		activeReadConnections: SRTConnectionItem[];
	};
	timestamp: number;
}

let cache: CacheData | null = null;

export async function GET(): Promise<NextResponse> {
	// Check if cache is valid
	const now = Date.now();
	if (cache && now - cache.timestamp < CACHE_DURATION) {
		return NextResponse.json(cache.data);
	}

	// Fetch fresh data
	const mediaMTX = new MediaMTX(
		process.env.MEDIAMTX_URL ?? "",
		process.env.MEDIAMTX_USERNAME ?? "",
		process.env.MEDIAMTX_PASSWORD ?? "",
	);

	const activePublishConnections =
		await mediaMTX.getActiveSRTPublishConnections();
	const activeReadConnections = await mediaMTX.getActiveSRTReadConnections();

	const responseData = {
		activePublishConnections,
		activeReadConnections,
	};

	// Update cache
	cache = {
		data: responseData,
		timestamp: now,
	};

	return NextResponse.json(responseData);
}
