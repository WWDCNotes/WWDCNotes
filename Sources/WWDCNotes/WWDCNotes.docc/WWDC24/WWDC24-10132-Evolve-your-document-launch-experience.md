# Evolve your document launch experience

Make your document-based app stand out, and bring its unique identity into focus with the new document launch experience. Learn how to leverage the new API to customize the first screen people see when they launch your app. Utilize the new system-provided design, and amend it with custom actions, delightful decorative views, and impressive animations.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10132", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(Jeehut)
   }
}

## Design Overview

New design for the launch experience you can adopt, looks like this:


@Image(source: "WWDC24-10132-New-Design")

The header ist customizable, with a background color or image, foreground and background accessory views, and primary and secondary buttons:

@TabNavigator {
   @Tab("Background Color or Image") {
      @Image(source: "WWDC24-10132-Background")
   }
   @Tab("Accessory Views") {
      @Image(source: "WWDC24-10132-Accessories")
   }
   @Tab("Primary Button") {
      @Image(source: "WWDC24-10132-Primary-button")
   }
   @Tab("Secondary Button") {
      @Image(source: "WWDC24-10132-Secondary-button")
   }
}


The big title is the name of the app. The document browser can be found below:

@Image(source: "WWDC24-10132-Document-browser")


## Getting Started

For a SwiftUI app, it's enough to recompile with iOS 18 SDKs. It will automatically use the new style then.

Works also in UIKit if `UIDocumentViewController` is the apps root view controller. No need for `UIDocumentBrowserViewController` anymore, the `UIDocumentViewController` includes one automatically starting in iOS 18.

Instead of this for iOS 17 when using UIKit:

```swift
class DocumentViewController: UIDocumentViewController { ... }

let documentViewController = DocumentViewController()
let browserViewController = UIDocumentBrowserViewController(
    forOpening: [.plainText]
)
window.rootViewController = browserViewController
browserViewController.delegate = self

// MARK: UIDocumentBrowserViewControllerDelegate

func documentBrowser(
    _ browser: UIDocumentBrowserViewController, 
    didPickDocumentsAt documentURLs: [URL]
) {
    guard let url = documentURLs.first else { return }
    documentViewController.document = StoryDocument(fileURL: url)
    browser.present(documentViewController, animated: true)
}
```

You can write this in iOS 18 in UIKit:

```swift
class DocumentViewController: UIDocumentViewController { ... }

let documentViewController = DocumentViewController()
window.rootViewController = documentViewController
```

## Customization

In SwiftUI, you can use the new experience using a `DocumentGroupLaunchScene` like this:

```swift
DocumentGroupLaunchScene {
    NewDocumentButton("Start Writing")
} background: {
    Image(.pinkJungle)
        .resizable()
        .aspectRatio(contentMode: .fill)
}
```

You can add accessory views and position them like so:

```swift
DocumentGroupLaunchScene {
    NewDocumentButton("Start Writing")
} background: {
...
} overlayAccessoryView: { geometry in
    ZStack {
        Image(.robot)
            .position(
                x: geometry.titleViewFrame.minX, 
                y: geometry.titleViewFrame.minY
            )
        Image(.plant)
            .position(
                x: geometry.titleViewFrame.maxX, 
                y: geometry.titleViewFrame.maxY
            )
    }
}
```

In UIKit you can customize using the `launchOptions` property like this:

```swift
class DocumentViewController: UIDocumentViewController {
    override func viewDidLoad() {
        super.viewDidLoad()

        // Update the background
        launchOptions.background.image = UIImage(resource: .pinkJungle)

        // Add foreground accessories
        launchOptions.foregroundAccessoryView = ForegroundAccessoryView()
    }
}
```

Templates are a grat way to speed up the coherence to specific format, layout, or style and are supported. They can be stored on disk or downloaded from the Web.

When presenting a custom picker for your templates in SwiftUI, use a `CheckedContinutation` like so:

```swift
@State private var creationContinuation: CheckedContinuation<StoryDocument?, any Error>?
@State private var isTemplatePickerPresented = false

DocumentGroupLaunchScene {
    NewDocumentButton("Start Writing")
    NewDocumentButton("Choose a Template", for: StoryDocument.self) {
        try await withCheckedThrowingContinuation { continuation in
            self.creationContinuation = continuation
            self.isTemplatePickerPresented = true
        }
    }
    .sheet(isPresented: $isTemplatePickerPresented) {
        TemplatePicker(continuation: $creationContinuation
    }
}
```

Then in you custom picker, you `resume` the continuation like so:

```swift
struct TemplatePicker: View {
    @Binding var creationContinuation: CheckedContinuation<StoryDocument?, any Error>?

    var body: some View {
        Button("Three Act Structure") {
            creationContinuation?.resume(returning: StoryDocument.threeActStructure())
            creationContinuation = nil
        }
    }
}

extension StoryDocument {
    static func threeActStructure() -> Self {
        Self.init(...)
    }
}
```

In UIKit, define an intent:

```swift
extension UIDocument.CreationIntent {
    static let template = UIDocument.CreationIntent("template")
}
```

Then in the document view controller setup, assign the action to the `launchOptions`, assign the browser delegate and read the `activeDocumentCreationIntent` like so:

```swift
launchOptions.secondaryAction = LaunchOptions.createDocumentAction(with: .template) 
launchOptions.browserViewController.delegate = self

// MARK: UIDocumentBrowserViewControllerDelegate

func documentBrowser(
    _ browser: UIDocumentBrowserViewController, 
    didRequestDocumentCreationWithHandler importHandler: @escaping (URL?, ImportMode) -> Void) 
{
    switch browser.activeDocumentCreationIntent {
    case .template: 
        presentTemplatePicker(with: importHandler)
    default:
        let newDocumentURL = // ...
        importHandler(newDocumentURL, .copy)
    }
}
```
