'use client'

import { useColorScheme } from '@/context/ColorSchemeContext'

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme()

  return (
    <button
      onClick={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
      className="p-2 transition-colors rounded-lg border border-neutral-subtle hover:bg-neutral-medium-hover text-sm"
      title={
        colorScheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
      }
    >
      {colorScheme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
