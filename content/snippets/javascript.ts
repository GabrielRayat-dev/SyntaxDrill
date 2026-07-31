import type { Snippet } from "@/types";

export const JAVASCRIPT_SNIPPETS: Snippet[] = [
  {
    id: "js-variables-basic",
    language: "javascript",
    concepts: ["variables"],
    difficulty: "beginner",
    title: "A named value",
    explanation:
      "`const` creates a value that can't be reassigned; `let` declares one you can update later.",
    code: `const appName = "SyntaxDrill";
let score = 0;
score = score + 10;
console.log(appName + ": " + score);`,
  },
  {
    id: "js-variables-destructure",
    language: "javascript",
    concepts: ["variables"],
    difficulty: "intermediate",
    title: "Destructuring an object",
    explanation:
      "Destructuring unpacks object properties into named variables in one line.",
    code: `const user = { name: "Ada", role: "dev" };
const { name, role } = user;
const greeting = \`Welcome back, \${name}!\`;
console.log(greeting);`,
  },
  {
    id: "js-variables-map",
    language: "javascript",
    concepts: ["variables"],
    difficulty: "advanced",
    title: "Map entries",
    explanation:
      "A Map stores key/value pairs; iterating it yields `[key, value]` tuples that destructure in the loop.",
    code: `const scores = new Map();
scores.set("ada", 98);
scores.set("linus", 91);
for (const [name, score] of scores) {
  console.log(\`\${name}: \${score}\`);
}`,
  },
  {
    id: "js-conditionals-basic",
    language: "javascript",
    concepts: ["conditionals"],
    difficulty: "beginner",
    title: "If and else",
    explanation:
      "An `if/else` picks one branch based on a boolean condition.",
    code: `const age = 21;
let status;
if (age >= 18) {
  status = "adult";
} else {
  status = "minor";
}
console.log(status);`,
  },
  {
    id: "js-conditionals-switch",
    language: "javascript",
    concepts: ["conditionals"],
    difficulty: "intermediate",
    title: "A switch ladder",
    explanation:
      "`switch` compares one value against several cases; `break` stops fallthrough into the next case.",
    code: `const day = 3;
let label;
switch (day) {
  case 1:
    label = "Monday";
    break;
  case 2:
    label = "Tuesday";
    break;
  default:
    label = "Unknown";
}
console.log(label);`,
  },
  {
    id: "js-conditionals-guards",
    language: "javascript",
    concepts: ["conditionals"],
    difficulty: "advanced",
    title: "Guard clauses",
    explanation:
      "Guard clauses return early on invalid input, keeping the happy path unindented.",
    code: `function canVote(person) {
  if (!person.age) return false;
  if (person.age < 18) return false;
  return person.country === "US";
}
console.log(canVote({ age: 20, country: "US" }));`,
  },
  {
    id: "js-loops-basic",
    language: "javascript",
    concepts: ["loops"],
    difficulty: "beginner",
    title: "Indexed loop",
    explanation:
      "A classic `for` loop counts from 0 to `prices.length`, using `i` to index each element.",
    code: `const prices = [10, 25, 40];
let total = 0;
for (let i = 0; i < prices.length; i++) {
  total += prices[i];
}
console.log(total);`,
  },
  {
    id: "js-loops-forof",
    language: "javascript",
    concepts: ["loops"],
    difficulty: "intermediate",
    title: "for...of",
    explanation:
      "`for...of` iterates the values of an iterable directly — no index needed.",
    code: `const tags = ["dev", "typing", "syntax"];
for (const tag of tags) {
  console.log(\`#\${tag}\`);
}`,
  },
  {
    id: "js-loops-while",
    language: "javascript",
    concepts: ["loops"],
    difficulty: "advanced",
    title: "while with step",
    explanation:
      "A `while` loop runs as long as its condition holds; here it sums every second number below 100.",
    code: `let count = 0;
let sum = 0;
while (count < 100) {
  sum += count;
  count += 2;
}
console.log(sum);`,
  },
  {
    id: "js-functions-basic",
    language: "javascript",
    concepts: ["functions"],
    difficulty: "beginner",
    title: "A function call",
    explanation:
      "A function declaration names reusable logic; calling it with an argument runs it.",
    code: `function greet(name) {
  return \`Hello, \${name}!\`;
}
console.log(greet("world"));`,
  },
  {
    id: "js-functions-arrow",
    language: "javascript",
    concepts: ["functions"],
    difficulty: "intermediate",
    title: "Mapping with arrows",
    explanation:
      "Arrow functions are concise callbacks; array methods like `map` and `filter` transform collections.",
    code: `const items = [1, 2, 3, 4, 5];
const doubled = items.map((n) => n * 2);
const evens = doubled.filter((n) => n % 2 === 0);
console.log(evens);`,
  },
  {
    id: "js-functions-retry",
    language: "javascript",
    concepts: ["functions"],
    difficulty: "advanced",
    title: "Retry with a callback",
    explanation:
      "Higher-order functions accept other functions as arguments; `try/catch` lets a caller recover from errors.",
    code: `function withRetries(fn, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return fn();
    } catch (err) {
      console.error(\`attempt \${attempt + 1} failed\`);
    }
  }
  throw new Error("all attempts failed");
}
console.log(withRetries(() => Math.random() * 10));`,
  },
];
