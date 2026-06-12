# What’s new in Swift

Join us for an update on Swift. Discover the latest language advancements, including updates for everyday ergonomics, improved concurrency, and safer high-performance code. Explore workflow and language interoperability improvements and updates in embedded Swift.

@Metadata {
   @TitleHeading("WWDC26")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2026/262", purpose: link, label: "Watch Video (32 min)")

   @Contributors {
      @GitHubUser(VictorPuga)
      @GitHubUser(leogdion)
   }
}

## Summary

- Swift 6.3 and 6.4 bring significant language and library improvements, enhancing developer efficiency and code safety.
- New tools for task cancellation, file path manipulation, and API deprecation handling improve code management.
- Performance tuning features in Swift simplify optimizing code without sacrificing safety.
- Enhanced interoperability and new SDKs expand Swift's usability across platforms like Android and web apps.
- Swift's ownership system and new APIs make high-performance programming safer and more accessible.

## Presenters

* Becca, Swift Team
* Evan, Swift Team

## Language Improvements

- **Optional Handling:** Swift 6.4 removes the need for parentheses with `some` or `any` and optional types.
- **Error Handling:** Warnings for unhandled errors in concurrency tasks.
- **Async Functions:** Now callable from a `defer` block.
- **Sendable Checking:** `weak let` supports immutability, and `~Sendable` syntax for non-sendable types (doesn't stop subclasses from being `Sendable`).
- **Initializer Enhancements:** Structs with mixed visibility properties get a second member-wise initializer.

  ```swift
   struct Briefing {
      internal var topic: String
      internal var scheduledAt: Date
      private  var attendees: [Person] = []
   }

   // Generated memberwise initializers:
   // extension Briefing {
   //     private init(topic: String, scheduledAt: Date, attendees: [Person] = []) { 
   //          self.topic = topic
   //          self.scheduledAt = scheduledAt
   //          self.attendees = attendees
   //     }
   // 
   //     internal init(topic: String, scheduledAt: Date) {
   //          self.topic = topic
   //          self.scheduledAt = scheduledAt
   //          self.attendees = []
   //     }
   // }
  ```

- **Cross-Platform Availability:** `anyAppleOS` condenses platform names for OS availability attributes (only supported for OSes 26 and newer).

   ```swift
   extension Mission {
      @available(anyAppleOS 27, *)
      func showStatus() { ... }

      @available(anyAppleOS 27, *)
      @available(tvOS, unavailable)
      func launch() { ... }
  
      #if os(anyAppleOS)
      func makeLiveActivityWidget() -> some Widget { ... }
      #endif
   }
   ```

- **Deprecated APIs:** `@diagnose` attribute can manage warnings for deprecated APIs.

  ```swift
   @diagnose(DeprecatedDeclaration, as: ignored, reason: "Flying with surplus hardware")
   func makeApolloSoyuzMission() -> Mission {
      CrewedMission(
         rocket: makeSaturnIRocket(),
         payload: makeApolloCSM(),
         crew: [.daniellePoole, .nathanMorrison]
      )
   }

   @diagnose(StrictMemorySafety, as: warning)
   func uplinkCommand(from receiver: inout Receiver, to computer: inout Computer) {
      let commandSize = receiver.receiveInt()
      receiver.withReceivedData(byteCount: commandSize) {
         computer.receiveUplinkedCommand($0)
      }
   }

   @diagnose(ErrorInFutureSwiftVersion, as: error)
   func fetchPosition() -> (x: Double, y: Double, z: Double) {
      return self.rotation
   }
  ```

- **Module Selectors:** New `::` syntax disambiguates which module a declaration comes from.

  ```swift
   import Rocket
   import GiftShopToys

   let rocket1 = SaturnV()            // could mean `Rocket::SaturnV` or `GiftShopToys::SaturnV`
   let rocket2 = Rocket.SaturnV()     // prefers `Rocket::Rocket.SaturnV`
   let rocket3 = Rocket::SaturnV()    // correctly finds `Rocket::SaturnV`
  ```

## Library Updates

- **Standard Library:** New tools for task cancellation, dictionary transformations, and file paths.

  ```swift
   // Radio for help

   extension Radio {
      func send(_ data: [UInt8]) {
         if Task.isCancelled { return }
         // ...
      }
   }

   extension EmergencyTransponder {
      func sendSOS() {
         withTaskCancellationShield {
            radio.send(makeSOSPacket())
         }
      }
   }
  ```

  ```swift
   // Map values with keys

   func makeCalendarDisplayNames(for missions: [Mission: LaunchWindow]) -> [Mission: String] {
      missions.mapKeyedValues { mission, launchWindow in
         makeDisplayName(for: mission, in: launchWindow)
      }
   }
  ```

  ```swift
   // FilePath handling macOS-named resources

   var path: FilePath = "/var/www/static"
   path.components.append("WWDC")
   print(path.components)
   // [ "var", "www", "static", "WWDC" ]

   var path: FilePath = "/var/www/static/..namedresource/rsrc"
   print(path.components)
   // [ "var", "www", "static" ]
  ```

- **Swift Testing:** Enhanced control over test behavior, including non-fatal issues, dynamic test cancellation, and new `swift test` options `--maximum-repetitions` and `--repeat-unit`.

   ```swift
   // Issue severity

   @Test(arguments: allRockets)
   func testBurn(rocket: Rocket) throws {
      rocket.burn(for: .seconds(150))
      let remaining = rocket.propellantKg / rocket.totalPropellantKg

      if remaining < 0.10 {
         Issue.record(
               "\(rocket.name) remaining fuel is below 10% reserve target",
               severity: .warning
         )
      }

      #expect(remaining > 0.02, "\(rocket.name) propellant critically low - abort")
   }
   ```

   ```swift
   // Test Cancellation

   @Test(arguments: allRockets)
   func testBurn(rocket: Rocket) throws {
      // solid-fuel rocket engines can't be stopped
      if rocket.engineType == .solid {
         try Test.cancel("\(rocket.name) has solid fuel")
      }
   
      rocket.burn(for: .seconds(150))
      let remaining = rocket.propellantKg / rocket.totalPropellantKg

      if remaining < 0.10 {
         Issue.record(
               "\(rocket.name) remaining fuel is below 10% reserve target",
               severity: .warning
         )
      }

      #expect(remaining > 0.02, "\(rocket.name) propellant critically low - abort")
   }
   ```

- **Subprocess Package:** Refined APIs with improved error handling and cross-platform support.

   ```swift
   // Subprocess output streaming

   let result = try await Subprocess.run(.name("ls"),
                                         input: .none,
                                         output: .sequence,
                                         error: .string(limit:4096)) { execution in
         execution.standardOtput.strings().filter { $0.hasSuffix(".obj") }
   }

   for try await objectFiles in result.closureOutput {
      print("Object file: \(objectFile)")
   }
   ```

- **Foundation Enhancements:** Progress manager for async/await, faster data operations, and unification of URL types.

  ```swift
   // Progress reporting

   let manager = ProgressManager(totalCount: 100)
   try await rocket.launch(mission.subprogress(assigningCount: 100))

   extension Rocket {
      func launch(_ progress: consuming Subprogress? = nil) async throws {
         let stage = progress?.start(totalCount: 3)
         try await ignite(); stage?.complete(count: 1)
         try await liftoff(); stage?.complete(count: 1)
         try await stageSeparation(); stage?.complete(count: 1)
      }
   }
  ```

## Performance Tuning

- **Optimizer Control:** New `inline(always)` attribute and `@specialized` for fine-tuning optimization.

   ```swift
   @inline(never) // or @inline(always)
   func makeInts(randomized: Bool) -> [256 of Int] {
      if randomized {
         InlineArray { _ in Int.random(in: (.min)...(.max)) }
      } else {
         InlineArray(repeating: 0)
      }
   }
   ```

   ```swift
   @specialized(where Values == [UInt8])
   func histogram<Values>(of values: Values) -> [256 of Int] where Values: Sequence<UInt8> {
      var result = makeInts(randomized: false)
   
      for value in values {
         result[Int(value)] += 1
      }
   
      return result
   }
   ```

- **Ownership System:** Enhancements allow non-copyable types and improved handling of `Equatable` and `Comparable`.
- **Iterables:** New `Iterable` protocol for more efficient loops.
- **Accessors:** `borrow` and `mutate` accessors replace `get` and `set` for performance gains.

  ```swift
   @safe public struct UniqueBox<Value: ~Copyable>: ~Copyable {
      private let valuePointer: UnsafeMutablePointer<Value>

      public init(_ value: consuming Value) {
         valuePointer = UnsafeMutablePointer.allocate(capacity: 1)
         valuePointer.initialize(to: value)
      }

      public var value: Value {
         borrow { valuePointer.pointee }
         mutate { &valuePointer.pointee }
      }

      deinit {
         valuePointer.deinitialize(count: 1)
         valuePointer.deallocate()
      }
   }
   ```

- **New Safe APIs:** `UniqueBox` and `UniqueArray` for managing pointers and non-copyable elements; `Ref` / `MutableRef` — like a `Span` but for one value; storable, passable, returnable, usable in generics.

## Cross-Platform and Interoperability

- **Exposing Swift to C:** New `@c` attribute for exposing Swift functions to C.
- **Java Interop:** Async and throwing Swift functions are now callable from Java.
- **Android SDK:** Official Swift SDK for Android released.
- **Swift Extension for VS Code:** Tools for easy toolchain management and WebAssembly support.
- **JavaScript Interop:** Safer and faster bridging with JavaScript kit improvements.
- **Embedded Swift:** Now supports existential types and untyped throws.

## The Future of Swift

- Swift Build is now the default build-system backend for Swift Package Manager, for consistency between SwiftPM and Xcode builds.
