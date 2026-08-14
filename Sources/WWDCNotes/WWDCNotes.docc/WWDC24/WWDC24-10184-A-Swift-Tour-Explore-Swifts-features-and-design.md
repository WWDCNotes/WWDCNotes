# A Swift Tour: Explore Swift’s features and design

Learn the essential features and design philosophy of the Swift programming language. We’ll explore how to model data, handle errors, use protocols, write concurrent code, and more while building up a Swift package that has a library, an HTTP server, and a command line client. Whether you’re just beginning your Swift journey or have been with us from the start, this talk will help you get the most out of the language.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2024/10184", purpose: link, label: "Watch Video (27 min)")

   @Contributors {
      @GitHubUser(mini-min)
   }
}

## Key Takeaways

- Swift is modern, expressive, and safe
- Prefer value types & immutability
- Errors & optionals handle every case
- Protocols & generics for abstractions
- Data-race safe concurrency

## Core features of Swift
### Value types
- Don't share state → changing one value can't affect other values
- Equal values are interchangeable (no identity)
- Used for the basic types in Swift

> Tip:
> Swift emphasizes value types and immutability
> - Prefer `struct` over `class`, prefer `let` over `var`
> - Controlling when a value can change makes code much easier to reason about

### Errors and Optionals
- Errors should be clearly marked and carry actionable context
- Swift differentiates recoverable errors from programmer mistakes
- `throws` / `try` make error handling explicit
- Optionals represent a value that may be `nil` → must be unwrapped before use
- Both force code to handle all the possibilities

> Important:
> Their design makes it easier to write correct, debuggable programs in Swift

### Code organization (modules and packages) 
- Module: a collection of source files always built together
- Package: a distributable collection of modules
- Swift Package Manager (SwiftPM): the tool for managing packages & dependencies
- Access control levels: `private`, `internal`, `package`, `public`

### Classes
- Represent shared mutable state (reference type, has identity)
- Support single inheritance; subclasses can override superclass methods
- Use for shared mutable state, identity, or inheritance
- Memory managed automatically (ARC) → watch for reference cycles, break them with `weak`

### Protocols and generics
- General way to build abstractions - work with both value and reference types
- Protocol: an abstract set of requirements for a type
- Generics: write reusable, type-safe code across families of types (with constraints, e.g. `where Element: Hashable`)
- See more <doc:WWDC22-110352-Embrace-Swift-generics>, <doc:WWDC22-110353-Design-protocol-interfaces-in-Swift>

### Concurrency
- `Task`: the fundamental unit of concurrency (a concurrent execution context)
- Model suspension in code:
  - `async`: a function that may suspend
  - `await`: marks where suspension can occur
- `Sendable`: types safe to share across concurrency domains
- `actor`: a reference type that automatically protects its shared mutable state by serializing access
- Swift 6 verifies data-race safety at compile time
- Learning starting point: <doc:WWDC21-10134-Explore-structured-concurrency-in-Swift>

### Extensibility
- Property wrapper: encapsulate logic for managing a stored value
- Result builder: express complex values declaratively
  - See more <doc:WWDC21-10253-Write-a-DSL-in-Swift-using-result-builders>
- Macro: a compiler plugin that takes a syntax tree as input and returns transformed code as output
  - See more <doc:WWDC23-10167-Expand-on-Swift-macros>
