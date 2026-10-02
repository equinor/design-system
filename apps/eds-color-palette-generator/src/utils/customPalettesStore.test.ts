// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { refreshCustomPalettes, useCustomPalettes } from './customPalettesStore'
import { setSimulationPalettes, type TokenPalette } from './palette'

const custom: TokenPalette[] = [{ name: 'Custom', steps: ['#111111'] }]
const other: TokenPalette[] = [{ name: 'Other', steps: ['#222222'] }]

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useCustomPalettes', () => {
  it('returns an empty list when nothing is stored', () => {
    const { result } = renderHook(() => useCustomPalettes())
    expect(result.current).toEqual([])
  })

  it('returns the palettes saved by the Palette Editor', () => {
    setSimulationPalettes(custom)
    const { result } = renderHook(() => useCustomPalettes())
    expect(result.current).toEqual(custom)
  })

  it('reads the stored palettes again on refresh', () => {
    setSimulationPalettes(custom)
    const { result } = renderHook(() => useCustomPalettes())
    setSimulationPalettes(other)
    act(() => refreshCustomPalettes())
    expect(result.current).toEqual(other)
  })

  it('keeps the same list when the stored palettes have not changed', () => {
    setSimulationPalettes(custom)
    const { result, rerender } = renderHook(() => useCustomPalettes())
    const first = result.current
    act(() => refreshCustomPalettes())
    rerender()
    expect(result.current).toBe(first)
  })

  it('shares one list between components', () => {
    setSimulationPalettes(custom)
    const a = renderHook(() => useCustomPalettes())
    const b = renderHook(() => useCustomPalettes())
    expect(a.result.current).toBe(b.result.current)
  })

  it('stops listening for refreshes after unmount', () => {
    const add = vi.spyOn(window, 'addEventListener')
    const remove = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useCustomPalettes())
    const [event, listener] = add.mock.calls[add.mock.calls.length - 1]
    unmount()
    expect(remove).toHaveBeenCalledWith(event, listener)
    expect(() => refreshCustomPalettes()).not.toThrow()
  })
})
