<!-- source: https://documentation.tokens.studio/graph-engine/editing -->

[Graph Engine](/graph-engine)

# Editing [​](#editing)

The Graph Engine’s node editor is designed for flexibility and ease, letting you build and tweak graphs with simple actions. Here’s how to edit your workflows efficiently.

### Adding & Moving Nodes [​](#adding-moving-nodes)

Add nodes to your canvas in three ways, each with a handy description to guide you:

-   **From the Nodes Panel**:
    -   Open the Nodes Panel (usually on the left), find a node (e.g., "Add" or "Color to String"), and drag it onto the canvas.
    -   **Hover Tip**: Pause over a node in the panel to see its description (e.g., "Adds two numbers together").
-   **Through Shift + K Menu**:
    -   Press **Shift + K** to open a searchable menu.
    -   Type to filter nodes (e.g., "color" for color-related nodes), select one, and hit Enter to add it where your cursor is.
    -   **Bonus**: Each node shows a description in the menu for quick reference.
-   **From the Top Action Bar**:
    -   Click the **Nodes Icon** in the toolbar (top of the screen), pick a node from the dropdown, and it lands on the canvas.
-   **Moving Nodes**: Click and drag any node to reposition it.

### Connecting Nodes [​](#connecting-nodes)

Link nodes to flow data between them using two methods:

-   **Drag Method**: Click an output port (right side), drag to a matching input port (left side), and release. A blue edge appears if the types match; a red edge means they don’t.
-   **Click Method**: Click an output port, then click an input port. The editor auto-draws a blue edge if compatible. **Tip**: Hover over ports to check types (e.g., "color", "number") if "Port Types" is enabled.

### Disconnecting Nodes [​](#disconnecting-nodes)

Break connections easily:

-   Click an edge (the line between ports), then press **Delete**. The edge vanishes, and data stops flowing.

### Split Connections (Pass Through) [​](#split-connections-pass-through)

Insert a node into an existing connection to modify the flow:

-   **Double-Click Method**: Double-click an edge, pick a node from the menu that pops up (e.g., "Log Value"), and it splits the edge, wiring the new node between the original two.

### Duplicate [​](#duplicate)

Make an exact copy without clipboard fuss:

-   Right-click a node (or selected nodes) and choose **Duplicate** from the menu. The copy appears nearby, with settings intact but no edges.

### Grouping Nodes [​](#grouping-nodes)

Keep your graph organized visually:

-   Select multiple nodes (click or drag a box), right-click, and choose Create Group.
-   What Happens: A colored background wraps the nodes, making them a visual unit without changing their logic (unlike a Subgraph).
-   Manage Groups: Right-click the group to Ungroup (removes the background) or Delete (removes the group and all nodes inside).

### Testing Your Graph [​](#testing-your-graph)

See your work come to life as you edit:

-   Live Updates: The Output Panel and Inline Values (if enabled) update instantly as you connect or tweak nodes.
-   Preview Nodes: Connect an output to a specialized Preview Node for a polished view:
    -   Color Scale Node: Shows a full color palette as swatches, neatly organized.
    -   Color Swatch: Renders a single color with its value.
    -   More preview options are in the Nodes Panel under "Preview Nodes".

Example: Connect a color array output to a Color Scale Node to see all swatches at once while you adjust inputs.

### **Extra Editing Tools** [​](#extra-editing-tools)

-   **Zoom & Pan**: Scroll the mouse wheel to zoom in/out, or drag the canvas to pan—great for navigating big graphs.

### Saving & Sharing [​](#saving-sharing)

Keep and share your graphs easily:

-   Download/Upload: Export your graph as a .json file via the toolbar’s Save icon, then upload it later with the Import option.
-   Team Collaboration: In Studio, your team can access and edit your graphs directly—perfect for collaborative projects.
-   Coming Soon: A community marketplace to exchange graphs and full design system projects. Stay tuned!