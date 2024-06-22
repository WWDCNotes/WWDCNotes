# In-App Purchases and Using Server-to-Server Notifications

Learn about the latest updates in StoreKit and dive deep into best practices for using server-to-server notifications to manage your subscribers.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/302", purpose: link, label: "Watch Video (50 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



New `SKStoreFront`, it lets us know what country the user is from, we can use it to sell targeted things to that user.

```swift
if let sf = SKPaymentQueue.default().storefront { 
  ...
}
```

It can be nil (the presenter didn’t say how/why).

Use this to observe changes (e.g. when the user change store/account)

```swift
//MARK: - SKPaymentTransactionObserver methods 

func paymentQueueDidChangeStorefront(_ queue: SKPaymentQueue) { 
  ...
}
```
