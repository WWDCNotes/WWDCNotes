# Design interactive snippets

Snippets are compact views invoked from App Intents that display information from your app. Now, snippets can allow your app to bring even more capability to Siri, Spotlight, and the Shortcuts app by including buttons and stateful information that offer additional interactivity as part of an intent. In this session, you’ll learn best practices for designing snippets, including guidance on layout, typography, interaction, and intent types.

@Metadata {
   @TitleHeading("WWDC25")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2025/281", purpose: link, label: "Watch Video (7 min)")

   @Contributors {
      @GitHubUser(harrison-heinig)
   }
}

## Key Takeaways

- 🌅 Snippets are compact views displayed by App Intents
- 🪜 They are displayed over other content on the device
- 🏃‍➡️ Actions can be performed within a Snippet
- ⌛ Data in a snippet can be updated in real time

@Row {
    @Column {
        @Image(source: "WWDC25-281-InteractiveSnippets")
    }
    @Column {
        @Image(source: "WWDC25-281-Appearance")
    }
}

@Row {
    @Column {
        @Image(source: "WWDC25-281-Result")
    }
    @Column {
        @Image(source: "WWDC25-281-Confirmation")
    }
}

## Presenters

- Ray Pai, Apple Design Team

## Interactive Snippets
- Compact view displayed by App Intents.
- Show updated information and offer quick actions
- Appear anywhere App Intents are supported
- Overlay other content until confirmed, cancelled, or swiped away

@Image(source: "WWDC25-281-InteractiveSnippets")

## Appearance
- Designed for quick, in-the-moment experiences
- Text in snippets has larger sizes than system defaults
- Avoid including content past 340 points in height
    - If more information is needed, link to the relevant view in your app
- Use a vibrant color background so your snippet stands out from the content beneath

@Image(source: "WWDC25-281-Appearance")

## Interaction
- Snippets can include buttons to perform simple and relevant actions
- Data in the snippet can be updated in real time
- Even without interactivity, snippets can animate information changes

@Image(source: "WWDC25-281-Interaction")

## Types

### Results
- Present information that's an outcome or doesn't require further action
- Only a "Done" button at the bottom of the snippet

@Image(source: "WWDC25-281-Result")

### Confirmations
- Used when an action is required before a result can be shown
- After the required action is taken, show a result snippet to show that the intent has completed

@Image(source: "WWDC25-281-Confirmation")
