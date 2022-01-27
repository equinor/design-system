import { renderHook } from '@testing-library/react-hooks'
import { useToken } from './useToken'
import type { ComponentToken } from '@equinor/eds-tokens'

const mockToken: ComponentToken = {
  minHeight: '40px',
  minWidth: '200px',
  spacings: {
    top: '6px',
  },
  modes: {
    compact: {
      minHeight: '20px',
      spacings: {
        top: '2px',
      },
    },
  },
}

const mockFailToken: ComponentToken = {
  minHeight: '40px',
  minWidth: '200px',
  spacings: {
    top: '6px',
  },
}

describe('useToken', () => {
  it('should return compact values when density is "compact"', () => {
    const { result } = renderHook(() =>
      useToken({ density: 'compact' }, mockToken),
    )
    const {
      minHeight,
      minWidth,
      spacings: { top },
    } = result.current()
    expect(minHeight).toBe('20px')
    expect(top).toBe('2px')
    expect(minWidth).toBe('200px')
  })

  it('should return comfortable values when density is "comfortable"', () => {
    const { result } = renderHook(() =>
      useToken({ density: 'comfortable' }, mockToken),
    )
    const {
      minHeight,
      minWidth,
      spacings: { top },
    } = result.current()
    expect(minHeight).toBe('40px')
    expect(top).toBe('6px')
    expect(minWidth).toBe('200px')
  })

  it('should not fail if density is "comfortable" and modes is not defined in token', () => {
    const { result } = renderHook(() =>
      useToken({ density: 'comfortable' }, mockFailToken),
    )
    const {
      minHeight,
      minWidth,
      spacings: { top },
    } = result.current()
    expect(minHeight).toBe('40px')
    expect(top).toBe('6px')
    expect(minWidth).toBe('200px')
  })
  it('should throw error if density is "compact" and modes is not defined in token', () => {
    const { result } = renderHook(() =>
      useToken({ density: 'compact' }, mockFailToken),
    )

    expect(result.current).toThrow(TypeError)
  })
})
