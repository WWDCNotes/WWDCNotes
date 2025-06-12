# Elevate the design of your iPad app

Make your app look and feel great on iPadOS. Learn best practices for designing a responsive layout for resizable app windows. Get familiar with window controls and explore the best ways to accommodate them. Discover the building blocks of a great menu bar. And meet the new pointer and its updated effects.

@Metadata {
   @TitleHeading("WWDC25")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2025/208", purpose: link, label: "Watch Video (15 min)")

   @Contributors {
      @GitHubUser(alexkaessner)
   }
}

## Key Takeaways

- 🗂️ Start with Tab bar as navigation
- 🚏 Use Sidebar for complex navigation
- 🚥 Every app gets size handle, window controls, and menu bar
- 📄 Open documents in new windows
- 👆 New pointer highlight effect
- 🙈 Never hide menu items!

@Row {
    @Column {
        @Image(source: "WWDC25-208-Overview1", alt: "Window drag indicator at bottom right of the screen.")
    }
    @Column {
        @Image(source: "WWDC25-208-Overview2", alt: "Expanded window controls at top left of the window.")
    }
}
@Row {
    @Column {
        @Image(source: "WWDC25-208-Overview3", alt: "Pointer hovering a toolbar item.")
    }
    @Column {
        @Image(source: "WWDC25-208-Overview4", alt: "Main menu with an opened edit menu.")
    }
}

## Navigation
Main navigation patterns for iPad:
| Sidebar | Tab bar |
| ------- | ------- |
| Ideal for many subviews or deeply nested content. | Gives content more space.
| e.g. Mail or Music | e.g. App Store

@Image(source: "WWDC25-208-tabbar")

- Sidebar can morph into Tab bar and vice versa
    - Users can choose best fitting navigation
- Sidebar automatically morphs into Tab bar in portrait
    - Also on smaller windows

@Image(source: "WWDC25-208-sidebar")

- Apps without Tab bar collapse columns down
- Make sure layout changes (because of size) are non-destructive

> Tip:
When not sure which navigation is best → start with tab bar.

### Extend content around navigation
- Use as much of display as possible with "scroll edge effect"
    - Especially for floating windows (aka smaller than fullscreen)
- Extend content behind sidebars

## Windows
- Every app that supports multitasking gets handle at bottom right corner

@Image(source: "WWDC25-208-window-controls")

- Every window get window controls on top left
    - Tap extends/enlarges
    - Tab and hold shows menu with layout actions
- Window controls placed in leading edge of toolbar
    - Existing controls get shifted

@Image(source: "WWDC25-208-window-controls-compatibility")

- Apps not updated for iPadOS 26 get window controls in top safe area
    - Safe area is increased for that
    - Should only be used for compatibility

### Opening Documents
New behavior when opening documents from external app (like Files):
- Create new window for each opened document
    - Don't open/replace in same window

@Image(source: "WWDC25-208-dock-menu")

- Doc menu will provide way to see all open windows
    - Like on macOS
- Provide helpful window titles, like document name

## Pointer
- Original pointer was designed to mimic finger
- iPadOS 26 gets new pointer shape

@Image(source: "WWDC25-208-pointer")

- New highlight effect for hovering buttons/controls
    - No more morph and rubber band effect

> Important:
Test your app with pointer for unexpected results.

## The Menu Bar
- Shares core principles with macOS' menu bar
- Revealed by swipe down or moving pointer to top edge of screen
- Every app gets menu bar
- Every menu bar has app menu, default system menus and custom menus of app

### Organize your menu items

@Image(source: "WWDC25-208-menu-bar")

- Populate menu with every action related to menu name
- Order by frequency of use
    - Not alphabetically
- Group related actions in sections
- Move secondary actions into sub-menus, if menu gets too long
- Assign each item a symbol
    - Match symbol how they appear in app
- Assign keyboard shortcuts to each action to most common actions

### Populate the "view" menu
- One of system provided menus
- Tabs are great to include here
- Navigation toggles are great as well
    - Like show/hide sidebar (default action)

### Never hide menus or items
- Don't hide menu items
    - Disable items when inactive
- Don't hide whole menus
    - Disable all menu items inside
- Hiding menu items is disorienting and hard to scan
    - Messes with muscle memory
    - Bad for discoverability of features

> Tip:
More information on [the menu bar in the HIG](https://developer.apple.com/design/human-interface-guidelines/the-menu-bar).
