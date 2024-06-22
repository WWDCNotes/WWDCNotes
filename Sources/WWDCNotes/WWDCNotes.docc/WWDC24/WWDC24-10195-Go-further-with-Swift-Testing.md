# Go further with Swift Testing

Learn how to write a sweet set of (test) suites using Swift Testing’s baked-in features. Discover how to take the building blocks further and use them to help expand tests to cover more scenarios, organize your tests across different suites, and optimize your tests to run in parallel.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10195", purpose: link, label: "Watch Video (27 min)")

   @Contributors {
      @GitHubUser(petermolnar-dev)
   }
}

## Key takeaways
❌ Use `(throws:)` for checking error handling.

🔃 For repetitive tests use the Parameterized tests.

📋 Use Suits and Tags for organizing tests.

🔀 Async code test with `withCheckedContinuation` and `confirmation`.


## Presenters
* Jonathan Grynspan, Developer Tools
* Dorothy Fu, Developer Tools

## Challenges in testing

Testing your code gives you more confidence that you are shipping a quality product. Tests also document and enforce the behavior of your code.

Swift Testing is now integrated with Xcode 16.

* Readability - as your code complexity increases, it is more critical to have test that are easy to read and understand,
* Code coverage - It takes a lot thought and effort to cover all of the edge cases,
* Organizing tests - organizing your tests in a complex codebase is challenging, 
* Fragility - Hidden dependencies makes your tests fragile, with unexpected errors.

Swift Testing provides several features to help you write clear expressive tests. The expectation macro can handle expressions which can evaluate true of false. 

## Testing error handling
When testing a function which throws, there is the option to implement as do/try/catch expression to wrap the call. However that can be cumbersome in terms of readability.
The correct way in Swift Testing is the **`#expect(throws:)`** function. 

Let say we have the following entity to test:
```swift
import Foundation

struct TestEntity {
    enum CalculationError: Swift.Error, Equatable {
        case divisionByZero
    }
    
    func division(_ a: Int, _ b: Int) throws -> Int {
        guard b != 0 else {
            throw CalculationError.divisionByZero
        }
        return a / b
    }
}
```

### Test if any error thrown

It is for a case when the exact type of error thrown is not important.

```swift
import Testing

struct myTests {
    
    @Test func sampleTest() {
        let sut = TestEntity()
        
        #expect(throws: (any Error).self) {
            try sut.division(1, 0)
        }
    }
}
```
### Test for specific error type

In case we want to match with the specific error type, we can use the type itself at the **`throws:`** parameter:
```swift
import Testing

struct myTests {
    
    @Test func sampleTestWithErrorType() {
        let sut = TestEntity()
        #expect(throws:  TestEntity.CalculationError.divisionByZero) {
            try sut.division(1, 0)
        }
    }
}
```

### Custom logic on the thrown error

If there is a need for customized logic during the validation, a closure based solution with a return value of **`Bool`** is also available:

```swift
import Testing

struct myTests {
    
    @Test func sampleTestWithCustomThrow() {
        let sut = TestEntity()
        
        #expect {
            try sut.division(1, 0)
        } throws: { error in
            guard let error = error as? TestEntity.CalculationError,
                  case .divisionByZero = error else {
                return false
            }
            return true
        }
    }
}
```

### Support for require throwing macro

The **`throws:`** validation also available for the **`#require`** macro, if the we need to stop the test execution in case of not having an error.

```swift
import Testing

struct myTests {
    
    @Test func sampleTestRequire() throws {
        let sut = TestEntity()
        
        try #require(throws: (any Error).self) {
            try sut.division(1, 0)
        }
    }
}
```

## Documenting known issues in your test cases

Although disabling the test can be a solution, the **`withKnownIssue`** function gives us a solution with better approach. It will mark the given expectation as skipped as long as it fails, but immediately marks it as failure when the test starts succeeding again. Each expectation macro can be wrapped into a **`withKnownIssue`** closure.

```swift
import Testing

struct myTests {
    
    @Test func sampleTestRequire() throws {
        let sut = TestEntity()
        withKnownIssue {
            try #require(throws: (any Error).self) {
                try sut.division(1, 1)
            }
        }
        
        #expect(throws: (any Error).self) {
            try sut.division(1, 0)
        }
    }
}
```

## Better test  description with CustomTestStringConvertible
Conforming your test entities to **`CustomTestStringConvertible`**, and adding the proper implementation for **`testDescription`** will present your tests outputs, and adds a level of clarity. Side note: **`CustomTestStringConvertible`** lives in the Testing module, I would suggest to add those descriptions as extensions to your production entities in the test file.

```swift
import Testing

struct IceCream {
    enum Flavor {
        case vanilla, chocolate, strawberry, mint, banana, pistachio, peanut
        
        var containsNuts: Bool {
            switch self {
            case .peanut, .pistachio:
                return true
            default:
                return false
            }
        }
    }
    
    enum Container {
        case cone, cup, bowl
    }
    
    let flavor: Flavor
    let container: Container
}

extension IceCream: CustomTestStringConvertible {
    var testDescription: String {
        "\(flavor) in a \(container)"
    }
}

```


## Parameterized tests to the rescue
Instead of using for loops, parameterized test is the go for solution. It can run in parallel, due to the nature of each test invokes a new instance on which the actual test runs. That can significantly decrease the time of the test run. Any sendable collection, including Array, Set, OptionSet, Dictionary, or Range can be passed to the test attribute. 

Each test argument will be displayed as a separate test, which can be re-run in the test navigator.

```swift
import Testing

@Test(arguments: [IceCream.Flavor.vanilla, .chocolate, .strawberry, .mint, .banana])
func doesNotContainNuts(flavor: IceCream.Flavor) throws {
    try #require(!flavor.containsNuts)
}

@Test(arguments: [IceCream.Flavor.peanut, .pistachio])
func doesContainNuts(flavor: IceCream.Flavor) throws {
    try #require(flavor.containsNuts)
}
```

We can add another parameter collection input to the test, and all of the possible combination (and their respective test) are automatically generated and ran. the first input collection will be passed to the first parameter of the function, while the second will be passed to the second parameter of the function. 

Since the generated combinations grows exponentially when adding a new element to the list, it is advised to use the [zip](https://developer.apple.com/documentation/swift/zip(_:_:)) function from Swift to limit the testing to distinct pairs, instead of all of the combinations.

The maximum count of the parameter collections is 2.

```swift
import Testing

enum Ingredient: CaseIterable {
    case rice, potato, lettuce, egg
}

enum Dish: CaseIterable {
    case onigiri, fries, salad, omelette
}

// Without zip there are 16 test cases (all combination of the 2 sets of 4 elements)
@Test(arguments: Ingredient.allCases, Dish.allCases)
func cook(_ ingredient: Ingredient, into dish: Dish) async throws {
    #expect(ingredient.isFresh)
    let result = try cook(ingredient)
    try #require(result.isDelicious)
    try #require(result == dish)
}

//Zipped to 4 test cases

@Test(arguments: zip(Ingredient.allCases, Dish.allCases))
func cook(_ ingredient: Ingredient, into dish: Dish) async throws {
    #expect(ingredient.isFresh)
    let result = try cook(ingredient)
    try #require(result.isDelicious)
    try #require(result
}
```

## Organizing tests
There are 2 main options to organize our test cases:
* Using Suits
* Add Tags to Suits or Tests

### Suite
The **`@Suite`** annotation can be added to any Swift type, however types containing **`@Test`** functions or suites will be implicitly annotated. 

Suites can be nested into each other, which gives us the opportunity to sub-group our test functions in our codebase, according to functional or logical grouping criteria.

### Tag
Tags can can be added to both the **`@Test`** and the **`@Suite`** annotation. It is possible to add multiple tags to both annotation. This technique can be powerful to group together tests, which are not necessarily in the same file, or part of the same suite. Tags applied on a **`@Suite`** is inherited by the included test functions.

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

In Xcode 16 there is new view to see the tests by tags in the Test Inspector. Tags are searchable, and similarly to the Suite organization, test runs can be initiated on given tags. Test plans now can be defined on exclusion or inclusion of given tag(s).

A new test outline screen added to the test reports, where the test results are displayed. Apart from that the Insights report can also help in case of test failures by highlighting the overall failure status.


## Parallel test run
Swift Testing runs the test functions parallel by default, and also in randomized order to help to identify hidden dependencies between your test. That will result faster test runs, but can be also problematic if your existing test cases are not ready for that.

In order to mitigate the case above, there is the [**`.serialized`**](https://developer.apple.com/documentation/testing/parallelizationtrait) trait, that can be added preferably to the Suite definition, since it has no effect on the individual test cases. This trait is inherited by the sub-suites.
```swift
import Testing

@Suite("Cupcake tests", .serialized)
struct CupcakeTests {
    ...
}
```

## Asynchronous conditions
Testing functions which are already migrated to `async\await` concurrency has no problems with Swift Testing, those calls suspending the test execution flow until the async function returns. 

Older code, using completion handler, and not available with `async/await` concurrency, need to be wrapped with the [**`withCheckedContinuation`**](https://developer.apple.com/documentation/swift/withcheckedcontinuation(function:_:)) or into the [**`withCheckedThrowingContinuation`**](https://developer.apple.com/documentation/swift/withcheckedthrowingcontinuation(function:_:)) respectively:
```swift
import Testing

@Test func bakeCookies() async throws {
    let cookies = await Cookie.bake(count: 10)
    try await withCheckedThrowingContinuation { continuation in
        eat(cookies, with: .milk) { result, error in
            if let result {
                continuation.resume(returning: result)
            } else {
                continuation.resume(throwing: error)
            }
        }
    }
}
```

Event handler callbacks, which are firing zero or more times should be wrapped into [`confirmation`](https://developer.apple.com/documentation/testing/confirmation) where we can get the confirmation of how man times the event happened:
```swift
import Testing

@Test func bakeCookies() async throws {
    let cookies = await Cookie.bake(count: 10)
    try await confirmation("Ate cookies", expectedCount: 10) { ateCookie in
        try await eat(cookies, with: .milk) { cookie, crumbs in
            #expect(!crumbs.in(.milk))
            ateCookie()
        }
    }
}
```
