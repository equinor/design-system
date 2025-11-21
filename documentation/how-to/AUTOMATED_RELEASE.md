# Automated Release Guide

Guide for the automated release process in Equinor Design System using Release Please and GitHub Actions.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [How It Works](#how-it-works)
- [Understanding Release PRs](#understanding-release-prs)
- [Manual Steps After Release](#manual-steps-after-release)
- [GitHub Releases](#github-releases)
- [Troubleshooting](#troubleshooting)
- [Configuration](#configuration)
- [Resources](#resources)

## Quick Start

### Stable Releases

1. **Use conventional commits** during development (see [CONVENTIONAL_COMMITS.md](./CONVENTIONAL_COMMITS.md))
   - `feat(eds-core-react): add new button variant` → minor version bump
   - `fix(eds-icons): correct icon alignment` → patch version bump
   - `feat(eds-tokens)!: breaking change` → major version bump

2. **Merge PR to `main`** → Release Please automatically creates/updates a release PR

3. **Review the release PR**:
   - Check version bumps are appropriate
   - Verify CHANGELOG entries
   - Ensure all packages are included

4. **Merge the release PR** → Automatic publishing begins

5. **Verify publishing** - Check GitHub Actions workflows complete successfully

6. **Update master branch** - Rebase `main` onto `master`

7. **Announce release** - Post in `#eds-design-system` Slack channel

### Beta Releases (EDS 2.0 / Next)

For components under development in the `/next` entry point:

1. **Use `(next)` scope** in commits:
   - `feat(next): add new Input component` → beta version bump
   - `fix(next): correct Placeholder styling` → beta patch bump

2. **Merge PR to `main`** → Release Please creates/updates a release PR
   - May contain both stable and beta changes in one PR
   - Beta changes update `CHANGELOG.next.md`, stable changes update `CHANGELOG.md`

3. **Merge the release PR** → Publishes to `@equinor/eds-core-react@beta`
   - All releases deploy to Storybook (beta components visible under "EDS 2.0")
   - Users must install beta version to actually use the components

4. **Test beta release**: `npm install @equinor/eds-core-react@beta`

For complete details on beta workflow, graduation strategy, and breaking changes policy, see the [Beta Release Guide](../../packages/eds-core-react/BETA_RELEASE_GUIDE.md).

## How It Works

### Automated

- ✅ Version bumping
- ✅ CHANGELOG generation
- ✅ npm publishing
- ✅ Git tag creation
- ✅ GitHub releases

### Manual

- ⚠️ Rebasing master
- ⚠️ Announcements

## Understanding Release PRs

When Release Please detects releasable changes, it creates a special PR with the title pattern "chore: release[component]". This PR contains:

### What's Included

- **Version bumps** in `package.json` files for affected packages
- **Updated CHANGELOGs** with categorized commits (✨ Added, 🐛 Fixed, etc.)
- **Release summary** showing all packages being released in the PR description

### How to Review

1. **Check version bumps** - Ensure semantic versioning is correct (especially important if there's breaking changes)
2. **Review CHANGELOGs** - Verify all important changes are captured
3. **Validate scope** - Confirm all affected packages are included
4. **Test if needed** - Run tests or verify builds if uncertain

### When to Merge

- ✅ All automated checks pass
- ✅ Version bumps look correct
- ✅ No breaking changes without proper version bump
- ✅ Ready to publish to npm and announce

### Important Notes

- **One PR for all packages** - Don't expect separate PRs per package
- **Accumulative** - PR updates automatically with new commits until merged
- - **No manual editing** - Don't edit the PR content manually; it will be overwritten

## Manual Steps After Release

While most of the release process is automated, these steps still need to be done manually:

### Update Master Branch

- Switch to the `master` branch:

  ```bash
  git checkout master
  ```

- Rebase the latest changes from `main` onto `master`:

  ```bash
  git rebase main
  ```

- Push the updates to the remote repository:

  ```bash
  git push
  ```

### Verify Release

- Verify the new version is available on [npmjs](https://www.npmjs.com/package/@equinor/eds-core-react?activeTab=versions).
- Verify the new [storybook](https://storybook.eds.equinor.com/) is published.

### Announce Release

- Announce the release in #eds-design-system Slack channel
- Leave out any chores, CI/CD changes, build system updates, and other internal changes that are not relevant to end users
- Focus on user-facing features, fixes, and breaking changes

Here's a template for future release announcements:

---

We've just released:

- **[package-name-1] v[version-number-1]**
- **[package-name-2] v[version-number-2]**

### **[Package-Name-1]:**

**Added**

- ✨ [Feature-1]: [Short description of the feature] by @[author]
- ✨ [Feature-2]: [Short description of the feature] by @[author]

**Fixed**

- 🐛 [Fix-1]: [Short description of the fix] by @[author]
- 🐛 [Fix-2]: [Short description of the fix] by @[author]

### **[Package-Name-2]:**

**Added**

- ✨ [Feature-1]: [Short description of the feature] by @[author]

> Note: [Include any important dependency or compatibility notes here.]

---

**Best,**  
The EDS Core Team

---

## GitHub Releases

GitHub releases are now created automatically when the release PR is merged. The releases will include:

- All commit types from the CHANGELOG (features, fixes, docs, etc.)
- Proper version tags matching the npm packages
- Release notes generated from conventional commits

If you need to edit a release after it's created:

1. Go to [GitHub Releases](https://github.com/equinor/design-system/releases)
2. Find the release you want to edit
3. Click "Edit release"
4. Make necessary changes and save

## Troubleshooting

**No release PR created?**

- Check commit format follows conventional commits
- Verify commits on `main` with package scope

**Wrong version bump?**

- `feat!:` = major
- `feat:` = minor
- `fix:` = patch

**Publishing failed?**

- Check workflow logs in GitHub Actions
- Re-run workflow or publish manually

**Need to skip release?**

- Leave PR open, merge later

**Need to rollback a release?**

If a release has critical issues:

1. **Create hotfix immediately**: Make emergency fix and create new release (recommended approach)
2. **Deprecate problematic version**: Use `npm deprecate @equinor/package@version "Critical issue - use version X.X.X instead"`
3. **Communicate quickly**: Announce the issue and hotfix plan in #eds-design-system and affected channels
4. **Document the incident**: Update release notes to mention the issue and resolution

**Release PR disappeared or corrupted?**

- Release Please recreates PRs automatically on next push to `main`
- Don't try to manually recreate - let Release Please handle it

## Configuration

- [`.github/release-please-config.md`](../../.github/release-please-config.md) - Detailed config docs
- [CONVENTIONAL_COMMITS.md](./CONVENTIONAL_COMMITS.md) - Commit guidelines

## Resources

- [Release Please Docs](https://github.com/googleapis/release-please)
- [Semantic Versioning](https://semver.org/)
