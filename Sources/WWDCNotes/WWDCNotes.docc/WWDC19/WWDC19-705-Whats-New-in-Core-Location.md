# What's New in Core Location

Location technologies are core to delivering context-based services within your app. Discover how the latest features in the Core Location Framework lay the groundwork for advanced ranging capabilities and delivers more options for you to clearly communicate your location needs to your users, and allow them to provide more granular access authorization to your app.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/705", purpose: link, label: "Watch Video (35 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## iOS 13 Authorization Flow

New authorization flow for core location:
If the user presses not allow, that’s it (as before).

If we request _Always On_ authorization, `locationManager.requestAlwaysAuthorization()`, in iOS 13 the user gets this:

![][allowOnceImage]

Therefore, regardless if we ask for _when in use_ “only” or _always_, this is the pop up that the user will get.

However, if: 

- The app has asked for _Always On_
- The user has granted the most prominent option (_Allow While in Use_, as seen in the screenshot above)

At this point iOS will grant a provisional “_Always On_” authorization to our app, even when the user has tapped _Allow While in Use_.

At this point the app can act as if the real _Always On authorization_ has been granted.

When something happens that would require the _Always On_ authorization, **then and only then** iOS will request for that _Always Allow_ authorization in the app behalf:

![][alwaysAllowImage]

Then, and only then, both the app and the user will be on the same page.

## New in iOS 13

All core location APIs are available as long as any authorization is granted. 

From now on, the difference between “_When In Use_” and “_Always_” is that things can be started when the app is not in use if the “_Allow Always_” authorization has been granted.

## When is the app in use?

- When the app is in the foreground and for a few seconds after it has been put in the background (grace period).

- If we set to `true` the location manager property `allowsBackgroundLocationUpdates`, our app will be considered in use even after the app has been put in the background, and the blue status bar indicator will appear. 

- Watch complications are considered always in use.

Therefore, from iOS 13, even apps with only “_When In Use_” authorization can do background tracking.

## Allow Once

In iOS 13 ww also have a temporary _Allow Once_ authorization:  
from the app point of view, this will become a “_When In Use_” grant until the app is no longer in use, after which the authorization will go back to the “_not determined_” status. After which the app can once again ask for authorization.

[allowOnceImage]: WWDC19-705-allowOnce
[alwaysAllowImage]: WWDC19-705-alwaysAllow