# What’s new in SwiftUI

Explore the latest additions to SwiftUI and discover how they can improve your apps. We’ll introduce a new Document protocol with direct disk access and snapshot-based diffing for building high-performance apps; new APIs for reordering content in lists, grids, and sections; and toolbar enhancements including visibility priority and auto-minimizing behavior. We’ll also cover expanded presentation APIs — including swipe actions on any view — plus AsyncImage caching improvements and lazy state initialization for Observable types.

@Metadata {
   @TitleHeading("WWDC26")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2026/269", purpose: link, label: "Watch Video (28 min)")

   @Contributors {
      @GitHubUser(@alexkaessner)
   }
}

## Key Takeaways
- 🔍 Set any tab to prominent appearance
- ↔️ Customize toolbar placement & overflow
- 🗂️ Reordering & swipe actions for any view
- 📄 Improved document handling
- 🏎️ Many performance improvements


## Refreshed look and feel
- Refined Liquid Glass look will be applied automatically
- Use `.appearsActive` environment to conditionally change styles when window is active or inactive (aka in background)
- Menu bar items reduce use of icons again ([more details in HIG](https://developer.apple.com/design/human-interface-guidelines/menus#Icons))
  - Use `.labelStyle(.titleAndIcon)`  to manually show icon when it makes sense to highlight it
- iPhone apps are now automatically resizable
  - Check out <doc:WWDC26-278-Modernize-your-UIKit-app> on how to handle mix between SwiftUI and UIKit
- Use `Tab(role: .prominent)` to get separated out tab at trailing edge of Tab Bar

@Image(source: "WWDC26-269-Prominent-Tab", alt: "Screenshot of the prominent tab styling at the bottom right corner of screen.")

- More options to define placement & overflow of toolbar items
  - Use `.visibilityPriority(.high)` to lower chance of items moving to overflow menu
  - Group items in `ToolbarOverflowMenu` container to *always* place them in overflow menu
  - Use `ToolbarItem(placement: .topBarPinnedTrailing)` to place item *behind* overflow menu
- Use `.toolbarMinimizeBehavior(.onScrollDown, for: .navigationBar)` to hide toolbars on scroll

## Document-based apps
### Document creation context
Use [`DocumentCreationSource`](https://developer.apple.com/documentation/swiftui/documentcreationsource) API to define different sources as startingpoint:

@Image(source: "WWDC26-269-Create-Document-Buttons", alt: "Document picker with two create document buttons.")

```swift
@main
struct Stickers: App {
    var body: some Scene {
        DocumentGroupLaunchScene("Create a Sticker Page") {
            NewDocumentButton("New Sticker Page", source: .blank)
            NewDocumentButton("Sticker Page from Photo…", source: .photo)
        }
        
        DocumentGroup { document in
            StickerPageDocumentView(document)
        } { configuration, context in
            StickerPageDocument(configuration: configuration, context: context)
        }
    }
}
  
extension DocumentCreationSource {
    static let blank = Self(id: "blank")
    static let photo = Self(id: "photo")
}
```

### Performance
- Using `@Observable` macro alone gives performance boost 
- Use [`WritableDocument`](https://developer.apple.com/documentation/SwiftUI/WritableDocument) protocol to write to documents (has 3 requirements):

```swift
@Observable
final class StickerDocument: WritableDocument {
    
    static let writableDocumentTypes: [UTType] = [.stickerDocument]
  
    @MainActor
    func snapshot(contentType: UTType) async throws -> sending PageSnapshot {
        makeSnapshot()
    }
      
    func writer(configuration: sending WriteConfiguration) -> sending Writer {
        Writer(contentType: configuration.contentType)
    }
}
    
struct PageSnapshot {
    var background: Image
    var metadata: StickerPlacements
    var stickers: [Image]
}
```

- Use `Snapshot` notion in `DocumentWriter` for further performance improvements:

```swift
struct Writer<Snapshot>: DocumentWriter {
    typealias Snapshot = PageSnapshot
  
    let contentType: UTType
    
    nonisolated func write(
        snapshot: sending PageSnapshot, to destination: URL,
        previous: sending PageSnapshot, progress: consuming Subprogress
    ) async throws {
        // report progress…
        // write .stickerDocument
    }
}
```

- Use [`ReadableDocument`](https://developer.apple.com/documentation/swiftui/readabledocument) protocol to read from documents
  - Twin to `WritableDocument`

@Image(source: "WWDC26-269-Document-API", alt: "Comparison list of WritableDocument vs. ReadableDocument.")

### First-class support for URL access
- Extend writer to safe document in any different formats like PNG
- Add new format type to `writableDocumentTypes` (see above)
- Use `conforms(to:)` check to handle different

```swift
struct Writer<Snapshot>: DocumentWriter {
    typealias Snapshot = PageSnapshot

    let contentType: UTType

    nonisolated func write(
        snapshot: sending PageSnapshot, to destination: URL, 
        previous: sending PageSnapshot, progress: consuming Subprogress
    ) async throws {
        if contentType.conforms(to: .stickerDocument) {  
            // write .stickerDocument
        } else if contentType.conforms(to: .png) {
            let context = CGContext(/* ... */) 
            context.draw(/* ... */)
        }
    }
}
```

## Presentation and interaction
- Add support for reordering `List` or any container like grids via reorderable API:

```swift
LazyVGrid {
    ForEach(stickers) { sticker in
        StickerListItemView(sticker: sticker)
    }
    .reorderable()
}
.reorderContainer(for: Sticker.self) { difference in
    difference.apply(to: &stickers)
}
```

- The `.swipeActions` modifier now also work on any view:

```swift
ScrollView {
    LazyVStack {
        ForEach(stickers) { sticker in
            StickerListItemView(sticker: sticker)
                .swipeActions {
                    DeleteButton(sticker: sticker)
                }
        }
    }
}
.swipeActionsContainer()
```

- `.confirmationDialog` and `.alert` now also supports item binding like sheets

## Data flow and performance
- [`AsyncImage`](https://developer.apple.com/documentation/swiftui/asyncimage) now uses standard HTTP caching by default
  - Customizable via `URLRequest`
- Use custom `URLCache` in `URLSession`for custom cache sizes
  - Applied via `.asyncImageURLSession`
- [`@State`](https://developer.apple.com/documentation/SwiftUI/State()) properties are now lazy, thus will only initialized once
  - New behavior backported to iOS 17, macOS 14, and aligned releases
- Unified [`@ContentBuilder`](https://developer.apple.com/documentation/SwiftUI/ContentBuilder) improves type checking performance
  - Usable with any minimum deployment target
- New agent skills for Xcode 27:
  - SwiftUI Specialist Skill
  - What's New In SwiftUI Skill
