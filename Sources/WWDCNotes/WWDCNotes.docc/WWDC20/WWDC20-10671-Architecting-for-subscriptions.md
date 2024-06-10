# Architecting for subscriptions

Learn how you can build simple entitlement logic to enhance the customer experience. We’ll dive deep into key concepts and provide guidance for architecting your systems to accurately entitle service. You’ll learn best practices for subscription features and how to craft the best customer experience throughout the subscription lifecycle.

@Metadata {
   @TitleHeading("WWDC20")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc20/10671", purpose: link, label: "Watch Video (23 min)")

   @Contributors {
      @GitHubUser(davidleee)
   }
}



The subscriber states has changed from:

- Inactive
- Active 

to:

- Inactive
- Billing Retry
- Billing Grace Period
- Active 

which makes the subscriber journey more complex.

And we have some additional considerations to make such as:

- Upgrade, downgrade, or cross grade events
- Subscription Offer opportunities
- Billing retry and grace period messaging
- Refunds
