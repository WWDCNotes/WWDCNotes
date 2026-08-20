# Explore concurrency in SwiftUI

Discover how SwiftUI leverages Swift concurrency to build safe and responsive apps. Explore how SwiftUI uses the main actor by default and offloads work to other actors. Learn how to interpret concurrency annotations and manage async tasks with SwiftUI’s event loop for smooth animations and UI updates. You’ll leave knowing how to avoid data races and write code fearlessly.

@Metadata {
   @TitleHeading("WWDC25")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2025/266", purpose: link, label: "Watch Video (24 min)")

   @Contributors {
      @GitHubUser(mini-min)
   }
}

## Key Takeaways
- MainActor is SwiftUI's default, so views stay isolated
- Heavy work runs off the main thread, with data races flagged
- Keep callbacks synchronous, bridging UI and async work with state

## Presenters
- Daniel Duan, SwiftUI Engineer

## Attraction 1. MainActor Meadows
> Note: how SwiftUI treats the main actor as the compile-time and runtime default for apps.

- SwiftUI's `View` protocol is isolated on the `@MainActor`, so any conforming type is inferred to be `@MainActor` too
- The annotation is implied, not written by hand
  - Every member of a `@MainActor`-isolated type is implicitly isolated as well — `body`, `@State` properties, and so on → accessing them is always safe, with no extra annotations needed
  - A data model created inside the view doesn't need any `@MainActor` annotation either
- `@MainActor` is SwiftUI's compile-time default → most of the time you just build features without thinking about concurrency, and it's safe automatically

```swift
// SwiftUI
@MainActor
public protocol View {
    associatedtype Body: View
    @ViewBuilder var body: Body { get }
}

// @MainActor (implied)
struct ColorExtractorView: View {
    // @MainActor (implied)
    @State private var model = ColorExtractor( ... )

    // @MainActor (implied)
    var body: some View { ... }
}
```

- A `Task` started inside the body inherits the `@MainActor` isolation → its closure runs on the main thread by default, which is convenient for updating the UI right away

```swift
// @MainActor (implied)
var body: some View {
    ImageView( ... )
    SchemeContentView(colorScheme: model.scheme, ... )
        .onTapGesture {
            Task { // @MainActor (implied)
                await model.extractColorScheme()
            }
        }
    Slider(value: $model.colorCount, ... )
}
```

- These annotations aren't just a compile-time convenience 
  - Reflect real runtime requirements inherited from UIKit and AppKit, which are exclusively `@MainActor` isolated
- `UIViewRepresentable` refines `View`, so conforming types are `@MainActor` too; `makeUIView` can safely create UIKit objects like `UILabel()` without any annotation

> Important: SwiftUI's concurrency annotations express its runtime semantics, not merely compile-time hints

```swift
// AppKit and UIKit require @MainActor
// Example: UIViewRepresentable

// @MainActor (implied)
struct FancyUILabel: UIViewRepresentable {
    func makeUIView(context: Context) -> UILabel {
        let label = UILabel()
        // customize the label...
        return label
    }
}
```

## Attraction 2. Concurrency Cliffs
> Note: how SwiftUI helps apps avoid UI hitches by offloading work from the main thread, while protecting against data-race bugs.

- When the main thread has too much work, the app can drop frames or hitch → use tasks and structured concurrency to offload compute from the main thread
  - Related Session: <doc:WWDC25-270-Codealong-Elevate-an-app-with-Swift-concurrency>
- Built-in animations already run on a background thread to calculate their intermediary states
  - Related Session: <doc:WWDC23-10156-Explore-SwiftUI-animation>

### SwiftUI runs on your behalf
- SwiftUI is declarative: a struct conforming to `View` is not an object pinned to a fixed location in memory (unlike `UIView`)
- At runtime SwiftUI builds a separate representation of the view → this opens the door to many optimizations
- A key one is evaluating parts of that representation on a background thread — reserved for cases that do heavy compute on your behalf, usually high-frequency geometry math
- SwiftUI can even run your own code off the main thread. Two common examples:

- `Shape`: the `path(in:)` requirement can be called from a background thread. A custom `WedgeShape` in the color wheel has its `path` recomputed off the main thread while it animates

@Image(source: "WWDC25-266-wedge-shape", alt: "A custom wedge shape whose path method is called from a background thread")

- Closure arguments: `visualEffect` takes a closure describing effects on the subject view. Because effects can be expensive to render, SwiftUI may call this closure from a background thread (here it blurs the text as `pulse` flips)

@Image(source: "WWDC25-266-visual-effect", alt: "A visualEffect closure that SwiftUI may call from a background thread")

- `Layout`'s requirement methods and the first closure of `onGeometryChange` may likewise run off the main thread
- SwiftUI expresses this runtime behavior (semantics) to the compiler — and to you — with `@Sendable`; once again, the annotations reflect runtime semantics

```swift
// SwiftUI may call parts of these from a background thread

public nonisolated protocol Shape: View, Sendable, Animatable { ... }

public protocol Layout: Animatable, Sendable { ... }

extension View {
    public nonisolated func visualEffect(
        _ effect: @escaping @Sendable (
            EmptyVisualEffect, GeometryProxy
        ) -> some VisualEffect
    ) -> some View

    public nonisolated func onGeometryChange<T>(
        of value: @escaping @Sendable (GeometryProxy) -> T,
        do action: @escaping (T) -> Void
    ) -> some View
}
```

### Race condition
- `@Sendable` is a reminder about potential data races when sharing data from the `@MainActor` — Swift reliably finds these and flags them with compiler errors
- Best strategy: don't share data between concurrent tasks at all
- When an API requires a sendable function, the framework passes most of the values you need as arguments → you can do sophisticated work without touching any external variables

@Image(source: "WWDC25-266-without-touching-external-variables", alt: "A sendable layout function that only uses the arguments SwiftUI passes in")

- If you do need a variable external to a sendable function, two things must happen:
  1. `self` must be sent across the boundary into the background region → requires `self` to be `Sendable` (a `View` is, because it's `@MainActor`-protected)
  2. the property you read must be `nonisolated` (not isolated to any actor)
- A `@MainActor`-isolated property like `pulse` fails rule 2 → fix it by copying the value in the closure's capture list, so you send a `Bool` copy instead of `self`

```swift
struct SchemeContentView: View { // Sendable (implied)
    let isLoading: Bool

    // @MainActor (implied)
    @State private var pulse: Bool = false

    var body: some View {
        Text(isLoading ? "Please wait" : "Extract")
            // Before: references self.pulse directly inside a @Sendable closure
            .visualEffect { content, _ in
                content.blur(radius: self.pulse ? 2 : 0) // Main actor-isolated property cannot be referenced from a Sendable closure
            }

            // After: capture pulse in the capture list so its value is copied
            .visualEffect { [pulse] content, _ in
                content.blur(radius: pulse ? 2 : 0)
            }
    }
}
```

## Attraction 3. Code Camp
> Note: the relationship between concurrent code and SwiftUI APIs.

- Most SwiftUI APIs (e.g. a Button's action callback) are synchronous → to call async code you first switch to an async context with a `Task`
- Why doesn't `Button` accept an async closure? 
  - Synchronous updates matter for a good user experience — 
  - before kicking off a long-running task, you want to update the UI (like a loading state) synchronously, especially to drive time-sensitive animations
- Pattern: synchronously flip a loading state with `withAnimation`, start the `Task`, then reverse the state synchronously once it finishes

```swift
.onTapGesture {
    guard !model.isExtracting else { return }
    withAnimation { model.isExtracting = true }       // synchronous: show loading
    Task {
        await model.extractColorScheme()              // async: the heavy work
        withAnimation { model.isExtracting = false }  // synchronous: hide loading
    }
}
```

- Async functions need extra care with animations. 
  → `await` creates a suspension point: the compiler splits the function in two, and the runtime may pause between the halves for an arbitrary amount of time
- If a state mutation sits after an `await`, it may resume past the device's screen-refresh deadline 
  → the animation looks laggy and out of step, so mutating inside an async function may not achieve your goal

@Image(source: "WWDC25-266-animations-looks-laggy", alt: "A state mutation after an await can miss the frame deadline and look laggy")

- SwiftUI provides synchronous callbacks by default
  - updating UI inside a synchronous closure is easy to get right
  - synchronous code is a great starting and ending point for most apps

### Organizing concurrent code
- If your app does a lot of concurrent work, find the boundaries between UI code and non-UI code → best to separate the async logic from the view logic
- Use a piece of state as a bridge that decouples the UI from the async code: the view starts an async task, and when the work finishes it synchronously mutates the state so the UI reacts
- Keep the code inside the async context simple: its job is just to inform the model about a UI event
- Bonus: because the async code is now independent of the UI, it's much easier to write unit tests for it (ideally without importing SwiftUI)
