# What’s new in image understanding

Unlock powerful image understanding with the latest Vision framework and Foundation Models framework updates. The new tap-to-segment request lets you segment images in new ways, and Vision now supports watchOS. Combine the new image support in Apple Foundation Model together with OCR, barcode scanning and your own tools to deliver LLM-powered visual understanding in your app.

@Metadata {
   @TitleHeading("WWDC26")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2026/237", purpose: link, label: "Watch Video (15 min)")

   @Contributors {
      @GitHubUser(mini-min)
   }
}

## Key Takeaways

- 👆 Segment any object with tap-to-segment
- 🧠 Analyze images with Foundation Models
- 🛠️ Build image-based tools with Vision and tool calling
- ⌚ Vision now supports watchOS

## Segment images with tap-to-segment

- Vision's tap-to-segment API: choose any object in an image to segment
- Several ways to select an object:
  - Choose a point - good for simple objects
  - Draw a bounding box around the objects - for complex objects
  - Draw a lasso around an object
  - Draw a scribble

@Row { 
    @Column { 
        @Image(source: "WWDC26-237-segment-choose-a-point.jpeg") 
    } 
    @Column { 
        @Image(source: "WWDC26-237-segment-bounding-box.jpeg") 
    } 
} 
@Row { 
    @Column { 
        @Image(source: "WWDC26-237-segment-lasso.jpeg") 
    } 
    @Column { 
        @Image(source: "WWDC26-237-segment-scribble.jpeg") 
    } 
}

- `GenerateIterativeSegmentationRequest` - generates a mask of the segmented object

```swift
let handler = ImageRequestHandler(image)
let request = GenerateIterativeSegmentationRequest(point: point)
let observation = try await handler.perform(request)
let mask = observation?.pixelBuffer

// Refine the mask with a new point
request.addIncludedPoint(newPoint)
let refinedObservation = try await handler.perform(request)
```

> Tip: Download the model before performing the request using `request.downloadAssets()`

## Analyze images using Foundation Models

- Models do well at descriptive tasks, e.g. generating captions
- Simple API

```swift
import FoundationModels

let prompt = Prompt {
    "Generate a caption for this image"
    Attachment(image)
}
let response = try await session.respond(to: prompt)
let caption = response.content
```

- Multiple ways to analyze images:
  - Foundation Models: uses an LLM, works across a wide range of tasks
  - Vision framework: uses a fixed set of CV APIs, optimized for specific tasks, and fast

## Create image-based tools

- Don't always have to choose between Vision and Foundation Models
- Bring Vision's expertise into Foundation Models through tool calling

@Image(source: "WWDC26-237-tool-calling.jpeg") 

- Tool calling supports image arguments - pass a reference to the image, not the whole image

```swift
// Create an image-based tool

import FoundationModels

struct PlantIdentifierTool: Tool {
    @SessionProperty(\.history) var history

    @Generable
    struct Arguments {
        var image: ImageReference
    }

    func call(arguments: Arguments) async throws -> String {
        let imageReference = arguments.image
        let transcript = Transcript(history)
        guard let imageAttachment = imageReference.resolve(in: transcript) else {
            throw AppError.imageNotFound
        }

        let image = try imageAttachment.pixelBuffer()
        return classifyPlant(image)
    }
}
```

- Tools add a lot of utility, especially for tasks models don't do well
- For common tasks, Vision provides ready-made tools:
  - Barcode reader tool - barcodes and QR codes
  - OCR tool - fine or dense text
  - Can also build your own tools with Vision

```swift
// Use Vision tools

import FoundationModels
import Vision

let session = LanguageModelSession(model: model, tools: [BarcodeReaderTool()])

let response = try await session.respond(generating: EventInfo.self) {
    "Get the date, location, and website from this flyer"
    Attachment(image)
        .label("flyer") // the model identify which image to pass to the tool
}
```

## Explore Vision on watchOS

- Vision now supported on watchOS
- Saliency analysis - identify subjects of interest in a photo
- Crop the image to feature the main subject more prominently

@Row { 
    @Column { 
        @Image(source: "WWDC26-237-saliency-before.jpeg") 
    } 
    @Column { 
        @Image(source: "WWDC26-237-saliency-after.jpeg") 
    } 
}

```swift
func generateImageCrop(in image: CGImage) async throws -> NormalizedRect? {
    let request = GenerateObjectnessBasedSaliencyImageRequest()
    let observation = try await request.perform(on: image)
    let prominentObjects = observation.salientObjects
    return prominentObjects.first
}
```
