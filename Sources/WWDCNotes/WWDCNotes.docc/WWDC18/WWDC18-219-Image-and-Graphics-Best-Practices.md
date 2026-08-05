# Image and Graphics Best Practices

Whether it's for UI elements or a fundamental part of your application, at some point, you have to handle images. This session is packed with engaging insight into how images are handled in iOS including discussion of UIImage, UIImageView, custom drawing in UIKit, plus advanced CPU and GPU techniques that can help you maximize performance and minimize memory footprint.

@Metadata {
   @TitleHeading("WWDC18")
   @PageKind(sampleCode)
   @CallToAction(url: "https://nonstrict.eu/wwdcindex/wwdc2018/219/", purpose: link, label: "Open on WWDCIndex")

   @Contributors {
      @GitHubUser(mini-min)
   }
}

## Key Takeaways

- 🧠 Memory cost scales with pixel size, not file size.
- 📉 Downsample images to their display size.
- 🔗 High memory raises CPU & battery cost.
- 🧵 Prefetch decoding on a serial queue to avoid thread explosion.

## Decoding: the hidden cost of images

Displaying an image involves three different kinds of storage:

1. A **data buffer** contains the encoded file bytes, such as JPEG or PNG data.
2. An **image buffer** contains the decoded, uncompressed pixels.
3. The **frame buffer** contains the final pixels that the display hardware reads.

@Row {
    @Column {
        @Image(source: "WWDC18-219-DataBuffers", alt: "Compressed data buffer loaded from the image file.")
    }
    @Column {
        @Image(source: "WWDC18-219-ImageBuffers", alt: "Decoded image buffer sized to the image's pixel dimensions.")
    }
    @Column {
        @Image(source: "WWDC18-219-FrameBuffers", alt: "Rendering the view hierarchy into the frame buffer, which the display reads at 60-120 Hz.")
    }
}

- **Decoding** is the CPU-intensive step that turns the data buffer into the image buffer, and it allocates memory that persists for the life of the image.
- Example: a 590 KB JPEG that is 2048 × 1536 pixels still needs a decoded buffer of roughly `width × height × 4 bytes` in memory.

@Row {
    @Column {
        @Image(source: "WWDC18-219-Pipeline-in-Action-1", alt: "The decoding pipeline turning a data buffer into an image buffer.")
    }
    @Column {
        @Image(source: "WWDC18-219-Pipeline-in-Action-2", alt: "The decoded image buffer rendered to the frame buffer.")
    }
}

> Tip: Memory and CPU are linked. Excessive memory usage isn't only about running out of RAM — as pressure rises, memory fragments, iOS starts **compressing memory** (raising global CPU and battery cost), and may ultimately **terminate your process**. Reducing memory is therefore also a performance and battery win.

## Downsampling

- Don't load a full-resolution image just to show it small. Decode a thumbnail sized for how it will actually be displayed.

@Image(source: "WWDC18-219-Downsampling", alt: "Downsampling a large image into a smaller image buffer before display.")

- Use `CGImageSource` with `CGImageSourceCreateThumbnailAtIndex` to build a right-sized buffer:

```swift
func downsample(imageAt imageURL: URL,
                to pointSize: CGSize,
                scale: CGFloat) -> UIImage {
    let imageSourceOptions = [kCGImageSourceShouldCache: false] as CFDictionary
    let imageSource = CGImageSourceCreateWithURL(imageURL as CFURL, imageSourceOptions)!

    let maxDimensionInPixels = max(pointSize.width, pointSize.height) * scale
    let downsampleOptions = [
        kCGImageSourceCreateThumbnailFromImageAlways: true,
        kCGImageSourceShouldCacheImmediately: true,          
        kCGImageSourceCreateThumbnailWithTransform: true,
        kCGImageSourceThumbnailMaxPixelSize: maxDimensionInPixels
    ] as CFDictionary

    let downsampledImage = CGImageSourceCreateThumbnailAtIndex(imageSource, 0, downsampleOptions)!
    return UIImage(cgImage: downsampledImage)
}
```

- In the session's example, downsampling reduced memory from **31.5 MB to 18.4 MB** for the same on-screen result.

## Prefetching without thread explosion

@Row {
    @Column {
        @Image(source: "WWDC18-219-Decoding-Scrollable-Views-1", alt: "Decoding images for a scrollable view causing thread explosion on the global queue.")
    }
    @Column {
        @Image(source: "WWDC18-219-Decoding-Scrollable-Views-2", alt: "Decoding images on a serial queue to avoid thread explosion.")
    }
}

- In scrolling views, use prefetching APIs to prepare images before they're needed.
- Dispatching all that work to the global concurrent queue causes **thread explosion**: too many blocked threads and heavy context-switching. Funnel decoding through a **serial queue** instead.

```swift
let serialQueue = DispatchQueue(label: "Decode queue")

func collectionView(_ collectionView: UICollectionView,
                    prefetchItemsAt indexPaths: [IndexPath]) {
    for indexPath in indexPaths {
        serialQueue.async {
            let downsampledImage = self.downsample(images[indexPath.row])
            DispatchQueue.main.async {
                self.update(at: indexPath, with: downsampledImage)
            }
        }
    }
}
```

## Asset catalogs

- Prefer asset catalogs over loose image files in the bundle:
  - Faster name- and trait-based lookup than searching the file system.
  - Automatic per-device app thinning.
  - Vector artwork support via **Preserve Vector Data**, letting a PDF asset re-rasterize crisply at different sizes.
- Prefer a few fixed-size raster assets over relying on vector preservation everywhere.

## Custom drawing with UIKit

@Image(source: "WWDC18-219-Custom-Drawing-Versus-UIImageView", alt: "Comparing a custom-drawn view's backing store with a UIImageView.")

- Overriding `draw(_:)` gives the view a CALayer **backing store** sized to the whole view, which can be expensive.
- Refactor large custom-drawn views into smaller subviews and lean on optimized UIView properties instead:
  - Background colors avoid a backing store (except pattern colors).
  - `cornerRadius` clips corners without extra allocations.
  - `.alwaysTemplate` rendering mode tints a single monochrome image instead of storing per-color copies.
  - A monochrome `UILabel` uses about **75% less memory** than a colored one.
- For off-screen rendering, prefer `UIGraphicsImageRenderer` over the older `UIGraphicsBeginImageContext()` — it draws into an image buffer with automatic Wide Color support.


## Advanced CPU and GPU techniques

- **Core Image**: build a `CIImage` recipe and wrap it with `UIImage(ciImage:)` so processing runs on the GPU, freeing the CPU. `UIImageView` renders `CIImage`s efficiently.
- **CVPixelBuffer**: when working with Metal, Vision, or Accelerate, pick initializers that match your existing data representation and avoid needlessly unwinding already-decoded data.
- **Framework interop**: move data between CPU and GPU deliberately so the two run in parallel, rather than just offloading work.
