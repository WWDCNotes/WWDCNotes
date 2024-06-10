# Adopt Quick Note

Learn how you can link your app to Quick Note and help people quickly connect your content to their notes — and their notes to your content. Discover how Quick Note recognizes and links to app content through NSUserActivity, and find out how you can adopt this API in your app. We’ll take you through the requirements, benefits, and features of supporting Quick Note. We'll also provide guidance and best practices for NSUserActivity to help your app get all of its benefits.

@Metadata {
   @TitleHeading("WWDC21")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc21/10264", purpose: link, label: "Watch Video (14 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



Quick Note is a system-wide note-taking experience aimed to: 

- streamline the ability to take notes on iOS and macOS
- connect content from multiple apps and the web in one location

Uses `NSUserActivity`:

- When the user opens a quick note while in an app, the user will be able to add the user activity in the note
- If the user does an activity which was previously stored in a quick note, the system will show <kbd>Quick Note Suggestions</kbd>, prompting the user to open the quick note containing that `NSUserActivity` - Quick note suggestions work across devices/platforms
- the `NSUserActivity` added into the note should function as a deep link to let the user jump into that state in your app

## How it works

To appear on Quick Note, your `NSUserActivity` must set one or more of the following properties:

- `targetContentIdentifier`
- `persistentIdentifier`
- `webpageURL`

In order for this to work your identifiers must be:

- unique
- global (to work across platforms)
- stable (to recognize the same activity over and over)

## Best practices

- Make the titles:
  - Human readable
  - descriptive
  - use direct title

- Identifiers
  - avoid device specific data
  - avoid transient information
  - think long term
  - prefer `targetContentIdentifier` and `persistentIdentifier`
  - use the same identifier for `targetContentIdentifier` and `persistentIdentifier`
  - use `webpageURL` as fallback