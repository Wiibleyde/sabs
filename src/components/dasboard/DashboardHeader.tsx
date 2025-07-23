import { Be_Vietnam_Pro } from 'next/font/google';

const BeVietnam = Be_Vietnam_Pro({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
});

export function DashboardHeader() {
    return (
        <div 
            className="text-center mb-8 md:mb-12"
            style={{ fontFamily: BeVietnam.style.fontFamily }}
        >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-thin text-gray-900 mb-4 tracking-[-0.02em]">
                Tableau de bord <span className="text-sabs-primary font-medium">SABS</span>
            </h1>
            <div className="w-16 md:w-24 h-[2px] bg-gradient-to-r from-sabs-gradient-1 via-sabs-gradient-2 to-sabs-primary mx-auto mb-4 md:mb-6 rounded-full"></div>
            <p className="text-base md:text-lg text-gray-600 font-light max-w-2xl mx-auto">
                Surveillance en temps réel des connexions RTMP et de l&apos;état du système
            </p>
        </div>
    );
}
