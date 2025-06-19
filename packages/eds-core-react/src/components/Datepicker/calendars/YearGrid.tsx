// Disable no-autofocus - it's not the native autofocus attribute, but react-aria's autoFocus prop
/* eslint-disable jsx-a11y/no-autofocus */
import styled from 'styled-components'
import { tokens } from '@equinor/eds-tokens'
import { FocusScope, useFocusManager } from 'react-aria'
import {
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useEffect,
  useRef,
} from 'react'
import { getPageYears } from '../utils/getPageYears'

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

const GridFocusManager = ({
  year: selectedYear,
  setFocusedYear,
  yearPickerPage,
  setYearPickerPage,
}: {
  setFocusedYear: (year: number) => void
  year: number
  yearPickerPage?: number
  setYearPickerPage?: Dispatch<SetStateAction<number>>
}) => {
  const focusManager = useFocusManager()

  const prevYear = useRef<number | undefined>()
  const navByKeyboard = useRef<boolean>(false)

  const years = getPageYears(selectedYear, yearPickerPage)

  useEffect(() => {
    if (prevYear.current === undefined) {
      prevYear.current = yearPickerPage
      return
    }

    if (!navByKeyboard.current) {
      focusManager.focusFirst()
      return
    }

    navByKeyboard.current = false

    yearPickerPage > prevYear.current
      ? focusManager.focusFirst()
      : focusManager.focusLast()

    prevYear.current = yearPickerPage
  }, [yearPickerPage, focusManager])

  const onKeyDown = (year: number) => (e: KeyboardEvent<HTMLButtonElement>) => {
    const target = e.currentTarget
    const parent = target.parentElement as HTMLDivElement

    const isFirstYear = years.at(0) === year
    const isLastYear = years.at(-1) === year

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        if (isLastYear) {
          navByKeyboard.current = true
          setYearPickerPage((page) => page + 1)
          break
        }
        focusManager.focusNext({ wrap: true })
        break
      case 'ArrowLeft':
        e.preventDefault()
        if (isFirstYear) {
          navByKeyboard.current = true
          setYearPickerPage((page) => page - 1)
          break
        }
        focusManager.focusPrevious({ wrap: true })
        break
      case 'ArrowDown': {
        e.preventDefault()
        if (isLastYear) {
          navByKeyboard.current = true
          setYearPickerPage((page) => page + 1)
          break
        }
        const selfIndex = Array.from(parent.children).indexOf(target)
        const focusElement = Array.from(parent.children).at(selfIndex + 5)
        focusManager.focusNext({ from: focusElement })
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        if (isFirstYear) {
          navByKeyboard.current = true
          setYearPickerPage((page) => page - 1)
          break
        }
        const selfIndex = Array.from(parent.children).indexOf(target)
        const focusElement = Array.from(parent.children).at(selfIndex - 5)
        focusManager.focusPrevious({ from: focusElement })
        break
      }
    }
  }

  return years.map((year) => (
    <GridColumn
      $active={selectedYear === year}
      onKeyDown={onKeyDown(year)}
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
  setYearPickerPage,
}: {
  setFocusedYear: (year: number) => void
  year: number
  yearPickerPage: number
  setYearPickerPage?: Dispatch<SetStateAction<number>>
}) => {
  return (
    <Grid>
      <FocusScope contain restoreFocus autoFocus>
        <GridFocusManager
          year={selectedYear}
          setFocusedYear={setFocusedYear}
          yearPickerPage={yearPickerPage}
          setYearPickerPage={setYearPickerPage}
        />
      </FocusScope>
    </Grid>
  )
}
