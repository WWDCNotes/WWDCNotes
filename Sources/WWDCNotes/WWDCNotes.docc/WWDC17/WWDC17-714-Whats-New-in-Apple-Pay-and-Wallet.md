# What's New in Apple Pay & Wallet

Apple Pay is the easy and secure way to accept payments in your app and website on iPhone, iPad, Apple Watch, and Mac. Get the latest news and updates from the Wallet and Apple Pay teams. New for this year, increase your conversions by providing feedback to users right in the Apple Pay sheet. Discover great new Wallet features like pass sharing controls, and increase customer satisfaction and sales with UI best practices.

@Metadata {
   @TitleHeading("WWDC17")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc17/714", purpose: link, label: "Watch Video (49 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## What's new with Wallet

- mass deletion interface for your passes
- lighter color scheme
- from iOS 11, only encrypted NFC passes are supported. Register yours at [developer.apple.com/apple-pay](https://developer.apple.com/apple-pay/)

### Opt-out of sharing

- Passes can now be opted-out of sharing
- Useful for single-use items, like loyalty cards or tickets

To take advantage of this, set the new top-level `sharingProhibited` key with value `true` in your `pass.json`:

```json
{
  ...
  "sharingProhibited": true,
  ...
}
```

- Note: users can still share the pass in older versions of iOS.
