// Import avec require pour éviter les problèmes ESM
import jwt from "jsonwebtoken";

// Clé secrète pour signer les JWT (en production, utilisez une clé plus complexe)
const JWT_SECRET = process.env.JWT_SECRET || "sabs-dashboard-secret-key-2025";

export interface SessionPayload {
	authenticated: boolean;
	timestamp: number;
	exp: number;
}

export function createSessionToken(): string {
	const payload: SessionPayload = {
		authenticated: true,
		timestamp: Date.now(),
		exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 heures
	};

	return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

export function verifySessionToken(token: string): SessionPayload | null {
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as SessionPayload;

		// Vérification additionnelle de la validité
		if (!decoded.authenticated || decoded.timestamp > Date.now()) {
			return null;
		}

		return decoded;
	} catch {
		// Token invalide, expiré ou malformé
		return null;
	}
}

export function isValidSession(token: string | undefined): boolean {
	if (!token) return false;

	const payload = verifySessionToken(token);
	return payload?.authenticated === true;
}
