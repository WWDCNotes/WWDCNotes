# Discover container machines

Meet container machines, a new tool included in Container that offers a lightweight persistent Linux environment on Mac. Explore how container machines work and how the design of Containerization allows for a performant and seamless experience when developing for Linux on macOS.

@Metadata {
   @TitleHeading("WWDC26")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2026/389", purpose: link, label: "Watch Video (11 min)")

   @Contributors {
      @GitHubUser(VictorPuga)
   }
}

## Summary
- **Container Machine** combines speed of containers with persistence of VMs on macOS.  
- **Instant startup and lightweight VM isolation** ensures fast, secure Linux environments.  
- **Seamless macOS-Linux integration** via automatic user mapping and shared filesystem.  
- **Works with existing tools** (Xcode, Safari) enabling cross-platform development workflows without context switching.  
- **Uses OCI images and container tool CLI** for easy environment creation and management.

## Presenters

- Michael Crosby, Services

## Overview

Container Machine is a new feature built on top of the existing Containerization framework that provides a highly integrated Linux environment native to macOS. It offers:

- Fast, lightweight Linux VMs with persistent state (combining benefits of containers and VMs).  
- Seamless switching between macOS and Linux environments with minimal context switching.  
- Native-feeling integration into macOS workflows with automatic user and filesystem sharing.

## Containerization Framework Recap

- A Swift framework for running Linux containers on macOS.  
- Provides APIs for **storage, networking, execution**, and an init system.  
- Uses lightweight VMs for **virtual machine-based isolation** with sub-second start-up times.  
- Accompanied by an open-source `container` CLI for managing images and container lifecycles.

## Design Principles of Container Machine

- **Fast and lightweight** enough to be used in existing developer workflows.  
- **Easy to create and customize** multiple environments per project to manage dependencies/toolchains independently.  
- **Persistent environments** that retain state and installed tools across sessions.  
- **Seamless macOS integration** to avoid the need to learn new tools or workflows when targeting Linux.

## How Container Machine Works

- Runs inside lightweight VMs using the same OCI image format as containers.  
- Managed via the `container machine` CLI with commands: `create`, `run`, `stop`, etc.  
- Supports automatic username mapping and shares the macOS working directory inside the container machine to preserve context.  
- Containers are **stateful**: changes made inside persist, allowing resuming work at any time.  
- Networking is isolated but accessible by configuring apps (e.g., web servers) to listen on the Container Machine's IP address.

## Typical Workflow Example

1. **Create a Container Machine:**  
   ```bash
   container machine create --name <name> --set-default alpine
   ```
2. **Run commands inside the Container Machine:**  
   ```bash
   container machine run uname
   ```
3. **Start an interactive shell:**  
   ```bash
   container machine run
   ```
4. **Develop cross-platform apps (e.g., Vapor web server):**  
   - Edit code with macOS tools like Xcode.  
   - Run/test inside the container machine using the shared filesystem.  
   - Access running server from macOS (Safari) by using Container Machine's IP + port.  
5. **Modify assets (e.g., icons) on macOS and see instant updates in the Linux environment without manual copying.**

## Benefits and Features

- **Fast startup and execution:** lightweight VM-based containers that boot in sub-seconds.  
- **Persistent state:** unlike ephemeral containers, users keep their Linux environment’s state to install tools or save data.  
- **Smooth integration:** work seamlessly between macOS and Linux terminals, GUIs (Xcode, browsers), and shared file systems.  
- **Cross-platform development:** simplified handling of dependencies and configurations for Linux-targeted apps on macOS.

## Notes on Setup & Usage

- Uses familiar OCI image formats; Alpine is a typical starter image.  
- `container machine list` shows all environments with metadata like IP addresses and resource allocation.  
- Networking may require apps to bind to the container machine's network interface to be accessible externally.  
- CLI commands closely mirror container workflows, lowering learning barriers.
