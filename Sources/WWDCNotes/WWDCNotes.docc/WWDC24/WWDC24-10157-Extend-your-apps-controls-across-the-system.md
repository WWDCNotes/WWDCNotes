# Extend your app’s controls across the system

Bring your app’s controls to Control Center, the Lock Screen, and beyond. Learn how you can use WidgetKit to extend your app’s controls to the system experience. We’ll cover how you can to build a control, tailor its appearance, and make it configurable.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10157", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(teacup)
   }
}

## Key takeaways

* Controls provide quick access to an app's key actions in system spaces.
* App Intents are used to handle state updates from Control Center, the Lock Screen and the Action button. 
* Use ValueProviders to synchronise state changes across multiple devices.

## Presenter

* Cliff Panos, System Experience Engineer

## New widget in WidgetKit

Controls are a new widget available on iOS and iPadOS 18 that enable you to extend functionality from your app into Control Center, the Lock Screen and the Action button.

They should be used to handle discrete actions and succinct information ie. turning on a flashlight or deep linking into the Clock app.

## Control types

* Buttons: perform discrete actions ie. launch the app
* Toggles: change a boolean state ie. turn light off

## Control display

A control can include:
* Symbol
* Title
* Tint colour
* Additional values

**Restrictions:**
*Control Center:* you can't rely on the title or value text always being visible since the control can be dynamically displayed at 3 different sizes.
*Lock screen:* value text is never visible.

## Build a control: Add to WidgetBundle

Add the control to the WidgetBundle:

``` @main
struct ProductivityExtensionBundle: WidgetBundle {
    var body: some Widget {
        TimerToggle()
    }
}```

## Build a control: Basic ControlWidget template

Declare and define the control by: 
* conforming to `ControlWidget`
* setting a configuration type such as `StaticControlConfiguration`
* setting the title and state 
* defining the action to be performed and
* adding the symbol image

```struct TimerToggle: ControlWidget {
    var body: some ControlWidgetConfiguration {
        StaticControlConfiguration(
            kind: "com.apple.Productivity.TimerToggle"
        ) {
            ControlWidgetToggle(
                "Work Timer",
                isOn: TimerManager.shared.isRunning,
                action: ToggleTimerIntent()
            ) { _ in
                Image(systemName:
                      "hourglass.bottomhalf.filled")
            }
        }
    }
}```

## Stateful updates

Dynamically change control text and symbols according to control state:

```Label(isOn ? "Running" : "Stopped",
                      systemImage: isOn
                      ? "hourglass"
                      : "hourglass.bottomhalf.filled")```


## Stateful updates

A control's data comes from a shared group container with your iOS app and the state is synchronously fetched.

Control state is updated when:
* An action is performed on the control
    - The reload occurs after the App Intent `perform()` function returns so ensure all updates are made before it returns.
* Your app requests a reload of the control
* A push notification invalidates the control

## App Intents handle the control's state

App intents are the underlying mechanism which controls use to perform their actions:

```struct ToggleTimerIntent: SetValueIntent, LiveActivityIntent {
    static let title: LocalizedStringResource = "Productivity Timer"
    
    @Parameter(title: "Running")
    var value: Bool
    
    func perform() throws -> some IntentResult {
        TimerManager.shared.setTimerRunning(value)
        return .result()
    }
}```

## Updating the control's state from your app

Controls use the same refresh mechanisms as widgets and live activities:

```func timerManager(_ manager: TimerManager,
                  timerDidChange timer: ProductivityTimer) {
    ControlCenter.shared.reloadControls(
        ofKind: "com.apple.Productivity.TimerToggle"
    )
}```

## Sharing state across multiple devices

When sharing state across multiple devices use ValueProvider to fetch the control state asynchronously:

```struct TimerValueProvider: ControlValueProvider {
    
    func currentValue() async throws -> Bool {
        try await TimerManager.shared.fetchRunningState()
    }
    
    let previewValue: Bool = false
}```

Use `ControlPushHandler` to update state changes across devices.

## User-configurable controls

Conform to `AppIntentControlValueProvider` and return a custom struct of the control and its state, then access the state in ControlWidget:

```struct TimerToggle: ControlWidget {
    var body: some ControlWidgetConfiguration {
        AppIntentControlConfiguration(
            kind: "com.apple.Productivity.TimerToggle",
            provider: ConfigurableTimerValueProvider()
        ) { timerState in
            ControlWidgetToggle(
                timerState.timer.name,
                isOn: timerState.isRunning,
                action: ToggleTimerIntent(timer: timerState.timer)
            ) { isOn in
                Label(isOn ? "Running" : "Stopped",
                      systemImage: isOn
                      ? "hourglass"
                      : "hourglass.bottomhalf.filled")
            }
            .tint(.purple)
        }
    }
}```

Use the `.promptsForUserConfiguration()` modifier when the control requires user configuration to work.

## Further configuration options

* Hints can be displayed by the Action button using the `.controlWidgetActionHint` modifier.
* Controls can display a brief status in Control Center after an action is performed using the `.controlWidgetStatus` modifier.
* A control's default name is the name of the app, customise it using the `.displayName` modifier.
