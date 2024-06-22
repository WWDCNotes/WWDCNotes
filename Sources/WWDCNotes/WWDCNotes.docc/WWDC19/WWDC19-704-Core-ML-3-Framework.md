# Core ML 3 Framework

Core ML 3 now enables support for advanced model types that were never before available in on-device machine learning. Learn how model personalization brings amazing personalization opportunities to your app. Gain a deeper understanding of strategies for linking models and improvements to Core ML tools used for conversion of existing models.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/704", purpose: link, label: "Watch Video (40 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## On device model personalization

- Previously only bundles in the app
- Apple has intentionally avoided trying to load models from the cloud as this compromises privacy and scalability
- Provide some new training examples and receive a new model
- Demo uses pencil kit to capture input drawing and find a emoji. With the new API the user can train the model to understand the user’s way of drawing.
  - Import an editable CoreML model this model has some parameters for updating declared 
  - CoreML generates some classes to work with these inputs
  - To update: 
    - Load the model from the bundle
    - Prepare the training data
    - Create an MLUpdateTask which async produces a CoreML model

- We can update the model in the background. iOS will give you up to several minutes (see notes on the background tasks framework)

In short, Core ML 3 lets us update the model entirely locally (ad-hoc for the given user).

## What’s inside a MLmodel

| ![][ml2Image] | ![][ml3Image] |
| Core ML 2 | Core ML 3 |

In CoreML 2 models consist mostly of:

- Parameters: things like the weights of the layers, if it's a neural network for example
- Metadata: licensing and authors
- Interface: describes how our app can interact with this model.

What’s new on CoreML 3: 

- Update parameters: describes what parts of the model are updatable and how it's updatable.
- Update Interface: model interface our app can leverage to make these updates happen.

## Neural Networks

Neural networks are great at solving challenging task, such as understanding the content of an image or a document or an audio clip.

![][segmentationImage]

- Core ML 3 has more advanced features available for Control flow in Neural Networks (e.g. Branching, Loops)
- Internal improvements: Made existing layers more generic, control flow, add new mathematical operations
![][layersImage]

## BERT in depth

BERT (**B**idirectional **E**ncoder **R**epresentation from **T**ransformers) is state of the art machine learning model.

The BERT model is actually a neural network that can perform multiple tasks for natural language understanding. 

Inside the BERT model there are a bunch of modules. 

And inside these modules there are a bunch of layers.

![][tokenizedImage]

(Models on the left, layers on the right)

In short this is what’s happening behind the scenes of the demo:
![][whenImage]
![][whenImage]

## Other improvements

- Linked Models: Shared models between pipelines.
- Image Features: now images (from url, or `CGImageSource`) are supported for models rather than just pixel buffers.  
- `MLModelConfiguration` can set preferred MetalDevice (use full for multi GPU env) and an option to speed up the performance of the GPU calculations (at accuracy cost).

[ml2Image]: WWDC19-704-ml2
[ml3Image]: WWDC19-704-ml3
[segmentationImage]: WWDC19-704-segmentation
[layersImage]: WWDC19-704-layers
[tokenizedImage]: WWDC19-704-tokenized
[whenImage]: WWDC19-704-when
[when2Image]: WWDC19-704-when2