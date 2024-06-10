# Building Activity Classification Models in Create ML

Your iPhone and Apple Watch are loaded with a number of powerful sensors including an accelerometer and gyroscope. Activity Classifiers can be trained on data from these sensors to bring some magic to your app, such as knowing when someone is running or swinging a bat. Learn how the Create ML app makes it easy to train and evaluate one of these Core ML models. Gain a deeper understanding of how to collect the raw data needed for training. See the use of these models in action.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/426", purpose: link, label: "Watch Video (15 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## Sensors

Our devices have tons of sensors:

![][sensorsImage]

## What is an Activity Classification? 

Activity Classification is a task that allows us to recognize our pre-defined set of physical actions that the user does with their devices.

In the session, the presenter shows us an example of a Fressbee throws classifier.

An example of activity data (it’s a csv table with time stamps and `x, y, z` values):

![][trainingImage]

In Create ML we can filter which axis of which acceleration/rotation we should consider for the training, we can also define a Prediction Window Size to let Create ML know how much is the size of the sample to analyze (this way we can have multiple gestures/measurements in one table).

## Best practices

- Use relevant sensor for your motion (understand your motion)
- Collect irrelevant motions as “other”, to avoid false positive
- Provide balanced classes (same number of samples for each class/category)
- Provide raw data instead of processed device motion data

[sensorsImage]: WWDC19-426-sensors
[trainingImage]: WWDC19-426-training
[Image]: ../../../images/notes/wwdc19/426/.png