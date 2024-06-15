# Meet Swift Testing

Introducing Swift Testing: a new package for testing your code using Swift. Explore the building blocks of its powerful new API, discover how it can be applied in common testing workflows, and learn how it relates to XCTest and open source Swift.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @(url: "https://developer.apple.com/wwdc24/10179", purpose: link, label: "Watch Video (23 min)")

   @Contributors {
      @GitHubUser(petermolnar-dev)
   }
}

## Key takeaways
🧪 Use `@Test` annotation for functions with test.

☑️ Use `#expect` macro for conditional check and `#require` for early exit.

⚙️ Traits for test customization.

💻 Support for Linux and Windows.

🫥 UI, performance and Objective-C are not supported.

## Presenters
* Stuart Montgomery, Xcode Engineer

## Building Blocks
### Getting started: @Test
In order to use the new testing framework we need to import the `Testing` framework in your unit test file.

Adding the **`@Test`** annotation any of our functions, and the function will automatically change to a test case.
```swift
import Testing

@Test func simpleTest() {
    var a = 2
    #expect(a < 1)
}
```
In case of test validation error, after clicking on the red error bar, the new `Show` button appears. Clicking on it reveals the result view, where the expressions passed to the macro are shown.

### Validation macros: #expect and #require
There are 2 validation macros introduced to test any expression.

The **`#expect`** macro can be used as a default case, and it has great flexibility in terms of the evaluation expressions.

The **`#require`** macro is more strict: when it fails, it exit from the current test case. Since it throws an error, needs to be invoked via the **`try`** invocation. It can be useful for **`nil`** check and other checks that might imply early exit from the test function in case of failure.

### Traits and Suite
Traits are great for test customization. Here are some examples:
Trait|Description
---|---
`@Test("Custom Name")`|Custom name for the test case. It is used in Xcode and the reports too.
`@Test(.bug("http://bugtracker.my/bugs/33344" , "Title"))`| Reference issue from a bug tracker  
`@Test(.enabled(if: serverIsOnline))`|Specify a runtime condition for the test
`@Test(.disabled("FIXME: Currently broken"))`|Unconditional disable test (test will marked as skipped)
`@Test() @available(macOS 15, *)`|Limit a test to certain OS versions
`@Test(.timeLimit(.minutes(3)))`|Set a maximum time limit for the test
`@Suite(.serialized)`|Run the tests in a suite one at time, without parallelization.

Although we are able to write test functions in the global scope, as a standalone function, putting the test cases in structure is encouraged.

Suite is one of the structure to group the tests into an entity. The **`@Suite`** annotation can be added to any Swift type, however types containing **`@Test`** functions or suites will be implicitly annotated. The **`struct`** type is recommended by Apple to define a suite, due to its value type nature, for state isolation.

For set-up and tear-down logic the **`init`** and **`deinit`** functions can be used. During the test run a new instance of the suite initialized for each `@Test` method.

Suites can also be nested into each other.

## Common Workflows

### Tests with conditions
Using the .disabled trait is recommended, instead of commenting out the code. Adding the .bug trait in cases when test is disabled due to a known issue makes it more elegant.

### Tests with common characteristics
Tags are another traits that can be used to group tests with common characteristics. Based on the tag the test cases can be grouped together. One test function can belong more than one tag.

The tags needs to be defined before we can start to use them:
```swift
import Testing

extension Tag {
    @Tag static var formatting: Self
    @Tag static var networking: Self
}

struct myTests {
    @Test(.tags(.formatting))
    func sampleTest()  {
        let a = 2
        #expect(a < 3)
    }

    @Test(.tags(.networking, .formatting))
    func sampleTestThrows() throws {
        let a = 2
        try #require(a < 3)
    }
}
```
### Repeating tests with different parameters
Instead of using the **`for`** loop to run tests with different parameters the recommended method is to pass arguments to the test. The parameters are passed as a function argument to the test function.
```swift
import Testing

struct myTests {
    @Test("Test for repeating integers", arguments:
    [
        1,
        2,
        3,
        4
    ])
    func sampleTest(number: Int) {
        #expect(number < 9)
    }
}
```
In the example above the **`number`** variable carries the current value passed from the argument list.

In Xcode each test parameter can be re-run independently.

## Swift Testing vs XCTest

Function|Swift Testing|XCTest
---|---|---
Test function declaration|**`@Test`**| Name begins with "test"
Supported types|Instance methods, Static/class methods, Global functions| Instance methods
Traits support|Yes|No
Parallel execution|In-process parallel execution (via Swift concurrency)|Multi process parallel execution
Runs on| Supports device execution|macOS and simulator only
Expectations | **`#expect(...)`**, **`try #required(...)`** | **`XCTAssert`** functions
Types| **`struct`, `actor`, `class`**| **`class`**
Suite declaration| **`@Suite`** (before a type)|**`XCTestCase`** subclassing
Before each test|**`init() async throws`**| **`setUp()`, `setUpWithError() throws`, `setUp() async throws`**
After each test|**`deinit`**| **`tearDown() async throws`, `tearDownWithError() throws`, `tearDown()`**
Sub-groups| Via typed nesting| Not supported

Migration: Swift Testing and XCTests can co-exist and share a singe unit test target. Can be migrated granularly (don't forget to remove `test` prefix from the function name).

**Exceptions, can not be migrated:**
- UI Automation test cases (like using `XCUIApplication`)
- Performance testing API (like using `XCTMetric`)
- Tests can be only written in Objective-C

Avoid calling `XCTAssert` from Swift Testing tests, or `#expect` from XCTests.

## Avaliability
Swift Testing is integrated with Swift Package Manager CLI, Xcode 16 and VS Code Swift Extension.

Swift Testing is Open Source.

Learn more in the session: “Go further with Swift Testing”

