# Introducing PencilKit

Meet PencilKit, Apple's feature-rich drawing and annotation framework. With just a few lines of code, you can add a full drawing experience to your app — with access to a canvas, responsive inks, rich tool palette and drawing model. Hear the technical details that make a great Apple Pencil experience. Learn about the new screenshot editor and how you can adopt just a few small APIs to enable your full content to be captured beyond the size of the screen, with or without your app's user interface.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/221", purpose: link, label: "Watch Video (34 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## Before `PencilKit`

How to use the pencil at full:

- Force, azimuth, and altitude allow expressive marks 
- Pencil taps switch modes (for pencil 2nd gen)

![][pencilChartImage]

## Pencil behind the scenes

The Pencil gives us:

- a uniquely, precise **touch location** on the screen, 240 times/second.
- an **azimuth**, which is the angle around the perpendicular of the iPad. And it gives us **altitude or tilt**, which is the steepness at which the user is holding the Pencil. The Pencil generates a second hit and touchpoint on the surface of the iPad. And using trigonometry, it uses that to calculate azimuth and altitude. This is a _hidden_ sensor in the pencil.
![][azImage]

- A **force/press** value, the Pencil has an axial force sensor that detects the pressure and it sends that data over Bluetooth. 

There are a few consequences of all of this:

- Azimuth/altitude may be estimated (when users covers this second point with their hands)
- Azimuth is imprecise when the pencil is perpendicular
- Force data is delayed (as Bluetooth is slower than whatever the Pencil uses to transfer the rest of the data)

Because the force data is delayed, when we lift the pencil there's the last region of the stroke that's still waiting for those final force values:
we need to keep listening to them even after touch has ended. 

It's possible that the user starts drawing the next stroke before the last stroke has gotten all the final press values.  
Apple suggests to use a serial queue to only be handling one stroke at a time. The time is short enough that the user won't notice.

How to work for best latency:
- Render with metal
- Use predicted touches

## What is [`PencilKit`][pkDoc]?

`PencilKit` makes it easy to incorporate hand-drawn content into your iOS or macOS apps quickly and easily. PencilKit provides a drawing environment for your iOS app that takes input from Apple Pencil, or the user's finger, and turns it into high quality images you display in either iOS or macOS. The environment comes with tools for creating, erasing, and selecting lines.

In short, `PencilKit` lets 3rd party apps use the annotation interface that we use when taking a screenshot.
Three lines of code to start doodling:

```swift
let canvas = PKCanvasView(frame: bounds)
view.addSubview(canvas) 
canvas.tool = PKInkingTool(.pen, color: .black, width: 30) 
```

`PKCanvasView` provides (we provide) the drawable region of the app.

It’s a scrollview (can pan and zoom), from the session is not clear how we can manage this.

`PKDrawing` model captures the user strokes: it’s the data model of PencilKit. 
It has a data format and it allows us to load and store drawings to data.

`PKTools` are the tools that we let users to use in the canvas (think like pen, pencil, brush..). We can enable/disable tools, even choose the available colors.

## Screenshots

When taking a screenshot, we can now provide a better version of the current screen as a pdf (like in safari, we can choose to get the current screen screenshot, limited by the screen boundaries, or we can ask Safari to give us the whole web page, not just the screen crop, without all the unnecessary safari UI).

We do this by setting the property [`screenshotService`][ssDoc] of the new `UIWindowScene`.

We must return a `.pdf`

[pkDoc]: https://developer.apple.com/documentation/pencilkit
[ssDoc]: https://developer.apple.com/documentation/uikit/uiwindowscene/3213938-screenshotservice

[pencilChartImage]: WWDC19-221-pencilChart
[azImage]: WWDC19-221-az