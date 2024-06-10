# Design for intelligence: Meet people where they are

Understand what motivates people to use your app — and how you can use system intelligence to help them and achieve your own goals as a developer. We'll take a look at a typical person's journey to better understand how an app can become a key part of their routine — and why some apps just don't stick. Learn how you can provide the right kind of value at the right time to help them in their everyday tasks, and how your app and the system can evolve alongside them.

@Metadata {
   @TitleHeading("WWDC20")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc20/10200", purpose: link, label: "Watch Video (5 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



This session explores a user's journey to start using a new gym app, and how the system intelligence can help them discover new apps and accelerate them every step of the way.

## The Journey

It starts with a message from a friend, which shares the gym address.

When opening `Maps.app`, Siri automatically suggests the same address, without any input from the user.

The gym has some NFC tags installed in the entrance: these will open the gym's App clip to show the gym class schedule.

After downloading the app, when Siri notices that the user opens it every Sunday morning (to plan to which class to go to during the next week), Siri will start suggesting the app both in the Springboard search end even in the new suggested apps widget.

If the user will routinely do the same activity in the app at the same time, Siri will start suggest to open that specific activity to the user via the Shortcut suggestions (in lock screen and other places).

Speaking of widgets, the app can have its own widget where it can indicate the importance of an update (for example a class schedule change) so that the iOS Widget Smart Stack will display it to the user when it matter most.

Lastly, if the user has a routine just before getting into the gym, a Shortcuts integration would be of benefit for them.