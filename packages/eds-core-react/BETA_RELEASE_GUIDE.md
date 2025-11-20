# Beta Release Guide for `/next` Components

This guide explains how beta releases work for EDS 2.0 components under the `/next` entry point.

## Overview

The EDS repository uses a **dual release strategy**:

- **Stable releases** (`latest` tag) -- All components EXCEPT those in `/next`
- **Beta releases** (`beta` tag) -- Only components in `src/components/next/`

Both use the same package `@equinor/eds-core-react` but with different dist-tags and changelogs.

## Commit Convention

To trigger the correct release, use specific commit scopes:

### Beta Release (for `/next` components)

```bash
# Features
feat(next): add new TextInput component

# Bug fixes
fix(next): correct Placeholder styling

# Breaking changes
feat(next)!: change Button API
```

### Stable Release (for existing components)

```bash
# Features
feat(eds-core-react): add new prop to Button

# Bug fixes
fix(eds-core-react): correct positioning logic
```

## How It Works

1. **Commit with scope** -- Use `(next)` scope for beta components
2. **Release Please creates PR** -- Separate PRs for stable vs beta
3. **Merge PR** -- Triggers automated publishing
4. **NPM publish** -- Beta goes to `@equinor/eds-core-react@beta`, stable to `@equinor/eds-core-react@latest`

## Changelogs

- **Stable**: `CHANGELOG.md`
- **Beta**: `CHANGELOG.next.md`

## Installing Beta Components

```bash
# Install beta version
npm install @equinor/eds-core-react@beta

# Or use specific beta version
npm install @equinor/eds-core-react@2.0.0-beta.1
```

```typescript
// Import from /next entry point
import { Placeholder } from '@equinor/eds-core-react/next'
```

## Viewing Beta Components in Storybook

Beta components are **not deployed** to any hosted Storybook instance. They are intended for early testing and development.

To explore beta components in Storybook:

1. Clone the repository: `git clone https://github.com/equinor/design-system.git`
2. Install dependencies: `pnpm install`
3. Run Storybook locally: `pnpm storybook`

Beta components will appear under the **"Next (Beta)"** group in the Storybook sidebar.

## Version Scheme

Beta versions follow this pattern: `2.0.1-beta.0`, `2.0.1-beta.1`, etc.

When components are promoted from beta to stable:

1. Remove from `/next` folder
2. Move to main components
3. Use regular commit scope (not `(next)`)
4. Version continues from stable track

## CI/CD Flow

1. **Release Please detects commits**
   - `(next)` scope → Beta release PR
   - Other scopes → Stable release PR

2. **Merge release PR**
   - Updates `CHANGELOG.next.md` or `CHANGELOG.md`
   - Bumps version in manifest

3. **Trigger publish workflow**
   - Detects beta vs stable from PR title
   - Publishes to correct npm dist-tag
   - Deploys Storybook (stable releases only -- beta skips deployment)

## Example Workflow

```bash
# 1. Create new beta component
git checkout -b feat/add-new-input
mkdir -p src/components/next/Input
# ... create component files

# 2. Commit with (next) scope
git add .
git commit -m "feat(next): add new Input component with validation"

# 3. Push and create PR
git push origin feat/add-new-input

# 4. After PR merge, Release Please creates release PR
# 5. Review and merge release PR
# 6. Automated publish to npm with beta tag
```

## Checking Released Versions

```bash
# View all versions
npm view @equinor/eds-core-react versions

# View beta versions only
npm view @equinor/eds-core-react versions | grep beta

# View current latest
npm view @equinor/eds-core-react@latest version

# View current beta
npm view @equinor/eds-core-react@beta version
```

## Troubleshooting

### Beta release not triggered

- Ensure commits use `(next)` scope
- Check that files are in `src/components/next/` folder
- Verify Release Please config includes `/next` path

### Wrong dist-tag applied

- Check PR title contains "next" keyword
- Review `trigger_publish.yml` workflow logs
- Manually retag if needed: `npm dist-tag add @equinor/eds-core-react@2.0.0-beta.1 beta`

### Components not found in `/next` import

- Ensure component is exported in `src/index.next.ts`
- Check rollup build includes `/next` entry point
- Verify package.json exports include `./next` subpath
