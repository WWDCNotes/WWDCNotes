# Accessibility Inspector

The Accessibility Inspector enables you to identify parts of your app that are not accessible. It provides feedback on how you can make them accessible, as well as simulating voice-over to help you identify what a Voice Over user would experience. Watch a live-demo of an app being fully debugged in the Accessibility Inspector, and learn how to leverage this powerful tool to make your apps better for everyone.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/257", purpose: link, label: "Watch Video (10 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



While with Xcode 11 we have the new environment overrides, the Accessibility Inspector is the go to place when auditing our app for accessibility.

Accessibility Inspector comes with three tabs:

1. Inspector
2. Audit
3. Settings (like environment overrides)

The Audit tab runs some tests to check how accessible the current screen is, and points out what needs to be done to make the app accessible. This should be done for each screen in the app.

Accessibility Inspector comes with a Color Contrast Calculator (Windows -> Show Color Contrast Calculator)
