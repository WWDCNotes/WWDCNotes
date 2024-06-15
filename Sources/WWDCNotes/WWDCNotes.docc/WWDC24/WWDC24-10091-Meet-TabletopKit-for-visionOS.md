# Meet TabletopKit for visionOS

Build a board game for visionOS from scratch using TabletopKit. We’ll show you how to set up your game, add powerful rendering using RealityKit, and enable multiplayer using spatial Personas in FaceTime with only a few extra lines of code.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10091", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(halmueller)
   }
}

This session is a quick, high-level summary of TabletopKit, with pointers to supporting sessions/frameworks. TabletopKit is a framework for building spatial, multiplayer tabletop experiences for Apple Vision Pro: card game, dice game, complex board game. It handles gestures, common layouts. Integrates with RealityKit, GroupActivities, SharePlay.

Key takeaway: TabletopKit handles the actual game surface, board, equipment, state. Developer manages gameplay. RealityKit, SharePlay, and GroupActivities used to implement the details. For visionOS only.

Components: 
- game table, with seats
- game equipment
- player pawns

Walkthrough of building the game structure:
- `Tabletop` (a RealityKit `Entity`)
- place `Seat`s around the table. 
- everything on the `Tabletop` is `Equipment` (and usually has corresponding RealityKit `Entity`).

Player pawn has physical rep and a pose. Is owned by its seat.

State is tracked by `BaseEquipmentState`, `TableVisualState`. 

Actions can be automated (like dealing cards) or interactive (rolling a die, drawing/placing a card). Uses system interaction gestures. Gestures are tracked through their phases by `TabletopInteraction` objects. Discrete `actions` modify game state. Callback for gesture begin, end, cancel.

TabletopKit provides info about what was moved. Developer is responsible for enforcing rules.

Visual sugar: RealityKit pawn animations, other RK special effects (like sound). 

Multiplayer: spatial personas, Facetime, SharePlay, optional custom spatial Persona templates for multiplayer layout.

GroupActivities and SharePlay handle state sync.


