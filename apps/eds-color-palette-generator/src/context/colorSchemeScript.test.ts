// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { STORAGE_KEYS } from '@/utils/localStorage'
import { COLOR_SCHEME_SCRIPT } from './colorSchemeScript'

let systemDark = false

beforeEach(() => {
  systemDark = false
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: systemDark })),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
  window.history.replaceState(null, '', '/')
  document.documentElement.removeAttribute('data-color-scheme')
})

/** Runs the pre-paint script as the <head> does and returns the scheme it set. */
function runScript() {
  new Function(COLOR_SCHEME_SCRIPT)()
  return document.documentElement.getAttribute('data-color-scheme')
}

const save = (value: string) =>
  localStorage.setItem(STORAGE_KEYS.COLOR_SCHEME, JSON.stringify(value))

describe('COLOR_SCHEME_SCRIPT', () => {
  it('uses the system preference when nothing else is set', () => {
    expect(runScript()).toBe('light')

    systemDark = true
    expect(runScript()).toBe('dark')
  })

  it('prefers a saved choice over the system preference', () => {
    systemDark = true
    save('light')

    expect(runScript()).toBe('light')
  })

  it('prefers ?mode= in the URL over a saved choice', () => {
    save('light')
    window.history.replaceState(null, '', '/?mode=dark')

    expect(runScript()).toBe('dark')
  })

  it('ignores an unknown ?mode= and an unknown saved value', () => {
    window.history.replaceState(null, '', '/?mode=sepia')
    save('sepia')
    systemDark = true

    expect(runScript()).toBe('dark')
  })

  it('leaves <html> as it was when the saved value cannot be read', () => {
    document.documentElement.setAttribute('data-color-scheme', 'light')
    localStorage.setItem(STORAGE_KEYS.COLOR_SCHEME, 'not json')
    systemDark = true

    expect(runScript()).toBe('light')
  })
})
