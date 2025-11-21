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
2. **Release Please creates PR** -- One combined PR that may include both stable and beta changes
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

Beta components are **visible in production Storybook** under the **"EDS 2.0"** section with "next" badges. This allows everyone to:

- 👀 See what's coming in EDS 2.0
- 📖 Read documentation and API specs
- 🎨 View design implementations
- 💬 Provide feedback before stable release

**To actually use these components**, you must install the beta version:

```bash
npm install @equinor/eds-core-react@beta
```

You can also run Storybook locally for development:

```bash
git clone https://github.com/equinor/design-system.git
pnpm install
pnpm storybook
```

## Version Scheme

Beta versions follow this pattern: `2.0.1-beta.0`, `2.0.1-beta.1`, etc.

## Graduation: Moving from Beta to Stable

Components graduate from `/next` to stable when they meet these criteria:

### Graduation Criteria

1. **Design finalized** - Component approved by EDS design team in Figma
2. **Accessibility verified** - Meets WCAG 2.1 AA standards
3. **API stable** - Component API is finalized and unlikely to change
4. **Tested in production** - Successfully used in at least one real application
5. **Documentation complete** - Storybook stories, props documentation, usage examples
6. **Breaking changes resolved** - All known issues addressed

### Graduation Process

EDS 2.0 components will graduate as a **complete set** in a single major release (v3.0.0), rather than individually. This provides a cleaner migration path for users.

#### Strategy: Batch Graduation

**During Beta Development:**

1. **Mark old components as deprecated immediately**:

   ```typescript
   // src/components/Button/Button.tsx (EDS 1.0)
   /**
    * @deprecated EDS 2.0 Button is available in beta.
    * Install: npm install @equinor/eds-core-react@beta
    * Import: import { Button } from '@equinor/eds-core-react/next'
    *
    * This component will be replaced in v3.0.0 when all EDS 2.0 components graduate.
    */
   export const Button = ...
   ```

2. **Communicate timeline in release notes and Slack**:
   - "EDS 2.0 components are being developed under `/next`"
   - "All EDS 2.0 components will graduate together in v3.0.0"
   - "Test early by installing `@equinor/eds-core-react@beta`"

3. **Keep `/next` folder structure during entire beta period**:
   ```
   components/
     Button/          # EDS 1.0 (deprecated, but still works)
     Typography/      # EDS 1.0 (deprecated, but still works)
     next/
       Button/        # EDS 2.0 (beta)
       Typography/    # EDS 2.0 (beta)
   ```

**When All EDS 2.0 Components Are Ready:**

1. **Create migration guide** with all breaking changes and API differences

2. **Single major release (v3.0.0)**:

   ```bash
   # Remove all old EDS 1.0 components
   git rm -r src/components/Button
   git rm -r src/components/Typography
   # ... remove all old components

   # Move all EDS 2.0 components to main folder
   git mv src/components/next/* src/components/
   git rm -r src/components/next

   # Update exports
   # Remove: src/index.next.ts
   # Update: src/index.ts with all new components
   ```

3. **Users only change import path** (no component name changes):

   ```typescript
   // Before (beta testing):
   import { Button, Typography } from '@equinor/eds-core-react/next'

   // After (v3.0.0):
   import { Button, Typography } from '@equinor/eds-core-react'
   ```

4. **Create release with detailed migration guide**:

   ```bash
   git commit -m "feat(eds-core-react)!: graduate all EDS 2.0 components

   BREAKING CHANGE: All components replaced with EDS 2.0 implementations.

   - Button: API changes, see migration guide
   - Typography: New props structure, see migration guide
   ...

   Migration guide: https://eds.equinor.com/migration/v3"
   ```

#### Benefits of Batch Graduation

- ✅ **Simple migration** - Users only change import path once
- ✅ **No component renaming** - Button stays Button throughout
- ✅ **Clear timeline** - One major version bump, not gradual changes
- ✅ **Better testing** - Users can test complete EDS 2.0 in beta
- ✅ **Easier rollback** - If issues found, users stay on v2.x.x

#### Timeline Example

| Phase                | Version | Status                             | User Action                   |
| -------------------- | ------- | ---------------------------------- | ----------------------------- |
| Beta development     | 2.x.x   | EDS 1.0 stable, EDS 2.0 in `/next` | Optionally test beta          |
| All components ready | 2.x.x   | Freeze EDS 1.0, finalize EDS 2.0   | Review migration guide        |
| Major release        | 3.0.0   | EDS 2.0 only                       | Update imports, test, migrate |

5. **Release**:
   - Major version bump: `2.x.x` → `3.0.0`
   - All EDS 2.0 components become the default
   - Beta releases deprecated
   - Migration guide published

### After Graduation

- Component remains in beta releases until next stable version
- Users can migrate: `import { Component } from '@equinor/eds-core-react/next'` → `import { Component } from '@equinor/eds-core-react'`
- Beta version can be deprecated once stable version is adopted

### Breaking Changes Policy

**Within `/next` (beta releases):**

- ✅ Breaking changes are allowed and expected
- ✅ Use regular `feat(next):` commits (no `!` needed)
- ✅ Version bumps prerelease number: `beta.0` → `beta.1`

**After graduation (stable releases):**

- ⚠️ Breaking changes require major version bump
- ⚠️ Follow semantic versioning strictly
- ⚠️ Coordinate with team before introducing breaking changes

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
   - Deploys Storybook (beta components visible in "EDS 2.0" section)

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
