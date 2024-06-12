# What’s new in Xcode 16

Discover the latest productivity and performance improvements in Xcode 16. Learn about enhancements to code completion, diagnostics, and Xcode Previews. Find out more about updates in builds and explore improvements in debugging and Instruments.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10135", purpose: link, label: "Watch Video (22 min)")

   @Contributors {
      @GitHubUser(<replace this with your GitHub handle>)
   }
}

## Presenters

* Daisy Hernandez, Xcode Previews Engineer
* Jake Petroules, Build Experience Manager

## Edit

### Code completion

The new code completion uses the context like function names and comments to suggest code. Trained for Swift and Apple SDKs.

In Build Settings, you can now enable warnings for the upcoming language features in Swift 6 language mode. You find the settings in the section "Swift Compiler - Upcoming Features".

Learn more in the session: "Migrate your app to Swift 6"

## Previews

### Previewable macro

In previews you can now use the `@Previewable` macro and have a state property to use in the preview:

```swift
#Preview {
    @Previewable @State var currentFace = RobotFace.heart
    RobotFaceSelectorView(currentFace: $currentFace)
}
```

### PreviewModifier

If you need the share environment and data between previews, you can use `PreviewModifier`.
It lets you create a modifier for a preview and it is shared between previews.
In the following example, the Preview trait is extended with a static sampler for robot names:

```swift
struct SampleRobotNamer: PreviewModifier {
    typealias Context = RobotNamer

    static func makeSharedContext() async throws -> Context {
        let url = URL(fileURLWithPath: "/tmp/local_names.txt")
        return try await RobotNamer(url: url)
    }
    
    func body(content: Content, context: Context) -> some View {
        content.environment(context)
    }
}

extension PreviewTrait where T == Preview.ViewTraits {
    @MainActor static var sampleNamer: Self = .modifier(SampleRobotNamer())
}

#Preview(traits: .sampleNamer) {
    RobotNameSelectorView()
}
```

## Build

### Explicit Modules

> *This feature provides improved parallelism, better diagnostics, and faster debugging, all without changing a single line of code.*

* C/Objective-C: On by default
* Swift: Opt-in

Can be enabled in Build Settings under "Explicitly Built Modules"

It works by:
* Scan
    * Can be found in the build log as "Scan dependencies of <file>"
* Build modules
    * Can be found in the build log as "Compiling Clang/Swift module <module>"
* Build source (the app code)

> *Previously, these operations were performed implicitly as part of compiling your source files. Now, you get a much more detailed breakdown of the build, better parallelism, and clearer error messages if the build fails due to a module issue.*

Learn more in the session: "Demystify explicitly built modules"

## Debug

* Faster debugging with explicit modules
* Smaller, faster debug symbols with DWARF5 on macOS Sequoia and iOS 18

Thread performance checker now also check:
* Disk write diagnostics
* Launch diagnostics

The diagnostics in the Xcode Organizer now also shows the slowest code path signatures if your app takes a long time to launch on customer devices.

### Unified Backtrace View

A new Unified Backtrace View is available in the debug bar. It shows the code of the call stack in a vertical view.

### RealityKit debugger

The new RealityKit debugger can capture a snapshot of your running app's entity hierarchy, which can be inspected in 3D.

Learn more in the sessions:
* Break into the RealityKit debugger
* Run, break, and inspect: Explore effective debugging in LLDB

## Test

New framework: Swift Testing

```swift
import Testing
@testable import BOTanist

// When using the default init Plant(type:) make sure the planting style is graft
@Test
func plantingRoses() {
    // First create the two Plant structs
    let plant = Plant(type: .rose)
    let expected = Plant(type: .rose, style: .graft)

    // Verify with #expect
    #expect(plant == expected)
}
```

Tests can be in suites and have a list of inputs:

```
import Testing
@testable import BOTanist

@Suite struct AnimationStateTests {
    @Test(arguments: [AnimationState.idle, .plant, .walkLoop])
    func validToTransitionToCelebrate(from state: AnimationState) async throws {
        #expect(state.isValidNextState(.celebrate) == true)
    }
}
```

Tests can be tagged:

```swift
extension Tag {
    @Tag static var planting: Self
}

@Test(.tags(.planting))
func myTestMethod() async throws {
    ...
}
```

Tags can also be used to inlcude and exclude tests in a test plan.

Learn more in the sessions:
* Meet Swift Testing
* Go further with Swift Testing

### Bonus

Run tests again: Command + Shift + A, write "test again"

## Profile

From 18:43 Jake shows how to debug hangs with the new "Flame Graph".
