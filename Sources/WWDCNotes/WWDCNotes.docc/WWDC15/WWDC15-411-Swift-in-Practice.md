# Swift in Practice

Learn how Swift can help you define away some common pitfalls in app development, allowing your apps to benefit from safer runtime behavior while enjoying strong guarantees provided by Swift at compile-time. Hear about how API availability checking in Swift allows you to easily take advantage of new APIs while guaranteeing safe deployment to earlier OS releases. See how enumerations and protocols can help not only maintain compile-time invariants between your app's code and assets but also reduce boilerplate.

@Metadata {
   @TitleHeading("WWDC15")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc15/411", purpose: link, label: "Watch Video (38 min)")

   @Contributors {
      @GitHubUser(antonio081014)
   }
}



## Take advantage of new APIs while deploying to older OS releases

__Problem__: Users on different OS releases

__Solution__: Adopt new features and support the older OS releases
- Always use the __Latest SDK__ to access complete set of APIs
- Use Deployment Target to set an application's minimum supported OS release

- Manually check Framework, Class, etc.
  - Framework: manually check framework as optional
  - Class: manually check if a method/function available.

- Compile-Time API Availability Checking.

## Enforce expected application behavior using enums and protocols

### Use Case: Asset Catalog Identifiers

```swift
extension UIImage {
    enum AssetIdentifier: String {
        case isabella = "Isabella"
        case william = "William"
        case Olivia = "Olivia"
    }
    
    convenience init!(assertIdentifier: AssetIdentifier) {
        self.init(named: assertIdentifier.rawValue)
    }
}
```

- Centrally located constants
- Doesn't pollute global namespace
- Must use one of the enum cases
- Image initialization are not failable

### Use Case: Segue Identifiers

```swift
class ViewController: UIViewController {
    enum SegueIdentifier: String {
        case ShowImportUnicorn = "ShowImportUnicorn"
        case ShowCreateNewUnicore = "Show CreateNewUnicorn"
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        guard let identifier = segue.identifier, segueIdentifier = SegueIdentifier(rawValue: identifier)
        else { fatalError("Invalid segue identifier \(segue.identifier).")}
        
        switch segueIdentifier {
            case .ShowImportUnicorn:    // Config...
            case .ShowCreateUnicor:     // Config...
        }
    }
}
```

When new case added to enum, then the compiler will tell us switch is not exhausted.

```swift
class ViewController: UIViewController {
    func performSegueWithIdentifier(segueIdentifier: SegueIdentifier, sender: AnyObject?) {
        performSegueWithIdentifier(segueIdentifier.rawValue, sender: sender)
    }
}
```

### To avoid duplicate all of the smart solution showed above, use `Protocol`

```swift
protocol SegueHandlerType {
    typealias SegueIdentifier: RawRepresentable
}

// Shared Implementation.
extension SegueHandlerType where Self: UIViewController, SegueIdentifier.RawValue == String {
    func segueIdentifier(for segue: UIStoryboardSegue) -> SegueIdentifier {
        guard let identifier = segue.identifier,
            let segueIdentifier = SegueIdentifier(rawValue: identifier)
        else { fatalError("Unknown segue: \(segue))") }
        return segueIdentifier
    }
    
    func performSegueWithIdentifier(segueIdentifier: SegueIdentifier, sender: AnyObject?) {
        performSegueWithIdentifier(segueIdentifier.rawValue, sender: sender)
    }
}

class ViewController: UIViewController, SegueHandlerType {
    enum SegueIdentifier: String {
    // ...
    }
}
```