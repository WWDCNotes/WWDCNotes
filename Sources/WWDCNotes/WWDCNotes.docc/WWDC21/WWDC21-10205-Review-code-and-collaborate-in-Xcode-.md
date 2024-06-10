# Review code and collaborate in Xcode 

Explore the latest enhancements to code review and pull requests in Xcode. Learn more about diff display preferences, commit selectors, changes navigator, and pull request workflows. We’ll show you how you can collaborate with your team and find regressions by connecting your code review and PR workflows directly to your source code.

@Metadata {
   @TitleHeading("WWDC21")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc21/10205", purpose: link, label: "Watch Video (11 min)")

   @Contributors {
      @GitHubUser(Jeehut)
   }
}



- Clicking on code review button (top right), shows changes like Word/Pages
- Bottom bar shows number of changes & allows quick access to changes via stepper
- Also side-by-side comparison available (setting in top right menu)
- New commit controls in the bottom right ("last commit") allow to compare to old commits
- Turning off comparison view by clicking "Reset" button in bottom bar
- New Changes tab in Source control navigator (second icon) shows all file changes
- Contributor comment: *Finally no extra Git GUI needed anymore to compare code or simple commits! 🎉*
- Switching branches & creating new ones right in the top bar of Xcode below app title
- Xcode 13 supports GitHub & BitBucket Server for creating Pull Requests
- Xcode creates a PR draft in Xcode, only uploaded once "Publish" button is clicked
- Xcode has built-in Markdown editor for the description of the PR
- Possible to tag specific developers as reviewers right within Xcode, approvals visible
- Pull Requests created from Xcode have the code reviews available right within Xcode
- CI Build result summary also directly available within Xcode 13
- Contributor comment: *No need to open GitHub (for example) in the browser anymore, at least in most cases?*
- PR Review requests also visible right within Xcode, in branches overview
