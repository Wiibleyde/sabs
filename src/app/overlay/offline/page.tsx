import OfflineScreen from "@public/img/offline.png";
import Image from "next/image";

export default function OfflinePage() {
	return (
		<div className="relative w-screen h-screen min-h-screen bg-gray-900 text-white overflow-hidden">
			<Image
				src={OfflineScreen}
				alt="Offline"
				fill
				style={{ objectFit: "cover" }}
				priority
			/>
		</div>
	);
}
