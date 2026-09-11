# Run local agentic AI on the Mac using MLX

Run AI agents locally with privacy, low latency, and offline access. Dive into how MLX advancements and Mac hardware make powerful agentic workflows possible entirely on-device. You’ll explore code agents such as OpenCode, see how they integrate into Xcode, learn techniques for multi-Mac scaling, and discover how to integrate tools seamlessly — without ever leaving your machine.

@Metadata {
   @TitleHeading("WWDC26")
   @PageKind(sampleCode)
   @CallToAction(url: "https://developer.apple.com/videos/play/wwdc2026/232", purpose: link, label: "Watch Video (13 min)")

   @Contributors {
      @GitHubUser(mini-min)
   }
}

## Key Takeaways

- Run the model and agent on your Mac, not the cloud
- MLX-LM Server is OpenAI-compatible, so existing agents just point to it
- Apple silicon and MLX make on-device agents fast

## Presenters
- Angelos Katharopoulos, ML Engineer

## Overview
- Goal: build and run agentic AI workflows entirely on your Mac with MLX, with no cloud and no API keys
- Chat experience: send a prompt to the model, it responds, and acting on that response is up to you
- **Agentic loop**: you talk to an agent instead, and it keeps cycling until the task is done
  - user to agent: give the task
  - agent to model: the agent asks the model what to do next
  - agent to tools: the agent runs commands, reads files, or hits APIs, then feeds the results back to the model

@Image(source: "WWDC26-232-agentic-loop", alt: "The agentic loop: user to agent, agent to model, and agent to tools")

> Tip: In this setup MLX runs the model locally while an agent like OpenCode drives the loop.

## Local agentic AI stack

@Image(source: "WWDC26-232-local-agentic-ai-stack", alt: "The four-layer local agentic AI stack: MLX, MLX-LM, MLX-LM Server, and the agent")

### 1. MLX
- Open-source array framework purpose-built for Apple silicon, the foundation everything is built on
- Handles the low-level computation, Metal acceleration, and memory management

### 2. MLX-LM (language model layer)
- Loads, runs, quantizes, and fine-tunes large language models
- Supports thousands of models from Hugging Face, with both CLI tools and a Python API

### 3. MLX-LM Server (persistent server)
- An OpenAI-compatible HTTP server that exposes your local model through a standard API
- Supports structured tool calling (so the model can invoke functions reliably) and reasoning models
- A drop-in replacement for any cloud LLM API

### 4. Local agent
- Framework or tool that speaks the OpenAI chat completions protocol (Xcode, OpenCode, Pi agent, a custom script, and more)
- Any agent framework works out of the box

## Set up own local agent
1. install MLX-LM
2. start the server (`mlx_lm.server`)
3. point your agent at the local server: set the base URL to your local server's address

```bash
# Install MLX-LM
pip install mlx-lm

# Start the server
mlx_lm.server --model mlx-community/<model-name>

# Point your agent to the server
curl -X POST \
  http://127.0.0.1:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"default_model","messages":[{"role":"user","content":"Hello!"}]}'
```

@Image(source: "WWDC26-232-example-config-for-MLX", alt: "An agent config pointing its base URL at the local MLX-LM server")

## How MLX gets the most out of the hardware to make agents fast
### Challenge 1: prompt processing
- Prompt processing (prefill) is reading the input before the model generates anything
- In the agentic loop the model reprocesses the whole context every time it gets tool output, so sessions balloon to 100K+ tokens that are mostly read, not generated
- The M5 Neural Accelerators make matrix multiplication up to 4x faster than M4, and MLX uses them automatically (no code changes) to speed up prompt processing by about the same

### Challenge 2: concurrency
- Agents often spawn several subagents that work in parallel, so multiple requests hit the local model at once
- MLX-LM Server handles this with **continuous batching**: it groups incoming requests and runs them together on the GPU, and new requests can join a batch already in progress
- Result: subagents are served concurrently instead of waiting in a queue

@Image(source: "WWDC26-232-concurrency", alt: "Continuous batching serving multiple concurrent agent requests together on the GPU")

### Challenge 3: large model size
- Models can be too big to fit in one Mac's memory
- MLX distributed support spreads a single model across multiple Macs (connected over Thunderbolt or Ethernet), so they run it together as one
- Launch it with `mlx.launch`, pointing at the machines and the model

```bash
mlx.launch --hostfile hosts.json \
  /remote/path/to/mlx_lm.server \
  --model mlx-community/<model-name>
```

@Image(source: "WWDC26-232-spread-model", alt: "One large model spread across multiple Macs for distributed inference")

- Learn how to set up Macs for distributed inference: <doc:WWDC26-233-Explore-distributed-inference-and-training-with-MLX>
