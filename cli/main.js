#!/usr/bin/env -S deno run --allow-read --allow-write
// SPDX-License-Identifier: AGPL-3.0-or-later
// Error-Lang Playground - CLI Entry Point
// A teaching language where code breaks intentionally

import { parseArgs } from "jsr:@std/cli/parse-args";
import { join, basename } from "jsr:@std/path";

const VERSION = "0.1.0";

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

// Error code explanations for the 'explain' command
const errorExplanations = {
  E0001: {
    title: "Unexpected Token",
    lesson: 1,
    explanation: `
The parser encountered a token it didn't expect at this position.
This usually means there's a syntax error nearby.

Common causes:
- Missing operator between expressions
- Typo in a keyword
- Wrong punctuation

Example of error:
  let x 42    # Missing '=' between 'x' and '42'

Correct:
  let x = 42
`,
    learningObjective: "Understand how parsers expect specific token sequences",
  },

  E0002: {
    title: "Unterminated String",
    lesson: 2,
    explanation: `
A string literal was opened with a quote but never closed.
Every string must end with a matching quote character.

Common causes:
- Forgot the closing quote
- String spans multiple lines (not allowed without triple quotes)
- Closing quote is a smart quote instead of straight quote

Example of error:
  let msg = "Hello, world    # Missing closing quote

Correct:
  let msg = "Hello, world"
`,
    learningObjective: "Understand string literal boundaries in source code",
  },

  E0003: {
    title: "Invalid Escape Sequence",
    lesson: 3,
    explanation: `
An escape sequence in a string uses a backslash (\\) followed by a
character, but the character isn't a valid escape code.

Valid escape sequences:
  \\n  - newline
  \\r  - carriage return
  \\t  - tab
  \\\\  - literal backslash
  \\"  - literal quote
  \\0  - null character
  \\xNN - hex character code

Example of error:
  let path = "C:\\Users\\name"    # \\U and \\n are invalid

Correct:
  let path = "C:\\\\Users\\\\name"
`,
    learningObjective: "Learn how escape sequences work in string processing",
  },

  E0004: {
    title: "Illegal Character",
    lesson: 4,
    explanation: `
A character appeared in the source code that isn't part of
Error-Lang's character set.

Valid characters:
- Letters (a-z, A-Z)
- Digits (0-9)
- Underscore (_)
- Operators (+, -, *, /, etc.)
- Punctuation ((), [], {}, etc.)
- Whitespace (space, tab, newline)

Common causes:
- Copy-pasted text with hidden characters
- Smart quotes from word processors
- Non-ASCII characters

Example of error:
  let @name = 42    # @ is not valid

Correct:
  let name = 42
`,
    learningObjective: "Understand character sets and encoding in source code",
  },

  E0005: {
    title: "Missing 'end' Keyword",
    lesson: 5,
    explanation: `
A block (main, function, if, while, etc.) was opened but not
closed with the 'end' keyword.

Error-Lang uses explicit block terminators instead of braces.
Every block must end with 'end'.

Example of error:
  main
    println("Hello")
  # Missing 'end' here

Correct:
  main
    println("Hello")
  end
`,
    learningObjective: "Understand block structure and scope in Error-Lang",
  },

  E0006: {
    title: "Unmatched Parenthesis",
    lesson: 6,
    explanation: `
An opening parenthesis '(' was found without a matching closing ')'.
Parentheses must always be balanced.

Common causes:
- Forgot to close a function call
- Nested expressions missing inner/outer parens
- Typo deleted a parenthesis

Example of error:
  println("Hello"      # Missing closing )

Correct:
  println("Hello")
`,
    learningObjective: "Understand expression nesting and balanced delimiters",
  },

  E0007: {
    title: "Smart Quote Detected",
    lesson: 1,
    explanation: `
A "smart" or "curly" quote was found instead of a straight quote.
Programming languages require straight ASCII quotes.

Smart quotes: " " ' '  (curved, from word processors)
Straight quotes: " '   (vertical, for code)

This commonly happens when:
- Copying code from Word, Google Docs, or websites
- Typing on mobile keyboards
- Using certain text editors with auto-correction

Example of error:
  let msg = "Hello"    # These are smart quotes

Correct:
  let msg = "Hello"    # These are straight quotes
`,
    learningObjective: "Distinguish Unicode formatting characters from ASCII",
  },

  E0008: {
    title: "Invalid Identifier",
    lesson: 8,
    explanation: `
An identifier (variable/function name) contains invalid characters
or starts with a digit.

Valid identifier rules:
- Must start with a letter or underscore
- Can contain letters, digits, underscores
- Cannot be a reserved keyword
- Case-sensitive

Example of error:
  let 2fast = 10       # Starts with digit
  let my-var = 5       # Contains hyphen

Correct:
  let fast2 = 10
  let my_var = 5
`,
    learningObjective: "Learn naming conventions in programming languages",
  },

  E0009: {
    title: "Reserved Keyword Misuse",
    lesson: 9,
    explanation: `
A reserved keyword was used as an identifier. Keywords have
special meaning and cannot be used as variable or function names.

Reserved keywords in Error-Lang:
  main, end, let, mutable, function, struct
  if, elseif, else, while, for, in
  return, break, continue
  and, or, not
  true, false, nil
  gutter, fn, print, println

Example of error:
  let if = 42          # 'if' is a keyword

Correct:
  let condition = 42
`,
    learningObjective: "Understand the role of keywords in language grammar",
  },

  E0010: {
    title: "Whitespace Issue",
    lesson: 10,
    explanation: `
Problematic whitespace was detected in the source code.
This includes invisible characters that look like spaces but aren't.

Common problematic characters:
- Non-breaking space (\\u00A0)
- Zero-width space (\\u200B)
- Tab/space mixing

These often come from:
- Web page copy-paste
- Word processors
- PDF extraction

Your editor may need to be configured to show invisible characters.
`,
    learningObjective: "Understand whitespace characters and encoding issues",
  },
};

// Print colored output
function print(text, color = "") {
  if (color && colors[color]) {
    console.log(`${colors[color]}${text}${colors.reset}`);
  } else {
    console.log(text);
  }
}

// Print stability meter
function printStabilityMeter(score) {
  const filled = Math.floor(score / 10);
  const empty = 10 - filled;
  const bar = "█".repeat(filled) + "░".repeat(empty);

  let color;
  if (score >= 70) color = colors.green;
  else if (score >= 40) color = colors.yellow;
  else color = colors.red;

  console.log(`\n${colors.bold}Stability Score:${colors.reset} ${color}[${bar}] ${score}%${colors.reset}`);

  if (score >= 90) print("  Rock solid - code is highly stable", "green");
  else if (score >= 70) print("  Stable - minor wobbles detected", "green");
  else if (score >= 50) print("  Wobbly - errors are accumulating", "yellow");
  else if (score >= 30) print("  Unstable - output may be unreliable", "yellow");
  else if (score >= 10) print("  Critical - program barely running", "red");
  else print("  Collapsed - too many errors to continue", "red");
}

// Command: run
async function runCommand(args) {
  const file = args._[0];
  if (!file) {
    print("Error: No file specified", "red");
    print("Usage: error-lang run <file.err>", "gray");
    Deno.exit(1);
  }

  try {
    const source = await Deno.readTextFile(file);
    print(`\n${colors.cyan}▶ Running: ${basename(file)}${colors.reset}`);
    print(`${colors.gray}${"─".repeat(50)}${colors.reset}`);

    // For now, just show the source and simulate execution
    // TODO: Import compiled ReScript modules when build system is ready

    // Simulate parsing and running
    const hasGutter = source.includes("gutter");
    const hasErrors = source.includes("unterminated") || source.includes("@") || source.includes(""");

    // Find and display main block output
    const lines = source.split("\n");
    for (const line of lines) {
      const printMatch = line.match(/println?\s*\(\s*"([^"]*)"\s*\)/);
      if (printMatch) {
        print(printMatch[1]);
      }
    }

    // Calculate stability score
    let stability = 100;
    if (hasGutter) {
      stability -= 10; // Base penalty for having a gutter
      if (hasErrors) {
        stability -= 20; // Additional penalty for errors in gutter
      }
    }

    printStabilityMeter(stability);

    if (hasGutter) {
      print("\n📚 Gutter block detected - errors were injected for learning", "cyan");
    }

  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      print(`Error: File not found: ${file}`, "red");
    } else {
      print(`Error: ${err.message}`, "red");
    }
    Deno.exit(1);
  }
}

// Command: explain
function explainCommand(args) {
  const code = args._[0];
  if (!code) {
    print("Error: No error code specified", "red");
    print("Usage: error-lang explain <E0001>", "gray");
    print("\nAvailable codes: E0001-E0010", "gray");
    Deno.exit(1);
  }

  const upperCode = code.toUpperCase();
  const info = errorExplanations[upperCode];

  if (!info) {
    print(`Unknown error code: ${code}`, "red");
    print("\nAvailable codes:", "gray");
    for (const c of Object.keys(errorExplanations)) {
      print(`  ${c}: ${errorExplanations[c].title}`, "gray");
    }
    Deno.exit(1);
  }

  print(`\n${colors.bold}${colors.red}${upperCode}${colors.reset}: ${colors.bold}${info.title}${colors.reset}`);
  print(`${colors.gray}Lesson ${info.lesson}${colors.reset}`);
  print(`${colors.gray}${"─".repeat(50)}${colors.reset}`);
  print(info.explanation);
  print(`${colors.cyan}Learning Objective:${colors.reset} ${info.learningObjective}`);
}

// Command: doctor
function doctorCommand() {
  print("\n🏥 Error-Lang Environment Check", "bold");
  print("─".repeat(40), "gray");

  // Check Deno
  print(`${colors.green}✓${colors.reset} Deno ${Deno.version.deno}`);
  print(`${colors.green}✓${colors.reset} V8 ${Deno.version.v8}`);
  print(`${colors.green}✓${colors.reset} TypeScript ${Deno.version.typescript}`);

  // Check for ReScript (would need rescript.json)
  try {
    Deno.statSync("rescript.json");
    print(`${colors.green}✓${colors.reset} rescript.json found`);
  } catch {
    print(`${colors.yellow}⚠${colors.reset} rescript.json not found (ReScript not configured)`);
  }

  // Check for examples
  try {
    const levels = [...Deno.readDirSync("levels")];
    print(`${colors.green}✓${colors.reset} ${levels.length} level(s) found`);
  } catch {
    print(`${colors.yellow}⚠${colors.reset} levels/ directory not found`);
  }

  print("\n🎓 Ready to learn through errors!", "cyan");
}

// Command: levels
async function levelsCommand() {
  print("\n📚 Available Levels", "bold");
  print("─".repeat(40), "gray");

  try {
    const entries = [...Deno.readDirSync("levels")].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    for (const entry of entries) {
      if (entry.isFile && entry.name.endsWith(".err")) {
        const content = await Deno.readTextFile(join("levels", entry.name));
        const titleMatch = content.match(/^#\s*(.+)/m);
        const title = titleMatch ? titleMatch[1] : "Untitled";
        print(`  ${colors.cyan}${entry.name}${colors.reset} - ${title}`);
      }
    }

    print("\nRun a level with: error-lang run levels/<filename>", "gray");
  } catch {
    print("No levels found. Create .err files in the levels/ directory.", "yellow");
  }
}

// Command: help
function helpCommand() {
  print(`
${colors.bold}Error-Lang Playground${colors.reset} v${VERSION}
A teaching language where code breaks intentionally.

${colors.bold}USAGE:${colors.reset}
  error-lang <command> [options]

${colors.bold}COMMANDS:${colors.reset}
  run <file>      Run an Error-Lang program
  explain <code>  Explain an error code (e.g., E0002)
  levels          List available learning levels
  doctor          Check environment setup
  help            Show this help message
  version         Show version

${colors.bold}EXAMPLES:${colors.reset}
  error-lang run levels/01-hello-world.err
  error-lang explain E0007
  error-lang doctor

${colors.bold}LEARN MORE:${colors.reset}
  https://github.com/hyperpolymath/error-lang-playground
`);
}

// Main entry point
async function main() {
  const args = parseArgs(Deno.args, {
    boolean: ["help", "version"],
    alias: { h: "help", v: "version" },
  });

  if (args.version) {
    print(`error-lang v${VERSION}`);
    Deno.exit(0);
  }

  if (args.help || args._.length === 0) {
    helpCommand();
    Deno.exit(0);
  }

  const command = args._[0];
  args._ = args._.slice(1);

  switch (command) {
    case "run":
      await runCommand(args);
      break;
    case "explain":
      explainCommand(args);
      break;
    case "levels":
      await levelsCommand();
      break;
    case "doctor":
      doctorCommand();
      break;
    case "help":
      helpCommand();
      break;
    default:
      print(`Unknown command: ${command}`, "red");
      helpCommand();
      Deno.exit(1);
  }
}

main();
