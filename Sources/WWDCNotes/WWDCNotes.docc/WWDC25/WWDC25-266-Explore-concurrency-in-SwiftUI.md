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

## Presenters
- Daniel Duan, SwiftUI Engineer

## Attraction 1. MainActor Meadows
> Note: how SwiftUI treats the main actor as the compile time and runtime default for app
- SwiftUI view is isolated on the `@MainActor` implied at compile time default

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

## Attraction 2. Concurrency Cliffs
> Note: how SwiftUI helps apps avoid UI jitches by offloading work from main thread  
> At the same time, protects from data-race bugs 

## Attraction 3. Code Camp
> Note: relationship between concurrent code and SwiftUI APIs
