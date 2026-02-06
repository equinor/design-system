# Documentation Versioning Guide

This guide explains how versioning works in the <abbr title="Equinor Design System">EDS</abbr> documentation site and how to create new versions.

## Overview

The EDS documentation site uses [Docusaurus versioning](https://docusaurus.io/docs/versioning) to maintain multiple documentation versions. This allows users to access documentation for different releases while contributors work on upcoming versions.

### Current Version Structure

| Version   | Description                            | Location                        | URL Path      |
| --------- | -------------------------------------- | ------------------------------- | ------------- |
| 2.0.0-beta| Work in progress (current development) | `docs/`                         | `/docs/Next/` |
| 1.1.0     | Latest stable release                  | `versioned_docs/version-1.1.0/` | `/docs/`      |

## How Versioning Works

### Directory Structure

```
apps/design-system-docs/
├── docs/                           # Current (next) version -- work in progress
├── versioned_docs/
│   └── version-1.1.0/              # Snapshot of docs at version 1.1.0
├── versioned_sidebars/
│   └── version-1.1.0-sidebars.json # Sidebar config for version 1.1.0
├── versions.json                   # List of all versions
└── docusaurus.config.ts            # Version configuration
```

### Key Files

- **`versions.json`** -- Contains an array of all released versions (newest first)
- **`docusaurus.config.ts`** -- Configures the current version label and path
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

### Step 3: Update the Current Version Label

After creating a new version, update the current (next) version label in `docusaurus.config.ts`:

```typescript
docs: {
  // ... other config
  versions: {
    current: {
      label: '2.1.0-beta', // Update this to reflect the next planned version
      path: 'Next',
    },
  },
},
```

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

### Setting the Current Version Label

The current version (work in progress) is configured in `docusaurus.config.ts`:

```typescript
docs: {
  sidebarPath: './sidebars.ts',
  versions: {
    current: {
      label: '2.0.0-beta',  // Display label for the current version
      path: 'Next',        // URL path segment
    },
  },
},
```

### Managing the Version Dropdown

The version dropdown is automatically added to the navbar via:

```typescript
navbar: {
  items: [
    // ... other items
    {
      type: 'docsVersionDropdown',
      position: 'left',
      dropdownActiveClassDisabled: true,
    },
  ],
},
```

## Editing Versioned Documentation

### Editing the Current Version

Simply edit files in the `docs/` directory. Changes will appear in the "Next" (2.0.0-wip) version.

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

Follow semantic versioning for documentation:

- `X.0.0` -- Major releases with breaking changes
- `X.Y.0` -- Minor releases with new features
- `X.Y.Z-wip` -- Work in progress for the next release

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
