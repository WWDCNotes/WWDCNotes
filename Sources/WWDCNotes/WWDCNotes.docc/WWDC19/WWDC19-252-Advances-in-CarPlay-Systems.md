# Advances in CarPlay Systems

CarPlay is a smarter, safer way to use your iPhone in the car. Learn how to update your vehicle system to take advantage of new features in iOS 13. Add support for dynamically changing screen sizes, second screens such as instrument clusters, and even irregularly shaped displays. Learn how to support "Hey Siri" for hands-free voice activation.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/252", purpose: link, label: "Watch Video (16 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## Irregularly shaped displays

From iOS 13, like in UIKit, air play now gets a view area and a safe area.

## Second Screen Support

Some cars have a second screen in the instrument cluster (in front of the wheel):
From iOS 13, our iPhones can now send a second, separate stream over there as well.

![][screenImage]

We can have multiple screens in the Instrument cluster.
Every screen has its own “night mode”, therefore different screens might have different modes. 

## Dynamic Screen sizes

From iOS 13, a screen can change size (to let more space for other car dashboard elements for example).

[screenImage]: WWDC19-252-screen