; SPDX-License-Identifier: AGPL-3.0-or-later
; Error-Lang Playground - Metadata
; Reference: spec/META-FORMAT-SPEC.adoc

(define meta
  '((architecture-decisions
      ((id "adr-001")
       (title "Use ReScript for Compiler Implementation")
       (status "accepted")
       (date "2025-01-05")
       (context "Need type-safe language that compiles to JavaScript for Deno runtime")
       (decision "Use ReScript with ES6 module output")
       (consequences
         "Type safety during development"
         "Seamless integration with Deno"
         "Follows RSR language policy")))

    (development-practices
      (code-style
        (formatter "deno fmt")
        (linter "deno lint")
        (rescript-format "rescript format"))
      (security
        (dependency-scanning "enabled")
        (codeql "enabled"))
      (testing
        (framework "deno test")
        (coverage "enabled"))
      (versioning "semver")
      (documentation "asciidoc")
      (branching "main-only"))

    (design-rationale
      (why-rescript
        "Type safety, functional style, compiles to clean JS, RSR compliant")
      (why-deno
        "TypeScript-free runtime, secure by default, RSR compliant")
      (why-error-injection
        "Teaching through failure is more memorable than teaching through success")
      (why-stability-score
        "Gamification makes learning engaging, shows cumulative impact of errors")
      (why-gutter-blocks
        "Explicit error zones make the teaching intention clear"))))
