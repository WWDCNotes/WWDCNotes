# Swift Generics (Expanded)

Generics are one of the most powerful features of Swift, enabling you to write flexible, reusable components while maintaining static type information. Learn about the design of Swift's generics, including how to generalize protocols, leverage protocol inheritance to express the varying capabilities of related types, build composable generic components with conditional conformances, and reason about the interaction between class inheritance and generics. This expanded version of the WWDC 2018 session includes a brand-new discussion of recursive constraints.

@Metadata {
   @TitleHeading("WWDC18")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc18/406", purpose: link, label: "Watch Video (56 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



- Very nice presentation of what Swift Generics are, why they’re better than just defining something as `Any` (both from code, memory, and compiler perspective)

- How to create extensions only to some subsets of Generics (see the `where ...`)

```swift
extension Buffer where Element: Numeric {
  func sum() -> Element {
    var total: Element = 0
    for i in 0..<self.count {
      total += self[i]
    }
    return total
  }
}
```

- How to add constraints to Generics `typealias`:

```swift
typealias CountableRange<Bound: Strideable> = Range<Bound> 
  where Bound.Stride: SignedInteger
```

- How to use Generics in protocols (via `associatedtype`)
  - You can add constraints on the `associatedtype`:

```swift
protocol Collection {
  associatedtype Element
  associatedtype Index: Equatable
}
```

- 
  - Protocol Inheritance

```swift
protocol RandomAccessCollection: BidirectionalCollection {
  func index (_ position: Index, offsetBy n: Int) -> Index
  func distance(from start: Index, to end: Index) -> Int
}

protocol MutableCollection: Collection {
  subscript (index: Index) -> Element { get set }
  mutating func swapAt (_: Index, _: Index) { } 
}

extension RandomAccessCollection where Self: MutableCollection { 
  mutating func shuffle() { 
    let n = count 
    guard n > 1 else { return } 
    for (i, pos) in indices.dropLast().enumerated() { 
      let otherPos = index(startIndex, offsetBy: Int.random(in: i..<n))
      swapAt(pos, otherPos) 
    }
  }
}
```

- Protocol Conformance
  - See [What's New in Swift][wwdc18401]

[wwdc18401]: ../401
