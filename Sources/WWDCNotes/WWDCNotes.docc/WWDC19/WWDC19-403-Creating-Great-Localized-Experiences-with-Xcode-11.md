# Creating Great Localized Experiences with Xcode 11

Learn how your app can support per-app language settings in iOS 13. Get the details on localizing assets with asset catalogs and simplifying your localization workflow with Xcode 11. Understand how to generate screenshots in multiple languages for localization and testing.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/403", purpose: link, label: "Watch Video (34 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



Users can now change the language setting per app, this is huge! 
Available both on macOS and iOS.

This setting is in the system setting, we can forward the user there by calling: `UIApplication.shared.open(URL(string: UIApplication.openSettingsURLString)!)`

Once the language has changed, the app will be relaunched with the new language preference.

15x faster strings extraction from storyboards

## Device-specific strings

We now have `.stringsdict` for device-specific strings:  
this is awesome for iPad apps brought to Mac, because they can now display text like “tap here” and “click here” any without further logic required.

Dictionary Rule: `NSStringDeviceSpecificRuleType`
Values: `appletv`, `applewatch`, `ipad`, `iphone`, `ipod`, `mac`.

## Localizable Assets

Localizable assets directly on the assets catalog (finally!)

![][assetsImage]

[assetsImage]: WWDC19-403-assets