# Creating Apps for a Global Audience

Common assumptions can break when your app is used by a global audience. Learn about the many aspects of creating apps for different regions and languages. Understand how to use fonts and typography, layout techniques, and support text input so your app shines in all languages.

@Metadata {
   @TitleHeading("WWDC18")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc18/201", purpose: link, label: "Watch Video (38 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



- Use Formatters
- Use storyboards with auto layout
- Use `UIStackViews` and `UICollectionViews` as much as possible
- When designing constraints, think about:
  - text that can be much shorter/longer
  - Directionality (right to left languages)

- After opening a `.storyboard` file, open the assistant editor (`cmd`+`opt`+`enter`), select the `storyboard (preview)` option and now at the bottom right you can preview your view in different languages without the need to run the app:

![][1Image]

- How to check if a font supports a certain language? In every mac there’s a tool called `Font Book` where you can search by language and it displays all the (installed) fonts that support that language.

- Very much like on `.css` files, even on iOS/macOS you can define a Cascade List to revert to different fonts in case one language is not supported by the current selected font (if you don’t declare a cascade list, iOS will always fall back to the system font):

```swift
// Custom Font with Cascade List 

guard let font = UIFont (name: "SignPainter-HouseScript", size: UIFont.labelFontSize) else { 
  // Handle error
}

// Create Cascade List 
let cascadeList = [UIFontDescriptor(fontAttributes: [.name: "HanziPenTC-W5"])] 
let cascadedFontDescriptor = font.fontDescriptor.addingAttributes([.cascadelist: cascadeList])
let cascadedFont = UIFont(descriptor: cascadedFontDescriptor, size: font. pointSize)

// Handle Text Size (Dynamic Type)
label.font = UIFontMetrics.default.scaledFont(for: cascadedFont)
label.adjustsFontForContentSizeCategory = true 
```

- macOS Mojave has a new “word-of-the-day” screensaver

- For word emphasis, do not use italics, it doesn’t work in most of the languages, and if you use numbers, those will be the only thing italicized in your text 👎🏻. Bold is a better alternative.

- For character emphasis, use different colors (bold doesn’t work for structural languages such as Hindi and Korean), use `AttributedStrings`.

[1Image]: WWDC18-201-1