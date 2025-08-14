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
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light')

  useEffect(() => {
    // Check for saved preference first, then system preference
    const savedScheme = localStorageUtils.getColorScheme('light')
    if (savedScheme) {
      setColorScheme(savedScheme)
    } else {
      // Check system preference on mount if no saved preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      setColorScheme(mediaQuery.matches ? 'dark' : 'light')
    }

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
    document.documentElement.classList.toggle('dark', colorScheme === 'dark')
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
