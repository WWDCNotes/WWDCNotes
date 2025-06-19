# What’s new in SwiftUI

Learn what’s new in SwiftUI to build great apps for any Apple platform. We’ll explore how to give your app a brand new look and feel with Liquid Glass. Discover how to boost performance with framework enhancements and new instruments, and integrate advanced capabilities like web content and rich text editing. We’ll also show you how SwiftUI is expanding to more places, including laying out views in three dimensions.

@Metadata {
   @TitleHeading("WWDC25")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2025/256", purpose: link, label: "Watch Video (25 min)")

   @Contributors {
      @GitHubUser(philptr)
   }
}

## Key Takeaways

- SwiftUI adopts the new look and feel of the OS out of the box, but provides a variety of tools to customize the behavior.
- Better interoperability with other frameworks across the board (like AppKit, RealityKit, and WebKit) provides additional flexibility and optionality for advanced use cases and incremental adoption.
- New views and functionality open SwiftUI to new use cases that previously required bridging, like rich text editing and web views.

## Adopt the new design

### Toolbars

- New [`ToolbarSpacer`](https://developer.apple.com/documentation/swiftui/toolbarspacer) API to separate buttons.
- `borderedProminent` appearance for toolbar items supports tinting via the `tint` modifier.

### Bottom aligned search fields on iOS

- Use `searchable` on the outside of the `NavigationSplitView` to get the bottom aligned search automatically.
- On iPad, the new search appearance is on the top trailing corner.
- For tab based apps, you can get the morphing search tab by using [the `role` initializer](https://developer.apple.com/documentation/swiftui/tab/init(role:content:)) on your `Tab`: `Tab(role: .search) { … }`

### Custom views

- Custom views can adopt the new look too.
- [`glassEffect`](https://developer.apple.com/documentation/swiftui/view/glasseffect(_:in:isenabled:)) modifier can be applied to reflect the content behind your custom view.

### Menu bar on iPadOS

- Using the [`commands`](https://developer.apple.com/documentation/swiftui/scene/commands(content:)) modifier now yields the same result across iPad and Mac.

### Adopt fluid resizing

- On **iPadOS**, migrate off APIs that fix the screen to full size.
    - Remove `UIRequiresFullScreen`. It is now deprecated.
    - Watch <doc:WWDC25-208-Elevate-the-design-of-your-iPad-app> to learn more.
- On **macOS**, for window resizes caused by content size changes, SwiftUI now synchronizes the animation between content and window sizes.
    - Use the new [`windowResizeAnchor`](https://developer.apple.com/documentation/swiftui/view/windowresizeanchor(_:)) API to customize where the animation originates.
    - Great for animating tab switching in the settings window on macOS.

To learn more about adopting the new design, watch <doc:WWDC25-323-Build-a-SwiftUI-app-with-the-new-design>.

## SwiftUI performance

Key performance improvement areas:
- Lists
    - Improvements to large lists and incremental updates.
- Scrolling
    - Improved scheduling for updates on iOS and macOS.
- Debugging and profiling

New SwiftUI Performance instrument in Xcode
- Watch <doc:WWDC25-306-Optimize-SwiftUI-performance-with-Instruments>.

@Image(source: "WWDC25-256-SwiftUI-Xcode-Instruments")

## Animatable macro

New `@Animatable` macro allows you to delete manual custom `animatableData` property declarations.

You can exclude properties that shouldn’t be animatable as `@AnimatableIgnored` within your `@Animatable` annotated type.

```swift
@Animatable
struct LoadingArc: Shape {
    var center: CGPoint
    var radius: CGFloat
    var startAngle: Angle
    var endAngle: Angle
    @AnimatableIgnored var drawPathClockwise: Bool
}
```

## SwiftUI on visionOS

More volumetric and spatial layout options.
- To learn more about new layout techniques like the [`spatialOverlay`](https://developer.apple.com/documentation/swiftui/view/spatialoverlay(alignment:content:)) modifier, watch <doc:WWDC25-273-Meet-SwiftUI-spatial-layout>.
- New `manipulable` modifier allows users to pick up objects.
- To learn more about volumes and scenes, watch <doc:WWDC25-290-Set-the-scene-with-SwiftUI-in-visionOS>.

## SwiftUI across the system

### Scene bridging

- Allows you to request scenes from AppKit and UIKit contexts.
- Mac apps can now render remote immersive spaces using a new scene.
    - Uses `CompositorServices` under the hood.
    - To learn more, watch <doc:WWDC25-294-Whats-new-in-Metal-rendering-for-immersive-apps>.
- A new [`AssistiveAccess`](https://developer.apple.com/documentation/swiftui/assistiveaccess) scene type allows your app to take advantage of the special mode for users with cognitive disabilities.
    - To learn more, watch <doc:WWDC25-238-Customize-your-app-for-Assistive-Access>.

### Enhancements to AppKit interoperability

- You can show sheets in `NSWindow`s with SwiftUI `View`s in them.
- AppKit gestures can be bridged to SwiftUI using [`NSGestureRecognizerRepresentable`](https://developer.apple.com/documentation/swiftui/nsgesturerecognizerrepresentable).
- `NSHostingView` can be used in Interface Builder.

### Improvements to RealityKit interoperability

- RealityKit entities now conform to `Observable`.
    - Makes it trivial to observe changes in SwiftUI views.
- An improved coordinate conversion API.
- Enhanced support for presentations right from RealityKit.
    - For instance, you can present SwiftUI popovers directly from a RealityKit `Entity` using the new `PresentationComponent` API.
    - To learn more, watch <doc:WWDC25-274-Better-together-SwiftUI-and-RealityKit>.

### Platform adoption

- Custom Control Center [Controls](https://developer.apple.com/documentation/swiftui/controlwidget) are coming to macOS and watchOS.
- Widgets are coming to visionOS and CarPlay.
    - To learn about additions to widgets, watch <doc:WWDC25-278-Whats-new-in-widgets>.

## New & updated SwiftUI views

### WebView

- New SwiftUI view for showing web content.
- Powered by WebKit.
- Can show `URL`s or `WebPage`s.
- `WebPage` is a new `Observable` type that enables rich interaction with the web.
- To learn more about these APIs and the better WebKit interoperability, watch <doc:WWDC25-231-Meet-WebKit-for-SwiftUI>.

### 3D Charts

- Declared using `Chart3D`
- Could use `z` axis specific modifiers like `chartZScale` to specify e.g. scales
- To learn more, watch <doc:WWDC25-313-Bring-Swift-Charts-to-the-third-dimension>.

@Image(source: "WWDC25-256-3D-Charts")

### Drag & Drop

- New variant of the `draggable` modifier [accepts a `containerItemID`](https://developer.apple.com/documentation/swiftui/view/draggable(containeritemid:)).
- [`dragContainer`](https://developer.apple.com/documentation/swiftui/view/dragcontainer(for:id:in:_:)) modifier makes the target view a container for drag items.
- SwiftUI requests drag items lazily when a drop occurs.
- Customize the drag behavior by adopting the new [`dragConfiguration`](https://developer.apple.com/documentation/swiftui/view/dragconfiguration(_:)) modifier.
- Observe drag event updates, use the new [`onDragSessionUpdated`](https://developer.apple.com/documentation/swiftui/view/ondragsessionupdated(_:)) modifier.
- To customize the drag preview for multiple items, you can specify the formation of the items using the [`dragPreviewsFormation`](https://developer.apple.com/documentation/swiftui/view/dragpreviewsformation(_:)) modifier.

### Rich text editing

- `TextEditor` now accepts an `AttributedString`.
- Introduces abilities to add paragraph styles, transform attributes, and constrain text inputs.
- Watch <doc:WWDC25-280-Codealong-Cook-up-a-rich-text-experience-in-SwiftUI-with-AttributedString> and <doc:WWDC25-225-Codealong-Explore-localization-with-Xcode>.
