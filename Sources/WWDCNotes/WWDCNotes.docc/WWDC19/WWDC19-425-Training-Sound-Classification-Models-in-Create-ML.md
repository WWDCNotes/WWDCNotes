# Training Sound Classification Models in Create ML

Learn how to quickly and easily create Core ML models capable of classifying the sounds heard in audio files and live audio streams. In addition to providing you the ability to train and evaluate these models, the Create ML app allows you to test the model performance in real-time using the microphone on your Mac. Leverage these on-device models in your app using the new Sound Analysis framework.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/425", purpose: link, label: "Watch Video (20 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



Sound classification is the task of taking a sound, and placing it into one of many categories. 

Different ways to categorize the sound:

- Instrument/object that made the sound (guitar/drums)
- Location/texture of the sound (Nature/City), even when there’s no particular sound that necessarily stands out
- Attributes/property of the sound (Laugh/cry)

When we tell Create ML to train a new model, the first thing Create ML is going to be doing when training this model is walking through each of the sound files we provided, and extracting audio features across the entire file.

When testing, we can pass a sound with multiple classes: CreateML will separate each recognized class by time. We can even do microphone recording and see CreateML recognizing things live! How cool is that?

New framework for sound recognition: [`SoundAnalysis`](https://developer.apple.com/documentation/soundanalysis).
