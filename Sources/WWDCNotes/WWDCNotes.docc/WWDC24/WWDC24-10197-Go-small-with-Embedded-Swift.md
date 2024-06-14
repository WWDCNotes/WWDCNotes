# Go small with Embedded Swift

Embedded Swift brings the safety and expressivity of Swift to constrained environments. Explore how Embedded Swift runs on a variety of microcontrollers through a demonstration using an off-the-shelf Matter device. Learn how the Embedded Swift subset packs the benefits of Swift into a tiny footprint with no runtime, and discover plenty of resources to start your own Embedded Swift adventure.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10197", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(dagronf)
   }
}

# Embedded Swift

*Presenter: Kuba Mracek*

Producing small, simple and *freestanding* binaries with no (or trivial) dependencies

A new compilation mode specifically suited for constrained embedded devices 
(Memory, CPU, Storage constrained)

* Is a **full-featured subset** of Swift. Most Swift features are available in Embedded Swift. 
* All code written for Embedded Swift will work for regular Swift.

Historically C/C++ are used for embedded devices (little to no memory safety).
Swift encourages clean and intuitive design and implementation of your code, 
and it improves readability and safety over C and C++.

Apple devices already use Embedded Swift on the Secure Enclave Processor.

## Limitations

* Is still an experimental feature
* Not source stable *yet*
* Still under active development 

Not all Swift features are available, eg.

* Mirror reflection
* Metatypes
* 'any' types

The compiler will flag these features as errors during compilation.

## Build environment

The [Swift Embedded Examples](https://github.com/apple/swift-embedded-examples) has examples for different
processors for build environments for different embedded processors.

## Development

* [Embedded Swift User Manual](https://github.com/apple/swift/blob/main/docs/EmbeddedSwift/UserManual.md) outlines how
to get started, which compile flags required, required dependencies etc.
* Use bridging headers to bring C/C++ SDKs into Swift.
* Good practice is to wrap C/C++ SDKs in a Swift wrapper to increase the readability and reusability of your code.

### Accessing low-level hardware registers

[Swift MMIO](https://github.com/apple/swift-mmio) is a library that provides APIs for safe, structured, and ergonomic 
operations on memory mapped registers.

## HomeKit/Matter integration

You can set your embedded device as Matter capable (integration with HomeKit)

* Can integrate directly with the Matter SDK without having to re-write
* Matter is provided as a C++ Api, which plays nicely with Swift interop.

## References

### Online documentation

[Embedded Swift User Manual](https://github.com/apple/swift/blob/main/docs/EmbeddedSwift/UserManual.md)

[Embedded Swift Forums](https://forums.swift.org/c/development/embedded/107)

### Sample Projects

[Sample projects](https://github.com/apple/swift-embedded-examples)

[Swift Matter Examples](https://github.com/apple/swift-matter-examples)

### Libraries

[Swift MMIO](https://github.com/apple/swift-mmio)
