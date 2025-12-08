# Generate Colors CLI

A CLI tool to generate color palettes for light and dark modes based on a configuration file.

## Installation

This tool is part of the `@equinor/eds-color-palette-generator` package.

## Usage

### Basic Usage

```bash
generate-colors [configPath] [outputDir]
```

**Arguments:**
- `configPath` (optional): Path to the palette configuration JSON file. Defaults to `palette-config.json` in the current directory.
- `outputDir` (optional): Output directory for the generated token files. Defaults to `output/` in the current directory.

**Example:**

```bash
generate-colors examples/palette-config.json output/
```

### Configuration File Format

The configuration file should be a JSON file with the following structure:

#### Single Value Format (Traditional)

```json
{
  "colors": [
    { "name": "Moss Green", "value": "#007079" },
    { "name": "Gray", "value": "#4A4A4A" },
    { "name": "Blue", "value": "#0084C4" }
  ],
  "colorFormat": "HEX",
  "outputFileLight": "Color Light.Mode 1.json",
  "outputFileDark": "Color Dark.Mode 1.json",
  "meanLight": 0.6,
  "stdDevLight": 2,
  "meanDark": 0.7,
  "stdDevDark": 2
}
```

#### Multiple Anchors Format (Interpolation)

```json
{
  "colors": [
    {
      "name": "Gradient Teal",
      "anchors": [
        { "value": "oklch(0.5915 0.0731 184.63)", "step": 6 },
        { "value": "oklch(0.4973 0.084851 204.553)", "step": 9 }
      ]
    },
    { "name": "Simple Gray", "value": "#4A4A4A" }
  ],
  "colorFormat": "HEX",
  "meanLight": 0.6,
  "stdDevLight": 2,
  "meanDark": 0.7,
  "stdDevDark": 2
}
```

**Color definition formats:**
- `colors`: An array of color definitions, each with:
  - **Single value approach:**
    - `name`: The name of the color
    - `value`: The color value (HEX or OKLCH format)
  - **Multiple anchors approach:**
    - `name`: The name of the color
    - `anchors`: An array of anchor points, each with:
      - `value`: The color value at this step (HEX or OKLCH format)
      - `step`: The step number (1-15) where this color should be anchored

The generator will smoothly interpolate between anchors in OKLCH space while applying Gaussian chroma distribution. Both formats can be mixed in the same configuration file.

**Optional fields:**
- `colorFormat`: Output color format - either `"HEX"` or `"OKLCH"` (default: `"HEX"`)
- `outputFileLight`: Custom filename for light mode tokens (default: `"Color Light.Mode 1.json"`)
- `outputFileDark`: Custom filename for dark mode tokens (default: `"Color Dark.Mode 1.json"`)
- `meanLight`: Mean value for the Gaussian distribution in light mode (default: 0.6)
- `stdDevLight`: Standard deviation for the Gaussian distribution in light mode (default: 2)
- `meanDark`: Mean value for the Gaussian distribution in dark mode (default: 0.7)
- `stdDevDark`: Standard deviation for the Gaussian distribution in dark mode (default: 2)

### Output

The tool generates two files with configurable names:
- Default: `Color Light.Mode 1.json` - Color tokens for light mode
- Default: `Color Dark.Mode 1.json` - Color tokens for dark mode

Both files follow the W3C Design Tokens Community Group format and include all the semantic color steps defined in the palette configuration.

#### Output Formats

**HEX Format (default):**
```json
{
  "Light": {
    "Moss Green": {
      "1": {
        "$type": "color",
        "$value": "#f5fefe",
        ...
      }
    }
  }
}
```

**OKLCH Format:**
```json
{
  "Light": {
    "Moss Green": {
      "1": {
        "$type": "color",
        "$value": "oklch(0.970 0.015 204.6)",
        ...
      }
    }
  }
}
```

## Example

See the `examples/` directory for a sample configuration file and generated output:
- `examples/palette-config.json`: Sample configuration
- `examples/color.tokens.light.json`: Generated light mode tokens
- `examples/color.tokens.dark.json`: Generated dark mode tokens

## How It Works

The tool uses the existing `generateColorScale` function from the color utilities to create color scales for each color in the configuration. The lightness values and other configuration parameters are derived from the predefined `PALETTE_STEPS` configuration, ensuring consistency with the EDS color system.

The Gaussian distribution parameters (`mean` and `stdDev`) control the chroma (saturation) of colors at different lightness levels, creating natural-looking color scales that maintain the hue while varying lightness and saturation.
