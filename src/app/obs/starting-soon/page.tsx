import { ObsScene } from "@/components/obs/ObsScene";
import { resolveObsConfig } from "@/components/obs/params";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function StartingSoonPage({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const config = resolveObsConfig("starting-soon", await searchParams);
	return <ObsScene config={config} />;
}
