# Demystify SwiftUI containers

Learn about the capabilities of SwiftUI container views and build a mental model for how subviews are managed by their containers. Leverage new APIs to build your own custom containers, create modifiers to customize container content, and give your containers that extra polish that helps your apps stand out.


@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10146", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(n3twr)
   }
}


# Key Takeaways

- 👩🏼‍🎨 Custom Containers enhance app design and user interaction.
- 🙂 Create more dynamic and user-friendly interfaces.
- 🦄 Use new SwiftUI API to build unique and custom containers.


@Row {
   @Column {
      @Image(source: "WWDC24-10146-Overview1")
   }
   @Column {
      @Image(source: "WWDC24-10146-Overview2")
   }
}
@Row {
   @Column {
      @Image(source: "WWDC24-10146-Overview3")
   }
   @Column {
      @Image(source: "WWDC24-10146-Overview4")
   }
}

# Presenter
Matt Ricketson, SwiftUI Engineer


# Introduction

- SwiftUI container views and their management of subviews.
- Build custom containers using new APIs.
- View Modifiers enhance container content and app appearance.


# Composition

How to compose content within SwiftUI containers:


- Static and dynamic content definition within containers.
- NEW API designed to **support composition of diverse content within a single container**.


**Create your own flexible custom container views**:

- Initialize containers with view builders.
- Transform views with `ForEach(subviewOf:)` (new API)


```swift
ForEach(subviewOf: content) { subview in
    CardView {
        subview
...
```



# Sections

Adding **support for sections** (for better content organization) within custom containers:

- Using `ForEach(sectionOf:)` to create sections (new API)


```swift
ForEach(sectionOf: content) { section in
     DisplayBoardSectionContent {
       section.content
     }
...
```


# Customization

Create **custom modifiers** for container-specific customization.

- Container values and custom view modifiers.
- Use of `ContainerValues` and `Entry` macro.

```swift
extension ContainerValues {
  @Entry var isDisplayBoardCardRejected: Bool = false
}

extension View {
  func displayBoardCardRejected(_ isRejected: Bool) -> some View {
    containerValue(\.isDisplayBoardCardRejected, isRejected)
  }
}
```
