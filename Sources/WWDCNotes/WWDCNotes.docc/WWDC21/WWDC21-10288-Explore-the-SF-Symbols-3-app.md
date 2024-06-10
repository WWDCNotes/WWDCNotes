# Explore the SF Symbols 3 app

Tour the latest updates to the SF Symbols app — our interactive library for iconography. Learn how you can use the library to design accessible and inclusive apps that look incredible: We’ll take you through changes to the app and symbols search, explore previewing and custom symbol management, and help you integrate symbols into your interface designs. It's recommended you watch "What's new in SF Symbols" from WWDC21 before watching this video.

@Metadata {
   @TitleHeading("WWDC21")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc21/10288", purpose: link, label: "Watch Video (12 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## Overview

- create your own libraries by dragging SF Symbols in your library names in your `Library` section in the sidebar
- you can also select and drag multiple symbols at once
- selecting any symbol will bring up the `information inspector` which:
  - tells us OS availability/deprecation
  - shows its current and previous names
  - previews symbol variants and localization
    - all these variants are automatically handled by the system
    - it's possible to specify a particular localization in Xcode using suffixes like `.ar` (for Arabic) or `.zh` (for Chinese)

- beside the `information inspector` we also have the `rendering inspector`, which allows us to preview each symbols in various rendering (monochrome, hierarchical, palette, multicolor)

## How to create a custom symbol

1. pick one symbol to dupliace
2. `File > Duplicate as Custom Symbol`
3. Export the `.svg` template file and change it in your design app
4. drag the updated `.svg` template into the app and the new symbol will be available

- SF Symbols app now supports copying images of symbols to place in your software
  1. pick your symbol rendering
  2. `Edit > Copy Image` (or press Option-Command-C)
  3. paste in your software

- You can also choose `Edit > Copy Image As...` to control:
  - the format of the copied image (either PNG or SVG format)
  - point size
  - pixel scale
  - these settings above will be preserved until you change them again

- use the `Export Symbol...`  for transferring custom symbols into Xcode
