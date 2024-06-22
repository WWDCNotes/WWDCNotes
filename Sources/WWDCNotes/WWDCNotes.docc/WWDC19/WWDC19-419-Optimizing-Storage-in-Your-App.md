# Optimizing Storage in Your App

How you store data in your app affects not only disk footprint, but also the performance of your app and the battery life of the device. Learn techniques for optimizing data serialization, working with images, and syncing to disk. Find out how to take advantage of features in SQLite to improve performance and safety.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/419", purpose: link, label: "Watch Video (37 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## HEIC Images

Use HEIC instead of jpeg (~50% the size, similar quality).

It also let:

- to Store auxiliary images (depth, disparity, and so on) 
- Supports alpha
- Lossless compression
- Multiple images in a single container 

Available from iOS 11.

## Assets Catalog

Use AssetsCatalog for free optimizations like app slicing and more.

## Drive Usage

Try to minimize read/write of files in disk, even on small files (<4KB).
Don’t use `info.plist` and JSON files as databases, use core data instead.

CoreData has CloudKit integration with iOS 13.

Lots of tips on SQLite performance.

## File Activity Instrument

Use the File Activity Instrument to see how your app behaves file-wise.

The session ends with a 10 minutes overview on the file activity instrument, where the guy explains how to use the system cache as much as possible.


