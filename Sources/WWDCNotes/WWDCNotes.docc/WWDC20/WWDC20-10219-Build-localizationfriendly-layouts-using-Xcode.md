# Build localization-friendly layouts using Xcode

Localizing your app is a wonderful way to share your work with a worldwide audience and make it relevant to more cultures and languages. We’ll show you how you can prepare for localization before ever translating a word by building thoughtful layouts for your app. Learn how to structure your UI in Xcode, identify common issues prevalent with more verbose and right-to-left languages, and easily adapt your interfaces to provide a great experience for everyone.

@Metadata {
   @TitleHeading("WWDC20")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc20/10219", purpose: link, label: "Watch Video (15 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## Design best practices

- Avoid fixed widths or frames
- Avoid fixed spacing between distant objects
- Allow multiple lines of wrapped text when it makes sense
- Do not place too many controls in a fixed space (e.g. four buttons side by side)

## Demo project

The [demo project][dwl] comes with a `ReadjustingStackView` which switches axis (horizontal -> vertical) when the optimal horizontal space, computed via [`systemLayoutSizeFitting()`][systemLayoutSizeFitting()], exceeds the available space.

[dwl]: https://developer.apple.com/documentation/xcode/autosizing_views_for_localization_in_ios
[systemLayoutSizeFitting()]: https://developer.apple.com/documentation/uikit/uiview/1622624-systemlayoutsizefitting