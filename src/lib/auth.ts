import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { getDb } from "./db";

const COOKIE_NAME = "canaa_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8h — one work shift

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET não configurado em .env.local");
  return new TextEncoder().encode(secret);
}

export interface AdminSession {
  sub: string; // admin email
  name: string;
}

export async function verifyCredentials(email: string, password: string) {
  const db = getDb();
  const row = db
    .prepare(`SELECT id, email, password_hash, name FROM admin_users WHERE email = ?`)
    .get(email) as { id: number; email: string; password_hash: string; name: string } | undefined;
  if (!row) return null;
  const ok = bcrypt.compareSync(password, row.password_hash);
  return ok ? { email: row.email, name: row.name } : null;
}

export async function createSession(session: AdminSession) {
  const token = await new SignJWT({ name: session.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function requireAdmin(): Promise<AdminSession | null> {
  return getSession();
}

export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return { sub: String(payload.sub), name: String(payload.name ?? "Admin") };
  } catch {
    return null;
  }
}
