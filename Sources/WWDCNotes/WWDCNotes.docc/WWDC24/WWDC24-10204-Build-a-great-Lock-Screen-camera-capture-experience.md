# Build a great Lock Screen camera capture experience

Find out how the LockedCameraCapture API can help you bring your capture application’s most useful information directly to the Lock Screen. Examine the API’s features and functionality, learn how to get started creating a capture extension, and find out how that extension behaves when the device is locked.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10204", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(RamitSharma991)
   }
}


## Key Takeaways

✅ enable a quick capture when locked 

🔁 continue key workflows in your app

🔒 provides locked privacy and security 


# Great capture experience (iOS Camera App)

In iOS 18, the new `LockedCameraCapture` framework allows users to access the camera directly from the Lock Screen on both iPhone and iPad. This framework provides the tools to create a seamless camera capture experience without unlocking the device. A key feature of this framework is the introduction of the Locked Camera Capture Extension, essential for building this functionality.

- Quick and easy access.
- Immediate camera viewfinder.
- Uses hardware buttons to capture.
- Session limited access to captures.
- Deeper interactions require unlock.
- For such an experience we can create a new type of app extension, the Locked Camera Capture Extension.

An app extension is a separate target embedded in your app, extending custom functionality and content beyond the app itself. The new Lock Screen app extension allows users to quickly snap photos or record videos using your app's familiar UI, even when the device is locked.


# Lifecycle of a capture extension

-   **Launch Points**: Extension can be launched from the control center, action button, or Lock Screen.
-   **Capture UI**: Uses familiar UI from your app for capturing photos and videos.
-   **Storage Options**: Captured content can be saved directly to the Photo library or a specified directory on the file system.
-   **Extended Functionality**: For advanced interactions like sharing or filtering, the extension can request to open the parent app, which authenticates the user.
-   **Seamless Transition**: Allows a smooth transition from the extension to the app, maintaining user context.
-   **Content Integration**: Once dismissed, the system moves captured content to an accessible location for the parent app to integrate and use.

# Running on a locked device(Restrictions)

-   **Privacy Assurance**: iOS ensures contacts, emails, photos, and more are secure behind the Lock Screen.
-   **Security Focus**: The LockedCameraCapture framework prioritizes security and privacy for content capture from the Lock Screen.
-   **Capture Viewfinder**: Extensions must display the camera viewfinder immediately upon launch, or they will be terminated by the system.
-   **Hardware Button Use**: Extensions must handle events from the system hardware buttons using `AVCaptureEventInteraction` for quick capture.
-   **Restricted Access**: While the device is locked, capture extensions cannot use network resources, access shared group containers, or shared application preferences.

# Capturing from the Lock Screen

-   **Data Persistence**: Use PhotoKit to save photo and video assets captured from your extension.
-   **Locked Device**: PhotoKit allows saving to the photo library even when the device is locked.
-   **Privacy Protection**: On a locked device, only photos and videos from the current capture session can be read.
-   **Unlocked Device**: With proper permissions, all accessible photos and videos can be read.
-   **Granular Permissions**: PhotoKit supports write-only access and limited library access, inheriting permissions from your app. Additional permissions can be requested by transitioning to the app.

> - *For more information on how to build a Control to launch your capture experience*: [Creating your own Controls](https://developer.apple.com/wwdc24/10157)
> - *For more information on working with AppIntents, you can watch* [Bring your app’s core features to users with App Intents](https://developer.apple.com/wwdc24/10210)

# Running on a locked device
LockedCameraCapture framework supports saving capture data within your extension using a session-provided content directory. This directory is for storing photos, videos, and other necessary data during a capture session.

-   **Session Content Directory**: Extensions receive a content path to write data during a capture session. Data should be stored only in this directory, as the extension’s container is erased upon dismissal.
-   **Data Migration**: When the extension is dismissed, the session content directory is moved to the application’s container, preserving data security and user privacy.
-   **PhotoKit Integration**: Captured content can be added directly to the photo library using PhotoKit. Extensions inherit Photos permissions from the app and can request additional permissions if needed.
-   **Session Management**: Each new launch of the extension receives a new session content directory. Extensions must manage data appropriately, ensuring all necessary data is written to the session directory for migration.
-   **Runtime Handling**: The application retrieves and integrates captured content from session directories, which can then be invalidated to signal safe erasure from the file system.
-   **Template and UI**: Xcode offers a template for the Locked Camera Capture Extension, including a camera viewfinder and shutter button. The extension should mirror the app's capture experience with a consistent UI.
-   **Permissions and Data Management**: The extension inherits Camera and Photos permissions from the app. If permissions are insufficient, the device prompts for unlock and launches the app. Data for captured photos and videos can be persisted in the extension's directory or directly to PhotoKit.    
-   **Session Handling**: The extension can read and write data during a capture session. When finished, data can be erased with `invalidateSessionContent`. For actions requiring network access, like sharing, the extension can request to open the app after device unlock.
-   **Launch Controls**: Your extension can be launched from a control in Control Center, action button, or Lock Screen, created using a widget extension built with WidgetKit.
-   **CameraCaptureIntent**: Implement the new CameraCaptureIntent in iOS 18 to launch your capture extension or app, depending on the device's state. Include this intent in your widget extension, capture extension, and application.
-   **App Context**: The CameraCaptureIntent defines an app context shared between your app and extension for storing user preferences and settings. Update the app context with the `updateAppContext` function, being mindful of its limited size to ensure proper behavior.
-   **Widget Extension**: Add a widget extension to your app and define a custom control.
-   **Camera Capture Intent**: Implement and include a camera capture intent in your control, app, and extension targets.
-   **Privacy Descriptions**: Ensure both your extension and application include privacy usage descriptions for the Camera to inform users about the camera's usage for capturing photos and videos.


# Working with captures in your app

-   **Action Privileges**: For actions requiring privileges beyond the capture extension, such as posting photos to social networks or accessing shared resources, use the `openApplication` function on `LockedCameraCaptureSession`.
-   **NSUserActivity**: The `openApplication` function takes an `NSUserActivity` parameter, specifically using `NSUserActivityType LockedCameraCapture` to signal your app was launched from the capture extension. This prompts device unlock and seamlessly transitions the user to your app.
-   **Content Management**: Use `LockedCameraCaptureManager` to handle captured content, with properties like `sessionContentURLs` for directory URLs and an `AsyncSequence` for session content updates. Process content asynchronously and call `invalidate` on handled session contents to delete them, noting this also triggers a session content update.
