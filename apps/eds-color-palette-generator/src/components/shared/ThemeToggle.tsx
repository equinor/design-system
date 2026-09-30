'use client'

import { useColorScheme } from '@/context/ColorSchemeContext'
import { useIsMounted } from '@equinor/eds-utils'
import { dark_mode, light } from '@equinor/eds-icons'
import { SegmentedControl } from './SegmentedControl'
import type { SegmentedOption } from './SegmentedControl'

type Scheme = 'light' | 'dark'

// The aria-labels are what the e2e tests look for.
const OPTIONS: SegmentedOption<Scheme>[] = [
  { value: 'light', icon: light, 'aria-label': 'Light theme', title: 'Light' },
  { value: 'dark', icon: dark_mode, 'aria-label': 'Dark theme', title: 'Dark' },
]

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme()
  // The server does not know the saved scheme, so nothing is selected (and
  // the toggle is disabled) until the client has mounted.
  const isMounted = useIsMounted()

  return (
    <SegmentedControl
      mode="radio"
      aria-label="Theme"
      size="sm"
      options={OPTIONS}
      value={isMounted ? colorScheme : null}
      onChange={setColorScheme}
      disabled={!isMounted}
    />
  )
}
