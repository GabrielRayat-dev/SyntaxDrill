import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { records } from "@/db/schema";
import { auth } from "@/lib/auth";
import type { StatRecord } from "@/types";

function parseRecord(raw: unknown): StatRecord | null {
  if (!raw || typeof raw !== "object") return null;
  const rec = raw as Partial<StatRecord>;
  if (typeof rec.id !== "string") return null;
  if (rec.kind !== "code" && rec.kind !== "speed") return null;
  if (typeof rec.startedAt !== "string") return null;
  return rec as StatRecord;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select({ id: records.id, data: records.data })
    .from(records)
    .where(eq(records.userId, session.user.id));

  const list = rows
    .map((r) => r.data as StatRecord)
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt));
  return NextResponse.json({ records: list });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const list = Array.isArray(body)
    ? body
    : (body as { records?: unknown })?.records;
  if (!Array.isArray(list)) {
    return NextResponse.json({ error: "Expected records array" }, { status: 400 });
  }

  const parsed = list
    .map(parseRecord)
    .filter((r): r is StatRecord => r !== null);

  if (parsed.length > 0) {
    await db
      .insert(records)
      .values(
        parsed.map((r) => ({
          id: r.id,
          userId: session.user!.id,
          kind: r.kind,
          startedAt: new Date(r.startedAt),
          data: r,
        })),
      )
      .onConflictDoNothing();
  }

  return NextResponse.json({ uploaded: parsed.length });
}
