# What’s new in SwiftUI

Learn how you can use SwiftUI to build great apps for any Apple platform. Explore a fresh new look and feel for tabs and documents on iPadOS. Improve your window management with new windowing APIs, and gain more control over immersive spaces and volumes in your visionOS apps. We’ll also take you through other exciting refinements that help you make expressive charts, customize and layout text, and so much more.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10144", purpose: link, label: "Watch Video (23 min)")

   @Contributors {
      @GitHubUser(MortenGregersen)
   }
}

## Key takeaways

✨ Refresh your apps with new styles

⌨️ Add windowing and input capabilities

⌚️ Bring live activities to watchOS

⛰️ Create immersive experiences

## Presenters

* Sam Lazarus, SwiftUI Engineer
* Sommer Panage, SwiftUI Engineer

## TabView and .sidebarAdaptable

The TabView now has type-safe syntax, and it can change to be a sidebar using the `.tabViewStyle(.sidebarAdaptable)`.
The tab bar is customizable, so the user can change the tabs in the tabbar.
This is done by specifying the `.customizationID` modifier to the tabs. 

```swift
import SwiftUI

struct KaraokeTabView: View {
    @State var customization = TabViewCustomization()
    
    var body: some View {
        TabView {
            Tab("Parties", image: "party.popper") {
                PartiesView(parties: Party.all)
            }
            .customizationID("karaoke.tab.parties")
            Tab("Planning", image: "pencil.and.list.clipboard") {
                PlanningView()
            }
            .customizationID("karaoke.tab.planning")
            Tab("Attendance", image: "person.3") {
                AttendanceView()
            }
            .customizationID("karaoke.tab.attendance")
            Tab("Song List", image: "music.note.list") {
                SongListView()
            }
            .customizationID("karaoke.tab.songlist")
        }
        .tabViewStyle(.sidebarAdaptable)
        .tabViewCustomization($customization)
    }
}
```

Learn more in the session: "Improve your tab and sidebar experience on iPad"

## Presentation sizing

It is now possible to use the same sizes for sheets in SwiftUI as in UIKit using the `.presentationSizing` modifier.

```swift
import SwiftUI

struct AllPartiesView: View {
    @State var showAddSheet: Bool = true
    var parties: [Party] = []
    
    var body: some View {
        PartiesGridView(parties: parties, showAddSheet: $showAddSheet)
            .sheet(isPresented: $showAddSheet) {
                AddPartyView()
                    .presentationSizing(.form)
            }
    }
}
```

## Zoom transition

A new zoom navigation transition has been added. It makes the destination zoom out from the `NavigationLink`.

```swift
import SwiftUI

struct PartyView: View {
    var party: Party
    @Namespace() var namespace
    
    var body: some View {
        NavigationLink {
            PartyDetailView(party: party)
                .navigationTransition(.zoom(
                    sourceID: party.id, in: namespace))
        } label: {
            Text("Party!")
        }
        .matchedTransitionSource(id: party.id, in: namespace)
    }
}
```

Learn more in the session: "Enhance your UI animations and transitions"

## Controls

Controls are a new type of widget that works as buttons or toggles and lives in the control center, on the lock screen and can be activated with the Action button.

```swift
import WidgetKit
import SwiftUI

struct StartPartyControl: ControlWidget {
    var body: some ControlWidgetConfiguration {
        StaticControlConfiguration(
            kind: "com.apple.karaoke_start_party"
        ) {
            ControlWidgetButton(action: StartPartyIntent()) {
                Label("Start the Party!", systemImage: "music.mic")
                Text(PartyManager.shared.nextParty.name)
            }
        }
    }
}

// Model code

class PartyManager {
    static let shared = PartyManager()
    var nextParty: Party = Party(name: "WWDC Karaoke")
}

struct Party {
    var name: String
}

// AppIntent

import AppIntents

struct StartPartyIntent: AppIntent {
    static let title: LocalizedStringResource = "Start the Party"
    
    func perform() async throws -> some IntentResult {
        return .result()
    }
}
```

Learn more in the session: "Access your app's controls across the system" 

## SwiftCharts improvements

SwiftCharts has gotten improvements around "Function plotting" and "Vectorized plots".

Learn more in the session: "Swift Charts: Vectorized and function plots"

## Dynamic table columns

A new `TableColumnForEach` lets you have a dynamic number of columns.

```swift
import SwiftUI

struct SongCountsTable: View {
    var body: some View {
        Table(Self.guestData) {
            // A static column for the name
            TableColumn("Name", value: \.name)
            
            TableColumnForEach(Self.partyData) { party in
                TableColumn(party.name) { guest in
                    Text(guest.songsSung[party.id] ?? 0, format: .number)
                }
            }
        }
    }
}
```

## Mesh gradients

The new mesh gradients are created "by interpolating between points on a grid of colors".

```swift
import SwiftUI

struct MyMesh: View {
    var body: some View {
        MeshGradient(
            width: 3,
            height: 3,
            points: [
                .init(0, 0), .init(0.5, 0), .init(1, 0),
                .init(0, 0.5), .init(0.3, 0.5), .init(1, 0.5),
                .init(0, 1), .init(0.5, 1), .init(1, 1)
            ],
            colors: [
                .red, .purple, .indigo,
                .orange, .cyan, .blue,
                .yellow, .green, .mint
            ]
        )
    }
}
```

## Document Group Launch Scene

The new `DocumentGroupLaunchScene` lets you easily create a launch screen for a document based app. It has a header and below the header are the file picker.

```swift
DocumentGroupLaunchScene("Your Lyrics") {
    NewDocumentButton()
    Button("New Parody from Existing Song") {
        // Do something!
    }
} background: {
    PinkPurpleGradient()
} backgroundAccessoryView: { geometry in
    MusicNotesAccessoryView(geometry: geometry)
         .symbolEffect(.wiggle(.rotational.continuous()))
} overlayAccessoryView: { geometry in
    MicrophoneAccessoryView(geometry: geometry)
}
```

Learn more in the session: "Evolve your document launch experience"

## Animation presets for SF Symbols

There three new animation presets for SF Symbols:

* Wiggle: Oscillates a symbol in any direction or angle to draw attention
* Breathe: Smoothly scales a symbol up and down to indicate ongoing activity
* Rotate: S pins some parts of a symbol around a designated anchor point.

Some existing presets has been improved:

* Repalce: Now prefers a new MagicReplace behavior, which smoothly animate badges and slashes

Learn more in the session: "What’s new in SF Symbols"

## More customizable windows on macOS

There is a new `.plain` window style, which removes the default window chrome:

```swift
Window("Lyric Preview", id: "lyricPreview") {
    LyricPreview()
}
  .windowStyle(.plain)
  .windowLevel(.floating)
  .defaultWindowPlacement { content, context in
      let displayBounds = context.defaultDisplay.visibleRect
      let contentSize = content.sizeThatFits(.unspecified)
      return topPreviewPlacement(size: contentSize, bounds: displayBounds)
  }
}
```

There is also a new `WindowDragGesture` which lets you move a window around, even if it has no default window chrome:

```swift
Text(currentLyric)
    .background(.thinMaterial, in: .capsule)
    .gesture(WindowDragGesture())
```

There is also a new scene for utility windows.

Learn more in the session: "Tailor macOS windows with SwiftUI"

### Push window action

A new environment value for pushing a window has been added. It enables you to open a window and hide the originating window:

```swift
struct EditorView: View {
    @Environment(\.pushWindow) private var pushWindow
    
    var body: some View {
        Button("Play", systemImage: "play.fill") {
            pushWindow(id: "lyric-preview")
        }
    }
}
```

Learn more in the session: "Work with windows in SwiftUI"

## Custom hover effects on visionOS

It is now possible to create custom hover effects for views when a user looks at them in visionOS:

```swift
struct ProfileButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .background(.thinMaterial)
            .hoverEffect(.highlight)
            .clipShape(.capsule)
            .hoverEffect { effect, isActive, _ in
                effect.scaleEffect(isActive ? 1.05 : 1.0)
            }
    }
}
```

## Modifier key alternates

For buttons in the main menu of a macOS app, you can now add a `.modifierKeyAlternate` which lets you add an alternative action for the button, if a modifier key is pressed.

```swift
Button("Preview Lyrics in Window") {
    // show preview in window
}
.modifierKeyAlternate(.option) {
    Button("Preview Lyrics in Full Screen") {
        // show preview in full screen
    }
}
.keyboardShortcut("p", modifiers: [.shift, .command])
```

It is also possible to listen for changes in modifier keys:

```swift
var body: some View {
    LyricLine()
        .overlay(alignment: .top) {
            if showBouncingBallAlignment {
                // Show bouncing ball alignment guide
            }
        }
        .onModifierKeysChanged(mask: .option) {
            showBouncingBallAlignment = !$1.isEmpty
        }
}
```

## Pointer style

Is it now possible to customize the style of the pointer/cursor like a resizing pointer, drag pointer or vertical text cursor.

```swift
ForEach(resizeAnchors) { anchor in
    ResizeHandle(anchor: anchor)
         .pointerStyle(.frameResize(position: anchor.position))
}
```

## Apple Pencil double-tap and squeeze

In iPadOS 17.5, SwiftUI got support for double-tap and squeeze:

```swift
var body: some View {
    LyricsEditorView()
        .onPencilSqueeze { phase in
            if preferredAction == .showContextualPalette, case let .ended(value) = phase {
                if let anchorPoint = value.hoverPose?.anchor {
                    lyricDoodlePaletteAnchor = .point(anchorPoint)
                }
                lyricDoodlePalettePresented = true
            }
       }
}
```

Learn more in the session: "Squeeze the most out of Apple Pencil"

## Live activities on watchOS

No work is required to make current live activities show up on watchOS.

There is a new `small` value for `.supplementalActivityFamily` which fits the watch:

```swift
struct KaraokeLyricActivity: Widget {
    var body: some WidgetConfiguration {
        ...
    }
    .supplementalActivityFamily([.small, .medium])
}

struct LyricView: View {
    @Environment(\.activityFamily) private var activityFamily
    var context: ActivityViewContext<KaraokeLiveAttributes>

    var body: some View {
        switch activityFamily {
        case .small: WatchLyricView(context)
        case .medium: MultiLineLyricView(context)
        }
    }
}
```

## Double tap on watchOS

A `.handGestureShortcut` modifier has beed added to enable you to respond to double taps:

```swift
struct KaraokeLyricActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(
            for: KaraokeLiveActivityAttributes.self)
        ) { context in
            HStack {
                LyricView()
                Button("Next", intent: LyricIntent(lyrics: lyrics))
                    .handGestureShortcut(.primaryAction)
            }
        }
        .supplementalActivityFamily([.small, .medium])
    }
}
```

## New formats for dates in `Text`

`Text` now supports formatting a date in new ways like date reference (shown in exsample), date offset and timers:

```swift
Text(.currentDate, format: .reference(to: nextSongDate))
// Shows "in 8 minutes"
```

They can be customized for their components and adapt to the size of their container.

## Widget relevances

The system can now more intelligently show up widgets in smart stacks if you specify relevancy:

```swift
func relevances() async -> WidgetRelevances<Void> {
    let dateEntries = nextKaraikeDates.map {
        WidgetRelevanceEntry(context: .date($0))
    }
    let locationEntries = favoriteKaraokeVenues.map {
        WidgetRelevanceEntry(context: .location($0))
    }
    return WidgetRelevances(dateEntries + locationEntries)
}
```

## Containers

With the new API `ForEach(subviewOf:)`, it is now possible to create custom containers that have the same capabilities like SwiftUI's List and Picker, and mix static and dynamic content.

```swift
struct DisplayBoard<Content: View>: View {
  @ViewBuilder var content: Content

  var body: some View {
    DisplayBoardCardLayout {
      ForEach(subviewOf: content) { subview in
        CardView {
          subview
        }
      }
    }
    .background { BoardBackgroundView() }
  }
}

DisplayBoard {
  Text("Scrolling in the Deep")
  Text("Born to Build & Run")
  Text("Some Body Like View")

  ForEach(songsFromSam) { song in
    Text(song.title)
  }
}
```

Learn more in the session: "Demystify SwiftUI Containers"

## Ease of use

### Simpler EnvironmentValue properties

No need to make full conformance to `EnvironmentKey`. Now there is an @Entry macro:

```swift
extension EnvironmentValues {
  @Entry var karaokePartyColor: Color = .purple
}

extension FocusValues {
  @Entry var lyricNote: String? = nil
}

extension Transaction {
  @Entry var animatePartyIcons: Bool = false
}

extension ContainerValues {
  @Entry var displayBoardCardStyle: DisplayBoardCardStyle = .bordered
}
```

### Add more info to accessibility labels

It is now possible to add more info to accessibility labels without overriding the label provided by the framework:

```swift
SongView(song)
  .accessibilityElement(children: .combine)
  .accessibilityLabel { label in
    if let rating = song.rating {
      Text(rating)
    }
    label
  }
```

Learn more in the session: "Catch up on accessibility in SwiftUI"

### State in previews

With the new `@Previewable` macro, it is possible to have `@State` inside a preview: 

```swift
#Preview {
   @Previewable @State var showAllSongs = true
   Toggle("Show All songs", isOn: $showAllSongs)
}
```

### Text selection

The `TextField` now has a `selection` which lets you hook up the selection in the field to a `@State` property:

```swift
struct LyricView: View {
  @State private var selection: TextSelection?
  
  var body: some View {
    TextField("Line \(line.number)", text: $line.text, selection: $selection)
    // ...
  }
}
```

### Search field focused

A new `.searchFocused` modifier, lets you control if a search field has focus:

```swift
struct SongSearchView: View {
  @FocusState private var isSearchFieldFocused: Bool
  
  @State private var searchText = ""
  @State private var isPresented = false

  var body: some View {
    NavigationSplitView {
      Text("Power Ballads")
      Text("Show Tunes")
    } detail: {
      // ...
      if !isSearchFieldFocused {
        Button("Find another song") {
          isSearchFieldFocused = true
        }
      }
    }
    .searchable(text: $searchText, isPresented: $isPresented)
    .searchFocused($isSearchFieldFocused)
  }
}
```

### Text field suggestions

In a `TextField` it is now possible to supply suggestions, which will show as a dropdown from the field:

```swift
TextField("Line \(line.number)", text: $line.text)
  .textInputSuggestions {
    ForEach(lyricCompletions) {
      Text($0.attributedCompletion)
        .textInputCompletion($0.text)
    }
  }
```

### Mixing of colors

```swift
Color.red.mix(with: .purple, by: 0.2)
Color.red.mix(with: .purple, by: 0.5)
Color.red.mix(with: .purple, by: 0.8)
```

## Scrolling enhancements

There are lots of improvements to `ScrollView`. Here are some of them:

### React to scroll geometry changes

```swift
struct ContentView: View {
  @State private var showBackButton = false

  ScrollView {
    // ...
  }
  .onScrollGeometryChange(for: Bool.self) { geometry in
    geometry.contentOffset.y < geometry.contentInsets.top
  } action: { wasScrolledToTop, isScrolledToTop in
    withAnimation {
      showBackButton = !isScrolledToTop
    }
  }
}
```

### React to scroll visibility changes

```swift
struct AutoPlayingVideo: View {
  @State private var player: AVPlayer = makePlayer()

  var body: some View {
    VideoPlayer(player: player)
      .onScrollVisibilityChange(threshold: 0.2) { visible in
        if visible {
          player.play()
        } else {
          player.pause()
        }
      }
  }
}
```

### New scroll positions

```swift
struct ContentView: View {
  @State private var position: ScrollPosition =
    .init(idType: Int.self)

  var body: some View {
    ScrollView {
      // ... 
    }
    .scrollPosition($position)
    .overlay {
      FloatingButton("Back to Invitation") {
        position.scrollTo(edge: .top)
      }
    }
  }
}
```

## Swift 6 language mode support

Enables compile-time data-race safety. SwiftUI has improved its APIs to make it easier to adopt.

### View on @MainActor

SwiftUI Views has always been evaluated on the `@MainActor` and the protocol now reflects that.

If you have annotated your `View`s with `@MainActor` you can now remove that.

Learn more in the session: "Migrate your app to Swift 6"

## Improved interoperability

### Gesture interoperability

All `UIGestureRecognizer`s can now be used in SwiftUI.

```swift
struct VideoThumbnailScrubGesture: UIGestureRecognizerRepresentable {
  @Binding var progress: Double

  func makeUIGestureRecognizer(context: Context) -> VideoThumbnailScrubGestureRecognizer {
    VideoThumbnailScrubGestureRecognizer()
  }

  func handleUIGestureRecognizerAction(
    _ recognizer: VideoThumbnailScrubGestureRecognizer, context: Context
  ) {
    progress = recognizer.progress
  }
}

struct VideoThumbnailTile: View {
  var body: some View {
    VideoThumbnail()
      .gesture(VideoThumbnailScrubGesture(progress: $progress))
  }
}
```

### SwiftUI animations in UIKit and AppKit

```swift
let animation = SwiftUI.Animation.spring(duration: 0.8)

// UIKit
UIView.animate(animation) {
    view.center = endOfBracelet
}

// AppKit
NSAnimationContext.animate(animation) {
    view.center = endOfBracelet
}
```

Learn more in the session: "Enhance your UI animations and transitions"

## visionOS

### Hide volume baseplate

```swift
struct KaraokePracticeApp: App {
  var body: some Scene {
    WindowGroup {
      ContentView()
    }
    .windowStyle(.volumetric)
    .defaultWorldScaling(.trueScale)
    .volumeBaseplateVisibility(.hidden)
  }
}
```

### React to viewpoint changes

```swift
struct MicrophoneView: View {
 @State var micRotation: Rotation3D = .identity
    
  var body: some View {
    Model3D(named: "microphone")
      .onVolumeViewpointChange { _, new in
        micRotation = rotateToFace(new)
      }
      .rotation3DEffect(micRotation)
      .animation(.easeInOut, value: micRotation)
  } 
}
```

### Control allowed immersion levels

```swift
struct KaraokeApp: App {
  @State private var immersion: ImmersionStyle = .progressive(
    0.4...1.0, initialAmount: 0.5)
  
  var body: some Scene {
    ImmersiveSpace(id: "Karaoke") {
      LoungeView()
    }
    .immersionStyle(selection: $immersion, in: immersion)
   }
}
```

### Preferred surrounding effects

Apply effects to the surroundings (and hands)

```swift
struct LoungeView: View {
  var body: some View {
    StageView()
      .preferredSurroundingsEffect(.colorMultiply(.purple))
  }
}
```

Learn more in the session: "Dive deep into volumes and immersive spaces"

## Custom text renderers

It is possible to create custom text renderers that add effects to the text:

```swift
struct KaraokeRenderer: TextRenderer {
  func draw(
    layout: Text.Layout,
    in context: inout GraphicsContext
  ) {
    for line in layout {
      for run in line {
        var glow = context

        glow.addFilter(.blur(radius: 8))
        glow.addFilter(purpleColorFilter)

        glow.draw(run)
        context.draw(run)
      }
    }
  }
}

struct LyricsView: View {
  var body: some View {
    Text("A Whole View World")
      .textRenderer(KaraokeRenderer())
  }
}
```

Learn more in the session: "Create custom visual effects with SwiftUI"
