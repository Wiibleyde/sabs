import { RTMPStatus } from "@/components/dasboard/RTMPStatus";
import { SRTStatus } from "@/components/dasboard/SRTStatus";
import { RecentEvents } from "./RecentEvents";
import { SystemStats } from "./SystemStats";

export function DashboardGrid() {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
			<div className="lg:col-span-2">
				<SRTStatus />
			</div>

			<div className="lg:col-span-2">
				<RTMPStatus />
			</div>

			<SystemStats />
			<RecentEvents />
		</div>
	);
}
