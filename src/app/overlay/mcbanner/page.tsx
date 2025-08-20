"use client";
import { ReactNode, useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { IcBaselineDiscord } from "@/components/icons/Discord";
import { SimpleIconsKofi } from "@/components/icons/Ko-Fi";
import { BannerSlide } from "@/components/mcbanner/BannerSlide";

export default function BannerPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const slideRef = useRef<HTMLDivElement>(null);

    const slides: ReactNode[] = [
        <BannerSlide
            key="kofi"
            icon={<SimpleIconsKofi style={{ color: "white", width: "48px", height: "48px" }} />}
            iconColor="text-[#29abe0]" // Ko-fi bleu
            bgGradient="bg-gradient-to-br from-[#29abe0] to-[#f05a9b]" // Ko-fi bleu vers rose
            borderColor="border-[#29abe0]/40"
            url="ko-fi.com/mindcityrp"
            urlBg="bg-[#29abe0]/40"
            urlBorder="border-[#29abe0]/60"
        />,
        <BannerSlide
            key="topvote"
            icon="🗳️"
            iconColor="text-[#3b82f6]" // Bleu doux
            bgGradient="bg-gradient-to-br from-[#3b82f6] via-[#60a5fa] to-[#1e293b]" // Bleu clair vers bleu foncé
            borderColor="border-[#3b82f6]/40"
            url="top-serveurs.net/gta/vote/mindcity-rp-wl-18"
            urlBg="bg-[#3b82f6]/40"
            urlBorder="border-[#3b82f6]/60"
        />,
        <BannerSlide
            key="discord"
            icon={<IcBaselineDiscord style={{ color: "white", width: "48px", height: "48px" }} />}
            iconColor="text-[#5865F2]" // Discord blurple
            bgGradient="bg-gradient-to-br from-[#5865F2] to-[#23272A]" // Blurple vers gris foncé
            borderColor="border-[#5865F2]/40"
            url="discord.com/invite/mindcityrp"
            urlBg="bg-[#5865F2]/40"
            urlBorder="border-[#5865F2]/60"
        />
    ];

    useEffect(() => {
        // Animation d'entrée initiale
        if (slideRef.current) {
            gsap.fromTo(slideRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
            );
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            // Animation de sortie
            if (slideRef.current) {
                gsap.to(slideRef.current, {
                    opacity: 0,
                    x: -50,
                    duration: 0.5,
                    ease: "power2.in",
                    onComplete: () => {
                        setCurrentSlide((prev) => (prev + 1) % slides.length);
                        // Animation d'entrée
                        gsap.fromTo(slideRef.current,
                            { opacity: 0, x: 50 },
                            { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
                        );
                    }
                });
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center font-sans overflow-hidden m-0 p-0">
            <div ref={slideRef} className="w-full h-full flex items-center justify-center">
                {slides[currentSlide]}
            </div>
        </div>
    );
}