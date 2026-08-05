# What’s new in the Foundation Models framework

Explore what’s new in the Foundation Models framework. Learn how to access Private Cloud Compute, integrate third-party and open source models, and work with vision capabilities. Discover context management APIs, built-in semantic search, and powerful primitives for creating agentic experiences in your apps.

@Metadata {
   @TitleHeading("WWDC26")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2026/241", purpose: link, label: "Watch Video (21 min)")

   @Contributors {
      @GitHubUser(mini-min)
   }
}

## Key Takeaways

- Deeper integrations into and beyond the OS
- Wider variety of models (on-device, PCC, third-party)
- New primitives for building agentic experiences
- Core framework going open source

## Model updates
### 1. On-Device Model

- New on-device model, rebuilt from the ground up - more intelligent, better at logic and tool calling
- iOS 26.4: new APIs for inspecting the model's context size and counting tokens
- Improved guardrails: fewer false positives
- Added Vision capabilities to the on-device model

```swift
// Attachable image types

let response = try await session.respond {
    "What animal is this?"

    Attachment(UIImage(...))

    Attachment(NSImage(...))

    Attachment(CGImage(...))

    Attachment(CIImage(...))

    Attachment(CVPixelBuffer(...))
}
```

### 2. Private Cloud Compute Language Model (PCC)

- Much bigger model than the on-device ones (32K context size)
- No account setup, authentication, or API keys to worry about
- Prompts are never stored
- No API costs for under 2M first-time downloads
- For more, see <doc:WWDC26-319-Build-with-the-new-Apple-Foundation-Model-on-Private-Cloud-Compute>.

```swift
import Foundation
import FoundationModels
import Playgrounds

#Playground {
    let session = LanguageModelSession(
        model: PrivateCloudComputeLanguageModel()
    )

    let response = try await session.respond(
        to: "How many folds are in a paper crane?",
        contextOptions: ContextOptions(reasoningLevel: .deep)
    )
}
```

### 3. Model Abstraction Layer 

- New `LanguageModel` protocol
- Allows local or server models to back a `LanguageModelSession`
- `SystemLanguageModel` and `PrivateCloudComputeLanguageModel` already conform to this protocol

@Image(source: "WWDC26-241-model-abstraction-layer.jpeg")

- Open-sourcing implementations: `CoreAILanguageModel` and `MLXLanguageModel`
- To learn more about using LanguageModels and authoring your own LanguageModel package, see <doc:WWDC26-339-Bring-an-LLM-provider-to-the-Foundation-Models-framework>
- Model abstraction layer makes using third-party models simple

> Warning: Never store private keys in your app binary.  
> Always handle tokens with a secure mechanism like OAuth or Keychain.

```swift
import Foundation
import FoundationModels
import CoreAILanguageModels
import Playgrounds

#Playground {
    let model = try await CoreAILanguageModel(
        resourcesAt: Bundle.main.resourceURL!.appending(
            path: "qwen3_0_6b_4bit",
            directoryHint: .isDirectory
        )
    )
    let session = LanguageModelSession(model: model)
}
```

- Easy to keep track of token usage

```swift
let response = try await session.respond(
    to: "Recommend a craft that doesn't require scissors.",
    contextOptions: ContextOptions(reasoningLevel: .light)
)

print(response.usage.input.totalTokenCount)
print(response.usage.input.cachedTokenCount)

print(response.usage.output.totalTokenCount)
print(response.usage.output.reasoningTokenCount)
```

## System tools

- `BarcodeReaderTool`: reads information from barcodes
- `OCRTool`: extracts structured text from images
- `SpotlightSearchTool`: fully local retrieval-augmented generation (RAG), gives the model access to up-to-date personal or domain knowledge
  - Learn more about RAG: <doc:WWDC26-246-LLM-search-using-Core-Spotlight>

@Image(source: "WWDC26-241-retrieval-argumented-generation.jpeg")

## Dynamic profiles

### Background

- Managing context and orchestrating an agentic system can involve a lot of boilerplate
- Every mode switch requires manually managing sessions and preserving the transcript
- Foundation Models introduces a declarative API, dynamic profiles → focus on what matters in the context, leave imperative control to the framework

### Usage

- Conform to the `DynamicProfile` protocol
- Initialize a session with a `DynamicProfile`
- Specify the instructions and tools for each `Profile`
- A `DynamicProfile` resolves to a single active `Profile` at any given time
  - Use conditionals to pick which `Profile` is active, and the framework handles the transition for you
  - Give the model a tool (e.g. `SwitchModeTool`) so it can switch modes on its own

```swift
struct CraftProfile: LanguageModelSession.DynamicProfile {
    let states: CraftProjectStates

    var body: some DynamicProfile {
        switch states.mode {
        case .craftAnalysis:
            Profile {
                Instructions { ... }
                RecordImageAnalysisTool()
                SwitchModeTool(states: states) // can give the model a tool
            }
        case .brainstorm:
            Profile {
                Instructions { ... }
                BrainstormRecordTool()
                // intelligently switch to the context in this mode
            }
        }
    }
}
```
    
- To keep the conversation context while varying the model or configuration per task, use modifiers
  - `.model()`: specify the model for a profile
  - `.reasoningLevel()`: ask the model to think more thoroughly

```swift
struct CraftProfile: LanguageModelSession.DynamicProfile {
    let states: CraftProjectStates

    var body: some DynamicProfile {
        switch states.mode {
        case .craftAnalysis:
            Profile { ... }
        case .brainstorm:
            Profile { ... }
                .model(states.privateCloudCompute)
                .reasoningLevel(.deep)
        }
    }
}

let session = LanguageModelSession(
    profile: CraftProfile()
)
```

## Evaluations framework

@Image(source: "WWDC26-241-evaluations-framework.jpeg")

- Language models are inherently non-deterministic → new framework to measure the quality of intelligence features
- Learn more:
  - <doc:WWDC26-335-Improve-your-prompts-by-hillclimbing-with-Evaluations>
  - <doc:WWDC26-299-Create-robust-evaluations-for-agentic-apps>
  - <doc:WWDC26-298-Meet-the-Evaluations-framework>

## Tooling and open source

- `fm` CLI: use the models from the command line with the `fm` command (macOS 27+)
- FoundationModels SDK for Python is also supported
- Foundation Models framework utilities: transcript management, skill integration, chat completions language model
- Core FoundationModels framework will be open source
