'use client'

import { useRef } from 'react'
import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react'
import type { IconData } from '@equinor/eds-icons'
import { Icon } from './Icon'

export type SegmentedOption<T extends string> = {
  value: T
  /** Visible label. Leave out for an icon-only segment (then set `aria-label`). */
  label?: ReactNode
  icon?: IconData
  /** Accessible name when the label is missing or not descriptive enough */
  'aria-label'?: string
  title?: string
}

export type SegmentedControlProps<T extends string> = {
  /**
   * `tabs` switches between panels (tablist/tab). `radio` picks one option
   * (radiogroup/radio).
   */
  mode: 'tabs' | 'radio'
  options: SegmentedOption<T>[]
  /** The selected option, or `null` when none is selected yet */
  value: T | null
  onChange: (value: T) => void
  /** Accessible name of the group */
  'aria-label': string
  /**
   * Required in `tabs` mode: prefix for the tab and panel ids. Pair the
   * control with `<TabPanel idPrefix={…} value={…}>`.
   */
  idPrefix?: string
  /** Radio mode only; tabs always use the EDS Tab size. */
  size?: 'sm' | 'md'
  /**
   * Radio mode only. `joined` (default) draws one bordered strip. `wrap`
   * draws separate pills that wrap onto more lines, for long option lists
   * such as palette names.
   */
  layout?: 'joined' | 'wrap'
  disabled?: boolean
  className?: string
}

/** Id of the tab for `value`, for `aria-labelledby` on its panel. */
export function segmentTabId(idPrefix: string, value: string): string {
  return `${idPrefix}-tab-${value}`
}

/** Id of the panel for `value`, for `aria-controls` on its tab. */
export function segmentPanelId(idPrefix: string, value: string): string {
  return `${idPrefix}-panel-${value}`
}

const SEGMENT_SIZES = {
  sm: 'min-h-7 gap-1.5 px-2.5 text-sm',
  md: 'min-h-9 gap-2 px-4 text-base',
} as const

const ICON_ONLY_SIZES = {
  sm: 'size-7',
  md: 'size-9',
} as const

const SEGMENT_BASE =
  'inline-flex items-center justify-center whitespace-nowrap cursor-pointer transition-colors duration-150 focus-visible:relative focus-visible:z-10 disabled:cursor-not-allowed'

const LAYOUT = {
  joined: {
    group: 'inline-flex max-w-full rounded border border-muted bg-surface',
    segment:
      'border-l border-muted first:border-l-0 first:rounded-l last:rounded-r',
  },
  wrap: {
    group: 'flex flex-wrap gap-1',
    segment: 'rounded border border-muted',
  },
} as const

const SELECTED =
  'bg-neutral-emphasis text-neutral-on-emphasis font-medium hover:bg-neutral-emphasis-hover active:bg-neutral-emphasis-pressed'

const UNSELECTED =
  'bg-surface text-secondary hover:bg-neutral-muted hover:text-primary active:bg-neutral-muted-hover disabled:bg-surface disabled:text-disabled'

/*
 * Tabs follow the EDS Tab in the Core Components Figma file (node 4240:243515,
 * "Composition=Simple"): a 2px bottom border, no corner radius, 12/8px padding
 * and ui/md text. Inactive tabs use the neutral muted border and primary text,
 * the active tab the accent emphasis border and accent text. Hover and focus
 * add the muted fill (accent for the active tab) and focus a 1px focus ring.
 *
 * Figma binds the active label to `text/accent` (#20474b), a variable Tokens
 * Studio no longer has. It resolves to accent step 12, which is
 * `text.on-muted.accent` in Tokens Studio, hence `text-accent-on-muted`.
 */
const TAB_GROUP = 'inline-flex max-w-full flex-wrap'

const TAB_BASE =
  'inline-flex items-center justify-center gap-[var(--eds-spacing-3xs)] whitespace-nowrap cursor-pointer rounded-none border-b-2 border-solid px-[var(--eds-spacing-sm)] py-[var(--eds-spacing-xs)] font-sans text-base font-normal transition-colors duration-150 focus-visible:relative focus-visible:z-10 focus-visible:outline-1 disabled:cursor-not-allowed disabled:text-disabled'

const TAB_INACTIVE =
  'border-interactive-neutral-muted text-primary hover:bg-neutral-muted-hover focus-visible:bg-neutral-muted-hover'

const TAB_ACTIVE =
  'border-interactive-accent-emphasis text-accent-on-muted hover:border-interactive-accent-emphasis-hover hover:bg-accent-muted-hover focus-visible:border-interactive-accent-emphasis-hover focus-visible:bg-accent-muted-hover'

// A horizontal tablist uses Left/Right only; a radio group also Up/Down.
const NEXT_KEYS = { tabs: ['ArrowRight'], radio: ['ArrowRight', 'ArrowDown'] }
const PREV_KEYS = { tabs: ['ArrowLeft'], radio: ['ArrowLeft', 'ArrowUp'] }

/**
 * One segmented toggle for the whole app, with tab or radio semantics,
 * arrow-key navigation and a roving tabindex.
 */
export function SegmentedControl<T extends string>({
  mode,
  options,
  value,
  onChange,
  'aria-label': ariaLabel,
  idPrefix,
  size = 'md',
  layout = 'joined',
  disabled = false,
  className,
}: SegmentedControlProps<T>) {
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([])
  const isTabs = mode === 'tabs'
  const selectedIndex = options.findIndex((o) => o.value === value)
  // The one segment that takes Tab focus: the selected one, else the first.
  const focusIndex = selectedIndex >= 0 ? selectedIndex : 0

  const select = (index: number) => {
    const option = options[index]
    if (!option) return
    buttonsRef.current[index]?.focus()
    onChange(option.value)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || options.length === 0) return
    const current = Math.max(
      0,
      buttonsRef.current.findIndex((b) => b === document.activeElement),
    )
    let next: number | null = null
    if (NEXT_KEYS[mode].includes(event.key))
      next = (current + 1) % options.length
    else if (PREV_KEYS[mode].includes(event.key))
      next = (current - 1 + options.length) % options.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = options.length - 1
    if (next === null) return
    event.preventDefault()
    select(next)
  }

  return (
    <div
      role={isTabs ? 'tablist' : 'radiogroup'}
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={[isTabs ? TAB_GROUP : LAYOUT[layout].group, className]
        .filter(Boolean)
        .join(' ')}
    >
      {options.map((option, index) => {
        const selected = index === selectedIndex
        const iconOnly = option.label === undefined
        const semantics: HTMLAttributes<HTMLButtonElement> =
          isTabs && idPrefix
            ? {
                role: 'tab',
                id: segmentTabId(idPrefix, option.value),
                'aria-selected': selected,
                // Only the selected panel is rendered, so only its tab points
                // at a panel that exists.
                'aria-controls': selected
                  ? segmentPanelId(idPrefix, option.value)
                  : undefined,
              }
            : isTabs
              ? { role: 'tab', 'aria-selected': selected }
              : { role: 'radio', 'aria-checked': selected }

        return (
          <button
            key={option.value}
            ref={(el) => {
              buttonsRef.current[index] = el
            }}
            type="button"
            {...semantics}
            aria-label={option['aria-label']}
            title={option.title}
            tabIndex={index === focusIndex ? 0 : -1}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={
              isTabs
                ? [TAB_BASE, selected ? TAB_ACTIVE : TAB_INACTIVE].join(' ')
                : [
                    SEGMENT_BASE,
                    LAYOUT[layout].segment,
                    iconOnly ? ICON_ONLY_SIZES[size] : SEGMENT_SIZES[size],
                    selected ? SELECTED : UNSELECTED,
                  ].join(' ')
            }
          >
            {option.icon && (
              <Icon
                data={option.icon}
                size={isTabs || size === 'md' ? 18 : 16}
              />
            )}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

type TabPanelProps = {
  idPrefix: string
  /** The value of the tab this panel belongs to */
  value: string
  children: ReactNode
  className?: string
}

/** The panel that belongs to a `SegmentedControl` in `tabs` mode. */
export function TabPanel({
  idPrefix,
  value,
  children,
  className,
}: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      id={segmentPanelId(idPrefix, value)}
      aria-labelledby={segmentTabId(idPrefix, value)}
      className={className}
    >
      {children}
    </div>
  )
}
