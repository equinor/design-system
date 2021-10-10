import { forwardRef, useEffect, useState } from 'react'
import {
  useCombobox,
  UseComboboxProps,
  UseComboboxStateChange,
} from 'downshift'
import styled, { ThemeProvider } from 'styled-components'
import { Label, Icon } from '../../'
import { time } from '@equinor/eds-icons'
import { spacingsTemplate } from '../../utils'
import { timePicker as tokens } from './TimePicker.tokens'
import {
  Container,
  PaddedInput,
  StyledList,
  StyledButton,
  StyledListItem,
  StyledInputWrapper,
} from './commonStyles'
import { useEds } from '../EdsProvider'
import { useToken } from '../../hooks'

const PaddedStyledListItem = styled(StyledListItem)`
  ${({ theme }) => spacingsTemplate(theme.spacings)}
`

const defaultRange = [
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
]

export interface TimePickerProps {
  /** Label for the select element */
  label: string
  className?: string
  /** List of options to choose from */
  timeRange?: string[]
  value?: string
  onValueChanged?: (time: string) => void
  /** Disabled state */
  disabled?: boolean
  /** Read Only */
  readOnly?: boolean
}

const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
  function TimePicker(
    {
      label,
      className,
      timeRange = defaultRange,
      value,
      onValueChanged,
      disabled = false,
      readOnly = false,
      ...other
    },
    ref,
  ) {
    const [timeValues, setTimeValues] = useState(timeRange)
    const [selectedTime, setSelectedTime] = useState(
      value ? value : timeValues[0],
    )

    useEffect(() => {
      setTimeValues(timeRange)
    }, [timeRange])

    const isControlled = value !== undefined ? true : false
    const { density } = useEds()
    const token = useToken({ density }, tokens)()

    let comboboxProps: UseComboboxProps<string> = {
      items: timeValues,
      onSelectedItemChange: (changes: UseComboboxStateChange<string>) => {
        onValueChanged(changes.selectedItem)
      },
      onInputValueChange: ({ inputValue }) => {
        setSelectedTime(
          timeValues.find((item) =>
            item.toLowerCase().includes(inputValue.toLowerCase()),
          ),
        )
      },
      onIsOpenChange: ({ selectedItem }) => {
        setSelectedTime(selectedItem)
      },
      initialSelectedItem: selectedTime,
    }

    if (isControlled) {
      comboboxProps = { ...comboboxProps, selectedItem: value }
    }

    const {
      isOpen,
      getToggleButtonProps,
      getLabelProps,
      getMenuProps,
      getInputProps,
      getComboboxProps,
      highlightedIndex,
      getItemProps,
      openMenu,
      selectedItem,
      reset,
      inputValue,
    } = useCombobox(comboboxProps)

    const openSelect = () => {
      if (!isOpen && !(disabled || readOnly)) {
        openMenu()
      }
    }

    return (
      <ThemeProvider theme={token}>
        <Container className={className} ref={ref}>
          <Label {...getLabelProps()} label={label} disabled={disabled} />
          <StyledInputWrapper {...getComboboxProps()}>
            <PaddedInput
              {...getInputProps({ disabled: disabled })}
              readOnly={readOnly}
              onFocus={openSelect}
              onClick={openSelect}
              {...other}
            />
            <StyledButton
              variant="ghost_icon"
              {...getToggleButtonProps({ disabled: disabled || readOnly })}
              aria-label={'toggle options'}
              title="open"
            >
              <TimeIcon
                name="time"
                className="time-icon"
                data={time}
                size={24}
                onClick={openSelect}
              />
            </StyledButton>
          </StyledInputWrapper>
          <StyledList {...getMenuProps()}>
            {isOpen &&
              timeValues.map((item, index) => (
                <PaddedStyledListItem
                  highlighted={highlightedIndex === index ? 'true' : 'false'}
                  active={selectedItem === item ? 'true' : 'false'}
                  key={`${item}`}
                  {...getItemProps({ item, index, disabled: disabled })}
                >
                  {item}
                </PaddedStyledListItem>
              ))}
          </StyledList>
        </Container>
      </ThemeProvider>
    )
  },
)

const TimeIcon = styled(Icon)`
  position: absolute;
  z-index: 1;
  width: 18px;
  height: 18px;
  color: #616161;
  cursor: pointer;
`

export { TimePicker }
