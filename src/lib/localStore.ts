"use client";

const listeners = new Map<string, Set<() => void>>();

export function getRaw(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setRaw(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* private mode — value just won't persist */
  }
  const set = listeners.get(key);
  set?.forEach((cb) => cb());
}

export function subscribeKey(key: string, cb: () => void): () => void {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  set.add(cb);
  return () => {
    set.delete(cb);
  };
}
