# What’s new in Create ML

Explore updates to Create ML, including interactive data source previews and a new template for building object tracking models for visionOS apps. We'll also cover important framework improvements, including new time-series forecasting and classification APIs.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10183", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(RamitSharma991)
   }
}


## Overview

Apple's ecosystem of machine learning tools, including `Create ML`, allows you to build and deploy models in your apps.

-   Create ML consists of the Create ML App, `Create ML Framework`, and underlying Components.
-   Train models with a click in the `Create ML App`.
-   Use the frameworks directly for automating model creation or on-device personalization.
-   Create ML leverages system frameworks like `Vision`, `Natural Language`, and `Sound Analysis` to customize models with your training data.
-   The output of Create ML is a model that you can deploy in your app using these system frameworks.

>   If you’re new to machine learning check out: 
    [Explore machine learning on Apple platforms](https://developer.apple.com/wwdc24/10223)

## App Enhancements

The Create ML App on your Mac is the easiest place to start building custom machine learning models.
-   Create models to predict content in images, videos, or tabular data.
-   Detect objects in images, sounds in audio files, human actions in videos, or activities.

Ensure your annotations align with your expectations before training. For example, if your app detects both a coffee cup and its surface separately, it indicates annotation issues. Avoid duplicate predictions for a better user experience.

-   In the Create ML App, view your data source distribution with the explore option.
-   Drill into specific objects or class labels to visualize annotations.
-   Preview your data source to ensure annotations match expectations, especially for image-based models like image classification and hand pose classification.



## Object Tracking
Create ML simplifies integrating machine learning into your apps across all Apple operating systems.

-   Object tracking in Create ML enhances spatial computing experiences, ideal for Apple Vision Pro.
-   The new Spatial Category in Create ML includes a template for tracking the spatial location and orientation of objects.
-   Training an object tracker begins with your training data, like all Create ML templates.
-   The Create ML App streamlines the training process.
-   Simply provide a 3D asset of your object, and the app handles the rest.

>   For a full workflow, of building an object tracking experience and deploying it on Apple Vision Pro check: 
 [Explore object tracking for visionOS](https://developer.apple.com/wwdc24/10223)

## Components

### Classification
-   Time-series in Create ML Components consists of uniformly sampled numerical data changing over time, such as:
    -   Accelerometer
    -   GPS location
    -   Temperature
-   A powerful, general-purpose time series **classifier** component now classifies gestures like pinch, snap, or clench using accelerometer data from your Apple Watch.

### Forecasting
-   Time-series forecasting is a new model type in Create ML.
-   It learns from historical data to predict future values over time.
-   The **forecaster** is a versatile component, suitable for predicting future values in various contexts, including audio, accelerometer, and sales, by analyzing historical data.

### Date Components
-   Extract date components to identify trends in the data.
-   Weekday extraction helps the model learn weekly variations, and month extraction aids in learning annual variations.
-   Use the `DateFeatureExtractor` component to easily extract features from dates.

```swift
let featureExtractor = DateFeatureExtractor<Float>(features: ([.month, .weekday])
// create a DateFeatureExtractor with month and weekday feature components.

let preprocessingEstimator = ColumnSelector<_, Date>(.include(columnNames: ["Date"]),
transformer: OptionalUnwrapper().appending(featureExtractor))
//compose a ColumnSelector and featureExtractor together into a pipeline.

.appending(
    ColumnConcatenator<Float>(
        columnSelection: .all, 
        concatenatedColumnName: "Features"
        //add a ColumnConcatenator component, to combine all the features into a shaped array.
    )
)
let preprocessor = try await preprocessingEstimator.fitted(to: dataFrame)
// use pre-processing pipeline to fit data frame

let featuresDataFrame = try await preprocessor.applied(to: dataFrame)

let features = featuresDataFrame["Features", MLShapedArray<Float>.self]
.filled(with: MLShappedArray<Float>())
let annotations = dataFrame["Quantity", Float.self]
.filled(with: 0.0)
.map({ MLShapedArray<Float>(scalars: [Float($0)], shape: [1]) })
// extract the features column and the quantity column, both as columns of MLShapedArray

```
### Features
Training a Forecaster model:
-   Split the training data into two parts:

```swift
// Training split
let trainingPortion = 0..<10_000
let training = zip(features[trainingPortion], annotations[trainingPortion])
    .map(AnnotatedFeature.init)

// Validation split
let validationPortion = 10_000..<12_000
let validation = zip(features[validationPortion], annotations[validationPortion])
    .map(AnnotatedFeature.init)

// Train
let configuration = LinearTimeSeriesForecasterConfiguration(
    inputWindowSize: 15,
    forecastWindowSize: 3
)

let estimator = LinearTimeSeriesForecaster<Float>(configuration: configuration)
let model = try await estimator.fitted(to: training, validatedOn: validation)

// Perform predictions
let predictions = try await model.applied(to: validation(\.feature))

```
-   Pick how many days in the future to predict.
-   Your context should be longer than your prediction window.
-   Create a series forecaster, configure the `inputWindowSize` and `forecastWindowSize`, and train using the fitted method.
-   Once training completes, you can make predictions.
