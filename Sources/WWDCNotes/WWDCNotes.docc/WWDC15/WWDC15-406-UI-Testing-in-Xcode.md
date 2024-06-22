# UI Testing in Xcode

Xcode 7 introduces new UI testing features fully integrated into the IDE. Learn about the new APIs and how UI testing fits in with existing testing features in Xcode. See how to get started by recording your app, and how to efficiently craft and maintain UI tests.

@Metadata {
   @TitleHeading("WWDC15")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc15/406", purpose: link, label: "Watch Video (49 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## Three classes

- `XCUIApplication`
  - Proxy of the tested application, it launches the app (and kill any pre-existing instances of the app). 
  - You use this to query for XCUI Elements

- `XCUIElement`
  - Proxy for UI elements in the app. They have types (buttons, labels, ...) and identifiers (“new”, “add”, “delete”, ...).
  - You can simulate events (like taps) with these elements.
  - Every query to get a element must resolve to exactly one match (multiple or no matches will cause a failure)

- `XCUIElementQuery`
  - When querying, you can get elements via subscripting, via index, and if you know it’s just a one result, use unique.

## `UIRecorder`

- You can create a test just by hitting the record button, then interact in the app simulator. Every action is recorded and automatically added in the test for you.  

- What you’re validating this way is that the UI elements you’re interacting with exist during the test. 

- If you want to validate the states of different elements (like if a button has been tapped), you need to add more logic in the test yourself.

- You can even set a breakpoint in one test, hit the record button and add interactions to an already existing test.

- After running the tests, you can see the report to actually see each test step by step. You can even get a screenshot of that step in the reporter:
![][screenshotImage]

## Accessibility Inspector

After running this Xcode tool, you can press `⌘ + F7` to visualize in the simulator what element is under the cursor:

![][cursorImage]

[screenshotImage]: WWDC15-406-screenshot
[cursorImage]: WWDC15-406-cursor
