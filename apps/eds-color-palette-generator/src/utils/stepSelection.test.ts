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
})
