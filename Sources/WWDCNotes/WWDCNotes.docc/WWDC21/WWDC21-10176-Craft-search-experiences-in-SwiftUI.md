# Craft search experiences in SwiftUI

Discover how you can help people quickly find specific content within your apps. Learn how to use SwiftUI’s .searchable modifier in conjunction with other views to best incorporate search for your app. And we’ll show you how to elevate your implementation by providing search suggestions to help people understand the types of searches they can perform.

@Metadata {
   @TitleHeading("WWDC21")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc21/10176", purpose: link, label: "Watch Video (11 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



- New [`searchable(...)`][searchable(_:text:placement:)] view modifier
- available on all platforms
- places the search field following each platform convention (you don't need to worry about, mostly)

Example:

```swift
NavigationView {
  WeatherList(text: $text) {
    ForEach(data) { item in
      WeatherCell(item)
    }
  }
}
.searchable(text: $text)
```

- `searchable(...)` takes the configured search field and passes that down, through the environment, for other views to use in the best way for each platform
- if no (sub)views use the configured search field, the `searchable(...)` provides a default implementation of rendering the search field in the toolbar

- `searchable(...)` sets up a new `isSearching` environment property, that you can use to dynamically change the view being displayed, based on whether a user is actively searching for example:

```swift
struct WeatherList: View {
  @Binding var text: String
  
  @Environment(\.isSearching) private var isSearching: Bool
  
  var body: some View {
    WeatherCitiesList()
      .overlay {
        if isSearching && !text.isEmpty {
          WeatherSearchResults()
        }
      }
  }
}
```

- some `searchable(...)` overloads also accept a `suggestions` parameter, which is a view builder that produces content that populates a list of suggestions
- SwiftUI looks at this `suggestions` view builder and will present it based on whether there are any suggestions to display

```swift
struct ColorsContentView: View {
  @State var text = ""
  
  var body: some View {
    NavigationView {
      Sidebar()
      DetailView()
    }
    .searchable(text: $text) {
       ForEach(suggestions) { suggestion in
        ColorsSuggestionLabel(suggestion)
          .searchCompletion(suggestion.text)
      }
    }
  }
}
```

- [`searchCompletion(_:)`][searchCompletion(_:)] replaced the need for you to wrap each suggestion with a button that replaces your `$text` binding
- use [`onSubmit(of:_:)`][onsubmit(of:_:)] to get notified when the user hits return from the search field

```swift
ContentView()
  .searchable(text: $text) {
    MySearchSuggestions()
  }
  .onSubmit(of: .search) {
    fetchResults()
  }
```


[onsubmit(of:_:)]: https://developer.apple.com/documentation/swiftui/view/onsubmit(of:_:)
[searchable(_:text:placement:)]: https://developer.apple.com/documentation/SwiftUI/View/searchable(_:text:placement:)-1r1py
[searchCompletion(_:)]: https://developer.apple.com/documentation/swiftui/view/searchcompletion(_:) 
