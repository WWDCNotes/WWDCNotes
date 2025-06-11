# What’s new in Xcode

Discover the latest productivity and performance advancements in Xcode 26. Learn how to leverage large language models in your development workflow. Explore editing and debugging enhancements, improved performance and testing tools, and Swift Build - the open-source build system engine used by Xcode.

@Metadata {
   @TitleHeading("WWDC25")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2025/247", purpose: link, label: "Watch Video (36 min)")

   @Contributors {
      @GitHubUser(Jeehut)
   }
}

## Key Takeaways
- 📌 "Start Page" tab & pinned tabs
- 🔍 "Search engine"-like search mode
- 🎤 Swift Mode for Voice Control
- 🤖 AI assistance in sidebar & context menu
- 🐛 Improved SwiftUI debugging
- 📹 Improved UI test recording

@Row {
   @Column {
      @Image(source: "WWDC25-247-Start-Page")
   }
   @Column {
      @Image(source: "WWDC25-247-Multiple-Word-Search")
   }
}
@Row {
   @Column {
      @Image(source: "WWDC25-247-Assistant-Menu")
   }
   @Column {
      @Image(source: "WWDC25-247-UI-Testing")
   }
}

## Optimizations

- Xcode is 24% smaller thanks to getting rid of Intel runtime and Metal (downloaded if needed)
- Faster text input (up to 50% less latency in complex expressions)
- Workspaces laod up to 40% faster


## Workspace and editing

### Intuitive editor tabs

@Image(source: "WWDC25-247-Start-Page")

- New "Start Page" with built-in "Open Quickly" dialog
- Tabs can now be pinned for more control over which & how many tabs are opened

### Multiple word search

- New search mode that works like search engines (finds clusters of words)
- Can be used by selecting "Find > Multiple Words" above the search bar
- Matched clusters can span multiple lines and words may appear in any order

@Image(source: "WWDC25-247-Multiple-Word-Search")

### Coding by voice

- Use voice control to write Swift code in a natural way
- Automatically figures out spacing, camel-casing, etc.
- Called "Swift mode for Voice Control"
- Say "start listening" and "Swift mode" to turn it on

### #Playground macro

- Works like the `#Preview` macro designed for SwiftUI, but for non-UI code
- Basically the dedicated "Swift Playgrounds" now usable right in your app
- You need to `import Playgrounds` in order to use the macro
- Data shown in assistant editor is updated live as you make changes to code
- The `#Playground` macro has been [open-sourced](https://forums.swift.org/t/playground-macro-and-swift-play-idea-for-code-exploration-in-swift/79435) for support on other platforms

@Image(source: "WWDC25-247-Playground-Macro")

### Icon Composer

- New app bundled with Xcode 26
- Necessary due to the differences in platforms and tinting modes
- All variants in a single `.icon` file with Icon Composer
- Full range of material effects available ("Liquid Glass")
- Apply dynamic properties to layers, such as blur, translucency, or shadow
- Can also export flat icons for compatibility or marketing material

@Image(source: "WWDC25-247-Icon-Composer")

Learn more in <doc:WWDC25-220-Say-hello-to-the-new-look-of-app-icons> and <doc:WWDC25-361-Create-icons-with-Icon-Composer>.

### String Catalogs

- New type-safe string symbols with auto-completion for manually defined Strings
- Automatically generated comments using on-device model based on usage context

Learn more: <doc:WWDC25-225-Codealong-Explore-localization-with-Xcode>

## Intelligence

- Xcode can now use models like ChatGPT in a left sidebar for assitance
- Works with both general questions or requested changes done on your behalf
- Takes your code into consideration to answer specific to your project

@Image(source: "WWDC25-247-Coding-Assistant")

- For selected code, there's a "Coding Tools" menu to get assistance for that code
- Model can ask Xcode for additional files while it's coming up with an answer
- Info button shows context sent to the Model (for transparency)
- Mentioned files in the answer can be clicked to directly navigate to
- Use the `@` character to reference symbols/files/issues to focus on
- Attaching files also possible (such as for a UI sketch image)

@Image(source: "WWDC25-247-Assistant-Menu")

- Toggle the 􀠎 binoculars icon to turn on/off sharing of project context
- Toggle off the 􀋨 bolt icon if you want to review each change before applying
- You can rewing back to any code state of a conversation step by step

@Image(source: "WWDC25-247-Assistant-Rewind")

- For compiler errors, there's a "Generate fix" button that starts the assistant
- Limited number of free ChatGPT requests, sign in for more
- You can add other models with an API URL and API Key (Anthropic supported)
- Local models also supported by specifying port (like Ollama/LM Studio)
- Model chooser with button to mark models as favorites available

@Image(source: "WWDC25-247-Custom-Model-Settings")

## Debugging and performance

- Debugger can now follow concurrent logic across threads and show task IDs
- Variables view now also lists details about tasks, task groups, and actors
- When app crashes due to missing privacy usage description, Xcode helps fix it
- Capabilities like "camera usage" now editable directly in "Signing & Capabilities"

@Image(source: "WWDC25-247-Privacy-Fix-It")

- Instruments has higher-fidelity visualization of CPU flow on recent Apple Silicon (M4+/iPhone 16+)
- "Processor Trace" reveals every branch taken and function call for more accurate debugging
- Use updated "CPU Counters" for micro-architecture optimizations (start with "CPU bottlenecks")

@Image(source: "WWDC25-247-Processor-Trace")

- Updated "SwiftUI" instruments for debugging UI performance issues
- Use timeline to see what's going on on the main thread
- Use "cause and effect" graph to understand why view updates too often

@Image(source: "WWDC25-247-SwiftUI-Instrument")

Learn more in <doc:WWDC25-308-Optimize-CPU-performance-with-Instruments> and <doc:WWDC25-226-Profile-and-optimize-power-usage-in-your-app>.

- New 􀙬 "Trending Insights" in the Hangs and Launches diagnostics in the organizer
- Diagnostic reports can shared with collegues using URL sharing
- New "Recommendations" feature inside Metrics compares with other apps & your history

@Image(source: "WWDC25-247-Trending-Insights")

## Building

- Explicitly-built modules now active for Swift modules by default
- Faster builds, more reliable, more precise, faster debugging

Learn more: <doc:WWDC24-10171-Demystify-explicitly-built-modules>

- New open-source ["Swift Build"](https://github.com/swiftlang/swift-build) tool available, previewable for packages
- New "Enhanced Security" capability adds additional compile & runtime security protections

## Testing

- Significantly improved automatic UI test recording
- Generated code has better match names and allows selecting alternatives

@Image(source: "WWDC25-247-UI-Testing")

Learn more: <doc:WWDC25-344-Record-replay-and-review-UI-automation-with-Xcode>

- New `XCTHitchmetric` to catch hitches, e.g. to test scrolling performance

@Image(source: "WWDC25-247-XCTHitchMetric")

- More runtime API checks available in tests (configurable as off/warning/failure)
