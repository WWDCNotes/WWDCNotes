# What’s new in privacy

At Apple, we believe privacy is a fundamental human right. Learn about new and improved permission flows and other features that manage data in a privacy-preserving way, so that you can focus on creating great app experiences.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10123", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(adamwalz)
   }
}

## Key takeaways

⛏️ New pickers for FinanceKit, Image Playground, and AccessorySetupKit

↻ Periodically rotating MAC addresses

☝️ Sharing of indididual contacts and bluetooth / network accessories

🙈 Hidden folders and Face ID protected apps

## Privacy Pillars

1. Data minimization. Only collecting the minimum ammount of data that is required to power a feature
2. On-device processing. Performing computations locally on device and avoiding potential exposures associated with server-side processing
3. Transparency and control. Making it transparent what data about a user is collected and giving the user control over if and how it is used
4. Security protections. Technical guarantees and enforcements for privacy protections

## New Pickers

Pickers allow for sharing just the data the wants in-context without permission prompts. 

New pickers in iOS 18 have been introduced for FinanceKit, Image Playground, and AccessorySetupKit - on top of existing pikers for Contacts, Photos, and Journaling Suggestions.

##### FinanceKit

FinanceKit allows for accessing transaction data and personal finance history from Apple Card, Savings for Card, and Apple Cash. This comes in two picker versions.

1. Transaction picker. Used when your app needs to access specific existing transaction records, but not a complete and updating history. Users can be confident to engage with your feature without worrying about sharing sensitive information.
2. Ongoing access control picker. Allows access to all financial data subsequent to a starting date. This is only the right option when your app needs access to ongoing financial data. Requires the FinanceKit distribution entitlement. Learn more at [Meet FinanceKit](https://wwdcnotes.com/documentation/wwdcnotes/wwdc24-2023-meet-financekit).

##### Image Playground

The Image Playground picker gives your app access to the system-provided, personalized, and on-device image generation capabilities used in the Image Playground app. Only the final image they choose is shared with your app and there is no permission prompt.

##### AccessorySetupKit

Gives your app Bluetooth and Wi-Fi access to relevant accessories without the ability to discover devices that have never been paired to the app. Replaces the previous Bluetooth pairing prompt, the Wi-Fi network join prompt, and the Bluetooth accessory pairing confirmation - which could cause confusion for the user and make the user worry about broad permissions. Forgetting the device removes the accessory and its permissions entirely. Learn more at [Meet AccessorySetupKit](https://wwdcnotes.com/documentation/wwdcnotes/wwdc24-10203-meet-accessorysetupkit).

## Upgraded protections

##### Rotate Wi-Fi Address

Private Wi-Fi addresses now rotate on iOS and macOS. When “Rotate Wi-Fi Address” is on for a network, the MAC address for that network will change approximately every two weeks. Addresses for forgotten networks always rotate after at most 24 hours. If your app uses the Wi-Fi address for network management, rate limiting, or other purposes, consider how your app will work with these settings.

##### Notifications and settings for extensions running on macOS

People are familiar with apps, but they don't always realize that apps can include background components, or that those components might run even when the downloaded app is not open. macOS now provides a system notification when extensions are installed.

Extensions can still be disabled in Login Items & Extensions. Cron is off by default, but can be re-enabled in the Login Items & Extensions settings window. If you have a system extension and give instructions on where to go to enable it, update them to point to General -> Login Items & Extensions. Directory Services plug-in, legacy QuickLook plug-ins, and com.apple.loginitems.plist file are all no longer supported.

## Permission Changes

App Sandbox ensures data access is always expected by restricting access to protected resources. If one app tries to access another app’s container, a prompt is presented to allow or deny to access. Similarly to app containers, group container can now allow access to another app by presenting a permission prompt to the user. To avoid displaying prompts when your own apps need to access your teams container, make sure to declare the entitlement in your Info.plist, format your group identifiers correctly, and use only the appropriate Foundation API, `containerURL (forSecurityApplicationGroupIdentifier:)`, to get the path to your shared container.

## New Platform Capabilities

##### Sharing Contacts

iOS 18 provides more transparency about the information included in contacts, and more control by providing the option to select the contacts that are shared. For apps requesting ongoing access to more than a few contacts the contacts prompt is now shown in two stages. 
1. Asks if contacts should be shared or not
2. Presents the option of providing limited or full access.

iOS 18 automatically presents the new flow when your app requests access to Contacts. 

If your app offers a feature that allows people to search for contacts there is a new way for your app to add contacts incrementally with the **Contact Access Button** which fits within your own UI instead of being a full screen picker.

It should be rare that any app would require full, ongoing access to Contacts. With the Contact Access Button, you can provide the full contact picker experience without requiring full access, and help people feel more confident sharing contacts with your app. Learn more in [Meet the Contact Access Button](https://wwdcnotes.com/documentation/wwdcnotes/wwdc24-10121-meet-the-contact-access-button).

##### Bluetooth and Local Network

**Bluetooth**

People might think that Bluetooth is just used to connect devices, but access to Bluetooth can reveal a lot, including where the device is, and even be able to uniquely identify that device for tracking.

The new prompt clearly visualizes the data that will be made available to your app when permitted. The updated Bluetooth prompt now shows a map that indicates the current location of the device, as well as a sample of associated devices. To help the user, provide a clear usage string explaining how your app will use Bluetooth. iOS 18 shows the updated prompt without the need to adopt any new APIs.

**Local Network with macOS**

When your app attempts to access data from the local network, a prompt is shown. Ensure that your app and its processes only request access in a contextual moment, and that you have defined a clear, descriptive usage string in your info.plist describing exactly how you plan to use the data that your app collects, including the data that local network access provides.

For all apps, if you have the Bonjour Services key in your Info.plist, or the Networking Multicast entitlement, then you must include a local network usage description, or access will be blocked. If your app or its dependencies include Bonjour browsing or advertising, custom multicast, custom broadcast, or unicast connections that rely on the local network, then these changes apply to you. 

##### Hidden folders and Face ID protected apps

Hidden folders on iOS 18 give people a new way to protect sensitive apps and the information inside them. Letting someone lock an app provides that peace of mind while giving people a new way to protect private data such as messages, dating interests, and health information.

iOS 18 also allows people to lock and hide any app, and requiring authentication before access. When your app is locked or hidden, the contents of your app are not accessible without authenticating with Face ID, Touch ID, or passcode first. This includes all entry points, such as tapping on an action from the share sheet. The contents of your app will not appear in other places across the system, like search, or notifications.

##### Automatic passkey upgrades

Passkeys are a standards-based password replacement that are easier to use, far more secure, and resistant to phishing. In iOS 18 and macOS Sequoia, apps can automatically upgrade existing accounts to use passkeys when signing in. See more in [Streamline sign-in with passkey upgrades and credential managers](https://wwdcnotes.com/documentation/wwdcnotes/wwdc24-10125-streamline-signin-with-passkey-upgrades-and-credential-managers)

##### Live Caller ID

Live Caller ID uses private information retrieval using homomorphic encryption to provide caller id without a server learning who’s calling. Homomorphic encryption enables a server to make use of an encrypted value without decrypting it. Open source resources for configuring your server will be available late 2024.
