import { type NextRequest, NextResponse } from "next/server";
import {
	clearSessionCookie,
	createSessionToken,
	SESSION_COOKIE,
	setSessionCookie,
	verifySessionToken,
} from "@/lib/session";

const SECURE_PIN = process.env.DASHBOARD_PIN || "2025";

export async function POST(request: NextRequest) {
	try {
		const { pin } = await request.json();

		if (!pin) {
			return NextResponse.json({ error: "PIN requis" }, { status: 400 });
		}

		if (pin !== SECURE_PIN) {
			return NextResponse.json({ error: "PIN incorrect" }, { status: 401 });
		}

		const response = NextResponse.json(
			{ success: true, message: "PIN valide", authenticated: true },
			{ status: 200 },
		);
		setSessionCookie(response, createSessionToken());
		return response;
	} catch (error) {
		console.error("Erreur dans POST /api/v1/auth/pin:", error);
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}

export async function GET(request: NextRequest) {
	try {
		const sessionCookie = request.cookies.get(SESSION_COOKIE);

		if (sessionCookie?.value && verifySessionToken(sessionCookie.value)) {
			return NextResponse.json({ authenticated: true }, { status: 200 });
		}

		const response = NextResponse.json(
			{ authenticated: false },
			{ status: 401 },
		);
		if (sessionCookie?.value) {
			clearSessionCookie(response);
		}
		return response;
	} catch (error) {
		console.error("Erreur dans GET /api/v1/auth/pin:", error);
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}
