import { describe, it, expect } from 'vitest'
import { ColorDefinition, ColorAnchor } from './types'

describe('ColorDefinition type', () => {
  it('should accept a color with a value', () => {
    const colorWithValue: ColorDefinition = {
      name: 'Red',
      value: '#ff0000',
    }
    expect(colorWithValue.name).toBe('Red')
    expect('value' in colorWithValue).toBe(true)
  })

  it('should accept a color with anchors', () => {
    const anchors: ColorAnchor[] = [
      { value: '#ff0000', step: 1 },
      { value: '#880000', step: 15 },
    ]
    const colorWithAnchors: ColorDefinition = {
      name: 'Red',
      anchors,
    }
    expect(colorWithAnchors.name).toBe('Red')
    expect('anchors' in colorWithAnchors).toBe(true)
  })

  it('should correctly discriminate between value and anchors', () => {
    const colors: ColorDefinition[] = [
      { name: 'Red', value: '#ff0000' },
      {
        name: 'Blue',
        anchors: [
          { value: '#0000ff', step: 1 },
          { value: '#000088', step: 15 },
        ],
      },
    ]

    const redColor = colors[0]
    if ('value' in redColor) {
      expect(redColor.value).toBe('#ff0000')
      // TypeScript should not allow accessing anchors here
      // @ts-expect-error - anchors should not exist on value variant
      expect(redColor.anchors).toBeUndefined()
    }

    const blueColor = colors[1]
    if ('anchors' in blueColor) {
      expect(blueColor.anchors).toHaveLength(2)
      // TypeScript should not allow accessing value here
      // @ts-expect-error - value should not exist on anchors variant
      expect(blueColor.value).toBeUndefined()
    }
  })

  it('should work with type guards', () => {
    const processColor = (color: ColorDefinition): string => {
      if ('value' in color) {
        // TypeScript knows color has value property
        return color.value
      } else {
        // TypeScript knows color has anchors property
        return color.anchors.map((a) => a.value).join(',')
      }
    }

    const valueColor: ColorDefinition = { name: 'Test', value: '#000000' }
    expect(processColor(valueColor)).toBe('#000000')

    const anchorColor: ColorDefinition = {
      name: 'Test',
      anchors: [
        { value: '#ff0000', step: 1 },
        { value: '#00ff00', step: 15 },
      ],
    }
    expect(processColor(anchorColor)).toBe('#ff0000,#00ff00')
  })
})
