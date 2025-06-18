# What’s new in SF Symbols 7

Explore the latest updates to SF Symbols, Apple’s library of iconography. Meet Draw, a new animation system that allows symbols to imitate the organic flow of a handwritten stroke, and Variable Draw, which can be used to convey strength or progress. Discover Gradients, which add dimension and visual interest to symbols, and Magic Replace enhancements, which offer greater continuity between related symbols. And learn how to preview and integrate these features into your own apps.

@Metadata {
   @TitleHeading("WWDC25")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2025/337", purpose: link, label: "Watch Video (22 min)")

   @Contributors {
      @GitHubUser(alexkaessner)
   }
}

## Key Takeaways
- ✍️ New draw animation along defined path, inspired by handwriting
- 🪄 Magic replace recognizes more shapes
- 🌈 Apply gradients to any Symbol
- 🎞️ Use SF Symbol app to add draw animation for custom Symbols

## Introduction
@Image(source: "WWDC25-337-Paths")

- Symbols are created using outlined vector shapes, not just paths with outlines.
- Shapes may be constructed from two different paths, oriented in opposite direction.
- All new symbols and animations can be previewed and customized in updated [SF Symbols app](https://developer.apple.com/sf-symbols/).

## Draw Animation
@Image(source: "WWDC25-337-Draw")

- Animation along defined path, inspired by handwriting.
- Two different presets:
    - Draw On: shows symbol
    - Draw Off: hides symbol
- Draw off animation can be reversed.
- Default animation is _by layer_.
    - Also supports _whole symbol_ or _individually_.
- Animation direction is customizable.
- Complex shapes like arrow heads traveling with path possible.
- Variable draw allows symbols to animate progress, like progress bar or temperature.
    - At render time you need to choose between variable color or variable draw.

## Magic Replace Animation
@Image(source: "WWDC25-337-Magic-Replace")

- Now recognizes matching enclosures aka shapes like circles.
- Can be combined with draw animation.

## Gradients
@Image(source: "WWDC25-337-Gradient")

- Generates gradient from single source color.
    - Both for system and custom colors.
- Gets applied across all rendering modes.

## Draw for Custom Symbols
@Image(source: "WWDC25-337-Draw-Annotation")

- Draw animation relies on set of at least 2 guide points.
    - Start point: hollow dot
    - End point: filled dot

> Note:
All annotation is done in the [SF Symbols app](https://developer.apple.com/sf-symbols/).

@Image(source: "WWDC25-337-Symbols-App")

- Show Draw toolbar via selecting "Draw On" or "Draw Off" in animation tab (in gallery view).
- Enter guide point mode via leftmost button in Draw toolbar.
- Click on Symbols paths to define guide points.
    - Use context menu to change point type.
- Add additional guide points for complex shapes like turning points.
- Drag guide points to edit and flip animation direction.
- Two-path shapes (e.g. circle) automatically get combined start and end point.
    - Animate clockwise by default.
    - Use context menu to change direction to counterclockwise.


### Multiple Paths & Bidirectionally
- Each path has same set of rules (at least 2 guides).
- Select each layer and annotate it separately.
- For **bidirectional animation** place start point between two end points.
    - System will recognize it automatically.
    - Only available for single path shapes.
- Enable snapping (2nd button in Draw toolbar) to ensure start points aligning across multiple layers.

### End Caps
- Rounded end cap by default.
- Use context menu on guide points to change end cap to "adaptive".
    - Only available in single draw direction.

### Non-Drawing Components
@Image(source: "WWDC25-337-Non-Drawing-Components")

- Drag and drop non-drawing shape (like arrow head) on guide to attach it.
- Indicates where shape will appear from.
- To remove drag and drop it on canvas.

> Important:
Non-drawing components need to be separate path.

### Sharp Corner Points
@Image(source: "WWDC25-337-Point-Types")

- For sharp corners use "Corner Point" to assign both points on same path.

### Advanced Options
@Image(source: "WWDC25-337-Point-Customization")

- Hold option key (⌥) to change location of guide point of one side of path.
- Select subpath in layer list to limit guide points to that path.

### Support All Weights
- System interpolates guide points across weights.
- **Annotate regular weight first!**

@Image(source: "WWDC25-337-Point-Numbers")

- When fixing specific weights make sure the guide points are in correct order.
    - Use 3rd button in Toolbar to toggle numbers on/off.
- Drag broken guide points to correct placement in given weight.

### Variable Rendering
- Enable variable draw via button in layer list.
- Review each layer and preview the animation.

## New APIs
### Draw Animations
@TabNavigator {
    @Tab("SwiftUI") {
        ```swift
        struct DrawExamples: View {
            @State var isHidden: Bool = false

            var body: some View {
                HStack {
                    Image(systemName: "wind")
                        .symbolEffect(.drawOn, isActive: isHidden)
                }
            }
        }
        ```
    }
    
    @Tab("UIKit & AppKit") {
        ```swift
        imageView.addSymbolEffect(.drawOff)
        
        // Sometime later, draw on the symbol
        imageView.addSymbolEffect(.drawOn)
        ```
    }
}

### Variable Draw
@TabNavigator {
    @Tab("SwiftUI") {
        ```swift
        struct VariableDrawExample: View {
            var body: some View {
                VStack {
                    Image(systemName: "thermometer.high", variableValue: 0.5)
                }
                .symbolVariableValueMode(.draw)
            }
        }
        ```
    }
    
    @Tab("UIKit") {
        ```swift
        imageView.image = UIImage(systemName: "thermometer.high", variableValue: 0.5)
        imageView.preferredSymbolConfiguration = UIImage.SymbolConfiguration(variableValueMode: .draw)
        ```
    }
    
    @Tab("AppKit") {
        ```swift
        imageView.image = NSImage(systemSymbolName: "thermometer.high", variableValue: 0.5, ...)
        imageView.symbolConfiguration = NSImage.SymbolConfiguration(variableValueMode: .draw)
        ```
    }
}

### Gradients
@TabNavigator {
    @Tab("SwiftUI") {
        ```swift
        struct GradientExample: View {
            var body: some View {
                VStack {
                    Image(systemName: "heart.fill")
                }
                .symbolColorRenderingMode(.gradient)
            }
        }
        ```
    }
    
    @Tab("UIKit") {
        ```swift
        view.image = UIImage(systemName: "heart.fill")
        view.preferredSymbolConfiguration = UIImage.SymbolConfiguration(colorRenderingMode: .gradient)
        ```
    }
    
    @Tab("AppKit") {
        ```swift
        view.image = NSImage(systemSymbolName: "heart.fill", accessibilityDescription: "heart symbol")
        view.symbolConfiguration = NSImage.SymbolConfiguration(colorRenderingMode: .gradient)
        ```
    }
}
