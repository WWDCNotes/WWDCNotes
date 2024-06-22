# Building Collaborative AR Experiences

With iOS 13, ARKit and RealityKit enable apps to establish shared AR experiences faster and easier than ever. Understand how collaborative sessions allow multiple devices to build a combined world map and share AR anchors and updates in real-time. Learn how to incorporate collaborative sessions into ARKit-based apps, then roll into SwiftStrike, an engaging and immersive multiplayer AR game built using RealityKit and Swift.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/610", purpose: link, label: "Watch Video (35 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## Collaborative Session

- In short, each device creates their own points cloud, and share this with the other devices.
- Once the devices find an overlapping in their points cloud, the two scenes can be merged together.
- It is important to use ARAnchors, because those are automatically translated between devices (each device keeps using their own anchors, but they need to make sense of other devices anchors)

## ARAnchor Best Practice for Multi-User AR

- `ARParticipantAnchor` lets you know where the other users in the experience are.
- `ARAnchors` are the main way to share virtual content within collaborative session.
- Respond to ARAnchor updatesduring a session the anchor position can change (when arkit knows the scene better), make sure that the virtual objects update their position as well
- Place 3d content nearby ranchers (not too far away)
- If you have multiple independent objects, it’s wise to attach them to multiple different ARAnchors in the map

## SwiftStrike — A New Multiplayer AR Experience

The last part of the session talks about a new AR open source game made by Apple, it’s very nice to see its comparison with last year’s slingshot AR game: thanks to people occlusion, RealityKit, and ARKit 3 enhancements (especially around collaborative session) there’s a lot less code to be written by developers and the experience is way better.
