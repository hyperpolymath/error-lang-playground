; SPDX-License-Identifier: AGPL-3.0-or-later
; Error-Lang Playground - Project State
; Reference: hyperpolymath/gitvisor/STATE.scm

(define state
  '((metadata
      (version "0.1.0")
      (schema-version "1.0")
      (created "2025-01-05")
      (updated "2025-01-05")
      (project "error-lang-playground")
      (repo "https://github.com/hyperpolymath/error-lang-playground"))

    (project-context
      (name "Error-Lang Playground")
      (tagline "Learn compilers by breaking code intentionally")
      (tech-stack
        (compiler "ReScript")
        (cli "Deno")
        (docs "AsciiDoc")
        (tasks "just")))

    (current-position
      (phase "initial")
      (overall-completion 40)
      (components
        (lexer (status "implemented") (completion 80))
        (parser (status "partial") (completion 50))
        (error-injector (status "implemented") (completion 70))
        (cli (status "implemented") (completion 60))
        (levels (status "in-progress") (completion 100))
        (documentation (status "partial") (completion 50)))
      (working-features
        "Lexer with position tracking"
        "Error-tolerant parsing"
        "Error injection system"
        "CLI with run/explain/doctor commands"
        "10 progressive learning levels"
        "Error code explanations"))

    (route-to-mvp
      (milestones
        ((name "Core Compiler")
         (items
           ("Complete parser for all grammar constructs" pending)
           ("Implement interpreter/evaluator" pending)
           ("Wire ReScript to CLI" pending)))
        ((name "Curriculum")
         (items
           ("Add intermediate levels (11-20)" pending)
           ("Add advanced levels (21-30)" pending)
           ("Create level progression tracking" pending)))
        ((name "Polish")
         (items
           ("Comprehensive test suite" pending)
           ("CI/CD pipeline" completed)
           ("Documentation site" pending)))))

    (blockers-and-issues
      (critical ())
      (high-priority
        ("ReScript build integration with Deno"))
      (medium-priority
        ("Complete parser for if/while/function")
        ("Implement runtime evaluation"))
      (low-priority
        ("Add more error codes (E0101+)")))

    (critical-next-actions
      (immediate
        ("Wire compiled ReScript to CLI")
        ("Add basic interpreter"))
      (this-week
        ("Complete parser")
        ("Add test cases"))
      (this-month
        ("Intermediate levels")
        ("Documentation site")))

    (session-history
      ((date "2025-01-05")
       (session "initial-creation")
       (accomplishments
         "Created repository structure"
         "Implemented Lexer.res with full tokenization"
         "Implemented Parser.res with error recovery"
         "Implemented ErrorInjector.res"
         "Created Deno CLI with run/explain/doctor"
         "Created 10 learning levels"
         "Added justfile and CI workflows")))))
