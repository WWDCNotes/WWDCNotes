# What’s new in Swift

Join us for an update on Swift. Discover the latest language advancements, including updates for everyday ergonomics, improved concurrency, and safer high-performance code. Explore workflow and language interoperability improvements and updates in embedded Swift.

@Metadata {
   @TitleHeading("WWDC26")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2026/262", purpose: link, label: "Watch Video (32 min)")

   @Contributors {
      @GitHubUser(leogdion)
   }
}

@Comment {
   Optional: add a "Key Takeaways" section here (~250 chars, one `- ` bullet per line)
   so it can be shared on social media. See Contributing.md for details.
}

Presented by Becca and Evan from the Swift team. An update on the work done during the
development of Swift 6.3 and 6.4, spanning everyday language ergonomics, library updates,
interoperability and platform support, performance tuning, and the future of Swift.

## Everyday ergonomics

@Comment {
   Becca's section: small language quality-of-life changes you might use every day.
}

### Small changes
- No longer need to use parentheses for optional existential and opqaue types

```swift
  (some Rocket)?
   (any Rocket)?
```

becomes:

```swift
  some Rocket?
   any Rocket?
```

- Xcode gives warnings when you don't handle an error inside a `Task`
- `weak let` allows for `Sendable` classes
- mark types as not `Sendable` with `~Sendable` (doesn't stop subclasses from being Sendable)
- swift generates initializers for each ACL available
- new `@available(anyAppleOS ...` attribute and `#if os(anyAppleOS)` for platform available for all releases of year only support for OSes 26 and newer
- `@diagnose` macro for enabling, ignoring, and escalating warnings
- `::` for module selectors

## Library updates

- `withTaskCancellationShield` - returns false inside when `Task.isCancelled` is called
- 'mapKeyedValues` - passed both key and value instead of just value like `mapValues`
- `FilePath` for cross-platform filepath handling
@Comment {
   Evan's section: standard library, Swift Testing, Subprocess, and Foundation.
}

### Standard library


@Comment {
   Cover new tools for:
   - Task cancellation shield — inside the shield, cancellation checks always return
     `false`; keep the region short (finishing or rolling back work, e.g. to avoid
     corrupting a file).
   - `mapKeyedValues` — passes both the key and old value into the mapping closure
     (unlike `mapValues`, which only passes the value).
   - New `FilePath` type in the standard library, based on the Swift System type, for
     correct cross-platform filepath handling.
}

### Swift Testing

- allow for `Issue.record` severity
- `Test.cancel` for cancelling tests - especially for parameterized tests
- `swift test` with --maximum-repititions and --repeat-unit 


### Subprocess 1.0

- simplifies running processes for all operating systems and uses modern Swift 6 paradigms

@Comment {
   Cover the 1.0 release incorporating real-world feedback:
   - Simplified execution type, improved error handling, convenience streaming APIs.
   - Greatly improved cross-platform support (platform-specific process file descriptors
     and termination statuses).
   - stdout/stderr available on the execution object as `AsyncBufferSequence` (each
     stream created only once).
   - New `strings()` method reads output line-by-line and respects grapheme cluster
     boundaries (no split multi-byte characters).
}

### Foundation

- new `ProgressManager` using structured concurrency
- faster Data operations
- reduced bridging between Swift and Objective-C type
- 

@Comment {
   Cover Foundation improvements:
   - `ProgressManager` — new progress-reporting type that works with async/await,
     separates composition from reporting, and offers type-safe metadata.
   - Swift-Foundation effort continues: more of `Data` modernized (faster span access,
     equality, iteration, mutation; faster Data<->NSData bridging on Apple platforms).
   - `NSURL` and `CFURL` unified into a single Swift implementation (faster, less memory).
   - Note on language interoperability enabling migration without changing API surface.
}

## Beyond Xcode: interoperability & platforms

@Comment {
   Evan's section: Swift across every layer of the stack — interop, IDEs, web, embedded.
}

### Exposing Swift to C

- new `@c` attribute for exposing Swift to C
- Swift supports async and throwing Swift functions from Java
- Official Swift SDK for Android available on swift.org

@Comment {
   Cover the new `@C` attribute (6.4) — like `@objc`, but for C:
   - Applies to functions operating on C-compatible types (integers, pointers, imported
     C structs, enums with raw integer types); compiler prevents passing incompatible types.
   - `@C` + `@implementation` to implement an existing C-declared function in Swift
     without a new C declaration (launch-window example).
   - Without `@implementation`, the compiler emits a declaration into the generated C
     header so C can call the new Swift function.
   - Safe interop: pass a `span` instead of array + count separately; Swift bridges Spans
     to C automatically.
   - C++ interop also supports bridging between Swift and C++20 spans.
}

### Swift on more platforms

@Comment {
   Cover ecosystem/IDE/platform reach:
   - Swift-Java: now calls async and throwing Swift functions from Java; more generics
     (constrained extensions, conforming Java classes to Swift protocols); natural from
     Java/Kotlin on Android.
   - Official Swift SDK for Android available on swift.org.
   - VS Code extension: new Swiftly integration to install toolchains from swift.org in
     the editor.
   - Now on the OpenVSX marketplace -> VSCodium, Cursor, Kiro, Antigravity. Getting-started
     checklist (install Swift, create project, run, tests, docs).
}

### WebAssembly & JavaScriptKit

@Comment {
   Cover Wasm support and JS interop:
   - Same language for native apps, backend servers, and frontend.
   - JavaScriptKit: safer/faster bridging (vs dynamic lookups) — WebGL example.
   - Goodnotes case study: reused battle-tested Swift code on the web via Wasm; safe
     bridging benchmarked 35-40x faster than dynamic bridging.
   - Binary size matters more on the web (code shipped to each device) — motivates
     embedded Swift below.
}

### Embedded Swift

- supports Existential types and Untyped throws 

@Comment {
   Cover the growing embedded subset:
   - Existential types (multiple types conforming to a protocol in an array / passed to
     a function).
   - Untyped throws (using the same machinery as existentials).
   - Debug info: type-layout metadata saved into DWARF (not the binary) — keeps binaries
     small while improving debugging of embedded coredumps.
   - `EmbeddedRestrictions` warning group identifies unavailable language features;
     `@diagnose` (from Becca's section) controls these diagnostics.
}

## Performance tuning

-

@Comment {
   Becca's section: advanced features for performance-sensitive code without giving up
   safety. Two areas — controlling optimizer decisions, and extending the ownership system.
}

### Controlling the optimizer

- more granular control over inlining optimization with `@inline(never)` and `@inline(always)`
- new `@specialized` attribute to let external libraries know about specific concrete type implementations

@Comment {
   Cover explicit control over optimizations that can backfire:
   - Inlining: existing `@inline(never)`; new `@inline(always)` (6.4) forces inlining.
     Pair `final` with `@inline(always)` for class methods that might be overridden.
   - Specialization: new `@specialized` attribute (6.3) — write a `where` clause to
     generate a specialized version for specific concrete types (useful in libraries
     where the compiler can't see usage).
}

### Ownership system

- `Equatable`/`Comparable`/`Hashable` are available on noncopyable types; and `Equatable`/`Comparable` are available as non-escapable types
- Associated types can now be non-copyable or non-escapable.
- new `Iterable` protocol allows for _borrowing_ and prohibits _mutating_
- new `borrow` (read-only access to shared storage, no copy) and `mutate` (exclusive
  in-place modification) replace `get`/`set`.

@Comment {
   Recap + this year's steps:
   - Why copies are unnecessary when storage stays allocated and both sides follow
     exclusivity; object reference-counting overhead; the danger of `UnsafePointer`.
   - Borrow (both sides read-only until the borrow ends) vs mutate (other side fully
     blocked); verified at compile time.
   - New this year: `Equatable`/`Comparable`/`Hashable` usable on noncopyable types;
     `Equatable`/`Comparable` usable on non-escapable types.
   - Associated types can now be non-copyable or non-escapable.
}

### The Iterable protocol

@Comment {
   Cover the new `for`-loop `Iterable` protocol:
   - Borrows elements instead of copying (unlike `Sequence`) — works with non-copyable
     elements, avoids reference counting, can throw during the loop.
   - Exclusivity prohibits mutating the Iterable while looping (was a performance trap
     with Sequence); `for` prefers `Sequence` when available, falls back to `Iterable`.
   - Batching design: iterator returns a span of elements at a time; empty span
     terminates the loop — efficient for types that return everything in one span.
}

### borrow / mutate accessors

@Comment {
   Cover the new accessors via the `UniqueBox` example:
   - Problem: `get`/`set` copy the data (e.g. an `InlineArray` of 256 Ints ~= 2KB struct
     copied to change one element).
   - `borrow` (read-only access to shared storage, no copy) and `mutate` (exclusive
     in-place modification) replace `get`/`set`.
   - Bonus: enables non-copyable values.
}

### New safe APIs

- new `UniqueBox` and `UniqueArray`for manaing pointers and non-copyable elements
- `Ref` / `MutableRef` — like a `Span` but for one value; storable, passable, returnable, usable in generics.
- Swift Build is now the default build-system backend for Swift Package Manager (consistency between SwiftPM and Xcode builds).

@Comment {
   Cover the new standard-library types that replace unsafe code:
   - `UniqueBox` — manages a pointer to a large value (now a real stdlib type).
   - `UniqueArray` — like `Array` but non-copyable (non-copyable elements, no ref-counting,
     not fixed size).
   - `withTemporaryAllocation` uses `OutputSpan` instead of `UnsafeMutableBufferPointer`.
   - `Continuation` — compile-time checks it's resumed only once (safer than
     `CheckedContinuation`, as efficient as `UnsafeContinuation`).
   - `Ref` / `MutableRef` — like a `Span` but for one value; storable, passable, returnable,
     usable in generics. Make a `MutableRef` with prefix `&`. Example: hoist a dictionary
     lookup out of a loop. Non-escapable, so the access ends when the variable goes out
     of scope.
}

## The future of Swift

@Comment {
   Evan's closing section on open-source developments to get involved with:
   - Swift Build is now the default build-system backend for Swift Package Manager
     (consistency between SwiftPM and Xcode builds).
   - New workgroups: Build & Packaging, Networking, Windows.
   - Android workgroup released the first Swift SDK for Android (Swift 6.3) — share Swift
     code between Android and iOS.
   - Get involved at forums.swift.org.
}
