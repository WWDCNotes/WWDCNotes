# Meet the new MetricKit

Find and fix performance problems faster than ever. Join us to explore how MetricKit equips you with vital performance metrics and actionable diagnostics to help you understand exactly where your app has opportunities for improvements. We’ll also cover how to intersect your app’s metrics and diagnostics by app state by using the StateReporting framework, providing you with the full picture to investigate optimizations in your app’s experience.

@Metadata {
   @TitleHeading("WWDC26")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2026/222", purpose: link, label: "Watch Video (17 min)")

   @Contributors {
      @GitHubUser(mini-min)
   }
}

## Key Takeaways
- MetricKit collects on-device metrics and diagnostics to find issues
- New MetricManager API delivers daily metrics and instant diagnostics
- StateReporting breaks metrics down by app state for context

@Row {
   @Column {
      @Image(source: "WWDC26-222-key-1", alt: "MetricKit is the data-collection step of the performance optimization workflow")
   }
   @Column {
      @Image(source: "WWDC26-222-key-2", alt: "Metric reports delivered daily through MetricManager")
   }
}
@Row {
   @Column {
      @Image(source: "WWDC26-222-key-3", alt: "Diagnostic reports capturing crashes and hangs")
   }
   @Column {
      @Image(source: "WWDC26-222-key-4", alt: "Metrics contextualized by app state via StateReporting")
   }
}

## Presenters
- Yonni Luu, MetricKit Engineer

## Introduction to MetricKit
- MetricKit gives insights into the quality of app's experience
- Performance optimization is a loop: 
  - collect data → analyze to find problems → triage the root cause → fix → monitor → repeat. 
  - MetricKit is the data-collection piece of that workflow

@Image(source: "WWDC26-222-optimize-app-performance-workflow", alt: "The app performance optimization workflow, with MetricKit as the data-collection step")

- Provides two types of data:
  - Metrics: an app's ongoing health signal → whether an area of performance is improving or worsening overall
  - Diagnostics: which code path is causing a specific performance problem

### 1. Metrics
- Cover launch time, hangs, animation, and resource use (CPU, GPU, disk writes, network)
- New in iOS 27:
  - Each metric is delivered as a function of the app's state → contextualized metrics
  - Metal frame rate: metric for game and rendering performance

@Image(source: "WWDC26-222-contextualized-metrics", alt: "A metric broken down by the app's state, showing contextualized metrics")

### 2. Diagnostics
- Cover crashes (with symbolicated backtraces), CPU exceptions, hangs, and disk-write exceptions
- New in iOS 27:
  - memory exception diagnostics: when an app exceeds its memory limit

## Metric report
### Retrieve metrics
- As people use the app throughout the day, MetricKit continuously collects metrics (app launches, hangs, memory, CPU) and delivers them in a daily report
- A report contains:
  - one entry spanning the full day of usage (`fullDayEntry`)
  - separate smaller breakdown entries, typically a few hours each, present only when there are metrics associated with them
- Inside each interval, metrics are organized into metric groups, each representing a system aspect
  - `.cpu` / `.memory` / `.display` / `.gpu`
  - within a group you find the individual performance metric results
- Use `MetricManager` and its `metricReports` async sequence to receive reports
- Reports are `Codable`, so they are easy to encode (e.g. JSON) and send to a server

> Important: Set this up at app start-up (in a detached task or dedicated service) to avoid data loss from a delayed subscription, and keep the `MetricManager` alive so the stream can keep delivering reports.

```swift
import MetricKit

let manager = MetricManager()

// Receive metrics from MetricKit
for await report in manager.metricReports {
    processReport(report)
}
    
// Send metrics to the server
for await report in manager.metricReports {
    let jsonData = try JSONEncoder().encode(report)
    sendToServer(jsonData)
}

// Access your performance metrics (particular group of metrics or a particular value)
for await report in manager.metricReports {
    let intervalEntries = report.intervalEntries
    let fullDayEntry = intervalEntries.fullDayEntry

    for entry in intervalEntries {
        let memoryMetrics = entry.values.filter { $0.metricGroup == .memory }

        for metric in memoryMetrics {
            switch metric {
            case .peakMemory(let peak):
                processPeakMemory(peak)
            default: break
            }
        }
    }
}
```

@Image(source: "WWDC26-222-retrieve-metric", alt: "Retrieving and inspecting a MetricKit daily report with MetricManager")

### Analyze metrics
- Analyzing metrics across all devices is a data science problem
- Set up a server that can ingest each report and aggregate them by the dimensions you care about
- Decide the best statistical analysis for the data and insights you want
- The custom aggregation gives you a baseline for how the app is already performing
- Monitor the aggregated metrics to detect when things get better or worse

@Image(source: "WWDC26-222-analyze-metric", alt: "Aggregating MetricKit reports on a server to analyze metrics")

## Diagnostic report
- Diagnostics are most helpful in the triage phase, after collecting metrics and monitoring performance over time
- When something goes wrong (a crash or a hang), the system captures a diagnostic on device and delivers it to the app immediately through MetricKit
- A diagnostic report packages up the details to triage the issue, including a backtrace that shows the exact call stack at the time of the event
- Crash diagnostics also indicate why the app was terminated and an exception type describing the kind of failure
- New in iOS 27:
  - A termination category indicates how each crash was accounted for in metrics, so trending abnormal terminations can be correlated with individual diagnostics
  - Memory exception diagnostics give insight when the app or extension is terminated for exceeding its memory limit
- Receive diagnostics by awaiting `MetricManager`'s `diagnosticReports`, then switch on `report.result` (`.crash`, `.hang`)

@Image(source: "WWDC26-222-crash-diagnostics", alt: "A crash diagnostic with a backtrace, termination reason, and termination category")

```swift
import MetricKit

let manager = MetricManager()

// Receive diagnostics
for await report in manager.diagnosticReports {
    processReport(report)
}
    
// Send diagnostic data to the server
for await report in manager.diagnosticReports {
    let jsonData = try JSONEncoder().encode(report)
    sendToServer(jsonData)
}

// Access diagnostic data
for await report in manager.diagnosticReports {
    switch report.result {
    case .crash(let crash):
        let backtrace = crash.callStackTree
        let reason = crash.terminationReason
        let category = crash.terminationCategory
        processCrash(backtrace: backtrace, reason: reason, category: category)
    case .hang(let hang):
        processHangDiagnostic(hang)
    default: break
    }
}
```

## Contextualize data
- Default metrics/diagnostics are app-wide averages, which hide where a problem actually is
- New [StateReporting](https://developer.apple.com/documentation/StateReporting) framework: report the app's state so MetricKit aggregates metrics per state
  - e.g. a blended scroll hitch of 15 ms/s splits per tab into Spending 1 ms/s vs Reports 71 ms/s

### StateReporting framework
- State: info you define describing the app's configuration or behavior
- Transition model: the app reports the state it moves to, and MetricKit tracks time spent there (no start/end pairs)
- Domain: an app area holding one active state at a time. Use separate domains to track things in parallel (e.g. tab vs experiment batch size), and MetricKit delivers separate metrics for each

@Image(source: "WWDC26-222-transition-through-states", alt: "An app reporting state transitions while MetricKit tracks the time spent in each state")

```swift
// Receive MetricKit data with states
import MetricKit
import StateReporting

let domain = StateReportingDomain("com.metrickitsample.tabs")
let manager = MetricManager(enabledStateReportingDomains: [domain])

// Report transitions throughout the app
let reporter = StateReporter.reporter(for: domain.rawValue)
reporter.reportTransition(to: "Reports")
```

- Attach extra structured info to a state with a `@ReportableMetadata` struct

```swift
// Define custom structured types
import StateReporting

@ReportableMetadata
struct ViewConfiguration {
    let listSize: String
    let isSorted: Bool
}

let reporter = StateReporter.reporter(
    for: domain.rawValue,
    stableMetadata: ViewConfiguration.self
)

reporter.reportTransition(
    to: "Reports",
    stableMetadata: ViewConfiguration(listSize: "large", isSorted: false)
)
```

### Access state-aware metrics
- No states reported: `stateEntries` is empty (app-wide metrics only)
- With states: report gains `StateEntry` values, each aggregating metrics for the time spent in that state
- Encode grouped by domain via `MetricReport.EncodingFormat.byStateReportingDomain`

@Image(source: "WWDC26-222-retrieve-state-entries", alt: "A metric report with per-state StateEntry values after reporting states")

```swift
// Send encoded metric reports to the server
import MetricKit

for await report in manager.metricReports {
    let encoder = JSONEncoder()

    let formatKey = MetricReport.encodingFormatKey
    encoder.userInfo[formatKey] = MetricReport.EncodingFormat.byStateReportingDomain

    let jsonData = try encoder.encode(report)
    sendToServer(jsonData)
}
```

> Tip: Keep domains narrow, use stable meaningful states (not transient UI events), avoid too many states, and validate with the Points of Interest instrument before shipping.
