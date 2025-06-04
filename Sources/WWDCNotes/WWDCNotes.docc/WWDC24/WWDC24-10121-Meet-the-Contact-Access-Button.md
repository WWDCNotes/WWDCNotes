# Meet the Contact Access Button

Learn about the new Contacts authorization modes and how to improve Contacts access in your app. Discover how to integrate the Contact Access Button into your app to share additional contacts on demand and provide an easier path to Contacts authorization. We’ll also cover Contacts security features and an alternative API to be used if the button isn’t appropriate for your app.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10121", purpose: link, label: "Watch Video")

   @Contributors {
       @GitHubUser(harrison-heinig)
   }
}

## Key Takeaways

- ⛔ Users can now provide limited access to contacts in an app
- 🔎 Use `ContactAccessButton` to show search results for restricted contacts
- 💽 Use `CNContactStore` to get contact data
- 🔘 Use `ContentAccessPicker` to allow users to change access without leaving an app


## Presenters
- Ada, Software Engineer

## [Limited Access](https://developer.apple.com/videos/play/wwdc2024/10121/?time=36)
- Users can now choose to share a limited number of contacts with an app
- Access level as well as selected contacts can be changed at any time

### [Authorization Levels](https://developer.apple.com/videos/play/wwdc2024/10121?time=93)

| Authorization Level | Read | Write |
| ------------------- | :--: | :---: |
| Full                | 🟢   | 🟢    |
| Limited             | 🟡   | 🟢    |
| Not Determined      | -    | -     |
| Denied              | 🔴   | 🔴    |


## [Contact Access Picker](https://developer.apple.com/videos/play/wwdc2024/10121?time=142)
- Full screen picker that lets users select contacts without leaving an app

## [Contact Access Button](https://developer.apple.com/videos/play/wwdc2024/10121?time=277)
- Allows a full contact picker experience in an app without requiring full access
- By selecting the Contact Access Button a user can quickly grant an app access to the contact
- Enables restricted contacts to appear in an app's search results for contacts
- Can be used even if an app's authorization level is "Not Determined"

### [Using `ContactAccessButton`](https://developer.apple.com/videos/play/wwdc2024/10121?time=315)
```swift
@Binding var searchText: String
@State var authorizationStatus: CNAuthorizationStatus = .notDetermined

var body: some View {
List {
// Show Results for App's Data Store
ForEach(searchResults(for: searchText)) { person in
ResultRow(person)
}

// Show Results from ContactAccessButton
if authorizationStatus == .limited || authorizationStatus == .notDetermined {
ContactAccessButton(queryString: searchText) { identifiers in 
let contacts = await fetchContacts(withIdentifiers: identifiers)
dismissSearch(withResult: contacts)
}
}
}
}
```

## Accessing Contacts

### [`CNContactStore`](https://developer.apple.com/videos/play/wwdc2024/10121?time=520)

- Primary way to read/write contact data
- Requires authorization to access
- Provides notifications when data is changed

### [Contact Picker View Controller](https://developer.apple.com/videos/play/wwdc2024/10121?time=656)
- System UI contact picker
- Delivers a snapshot of contact data on when the picker is closed
- No authorization is required

### [Contact Access Picker](https://developer.apple.com/videos/play/wwdc2024/10121?time=713)
- System UI contact picker, that allows users to quickly change contact access
- Returns contacts to the app as identifiers in `CNContactStore`

### [Which Access Method to Use](https://developer.apple.com/videos/play/wwdc2024/10121?time=813)
| Authorization Level | `CNContactPickerViewController` | `CNContactStore` | `ContactAccessButton` | `ContactAccessPicker` |
| ------------------- | :-----------------------------: | :--------------: | :-------------------: | :-------------------: |
| Full                | 🟢                              | 🟢               | Not Needed            |  Not Needed           |
| Limited             | 🟢                              | 🟡               | 🟢                   |  🟢                   |
| Not Determined      | 🟢                              | Prompt           | 🟢                   |  🔴                   |
| Denied              | 🟢                              | 🔴               | 🔴                   |  🔴                   |
