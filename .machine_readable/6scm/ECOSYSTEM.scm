; SPDX-License-Identifier: AGPL-3.0-or-later
; Error-Lang Playground - Ecosystem Position
; Reference: hyperpolymath/ECOSYSTEM.scm

(ecosystem
  (version "1.0")
  (name "error-lang-playground")
  (type "teaching-tool")
  (purpose "Interactive learning environment for Error-Lang")

  (position-in-ecosystem
    (role "Educational implementation of error-lang specification")
    (relationship-to-error-lang "playground implements the error-lang grammar and semantics")
    (target-audience "Students learning compiler design, programming fundamentals"))

  (related-projects
    ((name "error-lang")
     (relationship "specification")
     (description "The Error-Lang language specification and grammar")
     (url "https://github.com/hyperpolymath/error-lang"))

    ((name "mylang-playground")
     (relationship "sibling-pattern")
     (description "Structural template for language playgrounds")
     (url "https://github.com/hyperpolymath/mylang-playground"))

    ((name "affinescript")
     (relationship "inspiration")
     (description "Type system and affine types inspiration")
     (url "https://github.com/hyperpolymath/affinescript"))

    ((name "rhodium-standard-repositories")
     (relationship "governance")
     (description "Language policy and repository standards")
     (url "https://github.com/hyperpolymath/rhodium-standard-repositories")))

  (what-this-is
    "An interactive playground for learning Error-Lang"
    "A structured curriculum teaching compiler concepts"
    "A CLI tool for running Error-Lang programs"
    "A teaching-first language implementation")

  (what-this-is-not
    "A production-ready language runtime"
    "A general-purpose programming language"
    "A replacement for traditional compilers courses"
    "A web-based playground (it's CLI-based)"))
