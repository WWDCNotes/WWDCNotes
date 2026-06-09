# What’s new in Shortcuts

Explore techniques to build powerful shortcuts using your app’s content. New automations unlock additional ways to integrate your app with the system. Refine how your App Entity is presented to LLMs using the new “Use Model” transcript feature. Store rich information from your app inside shortcuts that is synced across devices. Learn how to combine these features to create intelligent, powerful automations that integrate seamlessly with content and features from your app.

@Metadata {
   @TitleHeading("WWDC26")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2026/310", purpose: link, label: "Watch Video (11 min)")

   @Contributors {
      @GitHubUser(harrison-heinig)
   }
}

## Key Takeaways

- 🔁 New automation types — screenshot, keyboard connection, and notifications
- 🔬 Inspector shows the model's transcript for your actions
- 💾 Persistent storage for variables can be accessed across devices
- 🆔 App Entities need stable, device-consistent IDs for cross-device recognition

## [Automations](https://developer.apple.com/videos/play/wwdc2026/310?time=57)

- Three new automation trigger types:
    - **Screenshot** — run a shortcut when a screenshot is taken
    - **Keyboard connection** — react when a keyboard is connected or disconnected
    - **Notification** — trigger on incoming notifications
        - Can filter based on notification content
        - Design notifications with automation in mind: clear titles and bodies help users build reliable keyword-based triggers

## [Use Model](https://developer.apple.com/videos/play/wwdc2026/310?time=205)

- The `Use Model` action runs the latest Apple Intelligence models and can retrieve information from the web
- When a shortcut passes your app's App Intent entities to the model, the **model transcript inspector** shows exactly what data is sent
- Use the inspector to verify entity properties, tune `@Property` titles, and refine what the model sees
- Rich `@Property` annotations on entities improve how content is represented in the transcript

```swift
import AppIntents

struct SoupEntity: AppEntity, Identifiable {
    static var typeDisplayRepresentation = TypeDisplayRepresentation(
        name: "Soup",
        numericFormat: "\(placeholder: .int) soups"
    )
    static var defaultQuery = SoupEntityQuery()

    var id: Soup.ID

    @Property var name: String

    @Property(title: "Available Today")
    var isAvailableToday: Bool

    @Property(title: "Ingredients")
    var ingredients: String

    var displayRepresentation: DisplayRepresentation {
        DisplayRepresentation(title: "\(name)", subtitle: SoupStore.description(for: id))
    }
}
```

## [Storage](https://developer.apple.com/videos/play/wwdc2026/310?time=418)

- **Storage** lets shortcuts persist data between runs with Get, Set, and global storage values
- Global storage syncs across all of a person's devices via iCloud
- Combine storage with Use Model to give a shortcut "memory" — e.g. save prior model output or user preferences for the next run
- For App Intent entities referenced in storage or passed to Use Model, use a **stable, device-consistent identifier** so entities are recognized correctly on every device
