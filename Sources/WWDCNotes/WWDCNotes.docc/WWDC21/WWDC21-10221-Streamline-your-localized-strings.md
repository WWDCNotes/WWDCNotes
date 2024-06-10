# Streamline your localized strings

When you localize the text within your app, you can help make your app more accessible to a worldwide audience. Discover best practices for building your localization workflow, including how to write and format strings accurately, and learn how to prepare strings for localization in different languages using Xcode.

@Metadata {
   @TitleHeading("WWDC21")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc21/10221", purpose: link, label: "Watch Video (27 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## Declaring a localizable string

- Use SwiftUI's `LocalizedStringKey` initializers, e.g. `Text("Hello world")`
- via variables, e.g. `button.title = NSLocalizedString("Order", comment: "…")`
- new Swifty way: `button.title = String(localized: "Order")`

Example:

```swift
let count = 3

// SwiftUI
Button("Order \(count) Tickets") { … }

// Swift
button.title = String(localized: "Order \(count) Tickets")
// This was previously obtained via .localizedStringWithFormat()
```

- Do not use `String(format: "Order %d Tickets", count)`, it's not intended for localization.

## Comment recommendations

Tips for a good localized string comment:

- declared the interface element (e.g. `button`)
- define the context
- explain each variable

Examples:

```swift
Text("Order", comment: "Button: confirms concert tickets booking")
Text("\(ticketCount) Ordered", comment: "Order summary: total number of tickets ordered")
```

## Tables

- localized strings can be further organized in tables
- by default all strings are put in a table named `Localizable`, which means all strings are stored in a `Localizable.strings` and `Localizable.stringsdict` file

Which means that the following example will search for the localization in `fr.lproj/UserProfile.strings` for the French translation (for example)

```swift
Text(
  "\(ticketCount) Ordered",
  tableName: "UserProfile",
  comment: "Profile subtitle: total number of tickets ordered"
)
```

## Bundle

- This parameter lets you load strings across targets
- `.main` by default
- if your app extension wants to use:
  - the same localizations as your app, there's nothing else to do
  - its own localizations, it needs to set `.module` as the `bundle` parameter value
- if the localization is vended by a framework you'd use:

```swift
/// In the framework

public enum OrderStatus {
  case pending, processing, complete, canceled, invalid(Error)

  var displayName: String {
    switch self {
      case .complete: return String(
        localized: "Complete",
        bundle: Bundle(for: AnyClassInTicketKit.self),
        comment: "Standalone ticket status: order finalized"
      )
      ...
          
/// In the app:

Text(OrderStatus.complete.displayName)
```
