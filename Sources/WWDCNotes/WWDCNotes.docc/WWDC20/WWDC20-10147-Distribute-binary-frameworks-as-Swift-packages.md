# Distribute binary frameworks as Swift packages

Discover how you can add third-party frameworks to your app and keep them up to date using Swift packages in Xcode. We’ll show you how to author packages that reference frameworks, explain binary targets and how to specify them in your package manifest file, and demonstrate how to compute checksums so that your clients always get the exact binary you expect.

@Metadata {
   @TitleHeading("WWDC20")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc20/10147", purpose: link, label: "Watch Video (7 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



- Xcode 12/Swift 5.3 adds SPM support for:
  - distribution to closed-source libraries 
  - binary dependencies

## How To Use a Binary Dependency in an App

- Supported only on Apple platforms
- Uses XCFrameworks
- It works exactly as a open source library, you add them in an app in the same way, you add them as a package dependency in the same way. 
- The difference is that, instead, of having the source code in the project navigator, we have an XCFramework (with, headers are still visible.

## How to Crete/Distribute a Binary Framework as a Swift Package

- With Swift 5.3 we have a new `Package` target called `.binaryTarget`, in here we provide the XCFramework module name, an https URL, and a verification checksum:

```swift
// swift-tools-version:5.3

import PackageDescription

let package = Package(
    name: "MyPackage",
    products: [
        .library(name: "MyPackage", targets: ["MyPackage"])
    ],
    dependencies: [
    ],
    targets: [
        .binaryTarget(
            name: "MyPackage",
            url: "https://example.com/MyPackage/MyPackage-1.0.0.xcframework.zip",
            checksum: "6d988a1a27418674b4d7c31732f6d60e60734ceb11a0ce9b54d1871918d9c194"
        )
    ]
)
```

- We use the usual `products` api to vend the binary framework.
- To generate the `checksum` we can use the new `swift package compute-checksum` command:

```swift
swift package compute-checksum MyPackage-1.0.0.xcframework.zip
```

- For more information on how to create a binary, refer to the [`Binary Frameworks In Swift`][19-446] session.

[19-446]: ../../wwdc19/416/
