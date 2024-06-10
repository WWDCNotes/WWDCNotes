# Meet Group Activities

Learn more about the framework powering SharePlay, and discover the different types of shared experiences you can implement for people who use your app. Explore a high-level overview of the framework’s architecture and concepts, including how Group Activities and AVFoundation work in tandem, and learn how to implement it into your app. This is a great starting point to know more about SharePlay and how to integrate Group Activities in your apps.

@Metadata {
   @TitleHeading("WWDC21")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc21/10183", purpose: link, label: "Watch Video (17 min)")

   @Contributors {
      @GitHubUser(Jeehut)
   }
}



- "Smart volume" ensures spoken parts are understandable by reducing content volume
- Based on server-side content access, only works if all participants have access
- `GroupActivity` protocol needs to be implemented for content objects
- A Group session object will be provided by system to adjust playback
- `GroupSession` object gives access to participants, has API for syncing data
- The entire communication is end-to-end encrypted
- The shared experience doesn’t have to be video/audio, could also be the creation of a document or anything else like drawing together
- App needs to iterate on sessions (`AsyncSequence` object)
- Loading up assets for shared experience while joining a session possible
- After join called, there’s a `GroupActivity` channel to sync data (any actions possible)
- Posting events possible, e.g. when someone pauses, notifies others in channel
- Also supports playback syncing via Web on macOS
