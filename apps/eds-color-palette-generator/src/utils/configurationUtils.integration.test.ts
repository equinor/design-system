import { describe, it, expect } from 'vitest'
import { simplifyColorDefinitions } from './configurationUtils'
import { ColorDefinition } from '@/types'

describe('Integration: Export Configuration Simplification', () => {
  it('should export single-color configurations in legacy value format', () => {
    // Simulate user creating a color with one value in the UI
    const colors: ColorDefinition[] = [
      {
        name: 'Brand Blue',
        anchors: [{ value: '#0084C4', step: 8 }],
      },
      {
        name: 'Brand Green',
        anchors: [{ value: '#007079', step: 8 }],
      },
    ]

    const simplified = simplifyColorDefinitions(colors)

    // Should be exported as simple value format for better readability
    expect(simplified).toEqual([
      { name: 'Brand Blue', value: '#0084C4' },
      { name: 'Brand Green', value: '#007079' },
    ])
  })

  it('should preserve multi-anchor configurations for gradients', () => {
    const colors: ColorDefinition[] = [
      {
        name: 'Gradient Blue',
        anchors: [
          { value: '#003366', step: 1 },
          { value: '#0099FF', step: 15 },
        ],
      },
    ]

    const simplified = simplifyColorDefinitions(colors)

    // Multi-anchor should stay as is
    expect(simplified).toEqual(colors)
  })

  it('should handle real-world mixed scenario from UI', () => {
    // User has:
    // - Some simple colors (single anchor)
    // - Some gradient colors (multiple anchors)
    // - Maybe some legacy colors (value)
    const colors: ColorDefinition[] = [
      // Legacy color (already in value format)
      { name: 'Old Blue', value: '#0000FF' },
      // Simple new color (single anchor)
      { name: 'New Red', anchors: [{ value: '#FF0000', step: 8 }] },
      // Gradient color (multiple anchors)
      {
        name: 'Gradient Teal',
        anchors: [
          { value: '#004D57', step: 1 },
          { value: '#00D4E4', step: 15 },
        ],
      },
      // Another simple color
      { name: 'New Yellow', anchors: [{ value: '#FFFF00', step: 7 }] },
    ]

    const simplified = simplifyColorDefinitions(colors)

    expect(simplified).toEqual([
      // Legacy stays as is
      { name: 'Old Blue', value: '#0000FF' },
      // Single anchor becomes value
      { name: 'New Red', value: '#FF0000' },
      // Multi-anchor stays as anchors
      {
        name: 'Gradient Teal',
        anchors: [
          { value: '#004D57', step: 1 },
          { value: '#00D4E4', step: 15 },
        ],
      },
      // Single anchor becomes value
      { name: 'New Yellow', value: '#FFFF00' },
    ])
  })

  it('should make exported configs more readable for single colors', () => {
    const singleAnchor: ColorDefinition[] = [
      { name: 'Color', anchors: [{ value: '#123456', step: 5 }] },
    ]

    const simplified = simplifyColorDefinitions(singleAnchor)

    // Simpler to read in exported JSON:
    // { "name": "Color", "value": "#123456" }
    // vs
    // { "name": "Color", "anchors": [{ "value": "#123456", "step": 5 }] }
    expect(JSON.stringify(simplified[0]).length).toBeLessThan(
      JSON.stringify(singleAnchor[0]).length,
    )
  })

  it('should maintain backward compatibility with CLI', () => {
    // Both formats should work with CLI
    const legacyFormat: ColorDefinition[] = [
      { name: 'Color1', value: '#FF0000' },
    ]

    const newSingleFormat: ColorDefinition[] = [
      { name: 'Color2', anchors: [{ value: '#00FF00', step: 8 }] },
    ]

    // After simplification, single anchor becomes legacy format
    const simplified = simplifyColorDefinitions(newSingleFormat)

    // Should have same structure as legacy format
    expect(simplified[0]).toHaveProperty('value')
    expect(simplified[0]).not.toHaveProperty('anchors')
    expect(typeof simplified[0].value).toBe('string')
  })
})
