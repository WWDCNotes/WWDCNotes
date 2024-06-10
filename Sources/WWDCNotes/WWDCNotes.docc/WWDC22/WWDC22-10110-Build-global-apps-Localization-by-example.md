# Build global apps: Localization by example

Learn how you can run your apps on devices around the world and help everyone have a great experience — regardless of the language they speak. We'll explore how Apple APIs can provide a solid foundation when creating apps for diverse audiences, and we'll share examples, challenges, and best practices from our own experiences.

@Metadata {
   @TitleHeading("WWDC22")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc22/10110", purpose: link, label: "Watch Video (22 min)")

   @Contributors {
      @GitHubUser(Jeehut)
   }
}



## Translation

- Use `String(localized:comment:)` for localizing text

```swift
let windPerceptionLabelText = String(
  localized: "Wind is making it feel cooler", 
  comment: "Explains the wind is lowering the apparent temperature"
)
```

- new `String(localized:defaultValue:comment)` for the same English word but different translations
- Don’t assume that prepositions will be the same in other languages for interchangeable dynamic data, such as a city name & location description
- `comment` is really important for translators, give them the context
  - What interface element
  - What context
  - What each variable is

- When Server sends a list of supported languages, use `Bundle.preferredLocalizations(from: allServerLanguages).first` on phone to get the most fitting language
- for pluralized texts, use a <kbd>Stringsdict</kbd> file or automated grammar agreement

```swift
String(localized: "\(amountOfRain) in last ^[\(numberOfHours) hour](inflect: true).",
       comment: "Label showing how much rain has fallen in the last number of hours")
```

## Formatters

- for unit numbers use `.formatted` on the number, e.g. with the `.percent` type
- Formatters available for almost everything (session “Formatters make data human friendly” from past years)
- Combine formatters with text
  - use `UnitLength(forLocale: .current, usage: .rainfall)` for the preferred unit
  - use `Measurement` type for unit-ful values

```swift
func expectedPrecipitationIn24Hours(for valueInMillimeters: Measurement<UnitLength>) -> String {
  // Use user's preferred measures
  let preferredUnit = UnitLength(forLocale: .current, usage: .rainfall)

  let valueInPreferredSystem = valueInMillimeters.converted(to: preferredUnit)

  // Format the amount of rainfall
  let formattedValue = valueInPreferredSystem
    .formatted(.measurement(width: .narrow, usage: .asProvided))

  let integerValue = Int(valueInPreferredSystem.value.rounded())

  // Load and use formatting string
  return String(localized: "EXPECTED_RAINFALL", 
         defaultValue: "\(integerValue) \(formattedValue) expected in next \(24)h.", 
          comment: "Label - How much precipitation (2nd formatted value, in mm or Inches) is expected in the next 24 hours (3rd, always 24).")
}
```

- `Stringsdict` entry starts with a key
  - provide for `other` first
  - provide any others needed per language

## Swift Packages

- provide `defaultLocalization` in package definition
- you can now export localizations from packages, too: Go to <kbd>Products > Export Localizations</kbd> and choose your package

- will export as `.xcloc` files for translators, can be imported again
- `String(localized:bundle:comment:)` used in packages
    - pass `.module` for bundle in packages

- Localize your package, advertise supported languages
- Developers should ensure dependencies are localized & test
- Layout and SwiftUI
- don’t give UI elements a fixed height, some languages like Hindi need more line height for the same text
- Adjust a column width in a table like list to the longest label
- use `Grid` view in SwiftUI to implement this

![](https://user-images.githubusercontent.com/6942160/172727878-1b7caf7d-8705-4881-b9c4-3845e7fc6e5d.png)

- use two or more lines if needed, e.g. for German on watchOS
- Sometimes a horizontal stack can be changed to a vertical to fit

![](https://user-images.githubusercontent.com/6942160/172727893-dc33f6e5-9a68-4c85-8e07-5e6fceb355c5.png)

- Possible with [`ViewThatFits`][ViewThatFits] in SwiftUI now

![](https://user-images.githubusercontent.com/6942160/172727909-1d610bf6-f4b4-41ae-91df-d7713a96105d.png)

[ViewThatFits]: https://developer.apple.com/documentation/swiftui/viewthatfits
