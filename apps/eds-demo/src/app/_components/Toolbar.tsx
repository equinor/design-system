'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useId, useState } from 'react'
import { saveColorScheme, saveDensity } from '../_actions/preferences'
import {
  colorSchemes,
  densities,
  type ColorScheme,
  type Density,
} from '../_lib/preferences'
import styles from './toolbar.module.css'

const labels: Record<ColorScheme | Density, string> = {
  light: 'Light',
  dark: 'Dark',
  compact: 'Compact',
  comfortable: 'Comfortable',
  relaxed: 'Relaxed',
}

const pages = [
  { href: '/', label: 'Solution' },
  { href: '/exercise', label: 'Exercise' },
]

type ToolbarProps = {
  colorScheme: ColorScheme
  density: Density
}

/** Demo controls: switches the page, and sets data-color-scheme and
 * data-density on <html>. The attributes change at once; the cookie keeps
 * the choice for the next server render. */
export function Toolbar({
  colorScheme: initialColorScheme,
  density: initialDensity,
}: ToolbarProps) {
  const pathname = usePathname()
  const [colorScheme, setColorScheme] = useState(initialColorScheme)
  const [density, setDensity] = useState(initialDensity)

  const changeColorScheme = (value: ColorScheme) => {
    setColorScheme(value)
    document.documentElement.dataset.colorScheme = value
    void saveColorScheme(value)
  }

  const changeDensity = (value: Density) => {
    setDensity(value)
    document.documentElement.dataset.density = value
    void saveDensity(value)
  }

  return (
    // The toolbar keeps the default density whatever the page uses, so it
    // does not move under the pointer while you switch.
    <aside
      className={styles.toolbar}
      aria-label="Demo settings"
      data-density="comfortable"
    >
      <span className={styles.title}>EDS beta tokens demo</span>

      <nav className={styles.group} aria-label="Demo pages">
        <div className={styles.options}>
          {pages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className={styles.option}
              aria-current={pathname === page.href ? 'page' : undefined}
            >
              {page.label}
            </Link>
          ))}
        </div>
      </nav>

      <RadioGroup
        label="Colour scheme"
        name="color-scheme"
        values={colorSchemes}
        checked={colorScheme}
        onChange={changeColorScheme}
      />

      <RadioGroup
        label="Density"
        name="density"
        values={densities}
        checked={density}
        onChange={changeDensity}
      />
    </aside>
  )
}

type RadioGroupProps<T extends ColorScheme | Density> = {
  label: string
  name: string
  values: readonly T[]
  checked: T
  onChange: (value: T) => void
}

function RadioGroup<T extends ColorScheme | Density>({
  label,
  name,
  values,
  checked,
  onChange,
}: RadioGroupProps<T>) {
  const labelId = useId()

  return (
    <div className={styles.group} role="radiogroup" aria-labelledby={labelId}>
      <span id={labelId} className={styles.label}>
        {label}
      </span>
      <div className={styles.options}>
        {values.map((value) => (
          <label key={value} className={styles.option}>
            <input
              type="radio"
              name={name}
              value={value}
              checked={checked === value}
              onChange={() => onChange(value)}
            />
            {labels[value]}
          </label>
        ))}
      </div>
    </div>
  )
}
