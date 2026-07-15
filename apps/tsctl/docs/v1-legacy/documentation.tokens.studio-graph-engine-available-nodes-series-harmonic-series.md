<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/series/harmonic-series -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Series](/graph-engine/available-nodes/series)

# Harmonic Series [​](#harmonic-series)

### What It Does [​](#what-it-does)

Generates a sequence based on harmonic proportions, where values follow a pattern related to musical harmonics. The node creates a progression where each value is calculated by raising a ratio to a fractional power determined by the index and number of notes.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| base | The central value of the series | Number | No |
| stepsDown | Number of steps to generate below the base value | Number | No |
| stepsUp | Number of steps to generate above the base value | Number | No |
| notes | Number of steps that make up a complete octave/cycle | Number | No |
| ratio | The harmonic ratio (typically 2 for musical octaves) | Number | No |
| precision | Number of decimal places to round to | Number | No |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| array | The sequence of values as a simple array | List |
| indexed | The values with their corresponding position indices | List |

![Harmonic Series Example](/images/Screenshot%202025-04-17%20at%205.22.59%E2%80%AFPM.png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Harmonic Series node into your graph.
2.  Set the "base" value (default is 16).
3.  Set how many steps you want below the base ("stepsDown", default is 0).
4.  Set how many steps you want above the base ("stepsUp", default is 5).
5.  Set the "notes" parameter to define the number of divisions in an octave (default is 5).
6.  Set the "ratio" (default is 2, which creates a standard octave relationship).
7.  Run the graph—with the default settings, your output will be a series that increases by harmonically related intervals.

### Tips [​](#tips)

-   With ratio=2 and notes=12, you'll get a chromatic musical scale (12 equal divisions of an octave).
-   For musical applications, the base is typically a frequency value.
-   The harmonic relationship creates a more natural-sounding progression than equal divisions.

### See Also [​](#see-also)

-   **Geometric Series**: For sequences with constant multiplication between terms.
-   **Arithmetic Series**: For sequences with constant addition between terms.
-   **Exponential Decay**: For sequences that gradually decrease according to exponential decay.

### Use Cases [​](#use-cases)

-   **Musical Scales**: Generate frequencies for notes in various musical tuning systems.
-   **Natural Proportions**: Create sequences that follow ratios found in nature.
-   **Harmonic Typography**: Design type scales with proportional relationships between sizes.
-   **Resonant Spacing**: Generate spacing values that have harmonic relationships for UI design.