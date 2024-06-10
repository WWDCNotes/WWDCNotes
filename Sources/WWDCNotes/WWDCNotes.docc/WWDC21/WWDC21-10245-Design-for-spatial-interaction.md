# Design for spatial interaction

Discover the principles for creating intuitive physical interactions between two or more devices, as demonstrated by Apple designers who worked on features for iPhone, HomePod mini, and AirTag. Explore how you can apply these patterns to your own app when designing features for Apple platforms, and help people using your app interact more directly with their surroundings.

@Metadata {
   @TitleHeading("WWDC21")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc21/10245", purpose: link, label: "Watch Video (18 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## Design Principles

### Consider distance and ability

- When incorporating spatial awareness into existing features, be mindful that these capabilities are not available on all devices and your design should accommodate varying levels of capabilities
- Be forgiving with angles at a distance
- Consider changing the dominant form of feedback to one that works best at smaller scale

### Provide continuous feedback

- The right type of feedback applied and choreographed at the right time throughout these interactions can help make the feature you're designing discoverable, provides instruction, and can communicate success or failure
- Be mindful of how people move
- Connect movement and feedback
- Consider the nature of a movement
- build in adaptivity and resilience
- consider feedback strengths
- use senses in concert
- seek to provide a clear story
- use feedback judiciously
- types of possible feedback:
  - visual feedback (coordinated across both devices)
  - audio feedback
  - haptic feedback

### Embrace the physical action

- consider direct movement for selection
- emphasize feedback on the target device - e.g., the music starts playing on the HomePod when I tap my phone on it
- design for multiple sense
- defer to the primary task
- reinforce good states