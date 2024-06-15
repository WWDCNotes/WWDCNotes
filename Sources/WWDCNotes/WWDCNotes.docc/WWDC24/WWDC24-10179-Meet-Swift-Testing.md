# Meet Swift Testing

Introducing Swift Testing: a new package for testing your code using Swift. Explore the building blocks of its powerful new API, discover how it can be applied in common testing workflows, and learn how it relates to XCTest and open source Swift.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10179", purpose: link, label: "Watch Video (23 min)")

   @Contributors {
      @GitHubUser(dagronf)
   }
}

**Presenter: Stuart Montgomery, Developer Tools**

* A new open source source package
* Designed for Swift
* Supports all major platforms, **including Linux and Windows**
* Integrated into major tools and IDEs in the Swift ecosystem, eg.
  - via SPM on the command line,
  - Supported in VS Code via the new version of the Swift extension
* Can co-exist with XCTest within a single target
  - allows incremental migration
  - doesn't require creating a new target
* Swift Testing **DOES NOT** support
  - UI automation APIs (eg. `XCUIApplication`)
  - Performance testing APIs (eg. `XCTMetric`)
  - Tests written using Objective-C (continue to use XCTest)
* Open source
  - Community feature proposal process
  - Discuss on Swift Forums
  - Contributions welcome

# Building blocks

## Test functions

* Testing functions are functions annotated with the **`@Test`** attribute
* Can be global functions or methods in a type
* Supports `async` and `throws`
* May be global actor-isolated (eg. `@MainActor`)

```swift
import Testing
@testable import MyPackage

@Test func videoMetadata() throws {
	...
}
``` 

* Tests can be :-
  - global functions, or 
  - wrapped within a class or struct to group tests together (see `@Suite` later on)

```swift
struct VideoTests {
   @Test("Check video metadata") func videoMetadata() {
      let video = Video(fileName: "By the Lake.mov")
      let expectedMetadata = Metadata(duration: .seconds(90))
      #expect(video.metadata == expectedMetadata)
   }
   @Test func rating() async throws {
      let video = Video(fileName: "By the Lake.mov")
      #expect(video.contentRating == "G")
   }
}
```

## Expectations

### `#expect()`

* Use the **`#expect()`** macro to perform validated checks
* `#expect` is used to validate that **an expected condition is `true`** 
* It captures the source code AND the values of the sub-expressions when it fails.
  - For example, a `==` check will display both the left and right expressions if it fails
* Continues execution after the failed check (see `#require` below)

```swift
@Test func videoMetadata() throws {
   ...
   #expect(some_value < 100.0)
}
```

* No need for lots of specialized expect functions ala `XCTest`, `#expect` is more capable.


* It accepts ordinary expressions and language operators

### `#require()`

* Use the **`#require()`** macro to perform validated checks, and stop the test if it fails
* Throws an error if the check fails, and stops the test.

```swift
let method = try #require(payments.first)
#expect(method.isDefault)  // not executed
```

## Traits

* Add descriptive information about a test
* Customise when (or if) a test runs
* Modify how the test behaves

### Examples

Trait  | Description                          
:----------------------------------------- | :------------------------------------- 
`@Test("Check video metadata")`            | Customize the display name of a test
`@Test(.bug("example.org/bugs/1234"))`     | Reference an issue from a bug tracker
`@Test(.tags(.critical))`                  | Add a custom tag to a test
`@Test(.enabled(.if: Server.isOnline))`    | Specify a runtime condition for a test
`@Test(.disabled("Currently broken")`      | Unconditionally disable a test
`@Test(…) @available(macOS 15, *)`         | Limit a test to certain OS versions
`@Test(.timeLimit(.minutes(3)))`           | Set a maximum time limit for the test
`@Suite(.serialized)`                      | Tests in the suite will be run one at a time, without parallelization

```swift
@Test(.tags(.formatting)) func rating() async throws {
   #expect(video.contentRating == "G")
}
```

### Tags

* `.tags` allow you to further group tests
  - test navigator supports filtering by tag
  - Run all test with a specific tag 
  - tags are also filterable in the Xcode test report
  - can be shared among multiple projects

For more info, see [Go further with Swift Testing (WWDC24)](https://developer.apple.com/wwdc24/10195)

## Suites

* Groups related test functions and suites
* Annotated using `@Suite`

```swift
@Suite(.tags(.formatting))
struct MetadataPresentation {
    let video = Video(fileName: "By the Lake.mov")
    @Test func rating() async throws { ... }
    @Test func formattedDuration() async throws { ... }
}
```

* Use `init` for setup logic
* Use `deinit` for tear-down logic
* Suite is initialized **once per instance `@Test` method** to avoid state sharing
  * ie. the suite object is created and destroyed for _each_ test.
* Adding a tag to a suite means that all enclosed tests also inherit this tag.  

# Parameterized tests

* Repeating a test with a different argument each time
* Uses the `arguments` parameter to the `@Test`
* The arguments run as **independent tests**
* Avoids using a loop _within_ the test, which makes the test and test output harder to parse and validate
* Individual tests can be re-run independently (eg. if the test fails for a specific argument)
* Can be run in parallel for faster testing

```swift
struct VideoContinentsTests {
   @Test("Number of mentioned continents", arguments: [
      "A Beach",
      "By the Lake",
      "Camping in the Woods",
      "The Rolling Hills",
      "Ocean Breeze",
      "Patagonia Lake",
      "Scotland Coast",
      "China Paddy Field",
   ])
   func mentionedContinentCounts(videoName: String) async throws {
      let videoLibrary = try await VideoLibrary()
      let video = try #require(await videoLibrary.video(named: videoName))
      #expect(!video.mentionedContinents.isEmpty)
      #expect(video.mentionedContinents.count <= 3)
   }
}
```

For more info, see [Go further with Swift Testing (WWDC24)](https://developer.apple.com/wwdc24/10195)

# Comparison with XCTest

      | `XCTest` | Swift Testing
----- | -------- | ------
Types | `class`  | `struct`, `actor`, `class` 
Discovery | Subclass `XCTestCase` | `@Suite`
Before each test | `setUp()`<br/>`setUpWithError() throws`<br/>`setUp() async throws`|`init() async throws`
After each test | `tearDown()`<br/>`tearDownWithError() throws`<br/>`tearDown() async throws`|`deinit()`
Sub-groups | Unsupported | Via type nesting |

# References

* [Swift Testing](https://developer.apple.com/documentation/Testing)
* [Running tests and interpolating results](https://developer.apple.com/documentation/Xcode/running-tests-and-interpreting-results)
* [Go further with Swift Testing](https://developer.apple.com/wwdc24/10195)
