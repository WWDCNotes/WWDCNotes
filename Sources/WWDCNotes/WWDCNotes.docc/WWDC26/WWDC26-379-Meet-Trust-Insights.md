# Meet Trust Insights

Uncover how Trust Insights can help protect people from social scams and coercion. Explore how this new framework uses privacy-preserving machine learning to detect when someone may be coached into risky actions. Find out how to integrate Trust Insights into your app, interpret its signals, and design thoughtful interventions that safeguard people while respecting their privacy.

@Metadata {
   @TitleHeading("WWDC26")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2026/379", purpose: link, label: "Watch Video (13 min)")

   @Contributors {
      @GitHubUser(mini-min)
   }
}

## Key Takeaways

- Use Trust Insights to detect and respond to social engineering threats

## Problems
- Common coercion patterns
  - Tech support scams - fake alerts prompt remote access, deceiving the user into handing over control
  - Authority impersonation - posing as banks, government, or law enforcement to collect sensitive information
  - Family emergency fraud - urgent money requests exploiting emotional bonds (increasingly via AI deepfakes)

- Real-time coaching makes detection especially difficult
  - Attackers guide victims via calls/chat, but the user performs the action themselves - authenticated and legitimate
  - Existing protections (multi-factor auth, biometrics) don't help, because the user is the one acting

> Key Points:
> Authentication confirms *who* is acting, but not *whether* they're acting freely
> → behavioral context can distinguish genuine intent from a coerced action (while preserving privacy)

## Integrate True Insights into app
### Step 1. Configuration
- requires an entitlement configure this in Xcode by declaring the capability on app target

## Requirements 

## Privacy Architecture
