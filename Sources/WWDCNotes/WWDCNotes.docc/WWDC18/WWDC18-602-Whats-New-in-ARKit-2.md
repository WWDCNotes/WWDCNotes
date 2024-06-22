# What’s New in ARKit 2

ARKit 2 makes it easy to develop vivid augmented reality experiences and enable apps to interact with the real world in entirely new ways. Discover how multiple iOS devices can simultaneously view an AR scene or play multiplayer AR games. Learn about new capabilities for tracking 2D images, and see how to detect known 3D objects like sculptures, toys, and furniture.

@Metadata {
   @TitleHeading("WWDC18")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc18/602", purpose: link, label: "Watch Video (57 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## `ARWorldMap` persistence

After the user ends a session (say in front of a table and the user put objects on the table), the user can go back again another day in front of the same table and the app can recognize the table and put back all the objects as the user placed them as in the previous session

## Multi-User Experiences

The `ARWorldMap` are sharable and this is why we can play an ar game at the same time with multiple devices

## More robust tracking and plane detection

Both horizontal and from ARKit 1.5 vertical.

## (Real Time) Environment Texturing

![][benchImage]

Even if ARKit doesn’t know the whole scene (because the user didn't spin 360-degrees around), ARKit will use CoreML to “hallucinate” the missing parts.

## Real Time Multiple 2D Images Tracking:

Track position and orientation in each frame, pictures no need to be static

![][tableImage]

You need to import the reference images to Xcode.

## Object Tracking

Track positions of fixed objects (you can move around them but the object can’t move), you need to import a 3d model of the object into xcode, Apple gives you a (free) app to scan the object and get the 3d object

## Face Tracking

- Gaze tracking

![][eyeImage]

- Tongue tracking (as in memojii)

[tableImage]: WWDC18-602-table
[benchImage]: WWDC18-602-bench
[eyeImage]: WWDC18-602-eye