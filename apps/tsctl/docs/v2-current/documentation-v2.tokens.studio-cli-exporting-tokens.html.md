<!-- source: https://documentation-v2.tokens.studio/cli/exporting-tokens.html -->

# Exporting Tokens [​](#exporting-tokens)

The `exports` command group lets you manage export configurations and run exports directly from the CLI. You can create reusable configurations for different platforms (CSS, SCSS, DTCG, Figma, Swift, Android, Compose), preview output, and write files to disk.

## Commands [​](#commands)

| Command | Description |
| --- | --- |
| `studio exports list` | List saved export configurations |
| `studio exports show <name>` | Display a single configuration by name or ID |
| `studio exports create` | Create a new export configuration |
| `studio exports update <name>` | Update an existing configuration |
| `studio exports delete <name>` | Delete a configuration |
| `studio exports duplicate <name>` | Clone a configuration with a new name |
| `studio exports templates` | List preset templates for an export format |
| `studio exports schema` | Show the JSON schema for a format's config options |
| `studio exports preview <name>` | Render an export without saving |
| `studio exports run <name>` | Execute a configuration and write output to disk |

## Listing Configurations [​](#listing-configurations)

View all saved export configurations for your project:

bash

```
studio exports list
```

Filter by format:

bash

```
studio exports list --format css
```

## Creating a Configuration [​](#creating-a-configuration)

Create a new export configuration by specifying a name and format:

bash

```
studio exports create --name "brand-css" --format css
```

To create a configuration from a preset template:

bash

```
studio exports templates --format css
studio exports create --name "brand-css" --format css --template <template-name>
```

## Discovering Format Options [​](#discovering-format-options)

Each export format has its own set of configuration options. Use `schema` to see what's available:

bash

```
studio exports schema --format css
```

This returns the JSON schema describing all valid config options for that format, including variable prefixes, selectors, and output structure.

Use `templates` to see preset starting points:

bash

```
studio exports templates --format scss
```

## Previewing Output [​](#previewing-output)

Preview what an export would produce without writing any files:

bash

```
studio exports preview brand-css
```

Write the preview to disk for inspection:

bash

```
studio exports preview brand-css --out ./preview/
```

## Running an Export [​](#running-an-export)

Execute a saved configuration and write the output files:

bash

```
studio exports run brand-css --out ./dist/tokens/
```

The `--out` flag is required and specifies where to write the generated files.

## Managing Configurations [​](#managing-configurations)

Update an existing configuration:

bash

```
studio exports update brand-css --config '{"prefix": "ds"}'
```

Duplicate a configuration with a new name:

bash

```
studio exports duplicate brand-css --new-name "brand-css-v2"
```

Delete a configuration:

bash

```
studio exports delete brand-css
```

Add `--force` to skip the confirmation prompt.

## Flags [​](#flags)

Flags available across all `exports` subcommands:

| Flag | Description |
| --- | --- |
| `--alias` | Select configuration from `.studio.json` when multiple sources exist |
| `--service-token-file` | Path to a file containing the service token for CI authentication |
| `--json` | Output in JSON format |
| `--format` | Export format: `css`, `scss`, `dtcg`, `figma`, `swift`, `android`, `compose` |
| `--out` | Output directory (required for `run`, optional for `preview`) |
| `--force` | Skip confirmation prompts |

## Running in CI/CD [​](#running-in-ci-cd)

The exports command works in CI environments using service tokens:

yaml

```
# GitHub Actions example
- name: Export tokens as CSS
  env:
    STUDIO_SERVICE_TOKEN: ${{ secrets.STUDIO_SERVICE_TOKEN }}
  run: studio exports run brand-css --out ./dist/tokens/
```

## Next Steps [​](#next-steps)

-   [Pulling Tokens](./pulling-tokens.html) — fetch raw token files
-   [Configuration](./configuration.html) — set up your project config
-   [CI/CD Pipeline Triggers](./../integrations/ci-cd-triggers.html) — automate exports on release