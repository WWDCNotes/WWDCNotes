# Get the most out of Device Hub

Learn how Device Hub can accelerate your development workflows. We’ll take a tour of its features and show you how to diagnose and reproduce issues quickly with devices and simulators.

@Metadata {
   @TitleHeading("WWDC26")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2026/260", purpose: link, label: "Watch Video (17 min)")

   @Contributors {
      @GitHubUser(harrison-heinig)
   }
}

## Key Takeaways

- 📱 Device Hub ships with Xcode 27 for real devices and simulators
- 🎮 Canvas with live display, touch input, and hardware controls
- 🐛 Mirror a physical device onto a simulator to reproduce bugs quickly
- ⌨️ `devicectl` automates device tasks in scripts and CI

## [Introduction](https://developer.apple.com/videos/play/wwdc2026/260?time=0)

- **Device Hub** is a new app in Xcode 27 for working with connected devices and simulators
- Brings device management, interaction, and diagnostics into one place instead of scattering tools across Xcode

## [Device Hub overview](https://developer.apple.com/videos/play/wwdc2026/260?time=64)

@Image(source: "WWDC26-260-DeviceHub")

- Two modes: **compact** and **full window**
- Same workflows whether you are using a physical device or a simulator
- Compact mode keeps a device visible while you work; full window mode exposes the full sidebar and inspector layout

## [Control](https://developer.apple.com/videos/play/wwdc2026/260?time=180)

@Image(source: "WWDC26-260-Control")

- The **canvas** shows a live display of the selected device or simulator
- Send touch input directly from your Mac
- Hardware controls for buttons and other device inputs
- Zoom and **resize mode** for inspecting layout at different sizes
- **Keyboard capture** routes Mac keyboard input to the device

## [Organize](https://developer.apple.com/videos/play/wwdc2026/260?time=279)

- The sidebar lists your full device and simulator inventory
- **Filter**, **sort**, and **group** devices to find what you need quickly
- Open **compact windows** to keep multiple devices visible at once

## [devicectl](https://developer.apple.com/videos/play/wwdc2026/260?time=952)

@Image(source: "WWDC26-260-DeviceCTL")

- **`devicectl`** is the command-line companion to Device Hub
- Manage devices, install apps, and capture diagnostics from Terminal
- Script common workflows and integrate device operations into **CI** pipelines
