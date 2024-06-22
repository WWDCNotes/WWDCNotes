# Engineering for Testability

Unit testing is an essential tool to consistently verify your code works correctly. Discover techniques for designing the code of your app so that it can be easily tested. Find out the best practices for developing a test suite that evolves with your app and scales as your app grows.

@Metadata {
   @TitleHeading("WWDC17")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc17/414", purpose: link, label: "Watch Video (38 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



- Separate Logic and Effects
- Pyramid of Tests (between UI and Unit tests there’s integration tests)
![][pyramidImage]

## UI Tests Tips

### Store parts of queries in variables.

Instead of this:

```swift
app.buttons["blue"].tap()
app.buttons["red"].tap()
app.buttons["yellow"].tap()
app.buttons["green"].tap()
app.buttons["purple"].tap()
app.buttons["orange"].tap()
app.buttons["pink"].tap() 
```

Write this:

```swift
func tapButton(_ color: String) {
  app.buttons[color].tap() 
}

let colors ["blue", "red", "yellow", 'green", "purple", "orange", "pink"]

for color in colors { 
  tapButton(color)
}
```

### Wrap Complex queries in utility methods

Instead of this:

```swift
func testGameWithDifficultyBeginnerAndSoundOff() { 
  app.navigationBars["Game.GameView'].buttons["Settings"].tap()
  app.buttons["Difficulty"].tap()
  app.buttons["beginner"].tap()
  app.navigationBars.buttons["Back"].tap()
  app.buttons["Sound"].tap()
  app.buttons["off"].tap()
  app.navigationBars.buttons["Back"].tap()
  app.navigationBars.buttons["Back"].tap() 

  // test code 
}
```

Write this:

```swift
func testGameWithDifficultyBeginnerAndSoundOff() {
  app.navigationBars["Game.GameView"].buttons["Settings"].tap() setDifficulty(.beginner)
  setSound(.off) 
  app.navigationBars.buttons["Back"].tap() 

  // test code 
}
```

Then create a GameApp class:

```swift
class GameApp: XCUIApplication { 

  enum Difficulty { /* cases */ }
  enum Sound { /* cases */ }
  
  func setDifficulty(_ difficulty: Difficulty) { /* code */ }
  func setSound(_ sound: Sound) { /* code */ } 

  func configureSettings(difficulty: Difficulty, sound: Sound) {
    app.navigationBars["Game.GameView"].buttons["Settings"].tap() 
    setDifficulty(difficulty)
    setSound(sound)
    app.navigationBars.buttons["Back"].tap() 
  }
}
```

And get this:

```swift
func testGameWithDifficultyBeginnerAndSoundOff() {
  GameApp().configureSettings (difficulty: .beginner, sound: .off)

  // test code 
}
```

Now it’s super easy to change the configuration, and if in the future we have more settings we just need to update the GameApp class

In the configure settings func we can also write this:

```swift
func configureSettings(difficulty: Difficulty, sound: Sound) { 
  XCTContext.runActivity(named: "Configure Settings: \(difficulty), \(sound)") { _ in 
    app.navigationBars["Game.GameView"].buttons["Settings"].tap()
    setDifficulty(difficulty)
    setSound(sound) 
    app.navigationBars.buttons["Back"].tap() 
  }
}
```

So when the test run we can have more insights of what’s going on:

![][testComplex6Image]

[pyramidImage]: WWDC17-414-pyramid
[testComplex6Image]: WWDC17-414-testComplex6