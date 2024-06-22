# Modernizing Grand Central Dispatch Usage

macOS 10.13 and iOS 11 have reinvented how Grand Central Dispatch and the Darwin kernel collaborate, enabling your applications to run concurrent workloads more efficiently. Learn how to modernize your code to take advantage of these improvements and make optimal use of hardware resources.

@Metadata {
   @TitleHeading("WWDC17")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc17/706", purpose: link, label: "Watch Video (54 min)")

   @Contributors {
      @GitHubUser(zntfdr)
   }
}



- Create a small amount of queues. **One queue per subsystem is recommended.** For example, database queue, network queue.
- Do not create a large number of queues, use target_queue to set up queue hierarchy instead. 
- **Do not change priority, target_queue nor qos**, after queue is created. It changes queue behavior, which then turn off all optimizations.
- Too many work submitted to a concurrent queue, can cause **thread explosion**. Solve this by using a serial queue instead.
- Taking advantages of parallelization, divide work into multiple chunks. Too small chunk, more context switching overhead. Too large chunk, less CPU utilization (more cpu idle time). Size your work appropriately.
- Choose good granularity of concurrency