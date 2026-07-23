import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Presentation } from "@/components/Presentation";
import { Projects } from "@/components/Projects";
import { Team } from "@/components/Team";

export default function SabsPage() {
	return (
		<main>
			<Hero />
			<Presentation />
			<Projects />
			<Team />
			<Contact />
			<Footer />
		</main>
	);
}
