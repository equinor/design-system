import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { generateColorScale } from '../utils/color'
import { PALETTE_STEPS } from '../config/config'
import { getLightnessValues } from '../config/helpers'
import { ColorDefinition, ColorFormat } from '../types'

interface PaletteConfigFile {
  colors: ColorDefinition[]
  meanLight?: number
  stdDevLight?: number
  meanDark?: number
  stdDevDark?: number
  colorFormat?: ColorFormat
  outputFileLight?: string
  outputFileDark?: string
}

interface ColorToken {
  $type: string
  $value: string
  $description: string
  $extensions: {
    'com.figma': {
      hiddenFromPublishing: boolean
      scopes: string[]
      codeSyntax: Record<string, unknown>
    }
  }
}

interface ColorTokenGroup {
  [key: string]: ColorToken
}

interface TokenOutput {
  [colorName: string]: ColorTokenGroup
}

function formatColorTokens(
  colors: Record<string, string[]>,
  mode: 'Light' | 'Dark',
): string {
  const output: { [mode: string]: TokenOutput } = { [mode]: {} }

  Object.entries(colors).forEach(([colorName, colorScale]) => {
    const tokenGroup: ColorTokenGroup = {}

    colorScale.forEach((color, index) => {
      const stepId = PALETTE_STEPS[index]?.id || `${index + 1}`
      tokenGroup[stepId] = {
        $type: 'color',
        $value: color,
        $description: '',
        $extensions: {
          'com.figma': {
            hiddenFromPublishing: false,
            scopes: ['ALL_SCOPES'],
            codeSyntax: {},
          },
        },
      }
    })

    output[mode][colorName] = tokenGroup
  })

  return JSON.stringify(output, null, 2)
}

function generateColors(configPath: string, outputDir: string) {
  // Read palette config
  let config: PaletteConfigFile
  try {
    const configContent = readFileSync(configPath, 'utf-8')
    config = JSON.parse(configContent) as PaletteConfigFile
  } catch (error) {
    console.error(`Error reading config file: ${configPath}`)
    console.error(error)
    process.exit(1)
  }

  // Use default values if not provided in config
  const meanLight = config.meanLight ?? 0.6
  const stdDevLight = config.stdDevLight ?? 2
  const meanDark = config.meanDark ?? 0.7
  const stdDevDark = config.stdDevDark ?? 2
  const colorFormat = config.colorFormat ?? 'HEX'
  const outputFileLight = config.outputFileLight ?? 'Color Light.Mode 1.json'
  const outputFileDark = config.outputFileDark ?? 'Color Dark.Mode 1.json'

  // Get lightness values from PALETTE_STEPS
  const lightModeValues = getLightnessValues('light')(PALETTE_STEPS)
  const darkModeValues = getLightnessValues('dark')(PALETTE_STEPS)

  // Generate color scales for light mode
  const lightColors: Record<string, string[]> = {}
  config.colors.forEach((colorDef) => {
    lightColors[colorDef.name] = generateColorScale(
      colorDef.value,
      lightModeValues,
      meanLight,
      stdDevLight,
      colorFormat,
    )
  })

  // Generate color scales for dark mode
  const darkColors: Record<string, string[]> = {}
  config.colors.forEach((colorDef) => {
    darkColors[colorDef.name] = generateColorScale(
      colorDef.value,
      darkModeValues,
      meanDark,
      stdDevDark,
      colorFormat,
    )
  })

  // Format as tokens
  const lightTokenData = formatColorTokens(lightColors, 'Light')
  const darkTokenData = formatColorTokens(darkColors, 'Dark')

  // Create output directory if it doesn't exist
  try {
    mkdirSync(outputDir, { recursive: true })
  } catch (error) {
    console.error(`Error creating output directory: ${outputDir}`)
    console.error(error)
    process.exit(1)
  }

  // Write output files
  const lightOutputPath = resolve(outputDir, outputFileLight)
  const darkOutputPath = resolve(outputDir, outputFileDark)

  try {
    writeFileSync(lightOutputPath, lightTokenData, 'utf-8')
    console.log(`Generated light mode tokens: ${lightOutputPath}`)
  } catch (error) {
    console.error(`Error writing light mode tokens: ${lightOutputPath}`)
    console.error(error)
    process.exit(1)
  }

  try {
    writeFileSync(darkOutputPath, darkTokenData, 'utf-8')
    console.log(`Generated dark mode tokens: ${darkOutputPath}`)
  } catch (error) {
    console.error(`Error writing dark mode tokens: ${darkOutputPath}`)
    console.error(error)
    process.exit(1)
  }
}

function main() {
  const args = process.argv.slice(2)

  // Get config path from args or use default
  const configPath = args[0] || resolve(process.cwd(), 'palette-config.json')

  // Get output directory from args or use default
  const outputDir = args[1] || resolve(process.cwd(), 'output')

  console.log(`Reading config from: ${configPath}`)
  console.log(`Output directory: ${outputDir}`)

  generateColors(configPath, outputDir)

  console.log('Color generation complete!')
}

main()
