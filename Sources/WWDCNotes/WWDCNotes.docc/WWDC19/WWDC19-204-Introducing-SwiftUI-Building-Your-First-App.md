# Introducing SwiftUI: Building Your First App

See SwiftUI in action! Watch as engineers from the SwiftUI team build a fully-functioning app from scratch. Understand the philosophy driving this new framework and learn about the benefits of declarative-style programming. Take a look under the hood to understand how SwiftUI operates and learn how SwiftUI and Xcode 11 work together to help you to build great apps, faster.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/204", purpose: link, label: "Watch Video (54 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## Introducing SwiftUI

Command click on an element (via swift code or in the live preview) to ...:

- Embed it in something else
- Change layout (spacing, alignment, padding...)
- Extract it somewhere else (refactoring)

## Modifiers

Lets us customize the way views look or behave.

Use `NavigationView` to wrap a view into a navigational view.

## How Views Work

- They’re `Struct`s that conform to the [`View` protocol][viewProtocolDoc]
- Behind the scenes, SwiftUI aggressively collapses our view hierarchy into an efficient data structure for rendering.
- A `View` defines a piece of UI
- The `View` protocol only has one requirement: a `body` property of type `some View`.
- SwiftUI knows when to fetch a new rendering of a view because, in addition to defining a piece of UI, a view **defines its dependencies**.

## [`@State`][stateDoc]

When SwiftUI sees a view with a `@State` variable, it allocates storage for that variable on the view's behalf. 

In the following memory diagram, the green section is our view memory, and the purple section is memory that SwiftUI is managing for us:

```swift
struct RoomDetail: View {
  let room: Room 
  @State private var zoomed = false 

  var body: some View {
    Image(room.imageName)
      .resizable() 
      .aspectRatio(contentMode: . fit)
  }
}
```

![][memoryImage]

If the body property reads the `@State` property, SwiftUI knows that it’ll need to ask for a new body automatically.

## `ObservableObject`

Has a [`objectWillChange`][willChangeDoc] property:

```swift
import Combine
import SwiftUI

class RoomStore: ObservableObject {
  var rooms: [Room] {
    willSet {
      objectWillChange.send()
    }
  }

  init(rooms: [Room] = []) {
    self.rooms = rooms
  }

  // This declaration is synthesized by conforming to `ObservableObject`,
  // no need to declare it.
  var objectWillChange = ObservableObjectPublisher()
}
```

Later on we can use a [`@ObservedObject`][observedObjectDoc] property wrapper with an `ObservableObject` instance to tell SwiftUI to observe for changes and, potentially, trigger a new rendering of the view if necessary.

## Live View Protips

- Use `Group` in the previews screen to show multiple views.

- Preview multiple category sizes:

```swift
struct ContentView_Previews: PreviewProvider {
  static var previews: some View {
    Group {
      ContentView(store: RoomStore(rooms: testData))

      ContentView(store: RoomStore(rooms: testData))
        .environment(\.sizeCategory, .extraExtraExtraLarge)
    }
  }
}
```

- Preview Light/Dark mode:

```swift
struct ContentView_Previews: PreviewProvider {
  static var previews: some View {
    Group {
      ContentView(store: RoomStore(rooms: testData))

      ContentView(store: RoomStore(rooms: testData))
        .environment(\.colorScheme, .dark)
    }
  }
}
```

- Preview multiple localizations:

```swift
struct ContentView_Previews: PreviewProvider {
  static var previews: some View {
    Group {
      ContentView(store: RoomStore(rooms: testData))

      ContentView(store: RoomStore(rooms: testData))
        .environment(\.layoutDirection, .rightToLeft)
        .environment(\.locale, Locale(idenfifier: "ar")) 
    }
  }
}
```

[viewProtocolDoc]: https://developer.apple.com/documentation/swiftui/view
[stateDoc]: https://developer.apple.com/documentation/swiftui/state
[willChangeDoc]: https://developer.apple.com/documentation/combine/observableobject/3362556-objectwillchange
[observedObjectDoc]: https://developer.apple.com/documentation/swiftui/observedobject

[memoryImage]: WWDC19-204-memory