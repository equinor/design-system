<!-- source: https://documentation-v2.tokens.studio/cli/pulling-tokens.html -->

# Pulling Tokens [​](#pulling-tokens)

The `tokens pull` command fetches design tokens, themes, and configuration from Studio and writes them to your local filesystem.

## Usage [​](#usage)

bash

```
studio tokens pull [alias]
```

If you have a single source in your config, the alias is optional. With multiple sources, specify which one to pull.

Shorthand

You can also use `studio pull` as a shorthand for `studio tokens pull`.

## What Gets Pulled [​](#what-gets-pulled)

The CLI downloads your token files as they're organized in Studio:

| File | Description |
| --- | --- |
| Token set files (`.json`) | Your design tokens, organized by set |
| `$themes.json` | Theme group definitions and dimension mappings |
| `$metadata.json` | Token metadata (set ordering, etc.) |

All files are written to the output folder specified in your config.

## Output Structure [​](#output-structure)

After pulling, your output folder mirrors your Studio project structure:

```
tokens/
  foundation.json
  brand/
    alpha.json
    beta.json
  semantic/
    light.json
    dark.json
  $themes.json
  $metadata.json
```

## Flags [​](#flags)

| Flag | Description |
| --- | --- |
| `--project` | Override the project ID from config |
| `--output` | Override the output directory |
| `--ci` | Run in CI mode (no interactive prompts, auto-overwrite) |
| `--locked` | Only pull if a lockfile matches (ensures reproducible builds) |
| `--force` | Overwrite existing files without asking |
| `--partial` | Only pull files that have changed |
| `--file` | Pull a specific file only |
| `--dry-run` | Show what would be pulled without writing files |
| `--service-token-file` | Path to a file containing the service token |

## Pulling in CI/CD [​](#pulling-in-ci-cd)

The CLI works in CI environments out of the box. Set `STUDIO_SERVICE_TOKEN` and use the `--ci` flag to skip all interactive prompts:

yaml

```
# GitHub Actions example
- name: Pull tokens from Studio
  env:
    STUDIO_SERVICE_TOKEN: ${{ secrets.STUDIO_SERVICE_TOKEN }}
  run: studio tokens pull my-tokens --ci
```

## Watching for Changes [​](#watching-for-changes)

The `tokens watch` command opens a WebSocket connection to Studio and updates your local files in real time as tokens change:

bash

```
studio tokens watch [alias]
```

This is useful during development when designers and developers are iterating on tokens simultaneously. Press `Ctrl+C` to stop watching.

### Flags [​](#flags-1)

| Flag | Description |
| --- | --- |
| `--project` | Override the project ID |
| `--branch` | Branch to watch |

## Next Steps [​](#next-steps)

-   [CI/CD Pipeline Triggers](./../integrations/ci-cd-triggers.html) — trigger pulls automatically on release
-   [GitHub Actions](./../integrations/github-actions.html) — full GitHub Actions setup
-   [GitLab CI](./../integrations/gitlab-ci.html) — full GitLab CI setup