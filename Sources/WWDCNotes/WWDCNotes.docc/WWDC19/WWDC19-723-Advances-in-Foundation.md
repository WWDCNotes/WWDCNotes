# Advances in Foundation

The Foundation framework provides a base layer of functionality for apps and frameworks that's used throughout the macOS, iOS, watchOS, and tvOS SDKs. Hear about valuable enhancements to Foundation collections, performance, internationalization features, and Swift integration.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/723", purpose: link, label: "Watch Video (15 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



New:

- A native diffing algorithm 
- A native way to compress `Data` (zlib and more)
- New Units:
  - `UnitDuration`: Added milliseconds, microseconds, nanoseconds, and picoseconds
  - `UnitFrequency`: Added framesPerSecond
  - `UnitInformationStorage`: Bits, Bytes, and more

- `MeasurementFormatter` and `ByteCountFormatter` to display the new `UnitInformationStorage`
- `RelativeDateTimeFormatter`: “one hour ago”, “in two weeks” etc
- New `ListFormatter`

```swift
let string = ListFormatter.localizedString(byJoining: ["🐶","🐷","🦄"])

// en_US: "🐶, 🐷, and 🦄"
// es_ES: "🐶, 🐷 y 🦄"
// zh_TW: "🐶、🐷和🦄"
```

- GDC Improvement: barriers: in concurrent threads/environments we can now use a barrier, which makes sure that no other tasks can run while the barrier operation is ongoing.