# Meet the Swift Algorithms and Collections packages

Discover two of the latest additions to the list of open-source Swift packages from Apple: Swift Algorithms and Swift Collections. Not only can you use these packages immediately, they also incubate new algorithms and data structures for eventual inclusion in the Swift Standard Library. We’ll show you how you can integrate these packages into your projects and select the right algorithms and data structures to make your code clearer and faster.

@Metadata {
   @TitleHeading("WWDC21")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc21/10256", purpose: link, label: "Watch Video (30 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## [Swift Algorithms][Swift Algorithms]

- [open-source package][Swift Algorithms] of sequence and collection algorithms that augments the Swift standard library
- the purpose of the Algorithms package is to incubate new families of missing algorithms for eventual inclusion in the standard library
- examples:
  - [`windows(ofCount:)`](https://github.com/apple/swift-algorithms/blob/195e0316d7ba71e134d0f6c677f64b4db6160c46/Guides/Windows.md)
  - [`adjacentPairs()`](https://github.com/apple/swift-algorithms/blob/main/Guides/AdjacentPairs.md)
  - [`chunked(by:)`, `chunked(on:)`, `chunks(ofCount:)`](https://github.com/apple/swift-algorithms/blob/195e0316d7ba71e134d0f6c677f64b4db6160c46/Guides/Chunked.md)

## [Swift Collections][swift-collections]

- [open-source package][swift-collections] with new data structure implementations
- the initial version of the package implements three of the most frequently requested data structures:
  - [Double-ended queue `Deque<Element>`](https://github.com/apple/swift-collections/blob/108ac4fa4ef7f2622b97a1f5dd92a3e0c6857c60/Documentation/Deque.md)
  - [`OrderedSet<Element: Hashable>`](https://github.com/apple/swift-collections/blob/108ac4fa4ef7f2622b97a1f5dd92a3e0c6857c60/Documentation/OrderedDictionary.md)
  - [`OrderedDictionary<Key: Hashable, Value>`](https://github.com/apple/swift-collections/blob/108ac4fa4ef7f2622b97a1f5dd92a3e0c6857c60/Documentation/OrderedSet.md)

[Swift Algorithms]: https://github.com/apple/swift-algorithms
[swift-collections]: https://github.com/apple/swift-collections