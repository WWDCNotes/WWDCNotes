# What's New in iOS Design

Discover how to update your app’s interface for Dark Mode to create beautiful and accessible apps. And learn how refinements to modal sheets and the new contextual menu UI can help improve usability and lead to more powerful and efficient workflows.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/808", purpose: link, label: "Watch Video (27 min)")

   @Contributors {
      @GitHubUser(Blackjacx)
   }
}



## Dark Mode

- all apps should support Dark Mode
- adopt iOS design system to `maintain familarity`, `provide platform consistency`, `convey clear information hierarchy`
- always use semantic colors like `backgroundColor`, `highlightColor`, ... instead of `red`, `green`, ...
- color hierarchy: Title > Subtitle > Placeholder > Disabled Text
- color hierarchy naming: `background`, `secondaryBackground`, `tertiaryBackground`, `quaternaryBackground`, ...
- `don't just use color inversion` between light/dark mode 
- `avoid alpha values` since it might look broken when different colors overlap
- check colors with `online contrast calculator` should give 4.5...1 or higher
- `layered interfaces` should use drop shadow in light / elevated bg color in dark mode
- all controls are drawn with semantic colors - perfectly blend between light/dark

## Card Style modal presentation style

- default - opt-out by `viewController.modalPresentationStyle = .fullScreen`
- pull-down to dismiss (can be prevented when there is a mandatory decision in the modal)
- **Modals are for switching modes. Don't use them because you like the animation**

## Contextual Menus

- activate by tap & hold
- puts the focus on actions not on the preview (like peek & pop)
- available on any device since it doesn't rely on force touch
- consist on a list of actions and an optional previews
- all actions should be available somewhere else in the UI. Don't rely on the fact that users discover your menu.