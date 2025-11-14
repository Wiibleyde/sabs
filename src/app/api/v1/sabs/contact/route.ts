import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
	if (!request.body) {
		return NextResponse.json({ message: "No body provided" }, { status: 400 });
	}

	const body = await request.json();
	const { nom, prenom, email, phone, typeEvent, objet, message } = body;

	if (!nom || !prenom || !email || !phone || !typeEvent || !objet || !message) {
		return NextResponse.json(
			{ message: "Missing required fields" },
			{ status: 400 },
		);
	}

	const response = await fetch(process.env.SABS_DISCORD_WEBHOOK_URL as string, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			embeds: [
				{
					title: "📬 Nouveau message de contact",
					description: `**Nom :** ${nom}  \n**Prénom :** ${prenom}`,
					color: 0x1abc9c, // Teal color
					thumbnail: {
						url: "https://sabs.vercel.app/img/sabs/sabs-logo-small.png",
					},
					fields: [
						{ name: "✉️ Email", value: email, inline: true },
						{ name: "📞 Téléphone", value: phone, inline: true },
						{ name: "🎉 Type d'événement", value: typeEvent, inline: true },
						{ name: "📌 Objet", value: objet },
						{ name: "💬 Message", value: message },
					],
					timestamp: new Date().toISOString(),
					footer: {
						text: "SABS Requests",
						icon_url: "https://sabs.vercel.app/img/sabs/sabs-logo-small.png",
					},
					image: {
						url: "https://sabs.vercel.app/img/sabs/sabs-logo.png",
					},
				},
			],
			username: "SABS Requests",
			avatar_url: "https://nathan.bonnell.fr/img/sabs/sabs-logo-small.png",
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
