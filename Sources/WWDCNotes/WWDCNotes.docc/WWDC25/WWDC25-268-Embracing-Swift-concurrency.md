# Embracing Swift concurrency

Join us to learn the core Swift concurrency concepts. Concurrency helps you improve app responsiveness and performance, and Swift is designed to make asynchronous and concurrent code easier to write correctly. We’ll cover the steps you need to take an app through from single-threaded to concurrent. We’ll also help you determine how and when to make the best use of Swift concurrency features – whether it’s making your code more asynchronous, moving it to the background, or sharing data across concurrent tasks.

@Metadata {
   @TitleHeading("WWDC25")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2025/268", purpose: link, label: "Watch Video (28 min)")

   @Contributors {
      @GitHubUser(mini-min)
   }
}

## Key Takeaways

- suggest journey from sigle-threaded to concurrent

> Tip: Apps need to use concurrency sparingly, should only introduce concurrency as you need it.

## Presenters
- Doug Gregor, Swift team

## Step 0. Single-threaded code
- Start by running all code on the main thread 
  - Easier to write and maintain (only one thing happens at a time)
  - Many apps need concurrency only sparingly, some not at all → introduce it only as needed
- The main thread and its data are represented by the main actor
  - No concurrency exists on the main actor, since only one main thread can run it
- Mark code/data with `@MainActor` to isolate it — Swift ensures it only runs on the main thread and its data is only accessed there

@Image(source: "WWDC25-268-mainactor-default-1.jpeg", alt: "@MainActor isolates code and data to the main thread")

- Main actor by default: a build setting that applies `@MainActor` across a whole module for you
  - Enabled by default for new app projects in Xcode 26+; best for the main app module and UI-focused modules

@Image(source: "WWDC25-268-mainactor-default-2.jpeg", alt: "Main actor by default build setting")

- Keep the app responsive — don't tie up the main thread so long that the UI glitches or hangs
  - e.g. a synchronous fetch blocks the main thread until the download finishes, freezing the UI

@Image(source: "WWDC25-268-mainactor-delay.jpeg", alt: "Blocking the main thread hangs the UI")

```swift
func fetchAndDisplayImage(url: URL) throws {
    let (data, _) = try URLSession.shared.data(from: url)
    let image = decodeImage(data)
    view.displayImage(image)
}
```

## Step 1. Asynchronous tasks
- Use asynchronous tasks when waiting on data (e.g. a network request) without tying up the main thread
- Mark the function `async` and call the slow API with `await`
  - `await` marks a suspension point — the function may stop running on the current thread until the awaited event happens, then resumes
  - Think of it as splitting the function in two (before / after the fetch) → other work can run in between, keeping the UI responsive
  - `await` does not block the main thread; APIs like `URLSession` offload the actual work to the background for you

@Image(source: "WWDC25-268-going-asynchronous.jpeg", alt: "Making the function async and awaiting the URLSession call")

```swift
func fetchAndDisplayImage(url: URL) async throws {
    let (data, _) = try await URLSession.shared.data(from: url)
    let image = decodeImage(data)
    view.displayImage(image)
}
```

- An `async` function runs in a task
  - A task executes independently of other code and should perform one operation end-to-end
  - Commonly created in response to an event (e.g. a button press) — start async work from sync code with `Task { }`

```swift
func onTapEvent() {
    Task {
        do {
            try await fetchAndDisplayImage(url: url)
        } catch let error {
            displayError(error)
        }
    }
}
```

- Each task completes operations in order, start to finish
- Fetching runs in the background, but the task's other operations still run on the main thread — only one runs at a time

@Image(source: "WWDC25-268-tasks-turns-main-1.jpeg", alt: "Independent tasks take turns on the main thread")

@Image(source: "WWDC25-268-tasks-turns-main-2.jpeg", alt: "Task order depends on which fetch finishes first")

> Tip:
> What is "Interleaving"?  
> - a single thread alternating between multiple independent tasks → more efficient use of resources  
> - still no concurrency in your own code — async is not background, it just means non-blocking while staying on the main actor

> Note: Asynchronous single-threaded code is often enough.  
> - If the app feels unresponsive, too much is running on the main thread  
> - profile with Instruments, and speed the work up without concurrency first if you can


## Step 2. Introduce concurrency to move work to a background thread
- Async single-threaded code isn't always enough — async functions still run on the main actor, so heavy CPU work (e.g. decoding a large image) can still hang the UI
- Concurrency runs parts of your code on a background thread, in parallel with the main thread → doesn't block the UI, and uses more CPU cores
- `@concurrent` runs the function in the background

```swift
@MainActor
func fetchAndDisplayImage(url: URL) async throws {
    let (data, _) = try await URLSession.shared.data(from: url)
    let image = await decodeImage(data, at: url)
    view.displayImage(image)
}

@concurrent
func decodeImage(_ data: Data, at url: URL) async -> Image {
    if let image = cachedImage[url] {   // error: main actor-isolated property 'cachedImage'
        return image                     // can't be accessed from outside the main actor
    }

    // decode image
    cachedImage[url] = image
    return image
}
```

- The system schedules offloaded work on the concurrent thread pool (all of the system's background threads)
  - Small devices (e.g. a watch) may have only 1–2 threads, systems with more cores have more
  - When a task suspends, its thread runs other ready tasks, on resume it may continue on any available thread

@Image(source: "WWDC25-268-concurrent-thread-pool.jpeg", alt: "The concurrent thread pool of background threads")

- Data-race problem: a `@concurrent` function can't access main-actor-isolated state (e.g. `cachedImage`) → the compiler shows exactly where, so you don't introduce bugs while adding concurrency

> Tip: Strategies to break ties to the main actor
> 1. Move the main-actor code into a caller that always runs on the main actor
> 2. Use `await` to access the main actor from concurrent code asynchronously
> 3. Mark code `nonisolated` when it doesn't need any actor

- Strategy 1 — check the cache in the `@MainActor` caller (no isolation error), and offload only the decode
  - Checking the cache before any async call removes latency: a cache hit completes synchronously without ever suspending

```swift
func fetchAndDisplayImage(url: URL) async throws {
    if let image = cachedImage[url] {
        view.displayImage(image)
        return
    }

    let (data, _) = try await URLSession.shared.data(from: url)
    let image = await decodeImage(data)
    cachedImage[url] = image
    view.displayImage(image)
}

@concurrent
func decodeImage(_ data: Data) async -> Image { ... }
```

- Strategy 3 — for a library used by many clients, `@concurrent` isn't always best (small data is fine on the main thread)
  - Provide a `nonisolated` API and let the client decide whether to offload
  - `nonisolated` code is flexible: called from the main actor it stays there, called from a background thread it stays there → a great default for general-purpose libraries

```swift
nonisolated
public class JSONDecoder {
    public func decode<T: Decodable>(_ type: T.Type, from data: Data) -> T
}
```

## Step 3. Sharing data without data-races

## Step 4. Actor: move data off the main thread
 
