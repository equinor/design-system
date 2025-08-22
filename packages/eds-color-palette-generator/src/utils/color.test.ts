import { describe, expect, test } from 'vitest'
import { contrast } from './color'

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

    const result = contrast({ foreground, background, algorithm: 'APCA' })

    expect(result).toBe('0')
  })

  test('should handle empty strings', () => {
    const result = contrast({
      foreground: '',
      background: '#ffffff',
      algorithm: 'APCA',
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

    const result = contrast({ foreground, background, algorithm: 'APCA' })

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
