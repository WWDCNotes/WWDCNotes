# Explore Swift performance

Discover how Swift balances abstraction and performance. Learn what elements of performance to consider and how the Swift optimizer affects them. Explore the different features of Swift and how they’re implemented to further understand the tradeoffs available that can impact performance.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2024/10217", purpose: link, label: "Watch Video (34 min)")

   @Contributors {
      @GitHubUser(mini-min)
   }
}

## Key Takeaways

- 어쩌구
- 저쩌구
- 이렇게

> Before we start, what is performance?:
>
> - Performance is multidimensional and situational
> - Macroscopic: power consumption, latency, memory limits
>   - Usually fixed top-down with algorithmic improvements (e.g. Instruments), no low-level work needed
> - Microscopic: when that's not enough, low-level performance is dominated by 4 factors
> - Swift's optimizer removes many issues before you ever see them, but it has limits
>   - How you write code affects how much it can do → monitor performance to catch regressions

## Low-level principles
### Function calls

- Every call has costs:
  - Set up arguments (calling convention)
  - Resolve the function's address (dispatch)
  - Allocate space for the function's local state (call frame)

@Image(source: "WWDC24-10217-costs-function-calls.jpeg")

- Argument passing: values placed in registers per the calling convention
  - Usually near-free (hidden by register renaming)
  - Passing ownership of a value can add extra retain/release work

- Dispatch: depends on where the method is declared
  - Static dispatch: target known at compile time → cheaper, enables inlining & generic specialization
  - Dynamic dispatch: target resolved at runtime → needed for polymorphism, but blocks compile-time optimization

```swift
// declared in main body of the protocol (protocol required)
// - call uses dynamic dispatch 
protocol DataModel {
    func update(from source: DataSource, quickly: Bool)
}

// declared in protocol extension
// - call uses static dispatch
extension DataModel {
    func update(from source: DataSource) {
        self.update(from: source, quickly: true)
    }
}

func updateAll(models: [any DataModel], from source: DataSource) {
    for model in models {
        // kind of call depends method decalared
        model.update(from: source)
    }
}
```

- Call frame: holds a function's local state, laid out on the C stack
  - Allocated at entry by just subtracting from the stack pointer (`sub sp, sp, #N`), restored at exit
  - Size doesn't affect cost (unlike heap allocation) → local memory in the call frame is essentially free

### Memory allocation

- Three kinds of memory, all from the same pool of RAM: Global, Stack, Heap

- Global: allocated & initialized at program load
  - Almost free
  - Only for fixed amounts of memory that live for the whole program (global variables, `static` members)

- Stack: allocated via the call frame (subtract from the stack pointer)
  - Very cheap
  - Memory must be scoped (local `let`/`var`, parameters, temporaries)

- Heap: allocated/freed at arbitrary times (`malloc`/`free`)
  - Most flexible, but substantially more expensive → must find free space, stay thread-safe, handle fragmentation
  - Used for `class`/`actor` instances, escaping closures, anytime a scope restriction can't be proven
  - Often has shared ownership: multiple independent references to the same memory
  - Swift manages its lifetime with reference counting (`retain` / `release`, freed when count hits 0)

### Memory layout

> Terminology:
> - Value: the high-level information content, regardless of how it's stored
> - Representation: how that value is actually arranged in memory
> - Inline representation: the portion of the representation without following any pointers
>   - e.g. `Array`'s inline representation is a single buffer reference → `MemoryLayout.size(ofValue: array) == 8`

@Row {
    @Column { 
        @Image(source: "WWDC24-10217-high-level-value.jpeg") 
    }
    @Column { 
        @Image(source: "WWDC24-10217-low-level-representation.jpeg") 
    }
}

- A type's representation is built from the representations of its stored properties
  - `struct` / `tuple` / `enum`: inline storage → everything laid out inline in the container (usually in declaration order)
  - `class` / `actor`: out-of-line storage → fields live in a heap object, container just holds a pointer
- Some types keep part of their representation out-of-line on the heap (e.g. `Array`, `String` store elements in a buffer)
- Inline vs. out-of-line is a tradeoff:
  - Inline: no heap allocation (great for small types), but copying large types duplicates all fields → costly
  - Out-of-line: needs a heap allocation, but copies can share the same object → cheaper when copied a lot

### Value copying

- Copying = duplicating the inline representation to get an independent copy
- What it costs depends on what the representation contains:
  - Bitwise-copyable (POD): `Int`, `Float`, structs of only PODs → just copy the bits, essentially free
  - Contains references → copying must `retain` each reference; destroying must `release` each one
- Struct (inline): copies recursively → each stored reference is retained
  - A struct with 3 reference fields does 3 retains per copy (vs. a class = 1 retain for the single object)
- Class (out-of-line): copying just retains the one object → the copy shares the same storage
- Destroying a value = releasing its references
- Performance cost: unnecessary copies → extra `retain`/`release` traffic (ARC), visible in profiles
  - Large inline structs also duplicate all fields per copy → more memory if copied a lot

### Ownership

- Ownership = responsibility for managing a value's representation (balancing each `retain` with a `release`)
- Every use of a value interacts with ownership in one of 3 ways: consume / mutate / borrow
  - Consume: transfer ownership elsewhere
    - Copying the old variable into a new one needs an independent value → a copy
    - If the original has no more uses, the compiler can transfer without copying (or request it explicitly with the `consume` operator)
    ```swift
        
    ```
  - Mutate: change the value in place → requires exclusive access (nobody else reading/consuming it at the same time)
  - Borrow: assert no one else can consume/mutate it → what you want for read-only access
    - Passing an argument should usually just borrow (no extra work)
    - If Swift can't prove there's no simultaneous mutate/consume, it inserts a defensive copy


## Key features in Swift, what impact?
