import { useId, useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

type Tab<T extends string> = { id: T; label: ReactNode }

type TabsProps<T extends string> = {
  label: string
  tabs: Tab<T>[]
  selected: T
  onSelect: (id: T) => void
  children: ReactNode
  /** Tighter tabs, so a row of six fits in the window (final review FR8) */
  compact?: boolean
}

/**
 * Tabs with the ARIA tabs pattern: arrow keys move between tabs, and the
 * selected tab controls the panel. The Beta has no tabs component, so they
 * are built here (BETA-GAPS.md).
 */
export function Tabs<T extends string>({
  label,
  tabs,
  selected,
  onSelect,
  children,
  compact = false,
}: TabsProps<T>) {
  const id = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const moves: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      Home: -index,
      End: tabs.length - 1 - index,
    }
    if (!(event.key in moves)) return
    event.preventDefault()
    const next = (index + moves[event.key] + tabs.length) % tabs.length
    onSelect(tabs[next].id)
    refs.current[next]?.focus()
  }

  return (
    <div className={compact ? 'tabs compact' : 'tabs'}>
      <div className="tab-list" role="tablist" aria-label={label}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(element) => {
              refs.current[index] = element
            }}
            type="button"
            role="tab"
            id={`${id}-${tab.id}`}
            className="tab"
            aria-selected={tab.id === selected}
            aria-controls={`${id}-panel`}
            tabIndex={tab.id === selected ? 0 : -1}
            onClick={() => onSelect(tab.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-${selected}`}
        className="tab-panel"
      >
        {children}
      </div>
    </div>
  )
}
