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

- Low-level cost comes from calls, allocation, layout, and copying
- Inline vs out-of-line storage sets copy cost and ARC traffic
- Abstractions have a cost, but it is often worth paying

## Presenters
- John McCall, Swift Team

> Before we start, what is performance?:
> - Performance is multidimensional and situational
> - Macroscopic: power consumption, latency, memory limits
>   - Usually fixed top-down with algorithmic improvements (e.g. Instruments)
> - Microscopic: when that's not enough, low-level performance is dominated by 4 factors
>   - Swift's optimizer removes many issues before you ever see them, but it has limits
>   - How you write code affects how much it can do → monitor performance to catch regressions

## Low-level principles
### 1. Function calls

- Every call has costs:
  - Set up arguments (calling convention)
  - Resolve the function's address (dispatch)
  - Allocate space for the function's local state (call frame)

@Image(source: "WWDC24-10217-costs-function-calls", alt: "The three costs of every function call: argument setup, dispatch, and the call frame")

- Argument passing: values placed in registers per the calling convention
  - Usually near-free (hidden by register renaming)
  - Passing ownership of a value can add extra `retain`/`release` work

- Dispatch: depends on where the method is declared
  - Static dispatch: target known at compile time → cheaper, enables inlining & generic specialization
  - Dynamic dispatch: target resolved at runtime → needed for polymorphism, but blocks compile-time optimization

```swift
func updateAll(models: [any DataModel], from source: DataSource) {
    for model in models {
        // kind of call depends on where the method is declared
        model.update(from: source)
    }
}
    
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
```

- Call frame: holds a function's local state, laid out on the C stack
  - Allocated at entry by just subtracting from the stack pointer (`sub sp, sp, #N`), restored at exit → reason putting things in the `CallFrame` is ideal
  - Size doesn't affect cost (unlike heap allocation) → local memory in the call frame is essentially free

### 2. Memory allocation

- Three kinds of memory, all from the same pool of RAM: Global / Stack / Heap

- Global memory: allocated & initialized at program load
  - Almost free
  - Only for fixed amounts of memory that live for the whole program (global variables, `static` members)

- Stack memory: allocated via the call frame (subtract from the stack pointer)
  - Very cheap
  - Memory must be scoped (local `let`/`var`, parameters, temporaries)

- Heap memory: allocated/freed at arbitrary times (`malloc`/`free`)
  - Most flexible, but substantially more expensive → must find free space, stay thread-safe, handle fragmentation
  - Used for `class`/`actor` instances, escaping closures, anytime a scope restriction can't be proven
  - Often has shared ownership
  - Swift manages its lifetime with reference counting (`retain` / `release`, freed when count hits 0)

### 3. Memory layout

> Terminology:
> - Value: the high-level information content, regardless of how it's stored
> - Representation: how that value is actually arranged in memory
> - Inline representation: the portion of the representation without following pointers
>   - e.g. `Array`'s inline representation is a single buffer reference → `MemoryLayout.size(ofValue: array) == 8`

@Row {
    @Column { 
        @Image(source: "WWDC24-10217-high-level-value", alt: "The high-level value of an array") 
    }
    @Column { 
        @Image(source: "WWDC24-10217-low-level-representation", alt: "The low-level representation of an array as a single buffer reference") 
    }
}

> Tip: Value contexts — every value in Swift is logically contained in some context
> - Local scope: local variables, intermediate results of expressions
> - Instance context: non-static stored properties
> - Global context: global variables, static stored properties
> - Dynamic context: buffers managed by `Array` and `Dictionary`

- Every value has a static type → the type's rules dictate the value's representation, while the context's rules provide the memory that holds the inline representation
- A type's representation is built from the representations of its stored properties
  - `struct` / `enum` / `tuple` : inline storage → everything laid out inline in the container (usually in declaration order)
  - `class` / `actor`: out-of-line storage → fields live in a heap object, container just holds a pointer
- Some types keep part of their representation out-of-line on the heap (e.g. `Array`, `String` store elements in a buffer)
- Inline vs. out-of-line is a tradeoff:
  - Inline: no heap allocation (great for small types), but copying large types duplicates all fields → costly
  - Out-of-line: needs a heap allocation, but copies can share the same object → cheaper when copied a lot

@Image(source: "WWDC24-10217-example-value-contexts", alt: "An Array value in a local scope, whose inline representation in the call frame is a pointer to the heap buffer")

### 4. Value copying

- Ownership = responsibility for a value's representation (balancing each `retain` with a `release`):
  - Consume: transfer ownership elsewhere. Copying from an existing variable retains the buffer; if it's the last use the compiler transfers with no copy, which you can force with `consume`
  - Mutate: temporarily take ownership, then hand it back when done → requires exclusive access
  - Borrow: assert nobody else can consume/mutate it → ideal for read-only use (e.g. passing to `print`); if Swift can't prove exclusivity it inserts a defensive copy (common for `class` properties)

```swift
func makeArray() {
    var array = [1.0, 2.0]
    var array2 = array          // copies: retains the buffer (unless this is the last use)
    var array3 = consume array  // explicitly transfers ownership, no copy — using `array` after is an error
}
```

- Copying = duplicating the inline representation to get a new one with independent ownership
- Copying a class value just copies the reference's ownership → a single `retain` of the object it points to
- Copying a struct value recursively copies all its stored properties → every reference-typed field must be retained
  - Copying value types is often not "just copying bits": e.g. a `Person` struct with three reference-typed fields does 3 retains per copy, whereas making it a class would do only 1

## High-level features in Swift
### Dynamically-sized types
- Unlike C structs (always constant-size), a Swift type's size can be determined at runtime:
  1. Resilient SDK value types that reserve the right to add/change stored properties in a future OS (e.g. Foundation's `URL`) → their whole layout is unknown at compile time
  2. A generic type's type parameter, which can be replaced by any type with any representation → its layout is also unknown
     - Exception: constraining the parameter to a class (`where T: AnyObject`) means it's always a pointer → more efficient code even without generic specialization

@Image(source: "WWDC24-10217-type-determined-runtime", alt: "A struct whose stored properties include a dynamically-sized type, laid out at runtime")

- Most containers: Swift lays the type out at runtime → the compiler knows the static layout up to the first dynamically-sized property, and the runtime fills in the rest on first use (loading sizes/offsets dynamically instead of using constants)
- Some containers must have constant size (global variables, call frames) → the value is allocated separately from the container:
  - Global variable: the compiler makes a pointer-typed global and lazily heap-allocates the storage on first access
  - Local variable: the call frame just holds a pointer; since locals are scoped, the storage can still be allocated on the C stack (another subtraction from the stack pointer when it enters scope, reset when it leaves)

### Async functions
- C threads are a precious resource → blocking one just to wait wastes it, so async functions are implemented in two special ways:
  1. They keep local state on a separate stack from the C stack
  2. They're split into multiple partial functions at runtime, one per gap between potential suspension points (`await`)

- Async stack: instead of one large contiguous stack, an async task holds one or more **slabs** of memory
  - Allocating asks the task for space in the current slab
    - if it doesn't fit, the task `malloc`s a new slab; deallocating just hands the memory back
  - Used by a single task with a stack discipline 
    - typically much faster than `malloc`, so the profile is similar to sync functions, just with slightly higher per-call overhead

@Row {
   @Column {
      @Image(source: "WWDC24-10217-local-state-async-func-1", alt: "Async stack allocation step 1: the function asks the task for memory from the current slab")
   }
   @Column {
      @Image(source: "WWDC24-10217-local-state-async-func-2", alt: "Async stack allocation step 2: the task marks part of the slab as used and hands it to the function")
   }
}
@Row {
   @Column {
      @Image(source: "WWDC24-10217-local-state-async-func-3", alt: "Async stack allocation step 3: if the allocation doesn't fit, the task mallocs a new slab")
   }
   @Column {
      @Image(source: "WWDC24-10217-local-state-async-func-4", alt: "Async stack allocation step 4: deallocation hands the memory back to the task, marked unused")
   }
}

- Function splitting: a function with one `await` becomes two partial functions (before/after the suspension point) → local state that must cross a suspension point can't live on the C stack
  - At most one partial function is on the C stack at a time: each runs like an ordinary C function up to the next suspension point, then tail-calls the next one (its call frame disappears, the next is allocated)
  - If a task actually suspends, it returns normally on the C stack → control goes to the concurrency runtime so the thread can be reused immediately

@Image(source: "WWDC24-10217-partial-functions-on-Cstack", alt: "An async function split into partial functions, with at most one partial function on the C stack at a time")

### Closures
- Closures are passed around as function-type values 
  - A function value is a pair of a function pointer + context pointer
  - Calling it just calls the function pointer, passing the context pointer as an implicit extra argument

- Non-escaping closure:
  - Value won't be used after the call returns
  - No memory management needed, so the context can be a simple struct allocated on the stack (scoped allocation)

@Image(source: "WWDC24-10217-non-escaping-closures", alt: "A non-escaping closure whose context is allocated on the stack")

- Escaping closure: 
  - Used beyond the call
  - The context object must be heap-allocated and managed with retain/release (it behaves like an instance of an anonymous class)

@Image(source: "WWDC24-10217-escaping-closures", alt: "An escaping closure whose context is heap-allocated and reference-counted")

- Captured local `var`s are captured by reference (changes are visible in both the closure and the original scope):
  - Captured only by non-escaping closures → variable's lifetime is unchanged, so the closure just captures a pointer to its allocation
  - Captured by an escaping closure → the variable's lifetime can extend as long as the closure lives → it must also be heap-allocated, with the context holding a reference to it

### Generics
- A generic type's layout is statically unknown (handled by the containers described earlier); how are its protocol constraints executed?
- A protocol is represented at runtime by a witness table — a table of function pointers, one per protocol requirement
  - Wherever there's a protocol constraint, Swift passes around a pointer to the appropriate witness table

- Generic function (default): the type metadata and witness tables become hidden extra parameters → one shared version of the function works for any conforming type
  - The array is homogeneous → elements are packed efficiently, and the type info is passed once as top-level arguments
  ```swift
  func updateAll<Model: DataModel>(models: [Model], from source: DataSource) {
      for model in models { model.update(from: source) }
  }
  ```

- Values of protocol type (`any DataModel`): more flexible (each element can be a different type), but different characteristics
  - The existential has a fixed-size inline buffer (3 pointers) plus the value's type and conformances → values that fit go inline, larger ones are heap-allocated with just a pointer stored
  - The array is heterogeneous → each element carries its own dynamic type and isn't densely packed
  ```swift
  func updateAll(models: [any DataModel], from source: DataSource) {
      for model in models { model.update(from: source) }
  }
  ```

- Specialization: when the optimizer can see the concrete type at the call site, it can inline the call or generate a specialized version → removes the generic abstraction cost, calling the requirement directly
  - Needs the optimizer to see both caller and callee (same module, `@inlinable`, or whole-module optimization); across protocol-type values it's much harder, so you get less help from the compiler there

> Tip: These are just costs, and abstraction is often worth paying for. Don't avoid protocol types — build an intuition for when a cost actually matters.
