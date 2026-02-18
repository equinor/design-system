# @equinor/eds-tokens-sync

Two-way sync between Figma variables and local JSON token files.

## Setup

Requires a Figma personal access token. Create `bin/.env`:

```
PERSONAL_ACCESS_TOKEN=your-figma-token
```

The `.env.example` file shows the format. Never commit the actual `.env` file.

## CLI Commands

Run from `eds-tokens` (not from this package):

```bash
# Figma → JSON (pull)
pnpm run update-tokens              # All tokens
pnpm run update-tokens:foundations   # Foundation palette + color scheme
pnpm run update-tokens:color-static # Static semantic + concept
pnpm run update-tokens:color-dynamic # Dynamic appearance + concept

# JSON → Figma (push)
pnpm run update-figma               # All tokens
```

## How It Works

### Figma → JSON (`sync-figma-to-tokens`)
- Calls Figma REST API to read local variables from a file
- Transforms variable collections/modes into JSON files
- Writes to `eds-tokens/tokens/{fileKey}/`
- File naming: `{collectionName}.{modeName}.json`

### JSON → Figma (`sync-tokens-to-figma`)
- Reads JSON files from `eds-tokens/tokens/{fileKey}/`
- Flattens token paths to `{group/subgroup/token}` format
- Resolves `{Reference}` aliases to Figma variable IDs
- Creates/updates variables via Figma POST API

## Figma File Keys

Defined in `eds-tokens/token-config.json`:

| File | Key | Contents |
|---|---|---|
| EDS Foundations | `GnovDpL3UV6X51Ot7Kv6Im` | Palette colors, color scheme |
| EDS Static | `OWxw2XogDLUt1aCvcDFXPw` | Semantic tokens, concept tokens |
| EDS Dynamic | `nyPaQ3QnI1UAcxKW4a0d2c` | Appearance tokens, concept tokens |
| Spacing primitives | `cpNchKjiIM19dPqTxE0fqg` | Spacing scale |
| Spacing modes | `FQQqyumcpPQoiFRCjdS9GM` | Spacing density variants |

## Important

- Synced files and generated files write to the **same paths**. After syncing new tokens from Figma, update the generate scripts in `eds-tokens-build` so they produce matching output.
- The `codeSyntax.WEB` field in synced JSON is Figma metadata for the code panel — it does not affect CSS build output. Figma sometimes assigns incorrect WEB values; the generate scripts produce correct ones.
