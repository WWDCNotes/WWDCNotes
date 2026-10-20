# Make your UIKit app more flexible

Find out how your UIKit app can become more flexible on iPhone, iPad, Mac, and Apple Vision Pro by using scenes and container view controllers. Learn to unlock your app’s full potential by transitioning from an app-centric to a scene-based lifecycle, including enhanced window resizing and improved multitasking. Explore enhancements to UISplitViewController, such as interactive column resizing and first-class support for inspector columns. And make your views and controls more adaptive by adopting new layout APIs.

@Metadata {
   @TitleHeading("WWDC25")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2025/282", purpose: link, label: "Watch Video (16 min)")

   @Contributors {
      @GitHubUser(davidleee)
   }
}

## Key Takeaways

- 🪟 Adopt the scene life cycle.
- 🧩 Use adaptive split views and tab groups.
- 📐 Respect safe areas and window controls.
- ⚡ Defer costly updates until resizing ends.

## Scenes

A scene is an instance of your app's UI. Each scene has its own life cycle and independently saves and restores UI state. Dedicated scene types encapsulate distinct experiences, such as presenting content on an external display.

- The `UIScene` life cycle will be required in a future release after iOS 26.
- Supporting multiple scenes is encouraged, but is not required.

> Note: Only adopting the scene life cycle is required. For migration guidance, see [Migrating to the UIKit scene-based life cycle](https://developer.apple.com/documentation/technotes/tn3187-migrating-to-the-uikit-scene-based-life-cycle).

@Image(source: "WWDC25-282-Scene-Life-Cycle", alt: "A timer app presents its timer list on iPhone and the active timer on an external display.")

The following example is from an app that can AirPlay the current task to an Apple TV. The app delegate chooses the configuration for a connecting scene. Each configuration is defined in the app's `Info.plist`:

```swift
// Specify the scene configuration.
@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(
        _ application: UIApplication,
        configurationForConnecting sceneSession: UISceneSession,
        options: UIScene.ConnectionOptions
    ) -> UISceneConfiguration {
        if sceneSession.role == .windowExternalDisplayNonInteractive {
            return UISceneConfiguration(
                name: "Timer Scene",
                sessionRole: sceneSession.role
            )
        } else {
            return UISceneConfiguration(
                name: "Main Scene",
                sessionRole: sceneSession.role
            )
        }
    }
}
```

The scene delegate configures the UI, handles life cycle events, and restores state for an individual scene:

```swift
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?
    var timerModel = TimerModel()

    // Configure the UI.
    func scene(
        _ scene: UIScene,
        willConnectTo session: UISceneSession,
        options connectionOptions: UIScene.ConnectionOptions
    ) {
        let windowScene = scene as! UIWindowScene
        let window = UIWindow(windowScene: windowScene)
        window.rootViewController = TimerViewController(model: timerModel)
        window.makeKeyAndVisible()
        self.window = window
    }

    // Handle life cycle events.
    func sceneDidEnterBackground(_ scene: UIScene) {
        timerModel.pause()
    }

    // Restore UI state.
    func stateRestorationActivity(for scene: UIScene) -> NSUserActivity? {
        let userActivity = NSUserActivity(activityType: "com.example.timer.ui-state")
        userActivity.userInfo = ["selectedTimeFormat": timerModel.selectedTimeFormat]
        return userActivity
    }

    func scene(_ scene: UIScene, restoreInteractionStateWith userActivity: NSUserActivity) {
        if let selectedTimeFormat = userActivity.userInfo?["selectedTimeFormat"] as? String {
            timerModel.selectedTimeFormat = selectedTimeFormat
        }
    }
}
```

## Container View Controllers

UIKit's container view controllers are designed to adapt to a wide range of window sizes. Adopting them is the best way to make your app flexible.

### New Features in UISplitViewController

**Interactive column resizing:** Customize the minimum, maximum, and preferred column widths.

```swift
// Customize an existing split view controller.
splitViewController.minimumPrimaryColumnWidth = 200.0
splitViewController.maximumPrimaryColumnWidth = 400.0
splitViewController.preferredSupplementaryColumnWidth = 500.0
```

**Layout environment trait:** Determine whether an ancestor split view controller is expanded or collapsed. For example, only show a disclosure indicator when selecting a cell pushes another screen:

```swift
override func updateConfiguration(using state: UICellConfigurationState) {
    // Configure the cell's content...

    if state.traitCollection.splitViewControllerLayoutEnvironment == .collapsed {
        accessories = [.disclosureIndicator()]
    } else {
        accessories = []
    }
}
```

**First-class inspector columns:** Assign a view controller to the inspector column and show it when needed.

```swift
splitViewController.setViewController(inspectorViewController, for: .inspector)
splitViewController.show(.inspector)
```

### New Features in UITabBarController

Tab groups can surface additional destinations in the sidebar. Assign a managing navigation controller to a group, and use the delegate to customize the view controllers displayed for a selected tab:

```swift
// Configure an existing UITabGroup.
group.managingNavigationController = UINavigationController()

// MARK: - UITabBarControllerDelegate

func tabBarController(
    _ tabBarController: UITabBarController,
    displayedViewControllersFor tab: UITab,
    proposedViewControllers: [UIViewController]
) -> [UIViewController] {
    if tab.identifier == "Library" && !self.allowsSelectingLibraryTab {
        return []
    } else {
        return proposedViewControllers
    }
}
```

For more on tab bars and sidebars, see <doc:WWDC24-10147-Elevate-your-tab-and-sidebar-experience-in-iPadOS>.

### Preferred Minimum Window Size

Although containers support a wide range of sizes, an app may need a minimum size to maintain its core functionality:

```swift
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    func scene(
        _ scene: UIScene,
        willConnectTo session: UISceneSession,
        options connectionOptions: UIScene.ConnectionOptions
    ) {
        let windowScene = scene as! UIWindowScene
        windowScene.sizeRestrictions?.minimumSize.width = 500.0
    }
}
```

## Adaptivity

### Safe Areas and Layout Margins

Keep content within the safe area. A sidebar adds an asymmetrical safe area inset to the adjacent column in a split view controller:

@Image(source: "WWDC25-282-Sidebar-Safe-Area", alt: "A split view sidebar creates an asymmetrical safe area inset in the adjacent column.")

Backgrounds can extend outside the safe area, underneath the sidebar:

@Image(source: "WWDC25-282-Background-Under-Sidebar", alt: "The background extends underneath the sidebar while content remains visible.")

Content, such as a message transcript, stays within the safe area. Inset message bubbles using layout margins to provide consistent spacing and clear separation from the sidebar:

@Image(source: "WWDC25-282-Content-Layout-Margins", alt: "Message bubbles are inset from the safe area edges using layout margins.")

Each view provides layout guides for standard content margins. Layout margins are inset from the safe area by default:

```swift
let contentGuide = containerView.layoutMarginsGuide

NSLayoutConstraint.activate([
    contentView.topAnchor.constraint(equalTo: contentGuide.topAnchor),
    contentView.leadingAnchor.constraint(equalTo: contentGuide.leadingAnchor),
    contentView.bottomAnchor.constraint(equalTo: contentGuide.bottomAnchor),
    contentView.trailingAnchor.constraint(equalTo: contentGuide.trailingAnchor)
])
```

### Window Controls

In iPadOS 26, scenes gain controls to close, minimize, and arrange windows, similar to macOS. A scene can specify a preferred windowing control style to complement its content:

@Image(source: "WWDC25-282-Windowing-Control-Styles", alt: "Windowing control styles for closing, minimizing, and arranging an iPadOS window.")

System components automatically arrange their subviews around the window controls. Custom UI should also adapt, regardless of the control style. Use a layout guide that accounts for the window control area:

```swift
let contentGuide = containerView.layoutGuide(
    for: .margins(cornerAdaptation: .horizontal)
)

NSLayoutConstraint.activate([
    contentView.topAnchor.constraint(equalTo: contentGuide.topAnchor),
    contentView.leadingAnchor.constraint(equalTo: contentGuide.leadingAnchor),
    contentView.bottomAnchor.constraint(equalTo: contentGuide.bottomAnchor),
    contentView.trailingAnchor.constraint(equalTo: contentGuide.trailingAnchor)
])
```

### Interface Orientation Lock

A visible view controller can express a preference to lock the interface orientation. Notify UIKit when that preference changes:

```swift
class RaceViewController: UIViewController {
    override var prefersInterfaceOrientationLocked: Bool {
        return isDriving
    }

    var isDriving: Bool = false {
        didSet {
            if isDriving != oldValue {
                setNeedsUpdateOfPrefersInterfaceOrientationLocked()
            }
        }
    }
}
```

Observe the effective geometry to determine whether the interface orientation is actually locked:

```swift
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var game = Game()

    func windowScene(
        _ windowScene: UIWindowScene,
        didUpdateEffectiveGeometry previousGeometry: UIWindowScene.Geometry
    ) {
        let wasLocked = previousGeometry.isInterfaceOrientationLocked
        let isLocked = windowScene.effectiveGeometry.isInterfaceOrientationLocked

        if wasLocked != isLocked {
            game.pauseIfNeeded(isInterfaceOrientationLocked: isLocked)
        }
    }
}
```

### Expensive Updates During Resizing

For elements that are computationally expensive to draw, query `isInteractivelyResizing` and update assets for the new scene size after the resizing interaction finishes:

```swift
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var gameAssetManager = GameAssetManager()
    var previousSceneSize = CGSize.zero

    func windowScene(
        _ windowScene: UIWindowScene,
        didUpdateEffectiveGeometry previousGeometry: UIWindowScene.Geometry
    ) {
        let geometry = windowScene.effectiveGeometry
        let sceneSize = geometry.coordinateSpace.bounds.size

        if !geometry.isInteractivelyResizing && sceneSize != previousSceneSize {
            previousSceneSize = sceneSize
            gameAssetManager.updateAssets(sceneSize: sceneSize)
        }
    }
}
```

The `UIRequiresFullScreen` Info.plist key is a compatibility mode introduced in iOS 9 that prevents scene resizing. It is deprecated and will be ignored in a future release.

### Future Hardware Compatibility

- Previously, compatibility scaling could accommodate new screen sizes.
- Apps linked against the iOS 26 SDK will not receive this scaling on future hardware, so layouts need to adapt to the available space.

## Next Steps

- Adopt the scene life cycle.
- Use container view controllers.
- Leverage APIs for adaptivity.
