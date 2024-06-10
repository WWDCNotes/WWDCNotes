# Meet TextKit 2

Meet TextKit 2: Apple’s next-generation text engine, redesigned for improved correctness, safety, and performance. Discover how TextKit 2 can help you provide a better text experience for international audiences, create more diverse layouts by mixing text content with visual content, and ensure smooth scrolling performance. We’ll introduce the latest APIs, dive into some practical examples, and provide guidance for modernizing your apps.

@Metadata {
   @TitleHeading("WWDC21")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc21/10061", purpose: link, label: "Watch Video (41 min)")

   @Contributors {
      @GitHubUser(Jeehut)
   }
}



- Text controls in the system are based on TextKit 1
- Started in OpenStep even before first version of Mac OS
- TextKit 2 is built on forward-looking design principles, used on macOS since v11
- TextKit 2 will coexist with TextKit 1 (for now), many new classes added, some updated
- Principles designed by:
    - Correctness: abstract away glyph handling
    - Safety: heavier focus on value semantics
    - Performance: viewport-based layout and rendering

- Glyph: Visual representation of a variable number of characters, e.g. ñ is 2 glyphs
- Ligature: Single glyph representing multiple characters
- Glyph ranges were impossible to use right in many languages, TextKit 2 simplifies it
- In TextKit 2 all text is rendered with CoreText, no glyph ranges needed, higher level objects like `NSTextSelection`, `NSTextSelectionNavigation`
- Contributor comment: *didn't continue watching from here as too low-level/irrelevant for me*
