<!-- source: https://documentation.tokens.studio/graph-engine/available-nodes/generic/time -->

[Graph Engine](/graph-engine)›[Available Nodes](/graph-engine/available-nodes)›[Generic](/graph-engine/available-nodes/generic)

# Time [​](#time)

### What It Does [​](#what-it-does)

Provides the current timestamp in milliseconds, updating automatically every second while the graph is running. It acts as a timer or clock source for time-based operations.

### Inputs [​](#inputs)

| Name | Description | Type | Required |
| --- | --- | --- | --- |
| (none) |  |  |  |

### Outputs [​](#outputs)

| Name | Description | Type |
| --- | --- | --- |
| value | Current time in milliseconds since Unix epoch | Number |

![Time Example](/images/Screenshot%202025-04-22%20at%206.33.21%E2%80%AFPM%20\(1\).png)

### How to Use It [​](#how-to-use-it)

1.  Drag the Time node into your graph.
2.  Connect its "value" output to nodes that need time information.
3.  The node will automatically update every second when the graph is running.
4.  Use with math operations to create timing patterns or schedules.

### Tips [​](#tips)

-   The time value is in milliseconds since January 1, 1970 (Unix epoch).
-   Use the Math nodes to convert the timestamp to more usable formats like seconds or minutes.

### See Also [​](#see-also)

-   **Delay**: For pausing execution for a specific duration.
-   **Math Expression**: For converting timestamp to human-readable formats.

### Use Cases [​](#use-cases)

-   **Animation Timing**: Create time-based animations or transitions.
-   **Scheduling**: Trigger events at specific times or intervals.
-   **Timer Applications**: Build countdown timers or stopwatches for design prototyping.