# Discover machine learning & AI frameworks on Apple platforms

Tour the latest updates to machine learning and AI frameworks available on Apple platforms. Whether you are an app developer ready to tap into Apple Intelligence, an ML engineer optimizing models for on-device deployment, or an AI enthusiast exploring the frontier of what is possible, we’ll offer guidance to help select the right tools for your needs.

@Metadata {
   @TitleHeading("WWDC25")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2025/360", purpose: link, label: "Watch Video (19 min)")

   @Contributors {
      @GitHubUser(harrison-heinig)
   }
}

## Key Takeaways

- 📱 Foundation Models framework provides access to the on-device language model
- 📌 ML-Powered APIs assist in complex tasks for specific use-cases
- 🍺 You can bring your own model to device
- 💻 MLX helps you tune and train models on Apple Silicon

@Image(source: "WWDC25-360-Summary")

## Presenters
- Jaimin Upadhyay, Core ML

## Platform Intelligence
- ML and AI are used through the platform to provide powerful features and experiences
- A wide range of ML-powered APis are available to provide functionality in your app
- Foundation Models framework allows apps to access the on-device language model

## ML-Powered APIs

| Framework | Use |
| --- | --- |
| Vision | Understand the content of images and videos |
| Natural Language | Identify language, parts of speech, and named entities in natural language text |
| Translation | Perform text translations between multiple languages. |
| Sound Analysis | Recognize many categories of sound |
| Speech | Identify and transcribe spoken words in audio |
| Foundation Models | Access to an on-device language model specialized for everyday tasks |

### Image Generation
- Image Playground Framework provides SwiftUI extensions to bring up the `imagePlaygroundSheet`
- `ImageCreator` allows you to create images programmatically

```swift
import ImagePlayground

let creator = try await ImageCreator()

let images = creator.images(
   for: [.text("A cat wearing mittens.")],
   style: selectedStyle,
   limit: 4
)

for try await image in images {
   doStuff(with: image.cgImage)
}
```

### Smart Reply
- Allows users to choose generated smart replies for messages and emails.
- The context must be donated to the keyboard to use Smart Reply

```swift
let context = UIMailConversationContext()
context.entries = ...

...

entryField.conversationContext = context

...

func textField(_ :UITextField, insertInputSuggestion inputSuggestion: UIInputSuggestion) {
   ...

   entryField.text = generateLongForm(from: inputSuggestion)
}
```

## Foundation Models Framework
- Provides programmatic access to a highly optimized on-device language model specialized for everyday tasks
- User's data stays private and doesn't need to be sent anywhere
- No cost to developers or users
- Features work offline

```swift
import FoundationModels

let session - LanguageModelSession()

let response = try a wait session.respond(to: "Tell a joke")

```

#### Structured Responses
- Foundation Models framework can provide structured responses within your app
- Mark types as `@Generable` to allow Foundation Models framework to generate the type
   - Use `@Guide` to provide natural language guides for properties

```swift
let prompt = "Generate a list of suggested search terms for an app about visiting famous landmarks."

let response = try await session.respond(
   to: prompt,
   generating: SearchSuggestions.self
)

@Generable
private struct SearchSuggestions {
   @Guide(description: "A list of suggested search terms", .count(4))
   var searchTerms: [SearchTerm]
}

@Generable
struct SearchTerm: Identifiable, Equatable {
   @Guide(description: "A unique id", .pattern(\search-term-\(d/))
   var id: String

   @Guide(description: "A 2-3 word search term, like 'Beautiful sunsets'")
   var content: String
}
```

#### Tool Calling
- The foundation model data is fixed in time and does not contain recent events
- Tool calling let you provide additional data to the model
- Tools can take real actions, in your app, on the system, or in real world.

## Vision

- Includes 30 APIs for different types of image analysis

### New APIs
- Document Recognition can group document structures making it easier to process and understand documents
- Lens Smudge Detection helps identify smudges on a camera lens

## Speech
- `SFSpeechRecognizer` works well for short-form dictation

### New APIs

- `SpeechAnalyzer` supports many more use cases and is run completely on device
- A new speech-to-text model that is faster and more flexible

## ML Models
- All previously mentioned APIs access models built into the system
- Any model can be brought to the device in a Core ML format.
    - A collection of open models in the Core ML format is available on [developer.apple.com](https://developer.apple.com/machine-learning/models/)
- MLX provides access to state-of-the-art models and the ability to fine tuning and train on Apple Silicon machines. 
