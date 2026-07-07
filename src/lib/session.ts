import { sign, verify } from "jsonwebtoken";
import type { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "sabs-dashboard-secret-key-2025";
const SESSION_MAX_AGE = 60 * 60 * 24;

export const SESSION_COOKIE = "dashboard-session";

interface SessionPayload {
	authenticated: boolean;
	timestamp: number;
}

const COOKIE_BASE = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "strict",
	path: "/",
} as const;

export function createSessionToken(): string {
	const payload: SessionPayload = {
		authenticated: true,
		timestamp: Date.now(),
	};
	return sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

export function verifySessionToken(token: string): boolean {
	try {
		const decoded = verify(token, JWT_SECRET) as SessionPayload;
		return decoded.authenticated === true;
	} catch {
		return false;
	}
}

export function setSessionCookie(response: NextResponse, token: string): void {
	response.cookies.set(SESSION_COOKIE, token, {
		...COOKIE_BASE,
		maxAge: SESSION_MAX_AGE,
	});
}

export function clearSessionCookie(response: NextResponse): void {
	response.cookies.set(SESSION_COOKIE, "", { ...COOKIE_BASE, maxAge: 0 });
}
