<!-- source: https://documentation.tokens.studio/graph-engine/introduction -->

[Graph Engine](/graph-engine)

# Introduction [​](#introduction)

![](/images/Graph%20Engine.png)

## What’s a Node Editor? [​](#whats-a-node-editor)

A node editor is a visual tool where you build workflows by connecting **nodes**—little blocks of functionality—together with **edges** (lines). Think of it like a flowchart for design logic: each node does something specific (e.g., converts a color to a hex string), and the edges show how data flows between them. In Studio's Graph Engine, this editor lets you create, tweak, and scale design systems without writing code manually. It’s built to be intuitive, combining the visual ease of tools like Figma with the procedural power of something like Blender’s node system. Whether you’re a designer organizing tokens or a design engineer generating outputs for developers, it’s your playground for visual logic.

## What Can You Do With It? [​](#what-can-you-do-with-it)

The Graph Engine transforms how you manage design systems by letting you define logic visually. Here’s what you can achieve:

-   **Generate Design Tokens Dynamically**: Create tokens (e.g., colors, sizes) based on rules, not static lists—like generating a full color scale from a single base color using math and color theory.
-   **Automate Multi-Brand Systems**: Switch between brand themes (e.g., Light vs. Dark) instantly by adjusting inputs, perfect for companies managing multiple products.
-   **Scale Complex Designs**: Use subgraphs to reuse workflows (e.g., a button styling recipe) across projects, or map arrays to process lists (e.g., converting 10 colors to hex codes at once).
-   **Bridge Design and Code**: Output agnostic JSON tokens or even CSS variables that developers can use directly, reducing handoff friction.
-   **Experiment Freely**: Test ideas—like creating a type scale with a multiplier—without breaking your system, thanks to non-destructive editing. **Example**: Imagine you need a color palette for a brand. Start with a base color (#FF5733), use nodes to adjust its lightness for variants (e.g., +10%, -20%), and output a set of hex codes—all in real-time, synced to Figma variables if you want