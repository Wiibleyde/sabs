import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Presentation } from '@/components/Presentation';

export default function SabsPage() {
    return (
        <div className="scroll-smooth snap-y snap-mandatory overflow-y-scroll h-screen touch-pan-y">
            <Hero />
            <Presentation />
            <Contact />
            <Footer />
        </div>
    );
}
