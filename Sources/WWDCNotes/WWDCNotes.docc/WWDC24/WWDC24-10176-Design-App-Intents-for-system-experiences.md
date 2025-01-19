# Design App Intents for system experiences

App Intents power system experiences in controls, Spotlight, Siri, and more. Find out how to identify the functionality that's best for App Intents, and how to use parameters to make these intents flexible. Learn how to use App Intents to allow people to take action outside your app, and see examples of when to navigate into your app to show contextual information.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10176", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(lorin-vr)
   }
}

## Key Takeaways

- 🕵️ Create app intents to expose your app to spotlight, widgets, controls, Siri, Shortcuts and the action button
- 🎛️ Use parameters for flexibility
- ✍️ Strive for readability
- 🔦 Offer toggles
- 👀 Open the app where appropriate

@Row {
   @Column {
      @Image(source: "WWDC24-10176-Shortcut", alt: "Linking a shortcut to the action button")
   }
   @Column {
      @Image(source: "WWDC24-10176-Examples", alt: "Examples of system app intents")
   }
}
@Row {
   @Column {
      @Image(source: "WWDC24-10176-Tasks", alt: "Screenshot of a slide reading \"App Intents contain all the tasks your app can do.\"")
   }
   @Column {
      @Image(source: "WWDC24-10176-BestPractice", alt: "Screenshot of a slide showing best practices for naming app intents")
   }
}

## What should  be an app intent?

Where previously Apple recommended creating an app intent for each "habitual action" of an app, this guideline has broadened in iOS 18 to recommend that "anything your app does should be an app intent." 

When designing app intents, use these verbs as a starting point:

- Get
- Edit
- Create
- Delete
- Open

Avoid creating multiple app intents that do similar things. Combine similar functionality into a single, flexible app intent and use a parameter to differentiate behaviour.

Avoid app intents that simply perform a UI action e.g. "Swipe down" or "Cancel". Instead, perform the underlying action e.g. "Delete draft".

Create app intents for audio playback, recording and live activities so that these tasks can be triggered from the background without further interaction.

## Structuring app intents

Keep app intent parameter summaries readable by carefully choosing a verb and naming parameter options to fit with their verb.

Prefer optional parameters over required parameters. Optional parameters allow the app intent to perform a useful, default behaviour even if the user doesn't provide the parameter. 

If your parameter is required, write a concise, clear follow-up question for the user to provide it.

If your app intent allows switching between two states (e.g. Flashlight can either be "on" or "off"), always provide "Toggle" as the default parameter so that the user can easily switch between states without using a parameter.
@Image(source: "WWDC24-10176-Toggle", alt: "A toggle app intent for the Flashlight app")

In iOS 18, Apple no longer discourages bringing an app to the foreground as part of an app intent. Apple now recommends foregrounding an app to show the effect of an app intent (e.g. "Create new Freeform board") or to navigate to a view in your app (e.g. "Open Stopwatch").




