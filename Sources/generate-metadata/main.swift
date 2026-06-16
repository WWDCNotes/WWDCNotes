// This file is used on the GitHub Actions CI to generate dynamic data like the 'Contributors' page, the 'Written by' sections and more.

import Foundation
import Sessions
#if os(Linux)
import FoundationNetworking
#endif

struct Contributor {
   struct GitHubUser: Codable {
      let id: Int?
      let name: String?
      let bio: String?
      let blog: String?
      let twitterUsername: String?
      let avatarUrl: String?
   }

   let githubProfileName: String
   let avatarURL: URL
   let fullName: String
   let shortDescription: String
   let socialLinks: [String: URL]

   init(githubProfileName: String) throws {
      self.githubProfileName = githubProfileName

      let gitHubUser = try Self.fetchGitHubUser(profileName: githubProfileName)

      self.fullName = gitHubUser.name ?? githubProfileName

      let fullNameTokens = self.fullName.components(separatedBy: .whitespaces)

      if gitHubUser.avatarUrl != nil, let githubUserID = gitHubUser.id {
         var urlComponents = URLComponents()
         urlComponents.scheme = "https"
         urlComponents.host = "avatars.githubusercontent.com"
         urlComponents.path = "/u/\(githubUserID)"
         urlComponents.queryItems = [URLQueryItem(name: "v", value: "4")]

         self.avatarURL = urlComponents.url!
      } else {
         var urlComponents = URLComponents()
         urlComponents.scheme = "https"
         urlComponents.host = "ui-avatars.com"
         urlComponents.path = "/api/"
         urlComponents.queryItems = [URLQueryItem(name: "name", value: fullNameTokens.joined(separator: "+"))]

         self.avatarURL = urlComponents.url!
      }

      self.shortDescription = gitHubUser.bio?.components(separatedBy: .newlines)[0] ?? "No Bio on GitHub"

      // Fetch social links. The GitHub API returns unset profile fields as empty strings,
      // not null - an unguarded "" would render a dead button pointing at "https://".
      var links = [String: URL]()
      if let blog = gitHubUser.blog?.trimmingCharacters(in: .whitespacesAndNewlines), !blog.isEmpty {
         var blogUrlString = blog

         if !blogUrlString.hasPrefix("http") {
            blogUrlString = "https://\(blogUrlString)"
         }

         if let blogURL = URL(string: blogUrlString), blogURL.host != nil {
            links["Blog/Website"] = blogURL
         }
      }

      if let twitterUsername = gitHubUser.twitterUsername?.trimmingCharacters(in: .whitespacesAndNewlines), !twitterUsername.isEmpty {
         links["X/Twitter"] = URL(string: "https://x.com/\(twitterUsername)")
      }

      self.socialLinks = links
   }

   /// Fetches a GitHub user profile via the public REST API.
   ///
   /// The public `/users/{login}` endpoint is readable without authentication (rate-limited to 60 requests/hour);
   /// a token only raises that ceiling to 5 000/hour. When a token is present we try it first and transparently
   /// retry unauthenticated on any auth/rate-limit failure, so the build stays green whether it runs with a real
   /// GitHub PAT or no token at all.
   static func fetchGitHubUser(profileName: String) throws -> GitHubUser {
      var components = URLComponents()
      components.scheme = "https"
      components.host = "api.github.com"
      components.path = "/users/\(profileName)"
      let url = components.url!

      // Use GITHUB_TOKEN if set. An env var that is present but empty (e.g. a CI secret that is unset yet still
      // exported as "") counts as "no token", not as an empty credential.
      let environment = ProcessInfo.processInfo.environment
      let token = environment["GITHUB_TOKEN"].flatMap { $0.isEmpty ? nil : $0 }

      print("Fetching GitHub profile details for '\(profileName)'…")

      // First attempt: authenticated when a token is available, otherwise straight to the public path.
      var (data, status) = Self.performRequest(url: url, token: token)

      // 401 (bad credentials) or 403 (rate limit) → retry once without the Authorization
      // header. The public profile is readable unauthenticated, so this recovers the lookup instead of failing.
      if status != 200, token != nil {
         print("   Authenticated lookup returned HTTP \(status); retrying unauthenticated…")
         (data, status) = Self.performRequest(url: url, token: nil)
      }

      guard let data else {
         throw URLError(.badServerResponse)
      }

      if status != 200 {
         print("   Warning: GitHub lookup for '\(profileName)' returned HTTP \(status); using fallback profile data.")
      }

      let decoder = JSONDecoder()
      decoder.keyDecodingStrategy = .convertFromSnakeCase
      do {
         return try decoder.decode(GitHubUser.self, from: data)
      } catch {
         print("Fetched contents were: \(String(data: data, encoding: .utf8) ?? "N/A")")
         throw error
      }
   }

   /// Synchronously performs a GET against the GitHub API, returning the response body and HTTP status code
   /// (0 when the transport itself failed). GitHub requires a User-Agent header on every request, so we always set one.
   private static func performRequest(url: URL, token: String?) -> (Data?, Int) {
      var request = URLRequest(url: url)
      request.setValue("application/vnd.github+json", forHTTPHeaderField: "Accept")
      request.setValue("WWDCNotes-generate-metadata", forHTTPHeaderField: "User-Agent")
      if let token {
         request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
      }

      let semaphore = DispatchSemaphore(value: 0)
      var resultData: Data?
      var statusCode = 0
      let task = URLSession.shared.dataTask(with: request) { data, response, _ in
         resultData = data
         statusCode = (response as? HTTPURLResponse)?.statusCode ?? 0
         semaphore.signal()
      }
      task.resume()
      semaphore.wait()
      return (resultData, statusCode)
   }
}

let sessionByID = try Session.allSessionsByID()


let events = Set(sessionByID.values.map(\.year)).sorted(by: >).map { "WWDC\($0 - 2000)" }

var contributorsByProfile: [String: Contributor] = [:]
var sessionIDsWithoutContributors: Set<String> = []
var sessionIDsByProfile: [String: Set<String>] = [:]


// MARK: - Append 'Written by' section, Related Sessions section, and Legal Footer to all Notes

for event in events {
   let eventSessionsPath = "\(FileManager.default.currentDirectoryPath)/Sources/WWDCNotes/WWDCNotes.docc/\(event)"
   guard FileManager.default.fileExists(atPath: eventSessionsPath) else { continue }

   let sessionFileNames = try FileManager.default.contentsOfDirectory(atPath: eventSessionsPath).filter { $0.hasSuffix(".md") }

   let contributorRegex = try Regex(#"@GitHubUser\(([^\n<>]+)\)"#)

   for sessionFileName in sessionFileNames {
      if let session = sessionByID.values.first(where: { $0.fileName.lowercased() + ".md" == sessionFileName.lowercased() }) {
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



         try sessionFileContents.write(toFile: sessionFilePath, atomically: true, encoding: .utf8)
      }
   }
}




// MARK: - Generate all Contributor/<Profile>.md

let contributorsPath = "\(FileManager.default.currentDirectoryPath)/Sources/WWDCNotes/WWDCNotes.docc/Contributors"
try FileManager.default.createDirectory(atPath: contributorsPath, withIntermediateDirectories: true)

for contributor in contributorsByProfile.values {
   guard let contributedSessionsIDs = sessionIDsByProfile[contributor.githubProfileName] else { continue }
   let contributedSessions = contributedSessionsIDs.compactMap { sessionByID[$0] }
   let contributedSessionByYear = Dictionary(grouping: contributedSessions, by: \.year)

   let mostActiveYear = contributedSessionByYear.min { $0.value.count > $1.value.count }?.key ?? 0

   let contributorFilePath = "\(contributorsPath)/\(contributor.githubProfileName).md"
   var contributorFileContents = """
      # \(contributor.fullName) (\(contributedSessions.count) \(contributedSessions.count > 1 ? "notes" : "note"))

      \(contributor.shortDescription)

      @Metadata {
         @TitleHeading("Contributors")
         @PageKind(sampleCode)
         @PageImage(purpose: card, source: "\(contributor.githubProfileName)")
         @PageImage(purpose: icon, source: "\(contributor.githubProfileName)")
      }

      ## Links

      \(contributor.socialLinks.map { "* [\($0)](\($1.absoluteString))" }.joined(separator: "\n"))


      ## Contributions

      Contributed \(contributedSessions.count) session \(contributedSessions.count > 1 ? "notes" : "note") in total. Their most active year was \(mostActiveYear).

      """

   for (year, sessionsInYear) in contributedSessionByYear.sorted(by: { $0.key > $1.key }) {
      contributorFileContents += """

         ### \(year)

         @Links(visualStyle: list) {
         \(sessionsInYear.map { "   - <doc:\($0.fileName)>" }.joined(separator: "\n"))
         }

         """
   }

   try contributorFileContents.write(toFile: contributorFilePath, atomically: true, encoding: .utf8)


   print("Downloading profile image from \(contributor.avatarURL)…")

   let avatarPath = "\(contributorsPath)/\(contributor.githubProfileName).jpeg"
   let avatarData = try Data(contentsOf: contributor.avatarURL)
   FileManager.default.createFile(atPath: avatarPath, contents: avatarData)
}


// MARK: - Generate Contributors.md

let contributorsOverviewFilePath = "\(FileManager.default.currentDirectoryPath)/Sources/WWDCNotes/WWDCNotes.docc/Contributors.md"
var contributorsOverviewContents = """
   # Contributors

   WWDCNotes is only possible thanks to these awesome volunteers! Contribute now to get listed here as well.

   @Metadata {
      @TitleHeading("Overview")
      @PageKind(article)
      @PageImage(purpose: icon, source: "WWDCNotes")
      @PageImage(purpose: card, source: "Contributors")
      @CallToAction(url: "/documentation/contributing/", purpose: link, label: "Become a Contributor")
   }

   @Options(scope: local) {
      @TopicsVisualStyle(compactGrid)
   }

   ## Topics

   Here's a full list of all \(sessionIDsByProfile.keys.count) people who contributed to WWDCNotes – sorted by most contributions.


   """

for (profile, _) in sessionIDsByProfile.sorted(by: { $0.value.count > $1.value.count }) {
   contributorsOverviewContents += "- <doc:\(profile)>\n"
}


try contributorsOverviewContents.write(toFile: contributorsOverviewFilePath, atomically: true, encoding: .utf8)


// MARK: - Generate MissingNotes.md

let sessionsWithoutContributorsByYear = Dictionary(grouping: sessionIDsWithoutContributors.compactMap { sessionByID[$0] }, by: \.year)

let missingNotesFilePath = "\(FileManager.default.currentDirectoryPath)/Sources/WWDCNotes/WWDCNotes.docc/MissingNotes.md"
var missingNotesContents = """
   # Missing Sessions

   This page gives you an overview of all sessions that have no notes yet. Many opportunities to contribute!

   @Metadata {
      @TitleHeading("Guide")
      @PageKind(article)
      @PageImage(purpose: icon, source: "WWDCNotes")
      @PageImage(purpose: card, source: "MissingNotes")
      @CallToAction(url: "/documentation/contributing/", purpose: link, label: "Learn How to Contribute")
   }


   """

for (year, sessions) in sessionsWithoutContributorsByYear.sorted(by: { $0.key > $1.key }) {
   missingNotesContents += """

      ## WWDC\(year - 2000) (\(sessions.count) missing)

      @Links(visualStyle: list) {
      \(sessions.sorted { $0.title < $1.title }.map { "   - <doc:\($0.fileName)>" }.joined(separator: "\n"))
      }

      """
}

try missingNotesContents.write(toFile: missingNotesFilePath, atomically: true, encoding: .utf8)


// MARK: - Generate WWDC year overview page contents

let years = Set(sessionByID.values.map(\.year))

for year in years {
   let eventName = "WWDC\(year - 2000)"
   let yearOverviewFilePath = "\(FileManager.default.currentDirectoryPath)/Sources/WWDCNotes/WWDCNotes.docc/\(eventName).md"
   var yearOverviewFileContents = try String(contentsOfFile: yearOverviewFilePath)

   let yearSessions = sessionByID.values.filter { $0.year == year }.sorted { $0.title < $1.title }

   let firstDayEventSessions = yearSessions.filter { $0.title.lowercased() == "keynote" || $0.title.lowercased() == "platforms state of the union" }
   yearOverviewFileContents += """


      ## Topics

      ### First Day Events

      @Links(visualStyle: list) {
      \(firstDayEventSessions.map { "   - <doc:\($0.fileName)>" }.joined(separator: "\n"))
      }

      """

   let newToolAndFrameworkSessions = yearSessions.filter { session in
      session.title.lowercased().starts(with: "meet ") || session.title.lowercased().starts(with: "introducing ")
   }
   yearOverviewFileContents += """
      
      ### New Tools & Frameworks

      @Links(visualStyle: list) {
      \(newToolAndFrameworkSessions.map { "   - <doc:\($0.fileName)>" }.joined(separator: "\n"))
      }

      """

   let updatedToolAndFrameworkSessions = yearSessions.filter { session in
      session.title.lowercased().replacing("'", with: "").replacing("’", with: "").starts(with: "whats new in ")
   }
   yearOverviewFileContents += """

      ### Updated Tools & Frameworks

      @Links(visualStyle: list) {
      \(updatedToolAndFrameworkSessions.map { "   - <doc:\($0.fileName)>" }.joined(separator: "\n"))
      }

      """

   let otherSessions = yearSessions.filter { !(firstDayEventSessions + newToolAndFrameworkSessions + updatedToolAndFrameworkSessions).map(\.id).contains($0.id) }
   yearOverviewFileContents += """

      ### Deep Dives into Topics

      @Links(visualStyle: list) {
      \(otherSessions.map { "   - <doc:\($0.fileName)>" }.joined(separator: "\n"))
      }

      """

   try yearOverviewFileContents.write(toFile: yearOverviewFilePath, atomically: true, encoding: .utf8)
}
