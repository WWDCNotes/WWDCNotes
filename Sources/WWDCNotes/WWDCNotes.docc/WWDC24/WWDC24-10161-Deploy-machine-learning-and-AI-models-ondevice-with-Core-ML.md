# Deploy machine learning and AI models on-device with Core ML

Learn new ways to optimize speed and memory performance when you convert and run machine learning and AI models through Core ML. We’ll cover new options for model representations, performance insights, execution, and model stitching which can be used together to create compelling and private on-device experiences.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10161", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(RamitSharma991)
   }
}



## Key takeaways

🦾 Core ML enhances the deployment and execution of ML and AI models.

🧮 Integration with MLTensor for common math and transformation operations.

📈 Improve inference efficiency by leveraging stateful models.

🚀 Deploy models with multiple functionalities.

🔧 Utilize new profiling and debugging information to optimize your models

## Presenter

* Joshua Newnham, Core ML Engineer


# Integeration
The machine learning workflow consists of three main phases:

-   **Model Training**
-   **Preparation**
-   **Integration**

**Model Integration**:

-   Begins with an ML package created during the preparation phase.
-   `Core ML` simplifies integration and usage in your app, offering a unified API for on-device inference across various model types.
-   Utilizes Apple silicon’s CPU, GPU, and Neural Engine via MPS Graph and BNNS Graph for high performance, especially with Metal integration or real-time CPU inference.

**Performance Improvements**:

-   `Core ML` now delivers better performance with significant inference stack improvements.
-   iOS 18 is faster than iOS 17 for many models, with no need for recompiling or code changes.
-   Speed improvements vary by model and hardware.

**Model Integration Steps**:

-   Simple integration: pass input, read output.
-   Advanced use cases (e.g., generative AI): may require multiple models and iterative processes.
-   Additional computation outside the model may involve implementing operations from scratch or using low-level APIs, leading to complex code.




# MLTensor

### Introducing MLTensor

**Overview**:

-   `MLTensor` is a new type in Core ML for efficient computation.
-   Supports common math and transformation operations typical of machine learning frameworks.
-   Executes using Apple silicon's powerful compute capabilities for high performance.
-   Similar to popular Python numerical libraries, making it intuitive for those familiar with machine learning.

**Simplifying Large Language Models**:

-   MLTensor simplifies decoding outputs from language models.
-   Example model: An autoregressive language model predicts the next word based on preceding words.
-   Generates sentences by predicting words until an end-of-sequence token or set length is reached.
-   Outputs scores for all words in a vocabulary, representing confidence for the next word.
-   A decoder selects the next word using various strategies (e.g., highest score, random sampling).

```swift
// Introduction to MLTensor

//Creating
let xArray = MLSHapedArray<Float>(repeating: 0.0, shape: [3])
let x = MLTensor(xArray)
let y = MLTensor([[0.5, 0.1, 0.2], [0.4, 2.0, 0.4], [0.2, 0.6, -0.1]])

print("\(x.shape), \(x.scalarType)") // [3], Float
print("\(y.shape), \(y.scalarType)") // [3, 3], Float

// Math
var result = x + y 
result += 2
let mean = result.mean()

// Comparison
let mask = result .>= mean
let filtered = result * mask

//Indexing and shape transformation
let sliced = filtered[0, ...] // Shape [2, 3] -> [3]
let reshaped = sliced.reshaped(to: [1, 3]) // Shape [3] -> [1, 3] 

// Materialize to a MLShapedArray
let reshapedArray = await reshaped.shapedArray(of: Float.self) 

```

**Benefits**:

-   MLTensor requires less code to achieve the same functionality compared to low-level APIs.
-   While low-level APIs are still necessary for some tasks, MLTensor provides a concise alternative for common tasks.
-   Focus more on creating great experiences, less on low-level details.

**Summary**:

-   MLTensor offers a convenient, efficient, and high-performance way to handle common machine learning computations in Core ML.
-   Ideal for simplifying and improving tasks like decoding language model outputs.


# Models with state

**Stateless vs. Stateful Models**:

-   **Stateless Models**: Process each input independently without retaining history (e.g., image classifiers using Convolutional Neural Networks).
-   **Stateful Models**: Retain history from previous inputs (e.g., Recurrent Neural Networks for sequence data).

**Manual State Management**:

-   Traditionally, state management involves passing the state as an input and retrieving it from the output, incurring overhead especially with larger states.

**Core ML Enhancements**:

-   Core ML now supports automatic state management, reducing overhead and improving efficiency.

**Example: Language Models and KV Cache**:

-   Language models use `key-value (KV)` vectors for each word to enhance contextual predictions.
-   Previously, handling the KV cache manually added overhead.
-   Core ML can now manage the KV cache using states, leading to faster prediction times.

**Implementation**:

-   States must be explicitly added during the preparation phase of the model.
-   Verify state support in Xcode, where states appear above model inputs in the predictions tab.
-   Update code to use Core ML states:
    -   Core ML preallocates buffers for the key and value vectors.
    -   Pass the state handle instead of the cache.
    -   In-place updates eliminate the need to manually update the cache.

**Performance Improvement**:

-   Example comparison using the Mistral 7 billion model on a MacBook Pro with M3 Max:
    -   Without state: ~8 seconds
    -   With state: ~5 seconds (1.6x speedup)
-   Performance gains vary by model and hardware but demonstrate significant efficiency improvements with state support.


# Multifunction Models in Core ML

**Flexible Deployment**:

-   Core ML now supports models with multiple functionalities, represented as functions.
-   Traditionally, neural networks in Core ML consist of a single function block, but now multiple functions are supported.

- **Example: Adapters**
    -   Adapters are small modules trained with a network's knowledge for another task, extending a model's functionality without adjusting its weights.
    -   Multiple adapters can now be merged into a single model, each exposed as a separate function.
    -   Efficiently deploy models with multiple adapters without needing multiple specialized models or passing adapter weights as inputs.

# Enhanced Performance Tools

**Core ML Performance Report**:

-   Generate performance reports for any connected device without writing code.
-   Steps: Open model in Xcode → Select performance tab → Create new report → Select device and compute unit → Run test.
-   Reports include load and prediction times, compute unit usage, and estimated time for each operation.
-   Sort operations by estimated time to identify bottlenecks.
-   Hover over unsupported operations for hints on compatibility issues.

**Debugging and Profiling**:

-   Performance reports can now be exported and compared across runs to assess the impact of model changes.
-   The new MLComputePlan API offers debugging and profiling information similar to the performance report.
-   MLComputePlan API provides model structure, runtime information, supported/preferred compute devices, operation support status, and estimated relative cost for each operation.
