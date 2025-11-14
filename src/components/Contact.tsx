"use client";
import { gsap } from "gsap";
import { Be_Vietnam_Pro } from "next/font/google";
import { useEffect, useRef, useState } from "react";

const BeVietnam = Be_Vietnam_Pro({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

interface FormData {
	nom: string;
	prenom: string;
	email: string;
	phone: string;
	typeEvent: string;
	objet: string;
	message: string;
}

export function Contact() {
	const containerRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const dividerRef = useRef<HTMLDivElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const [isVisible, setIsVisible] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<
		"idle" | "success" | "error"
	>("idle");

	const [formData, setFormData] = useState<FormData>({
		nom: "",
		prenom: "",
		email: "",
		phone: "",
		typeEvent: "",
		objet: "",
		message: "",
	});

	const eventTypes = [
		"Concert",
		"Podcast",
		"Émission",
		"Événement sportif",
		"Conférence",
		// 'Mariage',
		"Événement corporate",
		"Festival",
		// 'Théâtre',
		"Autre",
	];

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !isVisible) {
						setIsVisible(true);

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
								formRef.current,
								{
									opacity: 1,
									y: 0,
									duration: 0.8,
									ease: "power2.out",
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

		return () => observer.disconnect();
	}, [isVisible]);

	useEffect(() => {
		gsap.set([titleRef.current, formRef.current], {
			opacity: 0,
			y: 50,
		});

		gsap.set(dividerRef.current, {
			opacity: 1,
			scaleX: 0,
			transformOrigin: "center",
		});
	}, []);

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		const { name, value } = e.target;

		if (name === "phone") {
			// Only allow digits and limit to 4 characters for the XXXX part
			const digits = value.replace(/\D/g, "");
			const limitedDigits = digits.slice(0, 4);

			setFormData((prev) => ({
				...prev,
				[name]: limitedDigits ? `555-${limitedDigits}` : "",
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitStatus("idle");

		// Construct full email with @discord.gg and ensure phone format
		const fullEmail = `${formData.email}@discord.gg`;
		const submitData = {
			...formData,
			email: fullEmail,
			phone: formData.phone || "555-",
		};

		try {
			const response = await fetch("/api/v1/sabs/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(submitData),
			});

			if (response.ok) {
				setSubmitStatus("success");
				setFormData({
					nom: "",
					prenom: "",
					email: "",
					phone: "",
					typeEvent: "",
					objet: "",
					message: "",
				});
			} else {
				setSubmitStatus("error");
			}
		} catch {
			setSubmitStatus("error");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div
			className="snap-start relative bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 md:py-16 min-h-screen"
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

			<div
				ref={containerRef}
				className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8"
			>
				<div className="max-w-4xl mx-auto w-full">
					<div className="text-center mb-8 md:mb-12">
						<h2
							ref={titleRef}
							className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-thin text-gray-900 mb-4 tracking-[-0.02em] px-4"
						>
							Contactez{" "}
							<span className="text-sabs-primary font-medium">SABS</span>
						</h2>
						<div
							ref={dividerRef}
							className="w-16 md:w-24 h-[2px] bg-gradient-to-r from-sabs-gradient-1 via-sabs-gradient-2 to-sabs-primary mx-auto mb-4 md:mb-6 rounded-full"
						></div>
						<p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto font-light leading-relaxed px-4">
							Prêt à transformer votre événement ? Contactez-nous pour discuter
							de votre projet.
						</p>
					</div>

					<form
						ref={formRef}
						onSubmit={handleSubmit}
						className="bg-white/80 backdrop-blur-2xl rounded-2xl md:rounded-[1.5rem] p-4 sm:p-6 md:p-8 border border-gray-200/50 shadow-[0_20px_40px_0_rgba(31,38,135,0.1)] max-w-3xl mx-auto"
					>
						{/* Nom et Prénom */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-5">
							<div>
								<label
									htmlFor="prenom"
									className="block text-gray-700 font-medium mb-2 text-sm tracking-wide"
								>
									Prénom *
								</label>
								<input
									type="text"
									id="prenom"
									name="prenom"
									value={formData.prenom}
									onChange={handleInputChange}
									required
									className="w-full px-3 md:px-4 py-3 md:py-3 bg-gray-50/80 border border-gray-200 rounded-lg md:rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sabs-primary/30 focus:border-sabs-primary/50 transition-all duration-300 text-sm font-light min-h-[44px]"
									placeholder="Votre prénom"
								/>
							</div>
							<div>
								<label
									htmlFor="nom"
									className="block text-gray-700 font-medium mb-2 text-sm tracking-wide"
								>
									Nom *
								</label>
								<input
									type="text"
									id="nom"
									name="nom"
									value={formData.nom}
									onChange={handleInputChange}
									required
									className="w-full px-3 md:px-4 py-3 md:py-3 bg-gray-50/80 border border-gray-200 rounded-lg md:rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sabs-primary/30 focus:border-sabs-primary/50 transition-all duration-300 text-sm font-light min-h-[44px]"
									placeholder="Votre nom"
								/>
							</div>
						</div>

						{/* Email et Téléphone */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-5">
							<div>
								<label
									htmlFor="email"
									className="block text-gray-700 font-medium mb-2 text-sm tracking-wide"
								>
									Email Discord *
								</label>
								<div className="relative flex items-stretch bg-gray-50/80 border border-gray-200 rounded-lg md:rounded-xl focus-within:ring-2 focus-within:ring-sabs-primary/30 focus-within:border-sabs-primary/50 transition-all duration-300 overflow-hidden min-h-[44px]">
									<input
										type="text"
										id="email"
										name="email"
										value={formData.email}
										onChange={handleInputChange}
										required
										className="flex-1 px-3 md:px-4 py-3 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm font-light min-w-0"
										placeholder="username"
										pattern="^[a-zA-Z0-9._-]+$"
										title="Seuls les lettres, chiffres, points, tirets et underscores sont autorisés"
									/>
									<div className="px-2 md:px-3 py-3 bg-gradient-to-r from-sabs-primary/10 to-sabs-gradient-2/10 text-sabs-primary font-medium text-xs md:text-sm border-l border-sabs-primary/20 flex-shrink-0 flex items-center">
										@discord.gg
									</div>
								</div>
								<p className="text-xs text-gray-400 mt-1 italic">
									Nom d&apos;utilisateur Discord fictif (roleplay)
								</p>
							</div>
							<div>
								<label
									htmlFor="phone"
									className="block text-gray-700 font-medium mb-2 text-sm tracking-wide"
								>
									Téléphone *
								</label>
								<div className="relative flex items-stretch bg-gray-50/80 border border-gray-200 rounded-lg md:rounded-xl focus-within:ring-2 focus-within:ring-sabs-primary/30 focus-within:border-sabs-primary/50 transition-all duration-300 overflow-hidden min-h-[44px]">
									<div className="px-2 md:px-3 py-3 bg-gradient-to-r from-sabs-primary/10 to-sabs-gradient-2/10 text-sabs-primary font-medium text-xs md:text-sm border-r border-sabs-primary/20 flex-shrink-0 flex items-center">
										555-
									</div>
									<input
										type="text"
										id="phone"
										name="phone"
										value={formData.phone.replace("555-", "")}
										onChange={handleInputChange}
										required
										className="flex-1 px-3 md:px-4 py-3 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm font-light min-w-0"
										placeholder="1234"
										maxLength={4}
										inputMode="numeric"
										title="4 chiffres pour compléter le format 555-XXXX"
									/>
								</div>
								<p className="text-xs text-gray-400 mt-1 italic">
									Numéro fictif au format 555-XXXX (roleplay)
								</p>
							</div>
						</div>

						{/* Type d'événement et Objet */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-5">
							<div>
								<label
									htmlFor="typeEvent"
									className="block text-gray-700 font-medium mb-2 text-sm tracking-wide"
								>
									Type d&apos;événement *
								</label>
								<select
									id="typeEvent"
									name="typeEvent"
									value={formData.typeEvent}
									onChange={handleInputChange}
									required
									className="w-full px-3 md:px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-lg md:rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-sabs-primary/30 focus:border-sabs-primary/50 transition-all duration-300 text-sm font-light appearance-none cursor-pointer min-h-[44px]"
								>
									<option value="" className="bg-white">
										Sélectionnez un type
									</option>
									{eventTypes.map((type) => (
										<option key={type} value={type} className="bg-white">
											{type}
										</option>
									))}
								</select>
							</div>
							<div>
								<label
									htmlFor="objet"
									className="block text-gray-700 font-medium mb-2 text-sm tracking-wide"
								>
									Objet *
								</label>
								<input
									type="text"
									id="objet"
									name="objet"
									value={formData.objet}
									onChange={handleInputChange}
									required
									className="w-full px-3 md:px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-lg md:rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sabs-primary/30 focus:border-sabs-primary/50 transition-all duration-300 text-sm font-light min-h-[44px]"
									placeholder="Objet de votre demande"
								/>
							</div>
						</div>

						{/* Message */}
						<div className="mb-4 md:mb-5">
							<label
								htmlFor="message"
								className="block text-gray-700 font-medium mb-2 text-sm tracking-wide"
							>
								Message *
							</label>
							<textarea
								id="message"
								name="message"
								value={formData.message}
								onChange={handleInputChange}
								required
								rows={3}
								className="w-full px-3 md:px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-lg md:rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sabs-primary/30 focus:border-sabs-primary/50 transition-all duration-300 resize-none text-sm font-light leading-relaxed min-h-[80px]"
								placeholder="Décrivez votre projet en détail..."
							/>
						</div>

						{submitStatus === "success" && (
							<div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg md:rounded-xl text-green-700 text-sm flex items-start gap-2">
								<div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
									<svg
										className="w-3 h-3 text-white"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<title>Succès</title>
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<span>
									Message envoyé avec succès ! Nous vous recontacterons bientôt.
								</span>
							</div>
						)}

						{submitStatus === "error" && (
							<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg md:rounded-xl text-red-700 text-sm flex items-start gap-2">
								<div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
									<svg
										className="w-3 h-3 text-white"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<title>Erreur</title>
										<path
											fillRule="evenodd"
											d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<span>Une erreur s&apos;est produite. Veuillez réessayer.</span>
							</div>
						)}

						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full bg-gradient-to-r from-sabs-gradient-1 via-sabs-gradient-2 to-sabs-primary hover:shadow-[0_10px_30px_0_rgba(115,115,180,0.3)] text-white font-medium py-4 px-6 rounded-lg md:rounded-xl transition-all duration-500 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98] will-change-transform text-base tracking-wide min-h-[56px] flex items-center justify-center"
						>
							{isSubmitting ? (
								<span className="flex items-center justify-center gap-2">
									<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
									Envoi en cours...
								</span>
							) : (
								"Envoyer le message"
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
