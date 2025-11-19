import { describe, expect, test } from 'vitest'
import {
  contrast,
  isValidColorFormat,
  parseColorToHex,
  generateColorScale,
} from './color'

describe('Color Contrast Tests', () => {
  test('should return APCA contrast score of 41 for specific OKLCH colors', () => {
    const foreground = 'oklch(0.84 0.2 99.44)'
    const background = 'oklch(0.59 0.03 248.34)'

    const result = contrast({ foreground, background, algorithm: 'APCA' })

    // APCA can return negative values, we expect the absolute value to be around 41
    expect(Math.abs(Number(result))).toBeCloseTo(41, 0)
  })

  test('should return WCAG21 contrast score for black text on white background', () => {
    const foreground = '#000000'
    const background = '#ffffff'

    const result = contrast({
      foreground,
      background,
      algorithm: 'WCAG21',
    })

    expect(Number(result)).toBe(21)
  })

  test('should handle OKLCH colors with WCAG21 algorithm', () => {
    const foreground = 'oklch(0 0 0)' // black
    const background = 'oklch(1 0 0)' // white

    const result = contrast({
      foreground,
      background,
      algorithm: 'WCAG21',
    })

    expect(Number(result)).toBeCloseTo(21, 0)
  })

  test('should return 0 for invalid color inputs', () => {
    const result = contrast({
      foreground: 'invalid-color',
      background: '#ffffff',
      algorithm: 'WCAG21',
      silent: true,
    })

    expect(result).toBe('0')
  })
  test('should handle same colors (zero contrast)', () => {
    const color = 'oklch(0.5 0.1 180)'
    const result = contrast({
      foreground: color,
      background: color,
      algorithm: 'APCA',
    })

    expect(Number(result)).toBe(0)
  })

  test('should handle very similar colors (low contrast)', () => {
    const foreground = 'oklch(0.50 0.1 180)'
    const background = 'oklch(0.51 0.1 180)'

    const result = contrast({ foreground, background, algorithm: 'APCA' })

    // Very low contrast should be close to 0
    expect(Math.abs(Number(result))).toBeLessThan(5)
  })

  test('should calculate high contrast colors correctly', () => {
    const foreground = 'oklch(0.1 0.05 0)' // Very dark
    const background = 'oklch(0.95 0.05 0)' // Very light

    const result = contrast({ foreground, background, algorithm: 'APCA' })

    // High contrast should produce a high APCA score
    expect(Math.abs(Number(result))).toBeGreaterThan(80)
  })

  test('should handle RGB colors with APCA', () => {
    const foreground = 'rgb(0, 0, 0)'
    const background = 'rgb(255, 255, 255)'

    const result = contrast({ foreground, background, algorithm: 'APCA' })

    // Black on white should have maximum contrast
    expect(Math.abs(Number(result))).toBeGreaterThan(100)
  })

  test('should handle HSL colors with APCA', () => {
    const foreground = 'hsl(0, 0%, 0%)' // Black
    const background = 'hsl(0, 0%, 100%)' // White

    const result = contrast({ foreground, background, algorithm: 'APCA' })

    expect(Math.abs(Number(result))).toBeGreaterThan(100)
  })

  test('should calculate medium contrast colors', () => {
    const foreground = 'oklch(0.3 0.1 200)'
    const background = 'oklch(0.7 0.1 200)'

    const result = contrast({ foreground, background, algorithm: 'APCA' })

    // Medium contrast should be in a reasonable range
    const absResult = Math.abs(Number(result))
    expect(absResult).toBeGreaterThan(20)
    expect(absResult).toBeLessThan(80)
  })

  test('should handle colorful vs neutral combinations', () => {
    const foreground = 'oklch(0.4 0.2 25)' // Orange-ish
    const background = 'oklch(0.9 0.02 0)' // Near white

    const result = contrast({ foreground, background, algorithm: 'APCA' })

    expect(Math.abs(Number(result))).toBeGreaterThan(40)
  })

  test('should handle reversed foreground/background', () => {
    const color1 = 'oklch(0.2 0.1 180)'
    const color2 = 'oklch(0.8 0.1 180)'

    const result1 = contrast({
      foreground: color1,
      background: color2,
      algorithm: 'APCA',
    })
    const result2 = contrast({
      foreground: color2,
      background: color1,
      algorithm: 'APCA',
    })

    // APCA can be asymmetric, but absolute values should be related
    const abs1 = Math.abs(Number(result1))
    const abs2 = Math.abs(Number(result2))

    // Both should have meaningful contrast values
    expect(abs1).toBeGreaterThan(20)
    expect(abs2).toBeGreaterThan(20)
  })

  test('should handle grayscale colors with different lightness', () => {
    const foreground = 'oklch(0.25 0 0)' // Dark gray
    const background = 'oklch(0.85 0 0)' // Light gray

    const result = contrast({ foreground, background, algorithm: 'APCA' })

    expect(Math.abs(Number(result))).toBeGreaterThan(40)
  })

  test('should handle colors with high chroma', () => {
    const foreground = 'oklch(0.3 0.3 120)' // Saturated green
    const background = 'oklch(0.9 0.1 120)' // Light green

    const result = contrast({ foreground, background, algorithm: 'APCA' })

    expect(Math.abs(Number(result))).toBeGreaterThan(30)
  })
})

describe('WCAG21 Contrast Tests - Comprehensive Coverage', () => {
  test('should return exactly 21 for maximum contrast (black on white)', () => {
    const foreground = '#000000'
    const background = '#ffffff'

    const result = contrast({ foreground, background, algorithm: 'WCAG21' })

    expect(Number(result)).toBeCloseTo(21, 1)
  })

  test('should return 1 for same colors', () => {
    const color = '#808080'
    const result = contrast({
      foreground: color,
      background: color,
      algorithm: 'WCAG21',
    })

    expect(Number(result)).toBeCloseTo(1, 2)
  })

  test('should calculate AA level compliance (4.5:1)', () => {
    // Colors that should meet AA level
    const foreground = '#595959'
    const background = '#ffffff'

    const result = contrast({ foreground, background, algorithm: 'WCAG21' })

    expect(Number(result)).toBeGreaterThanOrEqual(4.5)
  })

  test('should calculate AAA level compliance (7:1)', () => {
    // Colors that should meet AAA level
    const foreground = '#404040'
    const background = '#ffffff'

    const result = contrast({ foreground, background, algorithm: 'WCAG21' })

    expect(Number(result)).toBeGreaterThanOrEqual(7)
  })

  test('should handle OKLCH input for WCAG21', () => {
    const foreground = 'oklch(0.2 0.05 0)' // Dark
    const background = 'oklch(0.95 0.05 0)' // Light

    const result = contrast({ foreground, background, algorithm: 'WCAG21' })

    expect(Number(result)).toBeGreaterThan(10)
  })

  test('should be symmetric for WCAG21', () => {
    const color1 = '#333333'
    const color2 = '#cccccc'

    const result1 = contrast({
      foreground: color1,
      background: color2,
      algorithm: 'WCAG21',
    })
    const result2 = contrast({
      foreground: color2,
      background: color1,
      algorithm: 'WCAG21',
    })

    // WCAG21 should be symmetric
    expect(Number(result1)).toBeCloseTo(Number(result2), 2)
  })

  test('should handle medium contrast scenarios', () => {
    const foreground = '#666666'
    const background = '#ffffff'

    const result = contrast({ foreground, background, algorithm: 'WCAG21' })

    // Should be between 3:1 and 7:1
    const ratio = Number(result)
    expect(ratio).toBeGreaterThan(3)
    expect(ratio).toBeLessThan(7)
  })

  test('should handle low contrast scenarios', () => {
    const foreground = '#cccccc'
    const background = '#ffffff'

    const result = contrast({ foreground, background, algorithm: 'WCAG21' })

    // Should be less than 3:1 (failing contrast)
    expect(Number(result)).toBeLessThan(3)
  })
})

describe('Edge Cases and Error Handling', () => {
  test('should handle malformed OKLCH values', () => {
    const foreground = 'oklch(invalid values)'
    const background = '#ffffff'

    const result = contrast({
      foreground,
      background,
      algorithm: 'APCA',
      silent: true,
    })

    expect(result).toBe('0')
  })

  test('should handle empty strings', () => {
    const result = contrast({
      foreground: '',
      background: '#ffffff',
      algorithm: 'APCA',
      silent: true,
    })

    expect(result).toBe('0')
  })

  test('should handle very low chroma OKLCH colors', () => {
    const foreground = 'oklch(0.2 0.001 180)' // Almost grayscale
    const background = 'oklch(0.8 0.001 180)' // Almost grayscale

    const result = contrast({ foreground, background, algorithm: 'APCA' })

    // Should still calculate contrast based on lightness difference
    expect(Math.abs(Number(result))).toBeGreaterThan(30)
  })

  test('should handle extreme lightness values', () => {
    const foreground = 'oklch(0.01 0.1 180)' // Nearly black
    const background = 'oklch(0.99 0.1 180)' // Nearly white

    const result = contrast({ foreground, background, algorithm: 'APCA' })

    expect(Math.abs(Number(result))).toBeGreaterThan(90)
  })

  test('should handle colors with NaN hue values', () => {
    const foreground = 'oklch(0.2 0 NaN)' // Grayscale with NaN hue
    const background = 'oklch(0.8 0 180)' // Light gray

    const result = contrast({
      foreground,
      background,
      algorithm: 'APCA',
      silent: true,
    })

    // Should handle gracefully and calculate based on lightness
    expect(typeof result).toBe('string')
  })
})

describe('Real-world Color Combinations', () => {
  test('should handle typical UI color combinations', () => {
    // Common button color on background
    const foreground = '#1976d2' // Material blue
    const background = '#ffffff' // White

    const wcagResult = contrast({
      foreground,
      background,
      algorithm: 'WCAG21',
    })
    const apcaResult = contrast({ foreground, background, algorithm: 'APCA' })

    expect(Number(wcagResult)).toBeGreaterThan(3)
    expect(Math.abs(Number(apcaResult))).toBeGreaterThan(30)
  })

  test('should handle dark theme combinations', () => {
    const foreground = '#ffffff' // White text
    const background = '#121212' // Dark background

    const wcagResult = contrast({
      foreground,
      background,
      algorithm: 'WCAG21',
    })
    const apcaResult = contrast({ foreground, background, algorithm: 'APCA' })

    expect(Number(wcagResult)).toBeGreaterThan(15)
    expect(Math.abs(Number(apcaResult))).toBeGreaterThan(90)
  })

  test('should handle subtle text combinations', () => {
    const foreground = '#757575' // Gray text
    const background = '#fafafa' // Light gray background

    const wcagResult = contrast({
      foreground,
      background,
      algorithm: 'WCAG21',
    })

    // Should be borderline for accessibility
    const ratio = Number(wcagResult)
    expect(ratio).toBeGreaterThan(2)
    expect(ratio).toBeLessThan(6)
  })

  test('should handle warning/error color combinations', () => {
    const foreground = '#d32f2f' // Red error color
    const background = '#fff3e0' // Light orange background

    const result = contrast({ foreground, background, algorithm: 'WCAG21' })

    expect(Number(result)).toBeGreaterThan(3)
  })
})

describe('Color Validation and Parsing', () => {
  describe('isValidColorFormat', () => {
    test('should validate HEX colors with 6 characters', () => {
      expect(isValidColorFormat('#ff0000')).toBe(true)
      expect(isValidColorFormat('#FFFFFF')).toBe(true)
      expect(isValidColorFormat('#123abc')).toBe(true)
    })

    test('should validate HEX colors with 3 characters', () => {
      expect(isValidColorFormat('#fff')).toBe(true)
      expect(isValidColorFormat('#F00')).toBe(true)
      expect(isValidColorFormat('#abc')).toBe(true)
    })

    test('should validate HEX colors with 8 characters (with alpha)', () => {
      expect(isValidColorFormat('#ff0000ff')).toBe(true)
      expect(isValidColorFormat('#FFFFFF80')).toBe(true)
    })

    test('should validate OKLCH format', () => {
      expect(isValidColorFormat('oklch(0.5 0.2 180)')).toBe(true)
      expect(isValidColorFormat('oklch(0.84 0.2 99.44)')).toBe(true)
      expect(isValidColorFormat('oklch(1 0 0)')).toBe(true)
      expect(isValidColorFormat('oklch(0.5 0.2 180 / 0.8)')).toBe(true)
    })

    test('should validate OKLCH with percentage lightness', () => {
      expect(isValidColorFormat('oklch(50% 0.2 180)')).toBe(true)
      expect(isValidColorFormat('oklch(100% 0 0)')).toBe(true)
    })

    test('should reject invalid formats', () => {
      expect(isValidColorFormat('invalid')).toBe(false)
      expect(isValidColorFormat('#gggggg')).toBe(false)
      expect(isValidColorFormat('#ff')).toBe(false)
      expect(isValidColorFormat('oklch()')).toBe(false)
      expect(isValidColorFormat('oklch(invalid)')).toBe(false)
      expect(isValidColorFormat('')).toBe(false)
    })

    test('should validate RGB format', () => {
      expect(isValidColorFormat('rgb(255, 0, 0)')).toBe(true)
      expect(isValidColorFormat('rgb(255 0 0)')).toBe(true)
      expect(isValidColorFormat('rgba(255, 0, 0, 0.5)')).toBe(true)
    })

    test('should validate HSL format', () => {
      expect(isValidColorFormat('hsl(0, 100%, 50%)')).toBe(true)
      expect(isValidColorFormat('hsl(180 50% 50%)')).toBe(true)
      expect(isValidColorFormat('hsla(0, 100%, 50%, 0.8)')).toBe(true)
    })

    test('should validate LAB format', () => {
      expect(isValidColorFormat('lab(50% 40 50)')).toBe(true)
      expect(isValidColorFormat('lab(80 -50 30)')).toBe(true)
    })

    test('should validate named colors', () => {
      expect(isValidColorFormat('red')).toBe(true)
      expect(isValidColorFormat('blue')).toBe(true)
      expect(isValidColorFormat('transparent')).toBe(true)
    })

    test('should handle whitespace', () => {
      expect(isValidColorFormat('  #ff0000  ')).toBe(true)
      expect(isValidColorFormat('  oklch(0.5 0.2 180)  ')).toBe(true)
    })

    test('should handle null and undefined', () => {
      expect(isValidColorFormat(null as unknown as string)).toBe(false)
      expect(isValidColorFormat(undefined as unknown as string)).toBe(false)
    })
  })

  describe('parseColorToHex', () => {
    test('should convert OKLCH to HEX', () => {
      const result = parseColorToHex('oklch(0.5 0.2 180)')
      expect(result).toMatch(/^#[0-9a-f]{3,6}$/)
    })

    test('should convert OKLCH with high chroma to HEX', () => {
      const result = parseColorToHex('oklch(0.84 0.2 99.44)')
      expect(result).toMatch(/^#[0-9a-f]{3,6}$/)
    })

    test('should keep HEX as HEX', () => {
      const result = parseColorToHex('#ff0000')
      expect(result).toMatch(/^#[0-9a-f]{3,6}$/)
    })

    test('should normalize short HEX to HEX format', () => {
      const result = parseColorToHex('#f00')
      expect(result).toMatch(/^#[0-9a-f]{3,6}$/)
    })

    test('should handle uppercase HEX', () => {
      const result = parseColorToHex('#FF0000')
      expect(result).toMatch(/^#[0-9a-f]{3,6}$/)
    })

    test('should return null for invalid input', () => {
      expect(parseColorToHex('invalid')).toBe(null)
      expect(parseColorToHex('#gggggg')).toBe(null)
      expect(parseColorToHex('')).toBe(null)
      expect(parseColorToHex('oklch(invalid)')).toBe(null)
    })

    test('should handle whitespace', () => {
      const result = parseColorToHex('  #ff0000  ')
      expect(result).toMatch(/^#[0-9a-f]{3,6}$/)
    })

    test('should handle OKLCH with zero chroma', () => {
      const result = parseColorToHex('oklch(0.5 0 0)')
      expect(result).toMatch(/^#[0-9a-f]{3,6}$/)
    })

    test('should handle null and undefined', () => {
      expect(parseColorToHex(null as unknown as string)).toBe(null)
      expect(parseColorToHex(undefined as unknown as string)).toBe(null)
    })

    test('should convert RGB to HEX', () => {
      const result = parseColorToHex('rgb(255, 0, 0)')
      expect(result).toMatch(/^#[0-9a-f]{3,6}$/)
    })

    test('should convert HSL to HEX', () => {
      const result = parseColorToHex('hsl(0, 100%, 50%)')
      expect(result).toMatch(/^#[0-9a-f]{3,6}$/)
    })

    test('should convert LAB to HEX', () => {
      const result = parseColorToHex('lab(50% 40 50)')
      expect(result).toMatch(/^#[0-9a-f]{3,6}$/)
    })

    test('should convert named colors to HEX', () => {
      const result = parseColorToHex('red')
      expect(result).toMatch(/^#[0-9a-f]{3,6}$/)
    })
  })
})

describe('generateColorScale', () => {
  const testLightnessValues = [0.2, 0.4, 0.6, 0.8]

  describe('HEX format output', () => {
    test('should generate HEX colors from OKLCH input', () => {
      const baseColor = 'oklch(0.4973 0.084851 204.553)'
      const scale = generateColorScale(
        baseColor,
        testLightnessValues,
        0.6,
        2,
        'HEX',
      )

      expect(scale).toHaveLength(testLightnessValues.length)
      scale.forEach((color) => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i)
      })
    })

    test('should generate HEX colors from HEX input', () => {
      const baseColor = '#007079'
      const scale = generateColorScale(
        baseColor,
        testLightnessValues,
        0.6,
        2,
        'HEX',
      )

      expect(scale).toHaveLength(testLightnessValues.length)
      scale.forEach((color) => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i)
      })
    })

    test('should generate HEX colors from RGB input', () => {
      const baseColor = 'rgb(0, 112, 121)'
      const scale = generateColorScale(
        baseColor,
        testLightnessValues,
        0.6,
        2,
        'HEX',
      )

      expect(scale).toHaveLength(testLightnessValues.length)
      scale.forEach((color) => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i)
      })
    })

    test('should generate grayscale HEX colors from grayscale OKLCH input', () => {
      const baseColor = 'oklch(0.4091 0 0)'
      const scale = generateColorScale(
        baseColor,
        testLightnessValues,
        0.6,
        2,
        'HEX',
      )

      expect(scale).toHaveLength(testLightnessValues.length)
      scale.forEach((color) => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i)
      })
    })
  })

  describe('OKLCH format output', () => {
    test('should generate OKLCH colors from OKLCH input', () => {
      const baseColor = 'oklch(0.4973 0.084851 204.553)'
      const scale = generateColorScale(
        baseColor,
        testLightnessValues,
        0.6,
        2,
        'OKLCH',
      )

      expect(scale).toHaveLength(testLightnessValues.length)
      scale.forEach((color) => {
        expect(color).toMatch(/oklch\([0-9.]+\s+[0-9.]+\s+[0-9.]+\)/)
      })
    })

    test('should generate OKLCH colors from HEX input', () => {
      const baseColor = '#007079'
      const scale = generateColorScale(
        baseColor,
        testLightnessValues,
        0.6,
        2,
        'OKLCH',
      )

      expect(scale).toHaveLength(testLightnessValues.length)
      scale.forEach((color) => {
        expect(color).toMatch(/oklch\([0-9.]+\s+[0-9.]+\s+[0-9.]+\)/)
      })
    })
  })

  describe('Color scale behavior', () => {
    test('should vary lightness across scale', () => {
      const baseColor = 'oklch(0.5 0.1 180)'
      const lightnessValues = [0.2, 0.4, 0.6, 0.8]
      const scale = generateColorScale(
        baseColor,
        lightnessValues,
        0.6,
        2,
        'OKLCH',
      )

      // Parse lightness from each OKLCH color
      const lightnesses = scale.map((color) => {
        const match = color.match(/oklch\(([0-9.]+)/)
        return match ? parseFloat(match[1]) : 0
      })

      // Lightness should match input values
      lightnesses.forEach((l, i) => {
        expect(l).toBeCloseTo(lightnessValues[i], 2)
      })
    })

    test('should apply gaussian function to chroma', () => {
      const baseColor = 'oklch(0.5 0.2 180)'
      const lightnessValues = [0.2, 0.6, 0.9]
      const mean = 0.6
      const stdDev = 2

      const scale = generateColorScale(
        baseColor,
        lightnessValues,
        mean,
        stdDev,
        'OKLCH',
      )

      // Parse chroma from each OKLCH color
      const chromas = scale.map((color) => {
        const match = color.match(/oklch\([0-9.]+\s+([0-9.]+)/)
        return match ? parseFloat(match[1]) : 0
      })

      // Chroma at mean lightness should be highest
      const chromaAtMean = chromas[1] // lightness 0.6
      const chromaAway = chromas[0] // lightness 0.2

      expect(chromaAtMean).toBeGreaterThan(chromaAway)
    })

    test('should handle grayscale colors (zero chroma)', () => {
      const baseColor = 'oklch(0.5 0 0)'
      const scale = generateColorScale(
        baseColor,
        testLightnessValues,
        0.6,
        2,
        'OKLCH',
      )

      scale.forEach((color) => {
        expect(color).toMatch(/oklch\([0-9.]+\s+0\.000\s+[0-9.]+\)/)
      })
    })
  })

  describe('Error handling', () => {
    test('should handle invalid base color gracefully', () => {
      const invalidColor = 'invalid-color'
      const scale = generateColorScale(
        invalidColor,
        testLightnessValues,
        0.6,
        2,
        'HEX',
      )

      expect(scale).toHaveLength(testLightnessValues.length)
      // Should return fallback colors
      scale.forEach((color) => {
        expect(color).toBe('#808080')
      })
    })

    test('should handle empty lightness array', () => {
      const baseColor = '#007079'
      const scale = generateColorScale(baseColor, [], 0.6, 2, 'HEX')

      expect(scale).toHaveLength(0)
    })
  })
})

describe('generateColorScaleWithInterpolation', () => {
  const testLightnessValues = Array.from(
    { length: 15 },
    (_, i) => 0.2 + (i / 14) * 0.6,
  )

  describe('Basic interpolation', () => {
    test('should interpolate between two anchors', () => {
      const anchors = [
        { value: 'oklch(0.65 0.09 200)', step: 1 },
        { value: 'oklch(0.4973 0.084851 204.553)', step: 15 },
      ]

      const scale = generateColorScale(
        anchors,
        testLightnessValues,
        0.6,
        2,
        'OKLCH',
      )

      expect(scale).toHaveLength(15)
      scale.forEach((color) => {
        expect(color).toMatch(/oklch\([0-9.]+\s+[0-9.]+\s+[0-9.]+\)/)
      })
    })

    test('should generate HEX format when requested', () => {
      const anchors = [
        { value: 'oklch(0.65 0.09 200)', step: 1 },
        { value: 'oklch(0.5 0.08 210)', step: 15 },
      ]

      const scale = generateColorScale(
        anchors,
        testLightnessValues,
        0.6,
        2,
        'HEX',
      )

      expect(scale).toHaveLength(15)
      scale.forEach((color) => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i)
      })
    })

    test('should use exact anchor colors at anchor steps', () => {
      const anchors = [
        { value: 'oklch(0.65 0.09 200)', step: 1 },
        { value: 'oklch(0.5 0.08 210)', step: 8 },
        { value: 'oklch(0.35 0.07 220)', step: 15 },
      ]

      const scale = generateColorScale(
        anchors,
        testLightnessValues,
        0.6,
        2,
        'OKLCH',
      )

      expect(scale).toHaveLength(15)
      // At step 1 (index 0), should use first anchor's hue
      const firstColor = scale[0]
      expect(firstColor).toContain('200')

      // At step 15 (index 14), should use last anchor's hue
      const lastColor = scale[14]
      expect(lastColor).toContain('220')
    })
  })

  describe('Multiple anchors', () => {
    test('should interpolate smoothly between three anchors', () => {
      const anchors = [
        { value: 'oklch(0.7 0.1 0)', step: 1 },
        { value: 'oklch(0.5 0.15 180)', step: 8 },
        { value: 'oklch(0.3 0.1 360)', step: 15 },
      ]

      const scale = generateColorScale(
        anchors,
        testLightnessValues,
        0.6,
        2,
        'OKLCH',
      )

      expect(scale).toHaveLength(15)
      scale.forEach((color) => {
        expect(color).toMatch(/oklch\([0-9.]+\s+[0-9.]+\s+[0-9.]+\)/)
      })

      // Middle step should be influenced by middle anchor
      const middleColor = scale[7]
      expect(middleColor).toMatch(/oklch\([0-9.]+\s+[0-9.]+\s+[0-9.]+\)/)
    })

    test('should handle anchors in unsorted order', () => {
      const anchors = [
        { value: 'oklch(0.3 0.1 360)', step: 15 },
        { value: 'oklch(0.7 0.1 0)', step: 1 },
        { value: 'oklch(0.5 0.15 180)', step: 8 },
      ]

      const scale = generateColorScale(
        anchors,
        testLightnessValues,
        0.6,
        2,
        'OKLCH',
      )

      expect(scale).toHaveLength(15)
      scale.forEach((color) => {
        expect(color).toMatch(/oklch\([0-9.]+\s+[0-9.]+\s+[0-9.]+\)/)
      })
    })
  })

  describe('Edge cases', () => {
    test('should handle single anchor', () => {
      const anchors = [{ value: 'oklch(0.5 0.1 180)', step: 8 }]

      const scale = generateColorScale(
        anchors,
        testLightnessValues,
        0.6,
        2,
        'OKLCH',
      )

      expect(scale).toHaveLength(15)
      // All colors should have same hue since there's only one anchor
      scale.forEach((color) => {
        expect(color).toMatch(/oklch\([0-9.]+\s+[0-9.]+\s+180.0\)/)
      })
    })

    test('should handle anchors at same step', () => {
      const anchors = [
        { value: 'oklch(0.5 0.1 180)', step: 8 },
        { value: 'oklch(0.6 0.12 190)', step: 8 },
      ]

      const scale = generateColorScale(
        anchors,
        testLightnessValues,
        0.6,
        2,
        'OKLCH',
      )

      expect(scale).toHaveLength(15)
      scale.forEach((color) => {
        expect(color).toMatch(/oklch\([0-9.]+\s+[0-9.]+\s+[0-9.]+\)/)
      })
    })

    test('should throw error for empty anchor array', () => {
      expect(() => {
        generateColorScale([], testLightnessValues, 0.6, 2, 'OKLCH')
      }).toThrow('At least one anchor is required')
    })
  })

  describe('Gaussian chroma application', () => {
    test('should apply gaussian function to chroma', () => {
      const anchors = [
        { value: 'oklch(0.5 0.2 180)', step: 1 },
        { value: 'oklch(0.5 0.2 180)', step: 15 },
      ]

      const scale = generateColorScale(
        anchors,
        testLightnessValues,
        0.6,
        2,
        'OKLCH',
      )

      // Extract chroma values
      const chromas = scale.map((color) => {
        const match = color.match(/oklch\([0-9.]+\s+([0-9.]+)/)
        return match ? parseFloat(match[1]) : 0
      })

      // Chroma should vary due to gaussian function
      const uniqueChromas = new Set(chromas)
      expect(uniqueChromas.size).toBeGreaterThan(1)
    })
  })

  describe('Hue interpolation', () => {
    test('should interpolate hue using shorter path', () => {
      const anchors = [
        { value: 'oklch(0.5 0.1 350)', step: 1 },
        { value: 'oklch(0.5 0.1 10)', step: 15 },
      ]

      const scale = generateColorScale(
        anchors,
        testLightnessValues,
        0.6,
        2,
        'OKLCH',
      )

      expect(scale).toHaveLength(15)

      // Extract hues
      const hues = scale.map((color) => {
        const match = color.match(/oklch\([0-9.]+\s+[0-9.]+\s+([0-9.]+)\)/)
        return match ? parseFloat(match[1]) : 0
      })

      // First and last hues should be close to anchor hues
      expect(hues[0]).toBeCloseTo(350, 0)
      expect(hues[14]).toBeCloseTo(10, 0)

      // Middle hue should go through 360/0 (shorter path)
      // rather than going backwards through 180
      const middleHue = hues[7]
      expect(middleHue).toBeGreaterThanOrEqual(340)
    })
  })

  describe('Integration with legacy format', () => {
    test('should work with both string and anchor array inputs', () => {
      const singleColorScale = generateColorScale(
        'oklch(0.5 0.1 180)',
        testLightnessValues,
        0.6,
        2,
        'OKLCH',
      )

      const anchorScale = generateColorScale(
        [{ value: 'oklch(0.5 0.1 180)', step: 8 }],
        testLightnessValues,
        0.6,
        2,
        'OKLCH',
      )

      expect(singleColorScale).toHaveLength(15)
      expect(anchorScale).toHaveLength(15)
      // Both should produce valid OKLCH colors
      singleColorScale.forEach((color) => {
        expect(color).toMatch(/oklch\([0-9.]+\s+[0-9.]+\s+[0-9.]+\)/)
      })
      anchorScale.forEach((color) => {
        expect(color).toMatch(/oklch\([0-9.]+\s+[0-9.]+\s+[0-9.]+\)/)
      })
    })
  })
})
