# What's New in Testing

Hear about exciting improvements to code coverage, including how you can build your own automation on top of Xcode’s coverage reports. Learn how to dramatically speed up the execution of your tests by leveraging distributed parallel testing, new in Xcode 10.

@Metadata {
   @TitleHeading("WWDC18")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc18/403", purpose: link, label: "Watch Video (30 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## Code Coverage

- Enable code coverage here:
![][covImage]

## Test Ordering

- by default tests are run in alphabetical order, now there's a random order option:
![][randomImage]

## Parallel Testing

- When targeting the Simulator, Xcode will create several clones of the selected simulator and they will run different tests concurrently (Xcode will create/destroy clones by itself, no action necessary from our side). 

- The original simulator is **not** used for testing: it's being used as a template for the clones

### Parallel Testing Tips

- Every clone will run one (test) class, therefore have as small classes as possible. If all your tests are in one class, parallel testing is exactly the same as non parallel testing
- No performance test in parallel, they should be put in their own (test) bundle

[covImage]: WWDC18-403-cov
[randomImage]: WWDC18-403-random