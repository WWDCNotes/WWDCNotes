# Work with windows in SwiftUI

Learn how to create great single and multi-window apps in visionOS, macOS, and iPadOS. Discover tools that let you programmatically open and close windows, adjust position and size, and even replace one window with another. We’ll also explore design principles for windows that help people use your app within their workflows.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10149", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(feifanzhou)
   }
}

## Key takeaways

* 🪟 Windows are containers for app contents, allowing users to see different pieces of data at the same time, or have multiple instances of the same interface.
* ✨ SwiftUI provides a few environment actions to work with windows.
* ↔️ You can set a default position and size for windows, but users can move or resize windows (within your frame constraints).

## Presenters

Andrew Sawyer, SwiftUI Engineer

## Overview
* Windows are a container for the contents of your app.
* Users can reposition, resize, or close windows using consistent controls.

## Fundamentals
* Windows allow users to use different parts of your app at the same time, or have multiple instances of the same interface.
* Windows are defined using `WindowGroup` in SwiftUI. `WindowGroup`s may have multiple styles, such as `.windowStyle(.volumetric)` for visionOS.
* `WindowGroup`s should have an `id`, which is used to open an instance of that window.
* Environment actions, which are available anywhere in the SwiftUI view hierarchy, can be used to work with windows.
  * `openWindow` is used to open windows by ID.
  * `dismissWindow` is used to close windows.
  * `pushWindow` can be used to open a new window and hide the originating window. When you close the new window, the original window will reappear.
* The title bar and close button are always visible by default, but you can use the `.persistentSystemOverlays(.hidden)` modifier to hide them.


## Placement
* Default window position varies by platform, but it can be customized with the `defaultWindowPlacement` modifier.
* You can return different placements depending on the platform by using the `#if os(…)` directive.
* `defaultWindowPlacement` takes a block that receives a `context` parameter, which includes metrics for the `defaultDisplay` on macOS.

## Sizing
* Window sizing, by default, is automatically determined by the system.
* You can set other sizing as part of the `WindowPlacement` return value of `defaultWindowPlacement`. 
* `WindowLayoutRoot`, one of the parameters to the `defaultWindowPlacement` block, includes a `sizeThatFits(…)` method that allows you to get a size for some given window content.
* You can also use the `defaultSize` modifier on the `WindowGroup` directly.
* Default sizes are ignored if there are other size constraints, like a size provided by the window placement API or when windows are restored.
* A _pushed_ window, by default, has the same size as its originating window.
* Use the `windowResizability(.contentSize)` modifier to constrain window resizability to the allowable range of sizes for the window's content.
  * If the window content has a fixed size, rather than a range of min and max sizes, then the window will not be resizable.
