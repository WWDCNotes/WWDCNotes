# Build a SwiftUI view in Swift Playgrounds

Easily prototype and play around with SwiftUI views when you use them with Swift Playgrounds. We’ll show you how to build a SwiftUI view in a Xcode-compatible playground, and explore tools to help you easily edit and preview your code.

@Metadata {
   @TitleHeading("WWDC20")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc20/10643", purpose: link, label: "Watch Video (14 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## Creating an Xcode-compatible Playground (from the Swift Playgrounds app)

From main app screen: 

1. tap `See All` button in the bottom right hand corner of the screen.
2. scroll to the end of the `Starting points` section  
3. tap `Xcode Playground`

![][startingPointsImage]

## Showing a SwiftUI live view

After opening a playground:

1. import the [`PlaygroundSupport`][psDoc] framework, which lets us customize the behavior of the playground, including showing live views

```swift
import PlaygroundSupport
```

2. set the playground live view with the your view /

```swift
PlaygroundPage.current.setLiveView(WWDCNotesView())
```

3. tap the `Run my Code` button in the bottom right of the screen to show the live view.

[psDoc]: https://developer.apple.com/documentation/playgroundsupport

[startingPointsImage]: startingPoints.png