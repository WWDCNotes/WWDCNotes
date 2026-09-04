# Meet the Music Understanding framework

Discover Music Understanding, a new framework that lets your app analyze audio across six dimensions, on device: key, rhythm, structure, pace, instrument activity, and loudness. And use the Music Understanding Lab sample app to visualize each result.

@Metadata {
   @TitleHeading("WWDC26")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2026/253", purpose: link, label: "Watch Video (16 min)")

   @Contributors {
      @GitHubUser(mini-min)
   }
}

## Key Takeaways
- 🎼 Analyzes audio entirely on device
- 🥁 Six dimensions: key, rhythm, structure, pace, instruments, loudness
- ⚡️ Request only the analysis types you need
- 📊 Music Understanding Lab sample visualizes all of them

## Presenters
- Conner Richardson, Computational Music

## Musical features
- Music Understanding analyzes a song across six dimensions, the building blocks of the framework
  - **Key**, **Rhythm**, **Structure**, **Pace**, **Instrument activity**, **Loudness**

@Image(source: "WWDC26-253-music-building-blocks")

- **Rhythm:** pulse of a song, driven by individual beats
  - Beats build into bars
  - Number of beats in one minute is beats per minute (**bpm**)
- **Structure:** three levels of hierarchy, built up from the rhythm
  - **Phrases:** bars form phrases, which are musical sentences
  - **Segments:** phrases combine into segments, creating a more complete musical statement
  - **Sections:** segments build the sections, like a chorus, verse, intro, or bridge
- **Instrument activity:** instruments such as drums, bass, or vocals playing at different times and at different intensities
- **Key:** common set of notes those instruments play around, for example C major
- **Pace:** how fast a part of the song feels
  - Song can have a consistent pulse or bpm, but different parts may feel slower or faster
- **Loudness:** song may sound louder at some points than others

## Framework overview

@Image(source: "WWDC26-253-framework-integration")

- Apps interact with [`MusicUnderstandingSession`](https://developer.apple.com/documentation/musicunderstanding/musicunderstandingsession) at a high level
- Initialize with either an `AVAsset` or a custom audio provider
- To start analysis, call `analyze()` and await results
- Everything runs on device, so analyzed audio stays private and works offline
- Framework analyzes for all analysis types by default
  - For highest performance, use `analyze(for:)` to specify the [`AnalysisType`](https://developer.apple.com/documentation/musicunderstanding/analysistype)s you are interested in and avoid unnecessary computations
- Session is single use. Call `analyze()` only once per instance and create a new session for another pass

### Initialize the session

```swift
import MusicUnderstanding

.fileImporter(isPresented: $isPresented, allowedContentTypes: [.audio]) { result in
    switch result {
    case .success(let url):
        let asset = AVURLAsset(url: url,
                               options: [AVURLAssetPreferPreciseDurationAndTimingKey : true])
        let session = try await MusicUnderstandingSession(asset: asset)
        let results = try await session.analyze()
    }
}
```

- Set `AVURLAssetPreferPreciseDurationAndTimingKey` to `true` for most accurate results

### Results
- All results are contained in a [`SessionResult`](https://developer.apple.com/documentation/musicunderstanding/musicunderstandingsession/sessionresult) struct
  - Every analyzed feature gets its own results field, all optionals

```swift
public struct SessionResult: Codable, Sendable {
    public let instrumentActivity: InstrumentActivityResult?
    public let key: KeyResult?
    public let loudness: LoudnessResult?
    public let pace: PaceResult?
    public let rhythm: RhythmResult?
    public let structure: StructureResult?
}
```

- `analyze()` populates all results
- `analyze(for:)` only returns what you asked for and leaves the rest `nil`
- Two standard types associate time with values throughout the framework:
  - `TimedValue<Value>`: value at a `CMTime` instant
  - `RangedValue<Value>`: value over a `CMTimeRange`
- All results are `Codable`. Encode session results with a `JSONEncoder` to get JSON

## API features
### 1. Key
- One `ranges` entry per detected key, so a song that changes key reports more than one

```swift
public struct KeyResult: Codable, Sendable {
    public let ranges: [MusicUnderstandingSession.RangedValue<KeySignature>]
}
```

- Key signature pairs a `tonic`, the root note, with a `mode`, major or minor

```swift
public struct KeySignature: Codable, Hashable, Sendable {
    public let tonic: Tonic
    public let mode: Mode
}

@frozen public enum Tonic: String, Codable, Hashable, Sendable {
    case aFlat, aSharp, a, bFlat, b, c, cSharp, d, dFlat, dSharp, eFlat, e, f, fSharp, g, gFlat, gSharp
}

public enum Mode: String, Codable, Hashable, Sendable {
    case major, minor
}
```

### 2. Rhythm

- Gives the timestamp of every beat and bar as arrays of `CMTime`
- Also provides the overall tempo with `beatsPerMinute` (optional)

```swift
public struct RhythmResult: Codable, Sendable {
    public let beats: [CMTime]
    public let bars: [CMTime]
    public let beatsPerMinute: Float?
}
```

### 3. Structure
- Supports three levels: sections, segments, and phrases
  - Each of them comes back as an array of `CMTimeRange`

```swift
public struct StructureResult: Codable, Sendable {
    public let sections: [CMTimeRange]
    public let segments: [CMTimeRange]
    public let phrases: [CMTimeRange]
}
```

### 4. Pace
- One `ranges` entry per stretch of the song, each carrying a `Double`
  - Higher value means that part feels faster, no matter what the bpm is

```swift
public struct PaceResult: Codable, Sendable {
    public let ranges: [MusicUnderstandingSession.RangedValue<Double>]
}
```

### 5. Instrument activity
- Both fields are keyed by `Instrument`, so you look up one instrument at a time
  - `ranges`: when the instrument is playing
  - `activity`: how prominent it is at each moment, from 0 to 1

```swift
public struct InstrumentActivityResult: Codable, Sendable {
    public let ranges: [Instrument: [CMTimeRange]]
    public let activity: [Instrument: [MusicUnderstandingSession.TimedValue<Float>]]
}
```

### 6. Loudness
- `integrated` and `peak` are single values for the whole song
- `momentary` and `shortTerm` are series of values that follow the song over time

```swift
public struct LoudnessResult: Codable, Sendable {
    public let integrated: MusicUnderstandingSession.TimedValue<Float>
    public let momentary: [MusicUnderstandingSession.TimedValue<Float>]
    public let shortTerm: [MusicUnderstandingSession.TimedValue<Float>]
    public let peak: MusicUnderstandingSession.TimedValue<Float>
}
```

- Also provides a streaming API for loudness
  - Loudness is the only feature with incremental delivery, one value per 100 ms of analyzed audio

```swift
public var loudnessResults: some AsyncSequence<LoudnessResult, any Error> & Sendable
```

## Working with audio and results
### Audio Provider
- `AudioProvider` conforms to `AsyncSequence` and yields `AVReadOnlyAudioPCMBuffer` objects

```swift
struct AudioProvider: AsyncSequence, AsyncIteratorProtocol {
    func makeAsyncIterator() -> Self {
        return self
    }

    mutating func next() async -> AVReadOnlyAudioPCMBuffer? {
        // Return the next audio buffer, or nil to signal completion
    }
}
```

### Encode to JSON
- All MusicUnderstanding results are codable

```swift
import MusicUnderstanding

let session = try await MusicUnderstandingSession(asset: asset)
let results = try await session.analyze()

let encoder = JSONEncoder()
try encoder.encode(results)
```

### Ideas from the session
- Sync visuals to beat, loudness, or pace in a video editing feature
- Organize a music catalog by tempo or key in a DJ app
- Pre-compute and bundle analysis data to animate a game to the music
- Sample code: [Creating visuals with Music Understanding analysis results](https://developer.apple.com/documentation/MusicUnderstanding/create-visuals-using-musicunderstanding-analysis-results)
