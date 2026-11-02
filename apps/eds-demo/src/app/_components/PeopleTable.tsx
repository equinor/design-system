'use client'

import { useEffect, useRef, useState } from 'react'
import { Checkbox } from './Checkbox'
import { classNames, type Styles } from './classNames'
import { people } from './people'
import { StatusBadge } from './StatusBadge'

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
            <th scope="col" className={`${c('th')} ${c('select-cell')}`}>
              <Checkbox
                styles={styles}
                inputRef={selectAll}
                label="Select all people"
                checked={allSelected}
                indeterminate={someSelected}
                onChange={toggleAll}
              />
            </th>
            <th scope="col" className={c('th')}>
              Id
            </th>
            <th scope="col" className={c('th')}>
              Person
            </th>
            <th scope="col" className={c('th')}>
              Position
            </th>
            <th scope="col" className={c('th')}>
              Location
            </th>
            <th scope="col" className={c('th')}>
              Status
            </th>
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
                <td className={`${c('td')} ${c('select-cell')}`}>
                  <Checkbox
                    styles={styles}
                    label={`Select ${person.name}`}
                    checked={isSelected}
                    onChange={() => toggle(person.id)}
                  />
                </td>
                <td className={c('td')}>{person.id}</td>
                <td className={c('td')}>
                  <div className={c('person')}>
                    <span className={c('person-name')}>{person.name}</span>
                    <span className={c('person-email')}>{person.email}</span>
                  </div>
                </td>
                <td className={c('td')}>{person.position}</td>
                <td className={c('td')}>{person.location}</td>
                <td className={c('td')}>
                  <StatusBadge styles={styles} tone={person.status}>
                    {person.statusLabel}
                  </StatusBadge>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className={c('table-footer')}>
        <span className={c('table-summary')} aria-live="polite">
          {selected.size} of {people.length} selected
        </span>
      </div>
    </div>
  )
}
