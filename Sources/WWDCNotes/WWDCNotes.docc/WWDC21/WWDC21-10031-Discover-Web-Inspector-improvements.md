# Discover Web Inspector improvements

Web Inspector provides the tools for you to understand and debug your web pages on macOS, iOS, and iPadOS. We’ll take you through the latest features and improvements to Web Inspector, including a new overlay for inspecting CSS Grid containers on your pages, even more configurable breakpoints to make debugging simpler, and the ability to create and edit Audits.

@Metadata {
   @TitleHeading("WWDC21")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc21/10031", purpose: link, label: "Watch Video (28 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



- new three-panel Web Inspector layout (for example to simultaneously show the DOM tree, style, and the new layout tab)

## Grid overlays

- new in Web Inspector
- click any grid badge on your website DOM tree to show a new grid overlay on top of the existing content
- new Web Inspector Layout panel, with options/customization for the Web Inspector grid overlay
- available on iOS/iPadOS 15 when inspecting remotely from a mac

## Breakpoint enhancements

Five different breakpoints:

- Debugger breakpoints - for statements, exceptions, and assertions
- JavaScript breakpoints
- Event breakpoints - for events like click, timeouts, intervals
- DOM breakpoints - triggered when actions related to a DOM node occur
- URL breakpoints - triggered when a network request is about to be made for a URL via APIs such as XMLHttpRequest or Fetch

Enhancements:

- conditions and actions expressions now support Web Inspector’s Console tab API
- action types that support JavaScript expressions can be set to emulate a user gesture
- all JavaScript breakpoint options are now available to all other breakpoint kinds

## Audit authoring

What is Audit authoring?

- each test in the Audit tab is written in JavaScript and is run against the inspected web page
- These tests can check for incorrect DOM structure, help enforce design system rules, or help make sure you haven’t missed accessibility attributes
- usually tests are written else where and imported/exported in Web Inspector

Enhancements:

- new Audit edit mode - ability to create and edit your tests in Web Inspector
- the default Demo Audit and Accessibility tests cannot be edited (but can be cloned and then edited)
