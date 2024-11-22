# Analyze HTTP traffic in Instruments 

Learn to use the Instruments Network template to record and analyze your app's HTTP traffic. We'll show you how to explore and visualize the behavior of sessions, tasks, and individual HTTP requests to ensure data is transmitted efficiently and respects people's privacy.

@Metadata {
   @TitleHeading("WWDC21")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc21/10212", purpose: link, label: "Watch Video (33 min)")

   @Contributors {
      @GitHubUser(abadikaka)
   }
}



## Track hierarchy

- HTTP Traffic instruments
  - Number of active tasks

- Process
  - Debuggable process and background tasks daemon

- Session
  - One track per `URLSession` object
  - Individual task intervals
  - Configurable session name:

```swift
let session = URLSession(configuration: .default)
session.sessionDescription = "Main Session"
```

- Domain
  - Only task that requested in the domain
  - More detail about tasks
  - Individual transactions
  - Transaction states

## Task timing

- Structural timing from start till the end

```swift
let task = session.dataTask(with: url) {
  /* handle result */ // 👈🏻 Complete event triggers here
}

task.resume() // 👈🏻 Resume event triggers here
```

## Task Identifier

- Ability to read the [task identifier][taskIdentifier] for clarity

```swift
let task = session.dataTask(with: url) {
  /* handle result */
}
task.taskDescription = "Load Thumbnail"
task.resume()
task.taskIdentifier // 👈🏻 this identifier will be shown in instruments
```

## Task Error

- Ability to distinguish error and success with color

## Transactions

- Request + response pair being handled by the URL Loading system
- Contains all the HTTP Layer information
- URL, Http version, connection, cache info
- Request + Response header
- Request + Response body
- And more

## Transaction states

- Multiple states to add information for distinction between each block

![States][8]

## Instrument

- Focus on the task description

![Focus on the task description][11]

- Expand the task description

![Expand task description][12]

- Filter by connection

![Filter task][13]

- Identify the http task issues (Ex: Staircase problem)

![Problem][14]

- Identify the request (Ex: wrong expiration date of cookie)

![Problem 1][15]

- Identify the backtrace (Ex: cached response)

![Problem 2][16]

- Filter the session (Ex: Found an issue with the data that sent to server)

![Problem 3][17]

- Export the report to .har extension

![Export][18]

- Output

- Save and export report to .har to analyse issues
- .har is a JSON structure

![JSON][19]

## Next Steps
- Target app  today to detect problems
- Name your URL Session and URLSessionTask for easier debugging
- Adopt latest networking protocols
- Audit your app requests to check if can send less information

[8]: WWDC21-10212-8
[11]: WWDC21-10212-11
[12]: WWDC21-10212-12
[13]: WWDC21-10212-13
[14]: WWDC21-10212-14
[15]: WWDC21-10212-15
[16]: WWDC21-10212-16
[17]: WWDC21-10212-17
[18]: WWDC21-10212-18
[19]: WWDC21-10212-19

[taskIdentifier]: https://developer.apple.com/documentation/foundation/nsurlsessiontask/1411231-taskidentifier