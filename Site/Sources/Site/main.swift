import SiteKit

// Renders the WWDCNotes DocC catalog (Sources/WWDCNotes/WWDCNotes.docc) to a
// static, AI-fetchable SiteKit site. Run from this package directory so the
// SiteConfig.yaml + the catalog path resolve relative to it.
try SiteBuilder.docc(configPath: "SiteConfig.yaml").run()
