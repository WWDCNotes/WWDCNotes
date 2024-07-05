# Enhance your UI animations and transitions

Explore how to adopt the zoom transition in navigation and presentations to increase the sense of continuity in your app, and learn how to animate UIKit views with SwiftUI animations to make it easier to build animations that feel continuous.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10145", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(nikolaikhud)
   }
}

## Key takeaways

* New fluid zoom transitions are available
* These zoom transitions are continuously interactive
* SwiftUI Animation type now available in UIKit and AppKit

## Presenter

Russell Ladd, UI Frameworks

## Zoom transitions

In iOS 18, there is a new zoom transition.
With this new transition the cell you tap morphs into the incoming view.
The transition is continuously interactive — you can grab and drag the transitioning view around during the transition.

In parts of your app where you transition from a large cell, the zoom transition can increase the sense of continuity by keeping the same elements on screen across the transition.

### SwiftUI Example

Basic transition:
```swift
NavigationLink {
    BraceletEditor(bracelet)
} label: {
    BraceletPreview(bracelet)
}
```

New zoom transition:
```swift
NavigationLink {
    BraceletEditor(bracelet)
        .navigationTransitionStyle(
            .zoom(
                sourceID: bracelet.id,
                in: braceletList
            )
        )
} label: {
    BraceletPreview(bracelet)
}
.matchedTransitionSource(
    id: bracelet.id,
    in: braceletList
)
```

### UIKit Example

Basic transition:
```swift
func showEditor(for bracelet: Bracelet) {
    let braceletEditor = BraceletEditor(bracelet)
    navigationController?.push(braceletEditor, animated: true)
}
```

New zoom transition:
```swift
func showEditor(for bracelet: Bracelet) {
    let braceletEditor = BraceletEditor(bracelet)
    braceletEditor.preferredTransition = .zoom { _ in
        cell(for: bracelet)
    }
    navigationController?.push(braceletEditor, animated: true)
}
```

These APIs work with the `fullScreenCover` and sheet presentation APIs in both SwiftUI and UIKit.  

### UIKit ViewController lifecycle

In UIKit these new fluid transitions work with ViewController lifecycle and appearance callbacks a bit differently than before.

Let’s consider that we start a push of a view and then start a pop in the middle of the push (by tapping the back button or with a back swipe). In this case the push is not cancelled, instead the view goes straight to the `Appeared` state, and then in the same turn of the run loop, the pop transition starts, moving to the `Disappeared` state, and from here you can treat it as a normal pop transition.

### UIKit tips on transition handling
* Be ready for a new transition to start anytime. Don’t try to “handle” being in transition differently from not being in a transition.
* Minimize transition state. Keep temporary transition state to a minimum.
* If needed, reset all transitions state by viewDidAppear and viewDidDisappear. These are guaranteed to be called at the end of the transition.

## SwiftUI Animation

In iOS 18 you can use a SwiftUI Animation type to animate UIKit and AppKit Views. This lets you use the full suite of SwiftUI Animation types, including SwiftUI CustomAnimations, to animate UIKit views.

UIKit Example:
```swift
UIView.animate(springDuration: 0.5) {
    bead.center = endOfBracelet
}
```

SwiftUI Example:
```swift
withAnimation(.spring(duration: 0.5)) {
    beads.append(Bead())
}
```

Using SwiftUI Animation type in UIKit:
```swift
UIView.animate(.spring(duration: 0.5)) {
    bead.center = endOfBracelet
}
```

If your code works with CALayers, there are a couple of implications to consider when using this new API: UIKit generates a CAAnimation, while SwiftUI does not.

## Animating representables

In iOS 18 you can animate UIKit and AppKit views in the context of representable types, like `UIViewRepresentable`. To do this you should:  
* add `.animated()` modifier to the binding
* add the new `.animate` method to the context

It grabs whatever SwiftUI animation is present on the Transaction, and bridges it to the `UIView.animate` method.

```swift
struct BeadBoxWrapper: UIViewRepresentable {
    @Binding var isOpen: Bool

    func updateUIView(_ box: BeadBox, context: Context) {
        contex.animate {
            box.lid.center.y = isOpen ? -100 : 100
        }
    }
}

@State private var isBeadBoxOpen = false
var body: some View {
    BeadBoxWrapper($isBeadBoxOpen.animated())
        .onTapGesture {
            isBeadBoxOpen.toggle()
        }
}
```

* If the current transaction isn't animated, the animation and completion are called immediately inline, so this code works whether the update is animated or not.
* A single animation running across SwiftUI Views and UIViews runs perfectly in sync.

## Gesture-driven animations
You can also run the same API in response to continuous gestures.
Here is a UIKit code that handles dragging an object in response to a pan gesture:

```swift
switch gesture.state {
case .changed:
    bead.center = gesture.translation
case .ended:
    // Get velocity from gesture
    // Convert to unit velocity
    UIView.animate(...) {
        bead.center = endOfBracelet
    }
}
```

In this case you have to compute the gesture's velocity and convert it to the unit's velocity. But SwiftUI can handle it by itself and now we can pass SwiftUI animations to the new `UIView.animate` method:

```swift
switch gesture.state {
case .changed:
    UIView.animate(.interactiveSpring) {
        bead.center = gesture.translation
    }
case .ended:
    UIView.animate(.spring) {
        bead.center = endOfBracelet
    }
}
```
