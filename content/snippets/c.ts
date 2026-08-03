import type { Snippet } from "@/types";

export const C_SNIPPETS: Snippet[] = [
  {
    id: "c-variables-basic",
    language: "c",
    concepts: ["variables"],
    difficulty: "beginner",
    title: "Named values",
    explanation:
      "C declares variables with a type; `+=` mutates a variable in place, and `%d` prints an integer.",
    code: `#include <stdio.h>

int main(void) {
  int score = 10;
  score += 5;
  printf("score: %d\\n", score);
  return 0;
}`,
  },
  {
    id: "c-variables-format",
    language: "c",
    concepts: ["variables"],
    difficulty: "beginner",
    title: "Format specifiers",
    explanation:
      "`printf` matches each specifier to an argument: `%d` for int, `%f` for double, `%c` for a char, and `%s` for a string.",
    code: `#include <stdio.h>

int main(void) {
  int count = 3;
  double ratio = 0.5;
  char mark = '!';
  char name[] = "Ada";
  printf("%d %f %c %s\\n", count, ratio, mark, name);
  return 0;
}`,
  },
  {
    id: "c-variables-const",
    language: "c",
    concepts: ["variables"],
    difficulty: "beginner",
    title: "A constant",
    explanation:
      "`const` promises a value never changes, so assigning again would be a compile error.",
    code: `#include <stdio.h>

int main(void) {
  const int max = 100;
  printf("max: %d\\n", max);
  return 0;
}`,
  },
  {
    id: "c-variables-arithmetic",
    language: "c",
    concepts: ["variables"],
    difficulty: "beginner",
    title: "Arithmetic",
    explanation:
      "`+`, `-`, `*`, and `/` combine numbers, while `%` returns the remainder of integer division.",
    code: `#include <stdio.h>

int main(void) {
  int a = 7;
  int b = 2;
  printf("%d %d %d %d %d\\n", a + b, a - b, a * b, a / b, a % b);
  return 0;
}`,
  },
  {
    id: "c-variables-array",
    language: "c",
    concepts: ["variables"],
    difficulty: "intermediate",
    title: "Indexed arrays",
    explanation:
      "`int nums[3]` declares a fixed-size array; brackets read or write one slot by index, and indexes start at zero.",
    code: `#include <stdio.h>

int main(void) {
  int nums[3];
  nums[0] = 10;
  nums[1] = 20;
  nums[2] = 30;
  printf("%d %d %d\\n", nums[0], nums[1], nums[2]);
  return 0;
}`,
  },
  {
    id: "c-variables-char",
    language: "c",
    concepts: ["variables"],
    difficulty: "intermediate",
    title: "Character arrays",
    explanation:
      "A string literal stored in `char name[]` ends with a hidden `\\0`; `%s` prints up to that null character.",
    code: `#include <stdio.h>

int main(void) {
  char name[] = "Ada";
  printf("%s\\n", name);
  return 0;
}`,
  },
  {
    id: "c-variables-cast",
    language: "c",
    concepts: ["variables"],
    difficulty: "intermediate",
    title: "Casting",
    explanation:
      "A cast `(int)` converts one numeric type to another, dropping the fractional part.",
    code: `#include <stdio.h>

int main(void) {
  double price = 3.99;
  int whole = (int) price;
  printf("%d\\n", whole);
  return 0;
}`,
  },
  {
    id: "c-variables-sizeof",
    language: "c",
    concepts: ["variables"],
    difficulty: "intermediate",
    title: "sizeof",
    explanation:
      "`sizeof` reports a type's size in bytes; dividing an array's size by one element's size counts its slots.",
    code: `#include <stdio.h>

int main(void) {
  int nums[] = {10, 20, 30, 40};
  int count = sizeof nums / sizeof nums[0];
  printf("%zu %d\\n", sizeof(int), count);
  return 0;
}`,
  },
  {
    id: "c-variables-pointer",
    language: "c",
    concepts: ["variables"],
    difficulty: "advanced",
    title: "Pointers",
    explanation:
      "A pointer stores a variable's address; `&x` takes the address and `*p` follows it back to the value.",
    code: `#include <stdio.h>

int main(void) {
  int x = 42;
  int *p = &x;
  printf("%d\\n", *p);
  return 0;
}`,
  },
  {
    id: "c-variables-pointer-arith",
    language: "c",
    concepts: ["variables"],
    difficulty: "advanced",
    title: "Pointer arithmetic",
    explanation:
      "Pointer arithmetic moves by element, not byte; `p + i` addresses the slot `i` steps past the start.",
    code: `#include <stdio.h>

int main(void) {
  int nums[] = {10, 20, 30, 40};
  int *p = nums;
  for (int i = 0; i < 4; i++) {
    printf("%d ", *(p + i));
  }
  printf("\\n");
  return 0;
}`,
  },
  {
    id: "c-variables-struct",
    language: "c",
    concepts: ["variables"],
    difficulty: "advanced",
    title: "A struct",
    explanation:
      "A `struct` bundles related fields into one variable, read with the dot operator.",
    code: `#include <stdio.h>

struct User {
  char name[32];
  int level;
};

int main(void) {
  struct User ada = {"Ada", 5};
  printf("%s level %d\\n", ada.name, ada.level);
  return 0;
}`,
  },
  {
    id: "c-variables-typedef",
    language: "c",
    concepts: ["variables"],
    difficulty: "advanced",
    title: "typedef",
    explanation:
      "`typedef` gives a type a shorter name, so `User` stands in for `struct User` at every declaration.",
    code: `#include <stdio.h>

typedef struct {
  char name[32];
  int level;
} User;

int main(void) {
  User ada = {"Ada", 5};
  printf("%s level %d\\n", ada.name, ada.level);
  return 0;
}`,
  },
  {
    id: "c-conditionals-basic",
    language: "c",
    concepts: ["conditionals"],
    difficulty: "beginner",
    title: "If and else",
    explanation:
      "`if` runs its block when the condition is true; `else` runs when it is false.",
    code: `#include <stdio.h>

int main(void) {
  int age = 21;
  if (age >= 18) {
    printf("adult\\n");
  } else {
    printf("minor\\n");
  }
  return 0;
}`,
  },
  {
    id: "c-conditionals-compare",
    language: "c",
    concepts: ["conditionals"],
    difficulty: "beginner",
    title: "Comparing values",
    explanation:
      "`>` and `>=` compare numbers, and `==` tests equality; comparisons evaluate to 1 for true and 0 for false.",
    code: `#include <stdio.h>

int main(void) {
  int a = 5;
  int b = 3;
  printf("%d %d %d\\n", a > b, a >= b, a == b);
  return 0;
}`,
  },
  {
    id: "c-conditionals-and",
    language: "c",
    concepts: ["conditionals"],
    difficulty: "beginner",
    title: "Combining conditions",
    explanation:
      "`&&` requires both sides to be true before the block runs; any nonzero value counts as true.",
    code: `#include <stdio.h>

int main(void) {
  int age = 25;
  int has_license = 1;
  if (age >= 18 && has_license) {
    printf("allowed\\n");
  } else {
    printf("denied\\n");
  }
  return 0;
}`,
  },
  {
    id: "c-conditionals-not",
    language: "c",
    concepts: ["conditionals"],
    difficulty: "beginner",
    title: "The NOT operator",
    explanation:
      "`!` flips a condition, so `!locked` is true exactly when `locked` is false.",
    code: `#include <stdio.h>

int main(void) {
  int locked = 0;
  if (!locked) {
    printf("open\\n");
  } else {
    printf("closed\\n");
  }
  return 0;
}`,
  },
  {
    id: "c-conditionals-elseif",
    language: "c",
    concepts: ["conditionals"],
    difficulty: "intermediate",
    title: "An else if chain",
    explanation:
      "`else if` adds more branches; the first condition that matches wins, tested top to bottom.",
    code: `#include <stdio.h>

int main(void) {
  int score = 85;
  if (score >= 90) {
    printf("A\\n");
  } else if (score >= 80) {
    printf("B\\n");
  } else if (score >= 70) {
    printf("C\\n");
  } else {
    printf("F\\n");
  }
  return 0;
}`,
  },
  {
    id: "c-conditionals-ternary",
    language: "c",
    concepts: ["conditionals"],
    difficulty: "intermediate",
    title: "A ternary",
    explanation:
      "`condition ? a : b` picks one of two expressions inline, so it fits where a statement cannot.",
    code: `#include <stdio.h>

int main(void) {
  int age = 21;
  printf("%s\\n", age >= 18 ? "adult" : "minor");
  return 0;
}`,
  },
  {
    id: "c-conditionals-switch",
    language: "c",
    concepts: ["conditionals"],
    difficulty: "intermediate",
    title: "A switch",
    explanation:
      "`switch` jumps to the `case` that matches the value; `break` ends the branch before the next case.",
    code: `#include <stdio.h>

int main(void) {
  int command = 1;
  switch (command) {
    case 1:
      printf("start\\n");
      break;
    case 2:
      printf("stop\\n");
      break;
    default:
      printf("unknown\\n");
      break;
  }
  return 0;
}`,
  },
  {
    id: "c-conditionals-nested",
    language: "c",
    concepts: ["conditionals"],
    difficulty: "intermediate",
    title: "Nested conditions",
    explanation:
      "An `if` inside another runs only after the outer condition passes.",
    code: `#include <stdio.h>

int main(void) {
  int score = 85;
  int bonus = 1;
  if (score >= 80) {
    if (bonus) {
      printf("A+\\n");
    } else {
      printf("A\\n");
    }
  } else {
    printf("B\\n");
  }
  return 0;
}`,
  },
  {
    id: "c-conditionals-guards",
    language: "c",
    concepts: ["conditionals"],
    difficulty: "advanced",
    title: "Guard clauses",
    explanation:
      "Early `return` statements reject bad cases at the top of a function, keeping the happy path unindented.",
    code: `#include <stdio.h>

int sign(int n) {
  if (n > 0) {
    return 1;
  }
  if (n < 0) {
    return -1;
  }
  return 0;
}

int main(void) {
  printf("%d\\n", sign(5));
  printf("%d\\n", sign(-3));
  printf("%d\\n", sign(0));
  return 0;
}`,
  },
  {
    id: "c-conditionals-fallthrough",
    language: "c",
    concepts: ["conditionals"],
    difficulty: "advanced",
    title: "Switch fallthrough",
    explanation:
      "Stacked `case` labels share one body, so several values run the same code until a `break`.",
    code: `#include <stdio.h>

int main(void) {
  int day = 6;
  switch (day) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      printf("weekday\\n");
      break;
    case 6:
    case 7:
      printf("weekend\\n");
      break;
    default:
      printf("invalid\\n");
      break;
  }
  return 0;
}`,
  },
  {
    id: "c-conditionals-chain",
    language: "c",
    concepts: ["conditionals"],
    difficulty: "advanced",
    title: "Chained comparisons",
    explanation:
      "Two comparisons joined with `&&` test a range, since C cannot chain operators like Python can.",
    code: `#include <stdio.h>

int main(void) {
  int score = 85;
  if (80 <= score && score <= 90) {
    printf("solid\\n");
  } else {
    printf("outside\\n");
  }
  return 0;
}`,
  },
  {
    id: "c-conditionals-membership",
    language: "c",
    concepts: ["conditionals"],
    difficulty: "advanced",
    title: "Membership with ||",
    explanation:
      "`||` combines alternatives, so the block runs when any one equality test is true.",
    code: `#include <stdio.h>

int main(void) {
  char key = 'q';
  if (key == 'q' || key == 'Q' || key == 'x') {
    printf("quit\\n");
  } else {
    printf("continue\\n");
  }
  return 0;
}`,
  },
  {
    id: "c-loops-for",
    language: "c",
    concepts: ["loops"],
    difficulty: "beginner",
    title: "An indexed loop",
    explanation:
      "`for` groups a counter, a condition, and a step; here the counter visits 0 through 2.",
    code: `#include <stdio.h>

int main(void) {
  for (int i = 0; i < 3; i++) {
    printf("%d\\n", i);
  }
  return 0;
}`,
  },
  {
    id: "c-loops-range",
    language: "c",
    concepts: ["loops"],
    difficulty: "beginner",
    title: "Summing a range",
    explanation:
      "The loop adds each whole number 1 through 5 into `total`, which accumulates across iterations.",
    code: `#include <stdio.h>

int main(void) {
  int total = 0;
  for (int i = 1; i <= 5; i++) {
    total += i;
  }
  printf("%d\\n", total);
  return 0;
}`,
  },
  {
    id: "c-loops-while",
    language: "c",
    concepts: ["loops"],
    difficulty: "beginner",
    title: "While with a counter",
    explanation:
      "`while` repeats as long as its condition holds, so the body must update the counter itself.",
    code: `#include <stdio.h>

int main(void) {
  int count = 0;
  while (count < 3) {
    printf("%d\\n", count);
    count++;
  }
  return 0;
}`,
  },
  {
    id: "c-loops-break",
    language: "c",
    concepts: ["loops"],
    difficulty: "beginner",
    title: "Breaking early",
    explanation:
      "`break` exits the loop as soon as 9 is found, skipping the remaining elements.",
    code: `#include <stdio.h>

int main(void) {
  int nums[] = {1, 2, 3, 9, 5};
  for (int i = 0; i < 5; i++) {
    if (nums[i] == 9) {
      printf("found 9\\n");
      break;
    }
  }
  return 0;
}`,
  },
  {
    id: "c-loops-continue",
    language: "c",
    concepts: ["loops"],
    difficulty: "intermediate",
    title: "Skipping with continue",
    explanation:
      "`continue` jumps to the next iteration, skipping the rest of the body for odd numbers.",
    code: `#include <stdio.h>

int main(void) {
  int total = 0;
  for (int i = 0; i < 10; i++) {
    if (i % 2 == 1) {
      continue;
    }
    total += i;
  }
  printf("%d\\n", total);
  return 0;
}`,
  },
  {
    id: "c-loops-nested",
    language: "c",
    concepts: ["loops"],
    difficulty: "intermediate",
    title: "Nested loops",
    explanation:
      "The inner loop finishes for each step of the outer loop, printing every pairing.",
    code: `#include <stdio.h>

int main(void) {
  for (int a = 1; a <= 2; a++) {
    for (int b = 1; b <= 3; b++) {
      printf("%d%d ", a, b);
    }
    printf("\\n");
  }
  return 0;
}`,
  },
  {
    id: "c-loops-array-sum",
    language: "c",
    concepts: ["loops"],
    difficulty: "intermediate",
    title: "Summing an array",
    explanation:
      "A `for` loop steps over each element by index, folding it into a running total.",
    code: `#include <stdio.h>

int main(void) {
  int prices[] = {10, 25, 40};
  int total = 0;
  for (int i = 0; i < 3; i++) {
    total += prices[i];
  }
  printf("%d\\n", total);
  return 0;
}`,
  },
  {
    id: "c-loops-do-while",
    language: "c",
    concepts: ["loops"],
    difficulty: "intermediate",
    title: "A do...while",
    explanation:
      "`do` runs the body first and checks the condition after, so it always runs at least once.",
    code: `#include <stdio.h>

int main(void) {
  int count = 3;
  do {
    printf("%d\\n", count);
    count--;
  } while (count > 0);
  return 0;
}`,
  },
  {
    id: "c-loops-matrix",
    language: "c",
    concepts: ["loops"],
    difficulty: "advanced",
    title: "Walking a matrix",
    explanation:
      "Two indexes address a 2D array; the outer loop picks the row and the inner loop walks its cells.",
    code: `#include <stdio.h>

int main(void) {
  int grid[2][3] = {{1, 2, 3}, {4, 5, 6}};
  for (int r = 0; r < 2; r++) {
    for (int c = 0; c < 3; c++) {
      printf("%d ", grid[r][c]);
    }
    printf("\\n");
  }
  return 0;
}`,
  },
  {
    id: "c-loops-pointer-walk",
    language: "c",
    concepts: ["loops"],
    difficulty: "advanced",
    title: "Walking with a pointer",
    explanation:
      "A pointer marches across the array with `p++`, reaching each element without an index.",
    code: `#include <stdio.h>

int main(void) {
  int nums[] = {10, 20, 30, 40};
  int *p = nums;
  while (p < nums + 4) {
    printf("%d ", *p);
    p++;
  }
  printf("\\n");
  return 0;
}`,
  },
  {
    id: "c-loops-max",
    language: "c",
    concepts: ["loops"],
    difficulty: "advanced",
    title: "Finding the max",
    explanation:
      "`best` starts at the first element, and each `>` comparison replaces it when a larger value appears.",
    code: `#include <stdio.h>

int main(void) {
  int nums[] = {3, 1, 4, 1, 5};
  int best = nums[0];
  for (int i = 1; i < 5; i++) {
    if (nums[i] > best) {
      best = nums[i];
    }
  }
  printf("%d\\n", best);
  return 0;
}`,
  },
  {
    id: "c-loops-reverse",
    language: "c",
    concepts: ["loops"],
    difficulty: "advanced",
    title: "Reversing an array",
    explanation:
      "The loop swaps each end toward the middle using one temporary, stopping before the halves cross.",
    code: `#include <stdio.h>

int main(void) {
  int nums[] = {1, 2, 3, 4, 5};
  for (int i = 0; i < 5 / 2; i++) {
    int temp = nums[i];
    nums[i] = nums[5 - 1 - i];
    nums[5 - 1 - i] = temp;
  }
  for (int i = 0; i < 5; i++) {
    printf("%d ", nums[i]);
  }
  printf("\\n");
  return 0;
}`,
  },
  {
    id: "c-functions-basic",
    language: "c",
    concepts: ["functions"],
    difficulty: "beginner",
    title: "A function call",
    explanation:
      "`int add(int a, int b)` declares a function; the `return` value comes back to the caller.",
    code: `#include <stdio.h>

int add(int a, int b) {
  return a + b;
}

int main(void) {
  printf("%d\\n", add(2, 3));
  return 0;
}`,
  },
  {
    id: "c-functions-return",
    language: "c",
    concepts: ["functions"],
    difficulty: "beginner",
    title: "Returning a value",
    explanation:
      "The return type says what `return` sends back, and the caller can print or store it.",
    code: `#include <stdio.h>

int square(int n) {
  return n * n;
}

int main(void) {
  printf("%d\\n", square(4));
  return 0;
}`,
  },
  {
    id: "c-functions-params",
    language: "c",
    concepts: ["functions"],
    difficulty: "beginner",
    title: "Parameters",
    explanation:
      "Parameters name the function's inputs; each call supplies its own argument values.",
    code: `#include <stdio.h>

int combine(int a, int b, int c) {
  return a + b + c;
}

int main(void) {
  printf("%d\\n", combine(1, 2, 3));
  return 0;
}`,
  },
  {
    id: "c-functions-void",
    language: "c",
    concepts: ["functions"],
    difficulty: "beginner",
    title: "A void function",
    explanation:
      "`void` marks a function that prints its work and returns nothing to the caller.",
    code: `#include <stdio.h>

void greet(void) {
  printf("hello\\n");
}

int main(void) {
  greet();
  greet();
  return 0;
}`,
  },
  {
    id: "c-functions-early",
    language: "c",
    concepts: ["functions"],
    difficulty: "intermediate",
    title: "Early return",
    explanation:
      "A function can `return` early, so a bad input exits before the real work runs.",
    code: `#include <stdio.h>

int divide(int a, int b) {
  if (b == 0) {
    return -1;
  }
  return a / b;
}

int main(void) {
  printf("%d\\n", divide(10, 2));
  printf("%d\\n", divide(10, 0));
  return 0;
}`,
  },
  {
    id: "c-functions-array-param",
    language: "c",
    concepts: ["functions"],
    difficulty: "intermediate",
    title: "Array parameters",
    explanation:
      "An array parameter decays to a pointer, so the function also takes a size to know how far to walk.",
    code: `#include <stdio.h>

int sum_array(int nums[], int size) {
  int total = 0;
  for (int i = 0; i < size; i++) {
    total += nums[i];
  }
  return total;
}

int main(void) {
  int nums[] = {10, 25, 40};
  printf("%d\\n", sum_array(nums, 3));
  return 0;
}`,
  },
  {
    id: "c-functions-const-param",
    language: "c",
    concepts: ["functions"],
    difficulty: "intermediate",
    title: "const parameters",
    explanation:
      "`const` on an array parameter promises the function reads the data without modifying it.",
    code: `#include <stdio.h>

void print_scores(const int scores[], int size) {
  for (int i = 0; i < size; i++) {
    printf("%d ", scores[i]);
  }
  printf("\\n");
}

int main(void) {
  int scores[] = {10, 25, 40};
  print_scores(scores, 3);
  return 0;
}`,
  },
  {
    id: "c-functions-compose",
    language: "c",
    concepts: ["functions"],
    difficulty: "intermediate",
    title: "Calling helpers",
    explanation:
      "One function can call another, composing small helpers into a larger result.",
    code: `#include <stdio.h>

int square(int n) {
  return n * n;
}

int sum_of_squares(int a, int b) {
  return square(a) + square(b);
}

int main(void) {
  printf("%d\\n", sum_of_squares(3, 4));
  return 0;
}`,
  },
  {
    id: "c-functions-pointer-param",
    language: "c",
    concepts: ["functions"],
    difficulty: "advanced",
    title: "Pointer parameters",
    explanation:
      "Passing `&total` hands over the address; the function writes through `*total` to change the caller's variable.",
    code: `#include <stdio.h>

void add_to(int *total, int amount) {
  *total += amount;
}

int main(void) {
  int total = 0;
  add_to(&total, 5);
  add_to(&total, 7);
  printf("%d\\n", total);
  return 0;
}`,
  },
  {
    id: "c-functions-swap",
    language: "c",
    concepts: ["functions"],
    difficulty: "advanced",
    title: "Swapping with pointers",
    explanation:
      "Passing pointers lets a function change the caller's variables; the swap exchanges both values.",
    code: `#include <stdio.h>

void swap(int *a, int *b) {
  int temp = *a;
  *a = *b;
  *b = temp;
}

int main(void) {
  int x = 1;
  int y = 2;
  swap(&x, &y);
  printf("%d %d\\n", x, y);
  return 0;
}`,
  },
  {
    id: "c-functions-function-pointer",
    language: "c",
    concepts: ["functions"],
    difficulty: "advanced",
    title: "Function pointers",
    explanation:
      "A function pointer stores a function's address; `op(3, 4)` calls whichever function it currently holds.",
    code: `#include <stdio.h>

int add(int a, int b) {
  return a + b;
}

int multiply(int a, int b) {
  return a * b;
}

int main(void) {
  int (*op)(int, int) = add;
  printf("%d\\n", op(3, 4));
  op = multiply;
  printf("%d\\n", op(3, 4));
  return 0;
}`,
  },
  {
    id: "c-functions-recursion",
    language: "c",
    concepts: ["functions"],
    difficulty: "advanced",
    title: "Recursion",
    explanation:
      "A recursive function calls itself on a smaller argument until it reaches the base case.",
    code: `#include <stdio.h>

int factorial(int n) {
  if (n <= 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

int main(void) {
  printf("%d\\n", factorial(5));
  return 0;
}`,
  },
];
