[Figma Web API]: https://www.figma.com/developers/docs
[design tokens]: https://css-tricks.com/what-are-design-tokens/

# Figma broker

Extracts design decisions into [design tokens] from Figma using the [Figma Web API]

# Notes 

## Components

Components in Figma (Buttons, Tables, Input etc…) are built using tokens as building blocks. For example, a button can be built up of shape, typography, spacing and colors tokens. 

Figma broker exports the result of this union of tokens and lets Figma be in charge of upholding inheritance from tokens as its the single source of truth. Exporting which tokens a component is built up of and patching this together is more complex and intensive so no point in doing when figma already does this for you.

## Colors

```javascript
{
  blendMode: 'NORMAL',
  color: { a: 1, b: 0, g: 0, r: 0 },
  opacity: 0.4000000059604645, // optional 
  type: 'SOLID',
}
```

### [transformers/colors](./transformers/colors.js) 


Figma provides colors and alpha as RGBA _percentages_. Figma broker convert these to RGBA _decimals_ for further for conversion to the other color spaces.

Currently implemented color spaces: 
- `RGBA`
- `HSLA`
- `HEX` (HEXA is implemented, but disabled due to lacking support)


Opacity is defined in either a seperate `opacity` property or in the alpha channel. **Figma broker picks opacity from `opacity` if presenten, else alpha channel.**


## Typography

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
### [transformers/typography](./transformers/typography.js)

Figma provides typography in pixel and percent values. Figma broker converts typography to `rem` and `em` values using a default font size declared in [functions/units](functions/units)
<!-- embedme functions/units.js#L9-L9  --> 
```js 
export const rootFontSize = 16
```

## Usage

1. Add an .env file in the root of the app with environment variables. Ask a developer in EDS Core for more information about this. 
1. Start the application with `pnpm start`
1. Run commands from Commands.httpie by clicking the lines prefixed with ⚡ (requires the httpie vs code extension and a locally installed version of httpie)

