import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  type MockInstance,
} from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDeprecationWarning } from './useDeprecationWarning'

describe('useDeprecationWarning', () => {
  let consoleWarnSpy: MockInstance
  const originalEnv = process.env.NODE_ENV

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleWarnSpy.mockRestore()
    process.env.NODE_ENV = originalEnv
  })

  it('should display warning in development mode', () => {
    process.env.NODE_ENV = 'development'
    const message = 'This component is deprecated'

    renderHook(() => useDeprecationWarning(message))

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[EDS] This component is deprecated',
    )
  })

  it('should display warning with component name prefix', () => {
    process.env.NODE_ENV = 'development'
    const message = 'This component is deprecated'
    const componentName = 'MyComponent'

    renderHook(() => useDeprecationWarning(message, componentName))

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[EDS MyComponent] This component is deprecated',
    )
  })

  it('should only warn once per component instance', () => {
    process.env.NODE_ENV = 'development'
    const message = 'This component is deprecated'

    const { rerender } = renderHook(() => useDeprecationWarning(message))

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1)

    rerender()
    rerender()
    rerender()

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
  })

  it('should not display warning in production mode', () => {
    process.env.NODE_ENV = 'production'
    const message = 'This component is deprecated'

    renderHook(() => useDeprecationWarning(message))

    expect(consoleWarnSpy).not.toHaveBeenCalled()
  })

  it('should not display warning in test mode', () => {
    process.env.NODE_ENV = 'test'
    const message = 'This component is deprecated'

    renderHook(() => useDeprecationWarning(message))

    expect(consoleWarnSpy).not.toHaveBeenCalled()
  })

  it('should handle undefined NODE_ENV gracefully', () => {
    const originalNodeEnv = process.env.NODE_ENV
    delete process.env.NODE_ENV

    const message = 'This component is deprecated'

    expect(() => {
      renderHook(() => useDeprecationWarning(message))
    }).not.toThrow()

    expect(consoleWarnSpy).not.toHaveBeenCalled()

    process.env.NODE_ENV = originalNodeEnv
  })

  it('should handle different message content', () => {
    process.env.NODE_ENV = 'development'
    const message =
      'Component is deprecated. Please use NewComponent instead. See docs at https://example.com'

    renderHook(() => useDeprecationWarning(message, 'OldComponent'))

    expect(consoleWarnSpy).toHaveBeenCalledWith(`[EDS OldComponent] ${message}`)
  })

  it('should warn separately for different component instances', () => {
    process.env.NODE_ENV = 'development'
    const message = 'This component is deprecated'

    const { unmount: unmount1 } = renderHook(() =>
      useDeprecationWarning(message),
    )
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1)

    const { unmount: unmount2 } = renderHook(() =>
      useDeprecationWarning(message),
    )
    expect(consoleWarnSpy).toHaveBeenCalledTimes(2)

    unmount1()
    unmount2()
  })
})
