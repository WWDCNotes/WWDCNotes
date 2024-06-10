# Create Swift Playgrounds content for iPad and Mac

Learn how to create Swift Playgrounds books that work fluidly across both Mac and iPad and help people of all ages explore the fun of coding in Swift. We’ll walk you through how to customize content for each platform while considering platform settings, and help you take advantage of them in your playgrounds while still providing a smooth cross-platform experience.

@Metadata {
   @TitleHeading("WWDC20")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc20/10654", purpose: link, label: "Watch Video (8 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



- Swift Playgrounds on Mac is the same app as in iPadOs thanks to Catalyst.

## Code completion in macOS vs. iPadOS

| ![][iPadImage] | ![][macImage] |
| ----------- | ----------- |
| iPadOS | macOS |

## Customizing content for each platform

### Device availability

In the playground book document format we have two new optional keys:

- In `Manifest.plist`:
  - `SupportedDevices` (array): `iPad` and/or `Mac`.
  - `RequiredCapabilites` (array): possible values defined in [`UIRequiredDeviceCapabilities`][reqDoc]. 

- In `feed.json`:
  - `supportedDevices`: same as above 
  - `requiredCapabilites`: same as above

By setting any of these, the book will only show up on devices that met those requirements.

`RequiredCapabilites` is more flexible than `SupportedDevices` as we can specify exactly which capabilities our book required.

### Code availability

Instead or requiring a specific capability such as `arkit`, you can also use the `#if targetEnvironment()` compilation conditional block to customize content for each platform, for example:

```swift
#if !targetEnvironment(macCatalyst)
// Code to exclude from Mac.
#endif
```

## Respecting platform settings

When creating something for all platforms, instead of using [`liveViewSafeAreaGuide`][liveViewSafe], use [safeAreaLayoutGuide][safeGuide], because there are different layouts/overlays in iPadOS and macOS.

[reqDoc]: https://developer.apple.com/documentation/bundleresources/information_property_list/uirequireddevicecapabilities
[liveViewSafe]: https://developer.apple.com/documentation/playgroundsupport/playgroundliveviewsafeareacontainer/3029546-liveviewsafeareaguide
[safeGuide]: https://developer.apple.com/documentation/uikit/uiview/2891102-safearealayoutguide 

[iPadImage]: ipad.png
[macImage]: mac.png