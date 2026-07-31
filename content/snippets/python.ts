import type { Snippet } from "@/types";

export const PYTHON_SNIPPETS: Snippet[] = [
  {
    id: "py-variables-basic",
    language: "python",
    concepts: ["variables"],
    difficulty: "beginner",
    title: "A named value",
    explanation:
      "Python names values with plain assignment; `+=` mutates a variable in place.",
    code: `app_name = "SyntaxDrill"
score = 0
score += 10
print(app_name + ": " + str(score))`,
  },
  {
    id: "py-variables-dict",
    language: "python",
    concepts: ["variables"],
    difficulty: "intermediate",
    title: "Reading a dict",
    explanation:
      "A dictionary maps keys to values; bracket access retrieves the value for a key. F-strings interpolate variables.",
    code: `user = {"name": "Ada", "role": "dev"}
name = user["name"]
role = user["role"]
print(f"Welcome back, {name}!")`,
  },
  {
    id: "py-variables-comprehensions",
    language: "python",
    concepts: ["variables"],
    difficulty: "advanced",
    title: "Comprehensions",
    explanation:
      "Comprehensions build lists and dicts in one expression; the `if` filters items before they're included.",
    code: `numbers = [1, 2, 3, 4, 5]
squares = [n * n for n in numbers if n % 2 == 0]
lookup = {n: n * n for n in numbers}
print(squares)
print(lookup)`,
  },
  {
    id: "py-conditionals-basic",
    language: "python",
    concepts: ["conditionals"],
    difficulty: "beginner",
    title: "If and else",
    explanation:
      "Indentation defines the block; `if/else` picks one branch from a condition.",
    code: `age = 21
if age >= 18:
    status = "adult"
else:
    status = "minor"
print(status)`,
  },
  {
    id: "py-conditionals-elif",
    language: "python",
    concepts: ["conditionals"],
    difficulty: "intermediate",
    title: "An elif chain",
    explanation:
      "`elif` adds more branches to an `if`; the first true branch wins, top to bottom.",
    code: `score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"
print(grade)`,
  },
  {
    id: "py-conditionals-membership",
    language: "python",
    concepts: ["conditionals"],
    difficulty: "advanced",
    title: "Truthiness and membership",
    explanation:
      "Empty values are falsy, and `in` checks set membership — two idiomatic guard clauses.",
    code: `def allowed(name, blocked):
    if not name:
        return False
    if name in blocked:
        return False
    return True

print(allowed("ada", {"bob"}))`,
  },
  {
    id: "py-loops-basic",
    language: "python",
    concepts: ["loops"],
    difficulty: "beginner",
    title: "Summing a list",
    explanation:
      "A `for` loop visits each element of a list in order, accumulating a total.",
    code: `prices = [10, 25, 40]
total = 0
for price in prices:
    total += price
print(total)`,
  },
  {
    id: "py-loops-enumerate",
    language: "python",
    concepts: ["loops"],
    difficulty: "intermediate",
    title: "Looping with an index",
    explanation:
      "`enumerate` yields both the position and the value of each item in a loop.",
    code: `tags = ["dev", "typing", "syntax"]
for index, tag in enumerate(tags):
    print(f"{index}: #{tag}")`,
  },
  {
    id: "py-loops-while",
    language: "python",
    concepts: ["loops"],
    difficulty: "advanced",
    title: "While with break",
    explanation:
      "`while True` loops forever unless `break` exits it; `%` tests whether a number is even.",
    code: `count = 0
sum_even = 0
while True:
    if count > 100:
        break
    if count % 2 == 0:
        sum_even += count
    count += 1
print(sum_even)`,
  },
  {
    id: "py-functions-basic",
    language: "python",
    concepts: ["functions"],
    difficulty: "beginner",
    title: "A function call",
    explanation:
      "`def` declares a function; the `return` value comes back to the caller.",
    code: `def greet(name):
    return f"Hello, {name}!"

print(greet("world"))`,
  },
  {
    id: "py-functions-args",
    language: "python",
    concepts: ["functions"],
    difficulty: "intermediate",
    title: "Varargs and defaults",
    explanation:
      "`*rest` collects extra positional arguments into a tuple; keyword defaults apply when the argument is omitted.",
    code: `def average(first, *rest, scale=1):
    values = (first,) + rest
    return sum(values) / len(values) * scale

print(average(1, 2, 3, scale=10))`,
  },
  {
    id: "py-functions-decorator",
    language: "python",
    concepts: ["functions"],
    difficulty: "advanced",
    title: "A decorator",
    explanation:
      "A decorator wraps a function to extend it; `@double` is sugar for `add = double(add)`.",
    code: `def double(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs) * 2
    return wrapper

@double
def add(a, b):
    return a + b

print(add(2, 3))`,
  },
];
