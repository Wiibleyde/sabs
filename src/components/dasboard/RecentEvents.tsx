import { ComingSoonPlaceholder } from "./ComingSoonPlaceholder";
import { DashboardCard } from "./DashboardCard";

export function RecentEvents() {
	const icon = (
		<svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
			<title>Événements récents</title>
			<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
		</svg>
	);

	return (
		<DashboardCard
			title="Événements Récents"
			icon={icon}
			gradientFrom="from-sabs-gradient-1"
			gradientTo="to-sabs-gradient-2"
		>
			<ComingSoonPlaceholder />
		</DashboardCard>
	);
}
