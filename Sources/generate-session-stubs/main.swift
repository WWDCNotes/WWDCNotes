import Foundation
import Sessions
#if os(Linux)
import FoundationNetworking
#endif

let sessionByID = try Session.allSessionsByID()

for session in sessionByID.values {
   let event = "WWDC\(session.year - 2000)"
   let sessionFilePath = "\(FileManager.default.currentDirectoryPath)/Sources/WWDCNotes/WWDCNotes.docc/\(event)/\(session.fileName).md"
   let sessionMediaFolderPath = "\(FileManager.default.currentDirectoryPath)/Sources/WWDCNotes/WWDCNotes.docc/\(event)/\(session.fileName)"

   if
      !FileManager.default.fileExists(atPath: sessionFilePath)
      || (try! String(contentsOfFile: sessionFilePath).contains("@GitHubUser(<replace this with your GitHub handle>)"))
   {
      if !FileManager.default.fileExists(atPath: sessionMediaFolderPath) {
         try FileManager.default.createDirectory(atPath: sessionMediaFolderPath, withIntermediateDirectories: true)
         try "".write(toFile: "\(sessionMediaFolderPath)/.gitkeep", atomically: true, encoding: .utf8)
      }

      let sessionFileContents = """
         # \(session.title)

         \(session.description)

         @Metadata {
            @TitleHeading("\(event)")
            @PageKind(sampleCode)
            @CallToAction(url: "\(session.permalink!)", purpose: link, label: "Watch Video\(session.lengthInMinutes != nil ? " (\(session.lengthInMinutes!) min)" : "")")

            @Contributors {
               @GitHubUser(<replace this with your GitHub handle>)
            }
         }

         😱 "No Overview Available!"

         Be the hero to change that by watching the video and providing notes! It's super easy:
          [Learn More…](https://wwdcnotes.com/documentation/wwdcnotes/contributing)

         """

      try sessionFileContents.write(toFile: sessionFilePath, atomically: true, encoding: .utf8)
   }
}

// TODO: link to the sessions in the year overview document
