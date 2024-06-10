# Build SwiftUI views for widgets

Widgets are bite-sized pieces of information from your app that someone can choose to place on their home screen or Today view. Discover the process of building the views for a widget from scratch using SwiftUI. Brush up on the syntax that you’ll need for widget-specific construction and learn how to incorporate those commands and customize your widget’s interface for a great glanceable experience.

@Metadata {
   @TitleHeading("WWDC20")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc20/10033", purpose: link, label: "Watch Video (20 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



- Widgets are self-contained: we can adapt them while also supporting older versions of our macOS/iOS's.
- Use [`.previewContent(WidgetPreviewContext(family: .system..))`][widgetPreviewDoc] on SwiftUI previews to display the widget layout.
- Do not define your own corner radius in a widget, use [`ContainerRelativeShape`][containerRelativeShapeDoc] instead:

```swift
struct PillView : View {
    var title: Text
    var color: Color

    var body: some View {
        Text(title)
            .background(ContainerRelativeShape().fill(color))
    }
}
```

- [`ContainerRelativeShape`][containerRelativeShapeDoc] is a new shape type that will take on the path of the nearest container shape specified by a parent with an appropriate corner radius based on the position of the shape.
- use the `.isPlaceholder(true)` modifier on a preview to display the widget preview (note: `.isPlaceholder` is not available on Xcode 12b1)
- if something should not be replaced by a placeholder, we need to mark it with `.isPlaceholder(false)`
- if we want the same view to support multiple widget families/sizes, we can to so by adding an environment variable for the widget family: `@Environment(\.widgetFamily) var widgetFamily`
- To display a live countdown or similar, use the [new][dateDoc1] [Date][dateDoc2] [API][dateDoc3]:

```swift
// +2 hours
// -3 months
Text(event.startDate, style: .offset)

// 2 hours, 23 minutes – Automatically updating as time pass
Text(event.startDate, style: .relative)

// 36:59:01 – Automatically updating as time pass
Text(event.startDate, style: .timer)
```

- These date formats will automatically update the view as time passes (without the need of redrawing it): it's a great way to make your widgets feel alive on the home screen.

[widgetPreviewDoc]: https://developer.apple.com/documentation/widgetkit/widgetpreviewcontext
[containerRelativeShapeDoc]: https://developer.apple.com/documentation/swiftui/containerrelativeshape
[dateDoc1]: https://developer.apple.com/documentation/swiftui/text/init(_:)-4k7ab
[dateDoc2]: https://developer.apple.com/documentation/swiftui/text/init(_:)-56n81
[dateDoc3]: https://developer.apple.com/documentation/swiftui/text/init(_:style:)
