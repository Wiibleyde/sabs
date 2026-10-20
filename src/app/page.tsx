import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { MattMaxBanner } from "@/components/MattMaxBanner";
import { Presentation } from "@/components/Presentation";
import { Projects } from "@/components/Projects";
import { Team } from "@/components/Team";

export default function SabsPage() {
	return (
		<main>
			<MattMaxBanner />
			<Hero />
			<Presentation />
			<Projects />
			<Team />
			<Contact />
			<Footer />
		</main>
	);
}
