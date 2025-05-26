# @equinor/eds-tokens-sync

A package for synchronizing design tokens between Figma and code.

## Installation

```bash
npm install @equinor/eds-tokens-sync
```

## CLI Usage

The package provides two main CLI commands for syncing tokens:

### Sync from Figma to Tokens

```bash
sync-figma-to-tokens --file-key <FIGMA_LIBRARY_ID>
```

This command fetches design tokens from Figma and updates your local token files.

### Sync from Tokens to Figma

```bash
sync-tokens-to-figma --file-key <FIGMA_LIBRARY_ID>
```

This command pushes your local design tokens to Figma. Use with caution and validate the changes in Figma variables after sync. If something unexpected happen you can revert history in Figma.


## Configuration

Make sure to set up the necessary environment variables for Figma API access before running the sync commands:

- .env file with `PERSONAL_ACCESS_TOKEN`: Your Figma personal access token

## Development

```bash
# Build the package
npm run build

# Run in development mode
npm run dev

# Format code
npm run prettier

# Lint code
npm run lint
```

## Repository

This package is part of the [Equinor Design System](https://eds.equinor.com).

- **Repository**: [https://github.com/equinor/design-system](https://github.com/equinor/design-system)
- **Issues**: [https://github.com/equinor/design-system/issues](https://github.com/equinor/design-system/issues)

## License

MIT