import { NextResponse } from "next/server";

export async function POST() {
	try {
		const response = NextResponse.json(
			{ success: true, message: "Déconnexion réussie" },
			{ status: 200 },
		);

		// Supprimer le cookie de session
		response.cookies.set("dashboard-session", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 0,
			path: "/", // Même path que pour la création
		});

		return response;
	} catch {
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}
