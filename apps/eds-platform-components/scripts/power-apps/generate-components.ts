#!/usr/bin/env node
/**
 * Power Apps Component Generator CLI
 * Generates Power Apps YAML components based on EDS design
 */

import * as path from 'path'
import { fileURLToPath } from 'url'
import { generateButton, ButtonOptions } from './components/button'
import {
  validatePowerAppsYAML,
  saveYAML,
  ValidationResult,
} from './utils/schema-validator'

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Parse command line arguments
const args = process.argv.slice(2)
const componentType = args[0] || 'button'
const outputDir = args[1] || path.join(__dirname, 'output')

/**
 * Generate button components with all variants
 */
const generateButtonComponents = async (): Promise<void> => {
  console.log('🎨 Generating EDS Button components for Power Apps...\n')

  const variants: Array<{
    variant: ButtonOptions['variant']
    name: string
    fileName: string
  }> = [
    {
      variant: 'contained',
      name: 'Contained Button',
      fileName: 'button-contained',
    },
    {
      variant: 'outlined',
      name: 'Outlined Button',
      fileName: 'button-outlined',
    },
    { variant: 'ghost', name: 'Ghost Button', fileName: 'button-ghost' },
  ]

  const colors: Array<{ color: ButtonOptions['color']; label: string }> = [
    { color: 'primary', label: 'Primary' },
    { color: 'secondary', label: 'Secondary' },
    { color: 'danger', label: 'Danger' },
  ]

  let successCount = 0
  let errorCount = 0

  // Generate each variant with all colors
  for (const { variant, name, fileName } of variants) {
    console.log(`📦 Generating ${name} variants...`)

    for (const { color, label } of colors) {
      const options: ButtonOptions = {
        name: `EDSButton_${variant}_${color}`,
        variant,
        color,
        text: `${label} ${name}`,
        disabled: false,
        width: 150,
        height: 36,
        x: 40,
        y: 40,
      }

      const yaml = generateButton(options)
      const outputPath = path.join(outputDir, `${fileName}-${color}.yaml`)

      // Validate YAML
      const validation: ValidationResult = await validatePowerAppsYAML(yaml)

      if (!validation.isValid) {
        console.error(`  ❌ ${label} - Validation failed:`)
        validation.errors.forEach((err) => console.error(`     ${err}`))
        errorCount++
        continue
      }

      // Save YAML
      const result = saveYAML(yaml, outputPath)

      if (result.success) {
        console.log(`  ✅ ${label} - ${path.basename(outputPath)}`)
        if (validation.warnings.length > 0) {
          validation.warnings.forEach((warn) =>
            console.warn(`     ⚠️  ${warn}`),
          )
        }
        successCount++
      } else {
        console.error(`  ❌ ${label} - Save failed: ${result.error}`)
        errorCount++
      }
    }

    // Generate disabled state example
    const disabledOptions: ButtonOptions = {
      name: `EDSButton_${variant}_disabled`,
      variant,
      color: 'primary',
      text: `Disabled ${name}`,
      disabled: true,
      width: 150,
      height: 36,
      x: 40,
      y: 40,
    }

    const disabledYaml = generateButton(disabledOptions)
    const disabledPath = path.join(outputDir, `${fileName}-disabled.yaml`)

    const disabledValidation = await validatePowerAppsYAML(disabledYaml)
    if (disabledValidation.isValid) {
      const result = saveYAML(disabledYaml, disabledPath)
      if (result.success) {
        console.log(`  ✅ Disabled - ${path.basename(disabledPath)}`)
        successCount++
      }
    }

    console.log('')
  }

  console.log('\n📊 Summary:')
  console.log(`  ✅ Successfully generated: ${successCount} components`)
  if (errorCount > 0) {
    console.log(`  ❌ Failed: ${errorCount} components`)
  }
  console.log(`  📁 Output directory: ${outputDir}\n`)
}

/**
 * Main CLI entry point
 */
const main = async (): Promise<void> => {
  console.log('═══════════════════════════════════════════════')
  console.log('  EDS Power Apps Component Generator')
  console.log('  Equinor Design System → Power Apps Canvas')
  console.log('═══════════════════════════════════════════════\n')

  switch (componentType.toLowerCase()) {
    case 'button':
      await generateButtonComponents()
      break
    default:
      console.error(`❌ Unknown component type: ${componentType}`)
      console.log('\nAvailable components:')
      console.log('  - button')
      console.log(
        '\nUsage: npm run generate:power-apps [component] [outputDir]',
      )
      process.exit(1)
  }

  console.log('✨ Component generation complete!')
  console.log('\n💡 Next steps:')
  console.log('  1. Open Power Apps Studio')
  console.log('  2. Create or open a Canvas App')
  console.log('  3. Go to Tree View → Click (...) → Paste YAML')
  console.log('  4. Copy and paste the content from generated .yaml files\n')
}

// Run the CLI
main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
