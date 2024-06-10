# HLS Authoring for AirPlay 2 Video

AirPlay 2 Video lets you share video from Apple devices to popular smart TVs. Learn about the special considerations for seamless delivery of high quality video to these TVs, and how to utilize the validation tools to ensure your content is ready for primetime.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/507", purpose: link, label: "Watch Video (6 min)")

   @Contributors {
      @GitHubUser(Blackjacx)
   }
}



- AirPlay directly built into TVs
- **Video Requirements**
  - sync variants
  - avoid changes at discontinuities
  - full range of variants for each codec
  - 10% partial encryption
  - provide compatible format: HDR content with only HDR formats, WebVTT for subtitles, use recommended MIME types

- **Changes to Validation**
  - HLS validation by `mediastreamvalidator` & `hlsreport.py`
  - always use both validation tools
  - HLSReport now checks all rule-sets by default