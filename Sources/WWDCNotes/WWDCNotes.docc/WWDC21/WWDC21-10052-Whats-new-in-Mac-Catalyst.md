# What's new in Mac Catalyst

Discover the latest updates to Mac Catalyst and find out how you can make your app feel even more at home on macOS. Learn about a variety of new and enhanced UIKit APIs that let you customize your Mac Catalyst app to take advantage of behaviors unique to macOS.

@Metadata {
   @TitleHeading("WWDC21")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc21/10052", purpose: link, label: "Watch Video (26 min)")

   @Contributors {
      @GitHubUser(Jeehut)
   }
}



- New: `changesSelectionAsPrimaryAction` for toggle buttons
- New: ToolTips are now available via `UIToolTipInteraction`, works on all views
- `UIControl` gets an extra `.toolTip` for convenience
- `UILabel` receives new `showsExpansionTextWhenTruncated` option
- New `UIApplicationSupportsPrintCommand` in `Info.plist` for adding print menu item
- New `UIResponder` action `printContent` for preparing views for print
- New windows subtitle support via `UIScene` `.subtitle`
- `UIButton` and `UISlider` can now be opted-out for custom resizing
- `UIBehavioralStyle` can be changed via `preferredBehavioralStyle` for Catalyst
- Opting out of window tabbing via `UIApplicationSupportsTabbedSceneCollection`
- New `UIPointerLockState` especially for games to control cursor
- New `UIPointerShape` via `beam(preferredLength:axis:)` will give cursor shapes
- Cursor can be hidden now when necessary by `UIPointerStyle.hidden`
