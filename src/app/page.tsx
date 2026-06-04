import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Presentation } from "@/components/Presentation";
import { Projects } from "@/components/Projects";

export default function SabsPage() {
	return (
		<main>
			<Hero />
			<Presentation />
			<Projects />
			<Contact />
			<Footer />
		</main>
	);
}
