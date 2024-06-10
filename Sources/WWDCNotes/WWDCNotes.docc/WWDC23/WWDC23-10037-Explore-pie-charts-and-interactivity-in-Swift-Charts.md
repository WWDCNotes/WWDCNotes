# Explore pie charts and interactivity in Swift Charts

Swift Charts has come full circle: Get ready to bake up pie and donut charts in your app with the latest improvements to the framework. Learn how to make your charts scrollable, explore the chart selection API for revealing additional details in your data, and find out how enabling additional interactivity can make your charts even more delightful. 

@Metadata {
   @TitleHeading("WWDC23")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc23/10037", purpose: link, label: "Watch Video (10 min)")

   @Contributors {
      @GitHubUser(Jeehut)
   }
}



## Pie Charts

- Pie charts do not have axes, they're: casual, intuitive, approachable
- New mark-based composition syntax type `Sector`
- `Sector` is a Position in Polar Coordinate System, size proportional to the value
- By increasing the inner radius, pie chart becomes a donut chart
- To migrate from a bar chart to a pie chart, change `BarMark` to `SectorMark`, and argument `x:` to argument `angle:`
- Use `angularInset:` param on `SectorMark` to create space between pie pieces, supports also `.cornerRadius`
- Set `innerRadius:` param on `SectorMark` to a `.ratio` value to turn into donut chart (e.g. golden ratio `0.618`)
- You can put text inside a donut chart by using `.chartBackground` which uses `GeometryReader`

![A donut chart with text in the middle using the `.chartBackground` modifier.][donut]

[donut]: Donut.png

## Selection

- Use `chartXSelection(value: $selectedValue` to store selected value to a `@Binding var selectedValue: Value?`
- Use `if let selectedValue {` to define a `RuleMark` when the value is non-nil to show selection in chart
- Use `.annotation` modifier on the `RuleMark` to create a popover that shows additional details about the selection
- Use `.overflowResolution` param of `.annotation` and set `y: .disabled` to extend the annotation outside the chart view

![Showing an overlay that extends beyond the chart using `.annotation(...:overflowResolution:)` modifier on `RuleMark`.][selection]

[selection]: Selection.png

- A variant of `.chartXSelection` with argument `range` allows to select a range of values (default: two finger tap on iOS, drag on macOS)
- Use `.chartGesture` to define a custom gesture for value/range selection

## Scrolling

- Enable scrolling via `.chartScrollableAxes(.horizontal|.vertical)`
- Define scrolling range using `.chartXVisibleDomain(length:)`
- Store current scroll position in Binding using `chartScrollPosition(x: $scrollPosition)`
- `chartScrollTargetBehavior(.valueAligned(matching:majorAlignment:)` allows "snapping" to specific values if needed
- More on scrolling in session [Beyond Scroll Views](https://developer.apple.com/videos/play/wwdc2023/10159)
