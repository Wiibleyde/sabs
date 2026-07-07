"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { useGsapContext } from "@/hooks/useGsapContext";
import { ScrollReveal } from "./reactbits/ScrollReveal";

interface FormData {
	nom: string;
	prenom: string;
	email: string;
	phone: string;
	typeEvent: string;
	objet: string;
	message: string;
}

const EVENT_TYPES = [
	"Concert",
	"Podcast",
	"Émission",
	"Événement sportif",
	"Conférence",
	"Événement corporate",
	"Festival",
	"Autre",
];

const INITIAL_FORM: FormData = {
	nom: "",
	prenom: "",
	email: "",
	phone: "",
	typeEvent: "",
	objet: "",
	message: "",
};

const PHONE_PREFIX = "555-";
const DISCORD_SUFFIX = "@discord.gg";
const CONTACT_ENDPOINT = "/api/v1/sabs/contact";

const INPUT_CLASS =
	"w-full px-4 py-3 rounded-lg text-sm font-light text-white placeholder-sabs-muted bg-sabs-bg-4 border border-sabs-border outline-none transition-all duration-300 min-h-11 focus:border-sabs-green focus:ring-2 focus:ring-sabs-green/10";
const AFFIX_WRAPPER_CLASS =
	"flex items-center rounded-lg overflow-hidden min-h-11 bg-sabs-bg-4 border border-sabs-border focus-within:border-sabs-green focus-within:ring-2 focus-within:ring-sabs-green/10 transition-all duration-300";
const AFFIX_INPUT_CLASS =
	"flex-1 px-4 py-3 text-sm font-light text-white placeholder-sabs-muted bg-transparent outline-none";

const FEEDBACK = {
	success: {
		className: "bg-sabs-green/10 border border-sabs-green/30 text-sabs-green",
		title: "Succès",
		path: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
		message: "Message envoyé. Nous vous recontacterons bientôt.",
	},
	error: {
		className: "bg-sabs-red/10 border border-sabs-red/30 text-sabs-red",
		title: "Erreur",
		path: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
		message: "Une erreur s'est produite. Veuillez réessayer.",
	},
} as const;

function InputField({
	id,
	label,
	children,
}: {
	id: string;
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div>
			<label
				htmlFor={id}
				className="block text-xs font-semibold tracking-[0.15em] uppercase mb-2 text-sabs-muted"
			>
				{label} <span className="text-sabs-green">*</span>
			</label>
			{children}
		</div>
	);
}

function FormFeedback({ status }: { status: "success" | "error" }) {
	const feedback = FEEDBACK[status];
	return (
		<div
			className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${feedback.className}`}
		>
			<svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
				<title>{feedback.title}</title>
				<path fillRule="evenodd" d={feedback.path} clipRule="evenodd" />
			</svg>
			{feedback.message}
		</div>
	);
}

export function Contact() {
	const sectionRef = useRef<HTMLElement>(null);
	const headingRef = useRef<HTMLDivElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

	useGsapContext(sectionRef, () => {
		gsap.set([headingRef.current, formRef.current], { opacity: 0, y: 50 });

		ScrollTrigger.create({
			trigger: sectionRef.current,
			start: "top 70%",
			onEnter: () => {
				gsap.to(headingRef.current, {
					opacity: 1,
					y: 0,
					duration: 0.9,
					ease: "power3.out",
				});
				gsap.to(formRef.current, {
					opacity: 1,
					y: 0,
					duration: 0.8,
					ease: "power2.out",
					delay: 0.25,
				});
			},
		});
	});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		const { name, value } = e.target;
		if (name === "phone") {
			const digits = value.replace(/\D/g, "").slice(0, 4);
			setFormData((prev) => ({
				...prev,
				phone: digits ? `${PHONE_PREFIX}${digits}` : "",
			}));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setStatus("idle");

		const submitData = {
			...formData,
			email: `${formData.email}${DISCORD_SUFFIX}`,
			phone: formData.phone || PHONE_PREFIX,
		};

		try {
			const res = await fetch(CONTACT_ENDPOINT, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(submitData),
			});
			if (res.ok) {
				setStatus("success");
				setFormData(INITIAL_FORM);
			} else {
				setStatus("error");
			}
		} catch {
			setStatus("error");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section
			ref={sectionRef}
			id="contact"
			className="relative min-h-screen flex items-center py-20 md:py-28 bg-sabs-bg-2"
		>
			<div className="absolute left-0 bottom-0 right-0 h-1 sabs-gradient-bg" />

			<div className="container mx-auto px-6 sm:px-10 md:px-16 max-w-4xl">
				<div ref={headingRef} className="mb-12">
					<p className="text-xs font-semibold tracking-[0.4em] uppercase mb-4 text-sabs-green">
						Contact
					</p>
					<ScrollReveal
						as="h2"
						highlight="votre projet"
						start="top 70%"
						className="text-[clamp(2.5rem,7vw,5rem)] font-black leading-none tracking-tighter text-white mb-4"
					>
						Parlons de votre projet
					</ScrollReveal>
					<p className="text-base font-light text-sabs-muted">
						Prêt à transformer votre événement ? Contactez-nous.
					</p>
				</div>

				<form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<InputField id="prenom" label="Prénom">
							<input
								type="text"
								id="prenom"
								name="prenom"
								value={formData.prenom}
								onChange={handleChange}
								required
								placeholder="Votre prénom"
								className={INPUT_CLASS}
							/>
						</InputField>
						<InputField id="nom" label="Nom">
							<input
								type="text"
								id="nom"
								name="nom"
								value={formData.nom}
								onChange={handleChange}
								required
								placeholder="Votre nom"
								className={INPUT_CLASS}
							/>
						</InputField>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<InputField id="email" label="Email Discord">
							<div className={AFFIX_WRAPPER_CLASS}>
								<input
									type="text"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									required
									placeholder="username"
									pattern="^[a-zA-Z0-9._-]+$"
									className={AFFIX_INPUT_CLASS}
								/>
								<span className="px-3 text-xs font-semibold border-l border-sabs-border shrink-0 text-sabs-green">
									{DISCORD_SUFFIX}
								</span>
							</div>
							<p className="text-xs mt-1 italic text-sabs-muted-3">
								Nom d&apos;utilisateur Discord (roleplay)
							</p>
						</InputField>

						<InputField id="phone" label="Téléphone">
							<div className={AFFIX_WRAPPER_CLASS}>
								<span className="px-3 text-xs font-semibold border-r border-sabs-border shrink-0 text-sabs-green">
									{PHONE_PREFIX}
								</span>
								<input
									type="text"
									id="phone"
									name="phone"
									value={formData.phone.replace(PHONE_PREFIX, "")}
									onChange={handleChange}
									required
									placeholder="1234"
									maxLength={4}
									inputMode="numeric"
									className={AFFIX_INPUT_CLASS}
								/>
							</div>
							<p className="text-xs mt-1 italic text-sabs-muted-3">
								Format 555-XXXX (roleplay)
							</p>
						</InputField>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<InputField id="typeEvent" label="Type d'événement">
							<select
								id="typeEvent"
								name="typeEvent"
								value={formData.typeEvent}
								onChange={handleChange}
								required
								className={`${INPUT_CLASS} appearance-none cursor-pointer`}
							>
								<option value="" className="bg-sabs-bg-4">
									Sélectionnez
								</option>
								{EVENT_TYPES.map((t) => (
									<option key={t} value={t} className="bg-sabs-bg-4">
										{t}
									</option>
								))}
							</select>
						</InputField>

						<InputField id="objet" label="Objet">
							<input
								type="text"
								id="objet"
								name="objet"
								value={formData.objet}
								onChange={handleChange}
								required
								placeholder="Objet de votre demande"
								className={INPUT_CLASS}
							/>
						</InputField>
					</div>

					<InputField id="message" label="Message">
						<textarea
							id="message"
							name="message"
							value={formData.message}
							onChange={handleChange}
							required
							rows={4}
							placeholder="Décrivez votre projet..."
							className={`${INPUT_CLASS} resize-none`}
						/>
					</InputField>

					{status !== "idle" && <FormFeedback status={status} />}

					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full py-4 px-8 rounded-lg font-bold text-sm tracking-[0.2em] uppercase sabs-gradient-bg text-sabs-bg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-14 flex items-center justify-center hover:opacity-90"
					>
						{isSubmitting ? (
							<span className="flex items-center gap-2">
								<div className="w-4 h-4 border-2 border-sabs-bg/30 border-t-sabs-bg rounded-full animate-spin" />
								Envoi en cours...
							</span>
						) : (
							"Envoyer le message"
						)}
					</button>
				</form>
			</div>
		</section>
	);
}
