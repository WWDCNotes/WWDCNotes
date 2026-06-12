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

- 🧹 No more parentheses around optional some/any types
- 🛡️ Task cancellation shields protect cleanup code
- 🔓 New borrow/mutate accessors and Iterable protocol avoid copies
- 🤝 New @c attribute exposes Swift functions to C

## Presenters

* Becca, Swift Team
* Evan, Swift Team

An update on the work done during the development of Swift 6.3 and 6.4, spanning everyday language ergonomics, library updates, interoperability and platform support, performance tuning, and the future of Swift.

## Everyday ergonomics

* No longer need to use parentheses for optional existential and opaque types:

```swift
(some Rocket)?
(any Rocket)?
```

becomes:

```swift
some Rocket?
any Rocket?
```

* Xcode gives warnings when you don't handle an error inside a `Task`
* `weak let` allows for `Sendable` classes
* Mark types as not `Sendable` with `~Sendable` (doesn't stop subclasses from being `Sendable`)
* Swift generates initializers for each ACL available:

```swift
struct Briefing {
    internal var topic: String
    internal var scheduledAt: Date
    private var attendees: [Person] = []
}

// Generated memberwise initializers:
// extension Briefing {
//     private init(topic: String, scheduledAt: Date, attendees: [Person] = []) {
//          self.topic = topic
//          self.scheduledAt = scheduledAt
//          self.attendees = attendees
//     }
//
//     internal init(topic: String, scheduledAt: Date) {
//          self.topic = topic
//          self.scheduledAt = scheduledAt
//          self.attendees = []
//     }
// }
```

* New `@available(anyAppleOS ...)` attribute and `#if os(anyAppleOS)` for platform availability across all of a year's releases — only supported for OSes 26 and newer:

```swift
extension Mission {
    @available(macOS 27, iOS 27, watchOS 27, tvOS 27, visionOS 27, *)
    func showStatus() { ... }

    @available(macOS 27, iOS 27, watchOS 27, visionOS 27, *)
    @available(tvOS, unavailable)
    func launch() { ... }

    #if os(macOS) || os(iOS) || os(watchOS) || os(tvOS) || os(visionOS)
    func makeLiveActivityWidget() -> some Widget { ... }
    #endif
}
```

becomes:

```swift
extension Mission {
    @available(anyAppleOS 27, *)
    func showStatus() { ... }

    @available(anyAppleOS 27, *)
    @available(tvOS, unavailable)
    func launch() { ... }

    #if os(anyAppleOS)
    func makeLiveActivityWidget() -> some Widget { ... }
    #endif
}
```

* `@diagnose` macro for enabling, ignoring, and escalating warnings:

```swift
@diagnose(DeprecatedDeclaration, as: ignored, reason: "Flying with surplus hardware")
func makeApolloSoyuzMission() -> Mission {
    CrewedMission(
        rocket: makeSaturnIRocket(),
        payload: makeApolloCSM(),
        crew: [.daniellePoole, .nathanMorrison]
    )
}

@diagnose(StrictMemorySafety, as: warning)
func uplinkCommand(from receiver: inout Receiver, to computer: inout Computer) {
    let commandSize = receiver.receiveInt()
    receiver.withReceivedData(byteCount: commandSize) {
        computer.receiveUplinkedCommand($0)
    }
}

@diagnose(ErrorInFutureSwiftVersion, as: error)
func fetchPosition() -> (x: Double, y: Double, z: Double) {
    return self.rotation
}
```

* `::` for module selectors:

```swift
import Rocket
import GiftShopToys

let rocket1 = SaturnV()            // could mean `Rocket::SaturnV` or `GiftShopToys::SaturnV`
let rocket2 = Rocket.SaturnV()     // prefers `Rocket::Rocket.SaturnV`
let rocket3 = Rocket::SaturnV()    // correctly finds `Rocket::SaturnV`
```

## Library updates

### Standard library

* `withTaskCancellationShield` — `Task.isCancelled` returns `false` inside the shield
* `mapKeyedValues` — passes both key and value, instead of just the value like `mapValues`:

```swift
// Map values with keys

func makeCalendarDisplayNames(for missions: [Mission: LaunchWindow]) -> [Mission: String] {
    missions.mapKeyedValues { mission, launchWindow in
        makeDisplayName(for: mission, in: launchWindow)
    }
}
```

* `FilePath` for cross-platform filepath handling

### Swift Testing

* Allows for `Issue.record` severity
* `Test.cancel` for cancelling tests — especially for parameterized tests
* `swift test` with `--maximum-repetitions` and `--repeat-unit`

### Subprocess 1.0

* Simplifies running processes for all operating systems and uses modern Swift 6 paradigms

### Foundation

* New `ProgressManager` using structured concurrency
* Faster `Data` operations
* Reduced bridging between Swift and Objective-C types

## Beyond Xcode: interoperability & platforms

### Exposing Swift to C

* New `@c` attribute for exposing Swift to C

### Swift on more platforms

* Swift supports calling async and throwing Swift functions from Java
* Official Swift SDK for Android available on swift.org

### Embedded Swift

* Supports existential types and untyped throws

## Performance tuning

### Controlling the optimizer

* More granular control over inlining optimization with `@inline(never)` and `@inline(always)`
* New `@specialized` attribute to let external libraries know about specific concrete type implementations

### Ownership system

* `Equatable`/`Comparable`/`Hashable` are available on noncopyable types; and `Equatable`/`Comparable` are available on non-escapable types
* Associated types can now be non-copyable or non-escapable

### The Iterable protocol

* New `Iterable` protocol allows for _borrowing_ and prohibits _mutating_

### borrow / mutate accessors

* New `borrow` (read-only access to shared storage, no copy) and `mutate` (exclusive in-place modification) accessors replace `get`/`set`

### New safe APIs

* New `UniqueBox` and `UniqueArray` for managing pointers and non-copyable elements
* `Ref` / `MutableRef` — like a `Span` but for one value; storable, passable, returnable, usable in generics

## The future of Swift

* Swift Build is now the default build-system backend for Swift Package Manager (consistency between SwiftPM and Xcode builds)
