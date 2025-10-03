import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { execSync } from 'node:child_process'

describe('generate-colors CLI', () => {
  const testDir = resolve(__dirname, '__test-output__')
  const configPath = resolve(__dirname, '__test-palette-config.json')
  const cliPath = resolve(__dirname, '../../dist/cli/generate-colors.js')

  const testConfig = {
    colors: [
      { name: 'Moss Green', value: '#007079' },
      { name: 'Gray', value: '#4A4A4A' },
      { name: 'Blue', value: '#0084C4' },
    ],
  }

  beforeAll(() => {
    // Create test config
    mkdirSync(testDir, { recursive: true })
    writeFileSync(configPath, JSON.stringify(testConfig, null, 2), 'utf-8')
  })

  afterAll(() => {
    // Clean up
    rmSync(testDir, { recursive: true, force: true })
    rmSync(configPath, { force: true })
  })

  it('should generate light and dark color tokens', () => {
    // Run the CLI
    const cmd = `node ${cliPath} ${configPath} ${testDir}`
    execSync(cmd)

    // Check that files were created
    const lightTokensPath = join(testDir, 'color.tokens.light.json')
    const darkTokensPath = join(testDir, 'color.tokens.dark.json')

    const lightTokens = JSON.parse(readFileSync(lightTokensPath, 'utf-8'))
    const darkTokens = JSON.parse(readFileSync(darkTokensPath, 'utf-8'))

    // Verify structure
    expect(lightTokens).toHaveProperty('Light')
    expect(darkTokens).toHaveProperty('Dark')

    // Verify colors are present
    expect(lightTokens.Light).toHaveProperty('Moss Green')
    expect(lightTokens.Light).toHaveProperty('Gray')
    expect(lightTokens.Light).toHaveProperty('Blue')

    expect(darkTokens.Dark).toHaveProperty('Moss Green')
    expect(darkTokens.Dark).toHaveProperty('Gray')
    expect(darkTokens.Dark).toHaveProperty('Blue')

    // Snapshot test
    expect(lightTokens).toMatchSnapshot()
    expect(darkTokens).toMatchSnapshot()
  })

  it('should use custom gaussian parameters if provided', () => {
    const customConfig = {
      colors: [{ name: 'Test Color', value: '#FF0000' }],
      meanLight: 0.5,
      stdDevLight: 1.5,
      meanDark: 0.8,
      stdDevDark: 1.8,
    }

    const customConfigPath = resolve(
      __dirname,
      '__test-custom-palette-config.json',
    )
    writeFileSync(
      customConfigPath,
      JSON.stringify(customConfig, null, 2),
      'utf-8',
    )

    const customTestDir = resolve(__dirname, '__test-custom-output__')
    mkdirSync(customTestDir, { recursive: true })

    // Run the CLI
    const cmd = `node ${cliPath} ${customConfigPath} ${customTestDir}`
    execSync(cmd)

    const lightTokensPath = join(customTestDir, 'color.tokens.light.json')
    const lightTokens = JSON.parse(readFileSync(lightTokensPath, 'utf-8'))

    expect(lightTokens).toHaveProperty('Light')
    expect(lightTokens.Light).toHaveProperty('Test Color')

    // Snapshot test for custom params
    expect(lightTokens).toMatchSnapshot()

    // Clean up
    rmSync(customTestDir, { recursive: true, force: true })
    rmSync(customConfigPath, { force: true })
  })

  it('should generate tokens with correct structure', () => {
    const lightTokensPath = join(testDir, 'color.tokens.light.json')
    const lightTokens = JSON.parse(readFileSync(lightTokensPath, 'utf-8'))

    // Check token structure for one color
    const mossGreen = lightTokens.Light['Moss Green']
    expect(mossGreen).toBeDefined()

    // Check that all expected step IDs are present
    expect(mossGreen).toHaveProperty('bg-canvas')
    expect(mossGreen).toHaveProperty('bg-surface')
    expect(mossGreen).toHaveProperty('bg-fill-muted-default')
    expect(mossGreen).toHaveProperty('text-strong')

    // Check token format
    const token = mossGreen['bg-canvas']
    expect(token).toHaveProperty('$type', 'color')
    expect(token).toHaveProperty('$value')
    expect(token).toHaveProperty('$description')
    expect(token).toHaveProperty('$extensions')

    // Check OKLCH format
    expect(token.$value).toMatch(/oklch\([0-9.]+\s+[0-9.]+\s+[0-9.]+\)/)
  })
})
