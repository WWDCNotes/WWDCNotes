# AutoFill everywhere

Discover how to implement AutoFill in your app and help people enter their information into fields easily, privately, and securely. Learn how to help the system to give better suggestions that tailor to your app's functionality: offer smart location suggestions within a navigation app, for example, or provide a private way to input contact information into fields from the QuickType bar.

@Metadata {
   @TitleHeading("WWDC20")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc20/10115", purpose: link, label: "Watch Video (10 min)")

   @Contributors {
      @GitHubUser(Jeehut)
   }
}



- iOS will suggest recent addresses in text fields intelligently, adopt `.textContentType = .fullStreetAddress` on `UITextView` and `UITextField` (works with other types, too)
- Instead of asking for contact access, consider using `CNContactPickerViewController` (needs no access)
- In iOS 14 contact information in the QuickType keyboard is suggested for quick input (no access needed)
- AutoFill comes to macOS Big Sur, too (didn't exist before) – works just like in iOS, supports other password managers
