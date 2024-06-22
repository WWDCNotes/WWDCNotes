# Your Apps and the Future of macOS Security

Apple is on a mission to advance the state of Mac security, and we want your apps to be there with us. Learn about new protections for user data, new capabilities with Developer ID, and how you can best secure your apps.

@Metadata {
   @TitleHeading("WWDC18")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc18/702", purpose: link, label: "Watch Video (40 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



Background Tag Reading! Only from iPhone Xs line up.

## Requirements

- The NFC needs to have a universal link associated with it, so the phone can understand which apps to open.
- By default Safari will process the NFC tags with universal links to apps not in the device.

## Availability

Anytime the screen is on except:

- Device has never been unlicked
- Core NFC reader session is active
- Apple Wallet in use
- Video camera in use
- Airplane mode

## How to manage the tag delivery in your app.

Like any other `NSUserActivity` instance, via the `appDelegate` `application(_:continue:restorationHandler:)`.

Access the `ndefMessagePayload` property of the `NSUserActivity`.

For universal link, we need to register the Associated Domains in the app capabilities.