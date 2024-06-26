# Implementing Engaging UI on iOS

Users expect interesting animations and responsive interactions. Learn how to achieve this by making view controller transitions smooth, optimizing performance when using images, and harnessing customization APIs alongside new iOS 7 features.

@Metadata {
   @TitleHeading("WWDC13")
   @PageKind(sampleCode)
   @CallToAction(url: "http://developer.apple.com/wwdc13/226", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(antonio081014)
   }
}



## Custom UIViewController transitions

- Create and Initialize new UIViewController
- Set `transitioningDelegate` to be `self`
- Set `modalPresentationStyle` to be `UIModalPresentationCustom`
- Call `- presentViewController:animated:completion:`
- In this UIViewController, conforms to `UIViewControllerTransitioningDelegate`
- Implement `- (id <UIViewControllerAnimatedTransitioning>) animationControllerForPresentedController:(UIViewController *)presented presentingController:(UIViewController *)presenting sourceController:(UIViewController *)source` delegate method. In this method, we could totally customize the return object which conforms to `UIViewControllerAnimatedTransitioning`. This delegate method give custom transition when trying to present a new `UIViewController`.
- Implement `- (id <UIViewControllerAnimatedTransitioning>)animationControllerForDismissedController:(UIViewController *)dismissed`, In this method, we could also totally customize the return object which conforms to `UIViewControllerAnimatedTransitioning`. This delegate method give custom transition when trying to dismiss a presented `UIViewController`.
- Create a custom subclass of NSObject conforms to `UIViewControllerAnimatedTransitioning`, override several required methods, then magic happens.

## App-wide appearance

`UIAppearance` is very useful `Protocol` in iOS system. Developer could use this protocol to customize all the UIView or UIControl in one action.
Example is like: `[[UIButton appearance] setTintColor:[UIColor redColor]]`

## Resizable and template images

`- [UIImage resizableImageWithCapInsets:]`

## UIKit Dynamics

The basics:

```objc
animator = [[UIDynamicAnimator alloc] initWithReferenceView:self.view];

gravityBehavior = [[UIGravityBehavior alloc] initWithItems:@[itemToAnimate]];

[animator addBehavior:gravityBehavior];
```