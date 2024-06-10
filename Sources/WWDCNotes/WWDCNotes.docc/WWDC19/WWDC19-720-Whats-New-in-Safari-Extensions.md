# What's New in Safari Extensions

Safari Extensions surface your app's unique capabilities within Safari. Discover how the latest features such as content blocking notifications and user interface management and control innovations for pages, tabs, and popovers make your Safari App Extensions and Content Blockers even more powerful. Learn about the latest APIs and best practices for communicating between your extension and your app.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/720", purpose: link, label: "Watch Video (19 min)")

   @Contributors {
      @GitHubUser(Blackjacx)
   }
}



- **Distributable** via
  - App on App Store (show up immediately in Safari)
  - App on your web site after running through the notarization service (show up in Safari after first launch of the app)

- **Unsigned Extensions** must be allowed each time Safari is run from the Developer menu
- **ContentBlocker** can now tell Safari App Extensions bout its activity
- **Page Navigation Delegate** informs about navigating/redirect to new site
- Adopting ContentBlocker and PageNavigation extensions allows 
  - replacing arbitrary content on websites
  - updating toolbar icon badge, e.g. with content items blocked count
  - blocking certain content from web sites you browse on

- **Screenshots** of web sites are now possible
- **Tab, Window, Page management**
  - Get base URI from native code without injection of script
  - Directly navigate to certain tabs without scripting from the extension
  - All open tabs and windows are visible from an extension

- **Popovers** can be shown/dismissed programmatically
- **Communication between App and Extension**
  - Possible by NSXPCConnection (extension and app must be part of the same app group)
  - Share data by using `UserDefaults(suiteName:)`
  - Sending messages from app >>> extension: `SFSafariApplication.dispatchMessage` 
  - Receive message in extension by implementing `SFSafariExtensionHandling.messageReceivedFromContainingApp` (Possible also when safari is not running - launched eventually)
