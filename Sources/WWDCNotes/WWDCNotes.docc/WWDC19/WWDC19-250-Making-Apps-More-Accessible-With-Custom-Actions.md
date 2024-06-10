# Making Apps More Accessible With Custom Actions

Custom Actions simplify the experience for people using assistive technologies with your app and they can help you reduce the number of swipes and taps that are required to navigate through your interface and perform interactions. Learn how to leverage custom actions for use in VoiceOver and Switch Control. New in iOS 13, bring custom actions to Full Keyboard Access and Voice Control on iOS.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/250", purpose: link, label: "Watch Video (9 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



Custom actions help remove clutter in your app.

If we have a table with multiple cells and each cell has multiple buttons, by default voiceover will read each button for each cell.

Voiceover should only focus on the cell content, and provide custom actions instead.

Old way:

```swift
override var accessibilityCustomActions: [UIAccessibilityCustomAction]? { 
	get {
		let myAction = UIAccessibilityCustomAction(
			name: "Custom Action",
			target: self,
			selector: #selector(handleAction(_:)
		) 
		return [myAction] 
	}
	set {}
}

@objc func handleAction(_ action: UIAccessibilityCustomAction) -> Bool {
	var success = false 
	// action logic 
	return success
}
```

New way:

```swift
override var accessibilityCustomActions: [UIAccessibilityCustomAction]? { 
	get {
		let actions = [UIAccessibilityCustomAction]() 
    let myAction = UIAccessibilityCustomAction(name: "Custom Action") { 
    	(customAction: UIAccessibilityCustomAction) -> Bool in 
    	var success = false // action logic return success
    } 
    actions.append(myAction) return actions
  } 
  set {} 
}
```