# Enhance child safety with PermissionKit

Discover how PermissionKit helps you enhance communication safety for children in your app. We’ll show you how to use this new framework to create age-appropriate communication experiences and leverage Family Sharing for parental approvals. You’ll learn how to build permission requests that seamlessly integrate with Messages, handle parental responses, and adapt your UI for child users. To get the most out of this session, we recommend first watching “Deliver age-appropriate experiences in your app” from WWDC25.

@Metadata {
   @TitleHeading("WWDC25")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2025/293", purpose: link, label: "Watch Video (11 min)")

   @Contributors {
      @GitHubUser(Jeehut)
   }
}

## Prerequisites

- Your app has some kind of communication functionality
- PermissionKit should only be used when you know the current user is a child, so:
- Your app can determine the age or age range of users (or use the new `DeclaredAgeRange` API)
- Learn more: <doc:WWDC25-299-Deliver-ageappropriate-experiences-in-your-app>
- PermissionKit leverages the family sharing group, so same group is a requirements
- Additionally, parents/guardians must enable Communication Limits for child

## Meet PermissionKit

- New framework for easy & consistent permission experiences between requester and permission authority
- Helps start a conversation in Messages with guardians in family sharing group
- In your app, child can request to communicate with someone new over Messages
- Parents can approve or decline childs request to communicate right in Messages

@Image(source: "WWDC25-293-Request-Permission")

## Tailor your UI for children

- If your app has a social chat feature, your app should hide unknown senders
- This includes message previews, profile pictures, and other potentially sensitive content
- Use `CommunicationLimits.current.knownHandles(in:)` method to find known senders in array
- You can skip this step if you already have that data in your own systems, but make sure to hide unknown senders

@Image(source: "WWDC25-293-CommunicationLimits-Known-Handles")

## Crate an "ask" experience

- Create a `PermissionRequest` with a handle (like phone number or username)

```swift
import PermissionKit

var question = PermissionQuestion(handles: [
   CommunicationHandle(value: "dragonslayer42", kind: .custom),
   CommunicationHandle(value: "progamer67", kind: .custom)
])
```

- Add as much metadata as possible via `CommunicationTopic` to give guardians more context
- Specify the type of `actions` requested, such as`.message`, `.call`, `.video`

```swift
import PermissionKit

let people = [
    PersonInformation(
        handle: CommunicationHandle(value: "dragonslayer42", kind: .custom),
        nameComponents: nameComponents,
        avatarImage: profilePic
    ),
    PersonInformation(
        handle: CommunicationHandle(value: "progamer67", kind: .custom)
    )
]

var topic = CommunicationTopic(personInformation: people)
topic.actions = [.message]

var question = PermissionQuestion(communicationTopic: topic)
```

- Use the `CommunicationLimitsButton` inside SwiftUI with a `PermissionQuestion`
- Upon pressing the button, a system prompt with "Ask to Approve" and "Approve in Persion" will appear
- `UIKit`/`AppKit` apps can use `CommunicationLimits.current.ask(in:)` method passing a `ViewController`/`NSWindow`

@Image(source: "WWDC25-293-CommunicationLimitsButton")

## Parent/guardian responses

- Check `CommunicationLImits.current.updates` async sequence to get notified when parent responded
- Child can optionally add a name for the person to be contacted (to add to Contacts app)
- Child will receive a notification upon parent responding
- Your app is responsible for updating UI based on answer or updating contact info on your servers

### Other consideration

- Get inspired by PermissionKit to add same safety for children on other platforms (like Web)
- New `SensitiveContentAnalysis` API to detect & block nudity in media calls
- New `DeclaredAgeRange` API allows you to provide age-appropriate experiences for kids
- The `ScreenTime` framework gives guardians tools to supervise childrens 
- The `FamilyControls` is for thos to provide their own parental controls
