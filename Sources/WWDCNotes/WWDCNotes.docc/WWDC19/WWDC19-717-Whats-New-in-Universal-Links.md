# What's New in Universal Links

Universal Links allow your users to intelligently follow links to content inside your app or to your website. Learn how the latest enhancements in Universal Links give your users the most integrated mobile and desktop experience, even when your app isn’t installed on their device.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/717", purpose: link, label: "Watch Video (17 min)")

   @Contributors {
      @GitHubUser(Blackjacx)
   }
}



- **macOS 10.15** supports Universal Links with AppKit / UIKit
- **Securely associated** between your app & website
- recommended over custom URL schemes
- **Webserver Config**
  - HTTPS certificate mandatory. Custom root certificates not supported
  - Add the file at `https://yourDomain.com/.well-known/apple-app-site-association`
  - URLs and pattern matching are ASCII

- **App Config**
  - add `Associated Domains` capability and add `applinks:www.example.com` entries (patterns possible - specific subdomains prioritized)
  - `userActivity.activityType == NSUserActivityTypeBrowsingWeb` in `func application(_ application: UIApplication, continue userActivity: NSUserActivity, ...)` indicates Universal Link
  - get URL components `URLComponents(url: userActivity.webpageURL, resolvingAgainstBaseURL: true)`

- **For macOS Apps**
  - app must be on local volume
  - App Store distribution recommended
  - Developer ID signed apps must be launched first
