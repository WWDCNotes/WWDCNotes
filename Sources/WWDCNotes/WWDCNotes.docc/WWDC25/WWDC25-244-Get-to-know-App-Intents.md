# Get to know App Intents

Learn about the App Intents framework and its increasingly critical role within Apple’s developer platforms. We’ll take you through a ground-up introduction of the core concepts: intents, entities, queries, and much more. You’ll learn how these pieces fit together and let you integrate your app through Apple’s devices, from software features like Spotlight and Shortcuts to hardware features like the Action button. We’ll also walk through how App Intents is your app’s gateway to integrating with Apple Intelligence going forward.

@Metadata {
   @TitleHeading("WWDC25")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2025/244", purpose: link, label: "Watch Video (24 min)")

   @Contributors {
      @GitHubUser(alexkaessner)
   }
}
## Key Takeaways
- Bring app functionality out into the system
- App Intents perform actions of your app
- App Shortcuts expose App Intents to Spotlight, Siri, Action Button or Apple Pencil
- App Enums are static values
- App Entities are dynamically fetched values

## App Intents ecosystem
App Intents (short _Intents_) allow you to bring your apps functionality out into the system like:
- Spotlight search results
  - New: Spotlight on Mac can invoke actions directly
- Configurable and interactive Widgets
- Controls in Control Center
- Apple Pencil Pro actions
- Shortcuts App

### Core Concepts
- [`AppIntents`](https://developer.apple.com/documentation/appintents/appintent) describe actions of your app (basically the verb)
- Intents take parameters and return values as native Swift types or custom types (basically the noun)
  - Use [`AppEnum`](https://developer.apple.com/documentation/appintents/appenum) for _constant_ set of values
  - Use [`AppEntity`](https://developer.apple.com/documentation/appintents/appentity) for _dynamic_ set of values
- [`AppShortcuts`](https://developer.apple.com/documentation/appintents/appshortcut) used to surface App Intents to Siri, Spotlight, etc. (basically the sentence)


## Basic Structure of App Intents

```swift
struct NavigateIntent: AppIntent {
    // Title shown in Shortcuts app
    static let title: LocalizedStringResource = "Navigate to Landmarks"

    // Opens app before running perform() (optional)
    static let supportedModes: IntentModes = .foreground

    // Action of the Intent
    // Running on @MainActor here because example navigates app
    @MainActor
    func perform() async throws -> some IntentResult {
        Navigator.shared.navigate(to: .landmarks)
        return .result()
    }
}
```

- Minimum requirements for App Intent are title and perform method
- `title` is localized name of Intent
- `perform()` method contains logic returning `IntentResult`
- [`IntentResult`](https://developer.apple.com/documentation/appintents/intentresult) can be used for Siri's response or showing snippet
- By default Intents don't foreground/open app
- Use new `supportedModes` to open app before intent is run

## App Shortcuts

@Image(source: "WWDC25-244-AppShortcuts")

- `AppShortcuts` expose App Intents to Spotlight, Siri, Action Button or Apple Pencil
- Also appear in dedicated section in Shortcuts app
- Defined via `AppShortcutsProvider` once per app:

```swift
struct TravelTrackingAppShortcuts: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: NavigateIntent(),
            phrases: [
                "Navigate in \(.applicationName)",
                "Navigate to \(\.$navigationOption) in \(.applicationName)"a
            ],                
            shortTitle: "Navigate",
            systemImageName: "arrowshape.forward"
        )
    }
}
```

- Each phrase must contain app name placeholder `.applicationName`
- Can include up to one intent parameter
  - Creates App Shortcut for each value of type

@Image(source: "WWDC25-244-AppShortcuts-with-Attributes")

Learn more about App Shortcuts in this talk: <doc:WWDC23-10102-Spotlight-your-app-with-App-Shortcuts>

## Customize Shortcuts Appearance

```swift
struct NavigateIntent: AppIntent {
    // …
  
    // Sentence like representation in Shortcuts app
    static var parameterSummary: some ParameterSummary {
        Summary("Navigate to \(\.$navigationOption)")
    }
  
    // Custom label for parameter & title shown when user input is required
    @Parameter(
        title: "Section",
        requestValueDialog: "Which section?"
    )
    var navigationOption: NavigationOption

    @MainActor
    func perform() async throws -> some IntentResult {
        Navigator.shared.navigate(to: navigationOption)
        return .result()
    }
}
```

- Use `parameterSummary` to add sentence like representation for Shortcut
- Accepts parameters for inline customization

@Row(numberOfColumns: 2) {
    @Column(size: 1) {
        @Image(source: "WWDC25-244-Shortcut-Text-A")
    }
    
    @Column(size: 1) {
        @Image(source: "WWDC25-244-Shortcut-Text-B")
    }
}

- Use `title` at `@Parameter` to customize label
- Use `requestValueDialog` at `@Parameter` for custom Siri headline

@Image(source: "WWDC25-244-RequestDialog")

## Static Values via `AppEnum`

```swift
enum NavigationOption: String, AppEnum {
    case landmarks
    case map
    case collections

    // Title of the whole type
    static let typeDisplayRepresentation: TypeDisplayRepresentation = "Navigation Option"

    // Title of each individual case
    static let caseDisplayRepresentations: [NavigationOption: DisplayRepresentation] = [
        .landmarks: "Landmarks",
        .map: "Map",
        .collections: "Collections"
    ]
}
    
struct NavigateIntent: AppIntent {
    // …
  
    // Link to AppEnum
    @Parameter var navigationOption: NavigationOption

    @MainActor
    func perform() async throws -> some IntentResult {
        Navigator.shared.navigate(to: navigationOption)
        return .result()
    }
}
```

- Conform enums to `AppEnum` to use them in Intents
- Requires to also conform to `String`
- Requires `typeDisplayRepresentation` as description of the whole type
- Requires `caseDisplayRepresentations` as description of individual cases
  - Needs to be constant as it is used at compile time!
- Use `@Parameter` to offer options to Intents
  - Parameters can be optional or required
- Add icons via [`DisplayRepresentation`](https://developer.apple.com/documentation/appintents/displayrepresentation):

```swift
static let caseDisplayRepresentations = [
    NavigationOption.landmarks: DisplayRepresentation(
        title: "Landmarks",
        image: .init(systemName: "building.columns")
    ),
    NavigationOption.map: DisplayRepresentation(
        title: "Map",
        image: .init(systemName: "map")
    ),
    NavigationOption.collections: DisplayRepresentation(
        title: "Collections",
        image: .init(systemName: "book.closed")
    )
]
```

@Image(source: "WWDC25-244-Entity-Icons")

## Dynamic Values via `AppEntity`
- Use existing types or create new types as bridge between data model and Intents via `AppEntity`
- `AppEntity` must be identifiable with persistent ID for lookup
- Use `@Property` to define attributes
  - Will be exposed to user
  - Also used for Find and Filter actions
- Use new getter `@ComputedProperty` to defer to data model directly
- Requires representations of type and instances like App Enums
- Requires `defaultQuery` to get the dynamic data

@TabNavigator {
    @Tab("Set from data model") {
        ```swift
        struct LandmarkEntity: AppEntity {
            // Required persistent identifier
            var id: Int

            // Attributes exposed to users
            @Property
            var name: String

            @Property
            var description: String
            
            // Title of the whole type
            static let typeDisplayRepresentation = TypeDisplayRepresentation(name: "Landmark")
            
            // Title of each individual case
            var displayRepresentation: DisplayRepresentation {
                DisplayRepresentation(title: "\(name)")
            }
            
            // Handling of retrieving the data
            static let defaultQuery = LandmarkEntityQuery()
        }
        ```
    }
    
    @Tab("Defer to data model") {
        ```swift
        struct LandmarkEntity: AppEntity {
            // Required persistent identifier
            var id: Int { landmark.id }
            
            // Attributes exposed to users
            @ComputedProperty
            var name: String { landmark.name }
            
            @ComputedProperty
            var description: String { landmark.description }
            
            // The data model
            let landmark: Landmark
            
            // Title of the whole type
            static let typeDisplayRepresentation = TypeDisplayRepresentation(name: "Landmark")
            
            // Title of each individual case
            var displayRepresentation: DisplayRepresentation {
                DisplayRepresentation(title: "\(name)")
            }
            
            // Handling of retrieving the data
            static let defaultQuery = LandmarkEntityQuery()
        }
        ```
    }
}

### Query the Data
- [`EntityQuery`](https://developer.apple.com/documentation/appintents/entityquery) is used to get the Entities from app
- [`EntityStringQuery`](https://developer.apple.com/documentation/appintents/entitystringquery) asks for Entity matching a string
- [`EntityPropertyQuery`](https://developer.apple.com/documentation/appintents/entitypropertyquery) used for more complex filtering
- Use `@Dependency` to access local database or other dependencies
  - Register as early as possible in app lifecycle via `AppDependencyManager`

```swift
struct LandmarkEntityQuery: EntityQuery {
    // Optional link to local database
    @Dependency var modelData: ModelData
    
    func entities(for identifiers: [LandmarkEntity.ID]) async throws -> [LandmarkEntity] {
        modelData
        .landmarks(for: identifiers)
        .map(LandmarkEntity.init)
    }
}

// Register dependency in App
@main
struct LandmarksApp: App {    
    init() {
        AppDependencyManager.shared.add { ModelData() }
    }
}
```

## Show Results after Run
```swift
struct ClosestLandmarkIntent: AppIntent {
    static let title: LocalizedStringResource = "Find Closest Landmark"

    @Dependency var modelData: ModelData

    @MainActor
    func perform() async throws -> some ReturnsValue<LandmarkEntity> & ProvidesDialog & ShowsSnippetView {
        
        let landmark = try await modelData.findClosestLandmark()

        return .result(
            value: landmark,
            dialog: "The closest landmark to you is \(landmark.name)",
            view: ClosestLandmarkView(landmark: landmark)
        )
    }
}
```

- `@Dependency` can be used in App Intents
- Return all kinds of values for multi step actions via `ReturnsValue`
  - Possible to return Entities for your own app actions
- Return `ProvidesDialog` to read out results
- Return `ShowsSnippetView` for custom results view

@Image(source: "WWDC25-244-ResultsView")

## Customize Representation of App Entities
- Uses display representation by default
- Use `Transferable` protocol to customize representation
- Can be used to share data between apps and other actions

```swift
extension LandmarkEntity: Transferable {
    static var transferRepresentation: some TransferRepresentation {
        DataRepresentation(exportedContentType: .image) {
            return try $0.imageRepresentationData
        }
    }
}
```

Choose in Shortcuts app between types:

@Image(source: "WWDC25-244-Type-Representation")

## App Entities in Spotlight

```swift
struct LandmarkEntity: IndexedEntity {
    // …
    
    @Property(
        indexingKey: \.displayName
    )
    var name: String

    @Property(
        indexingKey: \.contentDescription
    )
    var description: String
}
```

- Donate to Spotlight by conforming to [`IndexedEntity`](https://developer.apple.com/documentation/appintents/indexedentity)
  - Is an `AppEntity` with Core Spotlight attribute set
- Add indexing keys to `@Property`

@Image(source: "WWDC25-244-Spotlight")

- Tapping Spotlight result opens app by default
- Open corresponding view via a `OpenIntent`:

```swift
struct OpenLandmarkIntent: OpenIntent, TargetContentProvidingIntent {
    static let title: LocalizedStringResource = "Open Landmark"

    @Parameter(title: "Landmark", requestValueDialog: "Which landmark?")
    var target: LandmarkEntity
}

// App Handling
struct LandmarksNavigationStack: View {
    @State var path: [Landmark] = []

    var body: some View {
        NavigationStack(path: $path) {}
        .onAppIntentExecution(OpenLandmarkIntent.self) { intent in
            path.append(intent.target.landmark)
        }
    }
}
```

- `OpenIntent` automatically open app before performing action
- Require `target` parameter
- Using `TargetContentProvidingIntent` doesn't require the `perform()` action
  - Links to view in app via `.onAppIntentExecution` modifier

## More Advanced Queries
- Use `suggestedEntities()` to offer selection to user in Siri or App Shortcuts
- Use `.updateAppShortcutParameters()` in app to generate App Shortcut for each entity

```swift
struct LandmarkEntityQuery: EntityQuery {
    // …

    func suggestedEntities() async throws -> [LandmarkEntity] {
        modelData
            .favoriteLandmarks()
            .map(LandmarkEntity.init)
    }
}
```

@Image(source: "WWDC25-244-Suggested-Entities")

- Use [`EnumerableEntityQuery`](https://developer.apple.com/documentation/appintents/enumerableentityquery) with `allEntities()` function **if all entities can fit in memory**
- Use `EntityPropertyQuery` for more complicated queries:

```swift
extension LandmarkEntityQuery: EntityPropertyQuery {
    static var properties = QueryProperties {
        // …
    }

    static var sortingOptions = SortingOptions {
        // …
    }

    func entities(
        matching comparators: [Predicate<LandmarkEntity>],
        mode: ComparatorMode,
        sortedBy: [Sort<LandmarkEntity>],
        limit: Int?
    ) async throws -> [LandmarkEntity] {
        // Handle data fetching, filtering and sorting
    }
}
```

- Use `EntityStringQuery` for finding entities via matching string:

```swift
extension LandmarkEntityQuery: EntityStringQuery {
    func entities(matching: String) async throws -> [LandmarkEntity] {
        modelData
            .landmarks
            .filter { $0.name.contains(matching) || $0.description.contains(matching) }
            .map(LandmarkEntity.init)
    }
}
```

## How it works
- Code is the source of truth
- Code is read at compile time
- Packaged with your target
- Indexed at installation

@Image(source: "WWDC25-244-Sharing-Targets")

- Intents can be shared via multiple targets
- Register each target via `AppIntentsPackage`

```swift
// Swift Package
public struct TravelTrackingKitPackage: AppIntentsPackage {}
public struct LandmarkEntity: AppEntity {
    // …
}

// App
struct TravelTrackingPackage: AppIntentsPackage {
    static var includedPackages: [any AppIntentsPackage.Type] {
        [TravelTrackingKitPackage.self]
    }
}
struct OpenLandmarkIntent: OpenIntent {
    // …
}

// Extension
struct TravelTrackingExtensionPackage: AppIntentsPackage {
    static var includedPackages: [any AppIntentsPackage.Type] {
        [TravelTrackingKitPackage.self]
    }
}
struct FavoriteLandmarkIntent: AppIntent {
    // …
}
```



