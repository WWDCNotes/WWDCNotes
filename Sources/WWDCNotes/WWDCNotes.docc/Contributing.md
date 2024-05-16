# Contributing

This project is a community effort and your help is needed!
All you need is Xcode and some time to watch a WWDC session video.

@Metadata {
   @TitleHeading("Guide")
   @PageKind(article)
   @CallToAction(url: "xcode://clone?repo=https%3A%2F%2Fgithub.com%2FWWDCNotes%2FWWDCNotes", purpose: link, label: "Clone Repo in Xcode")
}

## Overview

This detailed guide explains everything you need to know to contribute to the WWDC Notes project. Anyone with a Mac can help, your experience level doesn't matter. Our goal is to cover 100% of all WWDC sessions with notes to save developers time. We can't reach that goal without your help!


### Introduction

Creating notes for a WWDC session is as simple as writing some basic [Markdown](https://www.markdownguide.org/basic-syntax/), a super simple text format. Markdown allows you to easily create titles, lists and code blocks. And Xcode will show you a live preview of how things will look on the website, which also means you get live feedback about broken links to images if you misspelled the file name.

WWDC Notes is using [Swift-DocC](https://www.swift.org/documentation/docc/), Apples own Markdown documentation renderer, to generate this website. Here are Apples official short guides to get you started:

1. [Basic Markdown Formatting](https://www.swift.org/documentation/docc/formatting-your-documentation-content)
2. [Adding Tables of Data](https://www.swift.org/documentation/docc/adding-tables-of-data)
3. [Adding Boxes for Notes, Warnings, etc.](https://www.swift.org/documentation/docc/other-formatting-options)
4. [Adding Images (with support for Dark Mode)](https://www.swift.org/documentation/docc/adding-images)

Note that while it's possible to provide image variants at different resolutions and even for dark mode, most notes will probably just need a simple singular image. No need to overcomplicate things.


### Getting Started

The **first step** to edit or create notes is to **check out the WWDCNotes Git repository**. The easiest way to do this is to press the "Clone Repo in Xcode" button at the top of this page. Then, just confirm the `main` branch and choose the folder you want to clone it to.

From there, there are two possible paths for you:

1. If you **already know** which session you want to provide notes for, you can simply search for the session title by using `Cmd+Shift+O` in Xcode and open the note. We auto-generate a page for every session, so there should be at least an empty file with stubs.
2. If you're looking for **sessions that have no notes** yet, check out [this page](TODO) which lists all uncovered sessions.

If WWDC week just recently happened (= less than 2 weeks ago), then please additionally look into [this discussion](https://github.com/WWDCNotes/WWDCNotes/discussions/1) to avoid ongoing work in parallel on the same session.


### Image Name & Format

- Please avoid whitespaces in image file names. The web renderer doesn't handle them well.
- Prefix your image file names with the year and number of the session, e.g. `WWDC23-10187`.
- Avoid adding high-res PNG images. Prefer JPEG/WebP and resolutions up to 1600 pixels.

> Tip: You can batch-convert images to JPEG (large) via the [Quick Actions menu in Finder](https://support.apple.com/en-us/guide/mac-help/mchl97ff9142/mac).


### Structure & Length

Besides the technical requirements from using DocC, there are no strict rules for note-taking. Everyone learns and prioritizes differently. Focus on creating notes that you personally find useful for each session.

You can look at existing notes for inspiration, but remember that sessions vary. Some are broad overviews, while others are deep dives into specific topics. If you skip sections of a video because they're not relevant, document that in the notes so others can fill in the gaps.

There isn’t **one** right structure or length for all notes. Don’t feel obliged to follow a specific style or length. Create notes that will be most beneficial to you in the future, as this will likely be helpful to others too. The goal is to make **useful** notes. Generally, concise notes are more helpful than overly detailed ones, but there are exceptions.


### Guidelines

Having this said, there are a few guidelines that make sure that what we are hosting are _notes_:

- While quoting of individual phrases is fine, don't quote entire blocks of text. 
- While taking individual screenshots of the sessions is fine, avoid creating a picture book.
- While a short personal take can help clarify context, stay close to the session in general.


### Live Previews in Xcode

TODO
