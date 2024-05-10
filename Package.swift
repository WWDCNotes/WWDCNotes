// swift-tools-version: 5.10
import PackageDescription

let package = Package(
    name: "WWDC Notes",
    products: [.library(name: "WWDCNotes", targets: ["WWDCNotes"])],
    targets: [.target(name: "WWDCNotes"),]
)
