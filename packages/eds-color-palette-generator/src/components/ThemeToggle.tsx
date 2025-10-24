'use client'

import { useCallback } from 'react'
import type { KeyboardEvent } from 'react'
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

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      selectLight()
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      selectDark()
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex rounded-lg bg-neutral-fill-muted-default/40  border-neutral-subtle"
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        role="radio"
        aria-checked={isLight}
        aria-label="Light theme"
        onClick={selectLight}
        tabIndex={isLight ? 0 : -1}
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
        type="button"
        role="radio"
        aria-checked={!isLight}
        aria-label="Dark theme"
        onClick={selectDark}
        tabIndex={!isLight ? 0 : -1}
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
