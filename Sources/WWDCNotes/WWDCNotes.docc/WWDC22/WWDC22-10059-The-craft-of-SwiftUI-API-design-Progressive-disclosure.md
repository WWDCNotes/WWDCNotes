# The craft of SwiftUI API design: Progressive disclosure

Explore progressive disclosure — one of SwiftUI’s core principles — and learn how it influences the design of our APIs. We’ll show you how we use progressive disclosure, discuss how it can support quick iteration and exploration, and help you take advantage of it in your own code.

@Metadata {
   @TitleHeading("WWDC22")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc22/10059", purpose: link, label: "Watch Video (15 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## Progressive disclosure

- designing APIs so that the complexity of the call site grows with the complexity of the use case
- an ideal API is both simple and approachable but also be able to accommodate powerful use cases

## How to design APIS embracing progressive disclosure

- consider common use cases - identify what the simple cases should be.
- provide intelligent defaults - so those common cases can specify only what they need to
- optimize the call site - ensuring every character of your call site has a purpose
- compose, don't enumerate