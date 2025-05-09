'use client'

import { createContext, useContext, useEffect, useState } from 'react'

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
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light')

  useEffect(() => {
    // Check system preference on mount
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setColorScheme(mediaQuery.matches ? 'dark' : 'light')

    // Listen for system changes
    const handler = (e: MediaQueryListEvent) => {
      setColorScheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    // Update document class when color scheme changes
    document.documentElement.classList.toggle('dark', colorScheme === 'dark')
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
