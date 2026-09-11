import React, { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export type Density = 'comfortable' | 'compact' | 'relaxed'

const DENSITIES: Density[] = ['comfortable', 'compact', 'relaxed']

export type DensitySwitchProps = {
  /** Which density the examples start at. */
  initial?: Density
  children: ReactNode
}

/**
 * Scopes a density change to the examples below it, rather than to the whole page.
 *
 * Why the wrapper also carries `data-color-scheme`, which looks redundant: the token bundle
 * declares the semantic aliases (`--eds-spacing-md` and friends) on `:root, [data-color-scheme]`,
 * and each one is `var(--eds-density-spacing-md)`. A custom property is substituted on the element
 * that declares it, so those aliases are resolved once at the document root and inherited already
 * resolved. Setting `data-density` on a wrapper changes `--eds-density-*` there, but nothing
 * re-declares the alias above it, so the specimen would keep the comfortable value. Matching
 * `[data-color-scheme]` on the same wrapper re-declares the whole semantic layer against this
 * element's density values, which is what makes the switch work.
 *
 * The scheme is mirrored from <html>, where the site's own bridge keeps it in step with the
 * Docusaurus theme toggle. It starts empty so the server output carries no attribute and there is
 * nothing for hydration to disagree about.
 */
export function DensitySwitch({
  initial = 'comfortable',
  children,
}: DensitySwitchProps) {
  const [density, setDensity] = useState<Density>(initial)
  const [scheme, setScheme] = useState<string | null>(null)
  const buttons = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    const root = document.documentElement
    const sync = () =>
      setScheme(root.getAttribute('data-color-scheme') ?? 'light')

    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['data-color-scheme'],
    })
    return () => observer.disconnect()
  }, [])

  const move = (from: number, step: number) => {
    const next = (from + step + DENSITIES.length) % DENSITIES.length
    setDensity(DENSITIES[next])
    buttons.current[next]?.focus()
  }

  return (
    <div className="density-switch" style={{ margin: '1.5rem 0' }}>
      <div
        className="density-switch__options"
        role="radiogroup"
        aria-label="Density"
        style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.75rem' }}
      >
        {DENSITIES.map((option, index) => {
          const selected = option === density
          return (
            <button
              key={option}
              className="density-switch__option"
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              ref={(node) => {
                buttons.current[index] = node
              }}
              onClick={() => setDensity(option)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                  event.preventDefault()
                  move(index, 1)
                }
                if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                  event.preventDefault()
                  move(index, -1)
                }
              }}
              style={{
                padding: '0.25rem 0.75rem',
                fontSize: '0.8125rem',
                fontFamily: 'inherit',
                cursor: 'pointer',
                borderRadius: 4,
                border: '1px solid var(--ifm-color-emphasis-300)',
                background: selected
                  ? 'var(--ifm-color-emphasis-200)'
                  : 'transparent',
                color: 'var(--ifm-font-color-base)',
                fontWeight: selected ? 600 : 400,
              }}
            >
              {option}
            </button>
          )
        })}
      </div>
      <div
        className="density-switch__scope"
        data-density={density}
        data-color-scheme={scheme ?? undefined}
      >
        {children}
      </div>
    </div>
  )
}

export default DensitySwitch
