# Unified Logging and Activity Tracing

The new Unified Logging and Tracing System for iOS and macOS uses Activity Tracing for performance, consolidates kernel and user-space logging, and has many other improvements. Learn how Logging and Tracing can help you debug and troubleshoot issues with your apps.

@Metadata {
   @TitleHeading("WWDC16")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc16/721", purpose: link, label: "Watch Video (43 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



## Introduction

- One common, efficient logging mechanism for both user and kernel mode.
- Maximize information collected while minimizing **observer** effect (e.g. because of breakpoints/print you change the timing and the bug doesn't happen anymore).
- `os_log` compresses data, and defers lots of work (key point to avoid observer effect)
- Designed with privacy in mind ️❤️

## What's New

- New tools to categorize and filter log messages 
- Logging system collects caller info for you (`__FILE__`, `_FUNCTION__` etc are automatically collected)
- New type formatters (more on this later)
- New console and command-line tool

## Adoption

Legacy APIs (`NSLog`) are automatically redirected into the new system.

## New File Format

- `.tracev3` stored at `/var/db/diagnostics` with additional support files at `/var/db/uuidtext`
- `.logarchive` is basically a merge of the files found in the folders above, it's used to transfer the logging to other people, bug reports

## Subsystem and Categories

- Subsystem should be the app/framework domain (your.app.identifier)
- Category are the different domains (“store”, “chat”, “account”, ...)

## Logging Behavior

**Three basic levels**: 

- Default
- Info
- Debug

**Two special levels**: 

- Fault
- Error

Each **basic level** has two characteristics that can be set for system, subsystem, or category (in the Console app we can mute every single one of them, even the process, even filter by type like error -> you can even save one filter that you create ):

- Enabled (does it actually produce a log?)
- `isItStoredToDisk` or Memory (memory: memory buffer, saved to disk only on fault or error)

Levels are hierarchical, therefore by setting Debug to go to disk, implies that Info (and Default) will also go to disk

Default behavior:

![][behaviorImage]

## Privacy

- Prevent accidental logging of Personally Identifiable Information (PII) 
- Dynamic strings, collections, arrays, etc. are assumed to be private

![][privacyImage]

## Architecture

![][architectureImage]

## Faults and Errors

Faults and Error log information are captured into a separate set of log files

- Errors represent issues discovered within a given application/library 
- Faults represent more global problems in the system

## APIs
![][apiImage]

`os_log_create`: 

- takes two parameters: the name of the subsystem and the name of the category.
- creates a thread-safe singleton object that controls behavior of log messages, here's how to use it:

```swift
os_log(log, "This happened")
```

## Type Formatters
We should use these as much as possible as these conversions will be done in the background for us (no observer effect!)

![][formattersImage]

More information [here][formatterMoreInformation].

## Activity API

![][activityImage]

## Log Command Line Tool

![][commandImage]

More info [here][osLogMoreInfo].

[formatterMoreInformation]: https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Strings/Articles/formatSpecifiers.html 
[osLogMoreInfo]: https://developer.apple.com/documentation/os/logging

[behaviorImage]: WWDC16-721-behavior
[privacyImage]: WWDC16-721-privacy
[architectureImage]: WWDC16-721-architecture
[apiImage]: WWDC16-721-api
[osLogImage]: ../../../images/notes/wwdc16/721/osLog.png
[formattersImage]: WWDC16-721-formatters
[activityImage]: WWDC16-721-activity
[commandImage]: WWDC16-721-command