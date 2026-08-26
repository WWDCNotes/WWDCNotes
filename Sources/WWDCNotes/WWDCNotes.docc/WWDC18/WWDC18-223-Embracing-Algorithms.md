# Embracing Algorithms

When you imagine building a new app, what do you think about? Models, views, and controllers deserve their prominent place in the design process, but we don't often give the same attention to the underlying work our apps need to do. Understand how to identify and optimize the algorithms in your app, and discover how implementing algorithms as generic protocol extensions results in efficient, effective, and maintainable code.

@Metadata {
   @TitleHeading("WWDC18")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc18/223", purpose: link, label: "Watch Video (40 min)")

   @Contributors {
      @GitHubUser(mini-min)
   }
}

## Key Takeaways

- Every raw loop hides an algorithm, so replace it
- Reach for the standard library first
- The right algorithm fixes bugs and cuts complexity
- Write algorithms as generic protocol extensions

## Overview
- Models, views, and controllers get lots of design attention, but the underlying work our apps do (the algorithms) rarely gets the same care
- This session treats computation as a first-class citizen: identify the algorithms hiding in your code, then express them clearly
- Goal, borrowed from Sean Parent: **"No Raw Loops"**
  - every time you write a loop, replace it with a call to an algorithm
  - if a fitting algorithm does not exist, write it yourself and move the loop into its implementation

## Deleting the selection

### Raw loops hide bugs
- Running example: a vector drawing app, "Shapes", where the user can delete the selected shapes
- v1 loops `0..<count` and calls `remove(at:)` on matches, but the array shrinks while we iterate over its old count, so it walks off the end
- v2 uses a `while` loop that rechecks `count`, but now two consecutive selected elements skip one
  - this bug is insidious because it hides unless a test happens to exercise it
- v3 iterates in reverse, which is correct and clean, because we only touch the part of the array we have not changed yet

```swift
// v1: buggy, walks off the end as the array shrinks
for i in 0..<shapes.count {
    if shapes[i].isSelected { 
        shapes.remove(at: i) 
    }
}

// v2: rechecks count, but skips an element when two in a row are selected
var i = 0
while i < shapes.count {
    if shapes[i].isSelected {
        shapes.remove(at: i)
    } 
    i += 1
}

// v3: correct and clean, but still hides a performance problem
for i in (0..<shapes.count).reversed() {
    if shapes[i].isSelected { 
        shapes.remove(at: i) 
    }
}
```

### Complexity
- Even the clean reverse loop is O(n²): `remove(at:)` is O(n) (it slides the following elements) and runs up to n times
- Fine for a 10-20 element test, but it freezes when many shapes are selected (50² is 2,500 steps, 100² is 10,000)
- O(n) vs O(n²): a linear algorithm may lose on small inputs but always wins as the problem grows, no matter how expensive its steps
- The point is scalability, not absolute performance, and **scalability is predictability for your users**

### Reach for the standard library
- The standard library already has the right algorithm: `removeAll(where:)`
- It reads like its intent and does the work in a single O(n) pass instead of O(n²)

```swift
shapes.removeAll(where: { $0.isSelected })
```

- Lesson: get familiar with the standard library, a suite of algorithms with documented meaning and performance characteristics

### How removeAll(where:) works
- `removeAll(where:)` is itself built from smaller algorithms, and looking inside shows why it stays O(n)
- Step 1: `halfStablePartition` moves every element to remove into a suffix at the end, and returns where that suffix starts
- Step 2: `removeSubrange(suffixStart...)` deletes that whole suffix in one shot

```swift
extension MutableCollection where Self: RangeReplaceableCollection {
    /// Removes all elements satisfying `shouldRemove`.
    ///
    /// - Complexity: O(n) where n is the number of elements.
    mutating func removeAll(where shouldRemove: (Element) -> Bool) {
        let suffixStart = halfStablePartition(isSuffixElement: shouldRemove)
        removeSubrange(suffixStart...)
    }
}
```

- `halfStablePartition` does the real work with two indices in a single pass
  - `i` marks the slot where the next element to keep should go
  - `j` scans forward, and whenever `self[j]` is a keeper it is swapped into `i`, then `i` advances
  - elements to remove are simply left behind, so they pile up at the end
  - "half stable" means the kept elements keep their relative order, while the removed ones may be scrambled (they are about to be deleted anyway)

```swift
extension MutableCollection {
    /// Moves all elements satisfying `isSuffixElement` into a suffix of the collection,
    /// returning the start position of the resulting suffix.
    ///
    /// - Complexity: O(n) where n is the number of elements.
    mutating func halfStablePartition(isSuffixElement: (Element) -> Bool) -> Index {
        guard var i = firstIndex(where: isSuffixElement) else { return endIndex }
        var j = index(after: i)
        while j != endIndex {
            if !isSuffixElement(self[j]) {
                swapAt(i, j)
                formIndex(after: &i)
            }
            formIndex(after: &j)
        }
        return i
    }
}
```

## Reordering the selection

### bringToFront is really a partition
- Reordering commands (bring to front, send to back, bring forward, send backward) work on multiple, possibly non-contiguous selected shapes that must stay grouped afterward
- `bringToFront` was written as an O(n²) loop of `remove(at:)` + `insert(at:)`
- Describing it in words ("move the selected shapes to the front, keeping their relative order") reveals it is exactly `stablePartition`
  - invert the predicate to get `sendToBack`
  - `stablePartition` is O(n log n), which stays close to O(n) as the problem grows

```swift
// Before: an O(n) loop containing O(n) operations, so O(n²) overall
extension Canvas {
    mutating func bringToFront() {
        var i = 0, j = 0
        while i < shapes.count {
            if shapes[i].isSelected {
                let selected = shapes.remove(at: i)
                shapes.insert(selected, at: j)
                j += 1
            }
            i += 1
        }
    }
}
```

@Image(source: "WWDC18-223-n-square-collection", alt: "An O(n) loop calling O(n) operations like remove(at:) and insert(at:), making the whole thing O(n squared)")

```swift
// After: one stablePartition, moving the unselected shapes to the back
mutating func bringToFront() {
    shapes.stablePartition(by: { !$0.isSelected })
}

// Invert the predicate to send the selected shapes to the back
mutating func sendToBack() {
    shapes.stablePartition(by: { $0.isSelected })
}
```

- `bringForward` is the same `stablePartition`, but applied to a **slice** (just the relevant portion of the array)

```swift
// Partition only the slice from the shape just before the first selected one to the end
mutating func bringForward() {
    guard let first = shapes.firstIndex(where: { $0.isSelected }),
          first > shapes.startIndex else { return }
    let start = shapes.index(before: first)
    shapes[start...].stablePartition(by: { !$0.isSelected })
}
```

### Make it generic
- Ask what the operation really has to do with the domain, then strip away each assumption ("what does `bringForward` have to do with shapes? with arrays? with integer indices?")
  - decouple from the `Canvas`, generalize `Array` to `MutableCollection`, and replace "is selected" with a generic predicate parameter
- Work in terms of indices, not integers: a slice's indices do **not** start at `0`, they keep the indices of the collection they came from, which is exactly what lets generic algorithms compose over slices

```swift
// Compare against startIndex and step with index(before:), never 0 / i - 1
if predecessor > startIndex {
    let before = index(before: predecessor)
}
```

- Needing "the index before the first match" becomes its own small algorithm (e.g. `indexBeforeFirst`), so keep focus by assuming it already exists, then write it

### How stablePartition works
- `stablePartition` uses divide and conquer: partition the left and right halves, then `rotate` the middle to bring the two matching groups together
- `rotate` is its own elegant, reusable algorithm living in the same file, and it powers many higher-level algorithms

### The payoff
- The messiest, buggiest code (dragging shapes within the list, with a temp buffer and several loops) turns out to be just two `stablePartition` calls with inverted predicates, collapsing to a two-liner
- Seeing past domain detail to the fundamental computation is a learned skill that takes practice

## Compose, document, and test
- We build towers of abstraction and rely on lower layers without re-reading them precisely because they are documented, so document each algorithm's semantics and complexity
- Generic algorithms are more reusable, clearer, and easy to test with simple values (integers) instead of full app objects
- Treat computation as a first-class citizen: identify it, give it a name, unit-test it, and document it
- As Crusty puts it, **"Programming reveals the real"**
