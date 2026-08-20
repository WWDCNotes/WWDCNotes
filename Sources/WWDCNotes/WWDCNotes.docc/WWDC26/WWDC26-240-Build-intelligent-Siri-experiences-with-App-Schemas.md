# Build intelligent Siri experiences with App Schemas

Bring your app’s content and actions to Siri with App Intents. Model your data using App Entities, adopt App Schemas to enable powerful system actions, and support natural language interactions powered by Apple Intelligence. Explore how to enable semantic search, perform actions across apps, and create contextual experiences using onscreen awareness and content transfer. Find out best practices and testing tools to build fast, reliable Siri experiences.

@Metadata {
   @TitleHeading("WWDC26")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2026/240", purpose: link, label: "Watch Video (27 min)")

   @Contributors {
      @GitHubUser(alexkaessner)
   }
}

## Key Takeaways
- Enabled by App Intents Framework
- Contribute content (entities) and actions (intents) via app schemas
- Connect views to entities for onscreen awareness
- Connect with other apps by exporting and importing entities

## What's New in Siri
**[App Intents Framework](https://developer.apple.com/documentation/appintents/) is foundation for Siri & Apple Intelligence integration.** Check out <doc:WWDC25-244-Get-to-know-App-Intents> and <doc:WWDC24-10210-Bring-your-apps-core-features-to-users-with-App-Intents>, if you’re new to App Intents.

- Siri can access content/information in app's entities
   - Example: When and where is my next meeting?
- Take action via app's intents
   - Example: Send my latest report to Mary
- Understand on-screen context when annotating views with entities
   - Example: Get me reviews for this product

## Contributing Content with App Entities
- Your [`AppEntity`](https://developer.apple.com/documentation/appintents/appentity) needs to conform to `AppSchema` for Siri to understand it!
- AppSchema's are predefined contexts ([all domains](https://developer.apple.com/documentation/appintents/app-schema-domains))
  - Categories of content and tasks Siri knows how to handle (for more see <doc:WWDC24-10133-Bring-your-app-to-Siri>)
- Siri uses entity resolution to handle semantic search not just string matching
- [`IndexedEntity`](https://developer.apple.com/documentation/appintents/indexedentity) brings app content to system semantic index
   - Understands semantic meaning, relationships and can answer questions
- `indexingKey` indicates properties as searchable by Spotlight & Siri
   - Used for reasonable sized set of items

```swift
// Contributing message content to Apple Intelligence

@AppEntity(schema: .messages.message)
struct MessageEntity: IndexedEntity {

    // The text content of the message
    @Property(indexingKey: \.textContent)
    var body: AttributedString?
}
```

- Use `EntityStringQuery` for large or server based datasets
- Siri passes persons input to handle yourself
- No semantic understanding, but full control

```swift
// An interface that locates entities using arbitrary string input

struct ContactQuery: EntityStringQuery {
    func entities(matching string: String) async throws -> [ContactEntity] {
        let predicate = #Predicate<Person> { person in
            person.name.localizedStandardContains(string)
        }
        let descriptor = FetchDescriptor<Person>(predicate: predicate)
        let matches = try modelContext.fetch(descriptor)
        return matches.map(\.entity)
    }
}
```

## Making Actions Available with App Intents
- Same as for entities use `AppSchema` for Siri to understand your `AppIntent`
- Schema based intents have predefined structure
  - Xcode's autocomplete helps with templates
  - Or check out docs for templates, like: [sendMessage](https://developer.apple.com/documentation/appintents/appschema/messagesintent/sendmessage)

```swift
@AppIntent(schema: .messages.sendMessage)
struct SendMessageIntent {
    var content: AttributedString?
    var destination: MessageDestination
    var subject: AttributedString?
    var attachments: [IntentFile]
    var audioMessage: IntentFile?
    var locations: [GeoToolbox.PlaceDescriptor]
    var links: [URL]
    var scheduledDate: Date?
    
    @Dependency
    var model: ModelManager
    
    func perform() async throws -> some ReturnsValue<[MessageEntity]> {
        // Custom mapping of parameters to app flow
        
        return .result(value: messages)
    }
}
```

## Onscreen Awareness
- Connect your views to entities to enable this
- Use [`NSUserActivity`](https://developer.apple.com/documentation/foundation/nsuseractivity) for single primary things on screen (e.g. document or composing message)
- Use `View` annotations for multiple meaningful things (e.g. messages in conversation or items in list)
   - Use [`EntityIdentifier`](https://developer.apple.com/documentation/appintents/entityidentifier) to connect to your corresponding entities

```swift
// View annotations
List {
    ForEach(messages) { message in
        MessageRow(message: message)
            .appEntityIdentifier(
                EntityIdentifier(
                    for: MessageEntity.self,
                    identifier: message.id
                )
            )
    }
}
```

## Export Content to Another App 
- Export entities via `Transferable` for other apps to act on your entities
- Use [`IntentValueRepresentation`](https://developer.apple.com/documentation/appintents/intentvaluerepresentation) to enable this
- App doesn't need to know what comes next - just describe content

```swift
extension ContactEntity: Transferable {
    
    static var transferRepresentation: some TransferRepresentation {
        IntentValueRepresentation(exporting: \.person)
    }
}
```

## Import Content from Another App
- You decide how to handle incoming content:
    - Use [`IntentValueQuery`](https://developer.apple.com/documentation/appintents/intentvaluequery) to match with existing content of your app
    - Use `IntentValueRepresentation` for something new
- `IntentValueQuery` conceptually similar to `EntityQuery`

- Note: The [Apple docs note](https://developer.apple.com/documentation/appintents/providing-contextual-cues-to-apple-intelligence-and-siri#Support-conversions-between-your-app-entities-and-equivalent-system-types) that the import and export handling is only available when matching to [`IntentPerson`](https://developer.apple.com/documentation/appintents/intentperson), [`PlaceDescriptor`](https://developer.apple.com/documentation/geotoolbox/placedescriptor), or [`PersonNameComponents`](https://developer.apple.com/documentation/foundation/personnamecomponents).

### Example: Map incoming IntentPerson to existing ContactEntity
```swift
struct ContactEntityQuery: IntentValueQuery {

    func values(for input: [IntentPerson]) async throws -> [ContactEntity] {
        let names = input.map(\.displayName)
        let descriptor = FetchDescriptor<Contact>()
        let contacts = try model.mainContext.fetch(descriptor)
        let matches = contacts.filter { contact in
            names.contains(where: { name in
                contact.name.localizedStandardContains(name)
            })
        }
        return matches.map(\.entity)
    }
}
```

#### Example: Create new ContactEntity for incoming IntentPerson
```swift
extension ContactEntity: Transferable {

    static var transferRepresentation: some TransferRepresentation {
        IntentValueRepresentation(exporting: \.person, importing: { intentPerson in                    
            let contact = Contact(importing: intentPerson)
            ContactManager.shared.contacts.append(contact)
            return contact.entity
        })
    }
}
```

## Best Practices
- Some schemas require multiple actions to work
   - By design to create full experience
   - e.g. `sendMessage` also requires `draftMessage`
- Use [`AppIntentsTesting`](https://developer.apple.com/documentation/AppIntentsTesting) to test without Siri
   - Learn more: <doc:WWDC26-295-Validate-your-App-Intents-adoption-with-AppIntentsTesting>
- Use Shortcuts app to test actions
- Use Spotlight to test entity indexing
- Test complete experience with Siri

### Next Steps
- Model and index entities
- Adopt the right `AppSchema` domains
- Enable content transfer with `Transferable`
- Test with Shortcuts, Spotlight, and Siri
