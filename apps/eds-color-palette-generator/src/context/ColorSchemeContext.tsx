'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { localStorageUtils } from '@/utils/localStorage'

type ColorScheme = 'light' | 'dark'

type ColorSchemeContextType = {
  colorScheme: ColorScheme
  setColorScheme: (scheme: ColorScheme) => void
}

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(
  undefined,
)

export function ColorSchemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Always initialise to 'light' so the server-rendered HTML and the first
  // client render agree — reading localStorage/system preference in the
  // useState initializer runs only on the client and causes a hydration
  // mismatch (server 'light' vs client 'dark'), which can throw a hydration
  // error and leave the page in a broken state. The saved / system preference
  // is applied on mount in the effect below instead.
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light')

  useEffect(() => {
    // Apply the saved preference, or fall back to the system preference. This
    // runs once on the client after hydration, so the first render still
    // matches the server ('light') and there is no hydration mismatch.
    const savedScheme = localStorageUtils.getColorScheme('light')
    const next: ColorScheme = savedScheme
      ? savedScheme
      : window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional client-only preference sync on mount; server renders 'light' to avoid a hydration mismatch
    setColorScheme(next)
  }, [])

  useEffect(() => {
    // Listen for system changes (but don't override saved preference automatically)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      // Only update if no preference is saved
      const currentSaved = localStorageUtils.getColorScheme('light')
      if (!currentSaved) {
        setColorScheme(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    // Update document class when color scheme changes
    document.documentElement.setAttribute('data-color-scheme', colorScheme)
    // Save to localStorage
    localStorageUtils.setColorScheme(colorScheme)
  }, [colorScheme])

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
