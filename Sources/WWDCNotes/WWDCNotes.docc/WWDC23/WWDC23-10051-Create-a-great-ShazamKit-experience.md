# Create a great ShazamKit experience

Discover how your app can offer a great audio matching experience with the latest updates to ShazamKit. We’ll take you through matching features, updates to audio recognition, and interactions with the Shazam library. Learn tips and best practices for using ShazamKit in your audio apps.

@Metadata {
   @TitleHeading("WWDC23")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc23/10051", purpose: link, label: "Watch Video (21 min)")

   @Contributors {
      @GitHubUser(rogerluan)
   }
}



## Intro

- ShazamKit is a framework that can bring audio recognition into your apps.
- You can match against Shazam's music catalogs, or your own custom prerecorded audios.

## Overview

![ShazamKit match flow][match]

Thus, the implementation overview is rather simple:

1. Ask for microphone permission from the user.
2. Start recording.
3. Pass the recorded audio buffers to ShazamKit.
4. Handle the results from ShazamKit.

## New this year

- `SHManagedSession`: automatically handles recording, removing the hassle of setting up audio buffers, managing the recording session, and checking for microphone permission (although microphone permission is still required).
- You can call `prepare()` to start prerecording ahead of time, so matches return faster when asked.
- `SHManagedSession` has 3 states:
    - `idle`: the session has completed a single match result, or was cancelled, or terminated async sequence of results.
    - `prerecording`: `prepare()` was called.
    - `matching`: session is making at least 1 match attempt.

- `SHLibrary`: add media items to the Shazam library, list the items you (and not any other app!) have added, and delete them.

# Related Sessions

- [Create custom catalogs at scale with ShazamKit - WWDC22]()
- [Explore ShazamKit - WWDC21]()
- [Discover Observation in SwiftUI - WWDC23]()

[match]: WWDC23-10051-match
