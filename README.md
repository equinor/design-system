# EDS Mobile Components

A React Native component library implementing the [Equinor Design System](https://eds.equinor.com/).

## Installation

```bash
pnpm add @equinor/eds-mobile-components
```

### Peer dependencies

This library requires the following peer dependencies:

```bash
pnpm add expo-font react-native-gesture-handler react-native-reanimated react-native-svg
```

Make sure to follow the installation instructions for each:

- [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation/)
- [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/)
- [react-native-svg](https://github.com/software-mansion/react-native-svg#installation)

## Getting started

Load the fonts and assets required by the library in your root component, and wrap your app in the `EDSProvider`:

```tsx
import { EDSProvider, useEDS } from "@equinor/eds-mobile-components";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function App() {
    const [hasLoadedEds, edsLoadError] = useEDS();

    if (!hasLoadedEds) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <EDSProvider colorScheme="light" density="comfortable">
                <Navigation />
                <StatusBar />
            </EDSProvider>
        </SafeAreaProvider>
    );
}
```

The `EDSProvider` gives you access to:

- **Color scheme** — switch between `light` and `dark` mode
- **Density** — switch between `comfortable` and `spacious` layouts

## Theming

Create stylesheets that respond to the current theme using `EDSStyleSheet`:

```tsx
import { EDSStyleSheet, useStyles } from "@equinor/eds-mobile-components";

const themeStyles = EDSStyleSheet.create((theme) => ({
    container: {
        backgroundColor: theme.colors.container.background,
        borderRadius: theme.geometry.border.containerBorderRadius,
    },
}));

const MyComponent = () => {
    const styles = useStyles(themeStyles);
    return <View style={styles.container} />;
};
```

The `theme` object resolves based on the current configuration, so colours adapt automatically to light/dark mode.

### Passing props to stylesheets

For conditional styling, pass additional props as a second argument:

```tsx
const themeStyles = EDSStyleSheet.create(
    (theme, props: { highlight?: boolean }) => ({
        container: {
            backgroundColor: props.highlight
                ? theme.colors.interactive.primary
                : theme.colors.container.background,
        },
    })
);

const MyComponent = ({ highlight }: { highlight?: boolean }) => {
    const styles = useStyles(themeStyles, { highlight });
    return <View style={styles.container} />;
};
```

## Components

The library includes:

- **Layout** — Paper, Spacer, Scrim
- **Inputs** — Button, TextField, Input, Search, Select, Autocomplete, SelectionControls, Chip
- **Feedback** — Dialog, Progress, ProgressIndicator, OfflineBanner
- **Navigation** — Tabs, Menu, Accordion, Cell
- **Display** — Typography, Icon, Label, Popover
- **Utilities** — EDSProvider, Portal, ErrorBoundary, Environment

## Hooks

- `useEDS` — load fonts and assets
- `useStyles` — resolve themed stylesheets
- `useToken` — access design tokens directly
- `useBreakpoint` — respond to screen size changes

## License

MIT
