# Contributing

This project is a community effort and your help is needed!
All you need is Xcode and some time to watch a WWDC session video.

@Metadata {
   @TitleHeading("Guide")
   @PageKind(article)
   @CallToAction(url: "https://github.com/WWDCNotes/WWDCNotes", purpose: link, label: "GitHub Repository")
}

## Overview

This detailed guide explains everything you need to know to contribute to the WWDC Notes project. Anyone with a Mac can help, your experience level doesn't matter. Our goal is to cover 100% of all WWDC sessions with notes to save developers time. We can't reach that goal without your help!


### Getting Started

Creating notes for a WWDC session is as simple as writing some basic [Markdown](https://www.markdownguide.org/basic-syntax/), a super simple text format. Markdown allows you to easily create titles, lists and code blocks. And Xcode will show you a live preview of how things will look on the website, which also means you get live feedback about broken links to images if you misspelled the file name.

WWDC Notes is using [Swift-DocC](https://www.swift.org/documentation/docc/), Apples own Markdown documentation renderer, to generate this website. Here are Apples official short guides to get you started:

1. [Basic Markdown Formatting](https://www.swift.org/documentation/docc/formatting-your-documentation-content)
2. [Adding Tables of Data](https://www.swift.org/documentation/docc/adding-tables-of-data)
3. [Adding Boxes for Notes, Warnings, etc.](https://www.swift.org/documentation/docc/other-formatting-options)
4. [Adding Images (with support for Dark Mode)](https://www.swift.org/documentation/docc/adding-images)

Here are some additional notes

### Structure & Length of Notes 

Other than the technical requirements outlined above (which are a result of using DocC), there are no strict rules as to how notes should be taken and structured. Everyone learns differently, and everyone prioritizes things differently. So you should really just ask yourself what kind of note would you personally find most useful for this specific session, and just write that.

While you could look into some of the existing notes to get inspired, please note that sessions are very different by their very nature. Some sessions are overview sessions covering many topics & APIs without going very deep. Other sessions are deep dives and you might actually skip a specific section while watching the video because that aspect is not relevant for you. (In that case, please document the skipped parts in the note so others can fill the gaps.) Some sessions aren't even targeted to developers only, but cover more general things like design or privacy considerations. And some sessions even are practical code-alongs.

There is not **one** structure or length that makes sense for all notes. So don't feel like you have to follow a specific note taking style or stop after a specific length. Just do what you think would provide most benefits to yourself when reading your notes a few months later, that's probably also the best you can contribute for other people. This project is about creating **useful** notes. For most topics being short and concise is probably more useful than being overly detailed. But there might be exceptions even for that.

### Guidelines

Having this said, there are a few guidelines that make sure we we are hosting _notes_:

- While quoting of individual phrases is fine, don't quote entire blocks of text. We don't want to copy the session scripts. 
- While taking individual screenshots of the sessions is fine to visualize concepts, avoid creating a picture book.
- While a personal opinion can help put things into perspective sometimes, stay close to what was actually presented.
- Avoid large files, such as high-res PNG images. Prefer JPEG/WebP format and resolutions up to 1600 pixels.

> Tip: You can batch-convert images to JPEG (large) via the [Quick Actions menu in Finder](https://support.apple.com/en-us/guide/mac-help/mchl97ff9142/mac).

TODO: complete article
