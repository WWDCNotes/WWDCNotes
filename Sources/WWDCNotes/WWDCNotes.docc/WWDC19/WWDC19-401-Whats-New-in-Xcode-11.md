# What's New in Xcode 11

Start the week with a tour of new features in Xcode 11, designed to help you get from idea to product faster than ever. Discover new ways to edit and organize your source code, new capabilities for designing and previewing user interfaces, and great improvements for debugging and testing. Get an overview for sessions covering developer tools this year.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/401", purpose: link, label: "Watch Video (33 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## Assistant Editor

The assistant editor has become smarter:  
it will automatically show up when there’s a second related view (like the live preview in SwiftUI), and will automatically disappear when there’s nothing to show.

![][editorImage]

By clicking the button above, we can set a preference: 

- only editor (main screen), 
- editor and canvas (live preview), 
- editor and assistant (anything related to main screen, like a generated file interface)

## Editor Splitting

![][splitImage]

Each editor is his own “window” instance, which means that we can have a separate settings for the assistant editor, or add more editors regardless of the other editors active at the same time.

Tap the button while holding the option key to add a new editor at the bottom of the current editor instead of the side.

## Destination Chooser

In the Project Navigator, select any file while holding option and shift. 

This will automatically highlight the current editor but by using the arrow keys I can choose a different editor or even create a new one at the position that I want.

## Focus Mode

![][focusImage]

If we need to focus temporarily on one editor in our window, instead of closing all the other open editors or create a new window, we have a new focus button at the top left of each editor that will let us do just that.

Tap the same button again to _unfocus_.

## Change Bar Improvements

Xcode 10 introduces change bars, which highlight uncommitted changes. In Xcode 11, by clicking on a change bar we can choose an option to display a diff between the old (committed) code and the current (uncommitted) code.

Now we have thumbnail icon when selecting image asset in storyboard. Took ages for us to get this but in the end it is coming!

## Assets Catalog

We can add a dark appearance for all catalog assets (images and color), we can add localization for all assets as well

## Environment Overrides

Changing accessibility settings and dark mode on the simulator got much easier via the new environment overrides

![][envImage]

## Faster Simulator

- Now simulator can use Metal to render we don’t have to struggle with stutter scrolling.
- Watch target, we can deploy an app only on the watch, no need iPhone companion as before
- 2x faster warm boot
- Up to 90% less cpu use

Simulator condition! Like Network link conditioner and Temperature simulation. This can be configured inside xcode. This work both for Simulator and real device.

Recommended to watch if you want to get the most out of xcode.

[editorImage]: WWDC19-401-editor
[splitImage]: WWDC19-401-split
[focusImage]: WWDC19-401-focus
[envImage]: WWDC19-401-env