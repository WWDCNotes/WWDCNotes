# Dive into lazy stacks and scrolling with SwiftUI

Discover the inner workings of lazy stacks in SwiftUI. We’ll explore how LazyVStack and LazyHStack estimate sizes, lazily load subviews, and prefetch content to deliver smooth scrolling experiences. We’ll also cover advanced performance optimizations, state management best practices, and tips for precise programmatic scrolling. To get the most out of this session, we recommend basic familiarity with SwiftUI layout using stacks.

@Metadata {
   @TitleHeading("WWDC26")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2026/321", purpose: link, label: "Watch Video (21 min)")

   @Contributors {
      @GitHubUser(mini-min)
   }
}

## Key Takeaways

> Prerequisites:
> This session assumes basic familiarity with SwiftUI layout using stacks.  
> Recommended: <doc:WWDC20-10031-Stacks-Grids-and-Outlines-in-SwiftUI>


## Presenters
- Rens Breur, UI Frameworks Engineer

## `LazyVStack` layout
- Unlike a `VStack`, a `LazyVStack` only evaluates/renders the visible views
  - Lays out top to bottom, stops once the visible rect is filled; off-screen views are removed
- Typically used inside a `ScrollView` with a `ForEach`

@Image(source: "WWDC26-321-lazyvstack-outline.jpeg", alt: "LazyVStack outline")

- More efficient than a `VStack` for many subviews (few subviews → a plain `VStack` is fine)

> Note: Being lazy has a correctness cost — the unloaded parts of the layout must be estimated.

- Height of off-screen subviews is estimated (avg size placed so far × remaining count) → refined while scrolling, so the scroll indicator adjusts
- Width is not lazy → ideal width = the first subview's width (a flexible first view → full screen width)
- Content offset depends on the estimated space above the visible rect → the stack & scroll view coordinate it so views don't jump; scrolling to the top ends at exactly `0`

## `LazyHStack` layout
- Horizontal mirror of `LazyVStack`: width is estimated, height = first subview's height
  - Can't know the tallest view up front (e.g. variable-line subtitles clip) → give views a definite height

### Patterns to avoid
Lazy stacks load on-screen views by their original frame — don't break that:

- `.scrollTransition` that moves a view out of its frame (scale up / rotate) → it vanishes though it should be visible
  - Fine: keep the transform inside the frame (e.g. scale down)

@Row {
   @Column {
      @Image(source: "WWDC26-321-pattern-avoid.jpeg", alt: "Avoid: transform pushes the view out of its frame")
   }
   @Column {
      @Image(source: "WWDC26-321-pattern-fine.jpeg", alt: "Fine: transform stays inside the frame")
   } 
}

- State from the absolute `contentOffset` (`onScrollGeometryChange`) is unstable (offset is estimated)
  - Fine: use relative visibility with `onScrollTargetVisibilityChange`

@Row {
   @Column {
      @Image(source: "WWDC26-321-pattern-avoid-2.jpeg", alt: "Avoid: reacting to absolute content offset")
   }
   @Column {
      @Image(source: "WWDC26-321-pattern-fine-2.jpeg", alt: "Fine: reacting to relative subview visibility")
   }
}

## Subview loading
- A lazy stack loads only the on-screen views and addresses the visible subviews by their index
- A view struct can resolve to one subview or several
  - e.g. a `StepView` whose body returns `StepDiagram` and `StepInstructions` → the lazy stack loads them as two separate subviews
- So the number of subviews a struct produces matters — if it varies, the index-based addressing breaks

### Writing efficient subviews
Write leaf subviews (created many times in a `ForEach`) so the lazy stack can load them cheaply.

- Avoid a dynamic number of subviews — keep each subview's body structure stable
  - If the count can change (e.g. based on `detailLevel`), the lazy stack has to keep earlier views around, since the change would shift indices
  - An unrelated environment value used in the body (e.g. `writingStyle`) also forces body re-evaluations for off-screen views
  - Instead, filter at the data level so the count is known up front

```swift
// Avoid: body structure depends on runtime values
struct StepView: View {
    let step: Step
    @Environment(\.detailLevel) var detailLevel
    var body: some View {
        if step.isVisible(in: detailLevel) { ... }
    }
}

// Prefer: filter the data, so every StepView has the same shape
struct ContentView: View {
    @Query var steps: [Step]
    init(detailLevel: DetailLevel) {
        _steps = Query(filter: #Predicate<Step> { $0.detailLevel >= detailLevel })
    }
}
```

- Optional unwrapping in the body has the same effect — inject a non-optional dependency instead (handle the missing case higher up, e.g. with a `ContentUnavailableView`)

```swift
// Avoid: if let token { ... } → structure varies
@Environment(\.apiToken) var token

// Prefer: a value that's always there
@Environment(NetworkClient.self) var networkClient
```

- Don't do setup in `onAppear` — prefetch work would be thrown away and redone; initialize state in `init`

```swift
struct StepView: View {
    @State var viewModel: StepViewModel
    init(id: Step.ID) {
        _viewModel = State(initialValue: StepViewModel(id: id))
    }
}
```

- Don't keep per-item UI state as local `@State` — it's released when the item scrolls away; lift it to the parent

```swift
// Avoid: isHighlighted resets when StepView is recycled
struct StepView: View {
    @State var isHighlighted = false
}

// Prefer: parent owns the state, child binds to it
struct ContentView: View {
    @State var highlighted: Set<Step.ID> = []
}
struct StepView: View {
    @Binding var highlighted: Set<Step.ID>
}
```
