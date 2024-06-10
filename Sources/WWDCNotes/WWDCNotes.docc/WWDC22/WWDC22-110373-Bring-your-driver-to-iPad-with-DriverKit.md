# Bring your driver to iPad with DriverKit

Discover how you can easily connect Thunderbolt and USB accessories to iPad with DriverKit. We’ll show you how to convert your existing Mac drivers without any code changes, learn how to add real-time audio support with AudioDriverKit, and provide best practices and tips for developing drivers for iPad.

@Metadata {
   @TitleHeading("WWDC22")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc22/110373", purpose: link, label: "Watch Video (18 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## [DriverKit][dk] Overview

- replacement for [IOKit][ik] device drivers
- new way to extend the system that is more reliable and secure, running in userspace (no longer in the kernel)
- these driver extensions, also known as <kbd>dexts</kbd>, are bundled in apps, and you can easily distribute your apps and drivers on the Mac App Store
- support for:
 - Networking 
 - Block Storage
 - Serial
 - Audio
 - USB
 - PCI
 - HID
 - SCSI controllers
 - SCSI Peripherals

## [AudioDriverKit][ak] updates

- register a real-time callback
- get a callback every time an IO operation happens
- use for signal processing

```c++
// Declare a IOOperationHandler block to set on the IOUserAudioDevice.
// The block will be called from a real time context when a i/o operation
// occurs on the IOUserAudioStream buffers for the device.
io_operation = ^kern_return_t(IOUserAudioObjectID in_device,
                IOUserAudioIOOperation in_io_operation,
                uint32_t in_io_buffer_frame_size,
                uint64_t in_sample_time,
                uint64_t in_host_time)
{
  // Add custom code to make modifications to the buffers as necessary
  if (in_io_operation == IOUserAudioIOOperationWriteEnd) {
    ...
  } else if (in_io_operation == IOUserAudioIOOperationBeginRead) {
    ...
  }
  return kIOReturnSuccess;
};
this->SetIOOperationHandler(io_operation);
```

### New entitlement (from macOS 12.1)

- if your base target is earlier, use [`com.apple.developer.driverkit.allow-any-userclient-access`][oldEnt]
- if your base target is macOS 12.1 or later, use `com.apple.developer.driverkit.family.audio`

- use [`com.apple.developer.driverkit.allow-any-userclient-access`][oldEnt] if you want any app to be able to communicate with your driver
- all `com.apple.developer.driverkit.family` entitlements are now public for development: they no longer require you to file a request
  - request for distribution [here](https://developer.apple.com/contact/request/system-extension)

## DriverKit on iPad

- no changes required for existing macOS drivers to be ported to iPad
- USBDriverKit, PCIDriverKit, AudioDriverKit support from iPadOS 16
- requires M1 iPads
- automatic discovery on iPadOS (must use [SystemExtensions][se] framework on macOS)

[dk]: https://developer.apple.com/documentation/driverkit
[ik]: https://developer.apple.com/documentation/iokit
[ak]: https://developer.apple.com/documentation/audiodriverkit
[oldEnt]: https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_developer_driverkit_userclient-access
[se]: https://developer.apple.com/documentation/SystemExtensions