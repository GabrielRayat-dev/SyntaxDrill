import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import SettingsPanel from "./SettingsPanel";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  if (!user) redirect("/signin");

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/app"
        className="mb-4 inline-block text-xs font-medium text-muted transition-colors hover:text-ink"
      >
        ← Tracks
      </Link>
      <p className="signal-kicker mb-3">Your account</p>
      <h1 className="mb-8 text-4xl font-medium tracking-[-0.05em] text-ink">
        Settings
      </h1>
      <SettingsPanel
        userId={user.id}
        username={user.username}
        name={user.name}
        email={user.email}
        image={user.image}
        hasPassword={Boolean(user.passwordHash)}
      />
    </div>
  );
}
