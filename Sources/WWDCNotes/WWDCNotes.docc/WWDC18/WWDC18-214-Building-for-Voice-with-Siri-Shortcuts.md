# Building for Voice with Siri Shortcuts

Siri Shortcuts are a great way to help people execute actions or get information from your app, but shortcuts can be made even more powerful by adding them to Siri to be used with a simple phrase. Learn how you can now customize responses from Siri and add custom UI to make a great shortcuts experience across iOS, watchOS and HomePod. See how to allow users to add and manage shortcuts from right within your app and learn best practices to make shortcut suggestions that can be exposed through Settings.

@Metadata {
   @TitleHeading("WWDC18")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc18/214", purpose: link, label: "Watch Video (36 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



- Four types of custom responses:
  - Confirm (e.g. confirm you want to book a ride)
  - Success (let the user know that the action the user asked has been done successfully, like your order is completed)
  - Information (e.g. provide weather forecast, transit directions, etc)
  - Error (let the user know what went wrong)
- For the custom responses you can define custom properties (data from your app) and template
- Intent UI Extensions are awesome (check out [What’s new in Sirikit][wwdc17214])
- When you donate a `NSUserActivity` instance, you can specify title (this should represent what actions is taken when the user runs it, be super concise), subtitle (more info, you can also use the custom properties here as well), image and suggested invocation phrase
- You can even create suggested intentions: the user will find these in the settings even if the user never took one of these in the app
- You can present an action “Add to Siri” within your app (basically: import IntentsUI, INIUIAddVoiceShortcutViewController(shortcut: shortcut) and present it)
- You can also present a (system) ViewController showing the current Intents added to Siri

[wwdc17214]: https://developer.apple.com/videos/wwdc/2017/?id=214