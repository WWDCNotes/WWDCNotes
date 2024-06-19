# Streamline sign-in with passkey upgrades and credential managers

Learn how to automatically upgrade existing, password-based accounts to use passkeys. We’ll share why and how to improve account security and ease of sign-in, information about new features available for credential manager apps, and how to make your app information shine in the new Passwords app.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10125", purpose: link, label: "Watch Video")

   @Contributors {
       @GitHubUser(RamitSharma991)
   }
}

## Key Takeaways

🚀 Deploy Passkeys.

🔛 Enable automatic passkey upgrade.

🔄 Update website metadata.

♻️ Refresh verification code setup.

## Presenter

Garret Davidson, Authentication Experience Engineer


## Automatic passkey upgrades
Enhance security and streamline sign-ins with automatic passkey upgrades.
-   **Simplified Sign-In**: Traditional sign-ins require multiple steps (username, password, SMS verification), whereas passkeys offer a seamless, one-tap process.
-   **User-Friendly Transition**: Automatic upgrades create passkeys without interruptions, making the transition to secure sign-ins effortless.
-   **Improved Security**: Passkeys provide a faster, more secure alternative to traditional multi-step authentication.
-   **Broad Applicability**: This feature works seamlessly for both apps and websites.

### The Passkey journey 
-   **Phishing Risks**: Phishing and stolen credential attacks are common forms of account compromise.
-   **Passkey Advantages**: Passkeys prevent phishing, can't be forgotten, rarely need resets, and offer one-tap sign-ins.
-   **Current Vulnerabilities**: Most existing accounts rely on phishable factors like passwords, SMS, and email codes.
-   **Transition Period**: The industry is shifting from phishable sign-ins to secure methods like passkeys.
-   **Gradual Introduction**: Adding passkeys as an alternative sign-in method helps users transition at their own pace.

### Automatic passkey upgrades
-   **System Request**: Your app requests the system to create a passkey.
-   **Internal Checks**: The system checks if creating a passkey makes sense, ensuring conditions like credential manager setup and passkey support are met.
-   **Credential Manager**: If the system approves, the request goes to the credential manager, which checks if it recently filled a username and password for the same account.
-   **Passkey Creation**: If conditions are met, a new passkey is returned to your app; otherwise, an error is returned.
-   **Error Handling**: An error indicates that a passkey wasn't created this time, not necessarily a problem.

> **Note:** Automatic passkey upgrades act as a progressive enhancement, creating passkeys smoothly without requiring additional user prompts or interrupting app usage. While not guaranteed to register a passkey every time, it enhances user experience when it does.

```swift
// example of a password-based sign-in flow, which offers to create a passkey. 

func signIn() async throws {
let userInfo = try await signInWithPassword()
guard !userInfo.hasPasskey else { return }
let provider = ASAuthorizationPlatformPublicKeyCredentialProvider(relyingPartyIdentifier: "example")

 guard try offerPasskeyUpsell() else { return }
    let request = provider.createCredentialRegistrationRequest(
        challenge: try await fetchChallenge(),
        name: userInfo.user,
        userID: userInfo.accountID)

    do {
        let passkey = try await authorizationController.performRequest(request)
        // Save new passkey to the backend
    } catch { … }
}
```

-   **Current Practice**: Many apps offer passkey upgrades via a dialog after sign-in.
-   **Automatic Upgrades**: With automatic passkey upgrades, this dialog is unnecessary.
-   **Conditional Request**: Use `.conditional` request style; if conditions are met, a passkey is created, and a notification is shown without interrupting the app.
-   **Error Handling**: If conditions aren't met, you receive an error with no UI shown; you can then show an upsell dialog or try again later.
-   **Transition to Passkeys**: The industry is moving from passwords to passkeys, with automatic upgrades accelerating this shift.
-   **Enhanced Security**: Passkeys improve account security by eliminating password vulnerabilities.
-   **Development Phases**: Implementing passkeys involves typical development stages: learning, building, testing, and shipping.
-   **Simplified Sign-Ins**: Passkeys make sign-ins easier while bolstering security.
-   **Eliminate Phishable Factors**: Fully protect accounts by removing all phishable sign-in options, including passwords and many multi-factor authentication methods.
-   **Faster Sign-Ins**: Passkeys significantly speed up the sign-in process.
-   **Enhanced Security**: They provide stronger security compared to common multi-factor methods.
-   **Ultimate Goal**: Eliminating passwords is the ultimate aim of deploying passkeys.

## Improvements for credential managers
- Autofill passkey upgrades.
- Autofill for verification codes.
- AutoFill text from editing menu.

-   **New Features** 
    - Additions to the existing credential manager API.
-   **Support**
    - New keys for `Info.plist` and matching APIs detailed in the Authentication Services documentation.
-   **Credential Provider**: Now handles passwords, passkeys, and verification codes.
-   **AutoFill**: Select up to three apps for use with AutoFill.
-   **Improvements**: Enhancements for credential managers. 

## Passwords app

In the app, your website’s name and icon are prominently displayed, reflecting its personality. You can customize the display of your website and app using existing standards. 
- The passkeys section highlights apps and websites with phishing-resistant sign-ins, and there's a section for easy access to verification codes, similar to a dedicated authenticator app.
- The Security section lists weak, reused, or leaked passwords, and offers a Change Password button if the well-known URL is adopted. 
- On macOS, users can enable a menu bar item for quick access to passwords and verification codes, and easily import or export passwords from another credential manager.

**Updating Website Appearance(e.g.)** 
-   **Account Display**: The Passwords app combines passkeys and passwords for the same account into a single entry.
-   **OpenGraph Metadata**: If adopted, the Passwords app displays your sitename; otherwise, it defaults to the domain name.
- `<meta name = "og:sitename"
content="shiny">`
-   **Metadata Declaration**: Use OpenGraph meta tags in the page’s head tag for proper website representation across all pages, subdomains, and user agents.
-   **High-Resolution Icons**: Ensure your website has high-resolution icons for better display.

### Verificication code setup
-  Offer an `otpauth:` link for one-tap setup of time-based verification codes, in addition to the standard QR code.
- When suggesting apps for verification code setup, consider "Apple Passwords"
