# Build compelling spatial photo and video experiences

Learn how to adopt spatial photos and videos in your apps. Explore the different types of stereoscopic media and find out how to capture spatial videos in your iOS app on iPhone 15 Pro. Discover the various ways to detect and present spatial media, including the new QuickLook Preview Application API in visionOS. And take a deep dive into the metadata and stereo concepts that make a photo or video spatial.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10166", purpose: link, label: "Watch Video (21 min)")

   @Contributors {
      @GitHubUser(halmueller)
   }
}

## Chapters
 [0:00 - Introduction](https://developer.apple.com/videos/play/wwdc2024/10166/?time=0)  
 [1:07 - Types of stereoscopic experiences](https://developer.apple.com/videos/play/wwdc2024/10166/?time=67)  
 [4:13 - Tour of the new APIs](https://developer.apple.com/videos/play/wwdc2024/10166/?time=253)  
 [13:14 - Deep dive into spatial media formats](https://developer.apple.com/videos/play/wwdc2024/10166/?time=794)  
[21:16 - Wrap-up](https://developer.apple.com/videos/play/wwdc2024/10166/?time=1276)  

### Resources

- AVCam
- Converting side-by-side 3D video to multiview HEVC and spatial video
- Creating spatial photos and videos with spatial metadata
- Forum: Spatial Computing
- Writing spatial photos
- HD Video SD Video

### Related Videos:
- [Bring your iOS or iPadOS game to visionOS](https://developer.apple.com/videos/play/wwdc2024/10093)
- [Enhance the immersion of media viewing in custom environments](https://developer.apple.com/videos/play/wwdc2024/10115)
- [Optimize for the spatial web](https://developer.apple.com/videos/play/wwdc2024/10065)
- [What’s new in Quick Look for visionOS](https://developer.apple.com/videos/play/wwdc2024/10105)
-  (WWDC23) [Deliver video content for spatial experiences](https://developer.apple.com/videos/play/wwdc2023/10071)

## Stereoscopic video experiences

Formats:
- 3D video, like 3D movies available in Apple TV and Disney+. Renders flat.
- Spatial video, captured on iPhone 15 pro and Vision Pro. Renders through a window.
- Apple Immersive video, for high-end professional content. 180 degree, 8k resolution, spatial audio.

### Full immersion
3D video docks into an environment, screen moves backward and enlarges. (see also [Enhance video playback and immersion in your custom app environment]). Spatial video expands into its immersive presentation.

Content wraps around user.

Other stereo experiences:
- Spatial photos  
- Custom video experiences  
- Interactive 3D content  

See also: Bring your iOS or iPadOS game to visionOS

## New APIs
No new frameworks, changes ar integrated into existing frameworks

### Capturing spatial video
 [Code walkthrough: AVCaptureSession to capture spatial video.](https://developer.apple.com/videos/play/wwdc2024/10166/?time=310)
`isSpatialVideoCaptureSupported` fails on hardware other than iPhone 15 Pro. Get full-formed spatial video file on disk.

[Enhancements:](https://developer.apple.com/videos/play/wwdc2024/10166/?time=450) improved video stabilization, and a great preview.

"Wide" and "Ultrawide" cameras have different capture characteristics. Can cause noise level variation, or focus mismatch. Not detectable until playback on Vision Pro. So have added new variable `spatialCaptureDiscomfortReasons` on `AVCaptureDevice` for feedback while shooting. See iPhone Camera App for first-party UI example of this feedback.

### Detecting spatial media

Detection Methods
- PhotosPicker. Can filter library to show only `.spatialMedia` assets.
- PhotoKit. Pass `PHAssetMediaSubtype.spatialMedia` to `fetchAssets` call. Can do just spatial photos or spatial videos.
- AVAssetPlaybackAssistant. `.playbackConfigurationOptions` can be configured for spatial assets.

Presentation Options
- PreviewApplication API (spawn Quicklook scene). See "What's new in Quick Look for spatial computing".
- Element Fullscreen API (Javascript). Open spatial photos in Safari. See "Optimize for the Spatial Web".
- AVPlayerViewController. Supports 2D and 3D video content, also HTTP Live Streaming for spatial video. Only displays as 3D if full screen. Shows 3D video, not spatial video. Use PreviewApplication if you need spatial video display.

## Create custom spatial media

[File format discussion](https://developer.apple.com/videos/play/wwdc2024/10166/?time=790).
Two sample projects provided, for spatial video and spatial photos.

[Spatial metadata:](https://developer.apple.com/videos/play/wwdc2024/10166/?time=821)
- Projection. Spatial photos and videos always use the rectilinear projection.
- Baseline, Field of View: camera properties.
- Disparity adjustment

Example: stereoscopice image of a hummingbird.

For optimal image characteristics the left and right images should be stereo rectified, have optical axis alignment, and have no vertical disparity.
Rectilinear: straight lines in world are straight lines on image.
Horizontal baseline: 64 mm similar to human eye, 32 mm good for closeups, larger than 64 mm good for stereo landscape photography. 

FOV greater than 90 degrees is inefficient for rectilinear capture, 60 degrees used for this analysis. 

Images must be coplanar (or stereorectified in post-production).

Cropping: center axis of cameras should be at centers of images to keep good alignment. Vertical disparity, if present, makes images uncomfortable to view (same feature should have same Y coordinate in each eye).

Vision Pro renderer uses the metadata to construct a camera model, renders different image for each eye.

Horizontal disparity adjustment: a hint to the renderer on where to place the zero parallax plane. Sometimes called convergence adjustment. Move left/right frames horizontally to adjust disparity. This controls perception of how far away the 3D scene appears to be.

## Wrap-up. Covered:
- multiple types of stereo media
- capture, detect, and display spatial media
- create your own spatial media









