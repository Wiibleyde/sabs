import { ComingSoonPlaceholder } from "./ComingSoonPlaceholder";
import { DashboardCard } from "./DashboardCard";
import { RecentEvents } from "./RecentEvents";
import { SystemStats } from "./SystemStats";

export function DashboardGrid() {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
			<div className="lg:col-span-2">
				<DashboardCard
					title="SRT"
					gradientFrom="from-sabs-gradient-1"
					gradientTo="to-sabs-gradient-2"
					icon={
						<svg
							className="w-6 h-6 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>SRT</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
							/>
						</svg>
					}
				>
					<ComingSoonPlaceholder />
				</DashboardCard>
			</div>

			<div className="lg:col-span-2">
				<DashboardCard
					title="RTMP"
					gradientFrom="from-sabs-gradient-2"
					gradientTo="to-sabs-gradient-3"
					icon={
						<svg
							className="w-6 h-6 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>RTMP</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"
							/>
						</svg>
					}
				>
					<ComingSoonPlaceholder />
				</DashboardCard>
			</div>

			<SystemStats />
			<RecentEvents />
		</div>
	);
}
