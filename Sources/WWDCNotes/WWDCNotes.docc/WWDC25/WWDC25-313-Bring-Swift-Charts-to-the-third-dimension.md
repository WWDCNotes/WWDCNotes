# Bring Swift Charts to the third dimension

Learn how to bring your 2D Swift Charts to the third dimension with Chart3D and visualize your data sets from completely new perspectives. Plot your data in 3D, visualize mathematical surfaces, and customize everything from the camera to the materials to make your 3D charts more intuitive and delightful. 

@Metadata {
   @TitleHeading("WWDC25")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2025/313", purpose: link, label: "Watch Video (11 min)")

   @Contributors {
      @GitHubUser(alexkaessner)
   }
}

## Key Takeaways

- 👍 Great When Shape of Data is Important
- 🫆 Interactivity is Key
- 🎥 Orthographic Perspective by Default
- 🆕 New Mark Type `SurfacePlot`

@Row {
    @Column {
        @Image(source: "WWDC25-313-Overview1", alt: "5 different 3D charts examples.")
    }
    @Column {
        @Image(source: "WWDC25-313-Overview2", alt: "A 3D chart popping out of a window on Vision Pro.")
    }
}
@Row {
    @Column {
        @Image(source: "WWDC25-313-Overview3", alt: "All supported mark types.")
    }
    @Column {
        @Image(source: "WWDC25-313-Overview4", alt: "Both supported camera perspectives: Orthographic and Perspective.")
    }
}

## Plotting in 3D
- Used by changing `Chart` to `Chart3D`
- `PointMark`, `RuleMark` and `RectangleMark` now support z-values
    - New and unique to 3D charts is `SurfacePlot`
- Charts support gestures for rotation 
    - Rotation snaps to sides to represent 2D chart

```swift
// A scatterplot of a penguin's flipper length, beak length, and weight

Chart3D(penguins) { penguin in
    PointMark(
        x: .value("Flipper Length", penguin.flipperLength),
        y: .value("Weight", penguin.weight),
        z: .value("Beak Length", penguin.beakLength)
    )
    .foregroundStyle(by: .value("Species", penguin.species))
}
.chartXAxisLabel("Flipper Length (mm)")
.chartYAxisLabel("Weight (kg)")
.chartZAxisLabel("Beak Length (mm)")
```
### 3D Charts Work Great When
- Shape of data is important
- Data itself is three-dimensional
- Data represents physical position

> Important:
"Interactivity is key to understanding three-dimensional datasets, so only consider 3D charts if requiring interaction enhances the experience in your app."

## Surface plot
- `SurfacePlot` is similar to `LinePlot` API
    - Plots mathematical surface with up to two variables: f(x, z)
- Accepts closure of 2 doubles, and returns a double
- Evaluates expression and creates continuous surfaces of computed Y values
- Functions simple or complex as you want

```swift
Chart3D {
    SurfacePlot(x: "X", y: "Y", z: "Z") { x, z in
        // (Double, Double) -> Double
        (sin(5 * x) + sin(5 * z)) / 2
    }
}
```

Use `LinearRegression` to show linear relationships in 3D:

```swift
let linearRegression = LinearRegression(
    penguins,
    x: \.flipperLength,
    y: \.weight,
    z: \.beakLength
)

struct PenguinChart: some View {
    var body: some View {
        Chart3D {
            ForEach(penguins) { … }

            SurfacePlot(x: "Flipper Length", y: "Weight", z: "Beak Length") { flipperLength, beakLength in
                linearRegression(flipperLength, beakLength)
            }
            .foregroundStyle(.gray)
        }
    }
}
```

More on function plots in: <doc:WWDC24-10155-Swift-Charts-Vectorized-and-function-plots>

## Customization
### Camera View
- Choose an initial Pose that works well with your data
- Chart3DPose accepts standard views, like `.default` or `.front`
    ```swift
    @State var pose: Chart3DPose = .default

    var body: some View {
        Chart3D(penguins) { penguin in
            …
        )
        .chart3DPose($pose)
    }
    ```
- Custom poses via:
    ```swift
    @State var pose = Chart3DPose(
        azimuth: .degrees(20),
        inclination: .degrees(7)
    )
    ```
### Camera Perspective
- Uses orthographic camera projection by default
    - Points in the back are same size as front -> easier to compare
    - Works best for viewing charts from side
- Perspective projection can be enabled via `.chart3DCameraProjection(.perspective)`

### SurfacePlot Coloring
`.foregroundStyle` accepts:
- `LinearGradient()`
- `EllipticalGradient()`
- `.heightBased`
- `.normalBased`

@TabNavigator {
    @Tab("Elliptical Gradient") {
        @Image(source: "WWDC25-313-elliptical-gradient", alt: "Elliptical Gradient coloring of SurfacePlot")
    }
    
    @Tab("Height Based") {
        @Image(source: "WWDC25-313-height-based", alt: "Height Based coloring of SurfacePlot")
    }
    
    @Tab("Normal Based") {
        @Image(source: "WWDC25-313-normal-based", alt: "Normal Based coloring of SurfacePlot")
    }
}
