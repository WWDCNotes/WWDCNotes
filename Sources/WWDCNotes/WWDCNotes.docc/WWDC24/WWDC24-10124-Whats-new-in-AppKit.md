# What’s new in AppKit

Discover the latest advances in Mac app development. Get an overview of the new features in macOS Sequoia, and how to adopt them in your app. Explore new ways to integrate your existing code with SwiftUI. Learn about the improvements made to numerous AppKit controls, like toolbars, menus, text input, and more.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10124", purpose: link, label: "Watch Video (19 min)")

   @Contributors {
      @GitHubUser(philptr)
   }
}

# New macOS Features

## Writing Tools
- Apps get the features automatically, but can customize behavior using new APIs
- Watch [Get started with Writing Tools](https://developer.apple.com/wwdc24/10168)

## Genmoji
- Genmoji are images, so some adoption may be needed
- Watch [Bring expression to your app with Genmoji](https://developer.apple.com/wwdc24/10220)

## Image Playground
- Instantiate `ImagePlaygroundViewController` and assign its delegate
- Can customize the behavior by specifying initial `concepts` and `sourceImage`
- Users can still choose different images and concepts as part of the experience
- Get the generated image from the app's sandboxed temporary directory
- Consider adding Image Playground as an image source

## Window Tiling
- Makes it *very* fast to move windows into some common arrangements
- Holding `Option` while dragging shows a preview of the window immediately
- Available in the Window > Move & Resize menu, and accessible using keyboard shortcuts
- Can resize windows at the same time while they are side by side
- Can select pre-built window arrangements from the Window menu

@Image(source: "window-tiling.png", alt: "Tiled windows can be resized simultaneously.")

### Making apps work best with Window Tiling
- Consider your window's minimum and maximum sizes
- Use the `resizeIncrements` property
- When opening windows, consider the new `cascadingReferenceFrame`
    - This gets you an existing window's *untiled* frame
    - Cascade newly-opened windows relative to that frame

# More SwiftUI integrations

## Build menus with SwiftUI
- New `NSMenu` subclass: `NSHostingMenu`
- Create the menu definition using SwiftUI, then instantiate `NSHostingMenu` using the SwiftUI view
- Use in any AppKit context accepting `NSMenu`

## SwiftUI animations
- You can now use SwiftUI animations to animate AppKit views
- Use `NSAnimationContext`, passing in the SwiftUI animation type
- Interruptible by default
- For more info, watch [Enhance your UI animations and transitions](https://developer.apple.com/wwdc24/10145)

# API refinements

## Context menus
- Use keyboard to open any context menus
- `Control-Return` by default
- Customize where the menu appears by implementing `NSViewContentSelectionInfo` protocol

## Text and SF Symbols

### Text highlighting
- Text highlighting is supported by default by `NSTextView` subclasses that support rich text
- Controlled by attributed string attributes (`.textHighlight` and `.textHighlightColorScheme`)

### SF Symbols 6
- New effects: `wiggle`, `rotate`, `breathe`
- Repeating animations
- Dynamically replace the symbols badge and slash
- Check out What's new in SF Symbols 6 and Animate symbols in your app

## Saving documents
- Standard file format picker for `NSSavePanel`
- Set `showsContentTypes` property on `NSSavePanel` to true
- To provide custom display names for formats, implement a new delegate method

## Customizable toolbars

### Cursors
- System cursors are now available in SDK
- Access resize cursors using `frameResize(position:directions:)`
- Use `zoomIn` and `zoomOut` to indicate magnification
- Prefer using standard system cursors
- System cursors automatically support accessibility sizes and colors

### NSToolbar
- Use `allowsDisplayModeCustomization` to let the user customize display modes of your toolbars, even if they are not customizable
    - Make sure that your toolbar has an identifier
    - Check that all your toolbar items have good labels
- Conditionally show and hide items using the new `isHidden` property
    - Useful for situationally meaningful changes
    - Hidden items still appear in the customization panel

### Text entry suggestions
- Works on any `NSTextField`
- Get started by setting `suggestionsDelegate` property on `NSTextField`
- Can provide results synchronously or asynchronously
- Design tips
    - Ensure suggestions are responsive
    - Preserve muscle memory by making results predictable
    - Keep it simple

# Next steps
- Adopt new macOS features, like Intelligence and Window Tiling
- Improve SwiftUI integration by using menus and animations
- Explore new APIs and consider adopting
