# Meet the Location Button

Meet CLLocationButton: a secure interface element that provides an easy, low-friction way to grant your app location access only when and where it is needed. Learn how you can add CLLocationButton to new or existing code, how to customize it within interface legibility guidelines, how to recognize and address customization failures, and how it interacts with iOS’s traditional prompt-based Location Services authorization.

@Metadata {
   @TitleHeading("WWDC21")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc21/10102", purpose: link, label: "Watch Video (13 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



- New quick authorization button:
  - [`CLLocationButton`][CLLocationButton] for UIKit
  - [`LocationButton`][LocationButton] for SwiftUI

- these buttons give your app Allow-Once authorization, without prompting user authorization every time it's tapped
- available on watchOS, iOS, macOS with Catalyst, and iPad apps on Mac

## Customization

### (UIKit) CLLocationButton

This is a UIButton with customizable parameters:

- `CLLocationButtonIcon` to set the type of the arrow
- `CLLocationLabel` to set the label of the button
- `cornerRadius` to set the roundness of the button
- `fontSize` to set the size of the label

### (SwiftUI) LocationButton

```swift
LocationButton(.currentLocation) { 
  // do something on button press...
}
.foregroundColor(.white)
.cornerRadius(15.0)
.labelStyle(.titleAndIcon)
.symbolVariant(.fill)
.tint(.blue)
```

### Warning

Note that not all customization are possible, Xcode will warn you with log messages when the minimum requirements are not met, for example:

```lldb
#locationButton rendering failed due to inappropriate sizes 
#locationButton rendering failed due to Insufficient Alpha
#locationButton rendering failed due to contrastRatio between tintColor and backgroundColor insufficient 
```

## Prompt

- If your app already have any kind of location authorization, then the button will work right away
- If your app doesn't have any permission yet, tapping the location button will trigger a one-time prompt (which won't be shown again when tapped again), see below
- this same prompt is shown if the user previously denied your app location permission access

![][oneTimePrompt]

[oneTimePrompt]: WWDC21-10102-oneTimePrompt
[CLLocationButton]: https://developer.apple.com/documentation/corelocationui/cllocationbutton
[LocationButton]: https://developer.apple.com/documentation/corelocationui/locationbutton
