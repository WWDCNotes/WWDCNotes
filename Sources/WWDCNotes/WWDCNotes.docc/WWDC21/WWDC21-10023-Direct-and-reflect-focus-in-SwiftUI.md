# Direct and reflect focus in SwiftUI

With device input — as with all things in life — where you put focus matters. Discover how you can move focus in your app with SwiftUI, programmatically dismiss the keyboard, and build large navigation targets from small views. Together, these APIs can help you simplify your app’s interface and make it more powerful for people to find what they need.

@Metadata {
   @TitleHeading("WWDC21")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc21/10023", purpose: link, label: "Watch Video (11 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



- Focus is the system that lets your app take input from keyboards, remotes, game controllers, accessible switch controls, and other sources that -- unlike touch inputs -- are not tied to specific screen coordinates
- the focus view is often drawn with special embellishments, making it easy for people to predict where their input will be directed

## Focus state API

- new [`@FocusState`][@FocusState] property wrapper, which controls the placement of the app focus
- new [`focused(_:)`][focused(_:)] and [`focused(_:equals:)`][focused(_:equals:)] view modifiers, which bind the view focus state to the given state value

```swift
struct LoginForm {
  enum Field: Hashable {
    case username
    case password
  }

  @State private var username = ""
  @State private var password = ""
  @FocusState private var focusedField: Field?

  var body: some View {
    Form {
      TextField("Username", text: $username)
        .focused($focusedField, equals: .username)

      SecureField("Password", text: $password)
        .focused($focusedField, equals: .password)

      Button("Sign In", action: onSignInTap)
    }
  }

  /// Puts the focus on one of the text fields if their data is missing.
  func onSignInTap() {
    if username.isEmpty {
      focusedField = .username
    } else if password.isEmpty {
      focusedField = .password
    } else {
      handleLogin(username, password)
    }
  }
}
```

- Note that the FocusState value is optional (`Field?` in the example): `nil` is used for cases where focus is in an unrelated part of the screen.

## Focus sections

- `FocusState`s are not just for text fields, but can also be used to navigate the focus of the app (think browsing tvOS)
- new `focusSection()` view modifier, which tells SwiftUi that this view is capable of accepting focus if it contains any focusable subviews
- this is used (in tvOS) to navigate between different/separate focus sections of the screen

```swift
struct ContentView: View {

  var body: some View {
    HStack {
      VStack) {
         ...
      }
      .focusSection()

      VStack {
        ...
      }
      .focusSection()
    }
  }
}
```

[@FocusState]: https://developer.apple.com/documentation/SwiftUI/FocusState
[focused(_:)]: https://developer.apple.com/documentation/swiftui/view/focused(_:)
[focused(_:equals:)]: https://developer.apple.com/documentation/swiftui/view/focused(_:equals:)
