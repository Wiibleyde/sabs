import { ObsScene } from "@/components/obs/ObsScene";
import {
	type ObsSearchParams,
	type ObsVariant,
	resolveObsConfig,
} from "@/components/obs/params";

export function createObsPage(variant: ObsVariant) {
	return async function ObsPage({
		searchParams,
	}: {
		searchParams: Promise<ObsSearchParams>;
	}) {
		const config = resolveObsConfig(variant, await searchParams);
		return <ObsScene config={config} />;
	};
}
