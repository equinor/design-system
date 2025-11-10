# Figma MCP Integration

This guide explains how to set up Figma Model Context Protocol (MCP) integration with VS Code Copilot Chat for improved design-to-code workflow.

## What is Figma MCP?

Figma MCP enables direct integration between Figma and VS Code Copilot Chat, allowing you to:

- Extract design tokens and specifications directly in chat
- Compare code implementations against Figma designs
- Generate code from Figma components
- Access design information without switching between tools

## Prerequisites

- Figma Desktop app installed
- VS Code with GitHub Copilot extension
- Access to the Equinor Design System Figma files
- **Important**: You must be a member of the EDS team in Figma

## Setup

### 1. Enable Figma Dev Mode

1. Open Figma Desktop
2. Navigate to the [EDS Workspace](https://www.figma.com/files/682286909510540417/workspace/1404734309303602976/directory/teams):
   - For component migration work, focus on [EDS Core Components](https://www.figma.com/files/682286909510540417/project/328956212/Core-Components)
   - Open any of the component files (e.g., "Checkbox 2.0", "Button 2.0")
3. **Enable Dev Mode**:
   - Look for the "Dev Mode" toggle in the right side of the toolbar at the bottom of Figma
   - Click to enable it (should show a green indicator when active)
   - You'll see the interface change to show component specs and tokens

### 1.5. Verify MCP Server is Running

To confirm the MCP server is active:

1. With Dev Mode enabled in Figma, check the status bar in the right hand panel
2. You should see an indicator showing "MCP Server: Enabled" with
3. If you don't see this, try:
   - Refreshing the Figma file
   - Toggling Dev Mode off and on again
   - Restarting Figma Desktop

### 2. Configure VS Code

The repository includes MCP configuration in `.vscode/mcp.json`:

```json
{
  "servers": {
    "figma": {
      "type": "http",
      "url": "http://127.0.0.1:3845/mcp"
    }
  }
}
```

This configuration connects to Figma Desktop's local MCP server when Dev Mode is active.

### 3. Start Integration

1. Ensure Figma Desktop is running with Dev Mode enabled on a Core Components file
2. Open VS Code in the design-system repository
3. Open Copilot Chat (`Ctrl/Cmd + Shift + I`)
4. Test the connection by asking: "Can you access Figma?"
5. The Figma MCP server should automatically connect and respond

### 4. Test Your Setup

Try these commands to verify everything works:

```
Show me the current Figma file details
```

```
What components are available in this Figma file?
```

If these work, you're ready to go!

## Usage Examples

Once configured, you can use Figma integration in Copilot Chat:

### Design Token Extraction

```
Get the spacing tokens from the Button component in the current Figma file
```

### Component Specification Lookup

```
Show me the design specifications for the Checkbox component
```

### Component Comparison

```
Compare my Checkbox implementation with the Figma design specifications
```

### Code Generation

```
Generate CSS for the Alert component based on the Figma design tokens
```

### EDS-Specific Queries

```
What foundation tokens are used in the Checkbox 2.0 component?
```

```
Show me the color tokens for accent colors in the current Core Components file
```

```
Compare the spacing tokens between Button 2.0 and the old Button component
```

## Troubleshooting

### MCP Server Not Found

- Ensure Figma Desktop is running (not just browser version)
- Check that Dev Mode is enabled in an EDS Figma file
- Verify you're in one of the main Core Components files, not a personal draft
- Restart VS Code if the connection fails
- Check VS Code's Output panel for MCP connection logs

### No Response from Figma in Chat

- Make sure you have an active EDS Figma file open in Figma Desktop
- Try switching to a different EDS component file
- Restart both Figma Desktop and VS Code
- Check that port 3845 is not blocked by firewall

### Access Issues

- Verify you have access to the EDS Figma files
- Check your Figma account permissions with the EDS team
- Ensure you're logged into the correct Figma account in Desktop app

### Dev Mode Not Available

- You need to be a member of the EDS team in Figma to access Dev Mode
- Contact the EDS team for access if you can't see Dev Mode toggle

## Benefits for EDS Development

- **Faster migration work** - Direct access to design specs during component migration
- **Better design alignment** - Real-time comparison between code and design
- **Automated token extraction** - Get exact values for spacing, colors, typography
- **Streamlined workflow** - Less context switching between tools

## Related

- [Component Guidelines](../../COMPONENT_GUIDELINES.md)
- [Migration guides](../../packages/eds-core-react/)
- [EDS Workspace](https://www.figma.com/files/682286909510540417/workspace/1404734309303602976/directory/teams)
- [EDS Core Components](https://www.figma.com/files/682286909510540417/project/328956212/Core-Components)
- [Color System Documentation](../../packages/eds-tokens/instructions/colors.md)

## Team-Specific Notes

- **For component migration**: Use Figma MCP to extract exact foundation tokens during vanilla CSS conversion from the Core Components files
- **For designers**: This integration helps ensure design-code alignment during reviews of new 2.0 components
- **For new team members**: Request EDS Figma access from the team before attempting setup
- **Core Components focus**: The new migrated components (Checkbox 2.0, Button 2.0, etc.) live in the Core Components project
