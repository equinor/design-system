// Disable no-autofocus - it's not the native autofocus attribute, but react-aria's autoFocus prop
/* eslint-disable jsx-a11y/no-autofocus */
import styled from 'styled-components'
import { tokens } from '@equinor/eds-tokens'
import { FocusScope, useFocusManager } from 'react-aria'
import { KeyboardEvent } from 'react'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 8px;
  margin: 8px;
`

const GridColumn = styled.button<{ $active: boolean }>`
  background-color: transparent;
  outline: none;
  border: none;
  display: flex;
  justify-content: center;
  cursor: pointer;
  padding: 8px;
  font-size: ${tokens.typography.navigation.button.fontSize};
  font-family: ${tokens.typography.navigation.button.fontFamily};
  font-weight: ${tokens.typography.navigation.button.fontWeight};
  line-height: ${tokens.typography.navigation.button.lineHeight};
  color: ${tokens.colors.text.static_icons__default.rgba};
  border-radius: 999px;
  ${({ $active }) =>
    $active
      ? `background-color: ${tokens.colors.interactive.primary__selected_highlight.rgba}`
      : ''};
  &:hover {
    background-color: #f0f0f0;
  }
  &:focus {
    outline: 2px dashed ${tokens.colors.interactive.primary__resting.rgba};
  }
`

const TOTAL_VISIBLE_YEARS = 36
const RANGE_OFFSET = 30 / 2

const GridFocusManager = ({
  year: selectedYear,
  setFocusedYear,
  yearPickerPage,
}: {
  setFocusedYear: (year: number) => void
  year: number
  yearPickerPage?: number
}) => {
  const focusManager = useFocusManager()
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const target = e.currentTarget
    const parent = target.parentElement as HTMLDivElement
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        focusManager.focusNext({ wrap: true })
        break
      case 'ArrowLeft':
        e.preventDefault()
        focusManager.focusPrevious({ wrap: true })
        break
      case 'ArrowDown': {
        e.preventDefault()
        const selfIndex = Array.from(parent.children).indexOf(target)
        const focusElement = Array.from(parent.children).at(selfIndex + 5)
        focusManager.focusNext({ from: focusElement })
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        const selfIndex = Array.from(parent.children).indexOf(target)
        const focusElement = Array.from(parent.children).at(selfIndex - 5)
        focusManager.focusPrevious({ from: focusElement })
        break
      }
    }
  }

  const page = yearPickerPage * TOTAL_VISIBLE_YEARS

  const years = Array.from(
    { length: TOTAL_VISIBLE_YEARS },
    (_, i) => i + (selectedYear + page - RANGE_OFFSET),
  )
  return years.map((year) => (
    <GridColumn
      $active={selectedYear === year}
      onKeyDown={onKeyDown}
      onClick={() => setFocusedYear(year)}
      aria-label={`Set year to ${year}`}
      tabIndex={0}
      key={year}
    >
      {year}
    </GridColumn>
  ))
}

export const YearGrid = ({
  setFocusedYear,
  year: selectedYear,
  yearPickerPage,
}: {
  setFocusedYear: (year: number) => void
  year: number
  yearPickerPage: number
}) => {
  return (
    <Grid>
      <FocusScope contain restoreFocus autoFocus>
        <GridFocusManager
          year={selectedYear}
          setFocusedYear={setFocusedYear}
          yearPickerPage={yearPickerPage}
        />
      </FocusScope>
    </Grid>
  )
}
