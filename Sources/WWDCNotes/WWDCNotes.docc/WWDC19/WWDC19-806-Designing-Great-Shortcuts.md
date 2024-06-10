# Designing Great Shortcuts

Shortcuts allow people to access information and actions on the go or in the Shortcuts app. The best shortcuts take careful design planning to hone in on what can help expedite a person’s workflow with your app. Gain insights as to what makes a great shortcut and how to design the experience to be useful, beautiful, and responsive. See examples of how to map out the Siri dialog flow when using parameters to make your shortcuts flexible and helpful.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/806", purpose: link, label: "Watch Video (20 min)")

   @Contributors {
      @GitHubUser(Blackjacx)
   }
}



- **Shortcut Use Cases** are `Accelerate an Action`, `Present Concise Information`, `Multi-Step Shortcuts`
- **Great Shortcuts** wrap actions the user has to to often in your app. Offer adding an action to Siri after this action has been completed
- **Provided Add to Siri Button** should be used to add an action to Siri
- **Activation Phrase** should have a great default
- **Action** should provide as much detail as possible to the user has to fill out as less as necessary
- **Prompts** can be used to collect a value from the user.
- **Minimize Disambiguation Prompts** by providing an options list upfront
- **Pronounciation Hints** can be provided on devices lacking a display
- **Providing Synonyms** to options helps Siri to understand the user
- **The Final Confirmation Dialog** should be used to summarize everything the user has specified. Keep in mind to design a more descriptive one for devices without display!
- **Continuing in App** dialog is one big button, therefore avoid elements that look interactive.
- **Never include the App Name** this is shown automatically
- **Don't Include Users Name** since it might sound repetitive
- **Avoid first-person pronouns** use something like *There are the following options*
