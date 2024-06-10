// swift-tools-version: 5.10
import PackageDescription

let package = Package(
    name: "WWDC Notes",
    platforms: [.macOS(.v14)],
    products: [
      .library(name: "WWDCNotes", targets: ["WWDCNotes"]),
      .executable(name: "generate-metadata", targets: ["generate-metadata"]),  // run on CI before each deployment, files not committed
      .executable(name: "generate-session-stubs", targets: ["generate-session-stubs"]),  // run manually and commit files
      .executable(name: "migrate-notes", targets: ["migrate-notes"]),  // run manually once – not needed long-term
      .library(name: "Sessions", targets: ["Sessions"]),  // internal helper
    ],
    dependencies: [.package(url: "https://github.com/apple/swift-docc-plugin", from: "1.3.0")],
    targets: [
      .target(name: "WWDCNotes"),
      .executableTarget(name: "generate-metadata", dependencies: ["Sessions"]),
      .executableTarget(name: "generate-session-stubs", dependencies: ["Sessions"]),
      .executableTarget(name: "migrate-notes", dependencies: ["Sessions"]),
      .target(name: "Sessions", resources: [.copy("sessions.json")]),
    ]
)
