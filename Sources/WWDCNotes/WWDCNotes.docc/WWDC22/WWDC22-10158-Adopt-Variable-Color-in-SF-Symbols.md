# Adopt Variable Color in SF Symbols

Explore how you can use Variable Color to make SF Symbols even more expressive. We’ll show you how system-provided symbols use variable color and provide best practices and guidance for using it effectively. We’ll also help you learn how to incorporate variable color into custom symbols using the SF Symbols app and its annotation tools.

@Metadata {
   @TitleHeading("WWDC22")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc22/10158", purpose: link, label: "Watch Video (17 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## Variable Color

| ![][gif1] | ![][gif2] | ![][gif3] |

- new SF Symbols feature
- allows you to affect the appearance of a symbol using a percentage value
- by changing this value, you can create symbols that reflect values that can change over time
- can be previewed in the SF Symbols.app
- all rendering modes support it
- not all symbols support it
- custom symbols support

Thresholds:

- the various states/layers of each symbol are evenly spaced out between 0 and 100 percent
- 0% is a special case where no layers will be active
- anything above 0% will have at least the first layer active

[gif1]: speaker.gif
[gif2]: mic.gif
[gif3]: text.gif