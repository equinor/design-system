# EDS Mobile Storybook

Storybook app for showcasing and testing [@equinor/eds-mobile-components](https://www.npmjs.com/package/@equinor/eds-mobile-components).

This is an [Expo](https://expo.dev) project using [file-based routing](https://docs.expo.dev/router/introduction).

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (v10 or higher)
- For iOS: [Xcode](https://developer.apple.com/xcode/) and CocoaPods
- For Android: [Android Studio](https://developer.android.com/studio) with an emulator configured

## Get started

1. From the **monorepo root**, install dependencies:

    ```bash
    pnpm install
    ```

2. Build the components package:

    ```bash
    pnpm build
    ```

3. Run the storybook app:

    ```bash
    pnpm dev:storybook
    ```

4. Press `i` to open in iOS Simulator or `a` for Android Emulator.

### iOS Setup

For iOS development, install CocoaPods dependencies:

```bash
cd apps/storybook/ios && pod install
```

### Running on a Physical Device

Use Expo's development build to run on a physical device:

```bash
# iOS
pnpm dev:storybook -- --device

# Or scan the QR code with the Expo Go app (limited functionality)
```

## Project Structure

```
apps/storybook/
├── app/                    # Expo Router pages
│   ├── _layout.tsx         # Root layout with EDSProvider
│   └── (tabs)/
│       ├── index.tsx       # Home screen
│       ├── about.tsx       # About screen
│       └── components/     # Component showcase screens (Slice 1 only)
│           ├── button.tsx
│           ├── input.tsx
│           ├── selectioncontrols.tsx
│           ├── typography.tsx
│           └── ...         # Future screens added per slice
├── components/             # Shared storybook UI (Section, Surface, SettingsControls)
└── ios/                    # Native iOS project
```

## Adding a New Component Screen

1. Create a new file in `app/(tabs)/components/` (e.g., `mycomponent.tsx`)
2. Register the screen in `app/(tabs)/components/_layout.tsx`
3. Add it to the component list in `app/(tabs)/components/index.tsx`
4. Export the component from `packages/components/src/index.ts` if not already exported

## Troubleshooting

### "hapticpatternlibrary.plist couldn't be opened"

This error appears in the iOS Simulator because it doesn't support haptic feedback. It's harmless and can be ignored—haptics work correctly on physical devices.

### Pods out of sync

If you encounter iOS build errors after updating dependencies:

```bash
cd apps/storybook/ios
rm -rf Pods Podfile.lock
pod install
```

### Metro bundler issues

Clear the cache and restart:

```bash
pnpm dev:storybook -- --clear
```

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [EDS Mobile Components](../../packages/components/README.md)
- [Equinor Design System](https://eds.equinor.com/)
