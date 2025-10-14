# Release Please Guide

Guide for using Release Please to automate releases in Equinor Design System.

## Quick Start

1. Make conventional commits (see [CONVENTIONAL_COMMITS.md](./CONVENTIONAL_COMMITS.md))
2. Push to `develop` - Release Please creates/updates a release PR
3. Review and merge the release PR
4. Publishing happens automatically
5. Create GitHub releases manually (curate for end users)
6. Rebase master from develop
7. Announce in `#eds-design-system`

## How It Works

### Automated

- ✅ Version bumping
- ✅ CHANGELOG generation
- ✅ npm publishing
- ✅ Git tag creation

### Manual

- ⚠️ GitHub releases (filter out chores/CI/build changes)
- ⚠️ Rebasing master
- ⚠️ Announcements

## Creating GitHub Releases

After release PR is merged:

1. Go to [GitHub Releases](https://github.com/equinor/design-system/releases)
2. Select the tag (e.g. `eds-core-react@1.1.0`)
3. Copy content from `packages/{package}/CHANGELOG.md`
4. **Remove internal changes:** chores, CI/CD, build, tests
5. **Keep user-facing changes:** features, fixes, breaking changes
6. Publish

## Troubleshooting

**No release PR created?**

- Check commit format follows conventional commits
- Verify commits on `develop` with package scope

**Wrong version bump?**

- `feat:` = minor, `fix:` = patch, `feat!:` = major

**Publishing failed?**

- Check workflow logs in GitHub Actions
- Re-run workflow or publish manually

**Need to skip release?**

- Leave PR open, merge later

## Configuration

- [`.github/release-please-config.md`](../../.github/release-please-config.md) - Detailed config docs
- [CONVENTIONAL_COMMITS.md](./CONVENTIONAL_COMMITS.md) - Commit guidelines

## Resources

- [Release Please Docs](https://github.com/googleapis/release-please)
- [Semantic Versioning](https://semver.org/)
