# Consume noncopyable types in Swift

Get started with noncopyable types in Swift. Discover what copying means in Swift, when you might want to use a noncopyable type, and how value ownership lets you state your intentions clearly.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10170", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(philptr)
   }
}

# Copying
- By default, when you copy a variable, you're copying its contents
- For value types, the contents are the actual data that makes up the instance

```swift
struct Player { ... }
let player1 = Player(icon: "🐸")
var player2 = player1
player2.icon = "🚚" // player1.icon is still "🐸"
```

- For reference types, the contents are a managed reference, so the reference is copied, not the object itself
    - *Shallow* copy by default

```swift
class PlayerClass { ... }
let player1 = PlayerClass("🐸")
let player2 = player1
player2.icon = "🚚" // player1.icon is "🚚"
```

- You can make reference types perform an *explicit* deep copy by defining a custom initializer
    - Does not control whether Swift can make *automatic* copies

## Copyable
- `Copyable` is a *marker* protocol, like `Sendable`
    - i.e. it doesn't have any associated requirements
- Describes the ability for a type to be automatically copied by Swift
- Everything is `Copyable` in Swift by default
    - Types, generic parameters, protocols and associated types, boxed protocol types, etc.
    - This is an assumption, since `Copyable` types are generally easier to work with

# Noncopyable types
- You can suppress the default `Copyable` behavior by annotating your types with `~Copyable`:

```swift
struct FloppyDisk: ~Copyable { ... }
```

- When copying is not supported, Swift will **consume** the variable instead
    - Can *optionally* annotate variable consumption using the `consume` keyword explicitly
    - Reading consumed values after they've been consumed is a compile-time error

```swift
let system = FloppyDisk()
print(system) // this works
let backup = system // can also be written as `consume system`
print(system) // this produces an error: system is used after consume
```

## Ownership
- With `Copyable` types by default, you don't have to worry about ownership
    - Functions you wrote would effectively receive a copy
- With `~Copyable`, you have to declare what ownership your functions have over the `~Copyable` values

There are 3 kinds of ownership, outlined below.

### Consuming
- Your function will "take" the argument from the caller, and will effectively own it
- You can mutate the argument
- Caller has no access to the value anymore

```swift
func format(_ disk: consuming FloppyDisk) { ... }

let result = FloppyDisk()
format(disk)
return result // produces an error: result is consumed more than once
```

### Borrowing
- Gives you temporary read-only access to the argument
- *Similar* to how parameters already work by default for `Copyable` types
- Cannot consume, or mutate, an explicitly borrowed argument

```swift
func format(_ disk: borrowing FloppyDisk) {
    var tempDisk = disk // produces an error: disk is borrowed and cannot be consumed
}
```

### Mutating, or inout
- Provides *temporary* write access to a caller-owned variable
- Can consume the parameter
- Have to reinitialize the parameter at some point before end of function scope

```swift
func format(_ disk: inout FloppyDisk) {
    var tempDisk = disk
    // Have to reinitialize the parameter before end of scope:
    disk = tempDisk
}
```

## Consumable resources
- Can mark functions as `consuming` to take the value for `self` away from callers
    - Guarantees function cannot be called more than once on the same instance
    - Relationship to `consuming` parameters is similar to how `mutating` is used to indicate an `inout` reference to `self`

```swift
struct BankTransfer: ~Copyable {
    consuming func run() {
        // Never called more than once for the same BankTransfer.
    }
}
```

- By default, reaching the end of the `consuming` function scope will destroy the instance (and call `deinit`)
- Can call `discard self` at end of function scope to destroy without calling `deinit`

```swift
consuming func run() {
    ...
    // Destroy `self` without calling `deinit`:
    discard self
}
```

# Generics
- Core idea: conformance constraints describe generic types
- `Any` is `Copyable`
- Swift 6 introduces noncopyable generics

## Noncopyable generics
- Recall: by default, every protocol inherits from `Copyable`
- You can now *remove* the `Copyable` constraint from a protocol explicitly:

```swift
protocol Runnable: ~Copyable {
    consuming func run()
}
```

- Generics also have a *default* `Copyable` constraint
- You can also remove the `Copyable` requirement from a generic constraint:

```swift
/// This requires T to be *both* `Runnable` and `Copyable`
func execute<T>(_ t: consuming T) where T: Runnable { ... }

/// This requires T to be `Runnable`, but *not necessarily* `Copyable`
func execute<T>(_ t: consuming T) where T: Runnable, T: ~Copyable { ... }
```

> Key point: 
> A *regular* constraint is **more** specific and **narrows** the set of permitted types.
> A *tilde* constraint is **less** specific and **broadens** the types.

## Nesting ~Copyable values
- May store `~Copyable` values inside a class, since copying only copies a reference
- Or, containing type must be `~Copyable` itself

## Conditional Copyable
- You may define conditional `Copyable` conformance on a `~Copyable` type using an extension
- Since `Copyable` is a marker, no additional declarations are necessary inside such an extension

```swift
/// Stores a *potentially* `~Copyable` value, so must be a class or suppress `Copyable`
struct Job<Action: Runnable & ~Copyable>: ~Copyable {
    var action: Action?
}

/// Whenever the contained `Action` is `Copyable`, mark `Job` as `Copyable` too:
extension Job: Copyable where Action: Copyable { }
```

# Extensions
- By default, generic parameters in scope of the extended type are constrained to `Copyable`
    - Includes `Self` in a protocol

```swift
struct Job<Action: Runnable & ~Copyable>: ~Copyable { }

extension Job { ... }

// By default, equivalent to:
extension Job where Action: Copyable { ... }
```
