// swift-tools-version: 5.10
import PackageDescription

let package = Package(
    name: "WWDC Notes",
    products: [
      .library(name: "WWDCNotes", targets: ["WWDCNotes"]),
      .executable(name: "add-session-metadata", targets: ["add-session-metadata"]),
      .executable(name: "generate-contributors", targets: ["generate-contributors"]),
      .executable(name: "generate-missing-notes", targets: ["generate-missing-notes"]),
      .executable(name: "generate-session-stubs", targets: ["generate-session-stubs"]),
      .library(name: "Sessions", targets: ["Sessions"]),
    ],
    dependencies: [.package(url: "https://github.com/apple/swift-docc-plugin", from: "1.3.0")],
    targets: [
      .target(name: "WWDCNotes"),
      .executableTarget(name: "add-session-metadata", dependencies: ["Sessions"]),
      .executableTarget(name: "generate-contributors"),
      .executableTarget(name: "generate-missing-notes", dependencies: ["Sessions"]),
      .executableTarget(name: "generate-session-stubs", dependencies: ["Sessions"]),
      .target(name: "Sessions", resources: [.copy("sessions.json")]),
    ]
)
