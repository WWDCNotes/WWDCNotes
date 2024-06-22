# Implementing Dark Mode on iOS

Hear from the UIKit engineering team about the principles and concepts that anchor Dark Mode on iOS. Get introduced to the principles of enhancing your app with this new appearance using dynamic colors and images, and add an experience that people are sure to love.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/214", purpose: link, label: "Watch Video (38 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



- As long as we stick with default UIKit we should get much of Dark Mode for free.
- No more static colors: with Xcode 11 Apple is introducing semantic colors like label, secondaryLabel, link, and more. These will change based on the dark/light appearance.
- `UIControls` and pretty much everything in `UIKit` adapts correctly to the current interface (as long as we didn’t override things)
- `UIVisualEffectView` get the same treatments, instead of the static .light, .dark, .ultralight effects now we have dynamic .thin/medium/thick materials.
- We can still use vibrancy as before, and it will look great as before.
- For custom colors we should use the assets catalog, where for each color we can define a default and dark appearance. Same for images.
- For other custom things, we must listen to trait changes:

```swift
override func traitCollectionDidChange(_ previousTraitCollection: UITraitCollection?) { 
	super.traitCollectionDidChange(previousTraitCollection)

	if traitCollection.hasDifferentColorAppearance(comparedTo: previousTraitCollection) {
		// Resolve dynamic colors again 
	}
}
```

- Use glyphs (template images) as much as possible, the work great in both light and dark mode.

More info in [Apple’s HIG][hig].

[hig]: https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/dark-mode/