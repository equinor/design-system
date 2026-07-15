<!-- source: https://documentation-v2.tokens.studio/cli/overview.html -->

# Tokens Studio CLI [​](#tokens-studio-cli)

The Tokens Studio CLI lets you pull design tokens from Studio directly into your codebase. Use it locally during development or integrate it into CI/CD pipelines to keep your token files in sync.

## Installation [​](#installation)

Install the CLI via npm:

bash

```
npm install @tokens-studio/studio-cli
```

Or install it globally:

bash

```
npm install -g @tokens-studio/studio-cli
```

Once installed, the `studio` command is available in your terminal.

## Quick Start [​](#quick-start)

1.  Log in with your Studio account:
    
    bash
    
    ```
    studio auth login
    ```
    
    A browser window opens for authentication. The CLI also displays a QR code you can scan on mobile.
    
2.  Set up a project configuration:
    
    bash
    
    ```
    studio config init
    studio config add my-tokens
    ```
    
    Follow the prompts to select your workspace, project, and branch.
    
3.  Pull your tokens:
    
    bash
    
    ```
    studio tokens pull
    ```
    
    Your tokens are written to the configured output folder.
    

## Commands [​](#commands)

| Command | Description |
| --- | --- |
| [`studio auth login`](./authentication.html) | Log in to your Studio account |
| [`studio auth logout`](./authentication.html) | Log out and revoke credentials |
| [`studio auth status`](./authentication.html) | Show current authentication state |
| [`studio config init`](./configuration.html) | Create a new `.studio.json` config file |
| [`studio config add`](./configuration.html) | Add a token source to your config |
| [`studio config remove`](./configuration.html) | Remove a token source |
| [`studio config show`](./configuration.html) | Display current configuration |
| [`studio tokens pull`](./pulling-tokens.html) | Pull tokens from Studio |
| [`studio tokens watch`](./pulling-tokens.html#watching-for-changes) | Watch for real-time token updates |
| [`studio exports list`](./exporting-tokens.html) | List saved export configurations |
| [`studio exports create`](./exporting-tokens.html#creating-a-configuration) | Create a new export configuration |
| [`studio exports run`](./exporting-tokens.html#running-an-export) | Execute an export and write output to disk |
| [`studio exports preview`](./exporting-tokens.html#previewing-output) | Preview export output without writing files |
| `studio info` | Show version, config, and auth status |
| `studio completion` | Generate shell completions (bash, zsh, fish, powershell) |

## Global Flags [​](#global-flags)

These flags work with any command:

| Flag | Alias | Description |
| --- | --- | --- |
| `--verbose` | `-v` | Enable verbose output |
| `--host` |  | Override the API host URL |
| `--json` |  | Output in JSON format |
| `--no-color` |  | Disable color output |
| `--help` |  | Show usage information |

## Next Steps [​](#next-steps)

-   [Authentication](./authentication.html) — logging in and credential management
-   [Configuration](./configuration.html) — setting up your project config
-   [Pulling Tokens](./pulling-tokens.html) — fetching tokens and watching for changes
-   [Exporting Tokens](./exporting-tokens.html) — managing export configurations and running exports