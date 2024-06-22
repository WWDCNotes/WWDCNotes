# Improving Your App with Instruments

Whether you're new to optimizing your app's performance or a seasoned veteran, learn about the new version of Instruments. See the new workflows, tools, and tips that will help you analyze and refine your app as it adopts the latest Apple technologies, including Swift and app extensions.

@Metadata {
   @TitleHeading("WWDC14")
   @PageKind(sampleCode)
   @CallToAction(url: "http://developer.apple.com/wwdc14/418", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(antonio081014)
   }
}



## Why use Time Profiling?

- Faster app launch times
- Kepp frame rate at 60fps
- Buttery-smooth scrolling
- Responsive UI

## What is Time Profiling?

Samples stack trace information at prescribed intervals, providing an idea of how much time each method takes.

## When use Time Profiler?

- Frame rate slowdowns
- Some part of your app takes too long
- **Keep an eye on CPU usage in Xcode**

- Threads strategy: enable record waiting threads to expose blocked threads

## Ignore unwanted data

- Charge moves the associated cost
- Prune removes the associated cost
- Focus is "Prune everything but"
