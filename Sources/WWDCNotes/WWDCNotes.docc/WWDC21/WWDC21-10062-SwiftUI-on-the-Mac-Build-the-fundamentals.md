# SwiftUI on the Mac: Build the fundamentals

Code along with us as we use SwiftUI to build a Mac app from start to finish. Discover four principles all great Mac apps have in common, and learn how to apply those principles in practice using SwiftUI. We’ll show you how to create a powerful, flexible sidebar experience and transform lists to tables within a detail view, then discuss best best practices for data organization. Next, we’ll explore the simple .searchable modifier and find out how to add support for the toolbar and search. And to close out part one, we’ll learn how to build a great multiple-window experience and provide menu bar support.

@Metadata {
   @TitleHeading("WWDC21")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc21/10062", purpose: link, label: "Watch Video (17 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



> Code along session, download the project [here][project].

## SwiftUI app key principles

- Flexible
- Familiar
- Expansive
- Precise

## Takeaways

- You can set a `.frame(minWidth:)` view modifier to a sidebar to declare its minimum width
- When you have visual elements to show:
  - if you don't need complex sorting, use `List`
  - if you need complex sorting and/or multiple columns, use `Table`
    - when making a Table sortable, we need to pass a `sortOrder` binding

- [`focusedSceneValue(_:_:)`][focusedSceneValue(_:_:)] tells the system to expose the given value when the entire system is in focus

[project]: https://developer.apple.com/documentation/swiftui/building_a_great_mac_app_with_swiftui
[focusedSceneValue(_:_:)]: https://developer.apple.com/documentation/swiftui/text/focusedscenevalue%28_%3A_%3A%29
