# What’s new in SwiftData

Discover the latest enhancements to SwiftData. We’ll show you how to persist custom and third-party types using Codable, and group fetched data into sections in your SwiftUI app. We’ll also explore how to observe data store changes anywhere else using ModelResultsObserver and HistoryObserver, giving you the flexibility to drive powerful state objects, integrate with delegate-based architectures, and react precisely to model updates.

@Metadata {
   @TitleHeading("WWDC26")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2026/274", purpose: link, label: "Watch Video (12 min)")

   @Contributors {
      @GitHubUser(alexkaessner)
   }
}

## Key Takeaways
- 🗄️ Sectioned fetch requests supported by @Query
- 🌈 Persist custom attribute types via Codable
- 🕵️ Observe changes outside of SwiftUI views

## Sectioning your fetches
- `@Query` now supports sectioned fetches
- Access query from property wrapper via underscore-prefix name
- Each section has ID property
  - ID is value model from the KeyPath passed on in `sectionBy`

```swift
struct TripListView: View {   
    @Query(sort: \Trip.startDate,
           sectionBy: \.destination)
    var trips: [Trip]

    var body: some View: {
        List {
            ForEach(_trips.sections) { section in
                Section(section.id) {
                    ForEach(section) { trip in
                        TripListItem(trip: trip)
                    }
               }
            }
        }
    }
}
```

## Using custom types
- SwiftData generates mapping between Model classes and entities + properties
  - Works automatically for most types
- Classes not annotated with `@Model` macro can't automatically be inspected and generated
- **Classes conforming to `Codable` can now be serialized to type by SwiftData**
  - SwiftData stores the serialized representation
  - Use `.codable` attribute to mark for automatic serialization

```swift
import SwiftData

@Model class Trip {

    struct Location: Codable {
        var latitude: Double
        var longitude: Double
    }

    var name: String
    var destination: String

    var startDate: Date
    var endDate: Date

    var location: Location?
    @Attribute(.codable) var mapItemIdentifier: MKMapItem.Identifier?
}
```
### Limitations of `@Attribute(.codable)`
- Persists encoded representation instead of inferring schema for type
- No support for filtering in Predicates or sorting in Sort Descriptors
  - Codable attributes are opaque to SwiftData
- Migration is defined by type
  - Adding or removing properties from codable type won't trigger migration
  - Type must encode and decode in forward- and backward-compatible way

> Warning:
> Avoid codable for Types you define: "Using Codable attributes can be thought of as an 'escape hatch' to persist types that SwiftData does not support natively."

## Observing data stores
- `@Query` fetches on appear and re-renders views on change of store
  - First choice for SwiftUI views
- Use [`ResultsObserver`](https://developer.apple.com/documentation/swiftdata/resultsobserver) to observe data outside of SwiftUI view
  - Uses Swift observation
  - Supports sorting, filtering, and sectioning

```swift
// Use observation to update map bounds

@Observable @MainActor final class MapCameraController {
    private let resultsObserver: ResultsObserver<Trip>
    var bounds: MapCameraBounds?
    private var token: ObservationTracking.Token?

    init(modelContext: ModelContext) throws {
        resultsObserver = try ResultsObserver<Trip>(modelContext: modelContext)

        token = withContinuousObservation(options: [.didSet]) { [weak self] event in
            self?.bounds = self?.calculateBounds(trips: resultsObserver.results)
       }
    }

    private func calculateBounds(trips: [Trip]) -> MapCameraBounds? {
        // Handle update
    }
}
```

- Observing history changes possible with [`HistoryObserver`](https://developer.apple.com/documentation/swiftdata/historyobserver)
  - Uses Swift observation
  - Filter by model type or transaction author
  - See <doc:WWDC24-10075-Track-model-changes-with-SwiftData-history> for more about persistent history
- Single observable property: `eventCounter`
  - Increments when new transactions are available

```swift
// Using HistoryObserver to sync with a server

@SyncActor final class ServerSync {
    private let observer: HistoryObserver
    private var token: ObservationTracking.Token?

    func start() throws {
        self.observer = try HistoryObserver(authors: ["App"], modelContainer: modelContainer)
        token = withContinuousObservation(options: .didSet) { [weak self] _ in
            _ = self?.observer.eventCounter
            self?.processChanges()
        }
    }

    private func processChanges() {
        // Fetch and process history transactions
    }
}
```
