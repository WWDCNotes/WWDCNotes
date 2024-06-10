# Game Center Player Identifiers

Game Center now supports persistent player identifiers scoped to individual games or to a developer team ID. Understand how scoped identifiers enhance player privacy and see how to transition your apps and games onto the recommended API.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/615", purpose: link, label: "Watch Video (10 min)")

   @Contributors {
      @GitHubUser(Blackjacx)
   }
}



- **GKLocalPlayer** represents authenticated player. Has persistent teamPlayerID & gamePlayerID
- **GKPlayer** provides info about other players. Uses scoped IDs
- **Scoped IDs** teamplayerID and gamePlayerID
  - properties on GKPlayer
  - increase player privacy
  - replace the playerID (has been deprecated) with scoped IDs (save game data / backend)
  - perform conversion after next authentication
  - teamPlayerID scoped to development team
  - gamePlayerID scoped to game

- `loadPlayersForIdentifiers:withCompletionHandler:`
