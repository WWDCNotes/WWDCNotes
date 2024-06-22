# Introducing Text Kit

Text Kit is the powerful new text engine and API in iOS 7, providing sophisticated text handling and typesetting capabilities. Learn about Text Kit and how easy it can be to manipulate text on the fly, adjust text attributes, and apply the power of Core Text with fewer lines of code.

@Metadata {
   @TitleHeading("WWDC13")
   @PageKind(sampleCode)
   @CallToAction(url: "http://developer.apple.com/wwdc13/210", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## Feature set

- Paginated text
- Text in columns
- Text wrapping (see butterfly in session below)
- Rich Text editing (attributed strings)
- Interactive text coloring (while typing)
- Text folding (show/hide paragraphs without changing the body text)

| ![][showHideSnippetImage] | ![][showHideSnippetImage2] | 

- Custom truncation
![][truncationImage]

- So..looks like many things that we can achieve twisting the `UIFont` actually should be done via `UIFontDescriptor`. Such as
![][traitsImage]
![][traits2Image]
![][traits3Image]

- Exclusion Paths
![][exclusionPathImage]
Note that the exclusionPaths can be changed in real time!
Look at what this guy does at 26mins and 50 seconds! (it’s a fixed `bezierPath` of the butterfly shape, that moves according to the pan gesture)

- Links: We can turn any arbitrary text range into a link (both logically and visually) now using `NSLink` attribute: obviously you will also need to pass the URL.

- [Data Detectors][dataDetect]: We can use data detectors to detect locations, URLs, dates and more in arbitrary text.
This can be even done automatically in a storyboard 🤣
![][linksDetectionImage]

- Text Attachments: Used usually for inline images, attachments live inside of the `NSTextStorage`.
Attachments change the geometry that the layout manager uses to flow text into.
![][attachmentImage]
If the user long press into the attachment, it will be prompted to save the attachment (in the camera roll for example)

- Delegation: We can decide which text is interactive by being the textViewDelegate and expose the `shoudInteractWith…` function.
This way we can also change the default iOS interaction with something custom for our app.

## UITextView Composition
_See session [220][220] for an introduction regarding the three TextKit classes._

![][compositionImage]

- The first thing you're going to see when you pull apart a `UITextView` is the `NSTextContainer` instance.
- `NSTextContainer` is giving the `NSLayoutManager` the bounds, the geometry to render the text into.
- And `NSLayoutManager` is taking all of the text from your `NSTextStorage` and turning it into lines of glyphs inside of your `TextView`.

[dataDetect]: https://developer.apple.com/documentation/foundation/nsdatadetector
[220]: ../220

[showHideSnippetImage]: WWDC13-210-showHideSnippet
[showHideSnippetImage2]: WWDC13-210-showHideSnippet2
[truncationImage]: WWDC13-210-truncation
[traitsImage]: WWDC13-210-traits
[traits2Image]: WWDC13-210-traits2
[traits3Image]: WWDC13-210-traits3
[exclusionPathImage]: WWDC13-210-exclusionPath
[linksDetectionImage]: WWDC13-210-linksDetection
[attachmentImage]: WWDC13-210-attachment
[compositionImage]: WWDC13-210-composition
