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

> Note: Being lazy has a correctness cost — the unloaded parts of the layout must be *estimated*.

- **Height** of off-screen subviews is estimated (avg size placed so far × remaining count) → refined while scrolling, so the scroll indicator adjusts
- **Width** is *not* lazy → ideal width = the first subview's width (a flexible first view → full screen width)
- **Content offset** depends on the estimated space above the visible rect → the stack & scroll view coordinate it so views don't jump; scrolling to the top ends at exactly `0`

## `LazyHStack` layout
- Horizontal mirror of `LazyVStack`: **width** is estimated, **height = first subview's height**
  - Can't know the tallest view up front (e.g. variable-line subtitles clip) → give views a definite height

### Patterns to avoid
Lazy stacks load on-screen views by their **original frame** — don't break that:

- `.scrollTransition` that moves a view **out of its frame** (scale up / rotate) → it vanishes though it should be visible
  - Fine: keep the transform **inside** the frame (e.g. scale down)

@Row {
   @Column {
      @Image(source: "WWDC26-321-pattern-avoid.jpeg", alt: "Avoid: transform pushes the view out of its frame")
   }
   @Column {
      @Image(source: "WWDC26-321-pattern-fine.jpeg", alt: "Fine: transform stays inside the frame")
   }
}

- State from the **absolute `contentOffset`** (`onScrollGeometryChange`) is unstable (offset is estimated)
  - Fine: use **relative visibility** with `onScrollTargetVisibilityChange`

@Row {
   @Column {
      @Image(source: "WWDC26-321-pattern-avoid-2.jpeg", alt: "Avoid: reacting to absolute content offset")
   }
   @Column {
      @Image(source: "WWDC26-321-pattern-fine-2.jpeg", alt: "Fine: reacting to relative subview visibility")
   }
}

## Subview loading
