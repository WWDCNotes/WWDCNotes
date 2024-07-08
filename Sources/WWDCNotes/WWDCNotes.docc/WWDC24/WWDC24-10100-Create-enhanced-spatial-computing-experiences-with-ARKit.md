# Create enhanced spatial computing experiences with ARKit

Learn how to create captivating immersive experiences with ARKit’s latest features. Explore ways to use room tracking and object tracking to further engage with your surroundings. We’ll also share how your app can react to changes in your environment’s lighting on this platform. Discover improvements in hand tracking and plane detection which can make your spatial experiences more intuitive.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10100", purpose: link, label: "Watch Video (15 min)")

   @Contributors {
      @GitHubUser(Jeehut)
   }
}

Recap:

- When app in "Full Space", you can use ARKit to get "anchors"
- Anchor is a position and orientation in 3D space, such as `PlaneAnchor`
- Anchors provided through data providers, such as `PlaneDetectionProvider`
- Providers are run in an `ARKitSession`

@Image(source: "WWDC24-10100-ARKitSession")

Learn more at least year's session <doc:WWDC23-10082-Meet-ARKit-for-spatial-computing>.

## Room tracking

ARKit detects the boundaries of the room:

@Image(source: "WWDC24-10100-Room-Boundaries")

It also recognizes transitions between rooms (when walking throught the door). Apps can provide different experiences per room.

Use the new [`RoomTrackingDataProvider`](https://developer.apple.com/documentation/arkit/roomtrackingprovider) which requires world sensing authorization. The available properties are `currentRoomAnchor` and `anchorUpdates` to get a stream of `RoomAnchor` changes.

A [`RoomAnchor`](https://developer.apple.com/documentation/arkit/roomanchor) has the properties `isCurrentRoom`, `geometry`/`geometries(of classification:)`, `contains(_ point:)`, `planeAnchorIDs` and `meshAnchorIDs`.

## Plane detection

ARKit detects planes and surfaces as [`PlaneAnchor`](https://developer.apple.com/documentation/arkit/planeanchor)s. 

These are useful for placing virtual content around surfaces (like a board game on a table) or walls (like [virtual posters](https://apps.apple.com/us/app/posters-discover-movies-home/id6478062053) on the wall).

The detected surface types are:

@TabNavigator {
   @Tab("Horizontal surfaces") {
      @Image(source: "WWDC24-10100-Horizontal-Surfaces")
   }
   @Tab("Vertical surfaces") {
      @Image(source: "WWDC24-10100-Vertical-Surfaces")
   }
   @Tab("Angled surfaces (New)") {
      @Image(source: "WWDC24-10100-Angled-Surfaces")
   }
}

To get the new slanted (angled) plane anchors, include `.slanted` in the `alignments` parameters like so:

```swift
let planeDetection = PlaneDetectionProvider(alignments: [.horizontal, .vertical, .slanted])
```

## Object tracking

ARKit can now give you the position and orientation of objects in your environment to anchor virtual content to them. 

A USDZ-formatted 3D object needs to be converted to a reference object using [Create ML](https://developer.apple.com/machine-learning/create-ml/) which then gets passed to ARKit to detect the objects you want. Learn more in the session <doc:WWDC24-10101-Explore-object-tracking-for-visionOS>.

Once this is done, you can pass the reference object to ARKit like this:

```swift
Task {
    do {
        let url = URL(fileURLWithPath: "/path/to/globe.referenceobject")
        let referenceObject = try await ReferenceObject(from: url)
        let objectTracking = ObjectTrackingProvider(referenceObjects: [referenceObject])
    } catch {
        // Handle reference object loading error.
    }
    ...
}
```

You'll receive detected objects as [`ObjectAnchor`](https://developer.apple.com/documentation/arkit/objectanchor) instances which have a `boundingBox` property of type [`AxesAlignedBoundingBox`](https://developer.apple.com/documentation/arkit/objectanchor/axisalignedboundingbox) containing the coordinates. 

## World tracking

The sensors of the device detect world conditions such as low lighting and provides warnings about limited capabilities. Now, apps can hook into these world conditions via the new `worldTrackingLimitations` SwiftUI Environment value like so:

```swift
struct WellPreparedView: View {
    @Environment(\.worldTrackingLimitations) var worldTrackingLimitations
    
    var body: some View {
        ...
 
        .onChange(of: worldTrackingLimitations) {
            if worldTrackingLimitations.contains(.translation) {
                // Rearrange content when anchored positions are unavailable.
            }
        }
    }
}
```

In ARKit, the [`DeviceAnchor`](https://developer.apple.com/documentation/arkit/deviceanchor) now holds a `trackingState` property.

## Hand tracking

New this year: The [`HandAnchor`](https://developer.apple.com/documentation/arkit/handanchor) now updates with a higher rate.

Because there's still some delay, ARKit will now try to predict future hand anchor positions and provide them in real-time, which is also available in RealityKit.

There's a new [`trackableAnchorTime`](https://developer.apple.com/documentation/compositorservices/layerrenderer/frame/timing/4439315-trackableanchortime) propertly on the `LayerRenderer` which you can use to get ARKit to provide forward prediction like so:

```swift
func submitFrame(_ frame: LayerRenderer.Frame) {
    ...

    guard let drawable = frame.queryDrawable() else { return }

    // Get the trackable anchor time to target.
    let trackableAnchorTime = drawable.frameTiming.trackableAnchorTime

    // Convert the timestamp into units of seconds.
    let anchorPredictionTime = LayerRenderer.Clock.Instant.epoch
      .duration(to: trackableAnchorTime).timeInterval  

    // Predict hand anchors for the time that provides best content registration.
    let (leftHand, rightHand) = handTracking.handAnchors(at: anchorPredictionTime)
    
    ...
}
```

@Video(source: "WWDC24-10100-Hand-tracking")

> Warning: This is a low-latency prediction, so it may be somewhat inaccurate.

To learn more about rendering with compositor services, watch <doc:WWDC24-10092-Render-Metal-with-passthrough-in-visionOS> and <doc:WWDC23-10082-Meet-ARKit-for-spatial-computing>.

In RealityKit, pass the new [`predicted`](https://developer.apple.com/documentation/realitykit/anchoringcomponent/trackingmode-swift.struct/predicted) tracking mode instead of the slower but more accurate `continuuous` mode to an `AnchorEntity` for a lower-latency prediction.

A detailed RalityKit example is provided in <doc:WWDC24-10104-Build-a-spatial-drawing-app-with-RealityKit>.
