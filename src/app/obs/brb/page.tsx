import { ObsScene } from "@/components/obs/ObsScene";
import { resolveObsConfig } from "@/components/obs/params";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function BrbPage({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const config = resolveObsConfig("brb", await searchParams);
	return <ObsScene config={config} />;
}
