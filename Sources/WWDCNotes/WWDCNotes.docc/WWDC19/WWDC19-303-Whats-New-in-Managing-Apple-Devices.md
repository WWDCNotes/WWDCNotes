# What’s New in Managing Apple Devices

Learn about the latest management enhancements for iOS, macOS, and tvOS and the evolution of management tools over the past year. You'll discover how new MDM features help administrators manage devices more effectively, how new technologies deliver support for centrally managed authorization, and how Apple Business Manager and Apple School Manager have been enhanced to streamline management of your organizations apps, content, and devices.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/303", purpose: link, label: "Watch Video (58 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## Apple School Manager (ASM) & Apple Business Manager (ABM) Update

- From this fall, custom apps will be available to ASM, too.
- Apple Deployment Program is being deprecated.
- Updated restrictions on macOS and iOS.
- On classroom the teacher can force the students devices to go back to the home screen from its device.

## Device Management Update

- tvOS feature parity with the other platforms
- New User Enrollment
- Better balance for BYOD 
- Protects privacy of personal data 
- Secures corporate data
- Separate Apple ID (for work) beside personal Apple ID. This secondary ID is created via ASM and ABM
- Apps have complete separate data for both Apple IDs, Notes and other support this, no idea how it works for 3rd party apps.
- An app managed (via work Apple ID) cannot become un-managed (transferred to the personal Apple ID
- When the enrollment ends, all the data of the work Apple ID is destroyed. There’s no way for the user to get the data because the data is accessed via a private key no longer known for the device user.
- BYOD cannot be wiped out by the business. The only “nuke” option is to stop the enrollment, which will remove all the data/apps of the work Apple ID: personal data is left untouched.
