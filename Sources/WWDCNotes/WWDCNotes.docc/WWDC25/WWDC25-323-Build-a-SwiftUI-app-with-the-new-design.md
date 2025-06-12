# Build a SwiftUI app with the new design

Explore the ways Liquid Glass transforms the look and feel of your app. Discover how this stunning new material enhances toolbars, controls, and app structures across platforms, providing delightful interactions and seamlessly integrating your app with the system. Learn how to adopt new APIs that can help you make the most of Liquid Glass.

@Metadata {
   @TitleHeading("WWDC25")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2025/323", purpose: link, label: "Watch Video (22 min)")

   @Contributors {
      @GitHubUser(<replace this with your GitHub handle>)
   }
}

## App Structure
- Refined design for `NavigationSplitView`, `TabView`, `NavigationStack`, Sheets, Inspectors & more
- Sidebars float above content now
- Extend views behind sidebars with `.backgroundExtensionEffect()` modifier
    - Mirrors and blurs images/content
- Inspector also gets blurry background, but not floating
- Tab bar floats above content now

@Image(source: "WWDC25-323-tabbar-small")

- Use `.tabBarMinimizeBehavior()` to minimize Tab bar on scroll

@TabNavigator {
    @Tab("Default") {
        @Image(source: "WWDC25-323-tabbar-accessory")
    }
    
    @Tab("Scrolled") {
        @Image(source: "WWDC25-323-tabbar-accessory-small")
    }
}

- Use `.tabViewBottomAccessory()` to add view above Tab bar
- Use environment to customize accessory view when minimized on scroll

```swift
TabView { … }
    .tabBarMinimizeBehavior(.onScrollDown)
    .tabViewBottomAccessory {
        MusicPlaybackView()
    }

struct MusicPlaybackView: View {
    @Environment(\.tabViewBottomAccessoryPlacement)
    var placement

    var body: some View {
        if placement == .inline {
            …
        } else {
            …
        }
    }
}
```

### Sheets
@TabNavigator {
    @Tab("Full Height") {
        @Image(source: "WWDC25-323-sheet-large")
    }
    
    @Tab("Medium") {
        @Image(source: "WWDC25-323-sheet-medium")
    }
    
    @Tab("Small") {
        @Image(source: "WWDC25-323-sheet-small")
    }
}
- Partial height get inset with + Liquid Glass background
- Smaller heights get pulled in even more
- Full height get full size + opaque background
- Swipe gesture smoothly transitions between these states
- Consider removing `.presentationBackground` modifier
- Morph sheets out of buttons with `.navigationTransition`(zoom) and `.matchedTransitionSource`
- Menus, Alerts, Popovers, and Confirmation Dialogs automatically morph out of buttons

## Toolbars
- Toolbar items automatically placed in Liquid Glass and grouped
    - System back button is separate
- Split out groups with `ToolbarSpacer(.fixed)`
    - Use `ToolbarSpacer(.flexible)` to expand space between bottom items
- Use `.sharedBackgroundVisibility(.hidden)` to hide Glass container of items
- `.badge()` modifier can add number badges
- Lean into new automatic monochrome icon styling!

@Image(source: "WWDC25-323-button-tint")

- Use `tint()` to style the icon
- Use `buttonStyle(.borderedProminent)` for colored background
- Coloring only used to convey meaning, not effect!
- Remove backgrounds behind bars to embrace scroll edge effects!
- For sharp edge effects use `.scrollEdgeEffectStyle(.hard, for: .top)` on `ScrollView`

## Search
- Search is now placed on bottom on iPhone
    - Top trailing on iPad and Mac
- Treat search as dedicated page!
    - Page may show browsing suggestions
- Apply `.searchable()` on `NavigationSplitView` to get this behavior
- Search may be minimized automatically or via `.searchToolbarBehavior(.minimize)`
- For Tab bars use `Tab(role: .search)`

## Controls
### Buttons
- Bordered buttons are now capsule shaped
- On macOS Mini, Small, and Medium size are still rounded rectangles
- Control heights are tweaked
    - Slightly taller on macOS
- Extra large size buttons are now available

@Image(source: "WWDC25-323-glass-button")

- New button styles `.glass` and `.glassProminent`

### Sliders
@Image(source: "WWDC25-323-slider")

- Tick marks now automatically shown when using `step` parameter
- Manually place them in `ticks` closure with `SliderTick()`
- Define bar start point with `neutralValue` parameter

### Menus
- Now use leading icons on menu items!
- Use same standard label or control API to show icons
- More on menu design in <doc:WWDC25-208-Elevate-the-design-of-your-iPad-app>

### Aligned Corner Radius
@Image(source: "WWDC25-323-concentricity")

- Controls should have same corner center as container
- Pass `.containerConcentric` to corner parameter of `Rectangle` or `.rect`

## Liquid Glass Effects
- Use `.glassEffect()` to manually add Liquid Glass to any view
    - Capsule shape by default
- Automatically uses vibrant text color
    - Also when tinting background

@TabNavigator {
    @Tab("Custom Shape") {
        ```swift
        Label("Desert", systemImage: "sun.max.fill")
            .padding()
            .glassEffect(in: .rect(cornerRadius: 16))
        ```
    }
    
    @Tab("Tint Background") {
        ```swift
        Label("Desert", systemImage: "sun.max.fill")
            .padding()
            .glassEffect(.regular.tint(.green))
        ```
    }
    
    @Tab("Interactivity Effects") {
        ```swift
        Label("Desert", systemImage: "sun.max.fill")
            .padding()
            .glassEffect(.regular.interactive())
        ```
    }
}

@Image(source: "WWDC25-323-glasscontainer")

- Important to wrap multiple glass elements with `GlassEffectContainer`
- Use `.glassEffectID` modifier on child views for transitions or morphing of glass views
    - Combine with `@Namespace`

```swift
@Namespace var namespace

GlassEffectContainer {
    VStack {
        if isExpanded {
            VStack(spacing: 16) {
                ForEach(badges) {
                    BadgeLabel(badge: $0)
                        .glassEffect()
                        .glassEffectID(badge.id, in: namespace)
                }
            }
        }

        BadgeToggle()
            .buttonStyle(.glass)
            .glassEffectID("badgeToggle", in: namespace)
}
```
