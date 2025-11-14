"use client";
import { gsap } from "gsap";
import { Be_Vietnam_Pro } from "next/font/google";
import { useEffect, useRef, useState } from "react";

const BeVietnam = Be_Vietnam_Pro({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export function Presentation() {
	const containerRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const dividerRef = useRef<HTMLDivElement>(null);
	const firstParagraphRef = useRef<HTMLParagraphElement>(null);
	const secondParagraphRef = useRef<HTMLParagraphElement>(null);
	const cardsRef = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !isVisible) {
						setIsVisible(true);

						// Main timeline
						const tl = gsap.timeline({ delay: 0.2 });

						tl.to(titleRef.current, {
							opacity: 1,
							y: 0,
							duration: 0.8,
							ease: "power2.out",
						})
							.to(
								dividerRef.current,
								{
									opacity: 1,
									scaleX: 1,
									duration: 0.6,
									ease: "power2.out",
								},
								"-=0.4",
							)
							.to(
								firstParagraphRef.current,
								{
									opacity: 1,
									y: 0,
									duration: 0.6,
									ease: "power2.out",
								},
								"-=0.2",
							)
							.to(
								secondParagraphRef.current,
								{
									opacity: 1,
									y: 0,
									duration: 0.6,
									ease: "power2.out",
								},
								"-=0.3",
							)
							.to(
								cardsRef.current?.children || [],
								{
									opacity: 1,
									y: 0,
									duration: 0.6,
									ease: "back.out(1.2)",
									stagger: 0.1,
								},
								"-=0.2",
							);
					}
				});
			},
			{ threshold: 0.3, rootMargin: "0px 0px -100px 0px" },
		);

		if (containerRef.current) {
			observer.observe(containerRef.current);
		}

		return () => {
			observer.disconnect();
		};
	}, [isVisible]);

	// Set initial state
	useEffect(() => {
		gsap.set(
			[titleRef.current, firstParagraphRef.current, secondParagraphRef.current],
			{
				opacity: 0,
				y: 50,
			},
		);

		gsap.set(dividerRef.current, {
			opacity: 1,
			scaleX: 0,
			transformOrigin: "center",
		});

		gsap.set(cardsRef.current?.children || [], {
			opacity: 0,
			y: 30,
		});
	}, []);

	return (
		<div
			className="snap-start min-h-screen max-h-screen relative bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 py-8 md:py-12"
			style={{ fontFamily: BeVietnam.style.fontFamily }}
			id="presentation"
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

			<div
				ref={containerRef}
				className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 min-h-screen flex items-center"
			>
				<div className="max-w-6xl mx-auto text-center w-full">
					<div className="mb-6 md:mb-8">
						<h2
							ref={titleRef}
							className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-thin text-gray-900 mb-4 tracking-[-0.02em] px-4"
						>
							Qu&apos;est-ce que{" "}
							<span className="text-sabs-primary font-medium">SABS</span> ?
						</h2>
						<div
							ref={dividerRef}
							className="w-16 md:w-24 h-[2px] bg-gradient-to-r from-sabs-gradient-1 via-sabs-gradient-2 to-sabs-primary mx-auto mb-4 md:mb-6 rounded-full"
						></div>
					</div>

					<div className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed space-y-4 md:space-y-6 font-light px-4">
						<p ref={firstParagraphRef} className="max-w-4xl mx-auto">
							<span className="text-sabs-primary font-medium">SABS</span> est
							une micro entreprise spécialisée dans la gestion de
							<span className="text-sabs-primary font-medium">
								{" "}
								rediffusions en direct multicaméra
							</span>{" "}
							pour tout type d&apos;événement.
						</p>

						<p ref={secondParagraphRef} className="max-w-4xl mx-auto">
							Nous nous engageons à offrir une couverture professionnelle et
							immersive, transformant chaque moment en une expérience
							audiovisuelle de qualité.
						</p>

						<div
							ref={cardsRef}
							className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12 max-w-5xl mx-auto"
						>
							<div className="group p-4 md:p-6 bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-[1.5rem] border border-gray-200/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] hover:shadow-[0_20px_40px_0_rgba(31,38,135,0.15)] transition-all duration-500 hover:scale-[1.02] will-change-transform">
								<div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-sabs-gradient-1 to-sabs-gradient-2 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-500">
									<svg
										className="w-5 md:w-6 h-5 md:h-6 text-white"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<title>Multicaméra</title>
										<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
									</svg>
								</div>
								<h3 className="text-sabs-primary font-semibold text-lg md:text-xl mb-2 md:mb-3 tracking-tight">
									Multicaméra
								</h3>
								<p className="text-gray-600 text-sm md:text-base leading-relaxed">
									Couverture complète avec plusieurs angles de vue
								</p>
							</div>
							<div className="group p-4 md:p-6 bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-[1.5rem] border border-gray-200/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] hover:shadow-[0_20px_40px_0_rgba(31,38,135,0.15)] transition-all duration-500 hover:scale-[1.02] will-change-transform">
								<div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-sabs-gradient-2 to-sabs-gradient-3 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-500">
									<svg
										className="w-5 md:w-6 h-5 md:h-6 text-white"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<title>Direct</title>
										<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
									</svg>
								</div>
								<h3 className="text-sabs-primary font-semibold text-lg md:text-xl mb-2 md:mb-3 tracking-tight">
									Direct
								</h3>
								<p className="text-gray-600 text-sm md:text-base leading-relaxed">
									Retransmission en temps réel de vos événements
								</p>
							</div>
							<div className="group p-4 md:p-6 bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-[1.5rem] border border-gray-200/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] hover:shadow-[0_20px_40px_0_rgba(31,38,135,0.15)] transition-all duration-500 hover:scale-[1.02] will-change-transform">
								<div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-sabs-gradient-3 to-sabs-primary rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-500">
									<svg
										className="w-5 md:w-6 h-5 md:h-6 text-white"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<title>Tout événement</title>
										<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
									</svg>
								</div>
								<h3 className="text-sabs-primary font-semibold text-lg md:text-xl mb-2 md:mb-3 tracking-tight">
									Tout événement
								</h3>
								<p className="text-gray-600 text-sm md:text-base leading-relaxed">
									Solutions adaptables à tous types de manifestations
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
