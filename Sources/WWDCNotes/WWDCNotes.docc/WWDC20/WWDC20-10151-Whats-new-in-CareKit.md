# What's new in CareKit

Build feature-rich research and care apps with CareKit: Learn about the latest advancements to our health framework, including new views for its modular architecture, improvements to the data store, and tighter integration with other frameworks on iOS. And discover how the open-source community continues to leverage CareKit to allow developers to push the boundaries of digital health&nbsp;—&nbsp;all while preserving privacy.

@Metadata {
   @TitleHeading("WWDC20")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc20/10151", purpose: link, label: "Watch Video (35 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## How to get started

- [researchandcare.org][researchandcare.org]
- [github.com/carekit-apple][github.com/carekit-apple/]

## What is CareKit?

CareKit is an open-source framework that helps you build beautiful care apps. 

Three components:

- CareKitUI: provides static views that are perfect for displaying that data.
- CareKitStore: provides health flavored data models and a core data layer for persistence.
- CareKit: ties the UI and store layers together by providing synchronization between the two

## What's new

- CareKitUI:
  - Some UIKit views now also have a SwiftUI variant
  - New SwiftUI-exclusive views

- CareKit:
  - Synchronized SwiftUI views
  - WatchOS support (via SwiftUI)

- CareKitStore:
  - You can now use data in HealthKit alongside CareKit data to create HealthKit-driven tasks
  - [FHIR][FHIR] compatibility via the new `CareKitFHIR` package
  - New CareKit Remote synchronization APIs

[FHIR]: https://en.wikipedia.org/wiki/Fast_Healthcare_Interoperability_Resources
[researchandcare.org]: https://www.researchandcare.org
[github.com/carekit-apple/]: https://github.com/carekit-apple/