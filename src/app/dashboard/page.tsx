import { RTMPStatus } from "@/components/dasboard/RTMPStatus";
import { Be_Vietnam_Pro } from 'next/font/google';
import { memo } from 'react';

const BeVietnam = Be_Vietnam_Pro({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
});

const DashboardPageComponent = () => {
    return (
        <div 
            className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 relative"
            style={{ fontFamily: BeVietnam.style.fontFamily }}
        >
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #7373B4 0%, transparent 70%), 
                                     radial-gradient(circle at 75% 75%, #85527E 0%, transparent 70%)`,
                    }}
                ></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-8 md:mb-12">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-thin text-gray-900 mb-4 tracking-[-0.02em]">
                            Tableau de bord <span className="text-sabs-primary font-medium">SABS</span>
                        </h1>
                        <div className="w-16 md:w-24 h-[2px] bg-gradient-to-r from-sabs-gradient-1 via-sabs-gradient-2 to-sabs-primary mx-auto mb-4 md:mb-6 rounded-full"></div>
                        <p className="text-base md:text-lg text-gray-600 font-light max-w-2xl mx-auto">
                            Surveillance en temps réel des connexions RTMP et de l&apos;état du système
                        </p>
                    </div>

                    {/* Dashboard Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                        <div className="lg:col-span-2">
                            <RTMPStatus />
                        </div>
                        
                        {/* Placeholder for future dashboard components */}
                        <div className="group p-6 md:p-8 bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-[1.5rem] border border-gray-200/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] hover:shadow-[0_20px_40px_0_rgba(31,38,135,0.15)] transition-all duration-500 will-change-transform">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-sabs-gradient-3 to-sabs-primary rounded-xl flex items-center justify-center shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-medium tracking-tight bg-gradient-to-r from-sabs-primary to-purple-600 bg-clip-text text-transparent">
                                        Statistiques Système
                                    </h3>
                                    <div className="w-12 h-[1px] bg-gradient-to-r from-sabs-gradient-3 to-sabs-primary rounded-full mt-2"></div>
                                </div>
                            </div>
                            <div className="text-center py-8 text-gray-500">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                                    <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <p className="text-sm font-light">Bientôt disponible</p>
                            </div>
                        </div>

                        <div className="group p-6 md:p-8 bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-[1.5rem] border border-gray-200/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] hover:shadow-[0_20px_40px_0_rgba(31,38,135,0.15)] transition-all duration-500 will-change-transform">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-sabs-gradient-1 to-sabs-gradient-2 rounded-xl flex items-center justify-center shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-medium tracking-tight bg-gradient-to-r from-sabs-primary to-blue-600 bg-clip-text text-transparent">
                                        Événements Récents
                                    </h3>
                                    <div className="w-12 h-[1px] bg-gradient-to-r from-sabs-gradient-1 to-sabs-gradient-2 rounded-full mt-2"></div>
                                </div>
                            </div>
                            <div className="text-center py-8 text-gray-500">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                                    <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <p className="text-sm font-light">Bientôt disponible</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(DashboardPageComponent);
