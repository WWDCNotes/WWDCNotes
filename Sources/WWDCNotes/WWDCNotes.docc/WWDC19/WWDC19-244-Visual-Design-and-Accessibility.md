# Visual Design and Accessibility

Learn about the importance of supporting Large Text. Hear about Differentiate Without Color, a new API on iOS which can enable people with vision disorders such as color-blindness to easily use your app. Learn how to use it and how it can bring inclusivity to your app. Find out how to enable new Reduce Motion API to stop auto-play in your app for people who may be sensitive to motion.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/244", purpose: link, label: "Watch Video (10 min)")

   @Contributors {
      @GitHubUser(Blackjacx)
   }
}



- **Dynamic Type**
  - make as much text as possible dynamic
  - use as much of the screen width as possible
  - don't truncate text
  - scale glyphs (icons/images) next to your text with your text
  - iOS provides 11 text styles
  - custom font support made easier in iOS 11

- **Reduce Motion**
  - adapt animations if `UIAccessibility.isReduceMotionEnabled == true` (there is a notification too)
  - consider disabling autoplaying videos if `UIAccessibility.isVideoAutoplayEnabled == false` (there is a notification too)

- **Differentiate Without Color** is new in iOS13
  - do not rely on color alone
  - add additional indicators (icons) where color is the only way to convey information if `UIAccessibility.shouldDifferentiateWithoutColor == true` (there is a notification too)