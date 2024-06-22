# Introducing ARKit 3

ARKit is the groundbreaking augmented reality (AR) platform for iOS that can transform how people connect with the world around them. Explore the state-of-the-art capabilities of ARKit 3 and discover the innovative foundation it provides for RealityKit. Learn how ARKit makes AR even more immersive through understanding of body position and movement for motion capture and people occlusion. Check out additions for multiple face tracking, collaborative session building, a coaching UI for on-boarding, and much more.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/604", purpose: link, label: "Watch Video (51 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## New Features in ARKit 3

- Visual Coherence
- Positional Tracking
- Simultaneous Front and Back Camera
- Record and Replay of Sequences
- More Robust 3D Object Detection
- Multiple-face Tracking
- HDR Environment Textures
- Faster Reference Image Loading
- Motion Capture
- Detect up to 100 Images
- Face Tracking Enhancements
- People Occlusion
- Raycasting
- Collaborative Session
- ML Based Plane Detection
- New Plane Classes
- RealityKit Integration
- AR QuickLook Additions
- Auto-detect Image Size 
- AR Coaching UI 

## What’s New

### People Occlusion 

- Available on A12 and later
- Two ways: 
  - people fragmentation (AR experience will always be occluded by people, regardless of the distance of AR objects and people)
  - people fragmentation + depth (ARKit estimate the people distance and occluded objects/people based on that)

### Motion Capture

- Tracks Human Body
- Two ways: 2D and 3D

### Collaborative Session

- Multiple devices can be used to merge POI together and create a big AR world
- Uses the [MultipeerConnectivity](https://developer.apple.com/documentation/multipeerconnectivity) framework for sharing AR World data or other wireless way to do so.

### AR Coaching UI

- To be used when telling the user to move the phone in the horizontal/vertical plane to start the AR experience
- Automatically hides/updates itself based on the AR state

### New Plane Classes

- Wall floor ceiling table seat door window (last two are new)

### Visual Coherence

- Motion blur
- Bokeh 
