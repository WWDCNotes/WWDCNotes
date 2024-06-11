# What’s new in Swift

Join us for an update on Swift. We’ll briefly go through a history of Swift over the past decade, and show you how the community has grown through workgroups, expanded the package ecosystem, and increased platform support. We’ll introduce you to a new language mode that achieves data-race safety by default, and a language subset that lets you run Swift on highly constrained systems. We’ll also explore some language updates including noncopyable types, typed throws, and improved C++ interoperability.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10136", purpose: link, label: "Watch Video (30 min)")

   @Contributors {
      @GitHubUser("MortenGregersen")
   }
}

## Presenters

Mishal Shah, Swift Team
Meghana Gupta, Swift Team

## History

The first couple of minutes is a recap of the first 10 years of Swift, and what has been leading up to Swift 6 (the new release).

## Community structure

They started out with the Core team, and new steering groups has been added over the years. This year a Platform steering group was introduced to focus on bringing Swift to more places.
The Core team is also actively working on creating a new Ecosystem steering group to focus on the developer experience and the broader ecosystem, and a new Embedded workgroup.

## Supported platforms

Swift is officially supported on Apple platforms, Linux, and Windows. In addition, there are a number of platforms being brought up by the Swift community, including WebAssembly.

This year supported Linux platforms will expand to include Fedora and Debian (in addition to the current: Ubuntu, Amazon Linux, CentOS, and Red Hat UBI).

## Static Linux SDK for Swift

There is a new SDK to help cross compile from macOS to Linux. It is "fully static", which means "you will no longer need to install additional packages in order to run your program."

With the new SDK you can build a package for Linux on macOS.

To install the SDK run this command (there was no info about where to download it):

`swift sdk install <path-to-sdk>`

To compile for an ARM64 Linux environment and link against musl, to produce a statically linked binary which can run on any Linux machine, even one without a Swift runtime installed, add the parameter to the `swift build` command:

`swift build --swift-sdk aarch64-swift-linux-musl`

## Foundation updates

The `swift-corelibs-foundation` project was introduced when Swift was open sourced, to have the Foundation framework available on all platforms.
Now, a single unified implementation has been created and used across all platforms.
Foundation has been rewritten from legacy C and Objective-C into modern, portable Swift, `swift-foundation`.
The new implementation is [open source](https://github.com/apple/swift-foundation) and shipped with iOS and macOS last year.

## Swift Testing

A new testing framework, that takes advantage of modern Swift features such as macros and seamlessly integrates with concurrency.
Developed in [open source](https://github.com/apple/swift-testing) with cross platform in mind.
Designed to integrate into multiple IDEs such as Xcode and VSCode.

In the example below we can see the `@Test` macro applied to the test function. It is possible to specify a title and some tags for the test, as well as a list of arguments to pas to the test.
* The tags are used in Xcode's test navigator to group the tests together.
* The arguments are used to run the same test multiple times with different inputs.

```swift
import Testing

@Test("Recognized rating",
       .tags(.critical),
       arguments: [
           (1, "A Beach",       "⭐️⭐️⭐️⭐️⭐️"),
           (2, "Mystery Creek", "⭐️⭐️⭐️⭐️"),
       ])
func rating(videoId: Int, videoName: String, expectedRating: String) {
    let video = Video(id: videoId, name: videoName)
    #expect(video.rating == expectedRating)
}
```

## Implicitly vs. explicitly built modules

Previously Swift modules was built implicitly without you noticing (except a slow down in the build) when a module depend on other modules.
Explicitly built modules turn those implicit steps into explicit build steps, so they can be done in parallel and show up in the build log.

**Should give more predictable and reliable builds.** 

The debugger can also share binary modules with the build, resulting in faster debugging

This is a build setting "Explicitly Built Modules" and there is a session about that "Demysitifying explicitly built modules".

## A new GitHub organization

Swift will be moving to a new GitHub organization: https://github.com/swiftlang

It will include the Swift compiler, Foundation and many more packages.

## Language updates

### Noncopyable types

All Swift types are copyable by default. It is now possible to suppress this if you want to express unique ownership.

For example, a unique system resource such as a file can be represented as a noncopyable struct with a deinitializer that automatically closes it:

```swift
struct File: ~Copyable {
  private let fd: CInt
  
  init?(name: String) {
    guard let fd = open(name) else {
      return nil
    }
    self.fd = fd
  }

  func write(buffer: [UInt8]) {
    // ...
  }

  deinit {
    close(fd)
  }
}
```

Swift 5.10’s support for noncopyable types was limited only to concrete types.

Swift 6 introduces support for noncopyable types in all generic contexts and in standard library types like `Optional`, `Result` and Unsafe pointers.

There is a session about this called "Consume noncopyable types in Swift".

### Embedded Swift

* New language subset
* New compilation model
* Small and standalone binaries

#### How:
* Disables features needing a runtime like reflection and `any` types
* Uses compiler techniques such as full generics specialization and static linking

**Embedded Swift subset feels very close to “full” Swift**

The Apple Secure Enclave Processor uses Embedded Swift. 

### C++ interoperability

Swift 6, C++ virtual methods, default arguments, move-only types and crucial C++ standard library types can be directly imported into Swift.

C++ move-only types like this `Person` type is mapped to a noncopyable type in Swift:

```c++
struct Person {
  Person(const Person&) = delete;
  Person(Person &&) = default;
  // ...
};
```

```swift
struct Developer: ~Copyable {
    let person: Person
    init(person: consuming Person) {
      self.person = person
    }
}

let person = Person()
let developer = Developer(person: person)
```

### Typed throws

Swift 6 introduces typed throws, which let you specify the error type along with the throws keyword.

```swift
enum IntegerParseError: Error {
  case nonDigitCharacter(String, index: String.Index)
}

func parse(string: String) throws(IntegerParseError) -> Int {
  for index in string.indices {
    // ...
    throw IntegerParseError.nonDigitCharacter(string, index: index)
  }
}

do {
  let value = try parse(string: "1+234")
}
catch {
   // error is 'IntegerParseError'
}
```

#### When to use typed throws?

* When handling errors in the same module
* When propagating error type in generic contexts
* In constrained environments

### Data-race safety

It has been a primary goal of Swift concurrency.
The new Swift 6 language mode achieves data-race safety by default. Turning all the data-race issues in your app into compile time errors.

The new language mode can be enabled module-by-module.

### Atomics and Mutex

New types, Atomic and Mutix, are added in Synchronization framework.

They should always be in a `let` property.

```swift
import Dispatch
import Synchronization 

let counter = Atomic<Int>(0)

DispatchQueue.concurrentPerform(iterations: 10) { _ in
  for _ in 0 ..< 1_000_000 {
    counter.wrappingAdd(1, ordering: .relaxed)
  }
}

print(counter.load(ordering: .relaxed))
```

```swift
import Synchronization

final class LockingResourceManager: Sendable {
  let cache = Mutex<[String: Resource]>([:])
  
  func save(_ resource: Resource, as key: String) {
    cache.withLock {
      $0[key] = resource
    }
  }
}
```

### Final notes

For best practices on migration, there is a hands-on tutorial in the session "Migrate your app to Swift 6".
