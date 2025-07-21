import type { Metadata } from 'next';
import './globals.css';
import { Montserrat } from 'next/font/google';
import Logo from '@public/img/sabs/sabs-logo-small.png';

export const metadata: Metadata = {
    title: "SABS - Page d'accueil",
    description: "Page d'accueil du site SABS, le site de la micro entreprise SABS.",
    icons: {
        icon: Logo.src,
    },
    openGraph: {
        type: 'website',
        url: 'https://sabs.vercel.app/sabs',
        title: "SABS - Page d'accueil",
        description: "Page d'accueil du site SABS, le site de la micro entreprise SABS.",
        images: [
            {
                url: 'https://sabs.vercel.app/img/sabs/sabs-logo.png',
                width: 1200,
                height: 1200,
                alt: "SABS - Page d'accueil",
            },
        ],
    },
};

const montserrat = Montserrat({
    subsets: ['latin'],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body className={`antialiased ${montserrat.className} bg-black`}>{children}</body>
        </html>
    );
}
