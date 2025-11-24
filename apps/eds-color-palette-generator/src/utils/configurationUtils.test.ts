import { describe, it, expect } from 'vitest'
import { ColorDefinition } from '@/types'
import { simplifyColorDefinitions } from './configurationUtils'

describe('configurationUtils', () => {
  describe('simplifyColorDefinitions', () => {
    it('should convert single-anchor color to value format', () => {
      const colors: ColorDefinition[] = [
        {
          name: 'Single Color',
          anchors: [{ value: '#0084C4', step: 8 }],
        },
      ]

      const simplified = simplifyColorDefinitions(colors)

      expect(simplified[0]).toEqual({
        name: 'Single Color',
        value: '#0084C4',
      })
      expect(simplified[0]).not.toHaveProperty('anchors')
    })

    it('should keep multi-anchor colors as anchors format', () => {
      const colors: ColorDefinition[] = [
        {
          name: 'Gradient Color',
          anchors: [
            { value: '#003840', step: 1 },
            { value: '#00B8C8', step: 15 },
          ],
        },
      ]

      const simplified = simplifyColorDefinitions(colors)

      expect(simplified[0]).toEqual({
        name: 'Gradient Color',
        anchors: [
          { value: '#003840', step: 1 },
          { value: '#00B8C8', step: 15 },
        ],
      })
    })

    it('should keep legacy value format unchanged', () => {
      const colors: ColorDefinition[] = [
        {
          name: 'Legacy Color',
          value: '#FF0000',
        },
      ]

      const simplified = simplifyColorDefinitions(colors)

      expect(simplified[0]).toEqual({
        name: 'Legacy Color',
        value: '#FF0000',
      })
    })

    it('should handle mixed color definitions correctly', () => {
      const colors: ColorDefinition[] = [
        {
          name: 'Legacy',
          value: '#FF0000',
        },
        {
          name: 'Single Anchor',
          anchors: [{ value: '#00FF00', step: 5 }],
        },
        {
          name: 'Multi Anchor',
          anchors: [
            { value: '#0000FF', step: 1 },
            { value: '#00FFFF', step: 15 },
          ],
        },
      ]

      const simplified = simplifyColorDefinitions(colors)

      // Legacy stays as value
      expect(simplified[0]).toEqual({
        name: 'Legacy',
        value: '#FF0000',
      })

      // Single anchor becomes value
      expect(simplified[1]).toEqual({
        name: 'Single Anchor',
        value: '#00FF00',
      })
      expect(simplified[1]).not.toHaveProperty('anchors')

      // Multi anchor stays as anchors
      expect(simplified[2]).toEqual({
        name: 'Multi Anchor',
        anchors: [
          { value: '#0000FF', step: 1 },
          { value: '#00FFFF', step: 15 },
        ],
      })
    })

    it('should preserve color name when simplifying', () => {
      const colors: ColorDefinition[] = [
        {
          name: 'My Special Color',
          anchors: [{ value: 'oklch(0.5 0.1 180)', step: 10 }],
        },
      ]

      const simplified = simplifyColorDefinitions(colors)

      expect(simplified[0].name).toBe('My Special Color')
      expect(simplified[0].value).toBe('oklch(0.5 0.1 180)')
    })
  })
})
