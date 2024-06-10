# What's new in App Store Connect

Discover the latest updates to App Store Connect, your suite of tools to create, manage, and submit apps on the App Store. Learn about enhancements to the submission experience — including the ability to manage submissions in App Store Connect on iOS and iPadOS — as well as the newest updates to the App Store Connect API and much more.

@Metadata {
   @TitleHeading("WWDC22")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc22/10043", purpose: link, label: "Watch Video (9 min)")

   @Contributors {
      @GitHubUser(Jeehut)
   }
}



# What’s new in App Store Connect

## Recent Updates

- App Clips API
- Custom Offer Codes
- TestFlight for Mac
- TestFlight Group Column
- TestFlight Internal Group Management
- in-App Events
- Custom Product Pages
- Transfer Apps That Use Apple Wallet
- Product Page Optimization
- Xcode Cloud
- Enhanced App Store Submission Experience

## Enhanced App Store Submission

- Can submit multiple items (app versions, in app events, product pages, etc.) at once
  - helps ensure a consistent review, all reviewed within 24h
  - you can edit and re-submit (option A)
  - you can remove rejected items (option B)

- Submit without need of new app version
  - each submission has an associated platform
  - each platform has its set of review items
  - you can have 1 in-progress submission per platform

- iOS Review Submission
  - App version takes precedence, possible without when previously approved iOS version

## Dedicated submission page

- App Review page gives an overview of submission status
- Enhanced submission experience now also on iOS & iPad
    - Allows submitting from iPhone
    - Manage submissions
    - Seeing rejection reasons
    - Replying to App Review

## App Store Connect API

- 2.1 is bringing 60% more resources
- In-app purchases and subscriptions
    - New subscription resource
    - Create, edit, and delete
    - Manage pricing
    - Submit for review
    - Create offers & promo codes

- Customer reviews and developer responses
- App hang diagnostics (in Xcode & API)
    - Analyze and eliminate app hangs
    - View new diagnostic signature
    - Download detailed logs

- Fully embraced REST APIs, XML API is being deprecated
