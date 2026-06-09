# Build with the new Apple Foundation Model on Private Cloud Compute

Private Cloud Compute lets you access powerful, frontier-class models while protecting user privacy. Explore how it works and how to access it using the Foundation Models framework. Discover best practices for checking availability and handling graceful fallbacks in your apps.

@Metadata {
   @TitleHeading("WWDC26")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2026/319", purpose: link, label: "Watch Video (11 min)")

   @Contributors {
      @GitHubUser(harrison-heinig)
   }
}

## Key Takeaways

- 🔄 Server model is a one-line swap on `LanguageModelSession` — tools and `@Generable` stay the same
- 🧠 PCC for reasoning and 32K context; on-device when you need offline with no daily cap
- 💰 Free PCC usage for apps under 2M downloads, no API keys
- 📋 Quota is per-user via iCloud — gate on `isAvailable`, surface `quotaUsage` in UI

@Image(source: "WWDC26-319-OnDeviceVsPCC")

## [Introduction](https://developer.apple.com/videos/play/wwdc2026/319?time=0)

- Private Cloud Compute (PCC) exposes a server LLM through Foundation Models
- Apple's Server Model and On-device model are accessed through the same APIs
- PCC is for workloads that need more context, reasoning, or heavy tool loops

## [What is Private Cloud Compute](https://developer.apple.com/videos/play/wwdc2026/319?time=83)

- Server model; request data isn't stored or retained after the response
- Wired into OS/iCloud — no auth setup, no API keys, no per-token billing for developers (for apps with under 2M downloads)
- Per-user daily quota (higher tier with iCloud+) for users
- Requires managed entitlement

## [Integrating PCC with Foundation Models](https://developer.apple.com/videos/play/wwdc2026/319?time=163)

- Default `LanguageModelSession()` uses on-devicemodel ; pass `PrivateCloudComputeLanguageModel()` to switch
- `@Generable`, tools, and `respond` signatures are unchanged between models
- PCC features can be gated based on a users available usage quota using `model.isAvailable`

```swift
import FoundationModels

// On-device (default)
let session = LanguageModelSession()
let response = try await session.respond(to: "Summarize this article: \(article)")

// PCC — one-line change
let pccSession = LanguageModelSession(model: PrivateCloudComputeLanguageModel())
let pccResponse = try await pccSession.respond(to: "Summarize this article: \(article)")
```

```swift
let session = LanguageModelSession(
    model: PrivateCloudComputeLanguageModel(),
    tools: [FindRelatedArticlesTool.self]
)

let response = try await session.respond(
    to: "Summarize this article: \(article)",
    generating: ArticleSummary.self  // @Generable works the same
)
```

## [On-device vs PCC](https://developer.apple.com/videos/play/wwdc2026/319?time=240)

| | On-device | PCC |
| --: | :--: | :--: |
| Offline | ✅ | ❌ |
| Daily limit | None | Per-user quota |
| `contextSize` | 4K (8K on newer devices in 27.0) | 32K |
| Reasoning | ❌ | ✅ |

## [Reasoning and context](https://developer.apple.com/videos/play/wwdc2026/319?time=272)

- Reasoning = extra transcript text before the response; levels: `.light`, `.moderate`, `.deep`
- Set via `ContextOptions(reasoningLevel:)` on `respond`
- Reasoning tokens count against `contextSize` — check the property on each model type

```swift
let response = try await session.respond(
    to: prompt,
    contextOptions: ContextOptions(reasoningLevel: .light)
)

SystemLanguageModel().contextSize          // 4096 (26.0), 8192 (27.0)
PrivateCloudComputeLanguageModel().contextSize  // 32768
```

## [Usage limits](https://developer.apple.com/videos/play/wwdc2026/319?time=430)

- Quota is per-user via iCloud, not per-app
- Surface limit state in persistent UI, not alerts
- `quotaUsage.status` has an approaching-limit case
    - Quota states can be tested through scheme settings to simulate Apple Foundation Model Availabilities

```swift
if case .belowLimit(let info) = model.quotaUsage.status, info.isApproachingLimit {
    // warn
}
if model.quotaUsage.isLimitReached {
    // disable + explain
}
if let suggestion = model.quotaUsage.limitIncreaseSuggestion {
    Button("Show options") { suggestion.show() }
}
```