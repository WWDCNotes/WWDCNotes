# Design great visionOS apps

Find out how to create compelling spatial computing apps by embracing immersion, designing for eyes and hands, and taking advantage of depth, scale, and space. We’ll share several examples of great visionOS apps and explore how their designers approached creating new experiences for the platform.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10086", purpose: link, label: "Watch Video (19 min)")

   @Contributors {
      @GitHubUser(halmueller)
   }
}

Demos of 10 third-party apps that do a nice job on visionOS.

Design aspects:
- Intentional
- Immersive
- Comfortable
- Delightful

Developers: find your key moment, the one that's optimized for visionOS. Example: Mindfulness app, flower expands and breathes.

### Strategies

One approach: think of ways your app can make new things possible.

Example: Jigspace app, deconstructing/animating jet engine. Photorealism. Animations. Manipulate models that you can't manipulate in the real world.

Example: Loona. Iterate, prototype. 2D windowed app on iPhone/iPad becomes animated 3D model.

Complementary app: Lowe's. Entirely tailored to visionOS, "Lowe's Style Studio". Visualize how different products would look together. Store maps/orders etc are omitted from visionOS, but all info syncs across all platforms.

Consider native frameworks like ARKit and RealityKit. Take time up front to build/test/iterate.

### Immersion

- Transport people somewhere new
- Integrate with physical surroundings
- Design meaningful sound

Example: Sky Guide. Choose any location in the world, use hands as binoculars, pluck constellations out of the sky.

Great environments replicate an accurate sense of depth and scale. Not relevant for every app, though.

Often overlooked: integrate with peoples' physical surroundings. Example: Super Fruit Ninja. Splatters on wall, fruit fragments bouncing off furniture, Truffles The Pig interacts realistically.

Sound: sensors on the device understand your physical space. System adds  reverberation of your app's sounds for realism. Use audio as feedback, guides, rewards, like iOS uses haptics. Example: Blackbox, by Shapes and Stories. Puzzle app, sounds integrate with actions when solving puzzles.

### Comfortable
All apps demoed today require minimal physical movement. You can't predict physical spaces where your app will be used. Example: Super Fruit Ninja doesn't require you to walk, has geometric boundary on ground. Jigspace models can be walked around, or resized.

Content and UI should be contained in a window. Toolbars/tabbars can live outside, but keep them anchored to the view. Clear delineation of your app.

"Spatial UI" doesn't mean arbitrarily free-floating UI elements.

Infinite canvas/cohesive experience example: PGA Tour. Main window has live streams and tournament information. Volume has viz of corresponding coure, shot trail replay. Volume is locked to view, easy to manage.

Visually comfortable experiences blend with surrounding world, e.g. Glass material, rendered differently depending on lighting. No notion of light/dark mode.

Branding example: Red Bull. Dark blue branding color was dropped for usability. High quality visual imagery is the highlight. Solid backgrounds are distracting and uncomfortable, don't adapt to environment, block our view of the world. Dark blue brand color is briefly visible as images are loading.

Hover effects: Carrot Weather does a great job of using hover effect correctly. Tons of data, but only interactive elements have hover.

60 points of space for tap targets. Too small hover effect == frustrating, uncomfortable.

Exceptional craft: DJay by Algoriddim. Fully interactive DJ setup. Detailed walkthrough.

Keep interactive content close to people.

Movement/animation lets people know that something is interactive.

Mimic real world interactions. Example: hold one hand to ear, mimcs DJ using one ear of headphones to preview next track. Account for false positives, needed lots of user feedback and testing.

Abstract away complexities. Example: matching tempo/syncing tracks. Manual in real world, automated in DJay app.

Resources:
- Human interface guidelines
- Design Resources: extensive Figma and Sketch libraries, with native components.

