// This file is used to generate empty session stubs for all the sessions of a year on day one of WWDC once the session details are available.

import Foundation
import Sessions
#if os(Linux)
import FoundationNetworking
#endif

// MARK: - Content-availability gate
//
// A stub is only worth creating if a human can actually consume the session in
// some form – ideally the original video, otherwise a public transcript. If
// neither exists there is nothing to take notes on, so no stub is created.
//
// `session-content-availability.json` (committed, the source of truth) records,
// per session: "video" (a working Apple video page → "Watch Video" → permalink),
// "transcript" (no working video, but a public transcript → "Read Transcript" →
// transcriptURL), or "exclude" (neither → skip). Sessions absent from the map
// default to the standard "Watch Video" behaviour (current years / WWDC day one).
//
// Transcript URLs use the wwdcindex project (https://nonstrict.eu/wwdcindex/),
// pattern: https://nonstrict.eu/wwdcindex/wwdc{year}/{code}/ — an external source,
// so links regenerate from this JSON if that site ever restructures.

struct ContentAvailability: Codable {
   struct Entry: Codable {
      let decision: String          // "video" | "transcript" | "exclude"
      let transcriptURL: String?
   }
   let sessions: [String: Entry]
}

let availabilityPath = "\(FileManager.default.currentDirectoryPath)/session-content-availability.json"
let availability: [String: ContentAvailability.Entry] = {
   guard let data = FileManager.default.contents(atPath: availabilityPath) else { return [:] }
   return (try? JSONDecoder().decode(ContentAvailability.self, from: data).sessions) ?? [:]
}()

let sessionByID = try Session.allSessionsByID()

for session in sessionByID.values {
   let entry = availability[session.id]

   // No consumable content (no video, no transcript) → don't create a stub.
   if entry?.decision == "exclude" { continue }

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

      // Transcript-only sessions point at the public transcript and say "read";
      // everything else points at the video and says "watch".
      let isTranscriptOnly = entry?.decision == "transcript"
      let callToActionURL = isTranscriptOnly ? (entry?.transcriptURL ?? session.permalink!.absoluteString) : session.permalink!.absoluteString
      let callToActionLabel = isTranscriptOnly
         ? "Read Transcript"
         : "Watch Video\(session.lengthInMinutes != nil ? " (\(session.lengthInMinutes!) min)" : "")"
      let consumeVerb = isTranscriptOnly ? "reading the transcript" : "watching the video"

      let sessionFileContents = """
         # \(session.title)

         \(session.description)

         @Metadata {
            @TitleHeading("\(event)")
            @PageKind(sampleCode)
            @CallToAction(url: "\(callToActionURL)", purpose: link, label: "\(callToActionLabel)")

            @Contributors {
               @GitHubUser(<replace this with your GitHub handle>)
            }
         }

         😱 "No Overview Available!"

         Be the hero to change that by \(consumeVerb) and providing notes! It's super easy:
          [Learn More…](https://wwdcnotes.com/documentation/wwdcnotes/contributing)

         """

      try sessionFileContents.write(toFile: sessionFilePath, atomically: true, encoding: .utf8)
   }
}
