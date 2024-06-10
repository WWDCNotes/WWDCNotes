# Identify trends with the Power and Performance API

Track your app’s performance metrics in custom team dashboards, bug reporting systems, and other custom workflows with the Power and Performance Metrics and Diagnostics API. Explore how you can access the same data that drives the Power and Performance analysis tools in Xcode to quickly identify trends and regressions. Learn how to leverage diagnostic signatures and logs — including call stack trees — to prioritize and debug issues. And discover how you can integrate this API with your development team’s existing tools to troubleshoot issues quickly, offering better overall performance for people who use your app.

@Metadata {
   @TitleHeading("WWDC20")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc20/10057", purpose: link, label: "Watch Video (15 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## New Power and Performance API

- Two of the most important aspects of ensuring a great user experience are optimizing the power and performance impact of your applications. 
- Last year Xcode Organizer gained power and performance analytics, the same data is now part of the App Store Connect API

### Smart Insights

New built-in smart insights feature to identify your application's power and performance hotspots without any additional effort:

- returned as part of the API data
- flag important power and performance hotspots:
  - regressions
  - trends

## Overview

New REST API resources:

- Performance Power metrics (metrics and insights)
  - aggregated by unique metrics and devices (battery, launch, disk writes)
  - for your app's most recent versions (up to eight most recent versions) `GET /v1/apps/{id}/perfPowerMetrics`
  - per build `GET /v1/builds/{id}/perfPowerMetrics`

- Diagnostic signatures (these signatures are used to group common problems)
  - e.g. disk writes and more
  - top signatures per build `GET /v1/builds/{id}/diagnosticSignatures`
  - logs per signature (contains stack trees) `GET /v1/diagnosticSignatures/{id}/logs` 

## Demo

Sample codes to generate a token, as well as to get diagnostics data will be released with the API later this year (2020).