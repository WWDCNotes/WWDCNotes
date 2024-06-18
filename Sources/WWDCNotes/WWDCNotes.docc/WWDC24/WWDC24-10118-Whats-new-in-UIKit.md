# What’s new in UIKit

Explore everything new in UIKit, including tab and document launch experiences, transitions, and text and input changes. We’ll also discuss better-than-ever interoperability between UIKit and SwiftUI animations and gestures, as well as general improvements throughout UIKit.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10118", purpose: link, label: "Watch Video (21 min)")

   @Contributors {
      @GitHubUser(philptr)
   }
}

# Key features

## Document launch experience
- The launch experience for document-based apps has been redesigned
- Get full control over the launch view's design
- To learn more, watch [Evolve your document launch experience](https://developer.apple.com/wwdc24/10132)

@Image(source: "document-launch-experience", alt: "The launch view for document-based apps has a new design")

## Tabs and sidebars
- on iPadOS, tab bars have visual updates and have more customization features
- The new compact look reduces empty space
- Combined tab bar and sidebar experience
    - See new `UITabBarController` APIs
- The sidebar and tab bar can be personalized by the user using drag and drop
    - See new `UITab` and `UITabGroup` APIs
- Native experience on both Mac Catalyst and visionOS
- Watch [Elevate your tab and sidebar experience in iPadOS](https://developer.apple.com/wwdc24/10147)

## Fluid transitions
- On iOS 18, there is a new zoom transition
- It works with navigation and presentations
- The transition is fully reversible and interruptible

# SwiftUI interoperability

## Animations
- You can now use SwiftUI animations to animate UIKit views

```swift
UIView.animate(.spring(duration: 0.5)) { ... }
```

- Includes SwiftUI custom animations
- Can be used to animate views with gestures
    - To do this, animate both when the gesture changes and when it ends

```swift
switch gesture.state {
case .changed:
    UIView.animate(.interactiveSpring) { ... }
case .ended:
    UIView.animate(.spring) { ... }
}
```

## Gesture recognizers
- The gesture systems have been unified across SwiftUI and UIKit
- Support for coordination between gestures across both frameworks

### Refer to SwiftUI gestures in UIKit
- Specify a name when setting up your SwiftUI gesture

```swift
SomeView()
    .gesture(doubleTap, name: "SwiftUIDoubleTap")
```

- In UIKit, check the name associated with a `UIGestureRecognizer`
- This can, for example, be used to set up failure cases for SwiftUI animations in UIKit

### Add UIKit gesture recognizers to SwiftUI
- Adopt new protocol: `UIGestureRecognizerRepresentable`
- See [What's new in SwiftUI](https://developer.apple.com/wwdc24/10144) for adoption advice

# Enhancements

## Automatic trait tracking
- It's now easier to use traits and handle changes
- View and view controller update methods now track which traits are used
- When any of the used traits change value, UIKit automatically performs an associated invalidation
- For example, if `layoutSubviews()` implementation accesses `horizontalSizeClass` trait, there is no need to call `setNeedsLayout` manually – it will be called by the automatic trait tracking system for you

## List improvements
- Updating cells is now easier
- All views in `UICollectionView`s and `UITableView`s now have the `UITraitCollection.listEnvironment` trait set.
- Use the trait to style your cells
- With this, you don't need to know the style of the list at the time of configuration of a cell

## Update link
- Similar to `CADisplayLink`, but has more features, like view tracking, as well as the ability to use low latency mode and better performance

```swift
let updateLink = UIUpdateLink(
    view: view,
    actionTarget: self,
    selector: #selector(update)
)
```

- Activates automatically when the associated view is added to a visible window, and invalidates when removed

## Symbol animations
- SF Symbols and UIKit have 3 new animation presets: `.wiggle`, `.breathe`, `.rotate`

@Image(source: "new-symbol-effects", alt: "3 new animation presets in iOS 18")

- New periodic behavior allows to repeat animations a set number of times, or continuously
- `.replace` now seamlessly animates badges and slashes using Magic replace, and automatically falls back to existing behavior if needed
- Watch [What's new in SF Symbols 6](https://developer.apple.com/wwdc24/10188) and [Animate symbols in your app](https://developer.apple.com/wwdc23/10258)

## Sensory feedback
- Sensory feedback is supported on iPad with Apple Pencil Pro and Magic Keyboard
    - `UIFeedbackGenerator` supports these interactions
    - New: `UICanvasFeedbackGenerator`, which is perfect for drawing and canvases
- You should now pass the location within the view where the feedback has occurred
    - Provide the context to `UICanvasFeedbackGenerator` using the `alignmentOccurred(at:)` method

## Text improvements
- New formatting panel
- `UITextView`s that support rich text automatically support the new panel via a new Edit menu action
    - Set `allowsEditingTextAttributes` to `true`
- Developers can customize the formatting panel and disable features
- Text highlighting is supported by default by `UITextView` subclasses that support rich text
    - Controlled by attributed string attributes (`.textHighlight` and `.textHighlightColorScheme`)

## Writing Tools
- Text views get the new Writing Tools UI by default
- There are new APIs to customize the behavior

## Menu actions
- With iOS 18, menu actions are more useful for iPhone only apps
- `UICommand`, `UIKeyCommand`, and `UIAction` can be invoked by the system for automation

## Apple Pencil
- `PKToolPicker` now lets you define the available tools
- New APIs for building custom tools into the tool picker
