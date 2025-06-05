# What’s new in Swift

Join us for an update on Swift. We’ll show you how APIs are becoming more extensible and expressive with features like parameter packs and macros. We’ll also take you through improvements to interoperability and share how we’re expanding Swift’s performance and safety benefits everywhere from Foundation to large-scale distributed programs on the server.

@Metadata {
   @TitleHeading("WWDC23")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc23/10164", purpose: link, label: "Watch Video (43 min)")

   @Contributors {
      @GitHubUser(KyawTheMonkey)
      @GitHubUser(multitudes)
   }
}



## Chapters

[0:39 - Swift project update](https://developer.apple.com/videos/play/wwdc2023/10164/?time=39)  
[2:44 - Using if/else and switch statements as expressions](https://developer.apple.com/videos/play/wwdc2023/10164/?time=164)  
[3:52 - Result builders](https://developer.apple.com/videos/play/wwdc2023/10164/?time=232)  
[4:53 - type parameter packs](https://developer.apple.com/videos/play/wwdc2023/10164/?time=293)  
[9:34 - Swift macros](https://developer.apple.com/videos/play/wwdc2023/10164/?time=574)  
[19:47 - Swift foundation](https://developer.apple.com/videos/play/wwdc2023/10164/?time=1187)  
[23:25 - Ownership](https://developer.apple.com/videos/play/wwdc2023/10164/?time=1405)  
[27:59 - C++ interoperability](https://developer.apple.com/videos/play/wwdc2023/10164/?time=1679)  
[32:41 - What's new in Swift Concurrency](https://developer.apple.com/videos/play/wwdc2023/10164/?time=1961)  
[38:20 - FoundationDB: A case study](https://developer.apple.com/videos/play/wwdc2023/10164/?time=2300)  

## Description

Explore cutting edge language features and new APIs of Swift programming language.

- Swift project update
- Expressive code
- Swift everywhere

# Swift project update
Swift follows an open process for language evolution. New features or significant behavior changes are proposed and reviewed in the open on the Swift forums. If you want to follow along, you can find a dashboard of all the language proposals on the Swift website.

#### [swift.org/swift-evolution](swift.org/swift-evolution)
A year ago, we saw a significant restructuring of the Swift Project governance. The core team announced the formation of the Language Steering Group, which took on primary responsibility for oversight of the Swift language and standard library evolution. Since then, the language group has overseen 40 new language proposals, and we're going to talk about several of them today.  

But sometimes, individual language proposals come together as part of a wider theme, like the addition of Swift concurrency, which was introduced through ten separate proposals.  

For cases like this, the language steering group has introduced a new way of tying together these proposals, through vision documents.


These documents lay out a proposal for larger changes to the language. The first one to be accepted by the language steering group was a vision of Swift macros, a new feature in Swift 5.9 that we'll be covering later in this talk.

![vision documents][visionDocuments]

[visionDocuments]: WWDC23-10164-visionDocuments

Of course, evolution of the language is only part of the work of the Swift community. A successful language needs much more than this. It needs great tooling, robust support for multiple platforms, and rich documentation. To oversee progress in this area, the core team is creating an ecosystem steering group parallel to the language steering group. This new structure was recently laid out in a blog post on Swift.org, a look out for further announcements about the formation of this new group soon.

![vision documents][visionDocuments2]

[visionDocuments2]: WWDC23-10164-visionDocuments2

# Expressive code

Swift 5.9 includes what is probably our most commonly requested language enhancement, allowing if/else and switch statements to be used as expressions, providing a nice way to clean up your code.

### If/else and switch statements can now be used as expressions

For example, if you wanted to initialize a let variable based on some complex condition, you had to resort to tricks, like this hard-to-read compound ternary expression.
```swift
// Before 🤯
let bullet =
    isRoot && (count == 0 || !willExpand) ? ""
        : count == 0 ? "- "
        : maxDepth <= 0 ? "▹ " : "▿ "

// After 🤩
let bullet =
    if isRoot && (count == 0 || !willExpand) { "" }
    else if count == 0 { "- " }
    else if maxDepth <= 0 { "▹ " }
    else { "▿ " }
```

Another place where this helps is if you're initializing a global variable or a stored property. Single expressions work fine here, but if you wanted a condition, you had to use the trick of wrapping it in a closure that you then immediately executed.

```swift
let attributedName =
    AttributedString(markdown: displayName)
// before
let attributedName = {
    if let displayName, !displayName.isEmpty {
        AttributedString (markdown: displayName)
    } else {
        "Untitled"
    }
}()    
```
Now that an if statement can be an expression, you can just drop that clutter, leaving you with neater code.
```swift
let attributedName =
    if let displayName, !displayName.isEmpty {
        AttributedString (markdown: displayName)
    } else {
        "Untitled"
    }    
```

## Result builders enhancement

- Faster type checking  
- Improved code completion  
- More accurate error messages

Result builders have seen significant improvements including optimized type checking performance, code completion and improved error messages.

Previously, result builder code with errors would take a long time to fail, as the type checker explored the many possible invalid paths.

As of Swift 5.8, invalid code type checks much faster, and error messages on invalid code are now more precise. For example, previously, some invalid code could lead to misleading errors in a completely different part of the result builder. In Swift 5.7, you'd receive an error like this:

![][1]

[1]: WWDC23-10164-IMG_9B4379D3B587-1

when the mistake actually lies up here:

![][2]

[2]: WWDC23-10164-IMG_FFC563B46E50-1

## Generic improvement

Type inference enables using these types without needing to understand the advanced capabilities they're built with. For example, the standard library Array type uses generics to provide an array that works with any type of data that you might want to store. When you use an array, all you need to do is provide the elements. There's no need to specify an explicit argument for the element type because it can be inferred from the element values.  
Here's an example inspired by the Swift compiler's own codebase: An API that takes a request type and evaluates it to produce a strongly typed value. So you can make a request for a Boolean value and get back a Boolean result.
```swift
struct Request<Result> { ... }

struct RequestEvaluator {
    func evaluate<Result>(_ request: Request<Result>) -> Result
}

func evaluate(_ request: Request<Bool>) -> Bool {
    return RequestEvaluator ().evaluate(request)
}
```
Now, some APIs want to abstract not only over concrete types, but also the number of arguments that you pass in. So a function might take one request and return one result or two requests and return two results, or three and return three results.  
To support this, the generics system has to be used together with a mechanism to handle multiple argument lengths so that all of the types that you pass in are linked to the types that you get out.
```swift
let value = RequestEvaluator().evaluate(request)

let (x, y) = RequestEvaluator().evaluate(r1, r2)

let (x, Y, z) = RequestEvaluator().evaluate(rl, I2, I3)
```

Before Swift 5.9, the only way to accomplish this pattern was by adding an overload for each specific argument length the API supported. But this approach has limitations. It forces an artificial upper bound on the number of arguments you can pass, resulting in compiler errors if you pass too many.

```swift
struct Request<Result> { ... }
struct RequestEvaluator {
    func evaluate<Result>(:) -> (Result)
    func evaluate<R1, R2> (_:_:) -> (R1, R2)
    func evaluate<R1, R2, R3> (_:_:_:) -> (R1, R2, R3)
    func evaluate<R1, R2, R3, R4>(_:_:_:_:)-> (R1, R2, R3, R4)
    func evaluate<R1, R2, R3, R4, R5>(_:_:_:_:_:) -> (R1, R2, R3, R4, R5)
    func evaluate<R1, R2, R3, R4, R5, R6>(_:_:_:_:_:_:) -> (R1, R2, R3, R4, R5, R6)
}
let results = evaluator. evaluate (r1, r2, r3, r4, r5, r6, r7)
```
In Swift 5.9, the generics system is gaining first-class support for this API pattern by enabling generic abstraction over argument length. This is done with a new language concept that can represent multiple individual type parameters that are "packed" together. This new concept is called a **type parameter pack**.  

![Each Result][eachResult]

[eachResult]: WWDC23-10164-eachResult

Instead of accepting a single type parameter, Result, representing the result type of a single request, the evaluate function now accepts a separate request over `each Result` type.
```swift
func evaluate<each Result>(_: repeat Request<each Result>) -> (repeat each Result)
```

The function returns each result instance in parenthesis, which will either be a single value or a tuple containing each value.  
The evaluate function now handles all argument lengths with no artificial limit.
```swift
// Before 🤯
struct Request<Result> { ... }

struct RequestEvaluator {
    func evaluate<Result>(_:) -> (Result)
    func evaluate<R1, R2>(_:) -> (R1, R2)
    func evaluate<R1, R2, R3>(_:) -> (R1, R2, R3)
    func evaluate<R1, R2, R3, R4>(_:) -> (R1, R2, R3, R4)
}

// Call side
let results = RequestEvaluator.evaluate(r1, r2, r3, r4)

// After 🤩
struct RequestEvaluator {
    func evaluate<each Result>(_: repeat Request<each Result>) -> (repeat each Result)
}

// Call side
let results = RequestEvaluator.evaluate(r1, r2, r3, r4)
```

- The evaluate func now handles all arg lengths with no artificial limit
- Type inference makes APIs using parameter packs natural to use, without needing to know that the API is using them, i.e call-side might not even aware you are using type parameter pack under the hood.

To learn about how to write generic library APIs like these, check out:

[Generalize APIs with parameter packs - WWDC23](https://developer.apple.com/videos/play/wwdc2023/10168)

# Swift Macros

With macros, you can extend the capabilities of the language itself, eliminating boilerplate and unlocking more of Swift's expressive power. Let's consider the ever-present assert function, which checks whether a condition is true.
```swift
// Normal assert func, not much info will be printed
assert(max(a, b) == c)
```

Assert will stop the program if the condition is false, but when that happens, you get very little information about what went wrong, just the file and line number. You'll need to add some logging or trap the program in the debugger to learn more.

![Macro Assert][macroAssert]

[macroAssert]: WWDC23-10164-macroAssert

There have been attempts to improve on this. XCTest provides an assert-equal operation that takes the two values separately, so when things fail, you can at least see the two values that aren't equal.

![Macro Assert][macroAssert2]

[macroAssert2]: WWDC23-10164-macroAssert2

But we still don't know which value is wrong here. Was it a, b, or the result of max? And this approach really doesn't scale for all of the kinds of checks we perform in asserts. If we go back to the original assertion, there is so much information here in the source code that we'd like to see in the log when our assertion fails. What was the code? What are the values of a, and b, and c? What did max produce? We couldn't improve this in Swift before without some custom feature, but macros make it possible.
```swift
// With "hash-assert" syntax is expanding the macro called "assert"
#assert(max(a, b) == c)
```

In this example, the "hash-assert" syntax is expanding the macro called "assert." The hash syntax might look familiar because Swift already has a few things with this same spelling, like hash-file, hash-selector, and hash-warning. 

Now the program is showing the code for the failing assertion, along with each of the values that contributed to the result.

![Macro Assert][macroAssert3]

[macroAssert3]: WWDC23-10164-macroAssert3

In Swift, macros are APIs, just like types or functions, so you access them by importing the module that defines them. Like many other APIs, macros are distributed as packages. The assert macro here comes from the power asserts library, an open-source Swift package available on GitHub.

If you were to look into the macro package, you would find a macro declaration for assert. It is introduced with the "macro" keyword, but it looks a lot like a function. There's a single unlabeled Bool parameter for the condition to be checked. If this macro produced a value, that result type would be written with the usual arrow syntax.
```swift
// Macro declarations
public macro assert(_ condition: Bool)
```

Uses of the macro will be type checked against the parameters. 

Most macros are defined as "external macros," specifying the module and type for a macro implementation via strings. The external macro types are defined in separate programs that act as compiler plugins. The Swift compiler passes the source code for the use of the macro to the plugin. The plugin produces new source code, which is then integrated back into the Swift program.
```swift
// Macros are separate programs
public macro assert(_ condition: Bool) = #externalMacro(
    module: "PowerAssertPlugin",
    type: "PowerAssertMacro"
)
```
Here, the macro is expanding the assertion into code that captures the individual values and where they should be displayed in the source code. You wouldn't want to write the boilerplate yourself, but the macro does it for you.

![Macro Assert][macroAssert4]

[macroAssert4]: WWDC23-10164-macroAssert4

- You can extend the capabilities of the lang itself, eliminate boilerplate  
- Assert macro looks and feels like the function version, but, as it’s a macro, it can provide a richer experience.  
- Macros are APIs, just like types or functions, you access them by importing the module that defines them  
- Macros operate on well-typed inputs and produce code that augments your program (hence shipped with compile time type checking and helpful error message  
- Most macros are defined as “external macros”, so, you need to specify module and type for actual macro implementation via strings.
- The external macro types are defined in separate programs, that act as compiler plugins. Swift compiler passes the source code (`#assert(a == b)` in our case) for the use of the macro to the plugin, and the plugin produces new source code (the implementation), and that code is then integrated back into the Swift program.
- Macro declarations have one additional piece of info, their role.

### Freestanding macro roles
```swift
@freestanding(expression)
public macro assert(_ condition: Bool) = #externalMacro(
    module: "PowerAssertPlugin",
    type: "PowerAssertMacro"
)
```

- `assert` is labelled as freestanding because it uses the “hash” syntax. It is an expression macro as it can be used anywhere that one can produce a value. 
If you wanna see example of an expression macro, check out the new Foundation Predicate APIs.

The new Foundation Predicate APIs provide a great example of an expression macro. The predicate macro allows one to write predicates in a type-safe manner using closures. The resulting predicate values can then be used with a number of other APIs, including the Swift collection operations SwiftUI and SwiftData.
```swift
// Predicate expression macro
@freestanding(expression)
public macro Predicate<each Input>(
    _ body: (repeat each Input) -> Bool
) -> Predicate<repeat each Input>


let pred = #Predicate<Person> {
    $0.favoriteColor == .blue
}
let blueLovers = people.filter(pred)
```

### Case detection attached macros

Let's take an example. I find that I use enums a lot in my own code, like this Path enum that captures either relative or absolute paths. But I'll often find myself needing to check for a specific case, say, by filtering all absolute paths from a collection. I can write this isAbsolute check as a computed property, of course. But sooner or later, I'm going to have to write another one.  
This is getting a bit tedious.
```swift
// Testing for a specific enum case
enum Path {
    case relative(String)
    case absolute (String)
}

let absPaths = paths.filter { $0.isAbsolute }

extension Path {
    var isAbsolute: Bool {
        if case absolute = self { true }
        else { false }
    }
}

extension Path {
    var isRelative: Bool {
    if case relative = self { true }
    else { false }
    }
}
```
Case detection is an attached macro, written using the same custom-attribute syntax as property wrappers. Attached macros take as input the syntax of the declaration they apply to-- here it's the enum declaration itself-- and will generate new code.

This macro-expanded code is normal Swift code, which the compiler integrates into your program. You can inspect the macro-generated code in your editor, debug into it, copy it out if you want to customize it further, and so on.
```swift
// Testing for a specific enum case
@CaseDetection
enum Path {
    case relative(String)
    case absolute(String)
}

let absPaths = paths.filter { $0.isAbsolute }
```
- Macro expand code (with use of `@CaseDetection` just like you define a property wrapper)
```swift
// @CaseDetection expanded
var isAbsolute: Bool {
    if case absolute = self { true }
    else { false }
}
var isRelative: Bool {
    if case relative = self { true }
    else { false }
}
```
![][9]

[9]: ../../../images/notes/wwdc23/10164/IMG_991CDD186BB4-1.jpeg

## Attached macro roles
Attached macros are classified into five different roles based on how they augment the declaration they are attached to.

![attachedMacroRoles][attachedMacroRoles]

[attachedMacroRoles]: WWDC23-10164-attachedMacroRoles

The case detection macro we just discussed is a "member" attached macro, meaning that it creates new members in a type or extension.

Peer macros add new declarations alongside the declaration they're attached to, for example, to create a completion-handler version of an async method or vice-versa.

Accessor macros can turn a stored property into a computed property, which can be used to perform specific actions on property access or abstract the actual storage in a manner similar to, but more flexible than property wrappers. And attached macros can introduce attributes onto specific members of a type, as well as add new protocol conformances.


### SwiftUI’s Observable macro

Observation has always been a part of SwiftUI. To be able to observe changes to the properties of a class, one need only make the type conform to ObservableObject, and mark every property at-Published, and use the ObservedObject property wrapper in your view.
```swift
// Observation in SwiftUI
final class Person: ObservableObject {
    @Published var name: String
    @Published var age: Int
    @Published var isFavorite: Bool
}

struct ContentView: View {
    @ObservedObject var person: Person
    
    var body: some View {
        Text ("Hello, \(person.name)")
    }
}
```

That's a bunch of steps, and missing a step can mean that the UI doesn't update as expected. We can do better with macro-based observation.

Attaching the Observable macro to a class provides observation for all of its stored properties. There is no need to annotate each stored property or worry about what happens if you don't because the Observable macro handles it all.
```swift
// Observation in SwiftUI
@Observable final class Person {
    var name: String var age: Int 
    var isFavorite: Bool
}

struct ContentView: View {
    var person: Person
    var body: some View {
        Text ("Hello, \(person.name)")
    }
}
```
The Observable macro works through composition of three macro roles. Let's dive into how these roles work together.
```swift
@attached(member, names: ...) 
@attached(memberAttribute) 
@attached(conformance)
public macro Observable () = #externalMacro(...)
```
Each macro role corresponds to a specific way in which the Person class is augmented by the Observable macro. The member role introduces new properties and methods.
```swift
// Observable macro expansion
@Observable final class Person {
    var name: String 
    var age: Int 
    var isFavorite: Bool
}
```
The member attribute role will add the @ObservationTracked macro to the stored properties of the observed class, which in turn expands to getters and setters to trigger observation events. Finally, the conformance role introduces the conformance to the Observable protocol.
```swift
// Observable macro expansion
Observable final class Person: Observable {
    @ObservationTracked var name: String { get { ... } set { ... } }
    @ObservationTracked var age: Int { get { . } set { ... } }
    @ObservationTracked var isFavorite: Bool { get { ... } set { .. } }
    
    internal let _$observationRegistrar = ObservationRegistrar<Person>()
    internal func access<Member>(
        keyPath: KeyPath<Person, Member>
    ) {
        _$observationRegistrar.access(self, keyPath: keyPath)
    }
    internal func withMutation<Member, T>(
        keyPath: KeyPath<Person, Member>, 
        mutation: () throws -> T
    ) rethrows -> T {
        try _$observationRegistrar.withMutation(of: self, keyPath: keyPath, mutation)
    }
}
```
This may look like a lot of code, but it's all just normal Swift code, and it's neatly folded away behind the Observable macro.  
Whenever you need to see how any macro expands to better understand its effect on your program, it's right there at your fingertips in Xcode.  
Whenever you need to see how any macro expands, Xcode 15 comes up with “Expand Macros”

![Expand Macros][expandMacros]

[expandMacros]: WWDC23-10164-expandMacros

This session will go deep into the design of Swift macros to answer all of those questions you must have:

[Expand on Swift macros - WWDC23](https://developer.apple.com/videos/play/wwdc2023/10167)  

And you can get hands-on implementing your own macros with:

[Write Swift macros - WWDC23](https://developer.apple.com/videos/play/wwdc2023/10166)

# Swift everywhere

Swift is also efficient. It compiles natively, and its use of value types and of reference counting instead of garbage collection means it's able to achieve a low memory footprint.  

This scalability means we're able to push Swift to more places than was previously possible with Objective-C, to low-level systems, where previously you might expect to have to use C or C++. This means bringing Swift's clearer code and critical safety guarantees to more places.
   
We recently open sourced the start of a rewrite of the Foundation framework in Swift. This initiative will lead to a single shared implementation of Foundation on both Apple and non-Apple platforms. But it also meant rewriting large amounts of Objective-C and C code in Swift.

![Swift everywhere][swiftEverywhere]

[swiftEverywhere]: WWDC23-10164-swiftEverywhere

As of MacOS Sonoma and iOS 17, there are new Swift-backed implementations of essential types like Date and Calendar, of formatting and internationalization essentials like Locale and AttributedString, and a new Swift implementation of JSON encoding and decoding. And the performance wins have been significant.

- Swift foundation framework has significant performance improvement
    - Calendar calculations: 20% faster
    - Date formatting: 150% faster
    - JSON coding: 200-500% faster

Foundation has a brand-new Swift implementation for JSONDecoder and JSONEncoder, eliminating costly roundtrips to and from the Objective-C collection types. The tight integration of parsing JSON in Swift for initializing Codable types improves performance too. In benchmarks parsing test data, the new implementation is between two and five times faster. These improvements came from both reducing the bridging cost from the old Objective-C implementation to Swift, but also by the new Swift-based implementations being faster.

### Benchmark: calling enumerateDates

![Swift everywhere][swiftEverywhere2]

[swiftEverywhere2]: WWDC23-10164-swiftEverywhere2

Now, sometimes, when you're operating at lower levels of the system, you need more fine-grained control to achieve a necessary level of performance. Swift 5.9 introduces some new opt-in capabilities that help you achieve this level of control. These capabilities focus on the concept of ownership, that is, what part of the code "owns" a value as it passes around your application.

Here we have a very simple wrapper for a file descriptor that would allow us to give low-level system calls a nicer Swift interface. But there’s still some easy ways to make mistakes with this API. For example, you might try to write to the file after you’ve called close. And you have to be careful to always close it manually by calling the close method before the type goes out of scope. Otherwise, you would get a resource leak.
```swift
struct FileDescriptor {
    private var fd: CInt
    
    init(descriptor: CInt) { self.fd = descriptor }

    func write(buffer: [UInt8]) throws {
        let written = buffer.withUnsafeBufferPointer {
            Darwin.write(fd, S0.baseAddress, $0.count)
        }
    // ...
    }

    func close() {
        Darwin.close(fd)
    }
}
```

One solution would be to make it a class with a deinit that closes it automatically when the type goes out of scope.

But that has different downsides, like making an additional memory allocation, which is usually not a big problem, except in some very constrained systems contexts.
```swift
class FileDescriptor {
    private var fd: CInt
    
    init(descriptor: CInt) { self.fd = descriptor }
    
    func write(buffer: [UInt8]) throws {
        let written = buffer.withUnsafeBufferPointer {
            Darwin.write(fd, So.baseAddress, $0.count)
        }
        // ...
    }
    
    func close() {
        Darwin.close(fd)
    }
    
    deinit {
        self.close(fd)
    }
}
```
Classes also have reference semantics. You might unintentionally end up sharing a file descriptor type across threads, leading to race conditions, or store it unintentionally.

But let's go back and look at the struct version.

Really, this struct also behaves like a reference type. It holds an integer that references the true value, which is an open file. Making a copy of this type could also lead to unintentional sharing of mutable state across your app in ways that could lead to bugs. What you want is to suppress the ability to make a copy of this struct.

Swift types, whether structs or classes, are copyable by default. This is the right choice most of the time.  

But sometimes that implicit copy isn't what you want--in particular, when making copies of a value might lead to correctness issues, like with our file descriptor wrapper. In Swift 5.9, you can do that with this new syntax that can be applied to struct and enum declarations and that suppresses the implicit ability to copy a type.  

`~Copyable` (can be applied to struct and enum declarations) suppresses the implicit ability to copy a type. Once the type is non-copyable, you can give it a deinit (which will run when a value of the type goes out of scope), like you can a class.
```swift
struct FileDescriptor: ~Copyable {
    private var fd: CInt
    
    init(descriptor: CInt) { self.fd = descriptor }

    func write(buffer: [UInt8]) throws {
        // ...
    }

    func close() {
        Darwin.close(fd)
    }
    
    deinit {
        Darwin.close(fd)
    }
}
```

The close operation can be marked as consuming. Calling a `consuming` method or argument gives up ownership of a value to the method you called. Since our type is non-copyable, giving up ownership means you can no longer use the value.

```swift
struct FileDescriptor: ~Copyable {
    private var fd: CInt

    init(descriptor: CInt) { self.fd = descriptor }

    func write(buffer: [UInt8]) throws {
        // ...
    }

    consuming func close() {
        Darwin.close(fd)
    }

    deinit {
        Darwin.close(fd)
    }
}
```

This means, if you close the file first and then attempt to call another method, like write, you'll get an error message at compile time, rather than a runtime failure. The compiler will also indicate where the consuming use occurred.

![consuming][consuming]

[consuming]: WWDC23-10164-consuming


# C++ Interoperability

- Use C++ APIs directly from Swift  
- Expose most Swift APIs directly to C++  
- Join us on the forums  

Many apps also have core business logic implemented in C++, and interfacing to that has not been so easy. Often it meant adding an extra manual bridging layer, going from Swift, through Objective-C, and then into C++, and all the way back.
Swift 5.9 introduces the ability to interact with C++ types and funcs directly from Swift.

![interact with C++][interactWithCplusplus]

[interactWithCplusplus]: WWDC23-10164-interactWithCplusplus

C++ is a large language with its own notions of ideas like classes, methods, containers, and so on. The Swift compiler understands common C++ idioms, so many types can be used directly. For example, this Person type defines the five special member functions expected of a C++ value type: Copy and move constructors, assignment operators, and a destructor.
```C++
// Using C++ from Swift

// Person.h
struct Person {
    Person (const Person &);
    Person (Person &&);
    Person &operator=(const Person &);
    Person &operator=(Person &&);
    ~Person ();
    
    std::string name;
    unsigned getAge() const;
};

std::vector<Person> everyone();
```
The Swift compiler treats this as a value type and will automatically call the right special member function at the right time. Additionally, C++ containers like vectors and maps are accessible as Swift collections.

Calling C++ from Swift:
The result of all of this is that we can write straightforward Swift code that makes direct use of C++ functions and types. We can filter over the vector of Person instances, calling C++ member functions and accessing data members directly.
```swift
// Client.swift
func greetAdults() {
    for person in everyone().filter { $0.getAge() >= 18 } {
        print ("Hello, \(person.name)!")
    }
}
```

Calling Swift from C++
In the other direction, using Swift code from C++ is based on the same mechanism as with Objective-C. The Swift compiler will produce a "generated header" that contains a C++ view on the Swift APIs. However, unlike with Objective-C, you don't need to restrict yourself to only using Swift classes annotated with the objc attribute. C++ can directly use most Swift types and their full APIs, including properties, methods, and initializers, without any bridging overhead.
```swift
// Geometry.swift

struct LabeledPoint {
    var x = 0.0, y = 0.0
    var label: String = "origin"

    mutating func moveBy(x deltaX: Double, y deltaY: Double) { ... }
    var magnitude: Double { ... }
}
```

Here we can see how C++ can make use of our Point struct. After including the generated header, C++ can call Swift initializers to create Point instances, invoke mutating methods, and access both stored and computed properties, all without any change to the Swift code itself.
```C++
// C++ client
#include <Geometry-Swift.h>
void test() {
    Point origin = Point ()
    Point unit = Point::init(1.0, 1.0, "unit")
    unit.moveBy(2, -2)
    std::cout << unit.label <‹ " moved to " << unit.magnitude() << std:: endl;
}
```

Many C++ idioms can be directly expressed in Swift, often automatically, but occasionally requiring some annotations to indicate the desired semantics. And Swift APIs can be directly accessed from C++, no annotation or code changes required.  
C++ interoperability is an evolving story, guided by the C++ interoperability workgroup. For more information, please see the session

[Mix Swift and C++](https://developer.apple.com/videos/play/wwdc2023/10172)  

or join us in the discussion on the Swift forums.

## CMake

Can integrate Swift code into CMake build by declaring Swift as one of the languages for the project and putting Swift files into a target.
```swift
// CMake

project(PingPong LANGUAGES Swift)

add_library(PingPong
    Ping.swift
    Pong.swift
)
```

You can mix C++ and Swift within a single target, and CMake will be sure to compile each separately and link all of the appropriate supporting libraries and runtimes for both languages.  
We're also providing a sample repository with CMake projects containing Swift and mixed C++/Swift targets, including using the bridging and generated headers, to help you get started.
```swift
// CMake

project(PingPong LANGUAGES CXX Swift)

add_library(PingPong
    Ping.swift
    Pong.swift
    TableTennisUtils.cpp
)
```

- Can mix C++ and Swift within a single target, and CMake will be compiled separately and link all of the appropriate supporting libraries and runtimes for both.

# Actors and Concurrency updates

Swift's concurrency model is an abstract model, which can be adapted to different environments and libraries. The abstract model has two main pieces: Tasks and actors. Tasks represent a sequential unit of work that can conceptually run anywhere. Tasks can be suspended whenever there's an "await" in the program, and then resume once the task can continue.

Actors are a synchronization mechanism that provide mutually-exclusive access to isolated state. Entering an actor from the outside requires an "await" because it may suspend the task.

### Abstract concurrency model:
- Sequential unit of work that can run anywhere
Actors:
- Mutually exclusive access to isolated state

### Tasks in different environments
Global concurrency pool determines scheduling:  
- Dispatch on Apple platforms  
- Single-threaded cooperative queue in restricted environments  
Tasks are executed on the global concurrent pool. How that global concurrent pool decides to schedule work is up to the environment. For Apple's platforms, the Dispatch library provides optimized scheduling for the whole operating system, and has been extensively tuned for each platform.  
In more restrictive environments, the overhead of a multithreaded scheduler may not be acceptable. There Swift's concurrency model is implemented with a single-threaded cooperative queue.  
The same Swift code works in both environments because the abstract model is flexible enough to map to diverse runtime environments.

Additionally, interoperability with callback-based libraries was built into Swift's async/await support from the beginning. The withCheckedContinuation operations allow one to suspend a task, and then resume it later in response to a callback. This enables integration with existing libraries that manage tasks themselves.
```swift
withCheckedContinuation { continuation in
    sendMessage (msg) { response in
        continuation.resume (returning: response)
    }
}
```
## Actors
- Actors can be implemented in different ways
- Custom actor executors allows a particular actor to implement its own synchronization mechanism

The standard implementation of actors in the Swift concurrency runtime is a lock-free queue of tasks to execute on the actor, but it's not the only possible implementation.  
In a more restricted environment, one might not have atomics, and instead could use another concurrency primitive such as spinlocks. If that environment were single-threaded, no synchronization is needed, but the actor model maintains the abstract concurrency model for the program regardless.  
You could still take that same code to another environment that is multi-threaded. 

With Swift 5.9, custom actor executors allow a particular actor to implement its own synchronization mechanism. This makes actors more flexible and adaptable to existing environments. Let's take an example.  
Here we consider an actor that manages a database connection. Swift ensures mutually-exclusive access to the storage of this actor, so there won't be any concurrent access to the database.
```swift
// Custom actor executors
actor MyConnection {
    private var database: UnsafeMutablePointer<sqlite3>
    
    init(filename: String) throws { ... }
    
    func pruneOldEntries() { ... }
    func fetchEntry<Entry>(named: String, type: Entry.Type) -> Entry? { ... }
}
await connection.pruneOldEntries()
```

However, what if you need more control over the specific way in which synchronization is done? For example, what if you want to use a specific dispatch queue for your database connection, perhaps because that queue is shared with other code that hasn't adopted actors? With custom actor executors, you can.

Here we've added a serial dispatch queue to our actor and an implementation of the unowned executor property that produces the executor corresponding to that dispatch queue. With this change, all of the synchronization for our actor instances will happen through that queue.
```swift
// Custom actor executors
actor MyConnection {
    private var database: UnsafeMutablePointer<sqlite3> 
    private let queue: DispatchSerialQueue
    
    nonisolated var unownedExecutor: UnownedSerialExecutor { queue.asUnownedSerialExecutor() }
    
    init(filename: String, queue: DispatchSerialQueue) throws { ... }
    
    func pruneOldEntries () { ... }
    func fetchEntry<Entry> (named: String, type: Entry.Type) -> Entry? { ... }
}

await connection.pruneOldEntries()
```

When you "await" on the call to pruneOldEntries from outside the actor, this will now perform a dispatch-async on the corresponding queue. This gives you more control over how individual actors provide synchronization, and even lets you synchronize an actor with other code that isn't using actors yet, perhaps because it's written in Objective-C or C++.

```swift
// Executor protocols
protocol Executor: AnyObject, Sendable {
    func enqueue(_ job: consuming ExecutorJob)
}

protocol SerialExecutor: Executor {
    func asUnownedSerialExecutor() -> UnownedSerialExecutor 
    func isSameExclusiveExecutionContext(other executor: Self) -> Bool
}

extension DispatchSerialQueue: SerialExecutor { ... }
```

The synchronization of actors via dispatch queues is made possible because dispatch queue conforms to the new SerialExecutor protocol. 

You can provide your own synchronization mechanism to use with actors by defining a new type that conforms to this protocol which has only few core operations: Checking whether the code is already executing in the context of the executor.  

Are we running on the main thread? Extracting an unowned reference to the executor to allow access to it without excess reference-counting traffic. And the most core operation, enqueue, which takes ownership of an executor "job." A job is part of an asynchronous task that needs to run synchronously on the executor. At the point where enqueue is called, it's the responsibility of the executor to run that job at some point when there's no other code running on the serial executor.  
For example, enqueue for a dispatch queue would call dispatch async on that queue.

For more information, please see 

[Swift concurrency: Behind the scenes - WWDC21](https://developer.apple.com/videos/play/wwdc2021/10254) 
and:   
[Beyond the basics of structured concurrency - WWDC23](https://developer.apple.com/videos/play/wwdc2023/10170)


## A case study
FoundationDB is a distributed database, providing a scalable solution for very large key-value stores running on commodity hardware and supporting a variety of platforms, including MacOS, Linux, and Windows.

FoundationDB is an open-source project with a large code base written in C++. The code is heavily asynchronous, with its own form of distributed actors and runtime that provides a critically important deterministic simulation environment for testing purposes.

![case study with C++][caseStudy]

[caseStudy]: WWDC23-10164-caseStudy

A complete rewrite would be a big, risky endeavor. Instead, we leveraged Swift's interoperability to integrate into the existing code base. For example, here's a part of the C++ implementation of FoundationDB's "master data" actor.
This function can be directly implemented as an async function in Swift. 

![case study with C++][caseStudy2]

[caseStudy2]: WWDC23-10164-caseStudy2

## Wrap-up

- Create more expressive APIs  
- Tune low-level performance  
- Interoperate with existing c++ code bases  
- Adapt concurrency to your environment

## Resources

[Evolving Swift Project Workgroups](https://www.swift.org/blog/evolving-swift-project-workgroups/)  
[Have a question? Ask with tag wwdc2023-10164](https://developer.apple.com/forums/create/question?&tag1=235&tag2=678030)  
[Search the forums for tag wwdc2023-10164](https://developer.apple.com/forums/tags/wwdc2023-10164)  
[Swift CMake Examples](https://github.com/apple/swift-cmake-examples)  
[Swift Evolution](https://apple.github.io/swift-evolution/)  
[The Future of Foundation](https://www.swift.org/blog/future-of-foundation/)

# Related Videos

[Beyond the basics of structured concurrency - WWDC23](https://developer.apple.com/videos/play/wwdc2023/10170)  
[Expand on Swift macros - WWDC23](https://developer.apple.com/videos/play/wwdc2023/10167)  
[Generalize APIs with parameter packs - WWDC23](https://developer.apple.com/videos/play/wwdc2023/10168)  
[Meet SwiftData - WWDC23](https://developer.apple.com/videos/play/wwdc2023/10187)  
[Mix Swift and C++](https://developer.apple.com/videos/play/wwdc2023/10172)  
[Write Swift macros - WWDC23](https://developer.apple.com/videos/play/wwdc2023/10166)  
[Swift concurrency: Behind the scenes - WWDC21](https://developer.apple.com/videos/play/wwdc2021/10254)  
