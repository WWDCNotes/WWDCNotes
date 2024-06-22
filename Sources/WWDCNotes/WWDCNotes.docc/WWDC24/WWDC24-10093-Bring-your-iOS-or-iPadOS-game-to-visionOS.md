# Bring your iOS or iPadOS game to visionOS

Discover how to transform your iOS or iPadOS game into a uniquely visionOS experience. Increase the immersion (and fun factor!) with a 3D frame or an immersive background. And invite players further into your world by adding depth to the window with stereoscopy or head tracking.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10093", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(halmueller)
   }
}

Focus: how to bring your Metal game into a hybrid environment on visionOS.

Intro: compare Wylde Flowers iPad to Wylde Flowers visionOS.

Two main modes for Metal on visionOS:. 
- run your game as a compatible app in a window. App behaves very similarly to how it would on an iPad. Runs alongside other apps in Shared Space.
- use CompositorServices to run your game as a fully immersive app where the game's camera is controlled by the player's head. See "Render Metal with passthrough in visionOS”.

"In between" is focus of this video. Start with a compatible app and progressively add features to increase immersion, leverage Vision Pro capabilities.

Sample for case study: [Metal Deferred Lighting sample](https://developer.apple.com/documentation/metal/metal_sample_code_library/rendering_a_scene_with_deferred_lighting_in_swift)

Start: compile  app with the iOS SDK and run it on visionOS as a compatible app. Runs in a window.

Go to build settings, select iOS target, add Apple Vision as supported destination.Let’s add Apple Vision as a supported destination, to compile the app with the visionOS SDK. Might have minor compile errors.

Recommended: move to a LowLevelTexture to get the most control.

If you want to render to a CAMetalLayer, you can create a View that contains it. Can create a CADisplayLink to get a callback every frame.

Can use LowLevelTextures in a similar way. Create a LowLevelTexture, then  create a TextureResource from the LowLevelTexture, and use it anywhere in a RealityKit scene. Use CommandQueue to draw to the LowLevelTexture, through an MTLTexture. For more details about LowLevelTexture, see the video “Build a spatial drawing app with RealityKit”.

After converting to native visionOS, can add visionOS specific features.

Example: add frame around the game view, add background in an ImmersiveSpace. 

"Cut The Rope 3" has a dynamic frame around its window. Frame rendered with RealityKit, game rendered with Metal. Code sample.

Add immersive background behind game. Example: Void-X.

Can create background with an ImmersiveSpace in SwiftUI. Can put iOS game in a WindowGroup. Can have shared @State between the window and ImmersiveSpace, by using a SwiftUI @State object.

Example: add stereoscopy to Deferred Lighting sample.

Explanation of stereoscopy and parallax.

If you want objects to come out of the bounds of the rectangle, can render them with RealityKit and APIs such as the new portal-crossing API. See the “Discover RealityKit APIs for iOS, macOS and visionOS” for example of portal-crossing.

"Build compelling spatial photo and video experiences” has details about creating stereoscopic content.

Caution: don't render beyond infinity. Eyes should either converge or be parallel. Very uncomfortable.

Recommended: add slider to the settings of your game, for the player to adjust the intensity of the stereoscopy to their comfort. Implement by changing distance between the two virtual cameras. See game loop of Deferred Lighting sample.

Optimization: use Vertex Amplification to render both eyes with the same draw calls. Article about Vertex Amplification on the developer documentation website.

Example: adapting code of the Deferred Lighting Sample. 

Example: Deferred Lighting sample with head tracking. The camera moves as viewer's head moves.

Use ImmersiveSpace and ARKit. Get head position from ARKit every frame, pass to your renderer. Code sample shown.

Windows and ImmersiveSpaces have their own coordinate spaces on visionOS. The head transform from ARKit is in the coordinate space of the ImmersiveSpace. To use in window,  convert the position to the window’s coordinate space. Code sample shown. Can invert this matrix and convert the head position to the window space. 

For best results, predict the head position (because of render delay). ARKit will do the head prediction if you give it an estimated render time for your app. Sample uses 33 milliseconds for the estimated presentationTime, which corresponds to 3 frames at 90fps. 

To make game look like it is rendered through a physical window, need to build asymmetric projection matrix. A fixed projection matrix will not match the shape of the window. Camera frustum must go through the window. Code sample shown.

Stereoscopy increases immersion of your game but doubles the render cost. Offset some of this by using Variable Rasterization Rates (VRR).

Use VRR to lower resolution at periphery and increase resolution at center. Sample code. Sample video showing changes in AdaptiveResolutionComponent. More details on VRR.

Sample: [Rendering a windowed game in stereo
](https://developer.apple.com/documentation/RealityKit/rendering-a-windowed-game-in-stereo)
