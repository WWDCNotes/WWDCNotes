# Build scalable enterprise app suites

Learn how to build focused enterprise apps that work well together. In this session, we’ll introduce you to Apple Retail’s suite of enterprise apps, which help employees interact with customers, track operations, manage stores, and stay connected. Discover how Apple Retail created a unified set of apps by adopting Swift Packages and testing for app scalability. And explore how managing apps in production with configurations can help tailor app suites to different regions and locations.

@Metadata {
   @TitleHeading("WWDC20")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc20/10142", purpose: link, label: "Watch Video (15 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## Architecting for sharing across apps
### App groups

- How To:
  1. Create and enable app groups in the `Signing & Capabilities` of your project(s) file in Xcode (add a new `App Groups` capability)
  2. Enable it in the developer portal

- App Groups enable sharing data via [`UserDefaults`][usDoc] (via a [shared suite][suiteDoc]) and shared files
  
### Build and use Swift packages

- Separate and focus concerns in different packages
- This makes it clear for new comers to understand the projects

- Suggested Package Candidates:
  - Authentication layer
  - Image fetching and caching
  - Design system
  - Application model layer
  - Barcode and text scanning, this gives a common look and feel for your bar code, QR and text recognition across each app.

## Testing your apps for reliability

- break down tests by importance, this allows you to run the most important tests more frequently than others. The more frequent they're run, the quicker you can catch any failures.
  
- test rendering performance
- test battery performance
- use [Instruments][19-411] to detect where your code pitfalls are

## Managing your app after production release with configurations
 
- server-side configurations allow you to have more flexibility and adaptability around the user experience in your application.
- the server can distribute different configurations based on geolocation, market, or even more narrower level.
- changing these attributes in production does not depend on any code changes.
- this provides a great flexibility where some features may not be used for certain locations, markets, or elsewhere
- configurations free up developer time from maintenance
- configurations can be used to force the user to update the app

[usDoc]: https://developer.apple.com/documentation/foundation/userdefaults
[suiteDoc]: https://developer.apple.com/documentation/foundation/userdefaults/1409957-init
[19-411]: ../../wwdc19/411
