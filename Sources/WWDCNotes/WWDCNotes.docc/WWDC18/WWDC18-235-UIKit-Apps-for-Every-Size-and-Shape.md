# UIKit: Apps for Every Size and Shape

Ground-up coverage of how to make an app that can fit on devices of every size and shape. Make your app fit beautifully on Apple's full range of devices with the minimum amount of effort, future-proofing your user experience along the way.

@Metadata {
   @TitleHeading("WWDC18")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc18/235", purpose: link, label: "Watch Video (40 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## Safe Area and Layout Margins

- All non-iPhone X phones have a safe area that cover the whole screen, only iPhone X has a safe area that is smaller than the whole screen:

| ![][safePotraitImage] | ![][safeLandscapeImage] |

- This is to take care of the on-screen home indicator and the notch (on landscape the safe area is symmetric). But Tvs can also have the same thing where the safe area is smaller than the whole screen
- You can add your own Safe area insets (via a `UIViewController`):
![][additionalSafeImage]

- Use `.directionalLayoutMargins` instead of `.layoutMargins`: the difference is in the declaration: the former uses `.left`/`.right`, while the latter uses `.leading`/`.trailing`: thanks to this difference, the latter adapts automatically to right to left (RTL) languages, while the former doesn’t

## ScrollViews

### Fundamentals

- ScrollViews use contentOffset (`.x` and `.y`) as a way to represent the current scroll position of the scroll view

| ![][offsetImage] | ![][offset2Image] |

- How to extend the scrollable area of a scroll view? `.contentInsets` to the rescue! These are insets we can define ourselves that will go from the edges of the scrollable area to the content inset

| ![][insetImage] | ![][inset2Image] |
| With `contentInset.top = 20` the scrollable area is `20` points more, note how the `contentOffset` is not affected by the inset. | we can scroll until the offset is `-20` |

- From iOS 11 every `UIScrollViewController` has a new (read only) property called `.adjustedContentInset`:
![][adjustedContentImage]
 `contentInset` is what we define, `system inset` is safe area and more, eg:
![][statusBarImage]

## Building Adaptive Apps (put all together)

Let’s see an example:

This screen has a (1) content view (vertical scroll), embedded in a (2) navigation view, embedded in a (3) tab bar:
![][exampleImage]

- The tab bar sees only the safe area insets of the screen (home indicator + status bar):
![][tabbarSafeImage]

- The navigation controller is inside the tab bar, therefore it sees a smaller safe area that includes also the tab bar:
![][navigationSafeImage]

- Finally the content view controller has an even smaller area because of the navigation view:
![][contentSafeImage]

The idea of safe areas is **encapsulation**: one view shouldn’t know, nor care if it’s running on a iPhone X or else.

If you want to hide the status bar: you shouldn't because it doesn’t work on iPhone X.

What you can do is remove both the status and navigation bars at the same time: this way the experience will be more immersive.

## Rendering text on a wide environment

iOS provides a readable width that we are recommended to use all the time, this width is based on the user selected dynamic type (and probably other accessibility options in the future):

```swift
extension UIView {
  var readableContentGuide: UILayoutGuide { get }
}
```

| ![][iPad1Image] | ![][iPad2Image] |

This guide works in also in narrow environments like the split screen above.

To adopt this in `UITableView`(s) there’s a property to set to `true`:

| ![][table1Image] | ![][table2Image] |

⚠️ the default value is `false` in iOS 12, but `true` in earlier iOS (iOS 11...) ⚠️

This parameter can be changed from the storyboard as well:

![][storyboardImage]

Apple suggests to leave the default value unless you know that you will display a lot of text in the table.

By default `UITableViewCell` `.background` and `.selectedBackground` will extend beyond the safe area, its content won’t:

![][cellContentImage]

If you want the content to also extend beyond the safe area, here’s how:

![][cellContent2Image]
![][cellContent3Image]

[safePotraitImage]: WWDC18-235-safePotrait
[safeLandscapeImage]: WWDC18-235-safeLandscape
[additionalSafeImage]: WWDC18-235-additionalSafe
[offsetImage]: WWDC18-235-offset
[offset2Image]: WWDC18-235-offset2
[insetImage]: WWDC18-235-inset
[inset2Image]: WWDC18-235-inset2
[inset3Image]: WWDC18-235-inset3
[adjustedContentImage]: WWDC18-235-adjustedContent
[statusBarImage]: WWDC18-235-statusBar
[exampleImage]: WWDC18-235-example
[tabbarSafeImage]: WWDC18-235-tabbarSafe
[navigationSafeImage]: WWDC18-235-navigationSafe
[contentSafeImage]: WWDC18-235-contentSafe
[ipad1Image]: WWDC18-235-ipad1
[ipad2Image]: WWDC18-235-ipad2
[table1Image]: WWDC18-235-table1
[table2Image]: WWDC18-235-table2
[storyboardImage]: WWDC18-235-storyboard
[cellContentImage]: WWDC18-235-cellContent
[cellContent2Image]: WWDC18-235-cellContent2
[cellContent3Image]: WWDC18-235-cellContent3