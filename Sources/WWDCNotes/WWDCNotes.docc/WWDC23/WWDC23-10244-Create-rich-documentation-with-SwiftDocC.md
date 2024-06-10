# Create rich documentation with Swift-DocC

Learn how you can take advantage of the latest features in Swift-DocC to create rich and detailed documentation for your app or framework. We’ll show you how to use the Xcode 15 Documentation Preview editor to efficiently iterate on your existing project’s documentation, and explore expanded authoring capabilities like grid-based layouts, video support, and custom themes.

@Metadata {
   @TitleHeading("WWDC23")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc23/10244", purpose: link, label: "Watch Video (33 min)")

   @Contributors {
      @GitHubUser(mikaelacaron)
   }
}



* Topics organize the different pages of the documentation into logical groups  
* Well organized topic groups make your documentation discoverable and accessible

## Swift extension support

* Document the extension you make to external types.
* Driven by community contributions

## Documentation Preview
* Click Editor Options menu
* Select Assistant
* Click on the jump bar > Select "Documentation Preview"

```swift
/// An extension that faciliates the display of
/// sloths in user interfaces.
public extension Image {
    /// Create an image rom the given sloth.
    ///
    /// Use this initializer to display
    /// an image representation of a given sloth.
    init(_ sloth: Sloth) {
        self.init("\(sloth.power)-sloth")
    }
}
```

![Xcode 15's Documentation Preview, with code on the left that's documented and the rigth is a preview of what that documentation will look like rendered with DocC][Documentation Preview]

[Documentation Preview]: WWDC23-10244-document-preview-editor

## Swift-DocC direcives

![Overview of some of the new directives to customize the look of documentation.][overview]

[overview]: WWDC23-10244-overview

* `@Row` and `@Column`

![Swift Documentation code on the left for a row with two columns, and the right shows the rendered version that row.][Grids]

[Grids]: WWDC23-10244-grids

    * `@Links`
        * `visualStyle`: `list` and `detailedGrid`
    * `@TabNavigator`

* Attach extra metadata to a page
* Extra information that isn't directly rendered on the page

```swift
@Metadata {
    @CallToAction(purpose: link, url: "")
    @PageKind(sampleCode)
}
```

* `article` and `@sampleCode` are the only `@PageKind`s available right now
* `@PageImage` and `@PageColor`

![Updated styles to Swift DocC documentation using PageColor, PageImage, and Links.][New Directives]

[New Directives]: WWDC23-10244-new-directives

* Create custom layouts

## Theming
* You can theme your DocC site using JSON
* Theme customizations are site-wide, not page specific
* Use name: `theme-settings.json` this will live in the Documentation Catalog

![Examples `theme-settings.json` file with custom color and typography.][theme-settings]

[theme-settings]: WWDC23-10244-theme-settings

## Navigation
* Quick navigation, like Xcode's Open quickly
    * Shift + Cmd + O to go to quick navigation when looking at your DocC documentation in Xcode.
    * Click enter to go to that page, or "view more"

![Xcode 15's Quick Navigator. A search bar on top, list of possible results on the left and a preview of the selected result on the right.][Quick Navigation]

[Quick Navigation]: WWDC23-10244-quick-nav
