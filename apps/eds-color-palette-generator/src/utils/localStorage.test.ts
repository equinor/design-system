// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { STORAGE_KEYS, localStorageUtils } from './localStorage'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('localStorageUtils', () => {
  describe('when nothing is stored', () => {
    it('returns the default colour scheme', () => {
      expect(localStorageUtils.getColorScheme(null)).toBeNull()
      expect(localStorageUtils.getColorScheme('light')).toBe('light')
    })

    it('returns the default colour format', () => {
      expect(localStorageUtils.getColorFormat('OKLCH')).toBe('OKLCH')
      expect(localStorageUtils.getColorFormat('HEX')).toBe('HEX')
    })

    it('returns the default density', () => {
      expect(localStorageUtils.getDensity('comfortable')).toBe('comfortable')
      expect(localStorageUtils.getDensity('compact')).toBe('compact')
    })
  })

  describe('round trip', () => {
    it('saves and reads the colour scheme', () => {
      localStorageUtils.setColorScheme('dark')
      expect(localStorageUtils.getColorScheme(null)).toBe('dark')
      localStorageUtils.setColorScheme('light')
      expect(localStorageUtils.getColorScheme(null)).toBe('light')
    })

    it('saves and reads the colour format', () => {
      localStorageUtils.setColorFormat('HEX')
      expect(localStorageUtils.getColorFormat('OKLCH')).toBe('HEX')
    })

    it('saves and reads the density', () => {
      localStorageUtils.setDensity('relaxed')
      expect(localStorageUtils.getDensity('comfortable')).toBe('relaxed')
    })

    it('stores each value as JSON under its own key', () => {
      localStorageUtils.setColorScheme('dark')
      localStorageUtils.setColorFormat('HEX')
      localStorageUtils.setDensity('compact')
      expect(localStorage.getItem(STORAGE_KEYS.COLOR_SCHEME)).toBe('"dark"')
      expect(localStorage.getItem(STORAGE_KEYS.COLOR_FORMAT)).toBe('"HEX"')
      expect(localStorage.getItem(STORAGE_KEYS.DENSITY)).toBe('"compact"')
    })

    it('uses a different key for each setting', () => {
      const keys = Object.values(STORAGE_KEYS)
      expect(new Set(keys).size).toBe(keys.length)
    })
  })

  describe('failures', () => {
    it('falls back to the default when the stored value is not JSON', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      localStorage.setItem(STORAGE_KEYS.COLOR_SCHEME, '{not json')
      localStorage.setItem(STORAGE_KEYS.COLOR_FORMAT, 'HEX')
      localStorage.setItem(STORAGE_KEYS.DENSITY, '"compact')
      expect(localStorageUtils.getColorScheme(null)).toBeNull()
      expect(localStorageUtils.getColorFormat('OKLCH')).toBe('OKLCH')
      expect(localStorageUtils.getDensity('comfortable')).toBe('comfortable')
      expect(warn).toHaveBeenCalledTimes(3)
    })

    it('falls back to the default when the stored value is empty', () => {
      localStorage.setItem(STORAGE_KEYS.DENSITY, '')
      expect(localStorageUtils.getDensity('comfortable')).toBe('comfortable')
    })

    it('falls back to the default when reading throws', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('blocked')
      })
      expect(localStorageUtils.getColorFormat('OKLCH')).toBe('OKLCH')
      expect(warn).toHaveBeenCalledOnce()
    })

    it('does not throw when writing fails', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota exceeded')
      })
      expect(() => localStorageUtils.setDensity('compact')).not.toThrow()
      expect(warn).toHaveBeenCalledOnce()
    })
  })

  describe('without a window', () => {
    it('returns the default and does not write', () => {
      localStorage.setItem(STORAGE_KEYS.DENSITY, '"compact"')
      const setItem = vi.spyOn(Storage.prototype, 'setItem')
      vi.stubGlobal('window', undefined)
      expect(localStorageUtils.getDensity('comfortable')).toBe('comfortable')
      localStorageUtils.setDensity('relaxed')
      expect(setItem).not.toHaveBeenCalled()
    })
  })
})
