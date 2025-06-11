# What’s new in StoreKit and In-App Purchase

Learn about the latest StoreKit API enhancements to help you deliver great In-App Purchase experiences to your customers. We’ll review new fields added to AppTransaction, Transaction, and RenewalInfo, and updates to In-App Purchase offer codes. We’ll also cover creating signed In-App Purchase requests using the App Store Server Library and updates to merchandising subscriptions using SwiftUI.

@Metadata {
   @TitleHeading("WWDC25")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2025/241", purpose: link, label: "Watch Video (20 min)")

   @Contributors {
      @GitHubUser(Jeehut)
   }
}

## Explore new features

- The `AppTransaction` object now has an `appTransactionID` field (in 18.4+, back-deployed to 15)
- Also new: `originalPlatform` of type `AppStore.Platform` (iOS, macOS, tvOS, visionOS)
- `Transaction.currentEntitlement(for:)` deprecated, use `Transaction.currentEntitlements(for:)` instead
- The `Transaction` now has an `appTransactionID` field (also 18.4+)
- Also new: `offer` of type `Transaction.Offer` with fields `id`, `type`, and `period`
- And new: `advancedCommerceInfo` – more easily support IAPs for large content catalogs etc.

Learn more about Advanced Commere API [here](https://developer.apple.com/documentation/advancedcommerceapi/).

- New `SubscriptionStatus.status(transactionID:)` API to get the status using a transaction ID
- New fields on `RenewalInfo`: `appTransactionID`, `offer`, `advancedCommerceInfo`, `appAccountToken`
- Offer codes are now available for consumables, non-consumables, and non-renewing subscriptions (back to 16.3)
- New mode added to `Transaction.Offer.PaymentMode` type: `oneTime` added to `freeTrial`, `payAsYouGo`, `payUpFront`
- For iOS 15 backwards compatibility, a new `offerPaymentModeStringRepresentation` field is added to `Transaction`
- New purchase methods: `purchase(confirmIn:options)` – differs based on platform (window on macOS)

## Sign In-App Purchase requests

- Set eligibility for introductory offer via `Product.PurchaseOption.introductoryOfferEligibility(compactJWS:)`
- Sign promotional offers via `Product.PurchaseOption.promotionalOffer(_:compactJWS:)`
- Both these new APIs are back-deployed to iOS 15
- In SwiftUI: Use `subscriptionIntroductoryOffer` and `subscriptionPromotionalOffer` view modifiers
- Tip: Use the App Store Server Library (available in Java, Python, Node.js, and Swift)

Learn more: <doc:WWDC24-10062-Explore-App-Store-server-APIs-for-InApp-Purchase>

## Merchandise subscriptions

- Subscription offer view: `SubscriptionOfferView(id: "plus.standard")` – supports custom (placeholder) icon
- Use `.subscriptionOfferViewDetailAction` to add secondary button, e.g. to open full paywall
- New `SubscriptionOfferView(groupID:visibleRelationship:)` with various options for the latter parameter

@Image(source: "WWDC25-241-Subscription-Offer-View")
