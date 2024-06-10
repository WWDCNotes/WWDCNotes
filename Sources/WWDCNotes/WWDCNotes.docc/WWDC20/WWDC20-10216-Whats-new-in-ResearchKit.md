# What's new in ResearchKit

ResearchKit continues to simplify how developers build research and care apps. Explore how the latest ResearchKit updates expand the boundaries of data researchers can collect. Learn about features like enhanced onboarding, extended options for surveys, and new active tasks. Discover how Apple has partnered with the research community to leverage this framework, helping developers build game-changing apps that empower care teams and the research community.

@Metadata {
   @TitleHeading("WWDC20")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc20/10216", purpose: link, label: "Watch Video (30 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## How to get started

- [researchandcare.org][researchandcare.org]
- [github.com/ResearchKit][github.com/ResearchKit]

## Onboarding updates

- ResearchKit comes in with a baked-in onboarding screen ([`ORKInstructionStep`][ORKInstructionStep]) ready to be used in an app:
  - we can customize thing such as image, title
  - can have multiple steps
  - a webview step ([`ORKWebViewStep`][ORKWebViewStep]) can now have an in-line signature section after the webview content
  - new request permission step to request user for authorizations to system features (`ORKRequestPermissionStep`)

## Survey enhancements

- now ResearchKit uses in-line labels to display errors instead of alerts 
- we can now enable a "I Don't Know" button to let users skip an answer if they don't want to answer a question (the `I don't know` text can be customized)
- new `ReviewViewController` that allows participants to view a breakdown of all the questions they were asked and the response they gave (users will be able to edit their answers from there as well)

## Active tasks

- many UI and UX improvements around hearing tasks.

## 3D models

- Two new classes to visualize 3D models:
 - `ORK3DModelStep`
 - `ORKUSDZModelManager`

How-to:

1. Add a USDZ model into the project
2. Create a `ORKUSDZModelManager` instance
3. Create a `ORK3DModelStep` and present it

[ORKInstructionStep]: http://researchkit.org/docs/Classes/ORKInstructionStep.html
[ORKWebViewStep]: http://researchkit.org/docs/Classes/ORKWebViewStep.html
[researchandcare.org]: https://www.researchandcare.org
[github.com/ResearchKit]: https://github.com/ResearchKit
