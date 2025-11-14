import { ComingSoonPlaceholder } from "./ComingSoonPlaceholder";
import { DashboardCard } from "./DashboardCard";

export function SystemStats() {
	const icon = (
		<svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
			<title>Statistiques Système</title>
			<path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
		</svg>
	);

	return (
		<DashboardCard
			title="Statistiques Système"
			icon={icon}
			gradientFrom="from-sabs-gradient-3"
			gradientTo="to-sabs-primary"
		>
			<ComingSoonPlaceholder />
		</DashboardCard>
	);
}
