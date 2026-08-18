# Build agentic app experiences with the Foundation Models framework

Learn how to take your intelligence features further with Foundation Models framework primitives for dynamic context and agentic workflows. We’ll walk through engineering shared context, setting up privacy boundaries, and managing key value caching. Discover how to orchestrate smooth handoffs between local and server models.


@Metadata {
   @TitleHeading("WWDC26")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2026/242", purpose: link, label: "Watch Video (21 min)")

   @Contributors {
      @GitHubUser(VictorPuga)
   }
}

## Summary

- Dynamic Profiles empower context management and model orchestration.
- Introduce Foundation Models framework utilities for building agent experiences.
- Patterns include "baton-pass" and "phone-a-friend" for agent orchestration.
- Customize tool calling modes and manage session transcripts.
- Evaluate performance impacts using the new Xcode Instruments.

@Image(source: "WWDC26-242-agents.jpeg", alt: "AI Agents")

## Presenters

- Erik Hornberger, Swift AI Frameworks
- Oliver O'Neill, Apple Intelligence Platform

## Dynamic Profiles Overview

- **Dynamic Profiles**: Allow context management and model boundary definition.
- **APIs**: Enable switching between models and configurations within `LanguageModelSession`.

@Image(source: "WWDC26-242-dynamic-profiles.jpeg", alt: "Dynamic Profiles")

## Key Features

- **Foundation Models Framework Utilities**: Open source Swift package for agentic experiences.
- **Profiles**: Configurations with instructions, tools, and modifiers.
- **Dynamic Instructions**: Group relevant tools and instructions; composable for reuse.

```swift
// DynamicInstructions

struct BrainstormFacilitator: DynamicInstructions {
   var orchestrator: CraftOrchestrator
   var body: some DynamicInstructions {
         Instructions {
            "You are a warm and friendly expert crafting brainstorm facilitator."
         }
         // Tools
         GenerateProjectTitle()
         // Conditionally include Origami knowledge
         if orchestrator.techniques.contains(.origami) {
            OrigamiExpert()
         }
   }
}
```

```swift
// DynamicProfile

struct CraftProfile: LanguageModelSession.DynamicProfile {
   var orchestrator: CraftOrchestrator
   var body: some DynamicProfile {
         switch orchestrator.mode {
         case .brainstorming:
            Profile { BrainstormFacilitator(orchestrator: orchestrator) }
               .model(orchestrator.pccLanguageModel)
               .temperature(1)
         case .planning:
            Profile { TutorialAuthor(orchestrator: orchestrator) }
               .model(orchestrator.pccLanguageModel)
               .reasoningLevel(.deep)
         case .reviewing:
            Profile { CraftCoach() }
               .model(orchestrator.systemLanguageModel)
         }
   }
}
```

```swift
// Initialize your session with your dynamic profile

let session = LanguageModelSession(profile: CraftProfile(orchestrator: orchestrator))
```

## Session Management

- **Transcript Management**: Use `historyTransform` and custom modifiers to adjust model context.
- **Lifecycle Modifiers**: Execute code at session lifecycle points, e.g., `onResponse`.
- **Session Properties**: Define state shared across session components.

@Image(source: "WWDC26-242-lifecycle-modifiers.jpeg", alt: "Lifecycle Modifiers")

```swift
// Transcript management

struct CraftProfile: LanguageModelSession.DynamicProfile {
   var orchestrator: CraftOrchestrator
   var body: some DynamicProfile {
         switch orchestrator.mode {
         case .reviewing:
            Profile { CraftCoach() }
               .model(orchestrator.systemLanguageModel)
               .historyTransform { history in
                     // Update the history for your profile
                     guard let latestResponseIndex = lastResponseEntryIndex(history) else {
                        return history
                     }
                     let filteredHistory = history[0..<latestResponseIndex].filter { entry in
                        isToolCallsOrToolOutput(entry)
                     }
                     return filteredHistory + history[latestResponseIndex...]
               }
         }
   }
}
```

```swift
// Custom modifiers

struct DroppingToolCallsProfileModifier: LanguageModelSession.DynamicProfileModifier {
   func body(content: Content) -> some DynamicProfile {
         content
            .historyTransform { history in
               guard let latestResponseIndex = lastResponseEntryIndex(history) else {
                     return history
               }
               let filteredHistory = history[0..<latestResponseIndex].filter { entry in
                     isToolCallsOrToolOutput(entry)
               }
               return filteredHistory + history[latestResponseIndex...]
            }
   }
}

extension LanguageModelSession.DynamicProfile {
   func droppingCompletedToolCalls() -> some DynamicProfile {
         self.modifier(DroppingToolCallsProfileModifier())
   }
}
```

```swift
// History management modifiers

import FoundationModelsUtilities

struct CraftProfile: LanguageModelSession.DynamicProfile {
   var orchestrator: CraftOrchestrator
   var body: some DynamicProfile {
         switch orchestrator.mode {
         case .reviewing:
            Profile { CraftCoach() }
               // Keep the most recent 10 entries
               // after dropping finished tool calls
               .rollingWindow(size: .entries(10))
               .droppingCompletedToolCalls()
         }
   }
}
```

```swift
// Lifecycle modifiers

struct CraftProfile: LanguageModelSession.DynamicProfile {
   @SessionProperty(\.history) var history
   var orchestrator: CraftOrchestrator
   var body: some DynamicProfile {
         switch orchestrator.mode {
         case .planning:
            Profile { TutorialAuthor(orchestrator: orchestrator) }
               .model(orchestrator.pccLanguageModel)
               .reasoningLevel(.deep)
               .onResponse {
                     // Update history
                     if history.count > 50, let responseIndex = lastResponseIndex(history) {
                        history = history[responseIndex...]
                     }
               }
         }
   }
}
```

## Agent Orchestration Patterns

- **Baton-pass**: Collaboration between profiles with shared transcript history.
- **Phone-a-friend**: Consultation with isolated transcripts for each session.

```swift
// Baton-pass

struct CraftProfile: LanguageModelSession.DynamicProfile {
   var orchestrator: CraftOrchestrator
   var body: some DynamicProfile {
         switch orchestrator.mode {
         case .brainstorm:
            Profile {
               BrainstormInstructions()
               BatonPassTool()
            }
            .onToolCall { orchestrator.mode = .tutorial }
            .model(orchestrator.serverModel)
         case .tutorial:
            Profile {
               TutorialInstructions()
               BatonPassTool()
            }
            .onToolCall { orchestrator.mode = .brainstorm }
            .model(orchestrator.systemModel)
         }
   }
}
```

```swift
// Phone-a-friend

struct CraftProfile: LanguageModelSession.DynamicProfile {
   var body: some DynamicProfile {
         Profile {
            BrainstormInstructions()
            PhoneFriendTool(
               name: "generate_title",
               description: "Generate a creative project title",
               profile: TitleProfile()
            )
         }
   }
}

struct PhoneFriendTool<P: LanguageModelSession.DynamicProfile>: Tool {
   func call(arguments: GeneratedContent) async throws -> String {
         let session = LanguageModelSession(profile: profile())
         let response = try await session.respond(to: arguments)
         return response.content
   }
}
```

## Tool Calling Mode

- **Modes**: `allowed`, `disallowed`, `required` for controlling tool call behavior.
- **Error Handling**: Use `transcriptErrorHandlingPolicy` to manage transcript state after errors.

```swift
// The skills pattern

struct CraftingSkills: LanguageModelSession.DynamicInstructions {
   var activations: SkillActivations
   var body: some DynamicInstructions {
         Skills(activations: activations) {
            Skill(
               name: "origami_folds",
               description: "Details about specific types of folds",
               prompt: """
                     Valley Fold: Paper is folded toward you, creating a V-shaped crease
                     Mountain Fold: Paper is folded away from you, creating an inverted V
                     ...
                     """
            )
            Skill(...)
            Skill(...)
         }
   }
}
```

```swift
// Tool calling mode

public struct ToolCallingMode: Sendable {
   public static let allowed: ToolCallingMode
   public static let disallowed: ToolCallingMode
   public static let required: ToolCallingMode
}

// Pass tool calling mode as a profile modifier
struct OrigamiExpert: LanguageModelSession.DynamicProfile {
   var body: some LanguageModelSession.DynamicProfile {
         Profile {
            Instructions("You are an origami expert")
            QueryOrigamiDatabaseTool()
            ShowDirectionsTool()
         }
         .toolCallingMode(.required)
   }
}

// Or pass it as a generation option
let response = try await session.respond(
   to: "Write out the instructions for folding a paper crane.",
   options: GenerationOptions(toolCallingMode: .required)
)
```

```swift
// Escaping a tool call loop

struct OrigamiExpert: LanguageModelSession.DynamicProfile {
   let state: OrigamiAppState

   var body: some LanguageModelSession.DynamicProfile {
         Profile {
            Instructions("Answer questions about how to fold origami")
            QueryOrigamiDatabaseTool()
         }
         .toolCallingMode(state.queriedDatabase ? .disallowed : .required)
         .onToolCall { state.queriedDatabase = true }
   }
}
```

## Performance Considerations

- **KV Caches**: Affected by transcript mutations; measure using Xcode Instruments.
- **Evaluation Framework**: Use for optimizing context engineering strategies.

## Recommendations

- **Sample App**: Experiment with new APIs and Xcode Instrumentation.
- **Evaluations**: Create eval sets to measure context strategy impacts.
