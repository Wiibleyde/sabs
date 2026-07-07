import type { Metadata } from "next";
import "./globals.css";
import Logo from "@public/img/sabs/sabs-logo-small.png";
import { Montserrat } from "next/font/google";

const SITE_TITLE = "SABS - Page d'accueil";
const SITE_DESCRIPTION =
	"Page d'accueil du site SABS, le site de la micro entreprise SABS.";

export const metadata: Metadata = {
	title: SITE_TITLE,
	description: SITE_DESCRIPTION,
	icons: {
		icon: Logo.src,
	},
	openGraph: {
		type: "website",
		url: "https://sabs.vercel.app/sabs",
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		images: [
			{
				url: "https://sabs.vercel.app/img/sabs/sabs-logo-small.png",
				width: 320,
				height: 320,
				alt: SITE_TITLE,
			},
		],
	},
};

const montserrat = Montserrat({
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr" data-scroll-behavior="smooth">
			<head>
				<meta
					name="google-site-verification"
					content="z8LfwSZrZTZFup781IidjqL78fkW3nJ70BmwdgG0MOY"
				/>
			</head>
			<body className={`antialiased ${montserrat.className} bg-black`}>
				{children}
			</body>
		</html>
	);
}
