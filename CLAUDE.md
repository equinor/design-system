# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the @equinor/eds-mobile-components package.

## Package Overview

This package is the core React Native component library implementing the Equinor Design System. It provides 25+ UI components with full support for light/dark theming and comfortable/spacious density modes.

## Local Development

From the monorepo root or this package directory:

```bash
# Build the component library
pnpm build

# Watch mode for development (auto-rebuilds on changes)
pnpm dev

# Lint
pnpm lint

# Type check
pnpm check-types

# Clean build artifacts
pnpm clean
```

## Architecture

### Token and Theming System

The library uses a sophisticated dual token system to support theming:

**Token Sources:**
- Old tokens: `theme.colors.*` and `theme.spacing.*` (being phased out)
- New tokens: `theme.newColors.*` and `theme.newSpacing.*` (actively developed)
- Sourced from `@equinor/eds-tokens` package

**Theme Context:**
- `EDSProvider` wraps the app and provides theme context via React Context
- Accepts `colorScheme` ("light" | "dark") and `density` ("comfortable" | "spacious")
- Creates a `MasterToken` that resolves theme values based on current scheme/density
- Internally wraps app in `GestureHandlerRootView`, `PortalProvider`, `ScrimProvider`, and `DialogServiceProvider`

**Creating Theme-Aware Styles:**
```tsx
// Define styles using EDSStyleSheet.create
const themeStyles = EDSStyleSheet.create((token) => ({
    container: {
        backgroundColor: token.newColors.container.background,
        padding: token.newSpacing.spacer.medium,
    },
}));

// Resolve styles in component using useStyles hook
const MyComponent = () => {
    const styles = useStyles(themeStyles);
    return <View style={styles.container} />;
};
```

**Conditional Styling with Props:**
```tsx
const themeStyles = EDSStyleSheet.create((token, props: { highlighted?: boolean }) => ({
    container: {
        backgroundColor: props.highlighted
            ? token.newColors.interactive.primary
            : token.newColors.container.background,
    },
}));

const MyComponent = ({ highlighted }: { highlighted?: boolean }) => {
    const styles = useStyles(themeStyles, { highlighted });
    return <View style={styles.container} />;
};
```

**Direct Token Access:**
- Use `useToken()` hook to access token values directly in component logic
- Prefer `EDSStyleSheet` + `useStyles` for styling
- Only use `useToken()` when you need token values for non-style purposes

### Token Proxy System

The token system uses a proxy-based architecture (`createTokenProxy`) that automatically resolves theme-dependent values:
- Token definitions use `ColorSchemeValue<T>` objects with `{ light: T, dark: T }` structure
- The proxy automatically returns the correct value based on current `colorScheme` and `density`
- Components never need to check theme mode manually - the token handles it

### Directory Structure

```
src/
├── components/        # All UI components (Button, Paper, TextField, Dialog, etc.)
├── hooks/            # Shared hooks (useEDS, useStyles, useToken, useBreakpoint, etc.)
├── styling/          # Theming system (EDSStyleSheet, token types, color/spacing)
│   └── tokens/       # Token type definitions and proxy system
├── utils/            # Utility functions and types
└── assets/           # Fonts and static assets
```

Each component typically exports:
- Main component (e.g., `Button`)
- Type definitions (e.g., `ButtonProps`)
- Sub-components if applicable (e.g., `Dialog.Alert`, `Dialog.Confirm`)

### Build System

**Build Configuration:**
- Uses `tsup` for bundling (ESM format, tree-shaking enabled)
- `tsc` generates TypeScript declarations separately
- Entry: All `.ts/.tsx` files in `src/` (excluding tests and type definitions)
- Output: `dist/` directory with bundled JS and declaration files
- Font assets (`.otf`) are copied to `dist/assets/fonts/`

**Build Process:**
1. `tsup` bundles source code with splitting and tree-shaking
2. `tsc --emitDeclarationOnly` generates `.d.ts` files
3. In watch mode (`pnpm dev`), both steps run automatically on file changes

### Key Dependencies

**Peer Dependencies** (must be installed by consumers):
- `react`, `react-dom`, `react-native` - Core React Native
- `react-native-gesture-handler` - Touch gestures
- `react-native-reanimated` - Animations
- `react-native-svg` - SVG support
- `expo-font` - Font loading

**Internal Dependencies:**
- `@equinor/eds-tokens` - Design token source
- `@floating-ui/react-native` - Popover positioning
- `react-error-boundary` - Error boundary utilities

### Font Loading

Consumers must call `useEDS()` hook before rendering components to load required fonts:

```tsx
export default function App() {
    const [hasLoadedEds, edsLoadError] = useEDS();
    if (!hasLoadedEds) return null;

    return (
        <SafeAreaProvider>
            <EDSProvider colorScheme="light" density="comfortable">
                <YourApp />
            </EDSProvider>
        </SafeAreaProvider>
    );
}
```

## Development Workflow

### When Working on Components

1. Make changes in `src/`
2. Run `pnpm dev` for watch mode (auto-rebuilds)
3. Test changes in storybook app: `cd ../../ && pnpm dev:storybook`
4. **Always use new tokens** (`theme.newColors`, `theme.newSpacing`) for new work
5. All components must support both light/dark mode and comfortable/spacious density

### When Adding New Components

1. Create component in `src/components/YourComponent/`
   - Main component file: `YourComponent.tsx`
   - Types file: `YourComponent.types.ts` (if complex)
   - Styles using `EDSStyleSheet.create`
2. Export from `src/index.ts`
3. Add storybook story in `../../apps/storybook/app/(tabs)/YourComponent.tsx`
4. Create documentation in `../../docs/YourComponent.md`
5. Follow existing patterns for prop naming and component structure

### Component Development Checklist

- [ ] Uses `EDSStyleSheet.create` for all theming
- [ ] Supports both light and dark modes automatically via tokens
- [ ] Supports both comfortable and spacious density modes
- [ ] Uses `theme.newColors.*` and `theme.newSpacing.*` tokens (not old tokens)
- [ ] Exports TypeScript types for all props
- [ ] Follows existing component patterns (prop naming, structure)
- [ ] Has corresponding storybook story for visual testing
- [ ] Has documentation in `docs/`

## Important Patterns

### Portal System

- Components can render content in portals using `<Portal>` and `<Portal.Host>`
- Root portal host is automatically provided by `EDSProvider`
- Used by Dialog, Menu, and other overlay components
- Allows components to render outside their parent hierarchy (useful for modals, tooltips)

### Dialog Service

- Imperative dialogs available via `Dialog.alert()`, `Dialog.confirm()`, etc.
- Service provider is automatically included in `EDSProvider`
- Returns promises for user actions
- Example: `const result = await Dialog.confirm({ title: "Confirm?", message: "Are you sure?" });`

### Scrim Provider

- Manages backdrop/overlay layers
- Automatically provided by `EDSProvider`
- Used by dialogs and modals
- Provides consistent dimming/backdrop behavior

### Animation

- Use `react-native-reanimated` for animations
- Animation values defined in `styling/animations.ts`
- Common easing curves and durations available via token
- Prefer token-based animation values for consistency

## Component Migration (Figma → Mobile)

All components are being redesigned to match the EDS Figma design. Follow these principles:

- **Match Figma as closely as possible** — use the Figma MCP tools to extract design context, variables, and screenshots
- **Scale for mobile** — Figma designs are web-first; determine an appropriate scale factor per component for mobile touch targets (minimum 44×44pt recommended by Apple)
- **Use semantic tokens** — never hardcode spacing or colors; map Figma CSS variables to `theme.newSpacing.*` and `theme.newColors.*` token paths
- **Typography is the exception** — hardcode fontSize, fontWeight, lineHeight until typography tokens are available
- **Pressed = Figma hover** — mobile has no hover state; use the Figma hover background as the pressed state
- **Use `Pressable` not `PressableHighlight`** — Figma doesn't show a gray overlay on press
- **Run `/migrate-component`** to follow the full step-by-step migration workflow

## Migration Notes

The library is transitioning from old to new token system:
- **Old:** `theme.colors.*`, `theme.spacing.*` (being phased out)
- **New:** `theme.newColors.*`, `theme.newSpacing.*` (actively developed)

**When working on components:**
- **Always prefer** `newColors` and `newSpacing` tokens for new work
- Check recent commits for migration patterns
- Both systems coexist during transition period
- Do not use old tokens for new features or components
