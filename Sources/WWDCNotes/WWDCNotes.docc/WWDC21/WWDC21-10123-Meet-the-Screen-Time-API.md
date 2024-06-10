# Meet the Screen Time API

Explore the Screen Time API and learn how you can build apps that support customized parental controls — all while putting privacy first. Learn how you can use key features like core restrictions and device activity monitoring to create safe, secure experiences in your app while providing measurable control for parents and guardians.

@Metadata {
   @TitleHeading("WWDC21")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc21/10123", purpose: link, label: "Watch Video (19 min)")

   @Contributors {
      @GitHubUser(Jeehut)
   }
}



- Screen Time allows: monitor time, set limits, share usage with family, limit communication
- API available on iOS & iPadOS (not on Mac this year)
- Guiding Principles of API:
    - Provide modern API for existing restrictions
    - Protect user privacy (e.g. no way to access websites / apps for Apple / 3rd parties)
    - Enable new parental control experiences by 3rd parties

- Manage Settings (Restrictions): Direct access to same restrictions available in Screen Time
    - locking accounts, prevent password change, filter web traffic, shield apps and websites

- Family Controls (Authorization): Drives family policy
- Device Activity (Usage): Giving abilities to run code without launching app
- Manage settings restrictions:
- Family Controls prevents removal & circumvention, privacy preserving tokens for apps & websites
- Device activity "schedules": time windows that call an extension in your app at start & end
- Events: usage monitors that call extension when usage threshold is passed by user
- Terminology: "Guardian" and "Child", see "Homework" demo app code
- New "Family Controls" capability to be added in Xcode
- `AuthorizationCenter.shared.requestAuthorization` to ask for permission
- Guardian will need to authenticate on the child's phone, only works on child phones
- Once user authorized, no sign out of iCloud possible by child
- Subclass of `DeviceActivityMonitor` with overriding `intervalDidStart` and `DidEnd`
- Schedule via `DeviceActivitySchedule(intervalStart:intervalEnd:repeats:)`
- `DeviceActivityCenter().startMonitoring(.daily, during: schedule)` to monitor
- Use `Button.familyActivityPicker` to show app picker (provided by system)
- A lot of more restrictions available, such as media rating
- Use `DeviceActivityEvent` API on the center to react on app time limit events
- Shields (screen that shows restriction reached) can be customized by:
    - Material, Title, Icon, Body, Button 1 & Button 2

- Subclass `ShieldConfigurationProvider` and override `configuration(for:)`
- Returns an object that has exactly all the above mentioned customization possibilities
- Use `ShieldActionHandler` for the primary & secondary buttons to decide  what to do
    - `.close` or `.defer`, use `defer` e.g. when waiting for Guardian action to disable
