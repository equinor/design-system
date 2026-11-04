'use client'

import { Icon } from '@equinor/eds-core-react/next'
import {
  checkbox,
  checkbox_indeterminate,
  checkbox_outline,
} from '@equinor/eds-icons'
import { useEffect, useRef, useState, type Ref } from 'react'
import { people } from './people'
import { StatusBadge } from './StatusBadge'

const columns = ['Id', 'Name', 'Email', 'Position', 'Location', 'Status']

type CellCheckboxProps = {
  label: string
  checked: boolean
  indeterminate?: boolean
  onChange: () => void
  inputRef?: Ref<HTMLInputElement>
}

/** A row checkbox: the EDS checkbox icon, with a transparent native
 * checkbox on top for keyboard, screen readers and clicks. */
function CellCheckbox({
  label,
  checked,
  indeterminate = false,
  onChange,
  inputRef,
}: CellCheckboxProps) {
  const icon = indeterminate
    ? checkbox_indeterminate
    : checked
      ? checkbox
      : checkbox_outline

  return (
    <span className="cell-checkbox">
      <input
        ref={inputRef}
        type="checkbox"
        className="cell-checkbox-input"
        checked={checked}
        onChange={onChange}
        aria-label={label}
      />
      <Icon data={icon} size="xl" className="cell-checkbox-icon" />
    </span>
  )
}

export function PeopleTable() {
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
    <div className="table-card">
      <table className="table">
        <caption className="visually-hidden">People with access</caption>
        <thead>
          <tr>
            <th scope="col" className="header-checkbox">
              <CellCheckbox
                inputRef={selectAll}
                label="Select all people"
                checked={allSelected}
                indeterminate={someSelected}
                onChange={toggleAll}
              />
            </th>
            {columns.map((column) => (
              <th key={column} scope="col" className="header">
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
                className="row"
                data-selected={isSelected || undefined}
                onClick={(event) => {
                  if ((event.target as HTMLElement).closest('input')) return
                  toggle(person.id)
                }}
              >
                <td className="checkbox-cell">
                  <CellCheckbox
                    label={`Select ${person.name}`}
                    checked={isSelected}
                    onChange={() => toggle(person.id)}
                  />
                </td>
                {(
                  [
                    ['id', person.id],
                    ['name', person.name],
                    ['email', person.email],
                    ['position', person.position],
                    ['location', person.location],
                  ] as const
                ).map(([column, value]) => (
                  // Keyed by column: two columns can hold the same value.
                  <td key={column} className="text-cell">
                    <div className="cell-content">{value}</div>
                  </td>
                ))}
                <td className="badge-cell">
                  <div className="cell-content">
                    <StatusBadge tone={person.status}>
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
