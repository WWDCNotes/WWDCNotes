# Building Great Shortcuts

Shortcuts enable people to quickly and easily accomplish actions or get things done hands-free using Siri and the Shortcuts app. Join us for a tour of where shortcuts can appear, how you can customize the experience, and how your app’s shortcuts can be used with variables and actions from other apps.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/805", purpose: link, label: "Watch Video (11 min)")

   @Contributors {
      @GitHubUser(Blackjacx)
   }
}



- Summary of an Action should be short and only contain necessary parameter
- Best way to add shortcut is right inside the app after the action that should be added has been completed
- Offer to add shortcuts for repeatable actions
- **Activation Phrase** should be short and pronounceable
- **Suggested Shortcuts List** can be updated by app via API a often as wanted. Apple also populated this list based on device usage like recently used apps.
- **Input and Output** concept used to make actions work together. Actions can now output information for others to use, e.g. action could find a note wheas action 2 processes this. Both can be chained together.
- **Intent Editor** lets the developer modify intents
