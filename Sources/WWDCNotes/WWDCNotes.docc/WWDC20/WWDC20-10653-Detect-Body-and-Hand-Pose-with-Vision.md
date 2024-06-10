# Detect Body and Hand Pose with Vision

Explore how the Vision framework can help your app detect body and hand poses in photos and video. With pose detection, your app can analyze the poses, movements, and gestures of people to offer new video editing possibilities, or to perform action classification when paired with an action classifier built in Create ML. And we’ll show you how you can bring gesture recognition into your app through hand pose, delivering a whole new form of interaction.

@Metadata {
   @TitleHeading("WWDC20")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc20/10653", purpose: link, label: "Watch Video (24 min)")

   @Contributors {
      @GitHubUser(Jeehut)
   }
}



- 21 points on the hand are recognized
- 4 points per finger plus one for the wrist
- Use `VNDetectHumanHandPoseRequest`
- Default maximum hand count is 2
- Multiple bodies supported, too
- 5 points for the face, nose, eyes and ears
- 3 points per arm
- 6 for torso (overlapping shoulders with arm)
- 3 points per leg (overlapping hip with torso)
- Could also be used for offline analysis of e.g. a photo collection
- Can be combined with `CreateML` classification
