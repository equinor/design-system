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
  /** EDS Button size: `md` (default, 36px) or `sm` (24px) */
  size?: 'sm' | 'md'
  /**
   * `joined` (default) draws the buttons as one EDS Toggle. `wrap` draws
   * separate buttons that wrap onto more lines, for long option lists such
   * as palette names.
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

/*
 * Every segment is an EDS Button (Core Components Figma, "Button [EDS]",
 * 5823:7549, Tone=Accent), laid out as the EDS Toggle (11832:3639): the
 * selected segment is the Primary button, the others the Secondary button.
 * States follow the button: hover, pressed (active) and focus, which shows
 * the hover fill plus a 1px focus ring.
 *
 * Figma's button has its stroke inside the frame, so the padding here is one
 * pixel smaller on each side to keep its 36px (default) and 24px (small)
 * height with a 1px CSS border.
 */
const SEGMENT_SIZES = {
  sm: 'gap-[var(--eds-spacing-3xs)] px-[calc(var(--eds-spacing-xs)-1px)] py-[calc(var(--eds-spacing-3xs)-1px)] text-sm',
  md: 'gap-[var(--eds-spacing-xs)] px-[calc(var(--eds-spacing-sm)-1px)] py-[calc(var(--eds-spacing-xs)-1px)] text-base',
} as const

const ICON_ONLY_SIZES = {
  sm: 'size-6',
  md: 'size-9',
} as const

const SEGMENT_BASE =
  'inline-flex items-center justify-center whitespace-nowrap cursor-pointer border border-solid font-sans font-medium transition-colors duration-150 focus-visible:relative focus-visible:z-10 focus-visible:outline-1 disabled:cursor-not-allowed'

const LAYOUT = {
  joined: {
    group: 'inline-flex max-w-full',
    // Neighbours overlap by the border width so two borders read as one.
    segment: '-ml-px first:ml-0 rounded-none first:rounded-l last:rounded-r',
  },
  wrap: {
    group: 'flex flex-wrap gap-[var(--eds-spacing-3xs)]',
    segment: 'rounded',
  },
} as const

// Primary button. The transparent border keeps it the same size as its
// Secondary neighbours.
const SELECTED =
  'border-transparent bg-accent-emphasis text-accent-on-emphasis hover:bg-accent-emphasis-hover active:bg-accent-emphasis-pressed focus-visible:bg-accent-emphasis-hover focus-visible:outline-offset-0 disabled:bg-disabled disabled:text-disabled'

// Secondary button.
const UNSELECTED =
  'border-interactive-accent-emphasis-hover bg-transparent text-interactive-accent hover:bg-neutral-selected active:bg-accent-muted-hover focus-visible:bg-neutral-selected focus-visible:outline-offset-1 disabled:border-disabled disabled:bg-transparent disabled:text-disabled'

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
      className={[LAYOUT[layout].group, className].filter(Boolean).join(' ')}
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
            className={[
              SEGMENT_BASE,
              LAYOUT[layout].segment,
              iconOnly ? ICON_ONLY_SIZES[size] : SEGMENT_SIZES[size],
              selected ? SELECTED : UNSELECTED,
            ].join(' ')}
          >
            {option.icon && (
              <Icon data={option.icon} size={size === 'sm' ? 16 : 18} />
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
