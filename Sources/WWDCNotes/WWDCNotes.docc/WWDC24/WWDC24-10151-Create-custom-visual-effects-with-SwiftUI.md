# Create custom visual effects with SwiftUI

Discover how to create stunning visual effects in SwiftUI. Learn to build unique scroll effects, rich color treatments, and custom transitions. We’ll also explore advanced graphic effects using Metal shaders and custom text rendering.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10151", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(coughski)
   }
}

Philip Davis and Rob Bohnke

Small details make a big difference, and visual effects can enhance perception and functionality. Experiment to find the right effect.

Effects can:
- Show feature is working
- Add personality
- Focus attention

Covered in the talk:
1. Scroll effects
2. Color treatments
3. View transitions
4. Text transitions
5. Metal shaders

## 1. Scroll view effects
Basic enhancement: enable scroll paging with `scrollTargetBehavior(.paging)`

`.scrollTransition` modifier changes collection of elements to something custom
Exposes: content to transition and its scroll phase
Use `phase.value` to check how far off screen view is
`phase.identity` will be true when content is fully on screen

Use `.visualEffect` to e.g. change view hue rotation based on view's position in scroll view
Exposes `contentPlaceholder` (similar to content in scrollTransition), and `proxy` (gives geometry values of view)
You can modify scale, skew, rotation, offset, brightness, and color properties of views, for example, to create your own custom scroll view effect

## 2. Color effects
Color can give app identity, focus attention, or clarify intent

Existing support in SwiftUI:
- Gradient types: linear, radial, angular
- Color controls: brightness, hue rotation, saturation
- Blend modes

**New**: mesh gradients

- Made from grid of points
- Each point has an associated color
- SwiftUI interpolates colors between points to create a color fill
- Points can be moved to modify color transitions

```swift
MeshGradient(
    width: 3,
    height: 3,
    points: [
        [0.0, 0.0], [0.5, 0.0], [1.0, 0.0],
        [0.0, 0.5], [0.9, 0.3], [1.0, 0.5],
        [0.0, 1.0], [0.5, 1.0], [1.0, 1.0]
    ],
    colors: [
        .black,.black,.black,
        .blue, .blue, .blue,
        .green, .green, .green
    ]
)
```

Possible uses
- decorative
- match imagery
- signal change with mesh gradient animation

Play with position of control points, grid size, and color palette

## 3. View transitions
Add or remove views
Provide context to what changed and why

Standard transitions like scale and opacity
Combine transitions
Create entirely custom transitions

1. Create a new struct conforming to `Transition` protocol
2. `body` function takes `content` and `phase` parameters, similar to scroll views
3. Add view modifiers like `scaleEffect`, `opacity`, `blur`, `rotationEffect`, 
4. Check `phase.isIdentity`, `phase.willAppear`, and `phase.willDisappear` to adjust modifier effects

Use transitions to:
- Ease an element into view as it loads
- Introduce key information
- Make graphical element feel dynamic

## 4. Text transitions
Use text transitions to animate text by component, like line, word, and glyph
`TextRenderer` new protocol to customize how text is drawn for entire view tree

Default rendering behavior:
1. Declare a struct conforming to `TextRenderer`
2. Implement `draw(layout: in:)`
   - `Text.Layout`: access individual components of text
   - `GraphicsContext` is the same as in `Canvas`
      - See **Add rich graphics to your SwiftUI app**
3. For default rendering, iterate over lines and draw in context

Example custom rendering
1. To drive a custom transition, declare properties such as: `elapsedTime`, `elementDuration`, `totalDuration`
2. Conform to `Animatable` protocol, and forward `animatableData` property to `elapsedTime`
3. Distribute available time among all text layout elements
4. For each text line, update `GraphicsContext` properties (like opacity, blur, translation) based on line properties such as `typographicBounds`

To focus on specific elements in text, use `TextAttribute`
Conform struct to `TextAttribute` protocol to pass data from text to `TextRenderer`
Use `customAttribute` modifier with your struct to mark a SwiftUI `Text` element
## 5. Metal shaders
Most fine-grained control. Small programs calculating effects directly on device GPU.
Used internally to implement many SwiftUI features, including mesh gradients
Pass colors, numbers, and images to shaders to modify the effect
Written in Metal, not Swift

Uses of shaders in SwiftUI:
- Custom fills
- Color effects
- Distortion effects
- Layer effects

## Conclusion

Try experimenting with:
- Custom scroll effects
- Mesh gradients
- Custom transitions
- Text renderer
- Metal shaders
