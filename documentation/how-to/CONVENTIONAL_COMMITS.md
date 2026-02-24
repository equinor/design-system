# CONVENTIONAL COMMITS & PR TITLE GUIDELINES

## Table of Contents

1. [Overview](#overview)
2. [Required Format](#required-format)
   - [Components](#components)
3. [Supported Types](#supported-types)
4. [Supported Scopes](#supported-scopes)
   - [Multiple Scopes](#multiple-scopes)
5. [Examples](#examples)
   - [Valid PR Titles](#valid-pr-titles)
   - [Invalid PR Titles](#invalid-pr-titles)
6. [Emojis (Optional)](#emojis-optional)
7. [Breaking Changes](#breaking-changes)
8. [Enforcement](#enforcement)
9. [Why This Matters](#why-this-matters)
10. [Maintaining the Workflow](#maintaining-the-workflow)
    - [Workflow Location](#workflow-location)
    - [Adding New Scopes](#adding-new-scopes)
    - [Testing Changes](#testing-changes)
11. [VSCode Integration](#vscode-integration)
    - [Conventional Commits Plugin](#conventional-commits-plugin)
12. [Need Help?](#need-help)

---

## Overview

All pull request titles must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This requirement is enforced by an automated GitHub Action that validates PR titles before allowing merges.

When using "Squash and merge", the PR title becomes the commit message in the develop branch, making consistent formatting essential for our automated release process and changelog generation.

## Required Format

```
type(scope): description
```

### Components

- **type**: The type of change (required)
- **scope**: The package or area affected (optional)
- **description**: Brief description of the change (required)

## Supported Types

| Type       | Description                           | Example                                                  |
| ---------- | ------------------------------------- | -------------------------------------------------------- |
| `feat`     | New feature                           | `feat(eds-core-react): add button variants`              |
| `fix`      | Bug fix                               | `fix(eds-icons): resolve alignment issues`               |
| `docs`     | Documentation changes                 | `docs: update installation guide`                        |
| `style`    | Code style changes (formatting, etc.) | `style(eds-tokens): improve naming consistency`          |
| `refactor` | Code refactoring                      | `refactor(eds-core-react): simplify component structure` |
| `perf`     | Performance improvements              | `perf(eds-data-grid): optimize rendering`                |
| `test`     | Adding or updating tests              | `test(eds-utils): add validation tests`                  |
| `build`    | Build system changes                  | `build: update webpack configuration`                    |
| `ci`       | CI/CD changes                         | `ci: add automated release workflow`                     |
| `chore`    | Maintenance tasks                     | `chore: update dependencies`                             |
| `revert`   | Revert previous changes               | `revert: undo button color changes`                      |

## Supported Scopes

Scopes correspond to the **packages in our design system** and infrastructure & tooling:

- `design-system-docs`
- `eds-color-palette-generator`
- `eds-core-react`
- `eds-data-grid-react`
- `eds-demo`
- `eds-icons`
- `eds-lab-react`
- `eds-tailwind`
- `eds-tokens`
- `eds-tokens-build`
- `eds-tokens-sync`
- `eds-utils`
- `figma-broker`

#### Infrastructure & Tooling

- `devcontainer` - Development container configuration
- `github` - GitHub workflows, templates, and configurations
- `build` - Build system configuration
- `deps` - Dependency management
- `config` - General configuration files
- `docs` - General documentation

### Multiple Scopes

You can specify multiple scopes separated by commas:

```
feat(eds-core-react, eds-utils): add shared utility functions
refactor(eds-tokens, eds-icons): standardize naming conventions
```

## Examples

### Valid PR Titles

✅ `feat(eds-core-react): add new button variant`
✅ `fix(eds-icons): resolve icon alignment in Safari`
✅ `docs(design-system-docs): update component guidelines`
✅ `style(eds-tokens): improve color naming`
✅ `feat(eds-core-react, eds-utils): add shared validation logic`
✅ `chore: update project dependencies`
✅ `docs: add setup instructions to README`

### Invalid PR Titles

❌ `Updated button component` (missing type)
❌ `Bug fixes` (missing type and description)
❌ `feat(invalid-scope): add feature` (invalid scope)
❌ `FEAT(eds-core-react): add button` (uppercase type)
❌ `feat(eds-core-react) add button` (missing colon)

## Scope and Release-Please Interaction

**Important:** The commit scope directly affects which packages get version bumps via release-please. If a commit scope matches a package's `component` name (e.g. `eds-core-react`), it will trigger a release for that package **regardless of which files were changed** — even if the files are in `exclude-paths`.

### When to avoid package scopes

Release-please detects which packages are affected based on **file paths** — you don't always need a package scope. For example, a commit touching `packages/eds-tokens/src/color.ts` will automatically be associated with `eds-tokens`. Omitting the scope avoids accidentally forcing a bump via scope-matching.

### When to use a scope

- **Package scope** (`eds-core-react`, `eds-tokens`, etc.): Only when the commit message alone doesn't make the package clear, or for changelog readability. Be aware this forces a bump regardless of `exclude-paths`.
- **Infrastructure scope** (`config`, `github`, `build`, `deps`): For changes that don't belong to a specific package.
- **No scope**: Perfectly fine for most commits — release-please will figure it out from the file paths.

### Avoiding unnecessary version bumps

For commits that only touch **non-publishable files** (config, docs, Storybook, tests), use a hidden type:

| Scenario | Recommended | Avoid |
| --- | --- | --- |
| Storybook-only changes | `chore: ...` or `build(config): ...` | `feat(eds-core-react): ...` |
| Config file updates | `chore(config): ...` or `build: ...` | `feat(eds-core-react): ...` |
| Test-only changes | `test: ...` | `feat(eds-core-react): ...` |
| README/docs in packages | `docs: ...` or `chore: ...` | `feat(eds-core-react): ...` |

The types `chore`, `ci`, `build`, `docs`, and `test` are hidden in release-please and will not trigger version bumps.

## Emojis (Optional)

Emojis are supported and can be placed after the colon:

✅ `docs: 📝 update README`
✅ `style(eds-tokens): 🎨 improve color naming`
✅ `feat(eds-core-react): ✨ add new component`

## Breaking Changes

For breaking changes, add an exclamation mark before the colon:

✅ `feat!: remove deprecated button props`
✅ `refactor(eds-core-react)!: change component API`

_This ensures that Release Please will mark the next release as a major release._

## Enforcement

- The GitHub Action runs automatically when you open, edit, or update a PR
- PRs with invalid titles cannot be merged
- You can edit the PR title at any time to fix validation issues
- The validation runs again automatically when you change the title

## Why This Matters

Following conventional commit format enables:

- **Automated releases**: Tools can automatically determine version bumps
- **Generated changelogs**: Release notes are created automatically
- **Better tracking**: Easy to search and filter changes by type
- **Consistent history**: Clean, standardized commit messages

## Maintaining the Workflow

### Workflow Location

The PR title validation workflow is located at:

```
.github/workflows/pr-title-check.yml
```

This file contains the complete validation logic and the list of accepted scopes.

### Adding New Scopes

When new packages are added to the design system, the workflow validation must be updated to recognize them.

**Steps to add new scopes:**

1. **Edit the workflow file**: `.github/workflows/pr-title-check.yml`
2. **Find the valid_scopes array**:
   ```bash
   valid_scopes=("design-system-docs" "eds-color-palette-generator" "eds-core-react" ...)
   ```
3. **Add your new scope** to the array:
   ```bash
   valid_scopes=("design-system-docs" "eds-color-palette-generator" "eds-core-react" "your-new-package" ...)
   ```
4. **Update this documentation** by adding the new scope to the "Supported Scopes" section above
5. **Test the change** - see [detailed testing information](#testing-changes)
6. **Commit both changes** (workflow + documentation) in the same PR

**Example commit:**

```
feat: add support for new package scope in PR validation

- Add 'eds-new-component' to valid scopes in workflow
- Update PR title guidelines documentation
```

### Testing Changes

Before merging workflow changes to develop:

1. **Create a feature branch** for workflow changes:

   ```bash
   git checkout -b feature/update-pr-validation
   ```

2. **Make your changes** to `.github/workflows/pr-title-check.yml` and documentation

3. **Test on the feature branch**:
   - Create a test branch from your feature branch
   - Make a small change and create a test PR **to your feature branch** (not develop)
   - Test with the new scope: `feat(new-scope): test validation`
   - Verify the workflow passes

4. **Test edge cases**:
   - Try an invalid scope to ensure validation still catches errors
   - Test existing scopes to ensure they still work
   - Test multiple scopes: `feat(new-scope, eds-core-react): combined test`

5. **When all tests pass**, open a PR to merge your feature branch to develop (delete test PR)

**Why test on feature branch first?**

- Avoids breaking the validation on main branch
- Lets you iterate and fix issues safely
- Ensures the workflow is fully functional before team adoption

## VSCode Integration

### Conventional Commits Plugin

To make writing conventional commit messages easier, you can install the **Conventional Commits** plugin in VSCode:

1. **Install the plugin**:
   - Open VSCode
   - Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
   - Search for "Conventional Commits"
   - Install the plugin by vivaxy

2. **Using the plugin**:
   - When committing, press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Conventional Commits" and select the command
   - The plugin will guide you through creating a properly formatted commit message
   - Select type, scope, and enter your description

3. **Benefits**:
   - Ensures correct conventional commit format
   - Provides dropdown menus for types and scopes
   - Supports optional emojis (gitmojis)
   - Prevents formatting errors

4. **Plugin features**:
   - Type selection (feat, fix, docs, etc.)
   - Scope selection with custom scopes
   - Automatic emoji insertion based on type
   - Breaking change support
   - Description validation

**Note**: The plugin generates commit messages in the same format required for PR titles, making it easier to maintain consistency across your workflow.

## Need Help?

If you're unsure about the correct format, check the validation error messages in the GitHub Actions log - they provide specific guidance on what needs to be fixed.
