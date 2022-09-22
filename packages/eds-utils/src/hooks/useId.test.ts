import { renderHook } from '@testing-library/react'
import { useId } from './useId'

describe('useId', () => {
  it('should return override if override param is provided', () => {
    const { result } = renderHook(() => useId('test'))
    expect(result.current).toBe('test')
  })
  it('should return generated id in the format "eds-[XXXXX]" when override is NULL', () => {
    const { result } = renderHook(() => useId(null))
    expect(result.current).toMatch(/eds-[0-9]{1,5}/)
  })
  it('should return generated id in the format "eds-[type]-[XXXXX]" when override is NULL and type param is included', () => {
    const { result } = renderHook(() => useId(null, 'test'))
    expect(result.current).toMatch(/eds-test-[0-9]{1,5}/)
  })
})
