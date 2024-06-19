# Design interactive experiences for visionOS

Learn how you can design a compelling interactive narrative experience for Apple Vision Pro from the designers of Encounter Dinosaurs. Discover how these types of experiences differ from existing apps, media, and games, and explore how to design narratives that bring audiences into new worlds. Find out how you can create stories that adapt to any space and size, provide multiple levels of interaction to make them accessible to all, and use animation, spatial audio, and custom gestures to further immerse people in your experience.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10096", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(halmueller)
   }
}

Interactive experiences: new medium. User becomes part of the story.
- Setting
- Interactions
- Audience

This talk uses the "Encounter Dinosaurs" app as a case study.

#### Key takeaway: Design for your audience.

## Setting
Design for your story: might be window, volume, immersive.

"Encounter Dinosaurs" uses custom RealityKit portal, because fully immersive experience might be overwhelming.

Place content magically. Movie in a theater doesn't allow audience member to place the screen; visionOS also places the screen for viewer. For visionOS immersive space, origin of the content defaults to your head position. For something custom, designer/developer can decide where/how content appears. Make it feel like magic.

Example: "Encounter Dinosaurs" places portal/has credits roll, but also uses ARKit to get sense of audience's space and find right placement for the portal. Aim: portal opening against open wall.  In large room or outdoors, portal opens as wide as 4 meters, in a flat plane. In small room, portal wraps around side walls. In very limited space, portal is placed a set distance from viewer, and dims passthrough to maintain immersion.

### Everything changes in device!
Prototype and test on device as much as you can.

## Interactions

Best interactive stories are harmony of story and agency. Must maintain balance between empowering your audience and the story you are trying to tell. As much your audience's story as it is your own.

Introduce interactivity. "Encounter Dinosaurs" early testers thought it was a passive experience. Have to teach people how to interact. Initial interactions set the stage. First interaction should be small, simple, welcoming. Example: butterfly.

Connect with your characters: eye contact, proximity, hand/body interactions. Example: first dinosaur you meet is a baby. Her behavior changes based on audience actions.

Large carnivorous dinosaur enters with initial curiosity.

Design authentic behavior. E.g. get head position so character can make eye contact.

Establish consistent interactions. For custom interactions, need consistent rules about how/when they work, and when they don't, within your story world. These rules become audience's verbs. Consistency is key to maintaining immmersion.

Breathe life with spatial audio. "Encounter Dinosaurs": multiple emitters for ambient sound, thunder. Dinosaurs have emitters on feet and on tail.

## Audience-centric design

"Encounter Dinosaurs" flow: started with a single linear scene/interactive flow. After testing, provided 6 different possibilities/pathways for interacting with Izzy (the baby dinosaur). Audience might think of something you didn't. Test often, watch audience without prompting them.

"Part of giving agency to your audience is letting them decide how engaged they want to be with your experience". Let it work even if viewer is passive.

Audience: audience-centric design, emotional journey.

Give the audience breaks/respites between high energy scenes, like a good movie does.

Accessibility: closed captions, VoiceOver, audio descriptions, Dynamic Type. Example: "Encounter Dinosaurs" audio description excerpt; modal for alternative interactions if you can't interact physically.
