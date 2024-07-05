# Explore Swift performance

Discover how Swift balances abstraction and performance. Learn what elements of performance to consider and how the Swift optimizer affects them. Explore the different features of Swift and how they’re implemented to further understand  the tradeoffs available that can impact performance.

@Metadata {
   @TitleHeading("WWDC24")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/wwdc24/10217", purpose: link, label: "Watch Video")

   @Contributors {
      @GitHubUser(dl-alexandre)
      @GitHubUser(<replace this with your GitHub handle>)
   }
}

## Key takeaways

- Swift Provides tools for abstraction that C doesn't
    - closures
    - generics
- Performance is multidimensional and Situational
- Low-Level performance
    - Calls aren't optimized effectively
    - Data isn't represented properly
    - Memory isn't allocated properly
    - Unneccessary copying/destroying

## *Presenter*

John McCall, Swift Team

## Optimization Potential

There are limits to the optimization. The way you write code can have a significant impact on how much the optimizer can do. When identifying hot spots during top-down investigation, try to find ways to measure them, and then **automate** those measurements as part of your development process.

## Function Calls

Function calls have four costs, three of which are dependent in how they're set up.

- Arguments
- Address Resolve
- Space Allocation
- Optimization inhibiting in caller and in the function

**Arguments** have two cost levels
- Calling convention conformance (hidden by register renaming in modern processors; little difference is made)
- Copies of values added to match function ownership showing as retains and releases

**Resolution** and **Optimization** have the same issue. At compile time which functions is called. Yes means the dispatch is static, otherwise it's dynamic.
- **Static** or **direct** Dispatch
    - a little faster for processing
    - optimization possibilities at compile time
        - inlining
        - generic specialization
- **Dynamic** or **indirect** or **virtual** Dispatch
    - enables polymorphism and other powerful abstraction tools
    - only specific kinds of calls 
        - Opaque function values
        - Overridable class methods
        - Protocall requirments
        - Objective-C or virtual C++ methods


### Example Callsite

```swift 
func updateAll(models: [any DataModel], from source: DataSource) {
    for model in models {
        model.update(from: source)
    }
}
```

- When declared in the main body of the protocol, it’s a protocol requirement, and the call to it uses **dynamic** dispatch.
- If declared in a protocol extension, the call uses **static** dispatch.

@TabNavigator {
    @Tab("Dynamic") {
        ```swift
        protocol DataModel {
            func update(from source: DataSource, quickly: Bool)
        }
        ```
    }
    @Tab("Static") {
        ```swift
        extension DataModel {
            func update(from source: DataSource) {
                self.update(from: source, quickly: true)
            }
        }
        ```
    }
}

Functions need **memory** to run. Allocating space on a stack can be done by just subtracting from the stack pointer.

```swift
func updateAll(models: [any DataModel],
                from source: DataSource) {
    for model in models {
            model.update(from: source)
    }
}
```

The above function compiles into the following Assembly code

```assembly
sub   sp, sp, #208
stp   x29, x30, [sp, #192]
…
ldp   x29, x30, [sp, #192]
add   sp, sp, #208
ret
```

1. When entering the function, the stack pointer is pointing into the C stack. 
2. 208 bytes are subtracted from stack pointer (this is called a **CallFrame**)
3. Function body is run
4. 208 bytes deallocated back to the stack pointer 

```swift
// sizeof(CallFrame) == 208
struct CallFrame {
    Array<AnyDataModel> models;
    DataSource source;
    AnyDataModel model;
    ArrayIterator iterator;
    ...
    void *savedX29;
    void *savedX30;
};
```

CallFrame has a layout like a C struct. Ideally, all of the local state of the function just becomes fields in the CallFrame. Compiler is always going to emit that subtraction at the start of the function in order to make space to save critical things like the return address. Subtracting a larger constant doesn’t take any longer, so if more memory is needed in the function, allocating it as part of the CallFrame is as close as it gets to free.

## Memory Allocation

Three kinds of memory from the same pool of RAM
- Global
    - Allocated and initialized when the program is loaded. This isn’t free, but it’s close to it. 
    - Only works for specific patterns with a fixed amount of memory that will live for the entire duration of the program. That 
        - `lets` and `vars` declared at global scope
        - `static` stored properties
        
- Stack
    - Very cheap
    - Only works in certain patterns
    - Memory has to be scoped: there has to be a point in the current function where there will be no more uses of that memory
        - Local `lets` and `vars`
        - Parameters
        - Other temporary values
- Heap
    - Very flexible
        - Allocatable at arbitrary times
        - Deallocatable at arbitrary times
    - More expensive 
    - Used for class instances or features without strong enough static lifetime restrictions
    - Shared ownership
        - Multiple, independent references to same memory
        - Managed by Swift using reference counting
            - incremented references are **retains**
            - decremented references are **releases**

## Memory Layout

- "Value" is a high-level concept of information content
- "Representation" is how a value looks in memory
- "Inline Representation" is the inline portion of the representation

Every value in Swift is a contained in some context
- A local scope (e.g. local variables, intermediate results of expressions)
- An instance context (e.g. non-static stored properties)
- A global context (e.g. global variables, static stored properties)
- A dynamic context (e.g. buffers managed by Array and Dictionary)


**Inline Representation** 
- Local scopes in Swift place inline representations in the function’s CallFrame if possible.
- What is the inline representation of an Array of Double? Array is a struct, and the inline representation of a struct is just the inline representation of all its stored properties. Array has a single stored property, and it’s a class reference. And a class reference is just a pointer to an object. CallFrame just stores that pointer.
- Structs, tuples, and enums use inline storage, where everything they contain is laid out inline in their container.
- Classes and actors use out-of-line storage, where everything they contain is laid out inline in an object, and the container stores a pointer to that object.

## Value Copying

The inline representation of an Array is a reference to a buffer object. References like this are managed using reference counting. A container has ownership of an Array value, meaning there’s an invariant that the underlying array buffer has been retained as part of storing the value into the container. The container is then responsible for eventually balancing that retain with a release.

Using a value can
    - Consume
        - Transfering Ownership
        - If the compiler can see that aren’t any more uses of the original variable, it should be able to transfer the value without a copy.
    - Mutate
        - Temporary Ownership
        - Variable expects to have ownership after
        - Swift prevents using variables during calls
    - Borrow
        - Asserting nobody can consume of mutate
            - Calling a normal method on a value or class reference
            - Passing a value to a normal or `borrowing` parameter
            - Reading a value of a property

## Mechanics of copying

- Value: copying the inline representation so that you get a new inline representation with independent ownership. 
- Class value: copying the ownership of the reference, which just means retaining the object it refers to. 
- Struct value: recursively copying all of the struct’s stored properties.  
     - Large structs can lower performance for multiple copies

Write types with value semantics, where a copy of the value behaves like it’s totally unrelated to where copied from. Structs behave this way, but always use inline storage. Class types use out-of-line storage, but they naturally have reference semantics. One way to get both out-of-line storage and value semantics is to wrap the class in a struct and then use copy-on-write. The standard library uses this technique in all of Swift’s fundamental data structures, like Array, Dictionary, and String.

    

