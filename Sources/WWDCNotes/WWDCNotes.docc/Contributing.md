# Contributing

This project is a community effort and your help is needed!
All you need is Xcode and some time to watch a WWDC session video.

@Metadata {
   @TitleHeading("Guide")
   @PageKind(article)
   @CallToAction(url: "xcode://clone?repo=https%3A%2F%2Fgithub.com%2FWWDCNotes%2FWWDCNotes", purpose: link, label: "Clone Repo in Xcode")
}

## Overview

This detailed guide explains everything you need to know to contribute to the WWDC Notes project. Anyone with a Mac can help, your experience level doesn't matter. Our goal is to cover 100% of all WWDC sessions with notes to save developers time. We can't reach that goal without your help, so thank you for contributing!


### Introduction

Creating notes for a WWDC session is as simple as writing some basic [Markdown](https://www.markdownguide.org/basic-syntax/), a super simple text format. Markdown allows you to easily create titles, lists and code blocks. And Xcode will show you a live preview of how things will look on the website, which also means you get live feedback about broken links to images if you misspelled the file name.

WWDC Notes is using [Swift-DocC](https://www.swift.org/documentation/docc/), Apples own Markdown documentation renderer, to generate this website. Here are Apples official short guides to get you started:

1. [Basic Markdown Formatting](https://www.swift.org/documentation/docc/formatting-your-documentation-content)
2. [Adding Tables of Data](https://www.swift.org/documentation/docc/adding-tables-of-data)
3. [Adding Boxes for Notes, Warnings, etc.](https://www.swift.org/documentation/docc/other-formatting-options)
4. [Adding Images (with support for Dark Mode)](https://www.swift.org/documentation/docc/adding-images)

Note that while it's possible to provide image variants at different resolutions and for dark mode, most notes will probably just need a simple singular image. No need to overcomplicate things.


### Useful DocC Directives

You can also use the `@Image` directive of DocC to include images rather than using Markdown:

```Swift
@Image(source: "Name-of-Image-File", alt: "Optional image description.")
```

To place an image side by side with some text (like done in the next section below), you can utilize the `@Row` and `@Column` directives:

```Swift
@Row(numberOfColumns: 3) {
   @Column(size: 2) {
      Some markdown text with full support for:

      - [Links](https://wwdcnotes.com)
      - Lists
      - **Bold text**
      - And more!
   }

   @Column(size: 1) {
      @Image(source: "Contributing-Row-Column-Example")
   }
}
```

Comments can be added with the `@Comment` directive like so:

```Swift
@Comment { This text will not be rendered on the final page. }
```


### Getting Started

The **first step** to edit or create notes is to **check out the WWDCNotes Git repository**. The easiest way to do this is to press the "Clone Repo in Xcode" button at the top of this page. Then, just confirm the `main` branch and choose the folder you want to clone it to.

From there, there are two possible paths for you:

1. If you **already know** which session you want to provide notes for, you can simply search for the session title by using `Cmd+Shift+O` in Xcode and open the note. We auto-generate a page for every session, so there should be at least an empty file with stubs.
2. If you're looking for **sessions that have no notes** yet, check out [this page](doc:MissingNotes) which lists all uncovered sessions.

If the WWDC week just recently happened (= less than 2 weeks ago), then please additionally look into [this discussion](https://github.com/WWDCNotes/WWDCNotes/discussions/1) to avoid ongoing work in parallel on the same session.

@Row(numberOfColumns: 3) {
   @Column(size: 2) {
      Once your note is written, you need to create a Pull Request on GitHub to get your changes onto this website. Detailed Steps:
      
      1. Commit your changes locally in Xcode (see [Apple's Guide](https://developer.apple.com/documentation/xcode/tracking-code-changes-in-a-source-control-repository))
      1. [Fork the WWDCNotes repo](https://github.com/WWDCNotes/WWDCNotes/fork) on GitHub
      1. Add your fork as another remote in Xcode (see image →/↓)
      1. Push your local changes to the fork
      1. Open your forks' GitHub page, navigate to "Pull Requests" and press "New pull request"
      1. Make sure the correct branch is selected in your repo, then press "Create pull request"
      1. Adjust the title to either "Create note '\<Session Title\>'" or "Update note '\<Session Title\>'" and press "Create" 🎉
      
      Now one of the WWDC Notes maintainers will review your note, leave feedback if needed, or directly merge it. Thank you for your help!
   }
   
   @Column(size: 1) {
      @Image(source: "Contributing-Adding-a-Fork")
   }
}

   
### Live Previews in Xcode

To preview a note in Xcode while editing it, you need to open the Assistant Editor. Just hold all three keys left of the space bar on your keyboard (⌃ ⌥ ⌘) and press the ⏎ return key to toggle the Assistant Editor.

@Image(source: "Contributing-Xcode-Live-Preview")

> Tip: Sometimes the Assistant Editor might not refresh or show a blank screen. In those cases, you can quickly close & reopen the Assistant Editor by using the shortcut twie. And make sure that "Documentation Preview" is selected in the Dropdown at the top of the Assistant Editor.


### Image Name & Format

- Place images always in the folder with the same name as the session Markdown file.
- Please avoid whitespaces in image file names. The web renderer doesn't handle them well.
- Prefix your image file names with the year and number of the session, e.g. `WWDC23-10187`.
- Avoid adding high-res PNG images. Prefer JPEG (if possible) and resolutions <= 1600 pixels.

> Tip: Simply (batch-)convert images to JPEG (large) via the [Quick Actions menu in Finder](https://support.apple.com/en-us/guide/mac-help/mchl97ff9142/mac).


### Structure & Length

Besides the technical requirements from using DocC, there are no strict rules for note-taking. Everyone learns and prioritizes differently. Focus on creating notes that you personally find useful for each session.

You can look at existing notes for inspiration, but remember that sessions vary. Some are broad overviews, while others are deep dives into specific topics. If you skip sections of a video because they're not relevant, document that in the notes so others can fill in the gaps.

There isn’t **one** right structure or length for all notes. Don’t feel obliged to follow a specific style or length. Create notes that will be most beneficial to you in the future, as this will likely be helpful to others too. The goal is to make **useful** notes. Generally, concise notes are more helpful than overly detailed ones, but there are exceptions.


### Guidelines

Having this said, there are a few guidelines that make sure that what we are hosting are _notes_:

- While quoting of individual phrases is fine, don't quote entire blocks of text. 
- While taking individual screenshots of the sessions is fine, avoid creating a picture book.
- While a short personal take can help clarify context, stay close to the session in general.


### Key Takeaways

> Note: This step is completely **optional**. If you are short on time, feel free to skip it.

To save developers even more time, we try to provide a "Key Takeaways" section at the very top of every note. The goal is to keep this summary as short as ~250 characters so the takeaways can be posted on X and Mastodon with the session title and a link to the note added. See this [thread on X](https://x.com/Jeehut/status/1667974311724949504) or this [thread on Mastodon](https://iosdev.space/@Jeehut/110527231917189918) for examples of key takeaways of WWDC23.

You can use [this online tool](https://threadcreator.com/tools/twitter-character-counter) to check the length. Don't forget to prepend the session title on an extra line for the check and keep the total characters at 248 (32 chars are reserved for the link).

The takeaways section should not contain any links. It is good practice to provide a fitting Emoji for every point listed. In the best case, the list is followed by 4 images that help summarize the session together with the points listed. Place the images in a grid like so:

```Swift
@Row {
   @Column {
      @Image(source: "WWDC23-101-Overview1")
   }
   @Column {
      @Image(source: "WWDC23-101-Overview2")
   }
}
@Row {
   @Column {
      @Image(source: "WWDC23-101-Overview3")
   }
   @Column {
      @Image(source: "WWDC23-101-Overview4")
   }
}
```


@Small {
   **Legal Notice**

   All content copyright © 2012 – 2024 Apple Inc. All rights reserved.
   Swift, the Swift logo, Swift Playgrounds, Xcode, Instruments, Cocoa Touch, Touch ID, FaceID, iPhone, iPad, Safari, Apple Vision, Apple Watch, App Store, iPadOS, watchOS, visionOS, tvOS, Mac, and macOS are trademarks of Apple Inc., registered in the U.S. and other countries.
   This website is not made by, affiliated with, nor endorsed by Apple.
}
