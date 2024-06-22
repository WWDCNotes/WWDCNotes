# Binary Frameworks in Swift

Xcode 11 now fully supports using and creating binary frameworks in Swift. Find out how to simultaneously support devices and Simulator with the new XCFramework bundle type, how Swift module interfaces work, and how to manage changes to your framework over time.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/416", purpose: link, label: "Watch Video (40 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## XCFramework

- A XCFramework is multiple binary frameworks in one package.

- You can bundle: 
  - a variant of the framework for each target (iPhones, Simulators).
  - a variant of the same framework for different platforms:
  ![][platformImage]

- We can also have variants with different dependencies as well:
![][depImage]

- XCFrameworks support both Swift and “c-based” code.

## How do XCFrameworks work?

Like another binary, but the header is a new Swift Module Interfaces type, which, kind of like the `Package.swift` file for SPM packages, contains information on the required compiler version and a full list of public classes and methods available from within the framework.

## How to create a XCFrameworks

- We have a new setting:
![][buildImage]

- In order to release a binary we need to archive the framework (a.k.a. build in release mode) and the output will be available in the organizer.

- The default path is `/Users/YOURUSERNAME/Library/Developer/Xcode/Archives`

￼
- We can change the output path in Xcode Locations from the preferences window.

- After archiving different frameworks we can create a final `.xcframework` by using the command line:

```shell
xcodebuild-create-xcframework 
  -framework [path] 
  -framework [path] 
  ...
  -framework [path] 
  -output FlightKit.xcframework 
```

[platformImage]: WWDC19-416-platform
[depImage]: WWDC19-416-dep
[buildImage]: WWDC19-416-build