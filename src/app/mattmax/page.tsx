"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';

import Background from '@public/img/mattmax2025/PROJET_SO1.png';

export default function MattMaxEventPage() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Background Image */}
            <div className="fixed inset-0 -z-10">
                <Image
                    src={Background}
                    alt="Event Background"
                    fill
                    className="object-cover"
                    priority
                    quality={100}
                />
                <div className="absolute inset-0 bg-black/70" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
                {/* MattMax Logo */}
                <div 
                    className={`mb-12 transition-all duration-1000 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
                    }`}
                >
                    <Image
                        src="/img/mattmax2025/MattMax logo.svg"
                        alt="MattMax Logo"
                        width={300}
                        height={150}
                        className="w-auto h-24 md:h-32 lg:h-40 drop-shadow-2xl"
                        priority
                    />
                </div>

                {/* Event Information Card */}
                <div 
                    className={`transition-all duration-1000 delay-300 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                >
                    <div className="px-8 py-10 md:px-16 md:py-14 max-w-2xl bg-black/70 rounded-3xl border border-white/20 shadow-2xl">
                        <div className="text-center space-y-8">
                            {/* Event Title */}
                            <div className="space-y-3">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                                    Événement Spécial
                                </h1>
                                <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full" />
                            </div>

                            {/* Date & Time */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-center space-x-3">
                                    <svg 
                                        className="w-7 h-7 text-purple-300"
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                                        />
                                    </svg>
                                    <p className="text-2xl md:text-3xl font-semibold text-white">
                                        21/11/2025
                                    </p>
                                </div>
                                
                                <div className="flex items-center justify-center space-x-3">
                                    <svg 
                                        className="w-7 h-7 text-purple-300"
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                                        />
                                    </svg>
                                    <p className="text-2xl md:text-3xl font-semibold text-white">
                                        21h00
                                    </p>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="pt-4">
                                <div className="flex items-center justify-center space-x-3 mb-3">
                                    <svg 
                                        className="w-7 h-7 text-purple-300"
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                                        />
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                                        />
                                    </svg>
                                    <p className="text-xl md:text-2xl font-medium text-white">
                                        Lieu
                                    </p>
                                </div>
                                <div className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full border border-purple-400/30">
                                    <p className="text-lg md:text-xl font-light text-purple-200 italic">
                                        Secret pour le moment...
                                    </p>
                                </div>
                            </div>

                            {/* Decorative Element */}
                            <div className="pt-6">
                                <div className="flex justify-center space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-75" />
                                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-150" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tagline */}
                <div 
                    className={`mt-12 transition-all duration-1000 delay-500 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                >
                    <p className="text-white/80 text-lg md:text-xl font-light text-center max-w-lg px-4">
                        Plus d&apos;informations à venir sur Weazel News...
                    </p>
                </div>
            </div>

            {/* Animated Background Gradient Orbs */}
            <div className="fixed inset-0 -z-5 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>
        </div>
    );
}
