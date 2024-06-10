# What's New in Safari

The latest version of Safari on macOS and iOS is packed with new capabilities that both web developers and their customers will love. Discover how to take advantage of new features including powerful new Safari Extensions APIs for window, tab, and popover management, content blocking notifications, and enhancements to make link following in your Mac apps and iPad Apps for Mac a great experience.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/515", purpose: link, label: "Watch Video (8 min)")

   @Contributors {
      @GitHubUser(Blackjacx)
   }
}



- **Desktop-class website browsing**
- **Legacy Safari Extension Support** dropped for sake of `Content Blockers`, `Share Extensions`, `Safari App Extensions`
- **Safari Extensions**
  - deliver bundles with app OR after notarization via web site
  - Get the visible content of the web page (screenshot)
  - show and dismiss popovers
  - delegate informs about navigating/redirect to new site
- **Content Blocker**
  - associate content blocker with Safari Extension to get notified when content is blocked
- **Universal Links** for macOS so ordinary https links open app if installed
