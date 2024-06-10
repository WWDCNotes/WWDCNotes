# Empower your intents

When you create an intent for your app, you can help people accomplish tasks quickly by using it as part of a shortcut or when asking Siri. Learn how to adopt Siri more easily than ever when you use SiriKit’s in-app intent handling, and how to improve Siri performance with existing Intents app extensions. We'll also show you how to leverage features in SiriKit to improve the experience of using your actions — like including images and subtitles for a rich conversational experience. And find out how to fine tune support for intents in your codebase to make your life as a developer easier.

@Metadata {
   @TitleHeading("WWDC20")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc20/10073", purpose: link, label: "Watch Video (20 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## Overview

![][overviewImage]

- SiriKit encompasses the Intents and Intents UI frameworks which you use to integrate your services with Siri, Shortcuts, and maps
- In iOS 14 you can use intents to add configuration and intelligence to widgets
- An Intents UI app extension displays custom UI in the Siri shortcuts or maps interface
- An Intents app extension receives user requests from surrogate and turns them into app specific actions such as sending the message

## In-app intent handling

- New in iOS 14
- When should you use it?
  - When the intent controls media playback/workouts
  - When the intent affects the apps user interface live on screen
  - When the intent needs more memory (e.g. photo/video editing)

### How to adopt in-app intent handling

- Make sure to support multiple windows
- When your app is launched in response to a SiriKit request, it will be launched without any `UIScene` object connected to your app
- List all intents that you would like to handle inside of your application in the `Support intents` section of your apps target
- Implement the `AppDelegate`'s [`application(_:handlerFor:)`][application(_:handlerFor:)]

## What's new in iOS 14

- Rich Disambiguation:
  - In iOS 13 we were able to provide a list of options in case of ambiguity
  - This year we can add an image and a subtitle for each option
  - We can tell Siri to paginate our items (to present to the user)

- Dynamic Search for dynamic options
- Parameters can be mark configurable and resolvable separately. Siri and the Shortcuts app will not resolve parameters which are marked as unresolvable

## Tips

- Custom intents deprecation
  - We can now mark intents as deprecated in the Xcode 12 inspector.
  - This will be shown in the shortcuts.app:
![][deprecImage]

-  
  - The action will be hidden when creating new shortcuts

- Custom classes names:
  - Classes are generated for you when defining when custom intents, custom types, or custom enums
  - You can now specify your generated class name in the Xcode inspector of your intent
  - Alternatively, you can specify a common class prefix used for all custom intense types and enums in the project document inspector of your target where the code generation needs to happen

[overviewImage]: overview.png
[deprecImage]: deprec.png
[application(_:handlerFor:)]: https://developer.apple.com/documentation/uikit/uiapplicationdelegate/3548063-application