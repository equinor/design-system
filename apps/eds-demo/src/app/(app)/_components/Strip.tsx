'use client'

import { Button, Icon } from '@equinor/eds-core-react/next'
import {
  fullscreen,
  mouse,
  replay,
  view_agenda,
  view_column,
  type IconData,
} from '@equinor/eds-icons'
import { useId } from 'react'
import {
  colorSchemes,
  densities,
  modes,
  views,
  type ColorScheme,
  type Density,
  type Mode,
  type View,
} from '../../../lib/preferences'

const labels: Record<Mode | View | ColorScheme | Density, string> = {
  exercise: 'Exercise',
  solution: 'Solution',
  row: 'Row',
  column: 'Column',
  fullscreen: 'Fullscreen',
  light: 'Light',
  dark: 'Dark',
  compact: 'Compact',
  comfortable: 'Comfortable',
  relaxed: 'Relaxed',
}

const viewIcons: Record<View, IconData> = {
  row: view_column,
  column: view_agenda,
  fullscreen,
}

type StripProps = {
  mode: Mode
  view: View
  colorScheme: ColorScheme
  density: Density
  shortcut: string
  onMode: (mode: Mode) => void
  onView: (view: View) => void
  onColorScheme: (scheme: ColorScheme) => void
  onDensity: (density: Density) => void
  inspecting: boolean
  onInspect: (inspecting: boolean) => void
  onRestart: () => void
}

/** The demo controls above the frame and the editor. */
export function Strip({
  mode,
  view,
  colorScheme,
  density,
  shortcut,
  onMode,
  onView,
  onColorScheme,
  onDensity,
  inspecting,
  onInspect,
  onRestart,
}: StripProps) {
  return (
    <header className="strip" aria-label="Demo settings">
      <span className="strip-title">EDS beta tokens demo</span>

      <RadioGroup
        label="CSS"
        name="mode"
        values={modes}
        checked={mode}
        onChange={onMode}
        hint={shortcut}
      />
      <RadioGroup
        label="View"
        name="view"
        values={views}
        checked={view}
        onChange={onView}
        icons={viewIcons}
      />
      <RadioGroup
        label="Colour scheme"
        name="color-scheme"
        values={colorSchemes}
        checked={colorScheme}
        onChange={onColorScheme}
      />
      <RadioGroup
        label="Density"
        name="density"
        values={densities}
        checked={density}
        onChange={onDensity}
      />

      {/* Styled as the options of the groups: checked, it has the
          selected fill. */}
      <div className="strip-options">
        <label
          className="strip-option"
          title="Show the class names in the frame. Click one to go to its CSS. Escape turns it off."
        >
          <input
            type="checkbox"
            checked={inspecting}
            onChange={(event) => onInspect(event.target.checked)}
          />
          <Icon data={mouse} size="md" />
          Inspect
        </label>
      </div>

      <Button variant="ghost" tone="neutral" size="small" onClick={onRestart}>
        <Icon data={replay} />
        Restart
      </Button>
    </header>
  )
}

type RadioGroupProps<T extends string> = {
  label: string
  name: string
  values: readonly T[]
  checked: T
  onChange: (value: T) => void
  icons?: Record<T, IconData>
  hint?: string
}

function RadioGroup<T extends Mode | View | ColorScheme | Density>({
  label,
  name,
  values,
  checked,
  onChange,
  icons,
  hint,
}: RadioGroupProps<T>) {
  const labelId = useId()

  return (
    <div className="strip-group" role="radiogroup" aria-labelledby={labelId}>
      <span id={labelId} className="strip-label">
        {label}
      </span>
      <div className="strip-options">
        {values.map((value) => (
          <label key={value} className="strip-option">
            <input
              type="radio"
              name={name}
              value={value}
              checked={checked === value}
              onChange={() => onChange(value)}
            />
            {icons && <Icon data={icons[value]} size="md" />}
            {labels[value]}
          </label>
        ))}
      </div>
      {hint && (
        <kbd
          className="strip-hint"
          title="Switch between exercise and solution"
        >
          {hint}
        </kbd>
      )}
    </div>
  )
}
