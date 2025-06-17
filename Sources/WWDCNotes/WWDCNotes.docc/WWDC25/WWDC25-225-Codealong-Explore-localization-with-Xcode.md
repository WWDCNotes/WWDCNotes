# Code-along: Explore localization with Xcode

Learn how to localize your app into additional languages using Xcode. We’ll walk step-by-step through the process of creating a String Catalog, translating text, and exchanging files with external translators. You’ll learn best practices for providing necessary context to translators and how Xcode can help to provide this information automatically. For larger projects, we’ll also dive into techniques to manage complexity and streamline string management using type-safe Swift code.

@Metadata {
   @TitleHeading("WWDC25")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2025/225", purpose: link, label: "Watch Video (21 min)")
   @CallToAction(url: "https://developer.apple.com/documentation/Xcode/localizing-landmarks", purpose: link, label: "Download code")

   @Contributors {
      @GitHubUser(petermolnar-dev)
   }
}

## Key takeaways
🔎 Easily spot the keys with Assistant.

☑️ Test your app by modifying the scheme language.

🤖 Use AI to generate context aware comments for localization.

📦 Automated bundle detection with `#bundle` macro.

🆕 Swift Symbol generation from manual keys with Swift type safety, and easier maintenance.

## Presenters
* Andreas Neusüß, Localization Xcode Engineer

## Getting Started
### Project files
The code presented in the video is available for download on [the Apple Developer site](https://developer.apple.com/documentation/Xcode/localizing-landmarks). It contains folders named `Start` and `End`, with the respective states.
## Adding String Catalog
From Xcode File menu select `New -> File from Template` or use the `⌘ + N` keyboard shortcut. 
Filter for `String Catalog`, and click on the respective icon. Keep the default `Localizable` filename, but make sure that you are selecting the `Resources` group in the `Group` selector on the bottom of the dialog box. 

Add the file.

The string catalog is empty in the beginning, in order to populate or update it automatically by Xcode, the project needs to be succefully built.
When a project contains a String Catalog, Xcode is automatically populating the localizable strings from the code.

### Add text to the catalog
Most SwiftUI controlls are localizable by default, see the examples below: 
```swift
import SwiftUI

Text("This will be automatically picked up for localization", comment: "Test text for localization auto-generation.")

Button("Cancel") { }
```

The Foundation framework provides a sepcial String initializer, which marks the string for automatical localization. This is can be used when the string is not defined in a SwiftUI element.
```swift
import Foundation

String(localized: "This will also be automatically picked up for localization", comment: "Test text for localization auto-generation, using Foundation framework.")
```

> Tip: When the Assistant pane is opened from the string catalog on the other side, clicking on the keys in the string catalog will jump the assistant pane to the exact line, where the key is defined in the code.

### Using plural

Using number based placeholders, like `%lld items`, where `%lld` value is defined in runtime, might have a need to use different variants of the text depending on the number. To add a variant use the context menu (right click), and select `Vary by Plural`. It will split the text entry into single and plural representation.

### Adding new language
To add new laguage to the project can be done by clicking on the `+` button on the bottom-left corner, and selecting the language.

The new langage will be added below the original English, with the percentage value, which indicates how many keys from all of the keys have been provided translation for that particular language.

### Translation workflow
To create a package that can be shared with translators, use the exporting function under the `Product -> Export Localization` menu. Select the languages that need to be localized. The produced file extension will be `.xcloc`, and it is containig the respective industry recognised `.xliff` files for the translators.

When the translators are ready with the translation, the updated `.xloc` file should be imported to update the string catalog of the app, from the `Product -> Import Localization` menupoint.

An example file in German (`de.xcloc`) is provided in downloadable code samples, to try out the import functionality in the provided sample app.

### Testing the translation
In order to ensure that the localization correctly shows in the app, change the `App Language` settingsd in the 
`Edit Scheme -> Run -> Options tab`, and select the preferred language. Build and run the app to see the reults (without changing the language of your simulator or dev device).

## Translation context
Translators can't see the code, so the content of the comment column should be informative anught to the translators to get the right context. Consider the following 3 things to add to the comment.

There are 2 examples, `Landmarks` which is a text extracted from the tab bar, and `%@ is contained in %@` which is a subtitle, with placeholders for the landmark name and the collection name.

### Add Interface element
Adding the reference to the user interface element type (title, subtitle, etc...) is is the first step.

Key                   | Comment
----------------------|-------------
Landmarks             | Title for `Landmarks` tab
%@ is contained in %@ | Subtitle for a landmark

### Describe surrounding UI
Describing the surrounding user interface elemts (sidebar, list, etc...) adds further clarity.

Key                   | Comment
----------------------|-------------
Landmarks             | Title for `Landmarks` tab shown in the sidebar.
%@ is contained in %@ | Subtitle for a landmark in a list

### Placeholder content
Text with placeholders (starting with %) needs more clarification.

Key                   | Comment
----------------------|-------------
%@ is contained in %@ | Subtitle for a landmark in a list, first variable is name of the landmark, second variable is a collection name.


## Automatic comment generation
Automatic comment generation is new in Xcode 26. By using the built-in LLM of Xcode, it generates the comment for the key, based on the key place in the code. 
The comment generation can be automatically started by right clicking on the string catalog line, and selecting `Generate Comment`.
This AI based comment generation can be automated by toggling on the `Settings-> Editing-> Automatically Generate string catalog comments`.

> Tip: The AI generated comment can be identified in the JSON represetation of the String Catalog by the `"isCommentAutoGenerated" : true` entry, while in the exported `.xliff` XML file the entry has the `from="auto-generated"` tag.

## Managing complexity
### Modularisation
Code can be split into extension, frameworks and Swift Packages in order to modularize the codebase.
By using the `bundle` parameter in the localized text call, the code can locate in runtime the string catalog in the specified bundle. By default it is setup as `.main`, which is always referring to the main app.

```swift
import Foundation

String(localized: "This will also be automatically picked up for localization",
bundle: .main,
comment: "Test text for localization auto-generation, using Foundation framework.")
```

Using the `.module` refers to the current module.

```swift
import Foundation

String(localized: "This will also be automatically picked up for localization",
bundle: .module,
comment: "Test text for localization auto-generation, using Foundation framework.")
```

From Xcode 26 the `#bundle` macro is available, which automatically resolves the current bundle.

```swift
import Foundation

String(localized: "This will also be automatically picked up for localization",
bundle: #bundle,
comment: "Test text for localization auto-generation, using Foundation framework.")
```
### Tables

The default table name is `Localizable`, however, any other table name can be used for our string catalog. In order to keep the reference between ther catalog file and the code, use the `tableName` parameter. For example if the string catalog name is `Discover.xcstring`, the following code will resolve the table name correctly:
```swift
import Foundation
String(localized: "This will also be automatically picked up for localization",
tableName: "Discover",
bundle: #bundle,
comment: "Test text for localization auto-generation, using Foundation framework.")
```

### Generated Swift Symbols
In Xcode 26 when adding keys *manually* to the string catalog, when the `Generate Swift Symbol` is set to true on the Attributes inspector, Xcode automatically generates a `LocalizedStringResource`, (which is available from iOS 16, macOS 13 and watchOS 9), so it can be referenced either a static variable, if there are no placeholders, or as a static function where the parameters aligned with the placeholders.

The `Generate Swift Catalog Symbols` under the Build Setting controls this functionality, and enabled by default with new projects. 

This new feature helps to handle the keys with the Swift type-safety, adding the static variables the the `LocalizedStringResource` struct. That being said, all of the SwiftUI elements and the `Sting` initalizer, which is using the `LocalizedStringResource` can benefit from this technique.

> Note: under the hood Xcode re-generates the `GeneratedStringSymbols_<tableName>.swift` file, each time you update the manual keys with automatic Swift Symbol generation.

The parameter names for the placeholders can be custumized with adding the parameter name label after the `%` sign, in parenthesis, like: `%(landMarkCount)lld landmarks found`.

Given the previous example, the symbols are generated by the following:

Key                   | Comment              | Swift symbol
----------------------|----------------------|------
Landmarks             | Title for `Landmarks` tab shown in the sidebar. | `.landmarks`
%(landmark)@ is contained in %(landmarkCollection)@ | Subtitle for a landmark in a list, first variable is name of the landmark, second variable is a collection name. | `.isContainedIn(landmark: String, landmarkCollection: String)`

Example usage:

```swift
import SwiftUI
import Foundation

Text(.landmarks)
String(localized: .landmarks)
Text(.isContainedIn(landmark: String, landmarkCollection: String))
String(localized: .isContainedIn(landmark: String, landmarkCollection: String))
```

When custom table name is used, like the `Discover.xcstring`, the table name comes first:

```swift
import SwiftUI
import Foundation

Text(.Discover.landmarks)
String(localized: .Discover.landmarks)
```

### Workflow considerations

With the generated symbols there is a new way of tackle the localization. 

Apple recommends to start with extraction from code. In this case the UI code is easier to understand, and also can benefit from the generated comments.

When the codebase grows, referencing symbols can give better organization into frameworks and packages. It is easy to organize the keys into separate tables. The main point here is that the key is (again) separated from the values.

In Xcode 26 the migration from the code extracted entries to the referencing symbols is supported by refactoring, selecting in the context menu: `Refactor -> Convert Strings to Symbols`. It is supported even on multiple rows selection from the string catalog.
