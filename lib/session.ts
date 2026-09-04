/**
 * Session constants shared by middleware (Edge runtime) and server code.
 * Deliberately dependency-free: middleware must not transitively import
 * Prisma or any Node-only module, which is why this lives outside lib/auth.ts.
 */
export const SESSION_COOKIE_NAME = "zs_admin_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days
