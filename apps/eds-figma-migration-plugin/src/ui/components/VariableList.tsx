import { useId, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Search } from '@equinor/eds-core-react/next'
import { getNewTextStyle, getNewVariable } from '../../mapping/inventory'
import type { PickerOptions } from '../../mapping/picker'
import { targetLabel } from '../targets'

type VariableListProps = {
  options: PickerOptions
  /** The chosen target; null leaves the legacy binding; undefined is nothing chosen yet */
  value: string | null | undefined
  onChange: (value: string | null) => void
  colorScheme: 'light' | 'dark'
  /** A line under each proposed target that says what it is for */
  describe?: (name: string) => string | undefined
}

type Item = {
  value: string | null
  /** The name shown in the list: the last part of the path, or the full name in Proposed */
  label: string
  /** The full name, for search */
  name: string
}

type Section = { title: string; items: Item[] }

const LEAVE: Item = {
  value: null,
  label: 'Leave as it is',
  name: 'Leave as it is',
}

function splitName(name: string): [string, string] {
  const index = name.lastIndexOf('/')
  return index === -1
    ? ['', name]
    : [name.slice(0, index), name.slice(index + 1)]
}

/** Groups names by their path, as Figma's variable picker does. */
function sections(options: PickerOptions): Section[] {
  const result: Section[] = []
  if (options.proposed.length > 0) {
    result.push({
      title: 'Proposed',
      items: options.proposed.map((name) => ({
        value: name,
        label: targetLabel(name),
        name,
      })),
    })
  }
  const byPath = new Map<string, Item[]>()
  for (const name of options.others) {
    const [path, leaf] = splitName(name)
    const items = byPath.get(path) ?? []
    items.push({ value: name, label: leaf, name })
    byPath.set(path, items)
  }
  for (const [path, items] of byPath) {
    result.push({ title: path || 'Other', items })
  }
  result.push({ title: 'Keep', items: [LEAVE] })
  return result
}

export function Preview({
  name,
  colorScheme,
}: {
  name: string | null
  colorScheme: 'light' | 'dark'
}) {
  if (name === null)
    return <span className="option-preview" aria-hidden="true" />
  const variable = getNewVariable(name)
  const colour = variable?.values?.[colorScheme]
  if (colour) {
    return (
      <span
        className="swatch"
        style={{ backgroundColor: colour }}
        aria-hidden="true"
      />
    )
  }
  return <span className="option-preview" aria-hidden="true" />
}

export function valueText(name: string | null): string | undefined {
  if (name === null) return undefined
  const variable = getNewVariable(name)
  if (variable?.values?.comfortable !== undefined) {
    return String(variable.values.comfortable)
  }
  const style = getNewTextStyle(name)
  if (style) return `${style.fontSize} · ${style.fontFamily} ${style.fontStyle}`
  return undefined
}

/**
 * The list of targets in the picker: a search field, the proposed targets,
 * then every other fitting variable or text style grouped by its path, with
 * a colour swatch or a value, like Figma's variable picker. The Beta has no
 * listbox with groups and swatches, so it is built here (BETA-GAPS.md).
 */
export function VariableList({
  options,
  value,
  onChange,
  colorScheme,
  describe,
}: VariableListProps) {
  const id = useId()
  const [query, setQuery] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const all = useMemo(() => sections(options), [options])
  const shown = all
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.name.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    }))
    .filter((section) => section.items.length > 0)

  const optionsInList = () => [
    ...(listRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ??
      []),
  ]

  const onKeyDown = (event: KeyboardEvent<HTMLElement>, item: Item) => {
    const list = optionsInList()
    const index = list.indexOf(event.currentTarget)
    const move = (to: number) => {
      event.preventDefault()
      list[Math.max(0, Math.min(list.length - 1, to))]?.focus()
    }
    if (event.key === 'ArrowDown') move(index + 1)
    else if (event.key === 'ArrowUp') move(index - 1)
    else if (event.key === 'Home') move(0)
    else if (event.key === 'End') move(list.length - 1)
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onChange(item.value)
    }
  }

  // The chosen option, or the first one, is the one Tab reaches.
  const focusable =
    shown
      .flatMap((section) => section.items)
      .find((item) => item.value === value) ?? shown[0]?.items[0]

  return (
    <div className="variable-list">
      <Search
        aria-label="Search variables and styles"
        placeholder="Search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onClear={() => setQuery('')}
      />
      <div
        ref={listRef}
        className="variable-options"
        role="listbox"
        aria-label="Targets"
      >
        {shown.length === 0 && <p className="muted">Nothing matches.</p>}
        {shown.map((section, sectionIndex) => (
          <div
            key={section.title}
            role="group"
            aria-labelledby={`${id}-${sectionIndex}`}
            className="variable-group"
          >
            <div id={`${id}-${sectionIndex}`} className="variable-group-title">
              {section.title}
            </div>
            {section.items.map((item) => {
              const selected = item.value === value
              const extra = valueText(item.value)
              return (
                <div
                  key={item.name}
                  role="option"
                  aria-selected={selected}
                  tabIndex={item === focusable ? 0 : -1}
                  className="variable-option"
                  title={item.name}
                  onClick={() => onChange(item.value)}
                  onKeyDown={(event) => onKeyDown(event, item)}
                >
                  <Preview name={item.value} colorScheme={colorScheme} />
                  <span className="option-text">
                    <span className="option-label">{item.label}</span>
                    {describe &&
                      section.title === 'Proposed' &&
                      item.value !== null &&
                      describe(item.value) && (
                        <span className="option-meaning">
                          {describe(item.value)}
                        </span>
                      )}
                  </span>
                  {extra && <span className="option-value">{extra}</span>}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
