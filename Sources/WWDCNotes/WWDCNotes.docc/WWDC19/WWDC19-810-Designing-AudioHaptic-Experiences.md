# Designing Audio-Haptic Experiences

Learn essential sound and haptic design principles and concepts for creating meaningful and delightful experiences that engage a wider range of human senses. Discover how to combine audio and haptics, using the Taptic Engine, to add a new level of realism and improve feedback in your app or game.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/810", purpose: link, label: "Watch Video (26 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## What is an Audio Haptic Experience?

Some tones are so low that our ears cannot hear, however real speakers still produce a vibration that our body is still able to catch.

One of the reasons behind the iPhone Taptic Engine is to reproduce those low frequency sounds/vibrations.

The Taptic Engine works in sync with the iPhone speaker, resulting in an Audio Haptic Experience.

## Three Guiding Principles

### Causality

For feedback to be useful, it must be obvious what it caused it. 

For example a soccer hitting a ball:

- cause: foot colliding with the ball. 
- effect: sound of impact, feel of impact 

When designing sound/haptics for your experience, think about what it’d feel/sound like if what we interact with was a physical object.

### Harmony

Things should feel the way they look the way they sound.

### Utility

Add audio and haptics that provide clear value to your app experience.