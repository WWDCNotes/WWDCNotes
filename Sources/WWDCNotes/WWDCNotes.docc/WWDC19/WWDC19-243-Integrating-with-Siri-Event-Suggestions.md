# Integrating with Siri Event Suggestions

Siri is the intelligence behind displaying what someone needs to know about at just the right moment. In iOS 13, we’re extending this capability to allow your apps to let Siri know when a reservation has been made and Siri can elevate checking in at the right time. Siri can also provide directions to the reservation in Maps, add the event to Calendar, and more. Discover how you can add the power of Siri Event Suggestions to your apps.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/243", purpose: link, label: "Watch Video (28 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



- Like for activities, apps can now donate events. 
- E.g. a flight booking app can donate the booked flight event to the system to let iOS know when the user is flying.

- These events, for the moment, are limited to reservations, and they’re donated to the system in a form of intent (via the `Intent` framework).

- In case of flight apps, Siri can even suggest to check-in at the right time (if the app supports that). This is something that the app has to donate along, the app also specifies the correct time range where this is valid.

- This info is also used in maps to suggest where to go, and in a meeting to suggest to turn on do not disturb.

- What kind of reservations are supported?
  - Restaurant
  - Movies 
  - Ticketed Events
  - Car Rentals 
  - Train 
  - Hotels 
  - Flights

- We can also update a reservation (for example when the flight gate changes), or cancel a reservation (when the user cancels the booking).
