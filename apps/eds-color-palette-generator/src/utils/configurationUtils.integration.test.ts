import { describe, it, expect } from 'vitest'
import { simplifyColorDefinitions } from './configurationUtils'
import { ColorDefinition } from '@/types'

describe('Integration: Export Configuration Simplification', () => {
  it('should simplify single-anchor arrays to value format for export', () => {
    // Edge case: If somehow a color ends up with a single anchor
    // (e.g., user removes one anchor leaving only one)
    // we simplify it to value format for better readability in exported config
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

  it('should maintain backward compatibility with CLI', () => {
    // The CLI can receive configs with both formats
    const valueFormat: ColorDefinition[] = [
      { name: 'Simple Color', value: '#FF0000' },
    ]
    const multiAnchorFormat: ColorDefinition[] = [
      {
        name: 'Gradient Color',
        anchors: [
          { value: '#0000FF', step: 1 },
          { value: '#00FFFF', step: 15 },
        ],
      },
    ]

    // Value format stays unchanged
    const simplifiedValue = simplifyColorDefinitions(valueFormat)
    expect(simplifiedValue[0]).toEqual({
      name: 'Simple Color',
      value: '#FF0000',
    })

    // Multi-anchor stays as anchors
    const simplifiedAnchors = simplifyColorDefinitions(multiAnchorFormat)
    expect(simplifiedAnchors[0]).toHaveProperty('anchors')
    expect('anchors' in simplifiedAnchors[0]).toBe(true)
    if ('anchors' in simplifiedAnchors[0]) {
      expect(simplifiedAnchors[0].anchors).toHaveLength(2)
    }
  })
})
