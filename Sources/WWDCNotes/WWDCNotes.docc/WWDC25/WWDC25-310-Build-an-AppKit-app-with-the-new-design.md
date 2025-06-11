# Build an AppKit app with the new design

Update your AppKit app to take full advantage of the new design system. We’ll dive into key changes to tab views, split views, bars, presentations, search, and controls, and show you how to use Liquid Glass in your custom UI. To get the most out of this video, we recommend first watching “Get to know the new design system” for general design guidance.

@Metadata {
   @TitleHeading("WWDC25")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2025/310", purpose: link, label: "Watch Video (22 min)")

   @Contributors {
      @GitHubUser(philptr)
   }
}

## Key Takeaways

- The new design provides refreshed materials and controls throughout macOS.
- Windows and controls have new metrics, with escape hatches for compatibility.
- The Liquid Glass material can be adopted by custom views as well as system controls.

## App structure

### Windows

- Window shape has been altered.
- Key structural regions, like sidebar and toolbar, are framed in glass.
- Windows have a larger corner radius.

@Image(source: "WWDC25-310-Window-Corner-Radius")

### Avoiding window corners

- Use new `NSView.LayoutRegion` to obtain a layout guide avoiding a corner.

```swift
let safeArea = layoutGuide(for: .safeArea(cornerAdaptation: .horizontal))

NSLayoutConstraint.activate([
    safeArea.leadingAnchor.constraint(equalTo: button.leadingAnchor),
    safeArea.trailingAnchor.constraint(greaterThanOrEqualTo: button.trailingAnchor),
    safeArea.bottomAnchor.constraint(equalTo: button.bottomAnchor),
])
```

### Toolbars

- Toolbar items are automatically grouped based on the type of each item’s control view.
- Toolbar item groups are rendered on a single piece of glass.
- You can override the automatic behavior by either:
    - Using an explicit [`NSToolbarItemGroup`](https://developer.apple.com/documentation/appkit/nstoolbaritemgroup);
    - Inserting spacers.
- Toolbar material is adaptive and its appearance follows the brightness of the content behind it.
    - It can switch appearance between light and dark automatically.
- Non-interactive items should avoid the glass material.
    - Remove the glass from an `NSToolbarItem` by setting `isBordered` property to `false`.
- Toolbar items can now be tinted.
    - Use the [`style`](https://developer.apple.com/documentation/appkit/nstoolbaritem/style-swift.property) property on `NSToolbarItem` with value of `.prominent`.
    - Use the [`backgroundTintColor`](https://developer.apple.com/documentation/appkit/nstoolbaritem/backgroundtintcolor) property to customize the tint color (accent color by default).
- Call attention to toolbar items using badging (see `NSItemBadge`).

@Image(source: "WWDC25-310-Toolbar-Item-Groups")

### Sidebars

- Sidebars appear as a pane of glass that floats above the window’s content.
    - Legacy `NSVisualEffectView` is no longer necessary in sidebars; you should remove it.
- Inspectors use an edge-to-edge glass that sits alongside the content.

@Image(source: "WWDC25-310-Sidebar-Inspector")

### Content under the sidebar

- Sidebars can appear over content from the adjacent split.
    - Great for content that can extend into the sidebar region.
    - To allow split content to appear under the sidebar, set the [`automaticallyAdjustsSafeAreaInsets`](https://developer.apple.com/documentation/appkit/nssplitviewitem/automaticallyadjustssafeareainsets) property to `true`.
    - `NSSplitView` will extend that item’s frame beneath the sidebar and then apply a safe area layout guide to help you position your content within the unobscured area.

@Image(source: "WWDC25-310-Safe-Area")

- In some cases, it’s undesirable to cover up any content to get the floating sidebar effect.
    - In that case, you can use [`NSBackgroundExtensionView`](https://developer.apple.com/documentation/appkit/nsbackgroundextensionview) to mirror and blur the content.
    - `NSBackgroundExtensionView` positions content in the unobscured portion of the view, while extending its appearance edge-to-edge.

## Scroll edge effect

### Types

- Allows flowing content edge to edge.
- Two styles:
    - Soft-edge style uses a progressive (or variable) blur.

@Image(source: "WWDC25-310-Soft-Edge")

    - Hard-edge style uses a more opaque backing.

@Image(source: "WWDC25-310-Hard-Edge")

### Split item accessories

- Similar to titlebar accessories.
- Only span one split within the Split View.
- Automatically add scroll edge effects underneath floating content.
- Use the new [`NSSplitViewItemAccessoryViewController`](https://developer.apple.com/documentation/appkit/nssplitviewitemaccessoryviewcontroller) API.

## Controls

### Sizes

- Standard sizes: mini, small, medium, large.
- New size: extra large.
    - Should be used for showcasing the most prominent actions in your app.

### Metrics

- Controls are larger across the board.
- Use Auto Layout to avoid hard coding varying heights.
- For compatibility, you can opt out of the new metrics by using the [`NSView.prefersCompactControlSizeMetrics`](https://developer.apple.com/documentation/appkit/nsview/preferscompactcontrolsizemetrics) API.

@Image(source: "WWDC25-310-Control-Sizes")

### Shapes and prominence

- The mini through medium sizes retain a rounded-rectangle shape.
- The large and extra-large sizes round out into a capsule shape.
- You can override the shape of a button, popup button, or a segmented control by using the new `borderShape` property.
- You can also override the material using the `bezelStyle` property.
- Controls now have configurable levels of prominence, accessible via the `NSTintProminence` enum and the `tintProminence` property.

### Menus

- Menu items now use icons to represent key actions.

### Glass effect view

- Use [`NSGlassEffectView`](https://developer.apple.com/documentation/appkit/nsglasseffectview) to place your [`contentView`](https://developer.apple.com/documentation/appkit/nsglasseffectview/contentview) on glass.
- You can customize the appearance of the glass using the [`cornerRadius`](https://developer.apple.com/documentation/appkit/nsglasseffectview/cornerradius) and [`tintColor`](https://developer.apple.com/documentation/appkit/nsglasseffectview/tintcolor) properties.
- If you have multiple glass shapes in close proximity, group them together using [`NSGlassEffectContainerView`](https://developer.apple.com/documentation/appkit/nsglasseffectcontainerview).
    - This avoids visual artifacts and improves performance.
    - Adaptive appearance is also shared within groups.
