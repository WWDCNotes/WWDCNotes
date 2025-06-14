# Enhance your app’s multilingual experience

Create a seamless experience for anyone who uses multiple languages. Learn how Language Discovery allows you to optimize your app using a person’s preferred languages. Explore advances in support for right-to-left languages, including Natural Selection for selecting multiple ranges in bidirectional text. We’ll also cover best practices for supporting multilingual scenarios in your app.

@Metadata {
   @TitleHeading("WWDC25")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2025/222", purpose: link, label: "Watch Video (20 min)")

   @Contributors {
      @GitHubUser(Jeehut)
   }
}

## iOS 26 Feature Overview

@Image(source: "WWDC25-222-Feature-Keywords")

- Users can now type arabic words in latin script, the keyboard transliterates automatically
- Transliteration keyboard now also offers bilingual suggestions for 10 languages, enter English & translate
- New multi-script bilingual like for typing in Arabic or English
- New Thai keyboard with 24-key layout, way better for Thai speakers

## Best Practices (Reminder)

- TextKit 2 makes it easy to support multiple languages, handles scripts like Korean/Hindi, more control
- Formatters help display dates, numbers, and text in an auto-adapting way (currency, date formats, etc.)
- Use `inputAccessoryView` to place input above keyboard, `setTextInputContextIdentifier` to remember language/layout

## Language discovery

- Siri proactively suggests to setup device in multiple languages using on-device intelligence
- Content recommendations are done (additionally) in other language than UI is set to
- The existing `Locale.preferredLanguages` is now extended by `Locale.prferredLocales` to get more language info
- You get fields like `.languageCode`, `.script`, `.calendar`, `.firstDayOfWeek`, `.timeZone`, `.currency`, `.region`
- `Locale.preferredLanguages` may get deprecated, so migrate to `preferredLocales`

@Image(source: "WWDC25-222-Preferred-Locales")

- When offering list of languages, for example, put all matching preferred locales at the top
- Use `.isEquivalent` or `.hasCommonParent` based on your needs for language matching

@Image(source: "WWDC25-222-Preferred-Locales-Use-Case")

## Alternate calendars

- New alternate calendar options for languages like Gujarati, Marati, and Korean
- Existing 16 calendar identifiers are extended by 11 more

@Image(source: "WWDC25-222-Calendar-Identifiers")

## Bidirectional text

- See also: <doc:WWDC22-10107-Get-it-right-to-left>
- Bidirectional text is when left-to-right and right-to-left language words are combined in one text
- This has significant implications for text selection
- Characters are always stored in the order they are written, only display varys
- When selecting bidirectional text, the cursor used to "jump", creating a confusing experience
- New in iOS 26, selection in UI is now intuitive, the storage is adjusted accordingly

@TabNavigator {
   @Tab("Selection prior to iOS 26") {
      @Image(source: "WWDC25-222-Mixed-Selection-Old-Behavior")
   }
   
   @Tab("Natural Selection in iOS 26") {
      @Image(source: "WWDC25-222-Mixed-Selection-New-Behavior")
   }
}

- To adopt this, instead of a single selected range, an array of selected ranges is required
- On macOS, this was already possible – `NSTextView` had `selectedRanges`
- But on iOS, `UITextView` had only `selectedRange` which will be deprecated in favor of `selectedRanges`
- Learn more: <doc:WWDC25-280-Codealong-Cook-up-a-rich-text-experience-in-SwiftUI-with-AttributedString>

- New versions of edit menu `UITextViewDelegate` and `UITextFieldDelegate` methods available
- Use TextKit 2 to utilize `textView.textLayoutManager` (instead of `textView.layoutManager`)

- Writing direction used to be different from text direction in bidirectional text, leading to cursor "stay in place"
- This year, when switching from LTR to RTL, the cursor moves naturally considering it to be an LTR sentence
- Writing direction will now be dynamically determined for whole sentence based on text content

@Video(source: "WWDC25-222-Dynamic-Direction")

- If you use your custom texte engine, refer to the [Language Introspector sample code](https://developer.apple.com/documentation/Foundation/language-introspector)
