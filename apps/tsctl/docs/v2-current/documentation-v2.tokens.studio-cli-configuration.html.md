<!-- source: https://documentation-v2.tokens.studio/cli/configuration.html -->

# Configuration [​](#configuration)

The CLI stores project configuration in a `.studio.json` file. This file defines which token sources to pull and where to write the output.

## Initializing a Config File [​](#initializing-a-config-file)

bash

```
studio config init
```

Creates a new `.studio.json` in the current directory. If a config file already exists, the CLI asks before overwriting (use `--force` to skip the prompt).

### Flags [​](#flags)

| Flag | Description |
| --- | --- |
| `--force` | Overwrite existing config without asking |
| `--no-add` | Create the config file without immediately adding a source |

## Adding a Token Source [​](#adding-a-token-source)

bash

```
studio config add my-tokens
```

Walks you through selecting a workspace, project, branch, and output folder. The alias (`my-tokens` in this example) is how you reference this source in other commands.

You can also provide values directly to skip the interactive prompts:

bash

```
studio config add my-tokens \
  --project proj_abc123 \
  --branch main \
  --output ./tokens
```

### Flags [​](#flags-1)

| Flag | Alias | Description |
| --- | --- | --- |
| `--project` |  | Project ID |
| `--branch` |  | Branch name |
| `--release` |  | Pin to a specific release version |
| `--tag` |  | Pin to a release tag |
| `--output` | `-o` | Output directory (default: `./tokens`) |

## Removing a Token Source [​](#removing-a-token-source)

bash

```
studio config remove my-tokens
```

Removes the source from your config. By default, downloaded token files are kept.

### Flags [​](#flags-2)

| Flag | Alias | Description |
| --- | --- | --- |
| `--delete-files` |  | Also delete the downloaded token files |
| `--force` | `-f` | Skip confirmation prompt |

## Viewing Configuration [​](#viewing-configuration)

bash

```
studio config show
```

Displays the current configuration, including all sources and their settings.

## Config File Structure [​](#config-file-structure)

The `.studio.json` file looks like this:

json

```
{
  "sources": {
    "my-tokens": {
      "project": "proj_abc123",
      "branch": "main",
      "output": "./tokens"
    }
  }
}
```

Each source maps an alias to a project, branch (or release/tag), and output path.

TIP

Add `.studio.json` to version control so your team and CI pipelines share the same configuration.

## Next Steps [​](#next-steps)

-   [Pulling Tokens](./pulling-tokens.html) — fetch tokens from the configured sources