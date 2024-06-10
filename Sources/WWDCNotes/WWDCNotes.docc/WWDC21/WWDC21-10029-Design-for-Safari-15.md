# Design for Safari 15

Meet Safari 15: redesigned and ready to help people explore the web. Discover how you can approach designing websites and apps for Safari, and learn how to incorporate the tab bar in your designs. We’ll also take you through features like Live Text and accessibility best practices, explore the latest updates to CSS and Form Controls, and learn how to use the aspect-ratio property in CSS to create incredible websites.

@Metadata {
   @TitleHeading("WWDC21")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc21/10029", purpose: link, label: "Watch Video (33 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## New Safari design

### Toolbar

- new browsing experience where the website content extends to the whole browser window
- the toolbar/interface is on one line, with elements auto showing/hiding
- the toolbar updates the background color based on the current website
  - to provide the toolbar color, add `<meta name="theme-color" content="blue">` in your website header (supports both dark and light mode)
  - you can also define it in a web manifest file
  - if you provide both, the HTML head takes priority
  - if no color is provided, Safari matches the web page background or header background color
  - Safari will adjust the color when it would affect readability or make Safari's UI elements inaccessible
  - can be changed via JavaScript

### Tabs Groups

- new way to organize tabs into group
- syncs across devices
- the toolbar can get easily filled with tabs: 
  - specify a high-res favicon for your website
  - make sure your website content title comes before the website name in the website `<title>` tag

### iOS navigation

- the toolbar a floating pill at the bottom of the screen
- when scrolling it minimizes itself
- similar to iOS's Home Indicator:
  - you can swipe left/right to jump across open websites
  - swipe up to see a grid of all the tabs and to access Tab Groups

- use CSS environment variables to deal with the new toolbar position via `env(safe-area-inset-bottom)`
  - for example `padding-bottom: calc(1rem + env(safe-area-inset-bottom));`
  - there are four environment variables that provide a measurement from the edge of the safe area to the edge of the viewport (`-bottom`, `-top`, `-left`, `-right`)

## What's new in CSS

- `aspect-ratio`
  - new CSS property that allows you to set a preferred aspect ratio for any element
  - if the content exceeds the available space in the preferred aspect ratio, the element grows to be taller
  - use `min-height: 0` to enforce your ratio to be always obeyed (and use `overflow: scroll` for example)

- `flex-gaps`
  - gives you a way to define a minimum space between items to make sure that there’s always a gap in Flexbox containers
  - from Safari 14.1

- and more:
  - Scroll Margin
  - Web Animations on all Pseudo-Elements
  - LCH Color
  - Individual Transform Properties
  - Improved Scroll Snap
  - Predefined Color Spaces
  - Animation of Discrete Properties
  - Additional Logical Properties
  - HWB Color 

## Form controls 

- Updates from Safari 14.1
- support for Date and Time inputs on macOS
- new color picker in iOS/iPadOS
