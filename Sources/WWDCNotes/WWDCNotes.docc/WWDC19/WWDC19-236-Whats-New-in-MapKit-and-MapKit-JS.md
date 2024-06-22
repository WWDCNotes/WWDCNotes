# What’s New in MapKit and MapKit JS

MapKit and MapKit JS bring fully featured Apple Maps to your app and website. See how the latest features give you more control over the base map presentation, finer-grained search and result filtering of points of interest and address information, and integration with standard data formats for custom overlays and annotations.

@Metadata {
   @TitleHeading("WWDC19")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc19/236", purpose: link, label: "Watch Video (51 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



- We can now request MapKit Snapshots from web (snapshot = basically a screenshot)
- GeoJSON Support
- New Indoor Mapping Data Format, `IMDF`, to display lots of overlays in indoor areas.

## POI Improvements

Previously we could only choose map styles like `muted`, `hybrid`, `satellite`.  
The issue with these types is that mapKit still decides what POI (Point Of Interest) to display.  
Now, thanks to `MKPointOfInterestFilter` we have an option to filter these POI based on their kind (we can explicitly say which ones we want to include or which ones we do not want to include).

## Search Results.

MapKit There have been improvements in filtering results in search requests. Basically the same as POIs above: we can choose which kind of results we want back.

## Improve Overlay performance
New [`MKMultiPolyline`](https://developer.apple.com/documentation/mapkit/mkmultipolyline) and [`MKMultiPolygon`](https://developer.apple.com/documentation/mapkit/mkmultipolygon) with associated renderers: Overlays are now vector objects instead of bitmaps (can revert back to old behaviour if needed)

## Boundaries

- `MKMapView.CameraBoundary` we can limit the area of the map where the user can pan
![][boundaryImage]
- `MKMapView.CameraZoomRange` we can set the min/max distance from the center of the screen
![][rangeImage]

[boundaryImage]: WWDC19-236-boundary
[rangeImage]: WWDC19-236-range