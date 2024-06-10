# What's new in location

Location technologies are core to delivering context-based services within your app. Discover how the latest privacy controls in Core Location add a whole new dimension to determining position and what that means for your app. We’ll walk you through best practices for implementing these latest location updates and show you how they’re designed to ensure more people get an experience they’re going to love.

@Metadata {
   @TitleHeading("WWDC20")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc20/10660", purpose: link, label: "Watch Video (26 min)")

   @Contributors {
      @GitHubUser(tianskylan)
   }
}



- When apps ask for permission to access user's location, a new option "Precise" has been added
    - This option is also available under Settings for your app
    - Apps cannot opt out of this feature, it's completely under user's control
    - New enum type:

```swift
enum CLAccuracyAuthorization {
    case fullAccuracy
    case reducedAccuracy
}
```

- [API changes to CLLocationManager](https://developer.apple.com/documentation/corelocation/cllocationmanager?changes=latest_minor)
    - `locationManagerDidChangeAuthorization(_: CLLocationManager)` will get called when user change the authorization status or accuracy

- Location delivery
    - `CLLocation` objects will be sent to `didUpdateLocations`, with a center point and large `horizontalAccuracy` value
    - recomputed about 4 times per hour

- Demo of Apple Maps with "Precision: Off"
- When asking for full accuracy:
    - Option 1: Navigate users to Settings app and grant full accuracy permanently. This may not be desirable for users.
    - Option 2: Ask for temporary permission to full accuracy. You need to provide a "purpose key", which is defined in `Info.plist`(You can have multiple entries to explain why you need full accuracy). Once granted, full accuracy will remain for the rest of the app session.

- Region monitoring won't work when precise mode is turned off
    - Send users to Settings when it makes sense

- Accuracy authorization status are synced and shared between iPhone and Apple Watch
- Best practices:
    - Adapt your app for all values of `accuracyAuthorization`
    - Background monitoring behavior will change under `reducedAccuracy`
    - Consider intentionally using `reducedAccuracy` by default

- As of iOS 13.4, users may choose to go from "while in use" to "always" without leaving the app. So it's better for developers to ask for `.authorizedWhenInUse` the first time, and only ask for `.authorizedAlways` when the user accesses a feature that needs it

- App clips
    - No Always authorization
    - "While using" becomes "while using until tomorrow"

- Widgets
    - Get location authorization from parent app, but still needs to specify a key in its `Info.plist`
