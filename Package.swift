// swift-tools-version: 5.10
import PackageDescription

let package = Package(
    name: "WWDC Notes",
    products: [
      .library(name: "WWDCNotes", targets: ["WWDCNotes"]),
      .executable(name: "generate-contributors-page", targets: ["generate-contributors-page"]),
      .executable(name: "generate-missing-notes-page", targets: ["generate-missing-notes-page"]),
      .executable(name: "generate-session-stubs", targets: ["generate-session-stubs"]),
      .library(name: "Sessions", targets: ["Sessions"]),
    ],
    dependencies: [.package(url: "https://github.com/apple/swift-docc-plugin", from: "1.3.0")],
    targets: [
      .target(name: "WWDCNotes"),
      .executableTarget(name: "generate-contributors-page"),
      .executableTarget(name: "generate-missing-notes-page", dependencies: ["Sessions"]),
      .executableTarget(name: "generate-session-stubs", dependencies: ["Sessions"]),
      .target(name: "Sessions", resources: [.copy("sessions.json")]),
    ]
)
