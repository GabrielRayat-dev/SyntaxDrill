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
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 font-display text-2xl font-semibold tracking-tight text-ink">
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
