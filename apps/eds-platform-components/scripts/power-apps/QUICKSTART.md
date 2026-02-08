# Power Apps Quick Start Guide

Get started with EDS components in Power Apps Canvas Apps.

## Prerequisites

- Power Apps license (Developer, Premium, or Per App)
- Access to Power Apps Studio
- Basic familiarity with Power Apps Canvas Apps

## Step 1: Generate Components

From the repository root or app directory:

```bash
# From repository root
pnpm platform:generate:power-apps button

# OR from app directory
cd apps/eds-platform-components
pnpm generate:power-apps button
```

This generates YAML files in `scripts/power-apps/output/`

## Step 2: Open Power Apps Studio

1. Go to [make.powerapps.com](https://make.powerapps.com)
2. Create a new Canvas App or open an existing one
3. Ensure you're in **Edit** mode

## Step 3: Import Component

### Using Tree View (Recommended)

1. Click on **Tree View** in the left navigation
2. Click the **...** (more options) menu at the top
3. Select **Paste YAML**
4. Open a generated `.yaml` file (e.g., `button-contained-primary.yaml`)
5. Copy the entire content
6. Paste into the YAML dialog in Power Apps
7. Click **Paste** to confirm

The component will appear in your app!

### Alternative: Paste Code View

1. In Power Apps Studio, click **Tree View**
2. Select a screen where you want to add the button
3. Click the **...** menu next to the screen name
4. Select **Paste code**
5. Paste the YAML content
6. The button will be added to the screen

## Step 4: Customize

### Change Text

Select the button and modify the `Text` property:

```powerfx
Text = "My Custom Button"
```

### Change Position

Drag the button or set X/Y coordinates:

```powerfx
X = 100
Y = 200
```

### Add Action

Modify the `OnSelect` property:

```powerfx
OnSelect = Navigate(DetailsScreen, ScreenTransition.Fade)
```

## Available Components

### Button Variants

| Variant       | Description                         | Use Case                         |
| ------------- | ----------------------------------- | -------------------------------- |
| **Contained** | Filled button with solid background | Primary actions, CTAs            |
| **Outlined**  | Border only, transparent background | Secondary actions                |
| **Ghost**     | Text only, no border                | Tertiary actions, subtle options |

### Color Schemes

| Color         | Hex     | Use Case                             |
| ------------- | ------- | ------------------------------------ |
| **Primary**   | #007079 | Standard brand actions               |
| **Secondary** | #243746 | Alternative actions                  |
| **Danger**    | #EB0037 | Destructive actions (delete, remove) |

### Files Generated

```text
button-contained-primary.yaml       ✅ Ready to use
button-contained-secondary.yaml     ✅ Ready to use
button-contained-danger.yaml        ✅ Ready to use
button-outlined-primary.yaml        ✅ Ready to use
button-outlined-secondary.yaml      ✅ Ready to use
button-outlined-danger.yaml         ✅ Ready to use
button-ghost-primary.yaml           ✅ Ready to use
button-ghost-secondary.yaml         ✅ Ready to use
button-ghost-danger.yaml            ✅ Ready to use
button-*-disabled.yaml              ✅ Disabled state examples
```

## Common Customizations

### Responsive Button

Make button width responsive to screen size:

```powerfx
Width = Parent.Width * 0.4
```

### Dynamic Text

Show different text based on variable:

```powerfx
Text = If(varIsLoading, "Loading...", "Submit")
```

### Conditional Visibility

Show/hide button based on condition:

```powerfx
Visible = !IsBlank(TextInput1.Text)
```

### Disable Based on Condition

```powerfx
DisplayMode = If(IsBlank(TextInput1.Text), DisplayMode.Disabled, DisplayMode.Edit)
```

## PowerFX Formulas

### Navigation

```powerfx
OnSelect = Navigate(NextScreen, ScreenTransition.Cover)
```

### Show Notification

```powerfx
OnSelect = Notify("Action completed successfully", NotificationType.Success)
```

### Submit Form

```powerfx
OnSelect = SubmitForm(Form1); Navigate(SuccessScreen)
```

### Save to Data Source

```powerfx
OnSelect = Patch(
    DataSource,
    Defaults(DataSource),
    {
        Name: TextInput1.Text,
        Email: TextInput2.Text
    }
)
```

## Troubleshooting

### "YAML Paste Failed"

- Ensure you copied the entire YAML content
- Check for formatting issues (indentation must be correct)
- Try copying from a fresh generated file

### "Button Not Appearing"

- Make sure you're in Tree View when pasting
- Verify the screen is selected before pasting
- Check if button is positioned off-screen (adjust X/Y values)

### "Colors Don't Match EDS"

- Power Apps renders colors slightly differently
- RGBA values are pre-converted from EDS tokens
- For exact matching, test in actual Power Apps environment

### "OnSelect Not Working"

- Check for syntax errors in PowerFX formula
- Verify navigation screen names exist
- Test with simple `Notify()` first

## Best Practices

1. **Naming Convention**: Use descriptive names like `btnSubmitForm` instead of `Button1`

2. **Grouping**: Group related buttons using containers

3. **Accessibility**: Always set meaningful `Tooltip` and `AccessibleLabel` properties

4. **State Management**: Use variables (`Set()`, `UpdateContext()`) for button states

5. **Error Handling**: Wrap actions in error handling:

   ```csharp
   OnSelect = IfError(
       SubmitForm(Form1),
       Notify("Error: " & FirstError.Message, NotificationType.Error)
   )
   ```

## Next Steps

1. **Add More Components**: Watch for new component generators (coming soon)
2. **Customize Colors**: Modify `scripts/power-apps/utils/eds-tokens.ts` for custom palettes
3. **Create Templates**: Save customized buttons as components in Power Apps
4. **Share**: Export your app and share with team members

## Resources

- [Power Apps Documentation](https://learn.microsoft.com/en-us/power-apps/)
- [PowerFX Reference](https://learn.microsoft.com/en-us/power-platform/power-fx/formula-reference)
- [EDS Documentation](https://eds.equinor.com)
- [EDS Storybook](https://storybook.eds.equinor.com/)

## Support

For issues or questions:

1. Check [scripts/power-apps/README.md](scripts/power-apps/README.md)
2. Review generated YAML examples
3. Refer to Power Apps YAML documentation
4. Create an issue in the repository

---

Happy building with EDS and Power Apps! 🎨⚡
