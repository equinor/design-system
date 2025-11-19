import { describe, it, expect } from 'vitest'
import { arraysEqual, colorsEqual } from './compare'
import { ColorDefinition } from '@/types'

describe('arraysEqual', () => {
  it('should return true for equal arrays', () => {
    expect(arraysEqual([1, 2, 3], [1, 2, 3])).toBe(true)
  })

  it('should return false for arrays with different lengths', () => {
    expect(arraysEqual([1, 2], [1, 2, 3])).toBe(false)
  })

  it('should return false for arrays with different values', () => {
    expect(arraysEqual([1, 2, 3], [1, 2, 4])).toBe(false)
  })

  it('should return true for empty arrays', () => {
    expect(arraysEqual([], [])).toBe(true)
  })
})

describe('colorsEqual', () => {
  describe('basic properties', () => {
    it('should return true for equal colors with single values', () => {
      const a: ColorDefinition[] = [
        { name: 'Red', value: '#ff0000' },
        { name: 'Blue', value: '#0000ff' },
      ]
      const b: ColorDefinition[] = [
        { name: 'Red', value: '#ff0000' },
        { name: 'Blue', value: '#0000ff' },
      ]
      expect(colorsEqual(a, b)).toBe(true)
    })

    it('should return false for arrays with different lengths', () => {
      const a: ColorDefinition[] = [{ name: 'Red', value: '#ff0000' }]
      const b: ColorDefinition[] = [
        { name: 'Red', value: '#ff0000' },
        { name: 'Blue', value: '#0000ff' },
      ]
      expect(colorsEqual(a, b)).toBe(false)
    })

    it('should return false for colors with different names', () => {
      const a: ColorDefinition[] = [{ name: 'Red', value: '#ff0000' }]
      const b: ColorDefinition[] = [{ name: 'Green', value: '#ff0000' }]
      expect(colorsEqual(a, b)).toBe(false)
    })

    it('should return false for colors with different values', () => {
      const a: ColorDefinition[] = [{ name: 'Red', value: '#ff0000' }]
      const b: ColorDefinition[] = [{ name: 'Red', value: '#00ff00' }]
      expect(colorsEqual(a, b)).toBe(false)
    })
  })

  describe('anchor properties', () => {
    it('should return true for equal colors with identical anchors', () => {
      const a: ColorDefinition[] = [
        {
          name: 'Red',
          anchors: [
            { step: 1, value: '#ff0000' },
            { step: 15, value: '#880000' },
          ],
        },
      ]
      const b: ColorDefinition[] = [
        {
          name: 'Red',
          anchors: [
            { step: 1, value: '#ff0000' },
            { step: 15, value: '#880000' },
          ],
        },
      ]
      expect(colorsEqual(a, b)).toBe(true)
    })

    it('should return false when one has anchors and the other has a value', () => {
      const a: ColorDefinition[] = [
        {
          name: 'Red',
          value: '#ff0000',
        },
      ]
      const b: ColorDefinition[] = [
        {
          name: 'Red',
          anchors: [{ step: 1, value: '#ff0000' }],
        },
      ]
      expect(colorsEqual(a, b)).toBe(false)
    })

    it('should return false when anchors have different lengths', () => {
      const a: ColorDefinition[] = [
        {
          name: 'Red',
          anchors: [{ step: 1, value: '#ff0000' }],
        },
      ]
      const b: ColorDefinition[] = [
        {
          name: 'Red',
          anchors: [
            { step: 1, value: '#ff0000' },
            { step: 15, value: '#880000' },
          ],
        },
      ]
      expect(colorsEqual(a, b)).toBe(false)
    })

    it('should return false when anchor steps differ', () => {
      const a: ColorDefinition[] = [
        {
          name: 'Red',
          anchors: [
            { step: 1, value: '#ff0000' },
            { step: 15, value: '#880000' },
          ],
        },
      ]
      const b: ColorDefinition[] = [
        {
          name: 'Red',
          anchors: [
            { step: 1, value: '#ff0000' },
            { step: 10, value: '#880000' },
          ],
        },
      ]
      expect(colorsEqual(a, b)).toBe(false)
    })

    it('should return false when anchor values differ', () => {
      const a: ColorDefinition[] = [
        {
          name: 'Red',
          anchors: [
            { step: 1, value: '#ff0000' },
            { step: 15, value: '#880000' },
          ],
        },
      ]
      const b: ColorDefinition[] = [
        {
          name: 'Red',
          anchors: [
            { step: 1, value: '#ff0000' },
            { step: 15, value: '#990000' },
          ],
        },
      ]
      expect(colorsEqual(a, b)).toBe(false)
    })

    it('should return true when both colors have no anchors (undefined)', () => {
      const a: ColorDefinition[] = [
        {
          name: 'Red',
          value: '#ff0000',
        },
      ]
      const b: ColorDefinition[] = [
        {
          name: 'Red',
          value: '#ff0000',
        },
      ]
      expect(colorsEqual(a, b)).toBe(true)
    })

    it('should handle mixed colors (some with anchors, some without)', () => {
      const a: ColorDefinition[] = [
        { name: 'Red', value: '#ff0000' },
        {
          name: 'Blue',
          anchors: [
            { step: 1, value: '#0000ff' },
            { step: 15, value: '#000088' },
          ],
        },
      ]
      const b: ColorDefinition[] = [
        { name: 'Red', value: '#ff0000' },
        {
          name: 'Blue',
          anchors: [
            { step: 1, value: '#0000ff' },
            { step: 15, value: '#000088' },
          ],
        },
      ]
      expect(colorsEqual(a, b)).toBe(true)
    })

    it('should return false when mixed colors differ in anchor structure', () => {
      const a: ColorDefinition[] = [
        { name: 'Red', value: '#ff0000' },
        {
          name: 'Blue',
          anchors: [
            { step: 1, value: '#0000ff' },
            { step: 15, value: '#000088' },
          ],
        },
      ]
      const b: ColorDefinition[] = [
        {
          name: 'Red',
          anchors: [{ step: 1, value: '#ff0000' }],
        },
        { name: 'Blue', value: '#0000ff' },
      ]
      expect(colorsEqual(a, b)).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should return true for empty arrays', () => {
      expect(colorsEqual([], [])).toBe(true)
    })

    it('should handle colors with empty anchor arrays', () => {
      const a: ColorDefinition[] = [
        {
          name: 'Red',
          anchors: [],
        },
      ]
      const b: ColorDefinition[] = [
        {
          name: 'Red',
          anchors: [],
        },
      ]
      expect(colorsEqual(a, b)).toBe(true)
    })
  })
})
