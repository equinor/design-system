'use client'

import { dark_mode, light } from '@equinor/eds-icons'
import { useColorScheme } from '@/context/ColorSchemeContext'
import { useDensity } from '@/context/DensityContext'
import type { Density } from '@/utils/localStorage'
import { Button } from './Button'
import { Dialog } from './Dialog'
import { SegmentedControl } from './SegmentedControl'
import type { SegmentedOption } from './SegmentedControl'

type Scheme = 'light' | 'dark'

// The aria-labels are what the e2e tests look for.
const SCHEME_OPTIONS: SegmentedOption<Scheme>[] = [
  { value: 'light', label: 'Light', icon: light, 'aria-label': 'Light theme' },
  { value: 'dark', label: 'Dark', icon: dark_mode, 'aria-label': 'Dark theme' },
]

// The Tokens Studio density modes
const DENSITY_OPTIONS: SegmentedOption<Density>[] = [
  { value: 'relaxed', label: 'Relaxed' },
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'compact', label: 'Compact' },
]

type SettingsDialogProps = {
  open: boolean
  onClose: () => void
}

/** Colour scheme and density, applied as soon as they change. */
export function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const { colorScheme, setColorScheme } = useColorScheme()
  const { density, setDensity } = useDensity()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Settings"
      actions={
        <Button variant="primary" onClick={onClose}>
          Done
        </Button>
      }
    >
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-secondary">Theme</span>
        <SegmentedControl
          mode="radio"
          aria-label="Theme"
          options={SCHEME_OPTIONS}
          value={colorScheme}
          onChange={setColorScheme}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-secondary">Density</span>
        <SegmentedControl
          mode="radio"
          aria-label="Density"
          options={DENSITY_OPTIONS}
          value={density}
          onChange={setDensity}
        />
        <span className="text-sm text-tertiary">
          Spacing, type sizes and corner radius of the page content, from the
          Tokens Studio density modes.
        </span>
      </div>
    </Dialog>
  )
}
