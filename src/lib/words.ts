import common200 from "../../content/words/common-200.json";
import common1000 from "../../content/words/common-1000.json";

export const WORD_LISTS = {
  200: common200,
  1000: common1000,
} as const;

export function pickWords(count: number, seed = Math.random): string[] {
  const pool = count <= 50 ? common200 : common1000;
  const words: string[] = [];
  while (words.length < count) {
    words.push(pool[Math.floor(seed() * pool.length)]);
  }
  return words;
}
