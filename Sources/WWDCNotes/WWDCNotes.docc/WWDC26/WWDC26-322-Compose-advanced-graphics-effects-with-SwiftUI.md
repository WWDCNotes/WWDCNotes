# Compose advanced graphics effects with SwiftUI

Discover how to craft rich, custom experiences by creatively composing SwiftUI layout and graphics APIs. We’ll show you how to break down complex designs and use a creative pipeline to chain simple building blocks together. Learn how to draw with layer shaders, animate with timelines, and anchor views with alignment guides.

@Metadata {
   @TitleHeading("WWDC26")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2026/322", purpose: link, label: "Watch Video (17 min)")

   @Contributors {
      @GitHubUser(mini-min)
   }
}

## Key Takeaways
- Advanced effects = composing simple pipes, not complex code
- Draw with layer shaders sampling a noise texture
- Animate with TimelineView, anchor with alignment guides

## Presenters
- Haotian Zheng, UI Frameworks Engineer

## Design breakdown
> Key: 
> SwiftUI can build "advanced" effects across an app
> - The "advanced" lies in the construction, not the complexity

- A SwiftUI app is like a pipeline: data comes in, gets transformed, and is passed along through a series of standard pipes
- For Progressive disclosure, each pipe already works on its own, but you can connect them, branch them, or merge the flows to get creative
- Example goal: a podcast app with a live-lyrics-style interface
  - animated cover art with visual effects
  - transcript that scrolls in sync with playback time
  - floating timestamp overlay on the current line

@Image(source: "WWDC26-322-goals", alt: "The design goal: a podcast app with animated cover art, time-synced transcript, and a floating timestamp")

- Break the design down into connected pipelines, asking not "what data do I need" but "how do I transform it"
  - Shader pipe: cover art image → animated visualizer
  - Time pipe: drive the shader animation from the playback state
  - Time pipe + Transcript pipe: sync the text scrolling to the current time
- The final composition merges the background and foreground pipes into one effect

@Image(source: "WWDC26-322-pipeline", alt: "Data flowing left-to-right through shader, time, and transcript pipes that merge into the final effect")

## Advanced graphics
### Full-screen cover art
- The cover art sits behind the transcript, so soften it with a `.blur` modifier so it doesn't compete with the foreground

@Image(source: "WWDC26-322-graphics-blur", alt: "Cover art blurred behind the transcript so it doesn't compete with the foreground")

```swift
Image("CoverArt")
    .blur(radius: 30)
```

### Shader effect
- An icon starts as a vector, then the GPU rasterizes it to pixels
- A shader is a program that runs on the GPU to decide which color fills each pixel
- Shader functions run in parallel
- A Metal shader can be called from SwiftUI's shader effect APIs

@Image(source: "WWDC26-322-graphics-shader", alt: "A Metal shader deciding the color of each rasterized pixel, called from SwiftUI")

- Shader effects have three types:
  - `colorEffect`: given each pixel's position and original color, return a new color (e.g. turn an image black and white)
  - `distortionEffect`: given a position, return a new position for SwiftUI to sample from (e.g. geometric effects like shear)
  - `layerEffect`: most flexible, provides the whole view's layer so you can sample adjacent pixels or the entire region (e.g. blur)

```metal
[[ stitchable ]] half4 colorEffectFunction(float2 position, half4 color, args ...)
[[ stitchable ]] float2 distortionEffectFunction(float2 position, args ...)
[[ stitchable ]] half4 layerEffectFunction(float2 position, SwiftUI::Layer layer, args ...)
```

- `.layerEffect()`: pass in the view size and a noise texture
- Shader samples the noise to offset each pixel's sampling position

@Image(source: "WWDC26-322-graphics-shader-2", alt: "A noise-driven layerEffect warping the cover art into organic color blobs")

- `uv = position / size`: the normalized coordinate telling where in the image the current pixel is
- Sample the noise texture at `uv`, then turn that value into an `offset` that shifts where the layer is sampled

- Domain warping: instead of one noise sample, sample it twice
  - the first sample gives an initial offset
  - sample the noise again at a position shifted by that offset
  - this layered-noise technique produces organic, flowing blobs

```metal
// Metal - shader with noise
[[stitchable]] half4 backgroundWarp(
    float2 position, SwiftUI::Layer layer,
    float2 size, texture2d<half> noiseTex
) {
    constexpr sampler s(address::repeat, filter::linear);
    float2 uv = position / size;
    
    half4 n = noiseTex.sample(s, uv);
    
    // domain warping
    float2 q = float2(n.r, n.g);
    n = noiseTex.sample(s, uv + q);

    float2 offset = (float2(n.r, n.g) - 0.5) * 200.0;

    return layer.sample(position + offset);
}
```

@Image(source: "WWDC26-322-graphics-shader-3", alt: "Domain warping: sampling the noise twice yields organic, flowing color blobs")

### Time-driven animation
- Shaders are stateless: no memory of the previous frame, output depends only on the parameters
- To animate, pass in a value that changes over time
- `TimelineView(.animation)` is that pipe: it fires every frame with a timestamp
- Pass the elapsed time into the shader and add it to the noise sample position, so the pattern flows

```swift
@State private var startDate = Date.now

TimelineView(.animation) { timeline in
    let elapsed = timeline.date.timeIntervalSince(startDate)
    CoverArtView()
        .layerEffect(
            ShaderLibrary.backgroundWarp(
                .float2(proxy.size),
                .image(Image("NoiseTexture")),
                .float(elapsed)
            ),
            maxSampleOffset: .zero
        )
}
```

### Time-synced scroll view
- Add time to the transcript so the current line is highlighted and centered
- Use the playback timestamp to decide the current line: it is bold and clear, the rest fade back
- With `onChange` monitoring the current line, `scrollTo(_:anchor: .center)` keeps it centered

```swift
@State private var playback = PlaybackState()

ScrollViewReader { scrollProxy in
    ScrollView {
        LazyVStack(alignment: .leading, spacing: 12) {
            ForEach(sampleTranscript) { line in
                Text(line.text)
                    .transcriptLineStyle(isCurrent:
                        line.id == playback.currentLineIndex
                    )
            }
        }
    }
    // monitor the current line change
    .onChange(of: playback.currentLineIndex, { _, i in
        scrollProxy.scrollTo(i, anchor: .center)
    })
}
```

### Floating-view attachment
- Every line keeps a timestamp overlay, but only the current line's is shown, so it never interferes with layout
- `offset` can't place a sub view on the container's edge without knowing both views' sizes
- Every view has an alignment: the point (on both axes) the layout system uses to position it
- An overlay aligns the container and sub view by their alignment points (default `.center`), like a pin through both

@Image(source: "WWDC26-322-graphics-align", alt: "A sub view aligned to its container at their default center alignment points")

```swift
Text(line.text) // Container View
    .overlay {
        Text(line.formattedTimestamp) // Sub View
    }
```

- Use `alignmentGuide` to override an alignment: move the sub view's `.bottom` guide to its own `.top` edge
- The pin then follows that point, so it sits on the edge with a purely semantic override, no manual offsetting

```swift
Text(line.text) // Container View
    .overlay(alignment: .bottomLeading) {
        Text(line.formattedTimestamp) // Sub View
            .alignmentGuide(.bottom) { $0[.top] }
    }
```

@Image(source: "WWDC26-322-graphics-align-2", alt: "An alignmentGuide override moving the timestamp to the edge of its container")
