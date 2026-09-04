"use server";

import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/validators";
import { verifyAdminCredentials, createSessionCookie, clearSessionCookie } from "@/lib/auth";

export type LoginState = { error?: string } | null;

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Please enter a valid username and password." };

  const valid = await verifyAdminCredentials(parsed.data.username, parsed.data.password);
  if (!valid) return { error: "Invalid username or password." };

  await createSessionCookie(parsed.data.username);
  redirect("/admin");
}

export async function logout() {
  await clearSessionCookie();
  redirect("/admin/login");
}
