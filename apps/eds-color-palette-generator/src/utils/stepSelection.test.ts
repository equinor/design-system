import { describe, expect, it } from 'vitest'
import { findAvailableStep } from './stepSelection'

describe('findAvailableStep', () => {
  it('returns the middle step by default when no steps are used', () => {
    expect(findAvailableStep([], 15)).toBe(8)
  })

  it('returns preferred step when available', () => {
    expect(findAvailableStep([1, 2, 3, 4, 5, 6, 7, 9, 10], 15, 8)).toBe(8)
    expect(findAvailableStep([1, 2, 3], 15, 5)).toBe(5)
  })

  it('finds first available step when preferred is taken', () => {
    expect(findAvailableStep([8, 9, 10, 11, 12, 13, 14, 15], 15, 8)).toBe(1)
    expect(findAvailableStep([1, 2, 3, 4, 5, 6, 7, 8], 15, 8)).toBe(9)
  })

  it('finds the only remaining step when 14 are used', () => {
    const usedSteps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    expect(findAvailableStep(usedSteps, 15, 8)).toBe(15)
  })

  it('returns preferred step as fallback when all steps are used', () => {
    const allUsed = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    expect(findAvailableStep(allUsed, 15, 8)).toBe(8)
  })

  it('clamps invalid preferredStep values to the scale range', () => {
    expect(findAvailableStep([], 15, -5)).toBe(1)
    expect(findAvailableStep([], 15, 0)).toBe(1)
    expect(findAvailableStep([], 15, 20)).toBe(15)
  })

  it('clamps and searches when clamped value is used', () => {
    expect(findAvailableStep([1, 2, 3], 15, -5)).toBe(4)
    expect(findAvailableStep([15], 15, 20)).toBe(1)
  })

  it('respects an extended scale larger than 15', () => {
    expect(findAvailableStep([], 20)).toBe(10) // middle of 20
    const used = Array.from({ length: 17 }, (_, i) => i + 1) // 1..17 used
    expect(findAvailableStep(used, 20)).toBe(18)
  })

  it('respects a scale smaller than 15', () => {
    expect(findAvailableStep([], 5)).toBe(3) // middle of 5
    expect(findAvailableStep([3], 5)).toBe(1)
  })
})
