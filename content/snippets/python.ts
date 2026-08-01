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
    id: "py-variables-fstring",
    language: "python",
    concepts: ["variables"],
    difficulty: "beginner",
    title: "F-string interpolation",
    explanation:
      "F-strings embed expressions directly in text using curly braces.",
    code: `name = "Ada"
role = "dev"
message = f"{name} is a {role}"
print(message)`,
  },
  {
    id: "py-variables-swap",
    language: "python",
    concepts: ["variables"],
    difficulty: "beginner",
    title: "Swapping values",
    explanation:
      "Tuple assignment swaps two variables in one line — no temporary needed.",
    code: `a = 1
b = 2
a, b = b, a
print(a, b)`,
  },
  {
    id: "py-variables-type",
    language: "python",
    concepts: ["variables"],
    difficulty: "beginner",
    title: "Checking a type",
    explanation:
      "`type` reports a value's type; `isinstance` checks it against a class.",
    code: `value = 42
print(type(value).__name__)
print(isinstance(value, int))`,
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
    id: "py-variables-starred",
    language: "python",
    concepts: ["variables"],
    difficulty: "intermediate",
    title: "Starred unpacking",
    explanation:
      "The `*` captures the middle of a sequence into a list, leaving first and last named.",
    code: `numbers = [1, 2, 3, 4, 5]
first, *middle, last = numbers
print(first, middle, last)`,
  },
  {
    id: "py-variables-mutate",
    language: "python",
    concepts: ["variables"],
    difficulty: "intermediate",
    title: "Mutating a list",
    explanation:
      "Lists are mutable: `append` grows them and index assignment replaces an item.",
    code: `scores = [10, 20, 30]
scores.append(40)
scores[0] = 5
print(scores)`,
  },
  {
    id: "py-variables-keys",
    language: "python",
    concepts: ["variables"],
    difficulty: "intermediate",
    title: "Keys and values",
    explanation:
      "`.keys()` and `.values()` return views of a dictionary's parts; `list()` materializes them.",
    code: `user = {"name": "Ada", "role": "dev"}
print(list(user.keys()))
print(list(user.values()))`,
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
    id: "py-variables-defaultdict",
    language: "python",
    concepts: ["variables"],
    difficulty: "advanced",
    title: "A defaultdict",
    explanation:
      "A `defaultdict` supplies a factory for missing keys, so counting never needs a check.",
    code: `from collections import defaultdict

counts = defaultdict(int)
for word in ["ada", "bob", "ada"]:
    counts[word] += 1
print(dict(counts))`,
  },
  {
    id: "py-variables-walrus",
    language: "python",
    concepts: ["variables"],
    difficulty: "advanced",
    title: "The walrus operator",
    explanation:
      "`:=` assigns a variable and returns its value in the same expression.",
    code: `numbers = [1, 2, 3]
if (total := sum(numbers)) > 5:
    print(f"big: {total}")`,
  },
  {
    id: "py-variables-sets",
    language: "python",
    concepts: ["variables"],
    difficulty: "advanced",
    title: "Set operations",
    explanation:
      "Sets support `-` for difference and `&` for intersection in a single expression.",
    code: `users = {"ada", "bob"}
admins = {"ada"}
print(users - admins)
print(users & admins)`,
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
    id: "py-conditionals-ternary",
    language: "python",
    concepts: ["conditionals"],
    difficulty: "beginner",
    title: "A conditional expression",
    explanation:
      "The ternary picks one of two values inline: `value if condition else other`.",
    code: `age = 21
status = "adult" if age >= 18 else "minor"
print(status)`,
  },
  {
    id: "py-conditionals-and",
    language: "python",
    concepts: ["conditionals"],
    difficulty: "beginner",
    title: "Combining conditions",
    explanation:
      "`and` requires both conditions to be true before the block runs.",
    code: `is_admin = True
is_active = True
if is_admin and is_active:
    print("grant access")
else:
    print("deny")`,
  },
  {
    id: "py-conditionals-not",
    language: "python",
    concepts: ["conditionals"],
    difficulty: "beginner",
    title: "The not operator",
    explanation:
      "`not` flips a boolean, so `not locked` is true exactly when `locked` is false.",
    code: `locked = True
if not locked:
    print("open")
else:
    print("closed")`,
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
    id: "py-conditionals-truthy",
    language: "python",
    concepts: ["conditionals"],
    difficulty: "intermediate",
    title: "Truthy and falsy",
    explanation:
      "Empty values — `0`, an empty string, `None`, and empty collections — are falsy in conditions.",
    code: `values = [0, "", None, "hi"]
for value in values:
    if value:
        print(f"truthy: {value}")
    else:
        print(f"falsy: {value!r}")`,
  },
  {
    id: "py-conditionals-match",
    language: "python",
    concepts: ["conditionals"],
    difficulty: "intermediate",
    title: "match statement",
    explanation:
      "`match` compares a value against `case` patterns; `_` is the catch-all branch.",
    code: `command = "start"
match command:
    case "start":
        print("beginning")
    case "stop":
        print("halting")
    case _:
        print("unknown")`,
  },
  {
    id: "py-conditionals-in",
    language: "python",
    concepts: ["conditionals"],
    difficulty: "intermediate",
    title: "Membership check",
    explanation:
      "`in` tests whether a value is in a set or list, turning membership into a condition.",
    code: `blocked = {"bob"}
name = "ada"
if name in blocked:
    print("blocked")
else:
    print("allowed")`,
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
    id: "py-conditionals-dispatch",
    language: "python",
    concepts: ["conditionals"],
    difficulty: "advanced",
    title: "Dispatch table",
    explanation:
      "A dict maps branches to handlers; `.get` with a default covers unknown keys.",
    code: `def handle(kind):
    handlers = {
        "start": lambda: "beginning",
        "stop": lambda: "halting",
    }
    return handlers.get(kind, lambda: "unknown")()

print(handle("start"))`,
  },
  {
    id: "py-conditionals-allany",
    language: "python",
    concepts: ["conditionals"],
    difficulty: "advanced",
    title: "all and any",
    explanation:
      "`all` requires every element to be truthy; `any` requires at least one.",
    code: `checks = [True, True, False]
print(all(checks))
print(any(checks))`,
  },
  {
    id: "py-conditionals-chained",
    language: "python",
    concepts: ["conditionals"],
    difficulty: "advanced",
    title: "Chained comparisons",
    explanation:
      "Python chains relational operators, so `80 <= score <= 90` tests a range directly.",
    code: `score = 85
if 80 <= score <= 90:
    print("solid")`,
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
    id: "py-loops-range",
    language: "python",
    concepts: ["loops"],
    difficulty: "beginner",
    title: "Summing a range",
    explanation:
      "`range(1, 6)` produces the numbers 1 through 5; the loop accumulates them.",
    code: `total = 0
for i in range(1, 6):
    total += i
print(total)`,
  },
  {
    id: "py-loops-break",
    language: "python",
    concepts: ["loops"],
    difficulty: "beginner",
    title: "Finding a match",
    explanation:
      "`break` exits the loop as soon as a match is found, skipping the rest.",
    code: `names = ["bob", "ada", "eve"]
for name in names:
    if name == "ada":
        print("found ada")
        break`,
  },
  {
    id: "py-loops-continue",
    language: "python",
    concepts: ["loops"],
    difficulty: "beginner",
    title: "Skipping with continue",
    explanation:
      "`continue` jumps to the next iteration, skipping odd numbers here.",
    code: `total = 0
for i in range(10):
    if i % 2 == 1:
        continue
    total += i
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
    id: "py-loops-items",
    language: "python",
    concepts: ["loops"],
    difficulty: "intermediate",
    title: "Iterating a dict",
    explanation:
      "`.items()` yields key/value pairs that unpack into two loop variables.",
    code: `user = {"name": "Ada", "role": "dev"}
for key, value in user.items():
    print(f"{key}={value}")`,
  },
  {
    id: "py-loops-nested",
    language: "python",
    concepts: ["loops"],
    difficulty: "intermediate",
    title: "Nested loops",
    explanation:
      "The inner loop runs to completion for every step of the outer loop, building pairs.",
    code: `pairs = []
for a in [1, 2]:
    for b in ["x", "y"]:
        pairs.append(f"{a}{b}")
print(pairs)`,
  },
  {
    id: "py-loops-zip",
    language: "python",
    concepts: ["loops"],
    difficulty: "intermediate",
    title: "Zipping lists",
    explanation:
      "`zip` pairs up elements from two iterables, so the loop sees both together.",
    code: `names = ["ada", "bob"]
scores = [98, 91]
for name, score in zip(names, scores):
    print(f"{name}: {score}")`,
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
    id: "py-loops-reduce",
    language: "python",
    concepts: ["loops"],
    difficulty: "advanced",
    title: "Reducing a list",
    explanation:
      "`reduce` folds a collection into one value by threading an accumulator through it.",
    code: `from functools import reduce

prices = [10, 25, 40]
total = reduce(lambda s, p: s + p, prices, 0)
print(total)`,
  },
  {
    id: "py-loops-genexp",
    language: "python",
    concepts: ["loops"],
    difficulty: "advanced",
    title: "Generator expressions",
    explanation:
      "Parenthesized comprehensions are lazy — `sum` consumes the generator one item at a time.",
    code: `squares = (n * n for n in range(5))
print(sum(squares))`,
  },
  {
    id: "py-loops-else",
    language: "python",
    concepts: ["loops"],
    difficulty: "advanced",
    title: "The else clause",
    explanation:
      "A loop's `else` runs only when the loop finishes without hitting `break`.",
    code: `numbers = [1, 3, 5]
for n in numbers:
    if n % 2 == 0:
        print("found even")
        break
else:
    print("no even numbers")`,
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
    id: "py-functions-defaults",
    language: "python",
    concepts: ["functions"],
    difficulty: "beginner",
    title: "Default arguments",
    explanation:
      "Default values apply when an argument is omitted at the call site.",
    code: `def greet(name="world"):
    return f"Hello, {name}!"

print(greet())
print(greet("ada"))`,
  },
  {
    id: "py-functions-multi",
    language: "python",
    concepts: ["functions"],
    difficulty: "beginner",
    title: "Returning a tuple",
    explanation:
      "Returning multiple values packs a tuple that the caller can unpack.",
    code: `def min_max(nums):
    return min(nums), max(nums)

lo, hi = min_max([3, 1, 4, 1, 5])
print(lo, hi)`,
  },
  {
    id: "py-functions-kwargs",
    language: "python",
    concepts: ["functions"],
    difficulty: "beginner",
    title: "Keyword arguments",
    explanation:
      "Arguments can be passed by name, in any order, instead of positionally.",
    code: `def make_profile(name, role="dev", active=True):
    return f"{name} ({role}) active={active}"

print(make_profile(role="admin", name="Ada"))`,
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
    id: "py-functions-lambda",
    language: "python",
    concepts: ["functions"],
    difficulty: "intermediate",
    title: "A lambda",
    explanation:
      "A `lambda` is a one-expression anonymous function, often assigned or passed inline.",
    code: `add = lambda a, b: a + b
print(add(2, 3))`,
  },
  {
    id: "py-functions-higher",
    language: "python",
    concepts: ["functions"],
    difficulty: "intermediate",
    title: "Higher-order functions",
    explanation:
      "Functions can take and return other functions; here `negate` wraps a predicate.",
    code: `def negate(fn):
    return lambda value: not fn(value)

is_even = lambda n: n % 2 == 0
print(negate(is_even)(3))`,
  },
  {
    id: "py-functions-recursion",
    language: "python",
    concepts: ["functions"],
    difficulty: "intermediate",
    title: "Recursion",
    explanation:
      "A recursive function calls itself on a smaller problem until it reaches a base case.",
    code: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))`,
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
  {
    id: "py-functions-partial",
    language: "python",
    concepts: ["functions"],
    difficulty: "advanced",
    title: "Partial application",
    explanation:
      "`partial` fixes some arguments ahead of time, returning a function for the rest.",
    code: `from functools import partial

def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
print(square(5))`,
  },
  {
    id: "py-functions-forward",
    language: "python",
    concepts: ["functions"],
    difficulty: "advanced",
    title: "Forwarding with *args",
    explanation:
      "A wrapper can accept and forward arbitrary positional and keyword arguments.",
    code: `def logged(func):
    def wrapper(*args, **kwargs):
        print("calling", func.__name__)
        return func(*args, **kwargs)
    return wrapper

@logged
def add(a, b):
    return a + b

print(add(2, 3))`,
  },
  {
    id: "py-functions-factory",
    language: "python",
    concepts: ["functions"],
    difficulty: "advanced",
    title: "A decorator factory",
    explanation:
      "A parameterized decorator is a function that builds a decorator from its argument.",
    code: `def repeat(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(times):
                func(*args, **kwargs)
        return wrapper
    return decorator

@repeat(2)
def announce():
    print("beep")

announce()`,
  },
];
