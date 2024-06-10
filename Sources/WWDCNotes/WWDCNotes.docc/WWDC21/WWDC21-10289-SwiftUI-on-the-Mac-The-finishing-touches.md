# SwiftUI on the Mac: The finishing touches

Join us for part two of our Code-Along series as we use SwiftUI to build a Mac app from start to finish. The journey continues as we explore how our sample gardening app can adapt to a person’s preferences and specific workflows. Learn how SwiftUI apps can automatically react to system settings, and discover how you can use that information to add more personality to an app. We’ll show you how you can give people the flexibility to customize an app through Settings, and explore how to use different workflows for manipulating someone’s data (like drag and drop). To finish, we’ll show you how you can move data to and from an app, incorporating features like Continuity Camera to provide a simple workflow for importing images.

@Metadata {
   @TitleHeading("WWDC21")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc21/10289", purpose: link, label: "Watch Video (17 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



> Code along session, download the project [here][project].

## Takeaways

- use [`itemProvider(_:)`][itemProvider(_:)] + [`onInsert(of:perform:)`][onInsert(of:perform:)] to support drag and drop
- use [`fileExporter(isPresented:document:contentType:defaultFilename:onCompletion:)`][fileExporter(isPresented:document:contentType:defaultFilename:onCompletion:)] to export data out of your app
- use `importItemProviders()` to support importing data from other apps/system services

[project]: https://developer.apple.com/documentation/swiftui/building_a_great_mac_app_with_swiftui
[fileExporter(isPresented:document:contentType:defaultFilename:onCompletion:)]: https://developer.apple.com/documentation/swiftui/view/fileexporter(ispresented:document:contenttype:defaultfilename:oncompletion:)-32vwk
[itemProvider(_:)]: https://developer.apple.com/documentation/swiftui/view/itemprovider(_:)
[onInsert(of:perform:)]: https://developer.apple.com/documentation/swiftui/dynamicviewcontent/oninsert(of:perform:)-418bq
