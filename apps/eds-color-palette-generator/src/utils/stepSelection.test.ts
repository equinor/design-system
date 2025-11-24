import { describe, expect, it } from 'vitest'
import { findAvailableStep } from './stepSelection'

describe('findAvailableStep', () => {
  it('should return preferred step 8 when no steps are used', () => {
    const usedSteps: number[] = []
    const result = findAvailableStep(usedSteps)
    expect(result).toBe(8)
  })

  it('should return preferred step when it is available', () => {
    const usedSteps = [1, 2, 3, 4, 5, 6, 7, 9, 10]
    const result = findAvailableStep(usedSteps, 8)
    expect(result).toBe(8)
  })

  it('should return first available step when preferred step is taken', () => {
    const usedSteps = [8, 9, 10, 11, 12, 13, 14, 15]
    const result = findAvailableStep(usedSteps, 8)
    expect(result).toBe(1)
  })

  it('should return next available step when searching from step 1', () => {
    const usedSteps = [1, 2, 3]
    const result = findAvailableStep(usedSteps, 8)
    expect(result).toBe(8)
  })

  it('should skip used steps and find the first available one', () => {
    const usedSteps = [1, 2, 3, 4, 5, 6, 7, 8]
    const result = findAvailableStep(usedSteps, 8)
    expect(result).toBe(9)
  })

  it('should work with custom preferred step', () => {
    const usedSteps = [1, 2, 3]
    const result = findAvailableStep(usedSteps, 5)
    expect(result).toBe(5)
  })

  it('should fall back to searching from 1 when custom preferred step is taken', () => {
    const usedSteps = [5, 6, 7, 8, 9, 10]
    const result = findAvailableStep(usedSteps, 5)
    expect(result).toBe(1)
  })

  it('should handle edge case when all steps except one are used', () => {
    const usedSteps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    const result = findAvailableStep(usedSteps, 8)
    expect(result).toBe(15)
  })

  it('should handle edge case with step 1 as preferred', () => {
    const usedSteps = [2, 3, 4, 5]
    const result = findAvailableStep(usedSteps, 1)
    expect(result).toBe(1)
  })

  it('should handle edge case with step 15 as preferred', () => {
    const usedSteps = [1, 2, 3, 4]
    const result = findAvailableStep(usedSteps, 15)
    expect(result).toBe(15)
  })

  it('should return preferred step as fallback when all steps are used', () => {
    const usedSteps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    const result = findAvailableStep(usedSteps, 8)
    // This edge case should not happen in practice as the UI prevents adding more than 15 anchors
    expect(result).toBe(8)
  })

  it('should clamp preferredStep to valid range when given invalid value', () => {
    const usedSteps: number[] = []
    // Test with negative number - should clamp to 1
    const resultNegative = findAvailableStep(usedSteps, -5)
    expect(resultNegative).toBe(1)

    // Test with value above 15 - should clamp to 15
    const resultHigh = findAvailableStep(usedSteps, 20)
    expect(resultHigh).toBe(15)

    // Test with 0 - should clamp to 1
    const resultZero = findAvailableStep(usedSteps, 0)
    expect(resultZero).toBe(1)
  })

  it('should clamp invalid preferredStep and still find available step', () => {
    const usedSteps = [1, 2, 3] // Steps 1, 2, 3 are used
    // Test with negative number - should clamp to 1, but 1 is used, so should find next available (4)
    const resultNegative = findAvailableStep(usedSteps, -5)
    expect(resultNegative).toBe(4)

    // Test with value above 15 when 15 is used
    const usedSteps2 = [15]
    const resultHigh = findAvailableStep(usedSteps2, 20)
    expect(resultHigh).toBe(1) // Should find first available
  })
})
