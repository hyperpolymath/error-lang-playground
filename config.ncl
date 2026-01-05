# SPDX-License-Identifier: AGPL-3.0-or-later
# config.ncl - Error-Lang Playground Configuration
# Type-safe configuration using Nickel
# See: https://nickel-lang.org

{
  # Project metadata
  project = {
    name = "error-lang-playground",
    version = "0.1.0",
    description = "Teaching playground for Error-Lang",
    license = "AGPL-3.0-or-later",
    author = "Jonathan D.A. Jewell",
    repository = "https://github.com/hyperpolymath/error-lang-playground",
  },

  # Compiler configuration
  compiler = {
    language = "rescript",
    target = "es6",
    output_suffix = ".res.js",
    source_dir = "compiler/src",
    modules = [
      "lexer",
      "parser",
      "types",
      "errors",
      "codegen",
      "runtime",
    ],
  },

  # CLI configuration
  cli = {
    runtime = "deno",
    entry_point = "cli/main.js",
    permissions = [
      "--allow-read",
      "--allow-write",
      "--allow-env",
    ],
    commands = [
      "run",
      "explain",
      "doctor",
      "levels",
      "repl",
    ],
  },

  # Error codes configuration
  error_codes = {
    syntax = {
      range = "E0001-E0099",
      implemented = [
        { code = "E0001", title = "Unexpected token", lesson = 1 },
        { code = "E0002", title = "Unterminated string", lesson = 2 },
        { code = "E0003", title = "Invalid escape sequence", lesson = 3 },
        { code = "E0004", title = "Illegal character", lesson = 4 },
        { code = "E0005", title = "Missing end keyword", lesson = 5 },
        { code = "E0006", title = "Unmatched parenthesis", lesson = 6 },
        { code = "E0007", title = "Smart quote detected", lesson = 1 },
        { code = "E0008", title = "Invalid identifier", lesson = 8 },
        { code = "E0009", title = "Reserved keyword misuse", lesson = 9 },
        { code = "E0010", title = "Whitespace issue", lesson = 10 },
      ],
    },
    runtime = {
      range = "E0101-E0199",
      implemented = [],
    },
    logical = {
      range = "E0201-E0299",
      implemented = [],
    },
    semantic = {
      range = "E0301-E0399",
      implemented = [],
    },
  },

  # Stability score configuration
  stability = {
    initial_score = 100,
    error_penalty = 10,
    warning_penalty = 5,
    thresholds = {
      rock_solid = 90,
      stable = 70,
      wobbly = 50,
      unstable = 30,
      critical = 10,
      collapsed = 0,
    },
  },

  # Curriculum configuration
  curriculum = {
    total_levels = 10,
    levels_dir = "levels",
    file_extension = ".err",
    categories = [
      { name = "beginner", levels = "01-10" },
      { name = "intermediate", levels = "11-20" },
      { name = "advanced", levels = "21-30" },
    ],
  },

  # Computed values
  full_name = project.name ++ " v" ++ project.version,
  error_code_count = 10,

  # Development settings
  development = {
    watch_dirs = [
      "compiler/src",
      "cli",
      "levels",
    ],
    test_pattern = "tests/**/*.test.js",
    lint_ignore = [
      "node_modules",
      "lib",
      "*.res.js",
    ],
  },

  # Deployment configuration
  deployment = {
    container = {
      enabled = true,
      registry = "ghcr.io/hyperpolymath",
      image = "error-lang-playground",
      base_image = "denoland/deno:alpine",
    },
    platforms = [
      "linux/amd64",
      "linux/arm64",
    ],
  },
}
