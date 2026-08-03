import type { Snippet } from "@/types";

export const PHP_SNIPPETS: Snippet[] = [
  {
    id: "php-variables-basic",
    language: "php",
    concepts: ["variables"],
    difficulty: "beginner",
    title: "A named value",
    explanation:
      "PHP names values with a `$`; `+=` mutates a variable in place, and `.` concatenates strings.",
    code: `<?php
$appName = "SyntaxDrill";
$score = 0;
$score += 10;
echo $appName . ": " . $score;`,
  },
  {
    id: "php-variables-interpolation",
    language: "php",
    concepts: ["variables"],
    difficulty: "beginner",
    title: "Interpolating a string",
    explanation:
      "Double-quoted strings interpolate variables directly, so `$name` becomes its value.",
    code: `<?php
$name = "Ada";
$role = "dev";
echo "$name is a $role";`,
  },
  {
    id: "php-variables-concat",
    language: "php",
    concepts: ["variables"],
    difficulty: "beginner",
    title: "Concatenating strings",
    explanation:
      "`.` joins strings together, appending each piece in order.",
    code: `<?php
$greeting = "Hello";
$name = "Ada";
echo $greeting . ", " . $name . "!";`,
  },
  {
    id: "php-variables-swap",
    language: "php",
    concepts: ["variables"],
    difficulty: "beginner",
    title: "Swapping two values",
    explanation:
      "A temporary variable holds one value while the other moves into its place.",
    code: `<?php
$a = 1;
$b = 2;
$temp = $a;
$a = $b;
$b = $temp;
echo $a . " " . $b;`,
  },
  {
    id: "php-variables-arrays",
    language: "php",
    concepts: ["variables"],
    difficulty: "intermediate",
    title: "Indexed arrays",
    explanation:
      "Brackets build an indexed array; `[0]` reads the first element, counting from zero.",
    code: `<?php
$colors = ["red", "green", "blue"];
echo $colors[0] . " " . $colors[2];`,
  },
  {
    id: "php-variables-assoc",
    language: "php",
    concepts: ["variables"],
    difficulty: "intermediate",
    title: "Associative arrays",
    explanation:
      "`=>` maps a key to a value; bracket access looks a value up by its key.",
    code: `<?php
$user = ["name" => "Ada", "role" => "dev"];
echo $user["name"] . " is a " . $user["role"];`,
  },
  {
    id: "php-variables-isset",
    language: "php",
    concepts: ["variables"],
    difficulty: "intermediate",
    title: "isset and null",
    explanation:
      "`isset` reports whether a key exists and is not `null`, guarding reads that might fail.",
    code: `<?php
$settings = ["theme" => "dark"];
if (isset($settings["theme"])) {
    echo $settings["theme"];
} else {
    echo "default";
}`,
  },
  {
    id: "php-variables-refs",
    language: "php",
    concepts: ["variables"],
    difficulty: "intermediate",
    title: "References",
    explanation:
      "`&` makes `$alias` point at the same value as `$total`, so changing one changes both.",
    code: `<?php
$total = 0;
$alias =& $total;
$alias += 5;
echo $total;`,
  },
  {
    id: "php-variables-spread",
    language: "php",
    concepts: ["variables"],
    difficulty: "advanced",
    title: "Spread in arrays",
    explanation:
      "`...` unpacks an array's elements into the literal, merging two arrays in place.",
    code: `<?php
$a = [1, 2];
$b = [3, 4];
$combined = [...$a, ...$b];
echo implode(",", $combined);`,
  },
  {
    id: "php-variables-variadic",
    language: "php",
    concepts: ["variables"],
    difficulty: "advanced",
    title: "Variadic parameters",
    explanation:
      "`...$nums` collects any number of positional arguments into one array.",
    code: `<?php
function total(...$nums) {
    return array_sum($nums);
}

echo total(1, 2, 3, 4);`,
  },
  {
    id: "php-variables-destructuring",
    language: "php",
    concepts: ["variables"],
    difficulty: "advanced",
    title: "Array destructuring",
    explanation:
      "A bracketed list unpacks array elements into variables, swapping two values in one line.",
    code: `<?php
$a = 1;
$b = 2;
[$a, $b] = [$b, $a];
echo $a . " " . $b;`,
  },
  {
    id: "php-variables-coalesce",
    language: "php",
    concepts: ["variables"],
    difficulty: "advanced",
    title: "Null coalescing",
    explanation:
      "`??` returns the left side when it exists and is not `null`, otherwise the right side.",
    code: `<?php
$user = [];
echo $user["name"] ?? "guest";`,
  },
  {
    id: "php-conditionals-basic",
    language: "php",
    concepts: ["conditionals"],
    difficulty: "beginner",
    title: "If and else",
    explanation:
      "Braces define the block; `if/else` picks one branch from a condition.",
    code: `<?php
$age = 21;
if ($age >= 18) {
    $status = "adult";
} else {
    $status = "minor";
}
echo $status;`,
  },
  {
    id: "php-conditionals-ternary",
    language: "php",
    concepts: ["conditionals"],
    difficulty: "beginner",
    title: "A ternary",
    explanation:
      "The ternary picks one of two values inline: `condition ? a : b`.",
    code: `<?php
$age = 21;
$status = $age >= 18 ? "adult" : "minor";
echo $status;`,
  },
  {
    id: "php-conditionals-and",
    language: "php",
    concepts: ["conditionals"],
    difficulty: "beginner",
    title: "Combining conditions",
    explanation:
      "`&&` requires both conditions to be true before the block runs.",
    code: `<?php
$isAdmin = true;
$isActive = true;
if ($isAdmin && $isActive) {
    echo "grant access";
} else {
    echo "deny";
}`,
  },
  {
    id: "php-conditionals-not",
    language: "php",
    concepts: ["conditionals"],
    difficulty: "beginner",
    title: "The NOT operator",
    explanation:
      "`!` flips a boolean, so `!$locked` is true exactly when `$locked` is false.",
    code: `<?php
$locked = true;
if (!$locked) {
    echo "open";
} else {
    echo "closed";
}`,
  },
  {
    id: "php-conditionals-elseif",
    language: "php",
    concepts: ["conditionals"],
    difficulty: "intermediate",
    title: "An elseif chain",
    explanation:
      "`elseif` adds more branches to an `if`; the first true branch wins, top to bottom.",
    code: `<?php
$score = 85;
if ($score >= 90) {
    $grade = "A";
} elseif ($score >= 80) {
    $grade = "B";
} elseif ($score >= 70) {
    $grade = "C";
} else {
    $grade = "F";
}
echo $grade;`,
  },
  {
    id: "php-conditionals-switch",
    language: "php",
    concepts: ["conditionals"],
    difficulty: "intermediate",
    title: "A switch",
    explanation:
      "`switch` compares a value against `case` labels; `break` stops fall-through and `default` catches the rest.",
    code: `<?php
$command = "start";
switch ($command) {
    case "start":
        echo "beginning";
        break;
    case "stop":
        echo "halting";
        break;
    default:
        echo "unknown";
}`,
  },
  {
    id: "php-conditionals-truthy",
    language: "php",
    concepts: ["conditionals"],
    difficulty: "intermediate",
    title: "Truthy and falsy",
    explanation:
      "`0`, an empty string, `null`, and empty collections are falsy in conditions.",
    code: `<?php
$values = [0, "", null, "hi"];
foreach ($values as $value) {
    if ($value) {
        echo "truthy: " . $value . "\\n";
    } else {
        echo "falsy\\n";
    }
}`,
  },
  {
    id: "php-conditionals-inarray",
    language: "php",
    concepts: ["conditionals"],
    difficulty: "intermediate",
    title: "Membership check",
    explanation:
      "`in_array` tests whether a value is in a list, turning membership into a condition.",
    code: `<?php
$blocked = ["bob", "eve"];
$name = "ada";
if (in_array($name, $blocked)) {
    echo "blocked";
} else {
    echo "allowed";
}`,
  },
  {
    id: "php-conditionals-match",
    language: "php",
    concepts: ["conditionals"],
    difficulty: "advanced",
    title: "The match expression",
    explanation:
      "`match` compares a value against arms and returns the matched one; `default` is the fallback.",
    code: `<?php
$command = "start";
echo match ($command) {
    "start" => "beginning",
    "stop" => "halting",
    default => "unknown",
};`,
  },
  {
    id: "php-conditionals-guards",
    language: "php",
    concepts: ["conditionals"],
    difficulty: "advanced",
    title: "Guard clauses",
    explanation:
      "Early `return` statements exit a function as soon as an invalid case is found, leaving a clean happy path.",
    code: `<?php
function allowed($name, $blocked) {
    if (!$name) {
        return false;
    }
    if (in_array($name, $blocked)) {
        return false;
    }
    return true;
}

echo allowed("ada", ["bob"]) ? "yes" : "no";`,
  },
  {
    id: "php-conditionals-spaceship",
    language: "php",
    concepts: ["conditionals"],
    difficulty: "advanced",
    title: "The spaceship operator",
    explanation:
      "`<=>` returns `-1`, `0`, or `1` when the left side is less than, equal to, or greater than the right.",
    code: `<?php
$a = 3;
$b = 5;
echo $a <=> $b;`,
  },
  {
    id: "php-conditionals-nested",
    language: "php",
    concepts: ["conditionals"],
    difficulty: "advanced",
    title: "Nested ternaries",
    explanation:
      "A ternary inside another ternary's false branch picks among three score bands.",
    code: `<?php
$score = 85;
$grade = $score >= 90 ? "A" : ($score >= 80 ? "B" : "C");
echo $grade;`,
  },
  {
    id: "php-loops-for",
    language: "php",
    concepts: ["loops"],
    difficulty: "beginner",
    title: "An indexed loop",
    explanation:
      "`for` runs its body while the condition holds, advancing the counter each pass.",
    code: `<?php
for ($i = 1; $i <= 3; $i++) {
    echo $i . "\\n";
}`,
  },
  {
    id: "php-loops-range",
    language: "php",
    concepts: ["loops"],
    difficulty: "beginner",
    title: "Summing a range",
    explanation:
      "`for` counts 1 through 5, accumulating each step into a running total.",
    code: `<?php
$total = 0;
for ($i = 1; $i <= 5; $i++) {
    $total += $i;
}
echo $total;`,
  },
  {
    id: "php-loops-while",
    language: "php",
    concepts: ["loops"],
    difficulty: "beginner",
    title: "While with a counter",
    explanation:
      "`while` repeats its body as long as the condition holds; the counter guarantees it ends.",
    code: `<?php
$count = 0;
while ($count < 3) {
    echo $count . "\\n";
    $count++;
}`,
  },
  {
    id: "php-loops-foreach",
    language: "php",
    concepts: ["loops"],
    difficulty: "beginner",
    title: "foreach over an array",
    explanation:
      "`foreach` visits every element of an array in order.",
    code: `<?php
$names = ["bob", "ada", "eve"];
foreach ($names as $name) {
    echo $name . "\\n";
}`,
  },
  {
    id: "php-loops-foreach-kv",
    language: "php",
    concepts: ["loops"],
    difficulty: "intermediate",
    title: "foreach with keys",
    explanation:
      "`$index => $score` unpacks the position and the value on every iteration.",
    code: `<?php
$scores = [98, 91, 84];
foreach ($scores as $index => $score) {
    echo $index . ": " . $score . "\\n";
}`,
  },
  {
    id: "php-loops-break",
    language: "php",
    concepts: ["loops"],
    difficulty: "intermediate",
    title: "Finding a match",
    explanation:
      "`break` exits the loop as soon as a match is found, skipping the rest.",
    code: `<?php
$names = ["bob", "ada", "eve"];
foreach ($names as $name) {
    if ($name === "ada") {
        echo "found ada";
        break;
    }
}`,
  },
  {
    id: "php-loops-continue",
    language: "php",
    concepts: ["loops"],
    difficulty: "intermediate",
    title: "Skipping with continue",
    explanation:
      "`continue` jumps to the next iteration, skipping odd numbers here.",
    code: `<?php
$total = 0;
for ($i = 1; $i <= 9; $i++) {
    if ($i % 2 === 1) {
        continue;
    }
    $total += $i;
}
echo $total;`,
  },
  {
    id: "php-loops-nested",
    language: "php",
    concepts: ["loops"],
    difficulty: "intermediate",
    title: "Nested loops",
    explanation:
      "The inner loop runs to completion for every step of the outer loop, printing a table.",
    code: `<?php
for ($a = 1; $a <= 2; $a++) {
    for ($b = 1; $b <= 3; $b++) {
        echo $a . "x" . $b . "=" . ($a * $b) . "\\n";
    }
}`,
  },
  {
    id: "php-loops-ref",
    language: "php",
    concepts: ["loops"],
    difficulty: "advanced",
    title: "Modifying with references",
    explanation:
      "`as &$score` binds each element by reference, so assignments write back into the array.",
    code: `<?php
$scores = [10, 20, 30];
foreach ($scores as &$score) {
    $score *= 2;
}
unset($score);
echo implode(",", $scores);`,
  },
  {
    id: "php-loops-array-map",
    language: "php",
    concepts: ["loops"],
    difficulty: "advanced",
    title: "Mapping an array",
    explanation:
      "`array_map` applies a callback to every element, returning a new array of results.",
    code: `<?php
$numbers = [1, 2, 3];
$doubled = array_map(fn($n) => $n * 2, $numbers);
echo implode(",", $doubled);`,
  },
  {
    id: "php-loops-array-reduce",
    language: "php",
    concepts: ["loops"],
    difficulty: "advanced",
    title: "Reducing an array",
    explanation:
      "`array_reduce` folds a collection into one value by threading a callback through every element.",
    code: `<?php
$prices = [10, 25, 40];
$total = array_reduce($prices, fn($carry, $p) => $carry + $p, 0);
echo $total;`,
  },
  {
    id: "php-loops-assoc-list",
    language: "php",
    concepts: ["loops"],
    difficulty: "advanced",
    title: "Unpacking assoc pairs",
    explanation:
      "`$key => $value` unpacks each pair of an associative array into two loop variables.",
    code: `<?php
$user = ["name" => "Ada", "role" => "dev"];
foreach ($user as $key => $value) {
    echo $key . "=" . $value . "\\n";
}`,
  },
  {
    id: "php-functions-basic",
    language: "php",
    concepts: ["functions"],
    difficulty: "beginner",
    title: "A function call",
    explanation:
      "`function` declares a callable block; `return` hands a value back to the caller.",
    code: `<?php
function greet($name) {
    return "Hello, " . $name . "!";
}

echo greet("world");`,
  },
  {
    id: "php-functions-defaults",
    language: "php",
    concepts: ["functions"],
    difficulty: "beginner",
    title: "Default parameters",
    explanation:
      "Default values apply when an argument is omitted at the call site.",
    code: `<?php
function greet($name = "world") {
    return "Hello, " . $name . "!";
}

echo greet() . "\\n";
echo greet("ada");`,
  },
  {
    id: "php-functions-return",
    language: "php",
    concepts: ["functions"],
    difficulty: "beginner",
    title: "Returning a value",
    explanation:
      "`return` computes a result and hands it back, letting the caller echo it.",
    code: `<?php
function double($n) {
    return $n * 2;
}

echo double(4);`,
  },
  {
    id: "php-functions-void",
    language: "php",
    concepts: ["functions"],
    difficulty: "beginner",
    title: "A void function",
    explanation:
      "A function without `return` still runs its body, printing directly here.",
    code: `<?php
function announce() {
    echo "beep";
}

announce();`,
  },
  {
    id: "php-functions-typed",
    language: "php",
    concepts: ["functions"],
    difficulty: "intermediate",
    title: "Scalar type hints",
    explanation:
      "Type hints constrain each parameter and the return value, catching mismatches early.",
    code: `<?php
function add(int $a, int $b): int {
    return $a + $b;
}

echo add(2, 3);`,
  },
  {
    id: "php-functions-byref",
    language: "php",
    concepts: ["functions"],
    difficulty: "intermediate",
    title: "Passing by reference",
    explanation:
      "`&$counter` passes the variable itself, so increments inside the function stick.",
    code: `<?php
function increment(&$counter) {
    $counter++;
}

$count = 0;
increment($count);
increment($count);
echo $count;`,
  },
  {
    id: "php-functions-multi",
    language: "php",
    concepts: ["functions"],
    difficulty: "intermediate",
    title: "Returning an array",
    explanation:
      "Returning an array lets a function give back several values at once.",
    code: `<?php
function min_max($nums) {
    return [min($nums), max($nums)];
}

[$lo, $hi] = min_max([3, 1, 4, 1, 5]);
echo $lo . " " . $hi;`,
  },
  {
    id: "php-functions-arrow",
    language: "php",
    concepts: ["functions"],
    difficulty: "intermediate",
    title: "Arrow functions",
    explanation:
      "An arrow function is a one-expression function; `fn($n) => $n * 2` doubles its input.",
    code: `<?php
$double = fn($n) => $n * 2;
echo $double(5);`,
  },
  {
    id: "php-functions-closure",
    language: "php",
    concepts: ["functions"],
    difficulty: "advanced",
    title: "Closures with use",
    explanation:
      "`use ($factor)` captures an outer variable into a closure so the inner function can read it.",
    code: `<?php
$factor = 3;
$multiply = function ($n) use ($factor) {
    return $n * $factor;
};

echo $multiply(4);`,
  },
  {
    id: "php-functions-callable",
    language: "php",
    concepts: ["functions"],
    difficulty: "advanced",
    title: "call_user_func",
    explanation:
      "`call_user_func` invokes a callable by name, running the function with the given argument.",
    code: `<?php
function shout($message) {
    return strtoupper($message);
}

echo call_user_func("shout", "hello");`,
  },
  {
    id: "php-functions-recursion",
    language: "php",
    concepts: ["functions"],
    difficulty: "advanced",
    title: "Recursion",
    explanation:
      "A recursive function calls itself on a smaller problem until it reaches a base case.",
    code: `<?php
function factorial($n) {
    if ($n <= 1) {
        return 1;
    }
    return $n * factorial($n - 1);
}

echo factorial(5);`,
  },
  {
    id: "php-functions-generator",
    language: "php",
    concepts: ["functions"],
    difficulty: "advanced",
    title: "A generator",
    explanation:
      "`yield` pauses a generator and hands back one value per iteration.",
    code: `<?php
function countdown($start) {
    while ($start > 0) {
        yield $start;
        $start--;
    }
}

foreach (countdown(3) as $n) {
    echo $n . "\\n";
}`,
  },
];
