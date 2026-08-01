import type { StatRecord } from "@/types";
import {
  addRecord as addLocalRecord,
  clearRecords as clearLocalRecords,
  getRecords as getLocalRecords,
  subscribeRecords as subscribeLocalRecords,
} from "./local";

let remoteUserId: string | null = null;
let remoteRecords: StatRecord[] = [];
let hydrated = false;

const remoteListeners = new Set<() => void>();

function notifyRemote(): void {
  remoteListeners.forEach((cb) => cb());
}

function isRemote(): boolean {
  return remoteUserId !== null;
}

export function getRecords(): StatRecord[] {
  return isRemote() ? remoteRecords : getLocalRecords();
}

export function subscribeRecords(cb: () => void): () => void {
  const unsubLocal = subscribeLocalRecords(cb);
  remoteListeners.add(cb);
  return () => {
    unsubLocal();
    remoteListeners.delete(cb);
  };
}

export async function addRecord(record: StatRecord): Promise<void> {
  if (!isRemote()) {
    addLocalRecord(record);
    return;
  }
  remoteRecords = [...remoteRecords, record].sort((a, b) =>
    a.startedAt.localeCompare(b.startedAt),
  );
  notifyRemote();
  try {
    await fetch("/api/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ records: [record] }),
    });
  } catch {
    // offline — record stays in the in-memory snapshot; server is source on next hydrate
  }
}

export async function clearRecords(): Promise<void> {
  if (!isRemote()) {
    clearLocalRecords();
    return;
  }
  remoteRecords = [];
  notifyRemote();
}

export async function syncOnSignIn(userId: string): Promise<void> {
  if (remoteUserId === userId && hydrated) return;
  remoteUserId = userId;
  hydrated = false;

  const local = getLocalRecords();

  let uploaded: StatRecord[] = [];
  try {
    const res = await fetch("/api/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ records: local }),
    });
    const json = (await res.json()) as { records?: StatRecord[] } | { uploaded?: number };
    uploaded = "records" in json && Array.isArray(json.records) ? json.records : [];
  } catch {
    // fall through — hydration below still runs
  }

  let fetched: StatRecord[] = [];
  try {
    const res = await fetch("/api/records");
    const json = (await res.json()) as { records?: StatRecord[] };
    fetched = Array.isArray(json.records) ? json.records : [];
  } catch {
    fetched = uploaded;
  }

  remoteRecords = fetched.sort((a, b) => a.startedAt.localeCompare(b.startedAt));
  hydrated = true;
  clearLocalRecords();
  notifyRemote();
}

export function resetOnSignOut(): void {
  remoteUserId = null;
  hydrated = false;
  remoteRecords = [];
  notifyRemote();
}
