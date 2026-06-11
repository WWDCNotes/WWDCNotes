# Migrate to Swift Testing

Learn how to fearlessly adopt Swift Testing alongside your XCTests using test framework interoperability. Discover best practices and patterns for incrementally introducing advanced testing features that accelerate development and increase coverage.

@Metadata {
   @TitleHeading("WWDC26")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2026/267", purpose: link, label: "Watch Video (21 min)")

   @Contributors {
      @GitHubUser(VictorPuga)
   }
}

## Summary

- Swift Testing simplifies migration from XCTest with interoperability.
- Parameterized tests and exit tests supercharge testing in Swift.
- Xcode 27 defaults to interoperability, easing transition to Swift Testing.
- Contribute to Swift Testing. It's open source and community-driven.

@Image(source: "WWDC26-267-test-framework-interoperability.jpeg", alt: "Test Framework Interoperability")

## Presenters

- Jerry Chen, Developer Tools

## Swift Testing Overview

- **Introduction**: Swift Testing introduced in Xcode 16 as a modern library for writing tests, with an expressive interface, and built for Swift concurrency.
- **Core Macros**:
  - `@Test` for declaring tests.
  - `#expect` for creating expectations.
  - `Issue.record` replaces `XCTFail` for unconditional failures.

```swift
import Testing

@testable import DemoApp

@Test func `Default climate: tropical`() async throws {
    let fruit = Fruit(name: "Coconut")
    #expect(fruit.climate == .tropical)
}
```

## Migration Strategy

- **Keep Existing Tests**: Leave most XCTests in place; modify a few at a time.
- **Interoperability**:
  - Supports calling APIs across XCTest and Swift Testing.
  - **Modes**:
    - **Limited**: Cross-framework issues as warnings.
    - **Complete**: Issues as errors. Recommended.
    - **Strict**: Fatal errors from XCTest issues.
    - **None**: Opt-out, but not recommended.

```swift
func testUniqueFruitNames() async throws {
    assertUnique(Market.fruits + [Fruit.lychee])
}

// TestHelpers.swift

func assertUnique(_ fruits: [Fruit], file: StaticString = #filePath, line: UInt = #line) {
    var uniqueNames = Set<String>()
    for name in fruits.map(\.name) {
        if !uniqueNames.insert(name).inserted {
            XCTFail("Duplicate name: \(name)", file: file, line: line)
        }
    }
}
```

```swift
import Testing

func assertUnique(_ fruits: [Fruit], sourceLocation: SourceLocation = ...) {
    var uniqueNames = Set<String>()
    for name in fruits.map(\.name) {
        if !uniqueNames.insert(name).inserted {
            Issue.record("Duplicate name: \(name)", sourceLocation: sourceLocation)
        }
    }
}
```

## Test Framework Interoperability

- **Usage**: Allows seamless use of helper functions across testing frameworks.
- **Modes**:
  - Change modes with Test Plan Settings.
  - Use environment variable for Swift Package projects.

  ```bash
  SWIFT_TESTING_XCTEST_INTEROP_MODE=strict swift test
  ```

@Image(source: "WWDC26-267-configurable-modes.jpeg", alt: "Configurable modes")

|                       XCTest                       |           Swift Testing           |
| :------------------------------------------------: | :-------------------------------: |
|                     `XCTFail`                      |        `Issue.record(...)`        |
|   `XCTAssert`, `XCTAssertTrue`, `XCTAssertFalse`   | `#expect(...)` `try#require(...)` |
|         `XCTAssertNil`, `XCTAssertNotNil`          |                 ^                 |
|       `XCTAssertEqual`, `XCTAssertNotEqual`        |                 ^                 |
|   `XCTAssertIdentical`, `XCTAssertNotIdentical`    |                 ^                 |
| `XCTAssertGreaterThan`, `XCTAssertLessThanOrEqual` |                 ^                 |
| `XCTAssertGreaterThanOrEqual`,`XCTAssertLessThan`  |                 ^                 |
|                         -                          |     `withKnownIssue { ... }`      |
|                         -                          |        `try Test.cancel()`        |

## Advanced Testing Features

- **Parameterized Tests**: Run tests with different arguments in parallel for efficiency.

  ```swift
  struct BirdTests {

     @Test func `Birds flap wings successfully`() async throws {
        for bird in Aviary.birds {
              for count in (40...100) {
                 try await bird.flapWings(count: count)
              }
        }
     }

  }
  ```

  ```swift
  struct BirdTests {

     @Test(arguments: Aviary.birds, 40...100)
     func `Birds flap wings successfully`(bird: Bird, count: Int) async throws {
        try await bird.flapWings(count: count)
     }

  }
  ```

- **Exit Tests**: Test code that might crash, running in isolated processes to ensure stability.

  ```swift
  // In `Bird.init(...)`
  if name.isEmpty {
     preconditionFailure("Bird name cannot be empty")
  }

  extension BirdTests {

     @Test func `Bird with empty name crashes`() async throws {
        await #expect(processExitsWith: .failure) {
              _ = Bird(name: "")
        }
     }

  }
  ```

  @Image(source: "WWDC26-267-exit-tests.jpeg", alt: "Exit Tests")

## Tips for Migrating

- **Skip Tests**: Use `Test.cancel` in Swift Testing.

  ```swift
  let isFall = false

  // XCTest
  func testSwallowFallMigration() async throws {
     try XCTSkipIf(!isFall, "Wrong season for migration")
     // ...
  }

  // Test.cancel interoperability from Swift Testing
  func testSwallowFallMigration() async throws {
     if !isFall {
        try Test.cancel("Wrong season for migration")
     }
     // ...
  }

  // ✅ Prefer test trait in Swift Testing
  @Test(.enabled(if: isFall, "Wrong season for migration"))
  func `Swallow fall migration`() async throws {
     // ...
  }
  ```

- **Halt on Failure**: Use `#require` to stop tests on first failed assertion.

  ```swift
  func testExample() async throws {
     #expect(Fruit.banana.climate == .temperate)

     try #require(Fruit.banana == Fruit.plantain)
     XCTFail("This is never reached")
  }
  ```

## Contribution and Community

- **Open Source**: Part of SwiftLang on GitHub; contributions are welcome.
- **Governance**: Managed by the Testing Workgroup and guided by Swift Evolution.
- **Community Engagement**: Join discussions on Swift Forums.

## Recommendations

- **Focus on New Tests**: Use Swift Testing for new tests while maintaining existing XCTests.
- **Leverage Interoperability**: Replace XCTest API gradually with Swift Testing API.
- **Explore New Tools**: Utilize parameterized and exit tests to enhance testing capabilities.
