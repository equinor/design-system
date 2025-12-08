import { describe, expect, it } from 'vitest'
import { findAvailableStep } from './stepSelection'

describe('findAvailableStep', () => {
  it('returns default preferred step 8 when no steps are used', () => {
    expect(findAvailableStep([])).toBe(8)
  })

  it('returns preferred step when available', () => {
    expect(findAvailableStep([1, 2, 3, 4, 5, 6, 7, 9, 10], 8)).toBe(8)
    expect(findAvailableStep([1, 2, 3], 5)).toBe(5)
  })

  it('finds first available step when preferred is taken', () => {
    expect(findAvailableStep([8, 9, 10, 11, 12, 13, 14, 15], 8)).toBe(1)
    expect(findAvailableStep([1, 2, 3, 4, 5, 6, 7, 8], 8)).toBe(9)
  })

  it('finds the only remaining step when 14 are used', () => {
    const usedSteps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    expect(findAvailableStep(usedSteps, 8)).toBe(15)
  })

  it('returns preferred step as fallback when all steps are used', () => {
    const allUsed = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    expect(findAvailableStep(allUsed, 8)).toBe(8)
  })

  it('clamps invalid preferredStep values to valid range', () => {
    expect(findAvailableStep([], -5)).toBe(1)
    expect(findAvailableStep([], 0)).toBe(1)
    expect(findAvailableStep([], 20)).toBe(15)
  })

  it('clamps and searches when clamped value is used', () => {
    expect(findAvailableStep([1, 2, 3], -5)).toBe(4)
    expect(findAvailableStep([15], 20)).toBe(1)
  })
})
