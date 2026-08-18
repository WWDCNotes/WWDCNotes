# Principles of great design

Dive deep into fundamental design principles for Apple platforms.

@Metadata {
   @TitleHeading("WWDC26")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2026/250", purpose: link, label: "Watch Video (17 min)")

   @Contributors {
      @GitHubUser(mini-min)
   }
}

## Key Takeaways
- Design = making something with intention, it focus on what's most important to people

> Important: no fomula on right away, to combine these principles that can't gurantees perfect solution

## Presenters
- Linda Dong, Design Evangelism
- Doug LeMoine, Design Evangelism

## Purpose
- Before sketching or writing a line of code, ask whether what you're making has a purpose
- Every feature asks for the user's time, attention, and trust — don't waste them
- Design through subtraction: choosing what to build is often deciding what to leave out

## Agency
- People feel in control when you let them do things their own way
- An interface should never stand in the way of what someone is trying to do
  - Don't guide someone down a pre-determined path — let them dive into your experience and explore at their own pace
- Offering choices is the best way to bring agency into your experience → people are far more engaged
- Offer forgiveness — people will make mistakes or wander down paths they didn't mean to
  - Make it easy to undo any action (send, change, delete)
  - Double-check destructive actions with a confirmation
  - Interrupt only when someone is about to make a big mistake → avoid disaster
  - Forgiveness lets people feel capable and free to explore, knowing they can always recover

@Image(source: "WWDC26-250-avoid-disaster.jpeg", alt: "Interrupt only when about to make a big mistake, to avoid disaster")

## Responsibility
- Giving people freedom means also protecting their well-being — act in their best interest
- Start with privacy (privacy is a human right)
  - Anti-pattern: throwing permission prompts the second the app launches, long before the user knows what it does
  - Anti-pattern: asking for information without context for what it's for

@Image(source: "WWDC26-250-responsibility.jpeg", alt: "Permission prompt thrown before the user understands the app")

- Treat people and their private information with respect, just like in the real world
  - Wait for the right moment to ask for personal data
  - Only ask for what's necessary, and be transparent about what the data is for

@Image(source: "WWDC26-250-responsibility-2.jpeg", alt: "Asking for personal data at the right moment, with context")

> Important: Beyond privacy, keep people safe
> - How could this be misused?
> - Who would be harmed by this?
> - How do I prevent it?

- For intelligence features, anticipate that a model might generate something unexpected or inaccurate
  - e.g. a recipe app suggesting an ingredient someone logged an allergy to → real-world harm
- Think realistically about what could go wrong and add safeguards (previews, confirmations, disclaimers)
  - Consider removing a feature entirely if the risks to safety outweigh its value

@Row {
    @Column {
        @Image(source: "WWDC26-250-responsibility-ai-inaccurate.jpeg", alt: "Safeguard for inaccurate AI output")
    }
    @Column {
        @Image(source: "WWDC26-250-responsibility-ai-unexpected.jpeg", alt: "Safeguard for unexpected AI output")
    }
}

## Familiarity
