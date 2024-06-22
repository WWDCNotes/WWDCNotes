# What's New in Machine Learning

Core ML 3 has been greatly expanded to enable even more amazing, on-device machine learning capabilities in your app. Learn about the new Create ML app which makes it easy to build Core ML models for many tasks. Get an overview of model personalization; exciting updates in Vision, Natural Language, Sound, and Speech; and added support for cutting-edge model types.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/209", purpose: link, label: "Watch Video (14 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



Core ML 3 runs **entirely on device**, is hardware accelerated (neural networks), and can update models locally as well.

Domains updates (reminder: all of this runs on device now):

## Vision Updates

- Image classification
- Image Similarity
- Face Capture Quality
- Human Detection
- Object Saliency: vision can figure out the main subject of a given image and let you know where it is in the image
- Attention Saliency
- Text Recognition
- Animal Detection
- Document Camera (Document recognition and auto OCR)
- Improved Object Tracker
- Improved Face Landmarks

## Natural Language Updates

- Sentiment Analysis: tells if a given phase is positive/negative etc.
- Word Embeddings: tells words similarity (topic-wise, e.g. cloudy and Thunderstorm)
- Text Catalogs
- Transfer Learning

## Speech and Sound Updates

- Speech Recognition
- Voice Analysis: beside telling you what has been spoken, voice analysis provides also how it is spoken (normal voice and more)

We can combine different CoreML Domains seamlessly, for example:  

- categorize images and assign tags to them
- use speech recognition to catalog text and find the images that match that categorization using word embeddings.

Improved compatibility with other ML creation tools (TensorFlow and others).

## Model Fine-Tuning on device

- It is now possible to create personalized model per each user, privacy, no server costs.
- This can be done in the background (see `BackgroundTasks` framework).
