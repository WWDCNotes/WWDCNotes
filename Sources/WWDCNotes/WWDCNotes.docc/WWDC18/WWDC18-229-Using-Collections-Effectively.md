# Using Collections Effectively

Every app uses collections! Go beyond the basics with specific tips on how best to use indices, slices, bridging, laziness, and reference types. Gain better understanding of when to use each collection for best performance.

@Metadata {
   @TitleHeading("WWDC18")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc18/229", purpose: link, label: "Watch Video (37 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



- Swift protocols for collections represent a good starting point for thinking about collection operations in swift.
- Numerous types conform to these protocols (IndexPaths, Data etc..)
- Slicing and Lazy collections represent optimizations and deferred operations but understanding the underlying memory semantics is important.
- Mutable collections should be avoided and holding onto calculated indexes inherently dangerous when dealing with mutable collections
- Need to work with Thread Sanitizer TSAN more.
- Collections are optimized for single thread access (but thread safe right?)
- Bridging between objective-c and swift can affect performance. Look for bridge api calls and perf in Time Profiler. 
- NS~Collection types (ref type) vs Swift collections. 
- Use foundation collections (`NS..`)  when you reference semantics and the elements are known to be reference types.
