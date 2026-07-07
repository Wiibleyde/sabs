import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/session";

export async function POST() {
	try {
		const response = NextResponse.json(
			{ success: true, message: "Déconnexion réussie" },
			{ status: 200 },
		);
		clearSessionCookie(response);
		return response;
	} catch {
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}
