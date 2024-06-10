# AUv3 Extensions User Presets

Audio Unit app extensions gives users a convenient way to create or modify audio in any iOS or macOS app that uses sound, including music production apps such as GarageBand or Logic Pro X. And now, with iOS 13, you can store user presets for your extensions that are accessible across applications.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/509", purpose: link, label: "Watch Video (5 min)")

   @Contributors {
      @GitHubUser(Blackjacx)
   }
}



- **Presets** fine-tunes set of parameter values
- **Capture Snapshot** of state of Audio Unit's parameters
- Loading preset restores Audio Unit to same state
- `AUAudioUnit.factoryPresets` built into the unit by manufacturer. Immutable.
- `AUAudioUnit.userPresets` are new and are created by user. Mutable. Unit exposes them to all host applications.
- `supportsUserPreset: Bool` used to verify support by the host
- `saveUserPreset(_:)` & `deleteUserPreset(_:)`
- `presetState(for:) throws -> [String : Any]` to get state.
- `isLoadedInProcess: Bool` is a macOS only feature
- Methods above have default implementations. Can be overridden.
