# Say hello to the new look of app icons

Get an overview of the new app icon appearances for iOS, iPadOS, and macOS, including light and dark tints, and clear options. Learn how to use frostiness and translucency to make your app icon more vibrant, dynamic, and expressive, and find out how to ensure your icon works well with specular highlights.

@Metadata {
   @TitleHeading("WWDC25")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2025/220", purpose: link, label: "Watch Video (11 min)")

   @Contributors {
      @GitHubUser(VictorPuga)
   }
}

## Summary

- Liquid glass material introduces layered translucency, frostiness, and edge highlights for depth and internal glow.
- New appearance modes: light/dark monochrome and two tinted glass options enrich color expression.
- Unified iconography system standardizes grids and corner radii for rounded rectangles and circles across devices.
- Layering, translucency, and simplicity are essential to maximize the new material effects.
- Avoid sharp edges; prefer rounder corners and bolder lines to preserve detail and enhance lighting.

@Row {
  @Column {
    @Image(source: "WWDC25-220-intro.jpeg", alt: "Realistic glass app icons elements in a table")
  }

  @Column {
    @Image(source: "WWDC25-220-outro.jpeg", alt: "Collection of redesigned liquid glass app icons")
  }
}

## Presenters

- Marie Dommenget, Apple Design Team

## Appearance Modes

- Support for light and dark modes with liquid glass effects.
- New translucent modes:
  - Monochrome glass (light and dark variants)
  - Tinted glass with dark foreground tint or light glass-infused color.
- Available on iPhone, iPad, Mac, Apple Watch, and reflected on App Store pages.

@TabNavigator {
  @Tab("Light Mode") {
    @Image(source: "WWDC25-220-light-icons.jpeg", alt: "Collection of app icons displayed in light mode with the new liquid glass material appearance")
  }

  @Tab("Dark Mode") {
    @Image(source: "WWDC25-220-dark-icons.jpeg", alt: "Collection of app icons displayed in dark mode with liquid glass effects")
  }

  @Tab("Monochrome Glass Light") {
    @Image(source: "WWDC25-220-clear-light-icons.jpeg", alt: "App icons in monochrome glass light variant showing translucent layering")
  }

  @Tab("Monochrome Glass Dark") {
    @Image(source: "WWDC25-220-clear-dark-icons.jpeg", alt: "App icons in monochrome glass dark variant with frosted glass appearance")
  }

  @Tab("Tinted Glass Dark") {
    @Image(source: "WWDC25-220-tinted-dark-icons.jpeg", alt: "App icons with tinted glass effect on dark background")
  }

  @Tab("Tinted Glass Light") {
    @Image(source: "WWDC25-220-tinted-light-icons.jpeg", alt: "App icons with tinted glass effect on light background")
  }
}

@Image(source: "WWDC25-220-homescreen-icons.jpeg", alt: "iPhone homescreen displaying app icons with the new liquid glass appearance and material effects")


## Unified Design System

- Previous platform-specific icon designs replaced by a single, consistent language.
- Updated 1024px canvas for rounded rectangles and circles, with simpler, evenly spaced grids and rounder corners.
- macOS icons now use the canvas shape as a mask, automatically fitting artwork and removing irregularities.
- Recommended to redraw icons to fully utilize the new canvas for best results.
- watchOS circular icons use a 1088px canvas aligned with the rounded rectangle grid for visual consistency.

@Image(source: "WWDC25-220-settings-icon.jpeg", alt: "Settings app icon showing the new unified design with liquid glass material")

@Row {
  @Column {
    @Image(source: "WWDC25-220-default-grid.jpeg", alt: "Default icon grid canvas showing 1024px rounded rectangle with simplified grid structure")
  }
  
  @Column {
    @Image(source: "WWDC25-220-watchos-grid.jpeg", alt: "watchOS circular icon grid showing 1088px canvas aligned with rounded rectangle grid")
  }
}

@Row {
  @Column {
    @Image(source: "WWDC25-220-contacts-icon.jpeg", alt: "Contacts app icon demonstrating layering and simplified design with liquid glass effect")
  }
  
  @Column {
    @Image(source: "WWDC25-220-photo-booth-icon.jpeg", alt: "Photo Booth app icon example with new unified icon design system")
  }
}

## Design Principles

### Layering

- Icons consist of one background and multiple foreground layers to add dimensionality.
- Layer stacking enhances richness and depth (e.g., Podcasts icon).

@Row {
  @Column {
    @Image(source: "WWDC25-220-messages-icon.jpeg", alt: "Messages app icon showing layered design with foreground and background elements")
  }
  
  @Column {
    @Image(source: "WWDC25-220-podcasts-icon.jpeg", alt: "Podcasts app icon demonstrating multiple layered elements creating dimensionality and depth")
  }
}

### Illustration Style

- Avoid complex 3D perspectives that compete with material effects.
- Prefer flatter, frontal views that complement translucency and lighting.


@Row {
  @Column {
    @Image(source: "WWDC25-220-chess-icon.jpeg", alt: "Chess app icon with flatter frontal view complementing translucency and material effects")
  }
  
  @Column {
    @Image(source: "WWDC25-220-preview-icon.jpeg", alt: "Preview app icon example with frontal illustration style avoiding complex 3D perspectives")    
  }
}

### Translucency & Blur

- Easy to apply with new materials, adds lightness and multi-layer depth.
- Works well in all modes including transparent backgrounds.


@Row {
  @Column {
    @Image(source: "WWDC25-220-freeform-weather-shortcuts-icons.jpeg", alt: "Freeform, Weather, and Shortcuts app icons demonstrating translucency and blur effects")
  }
  
  @Column {
    @Image(source: "WWDC25-220-weather-icon-modes.jpeg", alt: "Weather app icon in different appearance modes showing translucency applied across variants")
  }
}

### Simplicity

- "Less is more": reduce overlapping layers to let material nuances shine.
- Remove baked-in effects like shadows or bevels from source artwork.
- Example: Photos and Home icons simplified for better glass effect.

@Row {
  @Column {
    @Image(source: "WWDC25-220-photos-icon.jpeg", alt: "Photos app icon simplified for better glass effect without baked-in shadows or effects")
  }
  
  @Column {
    @Image(source: "WWDC25-220-home-icon.jpeg", alt: "Home app icon demonstrating simplified design to enhance liquid glass material appearance")
  }
}

### Details

- Avoid sharp edges and thin lines.
- Use rounder corners and bolder strokes for better light travel and clarity at small sizes (e.g., Settings icon).

@Row {
  @Column {
    @Image(source: "WWDC25-220-settings-corners.jpeg", alt: "Settings icon detail showing rounder corners and bolder strokes for better light travel and clarity")
  }
  
  @Column {
    @Image(source: "WWDC25-220-numbers-corners.jpeg", alt: "Numbers with corner details demonstrating improved stroke weight and rounded edges")
  }
}

## Backgrounds

- Use soft light-to-dark gradients (System Light and Dark) instead of pure white or black.
- Gradients harmonize with lighting direction and enhance contrast.
- Colored backgrounds recommended to improve distinction in dark mode.

@Image(source: "WWDC25-220-mail-icon.jpeg", alt: "Mail app icon with soft gradient background demonstrating light-to-dark gradient technique")

@Row {
  @Column {
    @Image(source: "WWDC25-220-icon-backgrounds.jpeg", alt: "Collection of icon backgrounds showing soft light-to-dark gradients instead of pure colors")
  }
  
  @Column {
    
    @Image(source: "WWDC25-220-icon-tint.jpeg", alt: "Icon tint examples showing colored backgrounds for improved distinction in dark mode")
  }
}

## Resources

- Updated templates for Figma, Sketch, Photoshop, and Illustrator available on Apple Design Resources.
- Companion talk “Make app icons with Icon Composer” recommended for building icons with the new material.
