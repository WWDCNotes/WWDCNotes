# Introducing enterprise APIs for visionOS

Find out how you can use new enterprise APIs for visionOS to create spatial experiences that enhance employee and customer productivity on Apple Vision Pro.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10139", purpose: link, label: "Watch Video (21 min)")

   @Contributors {
      @GitHubUser(halmueller)
   }
}

"Enterprise APIs" is catchall term for 6 new APIs specifically requested by enterprise customers. Far greater level of access to device than visionOS 1.x.

Managed entitlement and license are required. Only available for proprietary in-house or custom apps. visionOS 2.0 and above. Distribute as enterprise app, or through Apple Business Manager. Privacy conscious. Built for your employees, or for employees of your customer.

Enhanced sesnor access: main camera access, spatial barcode/QR code scanning, Passthrough in-screen capture.

Platform control: Apple Neural Engine access, object tracking parameter adjustment, increased performance headroom.

## Main camera access
Can see entire environment around Vision Pro. Gives access to the device's main camera video feed, improved spatial capabilities. 

Example: production line, CV algorithm for anomaly detection, highlight in screen for replacement.

Need `com.apple.developer.arkit.main-camera-access.allow` entitlement, valid enterprise license file.

[Main Camera code sample:](https://developer.apple.com/videos/play/wwdc2024/10139/?time=216)
CameraFrameProvider, ARKitSession. Send camera frame (left or right) to pixelBuffer.

## Passthrough video in-screen capture
Capture's user's entire view: windows, passtrhough background, capture exactly what the user sees. Can stream to other devices.

Requires broadcast upload extension. 
Requires Replay Kit.
Explicit user "start broadcast" button each session.

Need `com.apple.developer.screen-capture.include-passthrough` entitlement. With this, system automatically replaces default black background with actual user background. One-step change, no code sample provided.

## Spatial barcode/QR code scanning
App receives info on type of code, spatial postion, and barcode payload.

`com.apple.developer.arkit.barcode-detection.allow`

[Code sample: 7:48](https://developer.apple.com/videos/play/wwdc2024/10139/?time=468)
New `BarcodeDetectionProvider`. ARKitSession. Your app receives `barcodeDetection.anchorUpdates`.

## Demo: enterprise support center app

Remote worker shares live feed of electronic device they're trying to assemble. Quick link to instructions via QR code, then sharing of full feed to Support Center worker.

## Increased platform control

Neural Engine access: run machine learning tasks through Apple Neural Engine. Without entitlement, apps use CPU and GPU. With it, can also use NPU (Neural Processing Unit). OS chooses which processor will be most efficient, assigns to that.

Need `com.apple.developer.coreml.neural-engine-access` entitlement (+ enterprise cert). Check `MLModel.availableComputeDevices`, switch on `.cpu`, `.gpu`, `.neuralEngine`.

Known Object Tracking new in 2.0. For enterprise apps, parameters are configurable: max number of objects, tracking rates, detection rate. Same baseline compute power, though.

Entitlement: `com.apple.developer.arkit.object-tracking-parameter-adjustment.allow`.

 [Parameters code sample: 15:40](https://developer.apple.com/videos/play/wwdc2024/10139/?time=940).

Increased performance headroom. More CPU power, at cost of higher temperatures, more fan noise, higher energy use. Example: inspection of very complicated 3D render.

Entitlement: `com.apple.developer.app-compute-category`, setting is app-wide. System automatically takes more CPU when needed, dynmaically.

Best practices: environmental safety, try existing APIs, only request what you need.
Ensure employee privacy.

How and where to apply for entitlement: [see this session's resources](https://developer.apple.com/documentation/visionOS/building-spatial-experiences-for-business-apps-with-enterprise-apis). Submit a "Development Only" request.
