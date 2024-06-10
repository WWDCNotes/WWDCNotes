# Introducing Core NFC

Core NFC is an exciting new framework that enables you to read NFC tags in your apps on iPhone 7 and iPhone 7 Plus.  Learn how to integrate Core NFC into your apps, key requirements for using this feature, and start thinking about the new kinds of apps that are enabled with NFC capabilities.

@Metadata {
   @TitleHeading("WWDC17")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc17/718", purpose: link, label: "Watch Video (11 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



Currently iPhone supports only *reading* NFC, they can’t write to NFC tags (this changed from iOS 13, any iPhone from 7 and later can write).

To use Core NFC capabilities we need to:

- enable its entitlement.
- add a usage description in the `info.plist`

How to read:  
The app has to start a “tag reading session”, which will be valid as long as the app stays in the foreground with the NFC UI visible (see below). Each session has a 60 seconds lifespan, after which a new session has to be started.

Two modes:

- Single Tag: the session aims to read one tag and will end as soon as any tag is read.
- Multiple Tags Session: the session will continue even after reading one or more tags (up to 60s).

NFC UI:

![][uiImage]

[uiImage]: ui.png
