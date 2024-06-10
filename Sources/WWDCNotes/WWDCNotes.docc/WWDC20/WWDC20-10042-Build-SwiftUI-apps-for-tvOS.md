# Build SwiftUI apps for tvOS

Add a new dimension to your tvOS app with SwiftUI. We’ll show you how to build layouts powered by SwiftUI and customize your interface with custom buttons, provide more functionality in your app with a context menu, check if views are focused, and manage default focus.

@Metadata {
   @TitleHeading("WWDC20")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc20/10042", purpose: link, label: "Watch Video (14 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## CardButtonStyle

- For tvOS-style buttons, use the new [`CardButtonStyle`][CardButtonStyle]
  - raises when focused
  - directional effects when dragging on the Siri remote

```swift
Button(albumLabel, action: playAlbum)
  .buttonStyle(CardButtonStyle())
```

## Context Menus

- invoked on long press gesture

```swift
AlbumView()
  .contextMenu {
    Button("Add to Favorites", action: addAlbumToFavorites)
    Button("View Artist", action: viewArtistPage)
    Button("Discover Similar Albums", action: viewSimilarAlbums)
  }
```

## Focus

- primary way to interact with a TV app
- incredibly important to be able to focus on views and determine if a view is focused

- use the [`focusable(_:onFocusChange:)`][focusable(_:onFocusChange:)] modifier to make a view focusable
- not meant for intrinsically focusable views (buttons, lists, ..)
- use the modifier `onFocusChange` parameter to configure your state
- new [`isFocused`][isFocused] Environment variable 
  - lets you check whether or not a view is in focus, even if the view itself is not focusable
  - `true` if the nearest focusable ancestor of your view is focused

## Default focus

- tvOS will geometrically compute the view that should be focused on load
- this is typically the topmost or leading focusable view on the screen
- use [`prefersDefaultFocus(_:in:)`][prefersDefaultFocus(_:in:)] to change the default behavior
- use [`focusScope(_:)`][focusScope(_:)] to limit your focus preferences to a specific view instead of globally

```swift
@Namespace private var namespace
@State private var areCredentialsFilled: Bool

var body: some View {
  VStack {
    TextField("Username", text: $username)
      .prefersDefaultFocus(!areCredentialsFilled, in: namespace)            
    SecureField("Password", text: $password)

    Button("Log In", action: logIn)
     .prefersDefaultFocus(areCredentialsFilled, in: namespace)
  }
  .focusScope(namespace)
}
```

- use [`resetFocus`][resetFocus] environment action to reset the focus back to its default (limited to the current scope)

```swift
@Namespace var mainNamespace
@Environment(\.resetFocus) var resetFocus

var body: some View {
  // ...
  resetFocus(in: mainNamespace)
  // ...
}
```

[CardButtonStyle]: https://developer.apple.com/documentation/swiftui/cardbuttonstyle
[focusable(_:onFocusChange:)]: https://developer.apple.com/documentation/swiftui/link/focusable(_:onfocuschange:)
[isFocused]: https://developer.apple.com/documentation/swiftui/environmentvalues/isfocused
[prefersDefaultFocus(_:in:)]: https://developer.apple.com/documentation/swiftui/form/prefersdefaultfocus(_:in:)
[focusScope(_:)]: https://developer.apple.com/documentation/swiftui/link/focusscope(_:)
[resetFocus]: https://developer.apple.com/documentation/swiftui/environmentvalues/resetfocus
