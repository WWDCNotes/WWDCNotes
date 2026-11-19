// swift-tools-version: 6.2
import PackageDescription

let package = Package(
   name: "Site",
   platforms: [.macOS(.v26)],
   dependencies: [
      .package(path: "../../../../SiteKit"),
      .package(url: "https://github.com/apple/swift-log.git", exact: "1.15.1"),
   ],
   targets: [
      .executableTarget(
         name: "Site",
         dependencies: [
            .product(name: "SiteKit", package: "SiteKit"),
            .product(name: "SiteKitSyntaxHighlighting", package: "SiteKit"),
         ]
      ),
   ]
)
