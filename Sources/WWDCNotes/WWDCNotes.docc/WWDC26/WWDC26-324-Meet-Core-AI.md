# Meet Core AI

Discover Core AI, Apple’s new framework for on-device AI model deployment. Tour the ecosystem, from Python libraries for converting, authoring, and optimizing models, to a Swift API for simple plug-and-play inference and advanced use cases with strict latency and memory requirements. Explore the new Core AI models repository with ready-to-run examples for popular architectures. See how deep Xcode integration, including ahead-of-time model compilation, streamlines the workflow so you can deliver smarter, more responsive app experiences.

@Metadata {
   @TitleHeading("WWDC26")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2026/324", purpose: link, label: "Watch Video (20 min)")

   @Contributors {
      @GitHubUser(mini-min)
   }
}

## Key Takeaways
- On-device inference framework for Apple Intelligence
- Convert PyTorch models to .aimodel with coreai-torch
- Run via AIModel, InferenceFunction, NDArray
- Cut latency with KV cache and AOT compilation

## Presenters
- Ben Levine, Core AI Engineer

## What is Core AI?
- Core AI is the inference framework powering on-device Apple Intelligence
- It covers the whole model deployment lifecycle
- Swift API surface for loading and running Core API models
- Runs locally on device, private, and free (no server cost)

@Image(source: "WWDC26-324-coreAI-foundation.jpeg", alt: "Core AI as the foundation for on-device Apple Intelligence")

## Model authoring
- Core AI is designed to support iteration (try things → evaluate by requirements → refine)
- Covers the deployment lifecycle — convert → optimize → verify → deploy
- Convert a PyTorch model with the `coreai-torch` Python package
  - `torch.export` to capture the graph (declare `dynamic_shapes` for variable inputs) → run decompositions → `TorchConverter` → save as a `.aimodel`

```python
import torch
import coreai_torch
# Export the torch program (declare a dynamic input shape)
seq_len = torch.export.Dim("seq_len", min=1, max=256)
exported = torch.export.export(
    pt_model, args=(example,), 
    dynamic_shapes={"features": {1: seq_len}}
)
exported = exported.run_decompositions(coreai_torch.get_decomp_table())

# Convert torch graph → Core AI graph, then save as a .aimodel
ai_program = coreai_torch.TorchConverter().add_exported_program(
    exported, input_names=["features"], output_names=["logits"],
).to_coreai()
ai_program.save_asset("SnakeTransformer.aimodel")
```

- Verify with the Core AI Python bindings that the converted numerics match the original before deploying

```python
import torch
import numpy as np
from coreai.runtime import AIModel, NDArray

pt_model = SnakeTransformer().load_checkpoint("snake.pt")
ai_model = await AIModel.load("SnakeTransformer.aimodel")
function = ai_model.load_function("main")

# PyTorch reference vs Core AI inference
with torch.no_grad():
    pytorch_logits = pt_model(torch.from_numpy(features)).numpy()[0, -1]
result = await function({ "features": NDArray(data=features) })
coreai_logits = result["logits"].numpy()[0, -1]

# Validate they match
max_diff = np.max(np.abs(pytorch_logits - coreai_logits))
assert max_diff < 0.01
```

## App integration with Core AI Model
### Step 1. Open the AI model file with Xcode
- Add the `.aimodel` to your project and open it to inspect size, op distribution, metadata, and each function's signature
- Ahead-of-time compilation and optimization happen automatically at build time

@Image(source: "WWDC26-324-open-model-with-xcode.jpeg", alt: "Opening an .aimodel in Xcode to inspect its structure")

### Step 2. Use the Core AI framework to run the model
- Three core types
  - `AIModel`: loaded from the `.aimodel` URL; used to inspect and load inference functions
  - `InferenceFunction`: a runnable object representing a single loaded compute graph (usually one `main`)
  - `NDArray`: holds multi-dimensional input and output data
- Flow: load `AIModel` → `loadFunction(named:)` → build `NDArray` inputs → `run(inputs:)` → read outputs

```swift
import CoreAI

// Load the '.aimodel' file
let model = try await AIModel(contentsOf: modelURL)

// Load the main inference function
let mainFunction: InferenceFunction = try model.loadFunction(named: "main")!

// Construct the n-dimensional input data
let inputNDArray: NDArray = nextInput()

// Run inference
var outputs = try await mainFunction.run(inputs: ["input": inputNDArray])

guard let outputNDArray = outputs.remove("output")?.ndArray else {
    // Handle unexpected missing output
}
```

- Real-world use: load the model once at init and keep the `InferenceFunction` to reuse for every prediction

```swift
struct ModelPlayer {
    let nextActionFunction: InferenceFunction

    init(modelURL: URL) async throws {
        let model = try await AIModel(contentsOf: modelURL)
        self.nextActionFunction = try model.loadFunction(named: "main")!
    }
}

extension ModelPlayer: SnakePlayer {
    mutating func chooseAction(game: SnakeGame) async throws -> Direction {
        // Create an NDArray for the next input and write board features into it
        var inputFeatures = NDArray(shape: [game.stepCount, hiddenDim], scalarType: .float32)
        writeFeatures(of: game, into: inputFeatures.mutableView())

        // Run inference and extract the expected logits output NDArray
        var outputs = try await nextActionFunction.run(inputs: ["features": inputFeatures])
        guard let logits = outputs.remove("logits")?.ndArray else {
            throw ModelError.missingOutput
        }

        return predictedDirection(from: logits.view())
    }

    func writeFeatures(of game: SnakeGame, into view: consuming NDArray.MutableView<Float>) { ... }
    func predictedDirection(from logits: NDArray.View<Float>) -> Direction { ... }
}
```

## Optimizing performance
- Profile model latency with the new Core AI instrument in Xcode

@Image(source: "WWDC26-324-profiling-model-latency.jpeg", alt: "Profiling model latency with the Core AI instrument")

### Key-value cache
- Decoding loops (like transformers) recompute keys/values for tokens already seen → cache them to avoid redundant work and keep latency stable
- Authoring (PyTorch): declare the caches with `register_buffer` so the exported program treats them as mutable state

```python
class SnakeTransformerStateful(nn.Module):
    def __init__(self, ...):
        super().__init__()
        self.register_buffer("k_cache", torch.zeros(N_LAYERS, 1, MAX_SEQ_LEN, D_MODEL))
        self.register_buffer("v_cache", torch.zeros(N_LAYERS, 1, MAX_SEQ_LEN, D_MODEL))
```

- In `forward`, read previous keys/values from the caches and write the updated ones back
- Conversion: expose the buffers as named states via `state_names`

```python
ai_program = coreai_torch.TorchConverter().add_exported_program(
    exported,
    input_names=["features", "position_ids"],
    state_names=["keyCache", "valueCache"],
    output_names=["logits"],
).to_coreai()
```

- App (Swift): add `NDArray` stored properties for the caches (`keyCache`, `valueCache`), then pass them as mutable state views to `run`

```swift
extension ModelPlayer: SnakePlayer {
    mutating func chooseAction(game: SnakeGame, snakeID: Int) async throws -> Direction {
        var stateViews = InferenceFunction.MutableViews()
        stateViews.insert(&keyCache, for: "keyCache")
        stateViews.insert(&valueCache, for: "valueCache")

        // Run inference with the KV cache states
        var outputs = try await nextActionFunction.run(
            inputs: ["features": inputFeatures],
            states: stateViews)
        // …
    }
}
```

## Additional features of Core AI
- Directly authoring self model with `Core AI PyTorch Extensions`
- Optimizing the model for Apple silicon with `Core AI Optimization`
- Define custom kernel implementations with `Metal 4`
- Learn more, <doc:WWDC26-325-Dive-into-Core-AI-model-authoring-and-optimization>

- Debug the numerics of a converted model with the `Core AI Debugger`

@Image(source: "WWDC26-324-coreAI-debugger.jpeg", alt: "The Core AI Debugger inspecting a converted model's numerics")

- See streaming Core AI activity while the app runs with the `Core AI debug gauge`

@Image(source: "WWDC26-324-coreAI-debug-gauge.jpeg", alt: "The Core AI debug gauge showing live activity")

### Specialization
- A `.aimodel` is device-independent → it must be specialized (compiled) for the target device before its first run, which can take a while for large models
- Core AI specializes lazily on first use and caches the result (later loads are fast); you control when it happens
- Check the cache first, and if it isn't ready, inform the user while it prepares

```swift
// Check if your model can be loaded from the cache
let cache = AIModelCache.default

guard let model = try cache.model(for: modelURL, options: .default) else {
    Task { @MainActor in
        informUser("Preparing AI features. This may take a while…")
    }
}
```

- Or trigger specialization ahead of time (e.g. after downloading assets) so the first inference isn't blocked

```swift
// Explicitly request specialization
try await AIModel.specialize(contentsOf: modelURL)
```

@Image(source: "WWDC26-324-specialization.jpeg", alt: "Specializing a model for the target device")

- Specialization does two things: compilation (most of the cost — segment, plan, optimize) and executable generation (artifacts tied to the device and OS)
- Shift that cost off-device with ahead-of-time (AOT) compilation → a pre-compiled model specializes much faster on the user's device

@Image(source: "WWDC26-324-peek-inside-specialization.jpeg", alt: "A peek inside specialization: compilation and executable generation")

@Image(source: "WWDC26-324-aot-compilation.jpeg", alt: "Ahead-of-time compilation moves work off the user's device")

## Wrap up
- Core AI runs on all Apple silicon: Python tools you already know, a modern Swift framework, and debugging tools
- Explore the Core AI Models repository — popular models are one command away from being converted and optimized
- Learn more in <doc:WWDC26-325-Dive-into-Core-AI-model-authoring-and-optimization>
