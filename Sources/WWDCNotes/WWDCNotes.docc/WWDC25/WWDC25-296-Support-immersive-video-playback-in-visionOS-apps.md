# Support immersive video playback in visionOS apps

Discover how to play immersive videos in visionOS apps. We’ll cover various immersive rendering modes, review the frameworks that support them, and walk through how to render immersive video in your app. To get the most out of this video, we recommend first watching “Explore video experiences for visionOS” from WWDC25.

@Metadata {
   @TitleHeading("WWDC25")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2025/296", purpose: link, label: "Watch Video (25 min)")

   @Contributors {
      @GitHubUser(Jeehut)
   }
}

## Video profiles

@Image(source: "WWDC25-296-Video-Profiles")

- New: 180º, 360º, and wide FOV supported besides 2D, 3D, Spatial, and Apple Immersive Video
- Quick Look: Use to quickly present any kind of media, including immersive video
- AVKit: Consistent video experience on all platforms with enhanced playback options
- RealityKit: Designed for apps with one-of-a-kind immersive playback experience
- WebKit and Safari: See <doc:WWDC25-237-Whats-new-for-the-spatial-web>

Learn more: <doc:WWDC25-304-Explore-video-experiences-for-visionOS>

## Playback in Quick Look and AVKit

### Quick Look

- `PreviewApplication`: Out-of-process window for media presentation – now supports immersive video formats
- `QLPreviewController`: Preview media in apps window or modally – now supports spatial photos & videos

Learn more in <doc:WWDC23-10085-Discover-Quick-Look-for-spatial-computing> and <doc:WWDC24-10105-Whats-new-in-Quick-Look-for-visionOS>.

### AVKit

- `AVExperienceController`: New `.immersive` experience besides `.expanded`
- By default, `expanded` can now transition to `immersive`, but configurable

To disable automatic transition to immersive:

```swift
import AVKit

let controller = AVPlayerViewController()

let experienceController = controller.experienceController
experienceController.allowedExperiences = .recommended(including: [.expanded, .immersive])

experienceController.configuration.expanded.automaticTransitionToImmersive = .none

await experienceController.transition(to: .expanded)
```

- Also new `Configuration.Placement` with options `.unspecified` and `.over(scene:)`

To transition to immersive with placement configuration:

```swift
import AVKit

let controller = AVPlayerViewController()

let experienceController = controller.experienceController
experienceController.allowedExperiences = .recommended(including: [.immersive])

let myScene = getMyPreferredWindowUIScene()
experienceController.configuration.placement = .over(scene: myScene)

await experienceController.transition(to: .immersive)
```

- Use the `AVExperienceController.Delegate` protocol to handle transition experiences
- `didChangeAvailableExperiences` notifies when possible available experiences change
- `prepareForTransitionUsing` notifies when experience controller is about to transition (last chance to prepare)
- `didChangeTransitionContext` notifies when transition to new experience has finalized
- Use `didChangeAvailableExperiences` to determine whether immersive experience is available

Checkout [sample code](https://developer.apple.com/documentation/avkit/playing-immersive-media-with-avkit) to learn more.

### Comfort mitigation

- Substantial camera motion now auto-detected in APMP profile content using QuickLook & AVKit
- Automatically reduces immersion level to avoid sickness, adjustable by user in Settings app

@Image(source: "WWDC25-296-High-Motion")

## Custom playback in RealityKit

- Use RealityKit for custom playback, like video in an immersive game, or rendering video with custom UI
- RealityKit now supports native playback of immersive video

### Progressive immersion

- Use `VideoPlayerComponent` for rendering video with immmersive modes – mesh updates & animations auto-handled
- Learn more: <doc:WWDC23-10081-Enhance-your-spatial-computing-app-with-RealityKit>
- Now also supports same 180/360/Wide FOV formats like QuickLook and AVKit

@Image(source: "WWDC25-296-VideoPlayerComponent")

- Portal mode renders video in a windows presentation
- Progressive mode is new, allows people to dial own immersion level with digital crown
- Progressive with 100% immersion equal to full immersive viewing mode
- Progressive is preferred over full immersive viewing mode for APMP & Apple Immersive video

To render a video in portal mode:

```swift
import AVFoundation
import RealityKit
import SwiftUI

struct PortalVideoView: View {
    var body: some View {
        RealityView { content in
            guard let url = URL(string: "https://cdn.example.com/My180.m3u8") else { return }
            let player = AVPlayer(playerItem: AVPlayerItem(url: url))
            let videoEntity = Entity()
            var videoPlayerComponent = VideoPlayerComponent(avPlayer: player)
            videoPlayerComponent.desiredImmersiveViewingMode = .portal  // set to .progressive if desired
            videoEntity.components.set(videoPlayerComponent)
            videoEntity.scale *= 0.4  // 1m height by default, scaling to 0.4m – no effect with .progressive
            content.add(videoEntity)
        }
    }
}
```

To use the `.progressive` mode, the view has to be put into an `ImmersiveSpace` with `.progressive style:

```swift
import AVFoundation
import RealityKit
import SwiftUI

@main
struct ImmersiveVideoApp: App {
    var body: some Scene {
        ImmersiveSpace {
            ProgressiveVideoView()
        }
        .immersionStyle(selection: .constant(.progressive(0.1...1, initialAmount: 1.0)), in: .progressive)    
    }
}
```

This code allows immersion from 10% to 100% and starts with 100% initially.

Learn more: <doc:WWDC24-10153-Dive-deep-into-volumes-and-immersive-spaces>

- To transition between portal & immersive viewing modes, wait for `VideoPlayerEvents.ImmersiveViewingModeDidChange`
- Toggle scene/UI visibility upon `VideoPlayerEvents.ImmseriveViewingMode(Will|Did)Transition` to reduce motion
- Learn more in [this sample code project](https://developer.apple.com/documentation/visionos/playing-immersive-media-with-realitykit)

@Image(source: "WWDC25-296-APMP-Rendering")

### Spatial video rendering

- For spatial styling set `VideoPlayerComponent.desiredSpatialVideoMode` to `.spatial`
- Read `VideoPlayerComponent.spatialVideoMode` to learn how it is currently being rendered
- `.spatial` supports both .portal and .full immersive viewing modes
- Set to `.screen` (which is default) to use traditional stereo on a screen mesh
- Subscribe to `VideoPlayerEvents.SpatialVideoModeDidChange` event or observe to get notified on changes

Render a spatial video in portal mode like this:

```swift
import AVFoundation
import RealityKit
import SwiftUI

struct PortalSpatialVideoView: View {
    var body: some View {
        RealityView { content in
            let url = Bundle.main.url(forResource: "MySpatialVideo", withExtension: "mov")!
            let player = AVPlayer(url: url)
            let videoEntity = Entity()
            var videoPlayerComponent = VideoPlayerComponent(avPlayer: player)
            videoPlayerComponent.desiredViewingMode = .stereo
            videoPlayerComponent.desiredSpatialVideoMode = .spatial
            videoPlayerComponent.desiredImmersiveViewingMode = .portal  // can also be .full for .spatial
            videoEntity.components.set(videoPlayerComponent)
            videoEntity.scale *= 0.4  // not needed when set to .full
            content.add(videoEntity)
        }
    }
}
```

For `.full` viewing mode set `videoEnity.position` to something like `[0, 1.5, -1]` for a meter forward (or head anchor), and put view into an `ImmsersiveSpace` like this:

```swift
import AVFoundation
import RealityKit
import SwiftUI

@main
struct SpatialVideoApp: App {
    var body: some Scene {
        ImmersiveSpace {
            ContentSimpleView()
        }
        .immersionStyle(selection: .constant(.mixed), in: .mixed)
        .immersiveEnvironmentBehavior(.coexist)
    }
}
```

@Image(source: "WWDC25-296-Spatial-Video-Playback")

### Comfort mitigation

- RealityKit automatically applies comfort mitigation during playback for APMP videos
- New `VideoPlayerEvents.VideoConfortMitigationDidOccur` event signals upon detection
- Only applied for `.progressive` viewing mode (not `.full`), not needed for `.portal` 
- Use `VideoPlayerEvents.ContentTypeDidChange` event to detect kind of video – react to update UI

### SwiftUI integration

- Managing scale of a mesh important for placing media alongside UI
- In portal mode, mesh size reflected by `VideoPlayerComponent.playerScreenSize`
- Default height is 1m – make sure to scale always with keeping aspect-ratio intact
- Window scenes smaller than 1m in height will cause mesh to be clipped (unless entity scaled down)
- Scaling can be done based on windows size using `GeometryReader3D`
- See [this sample project](https://developer.apple.com/documentation/visionos/playing-immersive-media-with-realitykit) for an example of scaling to fit scene
- Add a `ModelSortGroupComponent` to the entity with `ModelSortGroup.planarUI` to avoid inambiguity

Next steps:

- <doc:WWDC25-297-Learn-about-the-Apple-Projected-Media-Profile>
- <doc:WWDC25-403-Learn-about-Apple-Immersive-Video-technologies>
