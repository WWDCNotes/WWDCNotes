// generate-redirect-stubs.swift
//
// Post-build tool for the GitHub Pages deploy: GitHub Pages has no server-side
// redirects, so for every OLD production URL we drop a 0-second meta-refresh HTML
// stub at the old path inside the build output.
// Google treats an immediate meta-refresh like a 301, so SEO transfers to the new
// canonical page.
//
// SiteKit already emits stubs for the explicit Redirects.yaml rules (root, framework,
// special-character session slugs, contributor pages). It cannot expand the wildcard
// rule (/documentation/wwdcnotes/* -> /documentation/:splat) into static files, so the
// ~2277 regular session URLs would have no stub. This tool generates a stub for EVERY
// old URL in the authoritative snapshot (idempotent: explicit ones get the identical
// target SiteKit already wrote), guaranteeing gapless coverage.
//
// Usage: swift generate-redirect-stubs.swift <outputDir> <redirects.yaml> <old-urls.txt> <baseURL>
//   e.g. swift generate-redirect-stubs.swift _Site ../Site/Redirects.yaml old-urls.txt https://wwdcnotes.com

import Foundation

let args = CommandLine.arguments
guard args.count == 5 else {
   FileHandle.standardError.write("usage: generate-redirect-stubs <outputDir> <redirects.yaml> <old-urls.txt> <baseURL>\n".data(using: .utf8)!)
   exit(2)
}
let outputDir = args[1]
let redirectsPath = args[2]
let oldUrlsPath = args[3]
let baseURL = args[4].hasSuffix("/") ? String(args[4].dropLast()) : args[4]

let fm = FileManager.default

func die(_ msg: String) -> Never {
   FileHandle.standardError.write((msg + "\n").data(using: .utf8)!)
   exit(1)
}

// Parse Redirects.yaml into an explicit from->to map (skip the wildcard/splat rule).
func quoted(_ line: String, key: String) -> String? {
   guard let kr = line.range(of: key + ":") else { return nil }
   let rest = line[kr.upperBound...]
   guard let a = rest.firstIndex(of: "\""), let b = rest[rest.index(after: a)...].firstIndex(of: "\"") else { return nil }
   return String(rest[rest.index(after: a)..<b])
}

guard let redirectsText = try? String(contentsOfFile: redirectsPath, encoding: .utf8) else { die("cannot read \(redirectsPath)") }
var explicit: [String: String] = [:]
var pendingFrom: String? = nil
for rawLine in redirectsText.split(separator: "\n", omittingEmptySubsequences: false).map(String.init) {
   if let f = quoted(rawLine, key: "from") { pendingFrom = f; continue }
   if let t = quoted(rawLine, key: "to"), let f = pendingFrom {
      if !f.contains("*") && !t.contains(":splat") { explicit[f] = t }
      pendingFrom = nil
   }
}

func newURL(forOld old: String) -> String {
   if old == "/" { return "/documentation/" }
   if let t = explicit[old] { return t }
   if let t = explicit[old + "/"] { return t }
   let prefix = "/documentation/wwdcnotes/"
   if old.hasPrefix(prefix) {
      let splat = String(old.dropFirst(prefix.count))
      var t = "/documentation/" + splat
      if !t.hasSuffix("/") { t += "/" }
      return t
   }
   // Should not happen for our inventory; fall back to a trailing-slash form.
   return old.hasSuffix("/") ? old : old + "/"
}

func stubHTML(newURL: String) -> String {
   return "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><meta http-equiv=\"refresh\" content=\"0; url=\(newURL)\"><link rel=\"canonical\" href=\"\(baseURL)\(newURL)\"><title>Redirecting\u{2026}</title></head><body><p>Redirecting to <a href=\"\(newURL)\">\(newURL)</a>\u{2026}</p></body></html>\n"
}

guard let oldText = try? String(contentsOfFile: oldUrlsPath, encoding: .utf8) else { die("cannot read \(oldUrlsPath)") }
let oldURLs = oldText.split(separator: "\n").map(String.init).map { $0.trimmingCharacters(in: .whitespaces) }.filter { !$0.isEmpty }

var written = 0
var explicitKind = 0
var wildcardKind = 0
for old in oldURLs {
   let new = newURL(forOld: old)
   let isExplicit = (old == "/") || explicit[old] != nil || explicit[old + "/"] != nil
   if isExplicit { explicitKind += 1 } else { wildcardKind += 1 }
   // file path: outputDir + old + /index.html (root -> outputDir/index.html)
   let rel = old == "/" ? "" : String(old.dropFirst())  // drop leading slash
   let dir = rel.isEmpty ? outputDir : outputDir + "/" + rel
   do {
      try fm.createDirectory(atPath: dir, withIntermediateDirectories: true)
      try stubHTML(newURL: new).data(using: .utf8)!.write(to: URL(fileURLWithPath: dir + "/index.html"))
      written += 1
   } catch {
      die("failed writing stub for \(old): \(error)")
   }
}

print("redirect stubs written: \(written) (explicit-mapped: \(explicitKind), wildcard-mapped: \(wildcardKind))")
print("explicit rules parsed from Redirects.yaml: \(explicit.count)")
