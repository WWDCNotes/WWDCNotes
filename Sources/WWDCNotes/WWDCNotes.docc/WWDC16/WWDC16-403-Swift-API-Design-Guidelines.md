# Swift API Design Guidelines

Swift 3 introduces new API Design Guidelines specifically crafted to the unique character of Swift for clear, concise code. This talk will explore the philosophy behind the Swift API Design Guidelines and their application throughout the Swift Standard Library and the Cocoa and Cocoa Touch APIs. See how this API transformation will affect your Swift code and learn how to ensure a smooth transition to Swift 3. Learn how Swift 3 imports Objective-C APIs and how to expose rich Swift interfaces for existing Objective-C libraries.

@Metadata {
   @TitleHeading("WWDC16")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc16/403", purpose: link, label: "Watch Video (41 min)")

   @Contributors {
      @GitHubUser(antonio081014)
   }
}



## Swift API Design Guidelines

*Clarity*

###  “ed”rule

```swift
x.reverse()           // mutating

let y = x.reversed()  // non-mutating
```

### “ing” rule

```swift
documentDirectory.appendPathComponent(".list")                        // mutating

let documentFile = documentDirectory.appendingPathComponent(".list")  // non-mutating
```

## The Grand Renaming

```swift
extension MyController {
  @objc(handleDrag:forEvent:)
  func handleDrag(sender: UIControl, for event: UIEvent) { }  // handleDrag(sender:for:)
}
 
// Generated Objective-C
@interface MyController ()
- (void)handleDragWithSender:(UIControl *)sender for:(UIEvent *)event;
@end

// After adding @objc(handleDrag:forEvent:)
// Generated Objective-C
@interface MyController ()
- (void)handleDrag:(UIControl *)sender forEvent:(UIEvent *)event;
@end
```

## Mapping Objective-C APIs into Swift

```swift
// Objective-C
typedef NSString * NSCalendarIdentifier NS_EXTENSIBLE_STRING_ENUM; 
NSCalendarIdentifier NSCalendarIdentifierGregorian;

// Generated Swift Interface
struct NSCalendarIdentifier : RawRepresentable {
    init(_ rawValue: String);
    var rawValue: String { get }
    static let gregorian: NSCalendarIdentifier
}
```