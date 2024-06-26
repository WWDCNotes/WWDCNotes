import Foundation
import Sessions
#if os(Linux)
import FoundationNetworking
#endif

let sessionByID = try Session.allSessionsByID()

let contentBasePath = "/Users/Cihat/Developer/WWDCNotes/Content"  // TODO: change this path if you're not Cihat and want to run this command

//notes/wwdc23/101.md

for session in sessionByID.values {
   let event = "WWDC\(session.year - 2000)"
   let eventSessionsPath = "\(FileManager.default.currentDirectoryPath)/Sources/WWDCNotes/WWDCNotes.docc/\(event)"
   
   let sessionFilePath = "\(eventSessionsPath)/\(session.fileName).md"
   let sessionMediaFolderPath = "\(eventSessionsPath)/\(session.fileName)"

   let notesPath = "\(contentBasePath)/content/notes/\(event.lowercased())/\(session.code).md"
   let imagesFolderPath = "\(contentBasePath)/images/notes/\(event.lowercased())/\(session.code)"

   guard FileManager.default.fileExists(atPath: notesPath) else { continue }
   guard !FileManager.default.fileExists(atPath: sessionFilePath) else {
      print("Skipping session \(session.id) as already migrated…")
      continue
   }
   let imagePaths = ((try? FileManager.default.contentsOfDirectory(atPath: imagesFolderPath)) ?? []).compactMap { (fileName) -> String? in
      guard !fileName.starts(with: ".") else { return nil }
      return "\(imagesFolderPath)/\(fileName)"
   }

   let notesContentComponents = try String(contentsOfFile: notesPath).components(separatedBy: "---")
   guard notesContentComponents.count >= 3 else {
      print("warning: Found more than 3 appearances of `---` in file '\(notesPath)'")
      continue
   }
   
   let notesHeader = notesContentComponents[1]
   let notesContents = notesContentComponents.dropFirst(2).joined(separator: "---")

   let contributors = notesHeader.components(separatedBy: "\n")[1]
      .firstMatch(of: try Regex("contributors:\\s*(.*)"))![1].substring!
      .components(separatedBy: ", ")
      .map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }

   var sessionFileContents = """
      # \(session.title)

      \(session.description)

      @Metadata {
         @TitleHeading("\(event)")
         @PageKind(sampleCode)
         @CallToAction(url: "\(session.permalink!)", purpose: link, label: "Watch Video\(session.lengthInMinutes != nil ? " (\(session.lengthInMinutes!) min)" : "")")

         @Contributors {
      \(contributors.map { "      @GitHubUser(\($0))" }.joined(separator: "\n"))
         }
      }

      \(notesContents)
      """

   // old image paths look like this: '../../../images/notes/wwdc23/101/sketchnote.jpg'
   for imagePath in imagePaths {
      if !FileManager.default.fileExists(atPath: sessionMediaFolderPath) {
         try FileManager.default.createDirectory(atPath: sessionMediaFolderPath, withIntermediateDirectories: true)
      }

      let imageFileName = imagePath.components(separatedBy: "/").last!
      let newImageFilePath = "\(sessionMediaFolderPath)/\(event)-\(session.code)-\(imageFileName)"
      try FileManager.default.copyItem(atPath: imagePath, toPath: newImageFilePath)

      sessionFileContents = sessionFileContents.replacing(
         "../../../images/notes/\(event.lowercased())/\(session.code)/\(imageFileName)",
         with: newImageFilePath.components(separatedBy: "/").last!.components(separatedBy: ".").dropLast().joined(separator: ".")
      )
   }

   if !FileManager.default.fileExists(atPath: eventSessionsPath) {
      try FileManager.default.createDirectory(atPath: eventSessionsPath, withIntermediateDirectories: true)
   }
   try sessionFileContents.write(toFile: sessionFilePath, atomically: true, encoding: .utf8)
}
