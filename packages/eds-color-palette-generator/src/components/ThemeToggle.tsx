'use client'

import { useCallback } from 'react'
import { useColorScheme } from '@/context/ColorSchemeContext'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme()

  const selectLight = useCallback(
    () => setColorScheme('light'),
    [setColorScheme],
  )
  const selectDark = useCallback(() => setColorScheme('dark'), [setColorScheme])

  const isLight = colorScheme === 'light'

  return (
    <div
      role="tablist"
      aria-label="Theme"
      className="inline-flex rounded-lg bg-neutral-medium-default/40  border-neutral-subtle"
    >
      <button
        role="tab"
        aria-selected={isLight}
        onClick={selectLight}
        className={[
          'group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-strong',
          isLight
            ? 'bg-default text-strong border border-neutral-subtle'
            : 'text-default hover:text-strong',
        ].join(' ')}
      >
        <Sun className="w-4 h-4" />
        <span>Light</span>
      </button>
      <button
        role="tab"
        aria-selected={!isLight}
        onClick={selectDark}
        className={[
          'group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-strong',
          !isLight
            ? 'bg-default text-strong border border-neutral-subtle'
            : 'text-default hover:text-strong',
        ].join(' ')}
      >
        <Moon className="w-4 h-4" />
        <span>Dark</span>
      </button>
    </div>
  )
}
