# Track model changes with SwiftData history

Reveal the history of your model’s changes with SwiftData! Use the history API to understand when data store changes occurred, and learn how to use this information to build features like remote server sync and out-of-process change handing in your app. We’ll also cover how you can build support for the history API into a custom data store.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10075", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(n3twr)
   }
}







# Key Takeaways

- **Track changes** to your Data Store over time
- With History functionality you can **track transactions and their history**
- **Tombstones** to preserve specific values on a model after deletion
- **Custom Data Stores** can implement History

@Row {
   @Column {
      @Image(source: "WWDC24-10075-Overview1")
   }
   @Column {
      @Image(source: "WWDC24-10075-Overview2")
   }
}
@Row {
   @Column {
      @Image(source: "WWDC24-10075-Overview3")
   }
   @Column {
      @Image(source: "WWDC24-10075-Overview4")
   }
}


# Fundamentals

- Without this feature, You can query the data at the Data Store at a given time, but you can’t know how you got there.
- History functionality allows you to **track the path** taken to get there.
- Now, with SwiftData History, **your app now can query and process changes preserving the order of occurrence**.

## How it works:

- When your model is saved, records a **transaction**.
- A **transaction**:
    - contains a set of changes in the Store,
    - at a given point in time, 
    - ordered by the time they occurred
- A bookmark/**token** for the transaction allows the developer track the last changes in the store processed by the consumer (typically the view)
- **Tokens from deleted objects** in the Store are not valid anymore for history fetching once the deletion happens.
    - To preserve history of deleted values, **tombstones** are introduced
    - You can mark an attribute as **```preservevalueondeletion```** in order to preserve specific attributes on history


# Custom Stores

- Custom Data Stores can support history
- **Add history functionality to your custom Data Store by implementing Data History API for your own Store**:
    - Transactions
    - Change types
    - Tokens (as bookmarks between changes)
    - History providing (clear boundaries between transactions)

