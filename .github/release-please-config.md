# Release Please Configuration Documentation

This document explains the configuration in `.github/release-please-config.json`.

## Core Configuration

### Schema

```json
"$schema": "https://raw.githubusercontent.com/googleapis/release-please/main/schemas/config.json"
```

Enables IDE autocomplete, validation, and inline documentation for the configuration file.

### Bootstrap SHA

```json
"bootstrap-sha": "34443e16"
```

One-time configuration pointing to the commit where v1.0.0 was manually released (all packages except eds-lab-react@0.8.0). After the first release-please PR is merged, this value is no longer used—release-please will automatically track releases via git tags. This prevents re-releasing already published versions from before release-please was set up.

### Tag Separator

```json
"tag-separator": "@"
```

Defines the separator used in git tags. With `@`, tags are formatted as `eds-core-react@0.49.0` instead of `eds-core-react-v0.49.0`. This matches our existing tag format in the repository.

## Package Configuration

Each package in the monorepo must be explicitly configured:

```json
"packages/eds-core-react": {
  "release-type": "node",
  "package-name": "@equinor/eds-core-react",
  "component": "eds-core-react"
}
```

- **Path key** (`packages/eds-core-react`): The relative path from repo root to the package
- **`release-type`**: Set to `"node"` for npm packages. This determines how version bumping works
- **`package-name`**: The npm package name (with scope)
- **`component`**: Used in git tags and must match the tag format. For `eds-core-react`, tags will be `eds-core-react@x.y.z`

### All Configured Packages

We currently track these packages for releases:

1. `@equinor/eds-core-react` - Core React component library (stable)
2. `@equinor/eds-core-react` (`/next` entry) - Beta components (published with `@beta` tag)
3. `@equinor/eds-data-grid-react` - Data grid component
4. `@equinor/eds-icons` - Icon library
5. `@equinor/eds-lab-react` - Experimental components
6. `@equinor/eds-tokens` - Design tokens and variables
7. `@equinor/eds-utils` - Shared utilities

### Dual Release Strategy for `@equinor/eds-core-react`

The `eds-core-react` package uses a **dual release strategy** to support both stable and beta releases:

**Stable Release** (`latest` tag):

```json
"packages/eds-core-react": {
  "release-type": "node",
  "package-name": "@equinor/eds-core-react",
  "component": "eds-core-react",
  "exclude-paths": ["src/components/next"]
}
```

- Excludes `/next` folder from stable releases
- Published to `@equinor/eds-core-react@latest`
- Uses `CHANGELOG.md`

**Beta Release** (`beta` tag):

```json
"packages/eds-core-react/src/components/next": {
  "release-type": "simple",
  "component": "eds-core-react-next",
  "prerelease-type": "beta"
}
```

- Only includes files in `src/components/next/`
- Published to `@equinor/eds-core-react@beta`
- Uses `src/components/next/CHANGELOG.md`
- Version format: `2.0.1-beta.0`, `2.0.1-beta.1`, etc.

**Key Configuration Options:**

- `exclude-paths`: Prevents `/next` components from affecting stable releases
- `prerelease-type: "beta"`: Adds `-beta.X` suffix to versions
- `changelog-path`: Uses separate changelog for beta releases

### Exclude Paths

All packages use `exclude-paths` to prevent non-publishable files from triggering version bumps. This includes config files, test files, Storybook, documentation, and build tooling.

**Important limitation:** `exclude-paths` only filters file-path-based detection. If a commit has a **scope that matches a package's `component` name** (e.g. `feat(eds-core-react): ...`), it will trigger a release for that package regardless of `exclude-paths`. To avoid this, use non-release-triggering types (`chore`, `build`, `ci`, `test`) for commits that only touch excluded files. See `documentation/how-to/CONVENTIONAL_COMMITS.md` for guidance.

## Pull Request Configuration

### Combined Releases

```json
"separate-pull-requests": false
```

Creates **one combined PR** with all packages that have changes, rather than separate PRs per package. When this PR is merged, release-please will create separate GitHub releases for each package automatically.

### PR Title Pattern

```json
"pull-request-title-pattern": "chore: release${component}"
```

Defines the title format for release PRs. The `${component}` placeholder is replaced with package names. With combined PRs, this shows all affected components.

### PR Header

```json
"pull-request-header": "## Release PR\n\nThis PR was automatically generated..."
```

Custom message added to the top of release PRs. Used to provide instructions for what to do after merging.

### PR Label

```json
"label": "autorelease: pending"
```

Automatically adds this label to release PRs for easy filtering and identification.

## Changelog Configuration

### Changelog Sections

```json
"changelog-sections": [
  { "type": "feat", "section": "✨ Added" },
  { "type": "fix", "section": "🐛 Fixed" },
  ...
]
```

Maps conventional commit types to changelog sections with emojis:

- **feat** → ✨ Added (new features)
- **fix** → 🐛 Fixed (bug fixes)
- **docs** → 📝 Changed (documentation updates)
- **perf** → ⚡ Performance Improvements
- **refactor** → ♻️ Refactoring (code restructuring)
- **chore** → 🔧 Chores (maintenance tasks, dependency updates)
- **ci** → 👷 CI/CD (pipeline/workflow changes)
- **build** → 📦 Build System (build configuration)
- **test** → ✅ Tests (test additions/changes)

All types are visible in CHANGELOG files. Note: There's no `hidden` property, so all commit types appear in both CHANGELOGs and GitHub releases. (This is why we do Github Releases manually - to be able to filter out chores, CI/CD changes, and build system updates that are relevant for maintainers but not for end users.)

### Changelog Path

```json
"changelog-path": "CHANGELOG.md"
```

Relative path for the changelog file in each package. Release-please will create/update `packages/[package-name]/CHANGELOG.md`.

### Release Search Depth

```json
"release-search-depth": 500
```

How many commits back to search when looking for the last release. Increase this if you have a very long commit history between releases.

## Version Bumping Rules

### Pre-1.0.0 Behavior

```json
"bump-minor-pre-major": true
```

Before version 1.0.0, `feat:` commits bump the minor version (0.x.0) instead of major. This follows the convention that pre-1.0.0 versions are still in development.

```json
"bump-patch-for-minor-pre-major": false
```

Ensures that breaking changes (indicated by `BREAKING CHANGE:` in commit message) still bump minor version pre-1.0.0, not patch.

**Version Bump Examples (pre-1.0.0):**

- `fix: bug` → 0.1.0 → 0.1.1 (patch)
- `feat: new feature` → 0.1.0 → 0.2.0 (minor)
- `feat!: breaking change` → 0.1.0 → 0.2.0 (minor, not major)

**Version Bump Examples (1.0.0+):**

- `fix: bug` → 1.0.0 → 1.0.1 (patch)
- `feat: new feature` → 1.0.0 → 1.1.0 (minor)
- `feat!: breaking change` → 1.0.0 → 2.0.0 (major)

## GitHub Release Configuration

By default, release-please automatically creates GitHub releases when the release PR is merged. This means:

- Release PRs are created automatically ✅
- Version bumps happen automatically ✅
- CHANGELOGs are updated automatically ✅
- GitHub releases are created automatically ✅

The releases include all commit types from the changelog (features, fixes, docs, chores, CI/CD, build system updates, etc.). If you want to skip automatic GitHub release creation, you can add `"skip-github-release": true` to the configuration.

## How It Works Together

1. **Developer makes conventional commits** (e.g., `feat(eds-icons): add new icon`)
2. **Release-please monitors the branch** and detects releasable changes
3. **Release PR is created** with:
   - Version bumps in affected `package.json` files
   - Updated CHANGELOGs for affected packages
   - Summary of all changes
4. **Team reviews and merges the PR**
5. **Automatic publish workflow triggers** (separate workflow)
6. **Packages are published to npm**
7. **GitHub releases are created automatically**

## Multi-Package Example

### Stable + Multiple Packages

If you make these commits:

```bash
feat(eds-icons): add arrow-up icon
fix(eds-core-react): fix button padding
feat(eds-tokens): add new color tokens
```

Release-please will create ONE PR that:

- Bumps `eds-icons` from 0.22.0 → 0.23.0
- Bumps `eds-core-react` from 0.49.0 → 0.50.0
- Bumps `eds-tokens` from 0.10.0 → 0.11.0
- Updates all three CHANGELOGs

When merged, three separate GitHub releases will be created automatically.

### Beta Release Example

If you make these commits:

```bash
feat(next): add Input component
fix(next): fix Placeholder styling
```

Release-please will include beta changes in the release PR:

- Title includes "next": `chore: release eds-core-react-next 2.0.1-beta.1`
- Bumps beta version: `2.0.1-beta.0` → `2.0.1-beta.1`
- Updates `src/components/next/CHANGELOG.md`
- When merged, publishes to `@equinor/eds-core-react@beta`

**Note:** With `"separate-pull-requests": false`, both stable and beta changes can appear in the **same PR** if you have commits for both. The PR will contain updates to both `CHANGELOG.md` and `src/components/next/CHANGELOG.md`.

## Commit Scope Matching

The `component` field must match commit scopes for release-please to detect which packages are affected:

```bash
# Stable releases:
feat(eds-core-react): ...     → packages/eds-core-react (stable)
fix(Button): ...              → packages/eds-core-react (stable)
fix(eds-icons): ...           → packages/eds-icons
docs(eds-tokens): ...         → packages/eds-tokens

# Beta releases (use "next" scope):
feat(next): ...               → packages/eds-core-react@beta
fix(next): ...                → packages/eds-core-react@beta

# Multiple packages in one commit:
feat(eds-icons, eds-core-react): ...  → both packages
```

### Beta Release Commits

For components in the `/next` entry point, always use the `(next)` scope:

```bash
# Features
feat(next): add Input 2.0 component

# Bug fixes
fix(next): correct Input 2.0 styling

# Breaking changes - DO NOT use ! for beta
feat(next): redesign Input 2.0 API (breaking)
# NOT: feat(next)!: redesign Button API
```

**Important:** Avoid using `!` (breaking change marker) for beta releases. Beta components are experimental and breaking changes are expected. Using `!` would trigger a major version bump (e.g., `2.0.1-beta.0` → `3.0.0-beta.0`), which is unnecessary for components under development.

## Related Files

- **Config**: `.github/release-please-config.json` (this documentation)
- **Manifest**: `.github/release-please-manifest.json` (tracks current versions)
- **Workflow**: `.github/workflows/release-please.yml` (triggers release-please)
- **Publish**: `.github/workflows/trigger-publish.yml` (publishes after release, handles beta detection)
- **Automated release documentation**: `../documentation/how-to/AUTOMATED_RELEASE.md`
- **Beta release guide**: `documentation/how-to/BETA_RELEASE_GUIDE.md` (detailed beta workflow)

## Useful Links

- [Release Please Documentation](https://github.com/googleapis/release-please)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
