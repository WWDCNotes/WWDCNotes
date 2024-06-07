import Foundation
import Sessions

struct Contributor {
   let githubProfileName: String
   let githubUserID: String
   let fullName: String
   let shortDescription: String
   let socialLinks: [String: URL]

   init(githubProfileName: String) throws {
      self.githubProfileName = githubProfileName

      self.githubUserID = "123"  // TODO: fetch from GitHub API
      self.fullName = "To Do" // TODO: fetch from GitHub API
      self.shortDescription = "An amazing developer."  // TODO: fetch from GitHub API (and shorten to one line?)
      self.socialLinks = ["X/Twitter": URL(string: "https://x.com/Jeehut")!]  // TODO: fetch from GitHub API
   }
}

let sessionByID = try Session.allSessionsByID()

let events = ["WWDC23"]

var contributorsByProfile: [String: Contributor] = [:]
var sessionIDsWithoutContributors: Set<String> = []
var sessionIDsByProfile: [String: Set<String>] = [:]

for event in events {
   let eventSessionsPath = "\(FileManager.default.currentDirectoryPath)/Sources/WWDCNotes/WWDCNotes.docc/\(event)"
   let sessionFileNames = try FileManager.default.contentsOfDirectory(atPath: eventSessionsPath).filter { $0.hasSuffix(".md") }

   let contributorRegex = try Regex(#"@GitHubUser\(([^\n]+)\)"#)

   for sessionFileName in sessionFileNames {
      let sessionFileNameForSearch = sessionFileName
         .replacing("Consumer-Keynote", with: "Keynote")
         .replacing("Developer-Keynote", with: "Platforms-State-of-the-Union")

      if let session = sessionByID.values.first(where: { $0.fileName.lowercased() + ".md" == sessionFileNameForSearch.lowercased() }) {
         let sessionFilePath = "\(eventSessionsPath)/\(sessionFileName)"
         var sessionFileContents = try String(contentsOfFile: sessionFilePath, encoding: .utf8)

         let sessionContributorNames = sessionFileContents.matches(of: contributorRegex).compactMap { $0[1].substring }.map(String.init)
         if sessionContributorNames.isEmpty {
            sessionIDsWithoutContributors.insert(session.id)
         }
         
         let sessionContributors = try sessionContributorNames.map { profile in
            sessionIDsByProfile[profile, default: []].insert(session.id)

            if let existingContributor = contributorsByProfile[profile] {
               return existingContributor
            } else {
               let newContributor = try Contributor(githubProfileName: profile)
               contributorsByProfile[profile] = newContributor
               return newContributor
            }
         }

         if !sessionContributors.isEmpty {
            sessionFileContents += "\n\n## Written By\n"
            for contributor in sessionContributors {
               sessionFileContents += """

                  @Row(numberOfColumns: 5) {
                     @Column { ![Profile image of \(contributor.fullName)](https://avatars.githubusercontent.com/u/\(contributor.githubUserID)?v=4) }
                     @Column(size: 4) {
                        ## [\(contributor.fullName)](<doc:\(contributor.githubProfileName)>)

                        \(contributor.shortDescription)

                        [Contributed Notes](<doc:\(contributor.githubProfileName)>)
                  \(contributor.socialLinks.map { "      [\($0)](\($1.absoluteString))" }.joined(separator: "\n"))
                     }
                  }

                  """
            }
         }

         if !session.relatedSessionIDs.isEmpty {
            sessionFileContents += """


               ## Related Sessions

               @Links(visualStyle: list) {

               """

            for relatedSessionID in session.relatedSessionIDs {
               if let relatedSession = sessionByID[relatedSessionID] {
                  sessionFileContents += "   - <doc:\(relatedSession.fileName)>\n"
               }
            }

            sessionFileContents += "}\n\n"
         }

         sessionFileContents += """
            
            @Small {
               **Legal Notice**

               All content copyright © 2012 – 2024 Apple Inc. All rights reserved.
               Swift, the Swift logo, Swift Playgrounds, Xcode, Instruments, Cocoa Touch, Touch ID, FaceID, iPhone, iPad, Safari, Apple Vision, Apple Watch, App Store, iPadOS, watchOS, visionOS, tvOS, Mac, and macOS are trademarks of Apple Inc., registered in the U.S. and other countries.
               This website is not made by, affiliated with, nor endorsed by Apple.
            }
            """

         try sessionFileContents.write(toFile: sessionFilePath, atomically: true, encoding: .utf8)
      }
   }
}

let contributorsPath = "\(FileManager.default.currentDirectoryPath)/Sources/WWDCNotes/WWDCNotes.docc/Contributors"

for contributor in contributorsByProfile.values {
   let contributorFilePath = "\(contributorsPath)/\(contributor.githubProfileName).md"
   // TODO: create contributor markdown file
}
