# Support performance-intensive apps and games

iOS and iPadOS provide powerful capabilities to help developers deliver breakthrough apps and games across all device generations. In certain instances, however, demanding apps with exceptional performance requirements may only be able to provide the best experience on devices with an A12 Bionic chip or higher. 

@Metadata {
   @TitleHeading("WWDC20")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc20/10621", purpose: link, label: "Watch Video (5 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## Required device capabilities

- If your app requires a specific hardware capability (e.g. ARKit) then you should declare so via the [`UIRequiredDeviceCapabilities`][UIRequiredDeviceCapabilities] property list key. 
- This prevent users from downloading apps that their device doesn't support.
- You’re allowed only to maintain or relax capability requirements. Submitting an update with added requirements is not allowed.
- For a complete list of capabilities and devices compatability, see [here][list].

### iphone-ipad-minimum-performance-a12

- For intensive apps there's a new `iphone-ipad-minimum-performance-a12` capability key that will allow apps to be downloaded only in devices with A12 or later hardware.
- This key has been created to support intensive and desktop-quality apps.

[UIRequiredDeviceCapabilities]: https://developer.apple.com/support/required-device-capabilities/
[list]: https://developer.apple.com/support/required-device-capabilities/