# Create App Clips for other businesses

Create App Clips for table reservations, food ordering, and more on behalf of brands, businesses, or services that appear within your app. We’ll show you how you can deliver customized experiences for each business, offering them a unique look, invocation card, and icon — all within a single App Clips binary. Learn best practices for uploading unique metadata, handling links, routing notifications, and keeping track of session states. And discover different types of icons in the context of App Clips, where they appear, and how to customize them.

@Metadata {
   @TitleHeading("WWDC20")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc20/10118", purpose: link, label: "Watch Video (19 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## When should you consider offering App Clips for other businesses

When your app aggregates many businesses in a customer-facing app.

Having Advanced App Clip Experiences let you customize the UI for each business:

![][shinyImage]

## Type of Advanced App Clip Experiences

![][comparisonImage]

## How-to

The way to do this is the standard way to create App Clips: see session [`Configure and Link Your App Clips`][wwdc20-10146] for more info.

## Route Notifications to the right app clip experience

In the notification payload, specify the targeted App Clip id via `targetContentIdentifier`, the app clip with the longest prefix match will get the notification.

For more information, refer [here][notificationsDoc].

## App Clip Experience Icons a.k.a. Businesses Icons

Beside the main app icon, we also get App Clip Experience icons, which are used to display a specific App Clip Experience icon, which can be completely different than the main app icon.

This icon will be shown like any other app icon in the App Library, Spotlight, Siri proactive suggestions, and in other apps such as messages.app.

These custom icons come from Apple's Maps Point of Interest Icon: businesses can upload their icon via [Maps Connect][mc]

If the business does not have uploaded a custom icon, the system will display a generic POI of interest image like "Food" and "Shopping":

![][poiImage]

[wwdc20-10146]: ../10146
[notificationsDoc]: https://developer.apple.com/documentation/app_clips/enabling_notifications_in_app_clips
[mc]: https://mapsconnect.apple.com

[shinyImage]: WWDC20-10118-shiny
[comparisonImage]: WWDC20-10118-comparison
[poiImage]: WWDC20-10118-poi