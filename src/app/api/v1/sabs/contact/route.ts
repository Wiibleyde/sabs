import { type NextRequest, NextResponse } from "next/server";

const LOGO_URL = "https://sabs.vercel.app/img/sabs/sabs-logo-small.png";
const WEBHOOK_NAME = "SABS Requests";
const EMBED_COLOR = 0x1abc9c;

interface ContactBody {
	nom: string;
	prenom: string;
	email: string;
	phone: string;
	typeEvent: string;
	objet: string;
	message: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
	const webhookUrl = process.env.SABS_DISCORD_WEBHOOK_URL;
	if (!webhookUrl) {
		console.error("SABS_DISCORD_WEBHOOK_URL is not configured");
		return NextResponse.json(
			{ message: "Server misconfigured" },
			{ status: 500 },
		);
	}

	let body: Partial<ContactBody>;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
	}

	const { nom, prenom, email, phone, typeEvent, objet, message } = body;
	if (!nom || !prenom || !email || !phone || !typeEvent || !objet || !message) {
		return NextResponse.json(
			{ message: "Missing required fields" },
			{ status: 400 },
		);
	}

	const response = await fetch(webhookUrl, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			embeds: [
				{
					title: "📬 Nouveau message de contact",
					description: `**Nom :** ${nom}  \n**Prénom :** ${prenom}`,
					color: EMBED_COLOR,
					thumbnail: { url: LOGO_URL },
					fields: [
						{ name: "✉️ Email", value: email, inline: true },
						{ name: "📞 Téléphone", value: phone, inline: true },
						{ name: "🎉 Type d'événement", value: typeEvent, inline: true },
						{ name: "📌 Objet", value: objet },
						{ name: "💬 Message", value: message },
					],
					timestamp: new Date().toISOString(),
					footer: { text: WEBHOOK_NAME, icon_url: LOGO_URL },
				},
			],
			username: WEBHOOK_NAME,
			avatar_url: LOGO_URL,
		}),
	});

	if (!response.ok) {
		console.error("Error sending message to Discord:", response.statusText);
		return NextResponse.json(
			{ message: "Error sending message" },
			{ status: 500 },
		);
	}
	return NextResponse.json({ message: "Message sent" });
}
