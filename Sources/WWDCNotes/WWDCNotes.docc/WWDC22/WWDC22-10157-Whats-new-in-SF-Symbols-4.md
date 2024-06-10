# What's new in SF Symbols 4

Explore the latest updates to SF Symbols, Apple’s extensive library of iconography designed to integrate seamlessly with San Francisco, the system font for all Apple platforms. Discover the latest additions to the SF Symbols library and new categories in the app. Learn about the new Automatic behavior, which chooses the rendering mode that best highlights what’s unique about the symbol’s characteristics. See how to use the new Variable Color feature to make a symbol more dynamic. We’ll also learn about a more efficient way of annotating symbols with the new unified approach. 

@Metadata {
   @TitleHeading("WWDC22")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc22/10157", purpose: link, label: "Watch Video (17 min)")

   @Contributors {
      @GitHubUser(Jeehut)
   }
}



## New symbols

- great additions to home, like lights, doors, furniture, power outlets
- health symbols, fitness figures available, more currencies, new objects, more localized symbols (right-to-left etc.)
- 700+ new, bringing to 4,000+ symbols overall
- 5 new categories added:
  - Camera & Photos
  - Accessibility
  - Privacy & Security
  - Home
  - Fitness

## Rendering modes

- Reminder of existing
  - Monochrome (single-color)
  - Hierarchical (subtle emphasis, but single color hue)
  - Palette (allow customized color palette, unique look)
  - Multicolor (intrinsic color of the symbol used)

- New default changes from “monochrome” to “preferred” per symbol
  - called “Automatic Rendering”

- Automatic is a good default, but in some context you should specify explicitly for better contrast (e.g. monochrome for very small sizes)

## Variable Color

| ![][gif1] | ![][gif2] | ![][gif3] |

- Layers organized in sequential order
- Some symbols have only some portion included in layers
- Highlight sequence of steps or stages, not depth
- Variable color is opacity-based, works together with colors

## Unified annotations

- Easy annotation for custom symbols
- You define a shape setup, e.g. “frosting”, “cup cake base” here

| ![](https://user-images.githubusercontent.com/6942160/172727010-c769b9eb-aab7-4088-8e1c-617d1de1b7d5.png) | ![](https://user-images.githubusercontent.com/6942160/172727026-e43cd2a6-e257-4897-8084-f00fb632d520.png) |

- allows erasing of parts of the shape to customize shapes, like here

![](https://user-images.githubusercontent.com/6942160/172727088-29b09c94-470a-4f25-803e-c3889b7f1445.png)


[gif1]: WWDC22-10157-speaker
[gif2]: WWDC22-10157-mic
[gif3]: WWDC22-10157-text