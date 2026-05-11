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
- **Tab Navigator** (`app/(tabs)/_layout.tsx`): Three tabs - Home, Components, and About
- **Component Screens** (`app/(tabs)/components/*.tsx`): Individual showcase pages for each component

### Directory Structure

```
app/
├── _layout.tsx              # Root layout with EDSProvider and theme setup
├── (tabs)/                  # Tab navigator group
│   ├── _layout.tsx         # Tab navigation configuration
│   ├── index.tsx           # Home screen
│   ├── about.tsx           # About screen
│   └── components/         # Component showcase screens
│       ├── _layout.tsx     # Components stack navigator
│       ├── index.tsx       # Components list (only Slice 1 components shown)
│       ├── button.tsx      # Button showcase
│       ├── input.tsx       # Input showcase
│       ├── selectioncontrols.tsx  # Radio / Switch / Checkbox showcase
│       ├── typography.tsx  # Typography showcase
│       └── ...             # Future screens added per slice
├── +not-found.tsx          # 404 screen

components/                 # Storybook-specific utility components
├── Section.tsx            # Layout helper — canvas-level text, titles, descriptions
├── Surface.tsx            # Wraps component demos with elevated background
└── SettingsControls.tsx   # Theme and density controls in the header

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

### Screen Layout Pattern

Component screens follow a consistent two-level hierarchy:

- **Group headers** (`Typography.Header size="lg" weight="bolder"`) — top-level divisions within a screen (e.g. "Radio Buttons", "Typography UI"). Use a `Section` with extra `paddingTop` to visually separate from the preceding group.
- **Subsection labels** (`Section title="..."`) — describe what follows (e.g. "With labels", "Sizes"). Rendered as subtle uppercase small text.
- **Descriptions** (`Section` with `Typography` children) — body text explaining the section.
- **Demos** (`Surface`) — wraps the actual component examples with an elevated background.

```tsx
<Section style={styles.groupHeader}>
    <Typography.Header size="lg" weight="bolder">Group Name</Typography.Header>
</Section>

<Section title="Subsection label">
    <Typography>Optional description.</Typography>
</Section>
<Surface>
    <MyComponent />
</Surface>
```

## Development Workflow

### Adding a New Component Screen

When a new component is added to the library, follow these steps:

1. **Create screen file** in `app/(tabs)/components/mycomponent.tsx`:
```tsx
import { Section } from "@/components/Section";
import { Surface } from "@/components/Surface";
import { MyComponent, Typography } from "@equinor/eds-mobile-components";
import { ScrollView } from "react-native";

export default function MyComponentScreen() {
    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <Section>
                <Typography>
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

2. **Add to components list** in `app/(tabs)/components/index.tsx` under the appropriate section.

3. **Export the component** from `packages/components/src/index.ts` if not already exported.

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

**Always use `EDSStyleSheet.create` + `useStyles` for styling:**

```tsx
import { EDSStyleSheet, useStyles } from "@equinor/eds-mobile-components";

export default function MyScreen() {
    const styles = useStyles(themeStyles);
    return <View style={styles.container} />;
}

const themeStyles = EDSStyleSheet.create((token) => ({
    container: {
        paddingTop: token.newSpacing.spacing.vertical.threeXl,
    },
}));
```

This keeps styling separate from layout and gets full token type-safety and theme reactivity.

**Use `useToken()` only when the token value must be passed outside a stylesheet** — e.g. rendered as text content, or passed to a third-party API that doesn't accept a style object:

```tsx
const { newTypography } = useToken();
// OK: displaying font size as a string
<Typography>{newTypography.ui.fontFamilySize.lg.fontSize}px</Typography>
```

**Don't:**
- Use `useToken()` + inline style objects for regular styling — use `EDSStyleSheet` instead
- Over-style the showcase screens — keep focus on the components
- Use hardcoded colors except for code display backgrounds
- Create complex custom components — use EDS components

## Key Dependencies

**Expo Ecosystem:**
- `expo` - Platform and build tools
- `expo-router` - File-based routing
- `expo-font` - Font loading (required by EDS components)

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

### Theme and Density Controls

Theme (light/dark) and density (spacious/comfortable) are controlled by `SettingsControls`, which is mounted in the stack header via `_layout.tsx`. It reads/writes the Zustand store in `lib/store.ts`. No action needed in individual screens.

### Accessing Design Tokens

For styling, use `EDSStyleSheet.create((token) => ...)` — the `token` argument gives full access to all design tokens inside the stylesheet factory.

Use `useToken()` only when you need a token value outside a stylesheet (e.g. to render it as text or pass it to a third-party API):

```tsx
import { useToken } from "@equinor/eds-mobile-components";

const { newTypography } = useToken();
// Render the font size value as visible text
<Typography>{newTypography.ui.fontFamilySize.lg.fontSize}px</Typography>
```

### Creating Reusable Section Layouts

Use the `Section` component for consistent spacing:

```tsx
import { Section } from "@/components/Section";

<Section title="My Section">
    {/* Content */}
</Section>
```
