'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Be_Vietnam_Pro } from 'next/font/google';
import Markdown from 'markdown-to-jsx';
import Link from 'next/link';

const BeVietnam = Be_Vietnam_Pro({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
});

export default function LegalMentions() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Animation on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isVisible) {
                        setIsVisible(true);

                        // Simple timeline
                        const tl = gsap.timeline({ delay: 0.2 });

                        tl.to(titleRef.current, {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: 'power2.out',
                        }).to(
                            contentRef.current,
                            {
                                opacity: 1,
                                y: 0,
                                duration: 0.6,
                                ease: 'power2.out',
                            },
                            '-=0.2'
                        );
                    }
                });
            },
            { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [isVisible]);

    return (
        <div
            ref={containerRef}
            className="min-h-screen relative bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 py-12"
            style={{ fontFamily: BeVietnam.style.fontFamily }}
        >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #7373B4 0%, transparent 70%), 
                                     radial-gradient(circle at 75% 75%, #85527E 0%, transparent 70%)`,
                    }}
                ></div>
            </div>

            <div className="relative z-10 px-6 max-w-4xl mx-auto">
                {/* Title Section */}
                <div ref={titleRef} className="text-center mb-8 opacity-0 translate-y-12">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-thin text-gray-900 mb-4 tracking-[-0.02em]">
                        Mentions <span className="text-sabs-primary font-medium">Légales</span>
                    </h1>
                    <div className="w-16 md:w-24 h-[2px] bg-gradient-to-r from-sabs-gradient-1 via-sabs-gradient-2 to-sabs-primary mx-auto rounded-full mb-4"></div>
                    <p className="text-gray-700 text-lg font-light">Informations légales (HORS RÔLEPLAY)</p>
                </div>

                {/* Content Section */}
                <div
                    ref={contentRef}
                    className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-[1.5rem] p-6 md:p-8 border border-gray-200/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] hover:shadow-[0_20px_40px_0_rgba(31,38,135,0.15)] transition-all duration-500 opacity-0 translate-y-12"
                >
                    <div className="markdownApplicable">
                        <Markdown
                            options={{
                                overrides: {
                                    h2: {
                                        component: ({ children, ...props }) => (
                                            <h2
                                                {...props}
                                                className="group flex items-center gap-3 text-2xl font-semibold text-sabs-primary mb-4 mt-8 first:mt-0 border-b border-gray-200/50 pb-2 hover:border-sabs-primary/50 transition-colors duration-300"
                                            >
                                                <div className="w-2 h-2 bg-gradient-to-r from-sabs-gradient-1 to-sabs-gradient-2 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                                                {children}
                                            </h2>
                                        ),
                                    },
                                    h3: {
                                        component: ({ children, ...props }) => (
                                            <h3
                                                {...props}
                                                className="text-xl font-semibold text-sabs-primary mb-3 mt-6"
                                            >
                                                {children}
                                            </h3>
                                        ),
                                    },
                                    p: {
                                        component: ({ children, ...props }) => (
                                            <p
                                                {...props}
                                                className="text-gray-700 leading-relaxed mb-4 hover:text-gray-600 transition-colors duration-200"
                                            >
                                                {children}
                                            </p>
                                        ),
                                    },
                                    ul: {
                                        component: ({ children, ...props }) => (
                                            <ul
                                                {...props}
                                                className="list-disc list-inside text-gray-700 mb-4 space-y-1"
                                            >
                                                {children}
                                            </ul>
                                        ),
                                    },
                                    li: {
                                        component: ({ children, ...props }) => (
                                            <li
                                                {...props}
                                                className="text-gray-700 leading-relaxed hover:text-gray-600 duration-200 hover:translate-x-1 transition-all"
                                            >
                                                {children}
                                            </li>
                                        ),
                                    },
                                    a: {
                                        component: ({ children, href, ...props }) => (
                                            <a
                                                {...props}
                                                href={href}
                                                className="group relative text-sabs-primary hover:text-sabs-gradient-2 transition-colors duration-200 font-medium"
                                                target={href?.startsWith('http') ? '_blank' : undefined}
                                                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                aria-label={
                                                    href?.startsWith('http')
                                                        ? `Lien externe vers ${children}`
                                                        : undefined
                                                }
                                            >
                                                {children}
                                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-sabs-gradient-1 to-sabs-primary group-hover:w-full transition-all duration-300"></span>
                                                {href?.startsWith('http') && (
                                                    <svg
                                                        className="inline w-3 h-3 ml-1 opacity-60 group-hover:opacity-100 transition-opacity"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                        />
                                                    </svg>
                                                )}
                                            </a>
                                        ),
                                    },
                                    strong: {
                                        component: ({ children, ...props }) => (
                                            <strong {...props} className="text-gray-900 font-semibold">
                                                {children}
                                            </strong>
                                        ),
                                    },
                                    em: {
                                        component: ({ children, ...props }) => (
                                            <em {...props} className="text-sabs-primary font-medium">
                                                {children}
                                            </em>
                                        ),
                                    },
                                },
                            }}
                        >
                            {frenchMd}
                        </Markdown>
                    </div>

                    {/* Contact Section */}
                    <div className="mt-8 pt-6 border-t border-gray-200/50">
                        <div className="bg-gradient-to-r from-sabs-primary/10 to-sabs-gradient-2/10 backdrop-blur-sm rounded-2xl p-6 border border-sabs-primary/20 shadow-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <svg
                                    className="w-5 h-5 text-sabs-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                Contact
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                Pour toute question concernant ces mentions légales ou ce site web, vous pouvez me
                                contacter à l&apos;adresse{' '}
                                <a
                                    href="mailto:nathan@bonnell.fr"
                                    aria-label="Envoyer un email à Nathan Bonnell"
                                    className="group relative text-sabs-primary hover:text-sabs-gradient-2 transition-colors duration-200 font-medium"
                                >
                                    nathan@bonnell.fr
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-sabs-gradient-1 to-sabs-primary group-hover:w-full transition-all duration-300"></span>
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Back to home button */}
                <div className="text-center mt-8">
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-2 bg-gradient-to-r from-sabs-gradient-1 via-sabs-gradient-2 to-sabs-primary hover:from-sabs-gradient-2 hover:to-sabs-primary text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-sabs-primary/25 transform hover:scale-105"
                    >
                        <svg
                            className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Retour à l&apos;accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}

const frenchMd = `
## Éditeur du site

- Nom : Bonnell
- Prénom : Nathan
- Email : <nathan@bonnell.fr>
- Site web : <https://nathan.bonnell.fr>
- Date de publication : 2025

## Hébergement

Le site est hébergé sur la plateforme Vercel (<https://vercel.com>).

Nom de domaine enregistré chez OVH.

## Technologies utilisées

Ce site est développé avec Next.js, Tailwind CSS et Prisma.

Hébergé avec Docker, Nginx, Proxmox et Rocky Linux.

## Propriété intellectuelle

L'ensemble des contenus présents sur ce site (textes, images, vidéos, etc.) sont la propriété exclusive de Nathan Bonnell, sauf mention contraire.

La vidéo présente sur la page d'accueil est une vidéo indiqué comme étant libre de droits.

Les logos de San Andreas Broadcast Service sont des créations originales.

## Responsabilité

L'éditeur du site met tout en œuvre pour assurer l'exactitude des informations publiées, mais ne saurait être tenu responsable des erreurs ou omissions. L'utilisation des informations disponibles sur ce site se fait sous la responsabilité exclusive de l'utilisateur.

## Données personnelles

Ce site ne collecte aucune donnée personnelle à des fins commerciales. Pour toute question ou demande relative aux données personnelles, vous pouvez contacter l'éditeur à l'adresse mentionnée ci-dessus.

## Droit applicable

Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
`;
