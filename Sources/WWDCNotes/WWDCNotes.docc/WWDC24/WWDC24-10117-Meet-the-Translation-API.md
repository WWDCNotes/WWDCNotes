# Meet the Translation API

Discover how you can translate text across different languages in your app using the new Translation framework.  We’ll show you how to quickly display translations in the system UI, and how to translate larger batches of text for your app’s UI.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10117", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(MortenGregersen)
   }
}

## Key takeaways

🌁 Adopt `.translationPresentation()` to display translations

⚙️ Use `TranslationSession` for deeper integration with your app's UI

😥 Not a lot of languages are available

## Presenters

* Louie Livon-Bemel, Senior Engineer, Machine Translation

## New Translation.framework

Available on iOS, iPadOS and macOS.

## Simple overlay

In iOS/iPadOS 17.4 and macOS 14.4 the `.translationPresentation` modifier was added.
This is the easiest way to show translations:

```swift
MyContentView()
    .translationPresentation(isPresented: $showsTranslation, text: inputText)
```

This will show a sheet with the translation and a possibility to change target language.

## Flexible translation

To translate one or more strings use the new `TranslationSession`:

```swift
let session: TranslationSession
let inputStrings: [String] = ...

let requests: [TranslationSession.Request] = inputString.map { .init(sourceText: $0) }
for response in try? await session.translations(from: requests) {
    handle(response: response)
}
```

The `TranslationSession` should not be created, but the new `.translationTask` modifier in SwiftUI provides the session for you to use.
The `TranslationSession.Configuration` parameter not required. Changing the configuration triggers the closure/translation again.
If you want to translate again with the same configuration, call `invalidate()` on the configuration.

```swift
import SwiftUI
import Translation

struct MyView: View {
    var sourceText: String
    @State private var targetText: String?
    @State private var configuration: TranslationSession.Configuration?

    var body: some View {
        Text(targetText ?? sourceText)
            .translationTask(configuration { session in
                do {
                    let response = session.translate(sourceText)
                    targetText = response.targetText
                } catch { /* Handle error */ }
            }
    }
}
```

## Language support

The translation is done on-device. Downloaded ML models for translate is shared with all apps, including Apple's Translate.

**The supported languages are:**
* Arabic
* Chinese (Simplified)
* Chinese (Traditional)
* Dutch
* English (UK)
* English (US)
* French
* German
* Hindi
* Indonesian
* Italian
* Japanese
* Korean
* Polish
* Portugese (Brazil)
* Russian
* Spanish (Spain)
* Thai
* Turkish
* Ukranian
* Vietnamese 

When a model is not downloaded and the Translation API is called, a sheet is presented to let the user download the required models (which continues in background).

It is possible to provide source and target language in the `.translationTask` modifier and in the `TranslationSession.Configuration` initializer.

* Giving a `nil` source language will let the session attempt to identify language
* Giving a `nil` target language will let the session pick a language automatically

Use the language values from `LanguageAvailability.supportedLanguages` (in the form `en_US`, `zh_CN`, `fr_FR`).

It is recommended to use `nil` as source language. If you need to identify the language of text use `NLLanguageRecognizer`:

```swift
import NaturalLanguage

func identifyLanguage(of sample: String) -> Locale.Language? {
    let recognizer = NLLanguageRecognizer()
    recognizer.processString(sample)
    guard let language = recognizer.dominantLanguage else { return nil }
    return Locale.Language(identifier: language.rawValue)
}
```

### Unsupported combinations

The framework does not support every combination of languages.

```swift
let availability = LanguageAvailability() 

// .supported or .installed
let usToHi = await availability.status(from: englishUS, to: hindi)
let ukToHi = await availability.status(from: englishUK, to: hindi)

// .unsupported
let usToUk = await availability.status(from: englishUS, to: englishUK)
let hiToHi = await availability.status(from: hindi, to: hindi)
```

It is also possible to check with a snippet instead of source language:

```swift
let snippet = "The quick brown fox jumped over the lazy dog"
let statusForSnippet = try? await availability.status(for: snippet, to: hindi)
```

## Batch translations

There are two possibilities for batch translation.

### All at once

`public func translations(from batch: [Request]) async throws -> [Response]`

This function returns when all has been translated. They keep the order in the arrays.

### Streaming

`public func translate(batch: [Request]) -> BatchResponse`

This function returns like an `AsyncSequence`. They are not in order.

Make sure to use the `clientIdentifier` on each `Request` to find the right translations.

## Best practices

* Develop with device, not simulator (doesn't work)
* Attach the `.translationPresentation` to the content or container - not the button
* All source texts for a translation should have the same source language
* Don't store instances of `TranslationSession
* Use the SF Symbol for translation

### Pre-download languages

If you know the languages you will use, you can ask the user for download approval without translating:

`TranslationSession.prepareTranslation()` 
