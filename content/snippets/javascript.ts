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
    id: "js-variables-flag",
    language: "javascript",
    concepts: ["variables"],
    difficulty: "beginner",
    title: "A boolean flag",
    explanation:
      "Comparing numbers produces a boolean, which you can store in a variable for later.",
    code: `const total = 120;
const hasDiscount = total > 100;
console.log(hasDiscount);`,
  },
  {
    id: "js-variables-interpolate",
    language: "javascript",
    concepts: ["variables"],
    difficulty: "beginner",
    title: "Interpolating a string",
    explanation:
      "Template literals embed expressions with `${...}` — no string concatenation needed.",
    code: `const name = "Ada";
const role = "dev";
const message = \`\${name} is a \${role}\`;
console.log(message);`,
  },
  {
    id: "js-variables-swap",
    language: "javascript",
    concepts: ["variables"],
    difficulty: "beginner",
    title: "Swapping two values",
    explanation:
      "A temporary variable holds one value while the swap happens, so nothing is lost.",
    code: `let a = 1;
let b = 2;
const temp = a;
a = b;
b = temp;
console.log(a, b);`,
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
    id: "js-variables-spread",
    language: "javascript",
    concepts: ["variables"],
    difficulty: "intermediate",
    title: "Spread and rest",
    explanation:
      "`...` spreads object properties into a new object, or collects leftover array items into `rest`.",
    code: `const base = { theme: "dark" };
const user = { ...base, name: "ada" };
const [first, ...rest] = [1, 2, 3, 4];
console.log(user);
console.log(first, rest);`,
  },
  {
    id: "js-variables-optional",
    language: "javascript",
    concepts: ["variables"],
    difficulty: "intermediate",
    title: "Safe access with ?.",
    explanation:
      "Optional chaining short-circuits when a value is nullish; `??` supplies a fallback.",
    code: `const user = { profile: { age: 30 } };
const age = user.profile?.age ?? 0;
const city = user.profile?.address?.city ?? "unknown";
console.log(age, city);`,
  },
  {
    id: "js-variables-shorthand",
    language: "javascript",
    concepts: ["variables"],
    difficulty: "intermediate",
    title: "Shorthand and computed keys",
    explanation:
      "Property shorthand uses the variable name as the key; brackets compute the key from an expression.",
    code: `const key = "role";
const name = "Ada";
const user = { name, [key]: "admin" };
console.log(user);`,
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
    id: "js-variables-destructure-params",
    language: "javascript",
    concepts: ["variables"],
    difficulty: "advanced",
    title: "Destructuring parameters",
    explanation:
      "Function parameters can destructure an object directly, with defaults for missing keys.",
    code: `function greet({ name, role = "user" }) {
  return \`\${role}: \${name}\`;
}
console.log(greet({ name: "ada" }));`,
  },
  {
    id: "js-variables-closure",
    language: "javascript",
    concepts: ["variables"],
    difficulty: "advanced",
    title: "A closure counter",
    explanation:
      "Inner methods capture the `value` variable, so it persists between calls — a closure.",
    code: `function counter() {
  let value = 0;
  return {
    up() {
      value += 1;
    },
    get() {
      return value;
    },
  };
}
const c = counter();
c.up();
c.up();
console.log(c.get());`,
  },
  {
    id: "js-variables-coercion",
    language: "javascript",
    concepts: ["variables"],
    difficulty: "advanced",
    title: "typeof and coercion",
    explanation:
      "`typeof` reports a value's type; `String` coerces values into strings for output.",
    code: `const values = ["42", 42, true, null];
for (const v of values) {
  console.log(typeof v, String(v));
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
    id: "js-conditionals-elseif",
    language: "javascript",
    concepts: ["conditionals"],
    difficulty: "beginner",
    title: "if / else if",
    explanation:
      "`else if` adds more branches; the first true condition wins, top to bottom.",
    code: `const user = "ada";
if (user === "ada") {
  console.log("admin");
} else if (user === "bob") {
  console.log("editor");
} else {
  console.log("viewer");
}`,
  },
  {
    id: "js-conditionals-and",
    language: "javascript",
    concepts: ["conditionals"],
    difficulty: "beginner",
    title: "Combining conditions",
    explanation:
      "`&&` requires both conditions to be true before the block runs.",
    code: `const isAdmin = true;
const isActive = true;
if (isAdmin && isActive) {
  console.log("grant access");
} else {
  console.log("deny");
}`,
  },
  {
    id: "js-conditionals-ternary",
    language: "javascript",
    concepts: ["conditionals"],
    difficulty: "beginner",
    title: "A ternary",
    explanation:
      "A ternary picks one of two values in a single expression: `condition ? a : b`.",
    code: `const age = 21;
const status = age >= 18 ? "adult" : "minor";
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
    id: "js-conditionals-truthy",
    language: "javascript",
    concepts: ["conditionals"],
    difficulty: "intermediate",
    title: "Truthy and falsy",
    explanation:
      "Falsy values — `0`, an empty string, `null`, and `undefined` — fail an `if`; everything else passes.",
    code: `const values = [0, "", null, "hi"];
for (const v of values) {
  if (v) {
    console.log("truthy:", v);
  } else {
    console.log("falsy:", String(v));
  }
}`,
  },
  {
    id: "js-conditionals-not",
    language: "javascript",
    concepts: ["conditionals"],
    difficulty: "intermediate",
    title: "The NOT operator",
    explanation:
      "`!` flips a boolean, so `!locked` is true exactly when `locked` is false.",
    code: `const locked = true;
if (!locked) {
  console.log("open");
} else {
  console.log("closed");
}`,
  },
  {
    id: "js-conditionals-ternary-chain",
    language: "javascript",
    concepts: ["conditionals"],
    difficulty: "intermediate",
    title: "A ternary chain",
    explanation:
      "Nested ternaries express multi-way choices compactly — read right to left for each condition.",
    code: `const score = 85;
const grade =
  score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : "F";
console.log(grade);`,
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
    id: "js-conditionals-grouped-switch",
    language: "javascript",
    concepts: ["conditionals"],
    difficulty: "advanced",
    title: "Grouped switch cases",
    explanation:
      "Stacked `case` labels share one block, matching any of several values.",
    code: `const day = 6;
let kind;
switch (day) {
  case 0:
  case 6:
    kind = "weekend";
    break;
  default:
    kind = "weekday";
}
console.log(kind);`,
  },
  {
    id: "js-conditionals-fallback",
    language: "javascript",
    concepts: ["conditionals"],
    difficulty: "advanced",
    title: "Fallback with ||",
    explanation:
      "`||` returns the first truthy operand, which supplies a default — but watch out: `0` is falsy.",
    code: `const config = { timeout: 0 };
const timeout = config.timeout || 3000;
console.log(timeout);`,
  },
  {
    id: "js-conditionals-membership",
    language: "javascript",
    concepts: ["conditionals"],
    difficulty: "advanced",
    title: "Membership check",
    explanation:
      "`includes()` tests whether a value is in an array, turning membership into a condition.",
    code: `const role = "admin";
const allowed = ["admin", "editor"];
if (allowed.includes(role)) {
  console.log("write access");
} else {
  console.log("read only");
}`,
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
    id: "js-loops-range",
    language: "javascript",
    concepts: ["loops"],
    difficulty: "beginner",
    title: "Summing a range",
    explanation:
      "A `for` loop counts from 1 to 5, accumulating a running total with `+=`.",
    code: `let total = 0;
for (let i = 1; i <= 5; i++) {
  total += i;
}
console.log(total);`,
  },
  {
    id: "js-loops-break",
    language: "javascript",
    concepts: ["loops"],
    difficulty: "beginner",
    title: "Finding a match",
    explanation:
      "`break` exits the loop as soon as a match is found, skipping the rest.",
    code: `const names = ["bob", "ada", "eve"];
for (const name of names) {
  if (name === "ada") {
    console.log("found ada");
    break;
  }
}`,
  },
  {
    id: "js-loops-continue",
    language: "javascript",
    concepts: ["loops"],
    difficulty: "beginner",
    title: "Skipping with continue",
    explanation:
      "`continue` jumps to the next iteration, skipping odd numbers here.",
    code: `let sum = 0;
for (let i = 0; i < 10; i++) {
  if (i % 2 === 1) continue;
  sum += i;
}
console.log(sum);`,
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
    id: "js-loops-foreach",
    language: "javascript",
    concepts: ["loops"],
    difficulty: "intermediate",
    title: "forEach with index",
    explanation:
      "`forEach` visits each element with the element and its index as callback arguments.",
    code: `const items = ["dev", "typing", "syntax"];
items.forEach((item, index) => {
  console.log(\`\${index}: \${item}\`);
});`,
  },
  {
    id: "js-loops-nested",
    language: "javascript",
    concepts: ["loops"],
    difficulty: "intermediate",
    title: "Nested loops",
    explanation:
      "The inner loop runs to completion for every step of the outer loop, building pairs.",
    code: `const pairs = [];
for (const a of [1, 2]) {
  for (const b of ["x", "y"]) {
    pairs.push(\`\${a}\${b}\`);
  }
}
console.log(pairs);`,
  },
  {
    id: "js-loops-entries",
    language: "javascript",
    concepts: ["loops"],
    difficulty: "intermediate",
    title: "Entries of an object",
    explanation:
      "`Object.entries` turns an object into `[key, value]` pairs you can destructure in a loop.",
    code: `const user = { name: "Ada", role: "dev" };
for (const [key, value] of Object.entries(user)) {
  console.log(\`\${key}=\${value}\`);
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
    id: "js-loops-reduce",
    language: "javascript",
    concepts: ["loops"],
    difficulty: "advanced",
    title: "Reduce to a total",
    explanation:
      "`reduce` folds a collection into one value, threading an accumulator through every element.",
    code: `const prices = [10, 25, 40];
const total = prices.reduce((sum, p) => sum + p, 0);
console.log(total);`,
  },
  {
    id: "js-loops-forin",
    language: "javascript",
    concepts: ["loops"],
    difficulty: "advanced",
    title: "for...in keys",
    explanation:
      "`for...in` iterates an object's enumerable keys — use `Object.entries` when you need values too.",
    code: `const user = { name: "Ada", role: "dev" };
for (const key in user) {
  console.log(key);
}`,
  },
  {
    id: "js-loops-destructure",
    language: "javascript",
    concepts: ["loops"],
    difficulty: "advanced",
    title: "Destructuring in loops",
    explanation:
      "Loop variables can destructure each element, unpacking `[key, value]` pairs inline.",
    code: `const entries = [["a", 1], ["b", 2]];
for (const [key, value] of entries) {
  console.log(\`\${key}: \${value}\`);
}`,
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
    id: "js-functions-defaults",
    language: "javascript",
    concepts: ["functions"],
    difficulty: "beginner",
    title: "Default parameters",
    explanation:
      "Parameters can carry a default value that applies when the argument is omitted.",
    code: `function greet(name = "world") {
  return \`Hello, \${name}!\`;
}
console.log(greet());
console.log(greet("ada"));`,
  },
  {
    id: "js-functions-tuple",
    language: "javascript",
    concepts: ["functions"],
    difficulty: "beginner",
    title: "Returning a tuple",
    explanation:
      "Returning an array lets a function hand back multiple values, unpacked by destructuring.",
    code: `function minMax(nums) {
  let min = nums[0];
  let max = nums[0];
  for (const n of nums) {
    if (n < min) min = n;
    if (n > max) max = n;
  }
  return [min, max];
}
const [min, max] = minMax([3, 1, 4, 1, 5]);
console.log(min, max);`,
  },
  {
    id: "js-functions-early",
    language: "javascript",
    concepts: ["functions"],
    difficulty: "beginner",
    title: "Early return",
    explanation:
      "`return` ends the function; early returns handle edge cases before the main logic.",
    code: `function firstItem(list) {
  if (list.length === 0) {
    return null;
  }
  return list[0];
}
console.log(firstItem([]));
console.log(firstItem(["ada"]));`,
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
    id: "js-functions-higher",
    language: "javascript",
    concepts: ["functions"],
    difficulty: "intermediate",
    title: "Composing functions",
    explanation:
      "Higher-order functions take or return functions; here `negate` wraps a predicate.",
    code: `function negate(fn) {
  return (value) => !fn(value);
}
const isEven = (n) => n % 2 === 0;
const isOdd = negate(isEven);
console.log(isOdd(3));`,
  },
  {
    id: "js-functions-recursion",
    language: "javascript",
    concepts: ["functions"],
    difficulty: "intermediate",
    title: "Recursion",
    explanation:
      "A recursive function calls itself on a smaller problem until it reaches a base case.",
    code: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
console.log(factorial(5));`,
  },
  {
    id: "js-functions-methods",
    language: "javascript",
    concepts: ["functions"],
    difficulty: "intermediate",
    title: "Object methods",
    explanation:
      "Method shorthand defines functions on objects; `this` refers to the object that calls them.",
    code: `const counter = {
  value: 0,
  up() {
    this.value += 1;
  },
  get() {
    return this.value;
  },
};
counter.up();
counter.up();
console.log(counter.get());`,
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
  {
    id: "js-functions-curry",
    language: "javascript",
    concepts: ["functions"],
    difficulty: "advanced",
    title: "Curried functions",
    explanation:
      "Chained arrows capture one argument at a time, building a specialized function.",
    code: `const add = (a) => (b) => a + b;
const add5 = add(5);
console.log(add5(3));`,
  },
  {
    id: "js-functions-partial",
    language: "javascript",
    concepts: ["functions"],
    difficulty: "advanced",
    title: "Partial application",
    explanation:
      "`partial` presets some arguments and returns a function that fills in the rest.",
    code: `function partial(fn, ...preset) {
  return (...args) => fn(...preset, ...args);
}
const greet = (prefix, name) => \`\${prefix} \${name}\`;
const sayHi = partial(greet, "Hello");
console.log(sayHi("Ada"));`,
  },
  {
    id: "js-functions-generator",
    language: "javascript",
    concepts: ["functions"],
    difficulty: "advanced",
    title: "A generator",
    explanation:
      "Generators `yield` values lazily, pausing between yields and resuming on the next `next()` call.",
    code: `function* ids(start) {
  let value = start;
  while (true) {
    yield value;
    value += 1;
  }
}
const nextId = ids(10);
console.log(nextId.next().value);
console.log(nextId.next().value);`,
  },
];
