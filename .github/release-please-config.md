# Release Please Configuration Documentation

This document explains the configuration in `.github/release-please-config.json`.

## Core Configuration

### Schema

```json
"$schema": "https://raw.githubusercontent.com/googleapis/release-please/main/schemas/config.json"
```

Enables IDE autocomplete, validation, and inline documentation for the configuration file.

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

1. `@equinor/eds-core-react` - Core React component library
2. `@equinor/eds-data-grid-react` - Data grid component
3. `@equinor/eds-icons` - Icon library
4. `@equinor/eds-lab-react` - Experimental components
5. `@equinor/eds-tokens` - Design tokens and variables
6. `@equinor/eds-utils` - Shared utilities

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

```json
"skip-github-release": true
```

When `true`, release-please will NOT automatically create GitHub releases when the release PR is merged. This means:

- Release PRs are created automatically ✅
- Version bumps happen automatically ✅
- CHANGELOGs are updated automatically ✅
- GitHub releases must be created manually ❌

Set to `false` if you want automatic GitHub release creation.

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
7. **GitHub releases are created manually** (because `skip-github-release: true`)

## Multi-Package Example

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

When merged, three separate GitHub releases will be created (if `skip-github-release: false`).

## Commit Scope Matching

The `component` field must match commit scopes for release-please to detect which packages are affected:

```bash
# These commits affect the corresponding packages:
feat(eds-core-react): ...     → packages/eds-core-react
fix(eds-icons): ...           → packages/eds-icons
docs(eds-tokens): ...         → packages/eds-tokens

# Multiple packages in one commit:
feat(eds-icons, eds-core-react): ...  → both packages
```

## Related Files

- **Config**: `.github/release-please-config.json` (this documentation)
- **Manifest**: `.github/release-please-manifest.json` (tracks current versions)
- **Workflow**: `.github/workflows/release-please.yml` (triggers release-please)
- **Publish**: `.github/workflows/trigger-publish.yml` (publishes after release)

## Useful Links

- [Release Please Documentation](https://github.com/googleapis/release-please)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
