# Create a custom data store with SwiftData

Combine the power of SwiftData's expressive, declarative modeling API with your own persistence backend. Learn how to build a custom data store and explore how to progressively add persistence features in your app. To get the most out of this session, watch "Meet SwiftData" and "Model your schema with SwiftData" from WWDC23.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10138", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(n3twr)
   }
}

# Key Takeaways

- ‼️ The New Data Store Protocol
- 🏄🏽‍♂️ Use custom persistence backends
- 🌩️ SwiftData storage in the cloud
- 🧰 JSON as an archival persistent store 

@Row {
   @Column {
      @Image(source: "WWDC24-10138-Overview1")
   }
   @Column {
      @Image(source: "WWDC24-10138-Overview2")
   }
}
@Row {
   @Column {
      @Image(source: "WWDC24-10138-Overview3")
   }
   @Column {
      @Image(source: "WWDC24-10138-Overview4")
   }
}

# Presenter
Luvena Huo, SwiftData Engineer

# Overview

- The View consumes data from a Model in a ModelContext.
- The ModelContext reads and writes data using a ModelContainer with an associated Store.
- The Store fetch and save data (from the persistence backend) required to support the persistent models.

## The Store in SwiftData ecoverse:

- The ModelContext instantiates persistent models with associated persistent identifiers and track changes to be saved to the permanent Store.
- **Remaping**: is the process of assigning a permanent persistent identifier to a temporary one. The temporary persistent identifiers are generated when changes are translated by the View in the ModelContext to objects not yet persisted to the Store.
- **Snapshots**: are used as a method of communication between the ModelContext and the Store (and viceversa). Snapshots are _"sendable, codable containers of the values in the model at that point in time"_.
    

# The New DataStore Protocol

- Allows the ModelContext to R&W model data to **any storage format**. 
- There are 3 protocols related to a store:
    - Data Store **Configuration**: describe the store.
    - Data Store **Snapshot**: communication protocol between the Store and the ModelContext. Data Store fetch request & Data Store fetch result. Associated snapshots & remapping.
    - **Data Store**: functionality needed by the ModelContext to use the Data Store.
- Additional protocols: History protocol (check related session notes).


# JSON Store type as an example

Example of using **JSON** as a file to persist the models. This is an **archival store**, meaning that the entire file is loaded & saved when performing R||W operations to the Store.

The data is stored as an **array of snapshots** in the file.

## Steps

1. **Reference** using associated types.
2. Declare **snapshot usage**.

```swift
final class JSONStoreConfiguration: DataStoreConfiguration {
    // (1): cross reference
    typealias StoreType = JSONStore
    ...
}

final class JSONStore: DataStore {
    // (1): cross reference
    typealias Configuration = JSONStoreConfiguration
    // (2): no need to customize the default data encoding/decoding
    typealias Snapshot = DefaultSnapshot
    ...
}
```

3. Implement the **required methods**: fetch & save. You need to implement these two methods to make the Store usable by the ModelContext.

4. Implement **fetch** (R): load data from the store & return results.

```swift
class JSONStore: DataStore {
    func fetch<T>(_ request: DataStoreFetchRequest<T>) throws -> DataStoreFetchResult<T, DefaultSnapshot> where T : PersistentModel {
        
        // (1): load data from the store
        let decoder = JSONDecoder ()
        let data = try Data(contentsof: configuration.fileURL)
        let trips = try decoder decode ([DefaultSnapshot].self, from: data)

        // (2): return results
        return DataStoreFetchResult(descriptor: request.descriptor, fetchedSnapshots: trips)
    }
}
``` 

5. Implement **save** (CUD): write the snapshots into the JSON file. 

Steps:

* Read the current content of the file: **read()**

```swift
var snapshotsByIdentifier = [PersistentIdentifier: DefaultSnapshot]()
try self.read().forEach { snapshotsByIdentifier[$0.persistentIdentifier] = $0 }
``` 

* **Assigning** and **remapping** identifiers (create or update from temporary to permanent ones).

```swift
var remappedIdentifiers = [PersistentIdentifier: PersistentIdentifier]()
for snapshot in request. inserted {
    let entityName = snapshot.persistentIdentifier.entityName
    let permanentIdentifier = try PersistentIdentifier.identifier(for: identifier, entityName: entityName, primaryKey: UUID())
    let snapshotCopy = snapshot.copy(persistentIdentifier: permanentIdentifier)
    remappedIdentifiers[snapshot.persistentIdentifier] = permanentIdentifier
    snapshotsByIdentifier[permanentIdentifier] = snapshotCopy
}
``` 

```swift
for snapshot in request.updated {
    snapshotsByIdentifier[snapshot.persistentIdentifier] = snapshot
｝
```

* **Remove deleted** snapshots.

```swift
for snapshot in request.deleted {
    snapshotsByIdentifier[snapshot.persistentIdentifier] = nil
}
``` 

* **Save** working snapshot copy to disk.

```swift
for snapshot in request.updated {
let snapshots = snapshotsByIdentifier.values.map(‹ $0 })
let encoder = JSONEncoder()
let jsonData = try encoder. encode(snapshots)
try jsonData.write(to: configuration.fileURL)
``` 


* Return the **save()** operation result with the remapped persistent identifiers.


```swift
return DataStoreSaveChangesResult(for: self.identifier,
remappedIdentifiers: remappedIdentifiers)
``` 

