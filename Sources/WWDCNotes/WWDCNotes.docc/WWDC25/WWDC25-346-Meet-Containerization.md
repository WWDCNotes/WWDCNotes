# Meet Containerization

Meet Containerization, an open source project written in Swift to create and run Linux containers on your Mac. Learn how Containerization approaches Linux containers securely and privately. Discover how the open-sourced Container CLI tool utilizes the Containerization package to provide simple, yet powerful functionality to build, run, and deploy Linux Containers on Mac.

@Metadata {
   @TitleHeading("WWDC25")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2025/346", purpose: link, label: "Watch Video (12 min)")

   @Contributors {
      @GitHubUser(drewvolz)
   }
}

- [Package Documentation]
- [`Containerization` Github]
- [`Container` Github]

## What is a container?

- Enables developers to package applications with their specific requirements
- Allows for consistent environments across local and production settings

## Goals of containerization

- Achieves strong security isolation
- Reduces virtual machine overhead
- Enhances privacy with per-container directory access control
- Delivers a performant experience that respects user resources

## Use cases

- Provides isolation from the host
- Provides isolation from other workloads
- Development environments

##  Image management

- Containerization provides APIs for image management, container execution, and a powerful initialization system
- Containerization works by fetching images from a registry
- The image serves as a template, containing the file system contents and default configuration for a new container
- The image's configuration can specify the default process to execute, the working directory, and the user identity
- Containerization exposes the file system of the image as a block device for performant access, formatting the block device using EXT4, a widely used Linux file system

## Virtualization

- An EXT4 file system is directly populated from Swift
- The system starts a Linux VM to run a container that provides:
    - Lightweight VM-level isolation
    - Sub-second start times
    - Dedicated IPs for each container
    - Secure file and directory sharing

## Container environment

- Resources like CPU and memory are dynamically allocated only when containers are running
- Within this VM, a minimal file system contains the `vminitd` binary
- `vminitd`:
    - Runs as the first process
    - Manages network interfaces
    - Mounts file systems
    - Launches and supervises all subsequent processes
- To enhance security, the file system is stripped of core utilities, dynamic libraries, and `libc`
- To do this, `vminitd` is compiled as a static executable using Swift’s Static Linux SDK

### Swift Static Linux SDK

For security, we want to reduce the attack surface of our containers
- The file system provided by Containerization has no core utilities
- It contains no dynamic libraries and no `libc` implementation
- In order for `vminitd` to run in this constrained environment where there are no libraries to link to, we need to compile `vminitd` as a static executable
- Swift’s Static Linux SDK allows us to cross-compile static Linux binaries, directly from our Mac
- We are also able to use `musl`, a `libc` implementation with excellent support for static linking
- We produce `vminitd` as a static linux executable cross-compiled from our Mac

## Command-line tooling

A command-line tool, `container`, utilizes these APIs to manage storage, images, networks, and run containers

Users can pull images locally:

```shell
container image pull alpine:latest
```

and then run containers interactively:

```shell
container run -t -i alpine:latest sh
```

[`Container` Github]: https://github.com/apple/container
[`Containerization` Github]: https://github.com/apple/containerization
[Package Documentation]: https://apple.github.io/containerization/documentation/
