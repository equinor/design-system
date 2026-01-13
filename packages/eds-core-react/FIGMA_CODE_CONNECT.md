# Figma Code Connect Guide

This guide explains how to use Figma Code Connect CLI to connect <abbr title="Equinor Design System">EDS</abbr> React components with their Figma counterparts.

## Overview

Code Connect bridges your React components with Figma's Dev Mode, showing developers accurate code snippets instead of auto-generated examples when they inspect components in Figma.

## Prerequisites

- Node.js 18+
- A Figma account with Dev Mode access (Organization or Enterprise plan)
- Figma Personal Access Token

### Getting a Figma Access Token

1. Go to [Figma Account Settings](https://www.figma.com/settings)
2. Scroll to "Personal Access Tokens"
3. Click "Create new token"
4. Give it a name and copy the token

## Project Structure

:::info

Code Connect is currently only enabled for components in the `/next` folder (EDS 2.0 components).

:::

```
packages/eds-core-react/
├── figma.config.json          # Code Connect configuration
├── .env                       # Figma access token (git-ignored)
├── package.json
└── src/components/
    └── next/                  # EDS 2.0 components (Code Connect enabled)
        ├── Placeholder/
        │   ├── Placeholder.tsx
        │   ├── Placeholder.figma.tsx   # Example Code Connect file
        │   └── ...
        └── [YourComponent]/
            ├── YourComponent.tsx
            ├── YourComponent.figma.tsx
            └── ...
```

## Configuration

The `figma.config.json` file is located at the package root (alongside `package.json`) and configures Code Connect:

```json
{
  "codeConnect": {
    "include": ["src/components/next/**/*.{tsx,jsx}"],
    "label": "React",
    "interactiveSetupFigmaFileUrl": "https://www.figma.com/design/YOUR_FILE_KEY/..."
  }
}
```

## Creating a Code Connect File

### Step 0: Create the .env file

Create a `.env` file at the package root (`packages/eds-core-react/.env`):

```
FIGMA_ACCESS_TOKEN="your_token"
```

This will be picked up by the Code Connect CLI when run from the package root.

### Step 1: Create the `.figma.tsx` File

Create a file named `ComponentName.figma.tsx` in the component's directory:

```tsx
import figma from '@figma/code-connect'
import { Button } from './Button'

figma.connect(
  Button,
  'https://www.figma.com/design/FILE_KEY/FILE_NAME?node-id=XX-YYYY',
  {
    props: {
      // Map Figma properties to code props
    },
    example: (props) => <Button {...props} />,
  },
)
```

### Step 2: Get the Figma Component URL

1. Open your Figma file
2. Select the component (main component, not an instance)
3. Right-click → "Copy link to selection"
4. Use this URL in `figma.connect()`

### Step 3: Map Properties

Code Connect provides helpers to map Figma properties to code:

## Property Mapping Reference

### Strings

```tsx
props: {
  label: figma.string('Label')
}
```

### Booleans

```tsx
props: {
  // Simple boolean
  disabled: figma.boolean('Disabled'),

  // Boolean with conditional values
  icon: figma.boolean('Show Icon', {
    true: figma.children('Icon'),
    false: undefined,
  }),
}
```

### Enums (Variants)

```tsx
props: {
  variant: figma.enum('Variant', {
    'Primary': 'contained',
    'Secondary': 'outlined',
    'Ghost': 'ghost',
  }),
}
```

### Text Content

```tsx
props: {
  label: figma.textContent('Label Text')
}
```

### Nested Properties

Access properties from a nested layer:

```tsx
props: {
  buttonProps: figma.nestedProps('⌘ Button', {
    label: figma.textContent('Label'),
    variant: figma.enum('Variant', { ... }),
  }),
}
```

### Children (Nested Instances)

Render child component instances:

```tsx
props: {
  // Single child by layer name
  icon: figma.children('Icon'),

  // Multiple children
  items: figma.children(['Item 1', 'Item 2']),

  // Any children (wildcard)
  content: figma.children('*'),
}
```

### Instance References

Reference a connected component that returns a value:

```tsx
props: {
  // Get the connected component's example output
  icon: figma.instance('Icon'),

  // With type annotation (when the connected component returns a string)
  iconName: figma.instance<string>('Icon'),
}
```

## Complete Example: Button Component

```tsx
import figma from '@figma/code-connect'
import { Button } from './Button'

figma.connect(
  Button,
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR/EDS-Core-Components?node-id=18-1193',
  {
    props: {
      color: figma.enum('Tone', {
        Accent: 'primary',
        Neutral: 'secondary',
        Danger: 'danger',
      }),
      baseButton: figma.nestedProps('⌘ Button', {
        label: figma.textContent('Label Text'),
        variant: figma.enum('Variant', {
          Primary: 'contained',
          Secondary: 'outlined',
          Ghost: 'ghost',
        }),
        LeadingIcon: figma.boolean('Show Leading Icon', {
          true: figma.children('Leading Icon Item'),
          false: undefined,
        }),
        TrailingIcon: figma.boolean('Show Trailing Icon', {
          true: figma.children('Trailing Icon Item'),
          false: undefined,
        }),
      }),
    },
    example: ({ color, baseButton }) => (
      <Button color={color} variant={baseButton.variant}>
        {baseButton.LeadingIcon}
        {baseButton.label}
        {baseButton.TrailingIcon}
      </Button>
    ),
  },
)
```

## Variant Restrictions

Connect different code components to different Figma variants:

```tsx
// Primary button variant
figma.connect(Button, 'https://...', {
  variant: { Type: 'Primary' },
  example: () => <PrimaryButton />,
})

// Secondary button variant
figma.connect(Button, 'https://...', {
  variant: { Type: 'Secondary' },
  example: () => <SecondaryButton />,
})
```

## Connecting Icons

Icons require a special setup since there are many of them. We use a script to auto-generate connections.

### Icon Wrapper (`Icon.figma.tsx`)

```tsx
import figma from '@figma/code-connect'
import { Icon } from './Icon'

figma.connect(
  Icon,
  'https://www.figma.com/design/.../EDS-Core-Components?node-id=66-4156',
  {
    props: {
      iconName: figma.instance<string>('Icon'),
    },
    example: ({ iconName }) => <Icon name={iconName} />,
  },
)
```

### Auto-generated Icon Data names (`IconData.figma.tsx`)

Run the icon generation script:

```bash
node scripts/generate-icon-figma-connect.mjs --token YOUR_FIGMA_TOKEN
```

This generates connections for each icon that return the icon name as a string.

## CLI Commands

### Publish Connections

Publish all Code Connect files:

```bash
npx figma connect publish
```

Publish a specific component (run from `packages/eds-core-react/`):

```bash
npx figma connect publish --dir "src/components/Radio"
```

Dry run (validate without publishing):

```bash
npx figma connect publish --dry-run
```

### Unpublish Connections

```bash
npx figma connect unpublish
```

### Interactive Setup

Create connections interactively:

```bash
npx figma connect
```

## Environment Variables

You can set these instead of passing CLI flags:

```bash
export FIGMA_ACCESS_TOKEN=your_token
```

Or create a `.env` file at the package root (`packages/eds-core-react/`):

```
FIGMA_ACCESS_TOKEN=your_token
```

:::warning

Never commit your Figma access token to version control. Add `.env` to `.gitignore`.

:::

## Troubleshooting

### "Component not found"

- Ensure you're linking to the **main component**, not an instance
- Check that the node ID in the URL is correct

### Props not mapping correctly

- Figma property names are case-sensitive
- Check for special characters in layer names
- Use the exact property name as shown in Figma's design panel

### Icons not showing

- Ensure `IconData.figma.tsx` has been generated and published
- Check that the Icon component is properly connected
- Verify the icon's Figma component is in the icons file

## Best Practices

1. **Keep `.figma.tsx` files next to components** -- Makes it easy to maintain
2. **Use meaningful prop names** -- They appear in the generated code
3. **Test with dry-run first** -- Validate before publishing
4. **Connect main components** -- Not instances or variants (unless using variant restrictions)
5. **Document complex mappings** -- Add comments for non-obvious property mappings

## Resources

- [Figma Code Connect Documentation](https://developers.figma.com/docs/code-connect/)
- [Code Connect GitHub Repository](https://github.com/figma/code-connect)
- [React Integration Guide](https://developers.figma.com/docs/code-connect/react/)
