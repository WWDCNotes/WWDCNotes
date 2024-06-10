# Explore Packages and Projects with Xcode Playgrounds

Xcode Playgrounds helps developers explore Swift and framework APIs and provides a scratchpad for rapid experimentation. Learn how Xcode Playgrounds utilizes Xcode's modern build system, provides improved support for resources, and integrates into your projects, frameworks, and Swift packages to improve your documentation and development workflow.

@Metadata {
   @TitleHeading("WWDC20")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc20/10096", purpose: link, label: "Watch Video (14 min)")

   @Contributors {
      @GitHubUser(tianskylan)
      @GitHubUser(zntfdr)
   }
}



Playgrounds have been integrated with the new build system in Xcode 12. It enables three main new capabilities:

- Playgrounds in Swift packages: we can use a playground to showcase and document our library API in a playground
- Playgrounds dependencies easy support: both Swift Packages and frameworks
- Playgrounds assets and resources support

## Using Xcode Playground with Frameworks and Packages Dependencies

- As long as the Playground and the package or framework are in the same workspace, we can make these dependencies available to the playground by enabling the Playground Settigns `Build Active Scheme` in the Playground Inspector.
- `Build Active Scheme` tells Xcode to automatically build all targets in the currently selected scheme and make any modules (frameworks/packages) importable to the Playground.
- New Playgrounds have this `Build Active Scheme` enabled by default.

## What Else is New in Playgrounds

- Playgrounds build logs are now available in the report navigator: you can see the dependency modules being built first, then the playground target itself.
- All resource types supported by the build system are now supported in Playgrounds, which means things such as Assets Catalogs and `.mlmodel`s are now supported.
