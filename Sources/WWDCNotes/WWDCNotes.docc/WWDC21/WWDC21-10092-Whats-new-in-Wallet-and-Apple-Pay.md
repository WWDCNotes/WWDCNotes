# What's new in Wallet and Apple Pay

Discover the redesigned Apple Pay for in-app and web payments and learn how you can incorporate the latest APIs into your app or website. Learn how to add features to your app like coupon codes, improved shipping information, and improvements to the payment detail display screen. And explore changes to Wallet passes, including auto-expiry and multi-pass support for the web.

@Metadata {
   @TitleHeading("WWDC21")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc21/10092", purpose: link, label: "Watch Video (18 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## Wallet updates

- Identity card support (driver's license or state ID)
  - starting in the US, with a few select states
  - your ID is protected by the Secure Element

- HomeKit-connected locks support
  - users can now tap to unlock a door with a home key pass. 

- Multipass downloads from Safari
  - you can bundle multiple pass together to be downloaded at once
  - how to:
    1. zip the `PkPass` files together
    2. set the file extension to `.pkpasses`
    3. use the correct mime type `Mime Type: application/vnd.apple.pkpasses`

- Automatic hiding of expired passes
  - Wallet looks at three `pass.json` fields to determine if a pass should be automatically hidden:
    1. `expirationDate`
    2. `relevantDate`
    3. `voided`
