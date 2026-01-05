# SPDX-License-Identifier: AGPL-3.0-or-later
# Error-Lang Playground - Task Runner
# Run tasks with: just <recipe>

# Default recipe - show help
default:
    @just --list

# ============================================
# BUILD
# ============================================

# Build everything
build: build-rescript build-cli
    @echo "✓ Build complete"

# Build ReScript compiler
build-rescript:
    @echo "Building ReScript compiler..."
    npx rescript

# Build ReScript in watch mode
build-watch:
    npx rescript -w

# Check CLI without running
build-cli:
    @echo "Checking Deno CLI..."
    deno check cli/main.js

# Clean build artifacts
clean:
    @echo "Cleaning build artifacts..."
    rm -rf compiler/src/**/*.res.js
    rm -rf lib/
    @echo "✓ Clean complete"

# ============================================
# RUN
# ============================================

# Run an Error-Lang file
run file:
    deno task run {{file}}

# Run the first level
run-hello:
    deno task run levels/01-hello-world.err

# Start REPL (interactive mode)
repl:
    deno task repl

# List available levels
levels:
    @echo "Available levels:"
    @ls -1 levels/*.err 2>/dev/null | sort

# ============================================
# EXPLAIN
# ============================================

# Explain an error code
explain code:
    deno task explain {{code}}

# List all error codes
explain-all:
    @echo "Error Codes (E0001-E0010):"
    @echo "  E0001 - Unexpected Token"
    @echo "  E0002 - Unterminated String"
    @echo "  E0003 - Invalid Escape Sequence"
    @echo "  E0004 - Illegal Character"
    @echo "  E0005 - Missing 'end' Keyword"
    @echo "  E0006 - Unmatched Parenthesis"
    @echo "  E0007 - Smart Quote Detected"
    @echo "  E0008 - Invalid Identifier"
    @echo "  E0009 - Reserved Keyword Misuse"
    @echo "  E0010 - Whitespace Issue"

# ============================================
# TEST
# ============================================

# Run all tests
test:
    @echo "Running tests..."
    deno test --allow-read tests/

# Run tests with coverage
test-coverage:
    deno test --allow-read --coverage=coverage tests/
    deno coverage coverage

# Run tests in watch mode
test-watch:
    deno test --allow-read --watch tests/

# ============================================
# LINT & FORMAT
# ============================================

# Lint code
lint:
    @echo "Linting..."
    deno lint
    @echo "✓ Lint passed"

# Format code
fmt:
    deno fmt

# Check formatting (no changes)
fmt-check:
    deno fmt --check

# Full check (lint + format + type check)
check: lint fmt-check build-cli
    @echo "✓ All checks passed"

# ============================================
# DEVELOPMENT
# ============================================

# Check environment
doctor:
    deno task doctor

# Install dependencies
setup:
    @echo "Setting up Error-Lang Playground..."
    npm install rescript @rescript/core
    @echo "✓ Setup complete"
    @echo "Run 'just build' to compile"

# Start development mode
dev: build-watch

# ============================================
# STATISTICS
# ============================================

# Count lines of code
loc:
    @echo "Lines of Code:"
    @echo "ReScript:"
    @find compiler/src -name "*.res" -exec wc -l {} + 2>/dev/null | tail -1 || echo "  0 total"
    @echo "JavaScript:"
    @find cli -name "*.js" -exec wc -l {} + 2>/dev/null | tail -1 || echo "  0 total"
    @echo "Levels:"
    @find levels -name "*.err" -exec wc -l {} + 2>/dev/null | tail -1 || echo "  0 total"

# Show project stats
stats:
    @echo "Error-Lang Playground Statistics"
    @echo "================================"
    @echo "Levels: $(ls -1 levels/*.err 2>/dev/null | wc -l)"
    @echo "ReScript files: $(find compiler/src -name '*.res' | wc -l)"
    @echo "Error codes: 10 (E0001-E0010)"

# ============================================
# RELEASE
# ============================================

# Pre-release checks
pre-release: check test
    @echo "✓ Pre-release checks passed"

# Create git tag
tag version:
    git tag -a v{{version}} -m "Release v{{version}}"
    @echo "Created tag v{{version}}"
    @echo "Push with: git push origin v{{version}}"
