# WidgetKit foundations

Widgets highlight your app’s most important content across the system, providing people with another opportunity to engage. Discover the different types of widgets and explore the qualities that make them memorable. Learn how to create widgets, keep them up to date, and offer ways for people to customize them through App Intents and dynamic styling.

@Metadata {
   @TitleHeading("WWDC26")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2026/277", purpose: link, label: "Watch Video (20 min)")

   @Contributors {
      @GitHubUser(alexkaessner)
   }
}

## Fundamentals
- Widgets are glanceable, relevant, and personalized
- Widgets are exclusively build with SwiftUI

@Image(source: "WWDC26-277-timeline")

- Shared data needs to be in App Group Container
- `WidgetKit` asks Widget extension for content
- Content is provided via timeline with multiple entries
  - Each entry has it's own data to render content
  - System displays each entry at relevant time
- Two types of Widgets:
  - [`AppIntentConfiguration`](https://developer.apple.com/documentation/widgetkit/appintentconfiguration): configurable by user
  - [`StaticConfiguration`](https://developer.apple.com/documentation/widgetkit/staticconfiguration): static/non-configurable

```swift
struct DailyReadingGoalWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(
            kind: "DailyReadingGoalWidget", // Custom unique identifier
            provider: DailyReadingGoalProvider() // Timeline provider to produce entries
        ) { entry in
            // SwiftUI View to render content
            DailyReadingGoalView(book: entry.book,
                                 message: entry.message,
                                 timeOfDay: entry.timeOfDay)
            .containerBackground(for: .widget) {
                // Handling of Widget background for different home screen appearances like glass
                Background()
            }
        }
    }
}
```

### Timeline Provider
- [TimelineProvider`](https://developer.apple.com/documentation/widgetkit/timelineprovider) supplies three states:

@Image(source: "WWDC26-277-timelineprovider")

- **Snapshot:** Realistic preview shown in Widget gallery
  - Example: Feature popular book before loading apps data
- **Placeholder:** Stand-in view when content is not loaded yet
  - Needs to be synchronous as it shows up instantly
  - Provide placeholder that does **not** need data from disk or network
  - Use redacted modifier to provide simplified appearance
- **Timeline:** Actual view of specific moment in time
  - Can be now or in any point of future

@Image(source: "WWDC26-277-timeline-updates")

- Timeline entries provide view for specific point in time
- Needs to be refreshed at some point via reload policy
- Reload policy options:
  - `.atEnd`: Asks for more after all entries are exhausted
  - `.afterDate`: Specific date for desired reload
  - `.never`: Only manual reloads via explicit `WidgetCenter` call or push notifications

### Timeline Best Practices
- Provide multiple entries when possible
- Reloads heavily budgeted by system for all day battery life
  - Influenced by users viewing habits
- Frequent reloads when app is in foreground might be throttled
  - One reload when entering background is good idea
- Consider Live Activities for frequent updates in fixed time range
  - Learn more: <doc:WWDC26-223-Live-Activities-essentials>

### Widget Families
@Image(source: "WWDC26-277-widget-families")
- Recommended go support as many families as possible
  - System extra large portrait family is new in iOS/iPadOS/macOS 27
- Use `.supportedFamilies` to define which you support
  - All available types at [`WidgetFamily`](https://developer.apple.com/documentation/widgetkit/widgetfamily)

```swift
StaticConfiguration(kind: "DailyReadingGoalWidget", provider: DailyReadingGoalProvider()) { entry in
    // SwiftUI View to render content
    DailyReadingGoalView(book: entry.book,
                         message: entry.message,
                         timeOfDay: entry.timeOfDay)
}
.supportedFamilies([.systemMedium])
```

## Integrate with Your App
### Deep Links
- Tapping Widget opens app by default
- Use `.widgetURL` to define custom deep link handling when launching app

```swift
StaticConfiguration(kind: "DailyReadingGoalWidget", provider: DailyReadingGoalProvider()) { entry in
    // SwiftUI View to render content
    DailyReadingGoalView(entry: entry)
        .widgetURL(URL(string: "bookclub://reading/\(entry.book.bookID)"))
}
.supportedFamilies([.systemMedium])
```

### Configurable Widgets
@Image(source: "WWDC26-277-widget-configuration")
- Customize Widgets like Weather app
- Allows adding same Widget with different configurations
- Keep options small and use sensible defaults
- Configuration handled via `AppIntents` framework
  - Learn more: <doc:WWDC23-10103-Explore-enhancements-to-App-Intents>

### Interactive Elements
- Interaction via button or toggle
- Performed with `AppIntents`
- Learn more: <doc:WWDC23-10028-Bring-widgets-to-life>

## Adapt with System
@Image(source: "WWDC26-277-widget-glass-styles")
- System renders Widget without background and optional tint in glass appearances
- Use [`.widgetAccentedRenderingMode`](https://developer.apple.com/documentation/widgetkit/widgetaccentedrenderingmode) to override automatic monochrome conversion

@TabNavigator {
    @Tab("Before") {
        @Row {
            @Column {
                ```swift
                struct BookCoverImage: View {
                    let imageName: String
                    
                    var body: some View {
                        Image(imageName, bundle: .main)
                        
                    }
                }
                ```
            }
            @Column {
                @Image(source: "WWDC26-277-rendering-mode-before")
            }
        }
    }
    
    @Tab("After") {
        @Row {
            @Column {
                ```swift
                struct BookCoverImage: View {
                    let imageName: String
                    
                    var body: some View {
                        Image(imageName, bundle: .main)
                            .widgetAccentedRenderingMode(.fullColor)
                    }
                }
                ```
            }
            @Column {
                @Image(source: "WWDC26-277-rendering-mode-after")
            }
        }
    }
}

## Testing
- Check all system appearances: full color, clear and tinted
- Widgets can be accessed via remote devices like on Mac
- Use previews to check all variants
  - `#Preview(as: .systemSmall)` for specific previews
- Enable "WidgetKit Developer Mode" in system settings to lift budget restriction
