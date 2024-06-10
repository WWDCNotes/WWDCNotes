# Auditing Web Content with Web Inspector

Discover a new way to ensure your web content meets team coding standards and that you can deliver better code even without reliance on automated test systems. Find out how to use the Audit tool in Web Inspector to quickly and easily audit your web content during development so important compliance details don't slip by.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/514", purpose: link, label: "Watch Video (8 min)")

   @Contributors {
      @GitHubUser(Blackjacx)
   }
}



- Web Inspector includes built in audit system which can catch code changes and inconsistencies in webpage content
- Enable Safari Develop menu from `Preferences > Advanced > Show Develop menu in menu bar`
- Use **⌘ + ⌥ + I** to open Web Inspector
- Audits consist of TestGroups and Tests
- Audit results stay visible across page reloads and cleared when Web Inspector is closed
- Results can be im-/exported from/to JSON
- Write custom Audits in JSON format - makes them easily sharable
