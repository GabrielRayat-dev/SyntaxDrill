"use server";

import { AuthError } from "next-auth";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/passwords";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "@/lib/validation";
import { signIn } from "@/lib/auth";

export interface AuthActionState {
  error?: string;
  fields?: { username?: string; email?: string };
}

export async function registerUser(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const username = (formData.get("username") ?? "").toString().trim().toLowerCase();
  const email = (formData.get("email") ?? "").toString().trim().toLowerCase();
  const password = (formData.get("password") ?? "").toString();
  const confirm = (formData.get("confirmPassword") ?? "").toString();
  const fields = { username, email };

  const usernameErr = validateUsername(username);
  if (usernameErr) return { error: usernameErr, fields };
  const emailErr = validateEmail(email);
  if (emailErr) return { error: emailErr, fields };
  const passwordErr = validatePassword(password);
  if (passwordErr) return { error: passwordErr, fields };
  if (password !== confirm)
    return { error: "Passwords do not match.", fields };

  const emailTaken = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (emailTaken.length > 0)
    return { error: "That email is already in use. Sign in instead.", fields };

  const usernameTaken = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  if (usernameTaken.length > 0)
    return { error: "That username is taken.", fields };

  await db.insert(users).values({
    id: crypto.randomUUID(),
    username,
    email,
    passwordHash: await hashPassword(password),
    createdAt: new Date(),
  });

  try {
    await signIn("credentials", { email, password, redirectTo: "/app" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created, but sign-in failed. Please sign in.", fields };
    }
    throw error;
  }
  return { error: undefined, fields };
}
