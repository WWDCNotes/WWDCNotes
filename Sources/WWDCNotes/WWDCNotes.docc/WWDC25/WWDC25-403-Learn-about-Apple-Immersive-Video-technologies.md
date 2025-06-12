# Learn about Apple Immersive Video technologies

Explore the capabilities of Apple Immersive Video and Apple Spatial Audio Format technologies to create truly immersive experiences. Meet the new ImmersiveMediaSupport framework, which offers functionality to read and write the necessary metadata for enabling Apple Immersive Video. Learn guidelines for encoding and publishing Apple Immersive Video content in standalone files for playback or streaming via HLS.

@Metadata {
   @TitleHeading("WWDC25")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2025/403", purpose: link, label: "Watch Video (14 min)")

   @Contributors {
      @GitHubUser(Jeehut)
   }
}

## Prerequisites

- <doc:WWDC25-304-Explore-video-experiences-for-visionOS>

## Apple Immersive Video

- Highest-quality immersive experience on Apple Vision Pro, requires specific cameras (such as Blackmagic's)
- macOS & visionOS 26 can read/write immersive metadata, with built-in previewing capabilities

### Metadata

- `VenueDescriptor` type in the `ImmersiveMediaSupport` framework contains a combination of all cameras used
- Stored as Apple Immersive Media Embedded (AIME) data
- `VenueDescriptor` consists of `cameras`, the `ImmersiveCameraViewModel`, ability to `add`/`remove` cameras
- It also holds the `aimeData` property and has a `save(to:)` method
- Camera calibrations include: per-shot edge blend, custom backdrops, calibrated lenses, camera origin, and more
- Dynamic metadata timed per frame with video, represented as `PresentationCommands` muxed into file
- Per-frame camera projection, video frame fade, backdrop fade, horizontal shot flop

@Image(source: "WWDC-403-PresentationCommands")

### Read

- New Apple Immersive Video Universal (AIVU) file: .mov container with commands & descriptor
- Can be played in Files app in VisionOS, also possible in your own app as file / HLS stream:
- Learn more: <doc:WWDC25-296-Support-immersive-video-playback-in-visionOS-apps>

@Image(source: "WWDC-403-AIVU")

- New APIs in `AVFoundation` like `.quicktimeMetadataAIMEData` in metadata to load descriptor
- Filter by the `.quickTimeMetdataPresentationImmersiveMedia` identifier
- Learn more here: [AVPlayerItemMetadataOutput](https://developer.apple.com/documentation/avfoundation/avplayeritemmetadataoutput)

### Write

- You must use the projection kind `AppleImmersiveVideo`
- Write `VenueDescriptor` as `AVMetadataItem` and...
- Write `PresentationCommand` as `AVTimedMetadataGroup` using `AVAssetWriter`
- Use `AIVUValidator.validate(url:)` to check if a valid file was created
- Learn more in [this sample project](https://developer.apple.com/documentation/immersivemediasupport/authoring-apple-immersive-video)

Author note: Check out the video for full code samples.

### Publish

- Recommended resolution is 4320x4320 @ 90 FPS
- HLS bitrate tiers: Min 25 Mbit to Max 100 Mbit on average, 50 Mbit to 150 Mbit peak
- Inside HLS playlist you need the `.aime` metadata file for AVP to play correctly
- `EXT-X-VERSION` 12 or higher required, `venue-description` file, `content-type`, layout

@Image(source: "WWDC-403-HLS-tiers")

### Preview

- Use `ImmersiveVideoFrame` to send from editing Mac to Vision Pro for previewing
- One or multiple receivers possible, live previewing with custom compositor
- Learn more: [Immersive Media Support](https://developer.apple.com/documentation/ImmersiveMediaSupport)

@Image(source: "WWDC-403-ImmersiveMediaRemotePreview")

## Spatial Audio

Author note: Skipped this section of the video.
