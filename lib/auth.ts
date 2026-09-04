import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE_NAME, SESSION_DURATION_SECONDS } from "@/lib/session";

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

/**
 * Verifies a login against the AdminUser table. The bcrypt hash lives in the
 * database — never in .env — so rotating a password or adding another admin
 * needs no redeploy.
 */
export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const admin = await prisma.adminUser.findUnique({
    where: { username: username.trim() },
  });

  // Compare against a dummy hash when the user doesn't exist so that a wrong
  // username and a wrong password take the same amount of time to reject.
  if (!admin) {
    await bcrypt.compare(password, "$2b$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin");
    return false;
  }

  return bcrypt.compare(password, admin.passwordHash);
}

export async function createSessionCookie(username: string) {
  const token = await new SignJWT({ username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());

  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
}

export async function getSessionFromToken(token: string | undefined | null) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (payload.role !== "admin") return null;
    return payload as { username: string; role: string };
  } catch {
    return null;
  }
}

/** Reads and verifies the current request's session cookie. Used in Server Components / route handlers. */
export async function getSession() {
  const store = await cookies();
  return getSessionFromToken(store.get(SESSION_COOKIE_NAME)?.value);
}

/**
 * Must be called at the top of every admin server action and admin API route.
 * Middleware protects page navigation, but a server action can be invoked
 * directly over HTTP, so authorization is re-checked here independently.
 */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export { SESSION_COOKIE_NAME };
