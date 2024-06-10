# LLDB: Beyond "po"

LLDB is a powerful tool for exploring and debugging your app at runtime. Discover the various ways to display values in your app, how to format custom data types, and how to extend LLDB using your own Python 3 scripts.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/429", purpose: link, label: "Watch Video (20 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## `po`, Print Object Description

- Textual representation of the instance at hand. 
- The runtime system provides a default representation, however we can customize it for any type by conforming to the [`CustomDebugStringConvertible`][customDoc] protocol.
![][tripImage]
- Conforming to this protocol changes only the top level description of that type (not the nested properties)
- `po` is actually an alias to `expression --object-description`

![][poUnderImage]

## `p`, print 

- In `p` we can see that the result of the expression is assigned to a `$Rx` value that later we can use to reference that object in our debugging.

![][pUnderImage]

## `v`, frame variable

- `v` doesn’t compile any code, and has a different syntax than the language that you’re debugging

![][vUnderImage]

## `po` vs. `p` vs. `v`

![][diffImage]

[customDoc]: https://developer.apple.com/documentation/swift/customdebugstringconvertible

[tripImage]: WWDC19-429-trip
[poUnderImage]: WWDC19-429-poUnder
[pUnderImage]: WWDC19-429-pUnder
[vUnderImage]: WWDC19-429-vUnder
[diffImage]: WWDC19-429-diff