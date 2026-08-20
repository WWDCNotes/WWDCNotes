# Explore advanced App Intents features for Siri and Apple Intelligence

Polish how your app works with Siri using advanced App Intents APIs. Learn techniques that let people accomplish more with just their voice, help Apple Intelligence find your content, and provide context for on-screen awareness so Siri understands what’s happening in your app. 

@Metadata {
   @TitleHeading("WWDC26")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2026/343", purpose: link, label: "Watch Video (24 min)")

   @Contributors {
      @GitHubUser(alexkaessner)
   }
}

## Key Takeaways
- Customize how Siri shows results or asks for confirmation
- Donate actions in app for smarter Siri
- Mark entities as public
- Improve discovery by indexing in Spotlight
- Advanced onscreen awareness
- Act on notifications, now playing or alarms

## Before Starting
This talk extends mostly on things from <doc:WWDC26-240-Build-intelligent-Siri-experiences-with-App-Schemas>. Check out this talk – as well as <doc:WWDC25-244-Get-to-know-App-Intents> – for more in-depth information and alternative/more standard ways.

## Customize how Siri responds
### Custom Response when Action Performed
1. Mark `perform()` with `ProvidesDialog`
2. Return [`IntentDialog`](https://developer.apple.com/documentation/appintents/intentdialog) in return `.result(…)`

```swift
@AppIntent(schema: .audio.addToPlaylist)
struct AddToPlaylistIntent {
    // …
    
    func perform() async throws -> some IntentResult & ProvidesDialog {
        // Adds song to playlist and responds
        return .result(
            dialog: IntentDialog(
                full: """
                      Added \(song.title) to the \
                      \(playlist.title) mix tape.
                      """,
                supporting: "Added"
            )
        )
    }
}
```

### Ask for Clarification
- Use [`.requestValue`](https://developer.apple.com/documentation/appintents/intentparametercontext/requestvalue(_:)) on optional values
- Check out docs and sample apps for more ways of handling this

```swift
@AppIntent(schema: .clock.createTimer)
struct CreateTimerIntent {
    // MARK: Schema Parameters
    var duration: Duration
    var label: String?
    var isSleepTimer: Bool

    func perform() async throws -> some ReturnsValue<TimerEntity> {
        // Checks active timers and requests label parameter
        label = try await $label.requestValue(
            """
            You already have a timer running. \
            What should we call this one?
            """
        )
        return .result(value: timerEntity)
    }
}
```

### Visual Responses
- Use [`DisplayRepresentation`](https://developer.apple.com/documentation/appintents/displayrepresentation) for basic visual representation of entities
  - Supports optional subtitle and image/symbol
- Use custom view snippets for visual representation of intents
  - Mark `perform()` with `ShowsSnippetView` and return custom SwiftUI view in .results`

```swift
@AppIntent(schema: .audio.addToPlaylist)
struct AddToPlaylistIntent {

    var audioEntity: AudioEntity
    var playlist: PlaylistEntity

    func perform() async throws -> some IntentResult & ProvidesDialog & ShowsSnippetView {
        // Adds to playlist and shows dialog and snippet
        let view = PlaylistSnippetView(
            playlist: updatedEntity,
            tracks: updated.tracks
        )
        return .result(dialog: dialog, view: view)
    }
}
```

## Interaction Donations
- Help Siri to become smarter by donating intents when using app
  - Example: Based on recent app usage Siri might suggest to send message to contact recently sent messages to.
- Donate intents via [`IntentDonationManager`](https://developer.apple.com/documentation/appintents/intentdonationmanager)
- System may ignore it when donating too excessively

```swift
// Donate intent with parameters and result so Siri can learn user preferences
let intent = SendMessageIntent()
intent.destination = .recipients(conversation.recipients.map(\.entity))

let result = messages.map(\.entity)
Task {
    try await IntentDonationManager.shared.donate(
        intent: intent,
        result: .result(value: result)
    )
}
```

## Confirmations
- Keep users informed and protect from unintended side effects
- By default Siri assumes entities are private and skips confirmation
- Conform to [`OwnershipProvidingEntity`](https://developer.apple.com/documentation/AppIntents/OwnershipProvidingEntity) to mark entities as public
  - Use only on public/shareable entities and provide ownership state
- Checkout docs for other ways to ask for confirmation

```swift
// Informs system if entity is public or shared with others
@AppEntity(schema: .calendar.event)
struct EventEntity: OwnershipProvidingEntity {
    // …
    
    var ownership: EntityOwnership {
        // isShared used to compute ownership state: .shared, .public, or .unknown
        attendees.isEmpty ? .unknown : .shared
    }
}
```

## Improve Content Discovery
### Index Entities in Spotlight
- Adopt [`IndexedEntity`](https://developer.apple.com/documentation/appintents/indexedentity) to index entities for Spotlight
- You may use `.indexAppEntities` on `CSSearchableIndex`

```swift
// Indexing IndexedEntity with CSSearchableIndex
struct EntityIndexingHelper {
    // Indexes playlist entities
    func indexPlaylist(_ playlist: Playlist) async throws {
        let entity = PlaylistEntity(playlist: playlist)
        try await CSSearchableIndex(name: indexName)
            .indexAppEntities([entity])
    }
}
```

- Add, update and delete entities to keep in sync with app
- Support reindexing by adopting `IndexedEntityQuery`
- Not required when supporting reindexing via Core Spotlight-level APIs
- Use `IntentValueQuery` for large datasets when indexing ahead of time is not suitable

```swift
// Structured search of songs and playlists
struct AudioIntentValueQuery: IntentValueQuery {

    // AudioSearch, IntentPerson, and other system types may be supported as input
    func values(for input: AudioSearch) async throws -> [AudioEntity] {
        switch input.criteria {
        case .searchQuery(let query):
            return try await searchResults(for: query)
        case .unspecified:
            return try await likedSongResults()
        // ... also a .url case
        }
    }
}
```

### Continue Search in App
- Re-run Siri search in app via `@AppIntent(schema: .system.searchInApp)` (previously `.system.search`)

```swift
// Intent that re-runs the Siri search in app
@AppIntent(schema: .system.searchInApp)
struct SearchAudioLibraryIntent {
    // …
    var criteria: StringSearchCriteria
    // …
    
    func perform() async throws -> some IntentResult {
        // Perform in-app search with Siri search string
        navigation.searchText = criteria.term
        navigation.selectedTab = .library
        return .result()
    }
}
```

### Onscreen Awareness
- Improve onscreen awareness with `.userActivity` (one primary action) and `.appEntityIdentifier` (many items in one view)
- Use `.appEntityIdentifier(forSelectionType:)` on `List` to avoid attaching to every item
  - System fetches identifiers lazily and discover entities scrolled off screen

```swift
struct PlaylistDetailView: View {
    var body: some View {
        List {
            ForEach(playlist.tracks) { track in
                PlaylistTrackRow(track: track)
            }
        }
        .appEntityIdentifier(forSelectionType: GeneratedTrack.ID.self) { trackID in
            EntityIdentifier(for: SongEntity.self, identifier: trackID)
        }
    }
}
```

- Use custom canvas view annotations for non-standard views
  - Check out _PianoRollView_ in the  [CosmoTunes sample code](https://developer.apple.com/documentation/appintents/integrating-your-music-app-with-apple-intelligence)
- Check out <doc:WWDC26-278-Modernize-your-UIKit-app> on how to adopt this in UIKit
- Speed up onscreen awareness by limit to only text of `displayRepresentations`via `requestedComponents`

```swift
// Component-based display representation queries
extension PlaylistQuery {
    func displayRepresentations(
        for identifiers: [PlaylistEntity.ID],
        requestedComponents: DisplayRepresentation.Components = .text
    ) async throws -> [PlaylistEntity.ID: DisplayRepresentation] {
        let entities = try await model.playlistEntities(for: identifiers)

        // Fetch display representations for fetched entities
        var result: [PlaylistEntity.ID: DisplayRepresentation] = [:]
        for entity in entities {
            result[entity.id] = await entity.displayRepresentation(with: requestedComponents)
        }
        return result
    }
}
```

## Leverage Existing Integrations
- Act on notifications by annotating `UNMutableNotificationContent` with `.appEntityIdentifiers`

```swift
import AppIntents
import UserNotifications

func scheduleNotification(message: Message, author: Contact, conversation: Conversation) {
    let content = UNMutableNotificationContent()
    content.title = author.name
    content.body = message.body
    
    // …
    
    // Annotate with entity identifier
    content.appEntityIdentifiers = [
        EntityIdentifier(for: MessageEntity.self, identifier: message.id)
    ]
    // Schedule the notification
}
```

- Act on now playing music by annotating `MusicContent` with `.appEntityIdentifiers`

```swift
import NowPlaying

final class CosmoTunesMediaSession: MediaSessionRepresentable {
    var content: (any MediaContentRepresentable)? {
        var content = MusicContent(id: track.id.uuidString, songTitle: track.title /* ... */)
        
        // Most specific to least specific
        content.appEntityIdentifiers = [
            EntityIdentifier(for: SongEntity.self, identifier: track.id),
            EntityIdentifier(for: ArtistEntity.self, identifier: track.session.artistName),
            EntityIdentifier(for: PlaylistEntity.self, identifier: currentPlaylist.id),
        ]
        return content
    }
}
```

- Act on alarms add single `EntityIdentifier` on `AlarmConfiguration`

```swift
import AlarmKit

func scheduleAlarm(_ alarm: Alarm) async throws {
    let configuration = AlarmManager.AlarmConfiguration<CosmoTunesAlarmMetadata>.alarm(
        schedule: schedule,
        attributes: attributes,
        appEntityIdentifier: EntityIdentifier(for: AlarmEntity.self, identifier: alarm.id),
        stopIntent: DismissAlarmIntent(),
        secondaryIntent: SnoozeAlarmIntent(),
        sound: sound
    )
    // Schedule alarm
}
```
    
- Can't use `TransientAppEntity` for all these, because of missing persistent identifier
