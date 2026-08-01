"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { accounts, users } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/passwords";
import { validatePassword, validateUsername } from "@/lib/validation";

export interface SettingsActionResult {
  error?: string;
  ok?: boolean;
}

export async function updateUsername(
  userId: string,
  _prev: { username?: string },
  formData: FormData,
): Promise<SettingsActionResult & { username?: string }> {
  const username = (formData.get("username") ?? "").toString().trim().toLowerCase();
  const err = validateUsername(username);
  if (err) return { error: err };

  const taken = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.username, username), eq(users.id, userId)))
    .limit(1);
  if (taken.length === 0) {
    const clash = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    if (clash.length > 0) return { error: "That username is taken." };
  }

  await db.update(users).set({ username }).where(eq(users.id, userId));
  revalidatePath("/settings");
  return { ok: true, username };
}

export async function setPassword(
  userId: string,
  _prev: SettingsActionResult | null,
  formData: FormData,
): Promise<SettingsActionResult> {
  const password = (formData.get("password") ?? "").toString();
  const confirm = (formData.get("confirm") ?? "").toString();
  const err = validatePassword(password);
  if (err) return { error: err };
  if (password !== confirm) return { error: "Passwords do not match." };

  const existing = await db
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (existing[0]?.passwordHash) return { error: "A password is already set." };

  await db
    .update(users)
    .set({ passwordHash: await hashPassword(password) })
    .where(eq(users.id, userId));
  revalidatePath("/settings");
  return { ok: true };
}

export async function changePassword(
  userId: string,
  _prev: SettingsActionResult | null,
  formData: FormData,
): Promise<SettingsActionResult> {
  const current = (formData.get("current") ?? "").toString();
  const password = (formData.get("password") ?? "").toString();
  const confirm = (formData.get("confirm") ?? "").toString();
  const err = validatePassword(password);
  if (err) return { error: err };
  if (password !== confirm) return { error: "Passwords do not match." };

  const [row] = await db
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!row?.passwordHash) return { error: "No password is set." };
  const ok = await verifyPassword(current, row.passwordHash);
  if (!ok) return { error: "Current password is incorrect." };

  await db
    .update(users)
    .set({ passwordHash: await hashPassword(password) })
    .where(eq(users.id, userId));
  revalidatePath("/settings");
  return { ok: true };
}

export async function removePassword(
  userId: string,
  _prev: SettingsActionResult | null,
  formData: FormData,
): Promise<SettingsActionResult> {
  const current = (formData.get("current") ?? "").toString();
  const [row] = await db
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!row?.passwordHash) return { error: "No password is set." };
  const ok = await verifyPassword(current, row.passwordHash);
  if (!ok) return { error: "Current password is incorrect." };

  const githubLinked = await db
    .select({ id: accounts.userId })
    .from(accounts)
    .where(and(eq(accounts.userId, userId), eq(accounts.provider, "github")))
    .limit(1);
  if (githubLinked.length === 0)
    return { error: "Connect GitHub before removing your password." };

  await db
    .update(users)
    .set({ passwordHash: null })
    .where(eq(users.id, userId));
  revalidatePath("/settings");
  return { ok: true };
}

export async function unlinkGithub(
  userId: string,
  _prev: SettingsActionResult | null,
  _formData: FormData,
): Promise<SettingsActionResult> {
  const [row] = await db
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!row?.passwordHash)
    return { error: "Set a password before disconnecting GitHub." };

  await db
    .delete(accounts)
    .where(and(eq(accounts.userId, userId), eq(accounts.provider, "github")));
  revalidatePath("/settings");
  return { ok: true };
}
