# Creating an Accessible Reading Experience

The styling and layout of text is a hallmark feature of an outstanding reading experience. Technologies such as CoreText and TextKit give you the tools you need to create a great text layout. Learn how to make an equally great accessible experience for VoiceOver by adopting the accessibility reading content protocol, adding automatic page turning, and customizing speech output.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/248", purpose: link, label: "Watch Video (8 min)")

   @Contributors {
      @GitHubUser(Blackjacx)
   }
}



- For custom views set `isAccessibilityElement = true`

- **Enable Accessible Text Content** by adopting `UIAccessibilityReadingContent`
  - In `accessibilityLineNumber(for point: CGPoint) -> Int` use hit testing to identify subviews
  - In `accessibilityContent(forLineNumber: Int) -> String?` return the `accessibilityLabel` for the subview matching line number
  - In `accessibilityFrame(forLineNumber: Int) -> CGRect` return the `accessibilityFrame` for the subview matching line number
  - In `accessibilityPageContent() -> String?` return the concatenated accessibility labels for all subviews

- Enable **Automatic Page Turn** by
  - setting `view.accessibilityTraits = UIAccessibilityTraits.causePageTurn` on your page view
  - implementing `accessibilityScroll(_ direction: UIAccessibilityScrollDirection) -> Bool` (lets voice over turn pages)

- **Customizing Speech** by adopting the protocol `UIAccessibilityReadingContent`
  - customize language by setting `NSAttributedString.Key.accessibilitySpeechLanguage`
  - customize pitch by setting `NSAttributedString.Key.accessibilitySpeechPitch`
