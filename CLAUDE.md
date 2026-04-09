# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the EDS Mobile Storybook app.

## App Overview

This is an Expo application that showcases and documents the @equinor/eds-mobile-components library. It provides an interactive playground for exploring components, viewing their usage examples, and testing in both light and dark modes.

## Local Development

From the monorepo root:

```bash
# Build the components package first (required)
pnpm build

# Run the storybook app
pnpm dev:storybook

# Or from this directory
pnpm ios       # Run on iOS simulator
pnpm android   # Run on Android emulator
pnpm start     # Start Metro bundler
```

### First-Time iOS Setup

```bash
cd ios && pod install
```

### Troubleshooting

**Pods out of sync:**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
```

**Metro bundler cache issues:**
```bash
pnpm start -- --clear
```

**"hapticpatternlibrary.plist" error:** This is harmless - iOS Simulator doesn't support haptics. Ignore it.

## Architecture

### Expo Router with File-Based Routing

The app uses [Expo Router](https://docs.expo.dev/router/introduction/) for navigation:

- **Root Layout** (`app/_layout.tsx`): Sets up EDSProvider, loads fonts with `useEDS()`, integrates theme from Zustand store
- **Tab Navigator** (`app/(tabs)/_layout.tsx`): Two tabs - Home and Components
- **Component Screens** (`app/(tabs)/components/*.tsx`): Individual showcase pages for each component

### Directory Structure

```
app/
├── _layout.tsx              # Root layout with EDSProvider and theme setup
├── (tabs)/                  # Tab navigator group
│   ├── _layout.tsx         # Tab navigation configuration
│   ├── index.tsx           # Home screen
│   └── components/         # Component showcase screens
│       ├── _layout.tsx     # Components stack navigator
│       ├── index.tsx       # Components list
│       ├── paper.tsx       # Example: Paper component showcase
│       ├── buttons.tsx     # Example: Button component showcase
│       └── ...             # Other component screens
├── +not-found.tsx          # 404 screen

codeSnippets/               # Code examples for each component
├── paper.ts
├── buttons.ts
└── ...

components/                 # Storybook-specific utility components
├── CodeDialog.tsx         # Dialog for displaying code snippets
├── Section.tsx            # Layout helper for screens
└── ColorSchemeButton.tsx  # Theme switcher button

hooks/
└── useCodeSnippet.tsx     # Hook for managing code snippet dialogs

lib/
└── store.ts               # Zustand store for app state (theme)
```

### Theme Management

**Zustand Store** (`lib/store.ts`):
- Manages user theme preference ("light" | "dark" | null)
- `null` means follow system color scheme
- Used by root layout to configure EDSProvider

**Theme Switching:**
```tsx
import { useAppStore } from "@/lib/store";

const setScheme = useAppStore((state) => state.setScheme);

// Set theme
setScheme("dark");    // Force dark mode
setScheme("light");   // Force light mode
setScheme(null);      // Follow system
```

### Code Snippet Pattern

Each component screen uses the `useCodeSnippet` hook to display copyable code examples:

**1. Define code snippets** (`codeSnippets/mycomponent.ts`):
```ts
export const basicExample = `import { MyComponent } from "@equinor/eds-mobile-components";

<MyComponent prop="value" />`;
```

**2. Use in component screen** (`app/(tabs)/components/mycomponent.tsx`):
```tsx
import { basicExample } from "@/codeSnippets/mycomponent";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";

export default function MyComponentScreen() {
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView>
            {/* Component examples */}

            <ViewCode title="Basic Example" code={basicExample} />

            {/* Must be at the end */}
            <CodeSnippetDialog />
        </ScrollView>
    );
}
```

This pattern provides:
- "View Code" button that opens a dialog
- Code syntax display with copy-to-clipboard functionality
- Consistent UX across all component screens

## Development Workflow

### Adding a New Component Screen

When a new component is added to the library, follow these steps:

1. **Create code snippets** in `codeSnippets/mycomponent.ts`:
```ts
export const basicUsage = `import { MyComponent } from "@equinor/eds-mobile-components";

<MyComponent />`;

export const advancedUsage = `// More complex example here`;
```

2. **Create screen file** in `app/(tabs)/components/mycomponent.tsx`:
```tsx
import { Section } from "@/components/Section";
import { Surface } from "@/components/Surface";
import { MyComponent, Typography } from "@equinor/eds-mobile-components";
import { ScrollView } from "react-native";

export default function MyComponentScreen() {
    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <Section>
                <Typography variant="p">
                    Description of the component and its use cases.
                </Typography>
            </Section>

            <Section title="Basic Usage" />
            <Surface>
                <MyComponent />
            </Surface>
        </ScrollView>
    );
}
```

**Important layout rules:**
- Use `<Section>` for all text, titles, and descriptions — never hardcoded `StyleSheet` padding
- Use `<Surface>` to wrap component demos — this creates the canvas → surface → component layering
- `<Section>` sits on canvas (app background), `<Surface>` provides a distinct elevated background
- This pattern ensures consistent spacing and visual depth across all screens

3. **Register the screen** in `app/(tabs)/components/_layout.tsx` (if needed for navigation configuration)

4. **Add to components list** in `app/(tabs)/components/index.tsx` to make it discoverable

### Component Screen Best Practices

- **Use `contentInsetAdjustmentBehavior="automatic"`** on ScrollView for proper safe area handling
- **Use `<Section>` for text/titles** — never hardcoded `StyleSheet` padding for layout sections
- **Use `<Surface>` for component demos** — creates visual depth (canvas → surface → component)
- **Group related examples** in separate sections with headings
- **Include descriptions** to explain when and why to use the component
- **Show multiple variants** — demonstrate different props and configurations

### Testing Component Changes

When working on the component library:

1. Make changes in `packages/components/src/`
2. Run `pnpm dev:components` from root (watch mode)
3. The storybook app will hot-reload with changes
4. Test in both light and dark modes using the theme switcher

### Styling Guidelines

**For storybook-specific UI:**
- Use standard `StyleSheet.create()` for layout and storybook-specific components
- Use EDS components (Paper, Typography, Button, etc.) for content display
- Keep styles simple and focused on showcasing components

**Don't:**
- Over-style the showcase screens - keep focus on the components
- Use hardcoded colors except for code display backgrounds
- Create complex custom components - use EDS components

## Key Dependencies

**Expo Ecosystem:**
- `expo` - Platform and build tools
- `expo-router` - File-based routing
- `expo-font` - Font loading (required by EDS components)
- `expo-clipboard` - Copy code snippets

**Navigation:**
- `@react-navigation/native` - Navigation primitives
- `@react-navigation/bottom-tabs` - Tab navigator

**State Management:**
- `zustand` - Lightweight state management for theme

**Components:**
- `@equinor/eds-mobile-components` - The library being showcased (workspace dependency)

## Platform-Specific Notes

### iOS Development

- **Requires:** Xcode 14+ and CocoaPods
- **First time:** Run `cd ios && pod install`
- **Hot reload:** Works automatically with Metro bundler
- **Physical device:** Use Expo development build or scan QR with Expo Go (limited features)

### Android Development

- **Requires:** Android Studio with Android SDK and emulator
- **Hot reload:** Works automatically with Metro bundler
- **Physical device:** Enable USB debugging or scan QR with Expo Go

## Common Tasks

### Adding a Theme Switcher

The `ColorSchemeButton` component is available for toggling themes:

```tsx
import { ColorSchemeButton } from "@/components/ColorSchemeButton";

<ColorSchemeButton />
```

### Accessing Design Tokens

Use `useToken()` from EDS components to access theme values:

```tsx
import { useToken } from "@equinor/eds-mobile-components";

const { newColors, newSpacing } = useToken();
```

### Creating Reusable Section Layouts

Use the `Section` component for consistent spacing:

```tsx
import { Section } from "@/components/Section";

<Section title="My Section">
    {/* Content */}
</Section>
```
