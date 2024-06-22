# New Localization Workflows in Xcode 10

The localization process in Xcode 10 has been updated to aid you through the lifecycle of exporting, importing, and testing localized content in your apps. See new functionality added in Xcode 10 and learn how the new localization catalog helps you build world-class, localized apps.

@Metadata {
   @TitleHeading("WWDC18")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc18/404", purpose: link, label: "Watch Video (41 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



- Backward compatible with “old” workflow (a.k.a, you can still import just the `.xliff` files as usual)
- Xcode 10 export function now exports a “localization artifact” with `.xcloc` extension (**XC**ode **LO**calization **C**atalog), one file per language
- This `.xcloc` file, beside the usual `.xliff`, also includes anything that is marked as localizable in the app (like image assets and more), and also provides additional contextual information (to help the translator make better translations).
- `.cxloc` architecture:
![][Image]

- In the “Notes” folder we can drop whatever we want (screenshots, videos, ..)
- The “Source Contents” folder mimics the our project folder structure and includes the original language we’ve build our app with (it includes storyboards)
- Can localize Intents (for Siri Shortcuts) and responses

[Image]: WWDC18-404-image