# High Performance Auto Layout

Get a glimpse inside to find out what happens when you add a constraint! Dive into the internals of Auto Layout to develop intuition for how your code affects what happens under the hood. Learn how to measure and refine your approach to Auto Layout and see how its improved performance in iOS 12 will speed up your app.

@Metadata {
   @TitleHeading("WWDC18")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc18/220", purpose: link, label: "Watch Video (40 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



Lots of performance improvements (both within `UIKit` and also at app level).

## Render Loop

The Render Loop is the process that runs potentially at **120** times every  second (if your screen is `120Hz`). That makes sure that all the content is ready to go for each frame.

The Render Loop consists of three phases: 

- Update Constraints
- Layout
- Display

![][renderLoopImage]

### Update Constraints

- Runs from the leaf most views up to the view hierarchy towards the window.

### Layout (sub layouts)

- Runs the opposite direction starting from the window going down towards the leaves.

### Display

- Every view gets drawn (if necessary) from window going down

## Autolayout

- It is suggested to use interface builder as much as possible to avoid auto layout performance issues
- Interesting behind the scenes of what happens when we activate a new constraint from 12:00 - 17:00
- Don’t avoid using constraints
- Don’t wedge two layouts into one set of constraints: it creates a lot of false dependencies, and is difficult to debug
E.g.: final layout:
![][finalImage]
When actually it should have been two different layouts:
![][betterImage]

- When in need to change the layout, never remove all the constraints and add them back, change only the necessary ones.
- If a view doesn’t interact with the surrounding views, instead of adding it and removing it (along with its constraints), it’s much better to hide it (isHidden = true)
- If you have shared constraints among your different layouts, initialize them once and never touch them again

## Cost of constraints

- Inequality: very little
- Constant: none
- Priority: needs some amount of work 

How to measure? Instruments for Layout!

## `systemLayoutSizeFitting`

`systemLayoutSizeFitting:` is expensive, as everytime the followings need to execute:

![][fitImage]

[renderLoopImage]: WWDC18-220-renderLoop
[finalImage]: WWDC18-220-final
[betterImage]: WWDC18-220-better
[fitImage]: WWDC18-220-fit