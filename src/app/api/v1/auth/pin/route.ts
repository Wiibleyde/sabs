import { sign, verify } from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";

// PIN sécurisé - en production, utilisez une variable d'environnement
const SECURE_PIN = process.env.DASHBOARD_PIN || "2025";
const JWT_SECRET = process.env.JWT_SECRET || "sabs-dashboard-secret-key-2025";

interface SessionPayload {
	authenticated: boolean;
	timestamp: number;
}

function createSessionToken(): string {
	const payload: SessionPayload = {
		authenticated: true,
		timestamp: Date.now(),
	};

	return sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

function verifySessionToken(token: string): boolean {
	try {
		const decoded = verify(token, JWT_SECRET) as SessionPayload;
		return decoded.authenticated === true;
	} catch {
		return false;
	}
}

export async function POST(request: NextRequest) {
	try {
		const { pin } = await request.json();

		if (!pin) {
			return NextResponse.json({ error: "PIN requis" }, { status: 400 });
		}

		if (pin === SECURE_PIN) {
			// Créer un token JWT sécurisé
			const sessionToken = createSessionToken();

			const response = NextResponse.json(
				{ success: true, message: "PIN valide", authenticated: true },
				{ status: 200 },
			);

			// Définir un cookie de session sécurisé
			response.cookies.set("dashboard-session", sessionToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: 60 * 60 * 24, // 24 heures
				path: "/", // Disponible sur tout le site
			});

			return response;
		} else {
			return NextResponse.json({ error: "PIN incorrect" }, { status: 401 });
		}
	} catch (error) {
		console.error("Erreur dans POST /api/v1/auth/pin:", error);
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}

export async function GET(request: NextRequest) {
	try {
		const sessionCookie = request.cookies.get("dashboard-session");

		if (sessionCookie?.value && verifySessionToken(sessionCookie.value)) {
			return NextResponse.json({ authenticated: true }, { status: 200 });
		} else {
			// Supprimer le cookie invalide s'il existe
			const response = NextResponse.json(
				{ authenticated: false },
				{ status: 401 },
			);

			if (sessionCookie?.value) {
				response.cookies.set("dashboard-session", "", {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "strict",
					maxAge: 0,
					path: "/",
				});
			}

			return response;
		}
	} catch (error) {
		console.error("Erreur dans GET /api/v1/auth/pin:", error);
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}
