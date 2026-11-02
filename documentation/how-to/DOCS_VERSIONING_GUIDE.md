# Documentation Versioning Guide

This guide explains how versioning works in the <abbr title="Equinor Design System">EDS</abbr> documentation site and how to create new versions.

## Overview

The EDS documentation site uses [Docusaurus versioning](https://docusaurus.io/docs/versioning) to maintain multiple documentation versions. This allows users to access documentation for different releases while contributors work on upcoming versions.

### Current Version Structure

| Version      | Label in the dropdown | Description                                                  | Location                             | URL Path            |
| ------------ | --------------------- | ------------------------------------------------------------ | ------------------------------------ | ------------------- |
| `1.1.0`      | Latest                | `eds-core-react` 2.x and `eds-tokens` 2.x, the default       | `versioned_docs/version-1.1.0/`      | `/docs/`            |
| `current`    | Beta                  | The 3.0.0 beta, where new work goes                          | `docs/`                              | `/docs/Next/`       |
| `2.0.0-beta` | Earlier beta          | Frozen snapshot, hidden from the dropdown but still linkable | `versioned_docs/version-2.0.0-beta/` | `/docs/2.0.0-beta/` |

The labels name the release status, which matches the `latest` and `beta` dist-tags of `eds-core-react` and `eds-tokens` on npm. They are not package numbers, because the site documents several packages whose versions do not move together. `lastVersion` is set to the version labelled Latest, so the navbar, the dropdown and the footer open it by default. What the versions are called after 3.0.0 is released is not decided yet ([#5666](https://github.com/equinor/design-system/issues/5666)).

## How Versioning Works

### Directory Structure

```
apps/design-system-docs/
├── docs/                           # Current (next) version -- work in progress
├── versioned_docs/
│   ├── version-2.0.0-beta/         # Frozen snapshot of the earlier beta
│   └── version-1.1.0/              # Snapshot of docs at version 1.1.0 (Latest)
├── versioned_sidebars/
│   ├── version-2.0.0-beta-sidebars.json
│   └── version-1.1.0-sidebars.json # Sidebar config for version 1.1.0
├── versions.json                   # List of all versions
└── docusaurus.config.ts            # Version configuration
```

### Key Files

- **`versions.json`** -- Contains an array of all released versions (newest first)
- **`docusaurus.config.ts`** -- Configures the labels, paths and banners of every version, `lastVersion`, and which versions the dropdown lists
- **`versioned_docs/`** -- Contains snapshots of documentation for each released version
- **`versioned_sidebars/`** -- Contains sidebar configurations for each released version

## Creating a New Version

:::info How Docusaurus Versioning Works

When you run the version command, Docusaurus **snapshots** the current `docs/` folder and saves it as the versioned documentation. The `docs/` folder then becomes the "next" (work-in-progress) version.

**This means:**

- The version number you provide should match the **current** release you're documenting
- After versioning, `docs/` contains the upcoming/next version -- not the one you just released
- Do not edit the newly created versioned files unless fixing errors

:::

When you're ready to release a new documentation version, follow these steps:

### Step 1: Ensure Current Docs Are Ready

Before creating a version, make sure the documentation in `docs/` is complete and accurate for the release.

```bash
# Build and test the documentation locally
pnpm docu:build
pnpm docu:serve
```

### Step 2: Create the Version Snapshot

From the `apps/design-system-docs` directory, run:

```bash
pnpm run docusaurus docs:version <version-number>
```

For example, to create version 1.2.0:

```bash
pnpm run docusaurus docs:version 1.2.0
```

This command will:

1. Copy the current `docs/` folder to `versioned_docs/version-1.2.0/`
2. Copy the current `sidebars.ts` to `versioned_sidebars/version-1.2.0-sidebars.json`
3. Add `1.2.0` to the beginning of `versions.json`

### Step 3: Update the Labels and the Default Version

After creating a new version, give it a label and decide which version is the default in `docusaurus.config.ts`. The labels follow the release status, not the version number: the version that documents the packages on the `latest` dist-tag is labelled `Latest` and is the `lastVersion`, and `current` stays `Beta` while it documents a beta.

```typescript
docs: {
  // ... other config
  versions: {
    current: {
      label: 'Beta',
      path: 'Next',
      banner: 'none',
    },
    '1.2.0': {
      label: 'Latest',
      path: '', // Keeps Latest at /docs/
      banner: 'none',
    },
  },
  lastVersion: '1.2.0',
},
```

Give the version that stops being Latest a label that says what it is, and decide whether the dropdown should still list it.

### Step 4: Verify the Changes

Test the versioned documentation locally:

```bash
pnpm docu:start
```

Verify that:

- The version dropdown appears in the navbar
- Switching between versions works correctly
- All links in both versions function properly

## Version Configuration

### Setting the Labels

Each version is configured in `docusaurus.config.ts`:

```typescript
docs: {
  sidebarPath: './sidebars.ts',
  versions: {
    current: {
      label: 'Beta', // Display label in the version dropdown
      path: 'Next', // URL path segment
      banner: 'none',
    },
    '2.0.0-beta': {
      label: 'Earlier beta',
      path: '2.0.0-beta',
      banner: 'none',
    },
    '1.1.0': {
      label: 'Latest',
      path: '',
      banner: 'none',
    },
  },
  lastVersion: '1.1.0',
},
```

Every version sets `banner: 'none'`. Docusaurus shows nothing on the `lastVersion` and calls a version listed before it in `versions.json` "unreleased", so `src/theme/DocItem/Layout` renders a note for each version instead: the package versions for Latest, the beta note on the Beta component pages, and a pointer to Beta on the earlier beta.

### Managing the Version Dropdown

The version dropdown is added to the navbar via:

```typescript
navbar: {
  items: [
    // ... other items
    {
      type: 'docsVersionDropdown',
      position: 'left',
      dropdownActiveClassDisabled: true,
      versions: ['1.1.0', 'current'], // Latest and Beta, in that order
    },
  ],
},
```

`versions` limits the dropdown to Latest and Beta. The `2.0.0-beta` archive stays built and linkable, but it is not offered as a destination.

## Editing Versioned Documentation

### Editing the Current Version

Edit files in the `docs/` directory. Changes appear in the Beta version, at `/docs/Next/`.

### Editing a Released Version

To fix errors or update content in a released version:

1. Navigate to `versioned_docs/version-X.X.X/`
2. Edit the relevant files
3. Test changes with `pnpm docu:start`

:::warning

Be cautious when editing released versions. Only make corrections for errors or critical updates -- avoid adding new features to old versions.

:::

## Best Practices

### When to Create a New Version

- **Do create a version** when releasing a major or minor update to EDS packages
- **Do create a version** when there are significant documentation changes
- **Don't create a version** for every patch release or minor typo fix

### Version Naming Convention

Version names in `versions.json` follow semantic versioning:

- `X.0.0` -- Major releases with breaking changes
- `X.Y.0` -- Minor releases with new features

The names are internal. Readers see the labels, which name the release status (Latest, Beta) instead of the number.

### Maintaining Multiple Versions

- Keep the number of maintained versions manageable (2--3 active versions)
- Archive or remove very old versions that are no longer supported
- Clearly communicate which versions are actively maintained

## Removing Old Versions

To remove an old version:

1. Delete the folder from `versioned_docs/`
2. Delete the corresponding sidebar from `versioned_sidebars/`
3. Remove the version from `versions.json`

```bash
# Example: Remove version 1.0.0
rm -rf versioned_docs/version-1.0.0
rm versioned_sidebars/version-1.0.0-sidebars.json
```

Then edit `versions.json` to remove the version from the array.

## Troubleshooting

### Version Not Appearing in Dropdown

Ensure the version is listed in `versions.json` and the corresponding folders exist in `versioned_docs/` and `versioned_sidebars/`.

### Broken Links After Versioning

Check that all internal links use relative paths or the `@site` alias. Absolute paths may break when switching versions.

### Build Errors with Versioned Docs

Clear the cache and rebuild:

```bash
pnpm docu:clear
pnpm docu:build
```

## Related Resources

- [Docusaurus Versioning Documentation](https://docusaurus.io/docs/versioning)
- [EDS Documentation README](../../apps/design-system-docs/README.md)
- [Contributing Guidelines](../../README.md#contributions)
