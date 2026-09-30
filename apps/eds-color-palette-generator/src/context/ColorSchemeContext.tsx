'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { localStorageUtils } from '@/utils/localStorage'

type ColorScheme = 'light' | 'dark'

type ColorSchemeContextType = {
  colorScheme: ColorScheme
  setColorScheme: (scheme: ColorScheme) => void
}

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(
  undefined,
)

function applyToDocument(scheme: ColorScheme) {
  document.documentElement.setAttribute('data-color-scheme', scheme)
}

export function ColorSchemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // The server and the first client render both use 'light', so hydration
  // matches. The inline script in layout.tsx has already set the scheme the
  // page should use on <html> (URL, then saved choice, then system), and the
  // effect below adopts it.
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('light')

  useEffect(() => {
    const applied = document.documentElement.getAttribute('data-color-scheme')
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only sync with the scheme the pre-paint script applied
    setColorSchemeState(applied === 'dark' ? 'dark' : 'light')
  }, [])

  useEffect(() => {
    // Follow system changes only while the user has not chosen a scheme.
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      if (localStorageUtils.getColorScheme(null)) return
      const next: ColorScheme = e.matches ? 'dark' : 'light'
      applyToDocument(next)
      setColorSchemeState(next)
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Only an explicit choice is saved. Saving from an effect on every state
  // change used to write the initial 'light' over a saved 'dark' on reload.
  const setColorScheme = useCallback((scheme: ColorScheme) => {
    applyToDocument(scheme)
    localStorageUtils.setColorScheme(scheme)
    setColorSchemeState(scheme)
  }, [])

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, setColorScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  )
}

export function useColorScheme() {
  const context = useContext(ColorSchemeContext)
  if (context === undefined) {
    throw new Error('useColorScheme must be used within a ColorSchemeProvider')
  }
  return context
}
