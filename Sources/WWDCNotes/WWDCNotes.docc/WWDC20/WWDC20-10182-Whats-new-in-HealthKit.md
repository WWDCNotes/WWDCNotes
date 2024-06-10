# What's new in HealthKit

HealthKit is an essential framework that integrates first- and third-party health and fitness data to help people manage their personal health information. Learn about HealthKit’s latest updates, which provide read access to electrocardiograms on Apple Watch and log and track over a dozen new symptoms and their severity. We’ll also go through the latest mobility data types like walking speed and step length to help people monitor and understand their mobility over time.

@Metadata {
   @TitleHeading("WWDC20")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc20/10182", purpose: link, label: "Watch Video (6 min)")

   @Contributors {
      @GitHubUser(mike011)
      @GitHubUser(zntfdr)
   }
}



## Tracking Symptoms

30 Symptoms data types have been added to Health Kit this year, they are shown below.

![][symptoms]

## Electrocardiogram (ECG)

ECG samples can now be read as an [`HKElectrocardiogram`][hkElectroDoc]:

```swift
/// Represents a collection of voltage measurements.
class HKElectrocardiogram: HKSample {
  var classification: HKElectrocardiogram.Classification 
  var symptomsStatus: HKElectrocardiogram.SymptomsStatus 
  var averageHeartRate: HKQuantity? 
  var samplingFrequency: HKQuantity? 
  var number0fVoltageMeasurements: Int 
}
```

Here's the description and documentation reference for such properties:

- [`classification`][classDoc]: reports whether if the user is in [Atrial fibrillation][afWiki] or not.
- [`symptomsStatus`][syDoc]: tells us whether the user has any associated a symptom when this ECG was recorded.
- [`averageHeartRate`][avgDoc]: user’s average heart rate during the ECG.
- [`samplingFrequency`][samplDoc]: the watch sample frequency during the ECG.
- [`numberOfVoltageMeasurements`][voltDoc]: the number of measurements that make up this ECG.

If you want individual measurements you have to run the [`HKElectrocardiogramQuery`][queryDoc]:

```swift
// Query 
class HKElectrocardiogramQuery: HKQuery {
  public enum Result {
    case measurement(HKElectrocardiogram.VoltageMeasurement)
    case error(Error)
    case done 
  }

  public convenience init(
    _ ecg: HKElectrocardiogram, 
    dataHandler: @escaping (HKElectrocardiogramQuery, HKElectrocardiogramQuery.Result) -> Void
  )
}
```

## Mobility

New set of mobility types:

- walking speed and step length
- walking asymmetry and double support percentage
- stair ascent and descent speed
- six minute walk test

[symptoms]: hk2020.png

[hkElectroDoc]: https://developer.apple.com/documentation/healthkit/hkelectrocardiogram
[classDoc]: https://developer.apple.com/documentation/healthkit/hkelectrocardiogram/3551981-classification
[afWiki]: https://en.wikipedia.org/wiki/Atrial_fibrillation
[syDoc]: https://developer.apple.com/documentation/healthkit/hkelectrocardiogram/3551984-symptomsstatus
[avgDoc]: https://developer.apple.com/documentation/healthkit/hkelectrocardiogram/3551980-averageheartrate
[samplDoc]: https://developer.apple.com/documentation/healthkit/hkelectrocardiogram/3551983-samplingfrequency
[voltDoc]: https://developer.apple.com/documentation/healthkit/hkelectrocardiogram/3551982-numberofvoltagemeasurements
[queryDoc]: https://developer.apple.com/documentation/healthkit/hkelectrocardiogramquery
