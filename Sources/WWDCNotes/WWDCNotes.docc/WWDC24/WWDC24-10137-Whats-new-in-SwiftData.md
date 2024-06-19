# What’s new in SwiftData

SwiftData makes it easy to add persistence to your app with its expressive, declarative API. Learn about refinements to SwiftData, including compound uniqueness constraints, faster queries with #Index, queries in Xcode previews, and rich predicate expressions. Join us to explore how you can use all of these features to express richer models and improve performance in your app.
To discover how to build a custom data store or use the history API in SwiftData, watch “Create a custom data store with SwiftData” and “Track model changes with SwiftData history”.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10137", purpose: link, label: "Watch Video (14 min)")

   @Contributors {
      @GitHubUser(MortenGregersen)
      @GitHubUser(n3twr)
   }
}

## Key takeaways

👥 Avoid duplicate models with `#Unique`
🚀 Speed up queries with `#Index`
📖 Track model changes with history
🤓 Create your custom data store to SwiftData

## Presenters

* Rishi Verma, SwiftData Engineer

## Adopt SwiftData

Adopting SwiftData for your models is as easy as decorating the models with the `@Model` macro and the `.modelContainer` to the app:

```swift
import SwiftData
import SwiftData

@main
struct TripsApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView
        }
        .modelContainer(for: Trip.self)
    }
}

@Model
class Trip {
    var name: String
    var destination: String
    var startDate: Date
    var endDate: Date
    
    var bucketList: [BucketListItem] = [BucketListItem]()
    var livingAccommodation: LivingAccommodation?
}

@Model
class BucketListItem {...}

@Model
class LivingAccommodation {...}
```

## Customize the schema

Macros for customizing the models:
* Use `@Attributes` to set properties for a model property
* Use `@Relationships` for relations to other models 
* User `@Transient` to avoid persisting a property

### Unique macro

Ensure data uniqueness by using the `#Unique` macro:

* Unique property **combination**.
* Prevents duplicated entries.
* Support of **upsert** (update/insert) operations.

> *Use the new `#Unique` macro to tell SwiftData which combinations of your model’s properties must always remain unique in the model data.*
>
> *When two model instances share the same unique values, SwiftData will perform an upsert on collision with an existing model.*

```swift
// Add unique constraints to avoid duplication
import SwiftData

@Model 
class Trip {
    #Unique<Trip>([\.name, \.startDate, \.endDate])
    
    var name: String
    var destination: String
    var startDate: Date
    var endDate: Date
    
    var bucketList: [BucketListItem] = [BucketListItem]()
    var livingAccommodation: LivingAccommodation?
}
```

Add the `@Attribute(.preserveValueOnDeletion)` to the properties to ensure these identity values will be available when using the history API in SwiftData.

### Reveal history with SwiftData

* Track inserted, updated, and deleted models
* Opt in to preserve values on deletion with the `#Preserve` macro.
    * **Tombstone values** for deleted models.
* Works with custom data stores
* Useful for auditing and processing changes.

Learn more in the session: "Track model changes with SwiftData history"

## Tailor a container

It is now possible to create custom data stores for SwiftData:

* Using custom storage formats (JSON archival, cloud storage, etc.)
* Integration with actual SwiftData API...
* ... but with incremental adoption of SwiftData full feature set.

You can also customize the Model Container:

* In-memory vs on-disk storage options.
* Manage data storage & retrieval from the Data Store.
* Define custom storage URL for the Store.
* Enable/disable: auto-save, undo/redo, etc.

```swift
import SwiftUI
import SwiftData

@main
struct TripsApp: App {
    var container: ModelContainer = {
        do {
            let configuration = JSONStoreConfiguration(schema: Schema([Trip.self]), url: jsonFileURL)
            return try ModelContainer(for: Trip.self, configurations: configuration)
        }
        catch { ... }
    }()
    
   var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(container)
   }
}
```

Learn more in the session: "Create a custom data store with SwiftData"

### Use SwiftData in previews

The new `PreviewModifier` in SwiftUI can be used to set up a container for previews:

```swift
import SwiftUI
import SwiftData

// Make preview data using traits

struct SampleData: PreviewModifier {
    static func makeSharedContext() throws -> ModelContainer {
        let config = ModelConfiguration(isStoredInMemoryOnly: true)
        let container = try ModelContainer(for: Trip.self, configurations: config)
        Trip.makeSampleTrips(in: container)
        return container
    }
    
    func body(content: Content, context: ModelContainer) -> some View {
        content.modelContainer(context)
    }
}

extension PreviewTrait where T == Preview.ViewTraits {
    @MainActor static var sampleData: Self = .modifier(SampleData())
}

// Use sample data in a preview

struct ContentView: View {
    @Query
    var trips: [Trip]

    var body: some View {
        ...
    }
}

#Preview(traits: .sampleData) {
    ContentView()
}
```

The `PreviewModifier` can also be used for previews of views taking a model as parameter:

```swift
// Create a preview query using @Previewable

import SwiftUI
import SwiftData

#Preview(traits: .sampleData) {
    @Previewable @Query var trips: [Trip]
    BucketListItemView(trip: trips.first)
}
```

## Optimize queries

* Use `@Predicate` macro to build **custom queries**.
* Filter and sort data **efficiently**.
* Build complex predicates with **multi-condition filtering**.

### Compound predicates

In iOS 17.4 Compound predicates was added:

```swift
let predicate = #Predicate<Trip> {
    searchText.isEmpty ? true :
    $0.name.localizedStandardContains(searchText) ||
    $0.destination.localizedStandardContains(searchText)
}
```

### Using the new #Expression

The `#Expression` macro helps you **Perform Complex Evaluations** in your Queries:

* Use it in building sophisticated query conditions.
* This macro supports arbitrary types.
* Example: count specific items in an array for predicates.

New in iOS 18, we can use the new `#Expression` from Foundation:

```swift
// Build a predicate to find Trips with BucketListItems that are not in the plan

let unplannedItemsExpression = #Expression<[BucketListItem], Int> { items in
    items.filter {
        !$0.isInPlan
    }.count
}

let today = Date.now
let tripsWithUnplannedItems = #Predicate<Trip>{ trip
    // The current date falls within the trip
    (trip.startDate ..< trip.endDate).contains(today) &&

    // The trip has at least one BucketListItem
    // where 'isInPlan' is false
    unplannedItemsExpression.evaluate(trip.bucketList) > 0
}
```

### Index macro

The `#Index` macro is used to **Enhance Query Performance**:

* Add metadata to the model, creating indexes on properties
* Provides faster and more efficient queries
* Speeds up searches and sorting on large datasets
* Specify properties used in queries for speed up common queries

Use the new `#Index` macro to mark properties as index to query models faster: 

```swift
// Add Index for commonly used KeyPaths or combination of KeyPaths
import SwiftData

@Model 
class Trip {
    #Unique<Trip>([\.name, \.startDate, \.endDate
    #Index<Trip>([\.name], [\.startDate], [\.endDate], [\.name, \.startDate, \.endDate])

    var name: String
    var destination: String
    var startDate: Date
    var endDate: Date
    
    var bucketList: [BucketListItem] = [BucketListItem
    var livingAccommodation: LivingAccommodation
}
```
