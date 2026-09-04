import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Server-only client using the service role key. Only ever import this from
 * server actions / route handlers guarded by requireAdmin() — it bypasses RLS.
 */
export function getSupabaseAdmin() {
  if (!url || !serviceRoleKey) {
    throw new Error("Supabase env vars are not set (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
