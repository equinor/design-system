import { renderHook } from '@testing-library/react-hooks'
import { fireEvent } from '@testing-library/react'
import { useGlobalKeyPress } from './useGlobalKeyPress'

describe('useGlobalKeyPress', () => {
  it('Listening for "Enter", should call the callback when pressing Enter', () => {
    const callback = jest.fn()
    renderHook(() => useGlobalKeyPress('Enter', callback))
    fireEvent.keyDown(window.document, {
      key: 'Enter',
    })
    expect(callback).toHaveBeenCalled()
  })

  it('Listening for "Escape", should not call the callback when pressing Enter', () => {
    const callback = jest.fn()
    renderHook(() => useGlobalKeyPress('Escape', callback))
    fireEvent.keyDown(window.document, { key: 'Enter' })
    expect(callback).not.toHaveBeenCalled()
  })
})
