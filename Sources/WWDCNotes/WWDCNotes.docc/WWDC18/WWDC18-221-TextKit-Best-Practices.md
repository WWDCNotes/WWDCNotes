# TextKit Best Practices

Leverage the abilities of TextKit to provide the best experience possible displaying and editing text. Get the best performance out of your app by using TextKit effectively. Learn the concepts to do more complex handling, layout and presentation.

@Metadata {
   @TitleHeading("WWDC18")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc18/221", purpose: link, label: "Watch Video (37 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



- TextKit is a special framework that sits between UIKit/AppKit and CoreText
![][textKitStackImage]
- In case you’re in doubt on which UIKit element you need:
![][decisionChartImage]
- ..and for AppKit:
![][decisionChartAppKitImage]
- If we have a lot of text do format, `UITextView` has a `allowsNonContiguousLayout` property that will format the text only when it is visualized, therefore not requiring the whole text to be formatted before displaying to the user (requires the `UITextView`’s scrolling to be enabled, otherwise asking for the intrinsic size of the `UITextView` will need to format the whole text before returning)
- For security, all text input is potentially untrusted. Therefore before processing any input (what happens if a user pastes a 3M+ words book in our text input?) we should take a look at `UITextFieldDelegate` (UIKit) and `NSFormatter` (AppKit).


[textKitStackImage]: WWDC18-221-textKitStack
[decisionChartImage]: WWDC18-221-decisionChart
[decisionChartAppKitImage]: WWDC18-221-decisionChartAppKit