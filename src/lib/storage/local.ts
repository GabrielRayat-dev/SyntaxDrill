import type { StatRecord } from "@/types";

const KEY = "sd.records";

export interface RecordStore {
  list(): StatRecord[];
  add(record: StatRecord): void;
  clear(): void;
}

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function load(): StatRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.records) ? parsed.records : [];
  } catch {
    return [];
  }
}

function save(records: StatRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ version: 1, records }));
  } catch {
    /* storage full or blocked — fail silently */
  }
}

export function createLocalRecordStore(): RecordStore {
  return {
    list: load,
    add(record) {
      const next = [...load(), record];
      save(next);
      refreshCache();
      notifyRecords();
    },
    clear() {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(KEY);
      }
      recordsCache = [];
      notifyRecords();
    },
  };
}

/* Reactive snapshot for useSyncExternalStore (home screen stats). */

let recordsCache: StatRecord[] | null = null;
const recordListeners = new Set<() => void>();

function refreshCache(): void {
  recordsCache = load();
}

export function getRecords(): StatRecord[] {
  if (recordsCache === null) refreshCache();
  return recordsCache as StatRecord[];
}

export function subscribeRecords(cb: () => void): () => void {
  recordListeners.add(cb);
  return () => {
    recordListeners.delete(cb);
  };
}

function notifyRecords(): void {
  recordListeners.forEach((cb) => cb());
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      refreshCache();
      notifyRecords();
    }
  });
}
