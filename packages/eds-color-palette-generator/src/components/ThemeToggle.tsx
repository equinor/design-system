'use client'

import { useColorScheme } from '@/context/ColorSchemeContext'

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme()

  return (
    <button
      onClick={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
      className="p-2 transition-colors rounded-lg dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm"
      title={
        colorScheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
      }
    >
      {colorScheme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
