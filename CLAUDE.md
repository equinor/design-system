# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the @equinor/eds-mobile-components package.

## Package Overview

This package is the core React Native component library implementing the Equinor Design System. It provides UI components with full support for light/dark theming and comfortable/spacious density modes.

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

The library uses a token-based theming system sourced from `@equinor/eds-tokens`:

**Token Sources:**

- `theme.colors.*` — color tokens (`ColorToken`)
- `theme.spacing.*` — spacing tokens (`SpacingToken`)
- `theme.typography.*` — typography tokens (`TypographyToken`)
- `theme.geometry.*` / `theme.timing.*` — static constants (no `@equinor/eds-tokens` equivalent yet)

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
        backgroundColor: token.colors.bg.neutral.surface,
        padding: token.spacing.spacing.inset.lg.horizontal,
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
const themeStyles = EDSStyleSheet.create(
    (token, props: { highlighted?: boolean }) => ({
        container: {
            backgroundColor: props.highlighted
                ? token.colors.bg.accent.fillEmphasis.default
                : token.colors.bg.neutral.surface,
        },
    })
);

const MyComponent = ({ highlighted }: { highlighted?: boolean }) => {
    const styles = useStyles(themeStyles, { highlighted });
    return <View style={styles.container} />;
};
```

**Direct Token Access:**

- Use `useToken()` hook to access token values directly in component logic
- Prefer `EDSStyleSheet` + `useStyles` for styling
- Only use `useToken()` when you need token values for non-style purposes

### Directory Structure

```
src/
├── components/        # All UI components (Button, Paper, TextField, Dialog, etc.)
├── hooks/            # Shared hooks (useEDS, useStyles, useToken, useBreakpoint, etc.)
├── styling/          # Theming system (EDSStyleSheet, token types, color/spacing)
│   └── tokens/       # Token type definitions
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
4. **Always use tokens** (`theme.colors`, `theme.spacing`, `theme.typography`) for new work
5. All components must support both light/dark mode and comfortable/spacious density

### Logging Migration Findings

While working on a component (migration, docs, bug fix, or review), you may notice gaps that aren't in scope for the current PR — things the Figma design doesn't account for, patterns missing from the EDS web Storybook, accessibility gaps, or API inconsistencies across components. Do not silently drop these.

Append them as a checklist item to the tracking issue: **[#152 — Tracking: Findings from component migration](https://github.com/equinor/design-system-mobile/issues/152)**. Each item should include:

- **What** — one-line description of the gap
- **Rationale** — why it matters (a11y, parity with web, dev ergonomics, etc.)
- **Where it surfaced** — the component or task that revealed it

If the finding needs real work, open a dedicated issue and link it next to the checkbox. The tracking issue is for _discovery_, not _completion_.

### When Adding New Components

1. Create component in `src/components/YourComponent/`
    - Main component file: `YourComponent.tsx`
    - Types file: `YourComponent.types.ts` (if complex)
    - Styles using `EDSStyleSheet.create`
2. Export from `src/index.ts`
3. Add storybook story in `../../apps/storybook/app/(tabs)/YourComponent.tsx`
4. Create developer documentation in `docs/YourComponent.mdx` — run `/document-component` for the full workflow and structure
5. Follow existing patterns for prop naming and component structure

**MDX handoff to EDS Storybook:** Files in `docs/` ship via npm and are consumed by the EDS Storybook repo, which wraps each one with source/npm `<Links>` inside `<PlatformTabs>`. Mobile MDX should not import `<Links>` or `<PlatformTabs>` itself — write component-focused content only. The consumer-side wrapping pattern (in EDS Storybook's `next/<Component>/<Component>.docs.mdx`) is:

```tsx
<PlatformTabs
    mobile={
        <>
            <Links
                sourceUrl="https://github.com/equinor/design-system-mobile/blob/main/packages/components/src/components/SelectionControls/Switch.tsx"
                npmUrl="https://www.npmjs.com/package/@equinor/eds-mobile-components"
            />
            <MobileDocs />
        </>
    }
/>
```

### Component Development Checklist

- [ ] Uses `EDSStyleSheet.create` for all theming
- [ ] Supports both light and dark modes automatically via tokens
- [ ] Supports both comfortable and spacious density modes
- [ ] Uses `theme.colors.*`, `theme.spacing.*`, and `theme.typography.*` tokens
- [ ] Exports TypeScript types for all props
- [ ] Follows existing component patterns (prop naming, structure)
- [ ] Has corresponding storybook story for visual testing
- [ ] Has developer MDX doc in `docs/` (Features → Usage → Examples → Props → Accessibility → Related components)

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
- **Use semantic tokens** — never hardcode spacing or colors; map Figma CSS variables to `theme.spacing.*` and `theme.colors.*` token paths
- **Use typography tokens** — map fontSize, fontWeight, lineHeight, letterSpacing to `theme.typography.*` token paths
- **Pressed = Figma hover** — mobile has no hover state; use the Figma hover background as the pressed state
- **Use `Pressable` not `PressableHighlight`** — Figma doesn't show a gray overlay on press
- **Run `/migrate-component`** to follow the full step-by-step migration workflow

## Migration Notes

A core goal of the component migration is integrating the colour, spacing, and typography foundations into the React Native component library. Every migrated or newly created component **must** use the EDS token system exclusively.

**When migrating or creating components:**

- **Replace hardcoded values** (hex colors, spacing numbers, font sizes) with semantic tokens where an equivalent exists
- **Use `theme.colors.*`, `theme.spacing.*`, `theme.typography.*`** — these are the only token paths
- Check recent commits for migration patterns

**Unmigrated components (Slice 2–4):** these are excluded from `tsconfig.json` type-checking during the migration period. Removing a component directory from the `exclude` list in `tsconfig.json` is the signal that it has been migrated.
