[Figma Web API]: https://www.figma.com/developers/docs
[design tokens]: https://css-tricks.com/what-are-design-tokens/

# Figma broker

Extracts design decisions into [design tokens] from Figma using the [Figma Web API]

## Usage

### Setup

1. Go to Figma and generate a new personal access token (Found under your account settings)
2. Add an `.env` file in the root of `figma-broker` or if you are using Codespaces, go to `Github Settings` → `Codespaces` and create a new secret. Give it the name `FIGMA_TOKEN`, paste your token as value, and select `equinor/design-system` in the repository access select menu.
3. Set `FIGMA_TOKEN` env variable to the new personal access token

### Run

1. Run either `tokens` or `assets` script with a `fileId` and/or flag for forcing to fetch new data from Figma.

The `fileId` for any figma file can be found in the url, after `https://www.figma.com/file/<fileId>` when opened in a browser.

#### Example

```text
https://www.figma.com/file/0bGXR2sCwMVSDNyyzu5BXrO5/UI%E2%80%94User-Interface?node-id=0%3A1
                                   ☝
                                 fileId
```

```sh
pnpm run tokens 0TbIXrrObWj80Cf7KucKYFL0 true  # Fetches new data from Figma
pnpm run tokens 0TbIXrrObWj80Cf7KucKYFL0 # Reads local figma json file
```

## Notes

### Components

Components in Figma (Buttons, Tables, Input etc…) are built using tokens as building blocks. For example, a button can be built up of shape, typography, spacing and colors tokens.

Figma broker exports the result of this union of tokens and lets Figma be in charge of upholding inheritance from tokens as its the single source of truth. Exporting which tokens a component is built up of and patching this together is more complex and intensive so no point in doing when figma already does this for you.

### Colors

```javascript
{
  blendMode: 'NORMAL',
  color: { a: 1, b: 0, g: 0, r: 0 },
  opacity: 0.4000000059604645, // optional 
  type: 'SOLID',
}
```

#### [transformers/colors](./transformers/colors.js)

Figma provides colors and alpha as RGBA _percentages_. Figma broker convert these to RGBA _decimals_ for further for conversion to the other color spaces.

Currently implemented color spaces:

- `RGBA`
- `HSLA`
- `HEX` (HEXA is implemented, but disabled due to lacking support)

Opacity is defined in either a seperate `opacity` property or in the alpha channel. **Figma broker picks opacity from `opacity` if presenten, else alpha channel.**

### Typography

```javascript
{
  fontFamily: 'Equinor',
  fontPostScriptName: 'Equinor-Bold',
  fontSize: 32,
  fontWeight: 700,
  letterSpacing: 0,
  lineHeightPercent: 128,
  lineHeightPercentFontSize: 150,
  lineHeightPx: 48,
  lineHeightUnit: 'PIXELS',
  textAlignHorizontal: 'LEFT',
  textAlignVertical: 'TOP',
}
```

#### [transformers/typography](./transformers/typography.js)

Figma provides typography in pixel and percent values. Figma broker converts typography to `rem` and `em` values using a default font size declared in [functions/units](functions/units)

```js
export const rootFontSize = 16
```
