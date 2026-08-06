export interface WordTestState {
  words: string[];
  typedWords: string[];
  currentIndex: number;
  currentTyped: string;
  startedAt: number | null;
  finishedAt: number | null;
  correctKeystrokes: number;
  errorKeystrokes: number;
}

export function createWordTest(words: string[]): WordTestState {
  return {
    words,
    typedWords: [],
    currentIndex: 0,
    currentTyped: "",
    startedAt: null,
    finishedAt: null,
    correctKeystrokes: 0,
    errorKeystrokes: 0,
  };
}

export function refillWordTest(
  state: WordTestState,
  extra: string[],
): WordTestState {
  const words = [...state.words, ...extra];
  const drop = Math.max(0, state.currentIndex - 40);
  if (drop === 0) {
    return { ...state, words };
  }
  return {
    ...state,
    words: words.slice(drop),
    typedWords: state.typedWords.slice(drop),
    currentIndex: state.currentIndex - drop,
  };
}

export function typeChar(state: WordTestState, ch: string): WordTestState {
  if (state.finishedAt !== null) return state;
  const startedAt = state.startedAt ?? Date.now();
  const target = state.words[state.currentIndex] ?? "";
  const j = state.currentTyped.length;
  const isLast = state.currentIndex === state.words.length - 1;

  if (j > target.length) {
    return typeChar(commitWord(state), ch);
  }

  if (ch === " " && j === target.length) {
    return {
      ...state,
      startedAt,
      currentTyped: state.currentTyped + " ",
      correctKeystrokes: state.correctKeystrokes + 1,
      finishedAt: isLast ? Date.now() : state.finishedAt,
    };
  }

  let correct = state.correctKeystrokes;
  let error = state.errorKeystrokes;
  if (j < target.length && ch === target[j]) correct += 1;
  else error += 1;
  const next: WordTestState = {
    ...state,
    startedAt,
    correctKeystrokes: correct,
    errorKeystrokes: error,
    currentTyped: state.currentTyped + ch,
  };

  if (isLast && next.currentTyped === target) {
    return { ...next, finishedAt: Date.now() };
  }
  return next;
}

function commitWord(state: WordTestState): WordTestState {
  const typedWords = [...state.typedWords, state.currentTyped.replace(/ +$/, "")];
  const currentIndex = state.currentIndex + 1;
  const base: WordTestState = {
    ...state,
    typedWords,
    currentIndex,
    currentTyped: "",
  };
  if (currentIndex >= state.words.length) {
    return { ...base, finishedAt: Date.now() };
  }
  return base;
}

export function backspace(state: WordTestState): WordTestState {
  if (state.finishedAt !== null) return state;
  if (state.currentTyped.length > 0) {
    return { ...state, currentTyped: state.currentTyped.slice(0, -1) };
  }
  if (state.currentIndex > 0) {
    const previousIndex = state.currentIndex - 1;
    const previousTyped = state.typedWords[previousIndex];
    return {
      ...state,
      typedWords: state.typedWords.slice(0, -1),
      currentIndex: previousIndex,
      currentTyped: previousTyped,
    };
  }
  return state;
}

export function elapsedMs(state: WordTestState): number {
  if (!state.startedAt) return 0;
  const end = state.finishedAt ?? Date.now();
  return Math.max(0, end - state.startedAt);
}

export function speedWpm(state: WordTestState): number {
  const minutes = elapsedMs(state) / 60000;
  if (minutes <= 0) return 0;
  return state.correctKeystrokes / 5 / minutes;
}

export function speedRaw(state: WordTestState): number {
  const minutes = elapsedMs(state) / 60000;
  if (minutes <= 0) return 0;
  return (state.correctKeystrokes + state.errorKeystrokes) / 5 / minutes;
}

export function speedAccuracy(state: WordTestState): number {
  const total = state.correctKeystrokes + state.errorKeystrokes;
  if (total === 0) return 1;
  return state.correctKeystrokes / total;
}
