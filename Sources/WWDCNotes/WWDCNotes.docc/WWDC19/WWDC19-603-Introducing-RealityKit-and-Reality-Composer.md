# Introducing RealityKit and Reality Composer

Architected for AR, RealityKit provides developers access to world-class capabilities for rendering, animation, physics, and spatial audio. See how RealityKit reimagines the traditional 3D engine to make AR development faster and easier for developers than ever before. Understand the building blocks of developing RealityKit based apps and games, and learn about prototyping and producing content for AR experiences with Reality Composer.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/603", purpose: link, label: "Watch Video (37 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



- RealityKit is a brand new Swift framework designed to help you build your AR applications and easily exploit the power of ARKit.
- Reality Composer is a Mac and iOS tool that enables simple AR-based content creation. 
- With Reality Kit we can add audio to our models as well: the audio will play louder the closer we go to that model.
- New file format: Reality File. Optimized for RealityKit

## RealityKit Basics

### ARView

- Your window to the view of AR, entry point for RealityKit
- It’s a view, therefore it goes with our view hierarchy
- Sets up the environment (shadowing, environment reflections, camera noise especially a night added to AR models as well)
- Handles gestures
- Focus on the app 
- Realistic camera effects (bokeh, motion blur)

### Anchor

- Describes how AR objects relate to the real world
- Same Anchoring support as in ARKit
- Owned by the Scene 

### Scene

- Holds the AR content of the app
- Owned by ARview

### Entity

- Building block of every AR object 
- This is the AR content
- Establishes scene structure 
- Provides transform hierarchy
- Owned by the Anchor
