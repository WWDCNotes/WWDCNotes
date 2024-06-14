# Get started with Writing Tools

Learn how Writing Tools help users proofread, rewrite, and transform text in your app. Get the details on how Writing Tools interact with your app so users can refine what they have written in any text view. Understand how text is retrieved and processed, and how to support Writing Tools in custom text views.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10168", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(MortenGregersen)
   }
}

## Key takeaways

📝 Writing Tools helps users proofread, rewrite or transform text

🆓 If you use system text views Writing Tools comes for free

💥 Custom text views can also get Writing Tools

## Presenters

* Dongyuan Liu, Text Input & Internationalization

## Introducing Writing Tools

Helps users proofread, rewrite or transform text in text views in iOS, iPadOS and macOS.

On iOS and iPadOS the tools appear on top of the keyboard when selecting a piece of text and in the callout bar next to cut, copy, and paste.

On macOS the tools are available in the context menu and in the Edit menu.

Also works with non-editable text.

### Transform possibilities

* Summarize
* Key points
* List
* Table

## Native text views

Works with `UITextField`, `NSTextView` and `WKWebView`.

`UITextField` and `NSTextView` has to use TextKit 2 to support the full Writing Tools experience.

There are some new delegate methods for Writing Tools on `UITextView` and `NSTextView`:

```swift
func textViewWritingToolsWillBegin(_ textView: UITextView) {
    // Take necessary steps to prepare. For example, disable iCloud sync.
}

func textViewWritingToolsDidEnd(_ textView: UITextView) {
    // Take necessary steps to recover. For example, reenable iCloud sync.
}

if !textView.isWritingToolsActive {
    // Do work that needs to be avoided when Writing Tools is interacting with text view
    // For example, in the textViewDidChange callback, app may want to avoid certain things
       when Writing Tools is active
}
```

## Controlling behavior

It is possible to opt-out of the Writing Tools experience:

```swift
// Panel experience
textView.writingToolsBehavior = .limited
// Completely opt-out
textView.writingToolsBehavior = .none
```

With `writingToolsAllowedInputOptions` you can specity if your text view supports rich text or tables. By default it assumes that your text view can render plain text and rich text, but not tables.

```swift
textView.writingToolsAllowedInputOptions = [.plainText]
textView.writingToolsAllowedInputOptions = [.plainText, .richText, .table]
```

For `WKWebView`, the `default` behavior is equivalent to `.limited`.

```swift
extension WKWebViewConfiguration {
    @available(iOS 18.0, *)
    open var writingToolsBehavior: UIWritingToolsBehavior { get set }
}

extension WKWebViewConfiguration {
    @available(macOS 15.0, *)
    open var writingToolsBehavior: NSWritingToolsBehavior { get set }
}

extension WKWebView {
    /// @discussion If the Writing Tools behavior on the configuration is `.limited`, this will always be `false`.
    @available(iOS 18.0, macOS 15.0, *)
    open var isWritingToolsActive: Bool { get }
}
```

## Protecting ranges

If you have code blocks or quoted content, you may not want Writing Tools to rewrite those ranges. There are delegate methods on `UITextViewDelegate` and `NSTextViewDelegate` to provide the protected ranges:

```swift
func textView(_ textView: UITextView, writingToolsIgnoredRangesIn
        enclosingRange: NSRange) -> [NSRange] {
    let text = textView.textStorage.attributedSubstring(from: enclosingRange)
    return rangesInappropriateForWritingTools(in: text)
}
```

For `WKWebView` tags like &lt;blockquote&gt; and &lt;pre&gt; will be ignored.

## Custom text views

If you have custom text views other than `UITextView` and `NSTextView` you get the basic experience for free. The rewritten text is shown in the panel and can be copied or applied from there.

### iOS and iPadOS

You get the Writing Tools call out bar or context menu for free, if your custom text view adopts `UITextInteraction`. If you can’t use `UITextInteraction`, you can also adopt `UITextSelectionDisplayInteraction` with `UIEditMenuInteraction`.

The tools rely on yhe `UITextInput` protocol. For text view that don’t use text interactions, a new optional property `isEditable` in `UITextInput` protocol is added. Adopt that to indicate if your text view supports editing.

### macOS

Writing Tools will be shown automatically in the context menu and the Edit menu for custom text views.

Make sure your text view adopts `NSServicesMenuRequestor` to allow the system to read and write contents from/back to the view.

Override `validRequestor(forSendType:returnType:)` in `NSResponder`. Then, as long as a context menu is added to the view, the Writing Tools menu item will be there for free.

```swift
class CustomTextView: NSView, NSServicesMenuRequestor {
    override func validRequestor(forSendType sendType: NSPasteboard.PasteboardType?, 
                                 returnType: NSPasteboard.PasteboardType?) -> Any? {
        if sendType == .string || sendType == .rtf {
            return self
        }
        return super.validRequestor(forSendType: sendType, returnType: returnType)
    }
    
    nonisolated func writeSelection(to pboard: NSPasteboard,
                                    types: [NSPasteboard.PasteboardType]) -> Bool {
        // Write plain text and/or rich text to pasteboard
        return true
    }

    // Implement readSelection(from pboard: NSPasteboard)
       as well for editable view
}
```
