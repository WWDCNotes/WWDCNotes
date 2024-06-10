# Diagnose unreliable code with test repetitions

Test repetitions can help you debug even the most unreliable code. Discover how you can use the maximum repetitions, until failure, and retry on failure testing modes within test plans, Xcode, and xcodebuild to track down bugs and crashers and make your app more stable for everyone.

@Metadata {
   @TitleHeading("WWDC21")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc21/10296", purpose: link, label: "Watch Video (9 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## Test repetitions

- new in Xcode 13
- allow you to repeat a test up to a specified number of iterations with a stopping condition

Three test repetition modes:

1. Fixed iterations
  - will repeat your tests a fixed number of times regardless of the outcome status
  - great for understanding the reliability of your test suite and helping keep it reliable as new tests are introduced over time

2. Until failure
  - will repeat a test until it fails
  - useful to reproduce a nondeterministic test failure to catch it in the debugger

3. Retry on failure
  - will retry your test until it succeeds up to a specified maximum
  - useful to identify unreliable tests which fail initially but eventually succeed on reattempt

To enable, either:

- specify the mode within a test plan
- control+click on a test diamond in your test file and choose the menu <kbd>Run "test...()" Repeatedly…</kbd>
- on the terminal

```shell
xcodebuild test -project ....xcodeproj -scheme ... -destination '...' -test-iterations 100 -run-tests-until-failure
```

The `xcodebuild` test repetition flags are:

```shell
-test-iterations <number>
-retry-tests-on-failure
-run-tests-until-failure
```