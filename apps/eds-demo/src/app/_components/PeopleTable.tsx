'use client'

import { Icon } from '@equinor/eds-core-react/next'
import {
  checkbox,
  checkbox_indeterminate,
  checkbox_outline,
} from '@equinor/eds-icons'
import { useEffect, useRef, useState, type Ref } from 'react'
import { classNames, type Styles } from './classNames'
import { people } from './people'
import { StatusBadge } from './StatusBadge'

const columns = ['Id', 'Name', 'Email', 'Position', 'Location', 'Status']

type CellCheckboxProps = {
  styles: Styles
  label: string
  checked: boolean
  indeterminate?: boolean
  onChange: () => void
  inputRef?: Ref<HTMLInputElement>
}

/** The checkbox of the Checkbox Cell and Header Checkbox in Figma: the EDS
 * checkbox icon, with a transparent native checkbox on top for keyboard,
 * screen readers and clicks. */
function CellCheckbox({
  styles,
  label,
  checked,
  indeterminate = false,
  onChange,
  inputRef,
}: CellCheckboxProps) {
  const c = classNames(styles)
  const icon = indeterminate
    ? checkbox_indeterminate
    : checked
      ? checkbox
      : checkbox_outline

  return (
    <span className={c('cell-checkbox')}>
      <input
        ref={inputRef}
        type="checkbox"
        className={c('cell-checkbox-input')}
        checked={checked}
        onChange={onChange}
        aria-label={label}
      />
      <Icon data={icon} size="xl" className={c('cell-checkbox-icon')} />
    </span>
  )
}

export function PeopleTable({ styles }: { styles: Styles }) {
  const c = classNames(styles)
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(['EQ-2134']),
  )
  const selectAll = useRef<HTMLInputElement>(null)

  const allSelected = selected.size === people.length
  const someSelected = selected.size > 0 && !allSelected

  useEffect(() => {
    if (selectAll.current) selectAll.current.indeterminate = someSelected
  }, [someSelected])

  const toggle = (id: string) =>
    setSelected((previous) => {
      const next = new Set(previous)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })

  const toggleAll = () =>
    setSelected(
      allSelected ? new Set() : new Set(people.map((person) => person.id)),
    )

  return (
    <div className={c('table-card')}>
      <table className={c('table')}>
        <caption className="visually-hidden">People with access</caption>
        <thead>
          <tr>
            <th scope="col" className={c('header-checkbox')}>
              <CellCheckbox
                styles={styles}
                inputRef={selectAll}
                label="Select all people"
                checked={allSelected}
                indeterminate={someSelected}
                onChange={toggleAll}
              />
            </th>
            {columns.map((column) => (
              <th key={column} scope="col" className={c('header')}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {people.map((person) => {
            const isSelected = selected.has(person.id)
            return (
              // The checkbox is the accessible control. Clicking anywhere on
              // the row is a shortcut for pointer users.
              <tr
                key={person.id}
                className={c('row')}
                data-selected={isSelected || undefined}
                onClick={(event) => {
                  if ((event.target as HTMLElement).closest('input')) return
                  toggle(person.id)
                }}
              >
                <td className={c('checkbox-cell')}>
                  <CellCheckbox
                    styles={styles}
                    label={`Select ${person.name}`}
                    checked={isSelected}
                    onChange={() => toggle(person.id)}
                  />
                </td>
                {[
                  person.id,
                  person.name,
                  person.email,
                  person.position,
                  person.location,
                ].map((value) => (
                  <td key={value} className={c('text-cell')}>
                    <div className={c('cell-content')}>{value}</div>
                  </td>
                ))}
                <td className={c('badge-cell')}>
                  <div className={c('cell-content')}>
                    <StatusBadge styles={styles} tone={person.status}>
                      {person.statusLabel}
                    </StatusBadge>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="visually-hidden" aria-live="polite">
        {selected.size} of {people.length} selected
      </p>
    </div>
  )
}
