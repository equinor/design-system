/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, useEffect, useState } from 'react'
import {
  useCombobox,
  UseComboboxProps,
  UseComboboxStateChange,
} from 'downshift'
import styled, { css, ThemeProvider } from 'styled-components'
import {
  Label,
  Icon,
  useEds,
  Input,
  Button,
  List,
} from '@equinor/eds-core-react'
import { time } from '@equinor/eds-icons'
import {
  useToken,
  spacingsTemplate,
  bordersTemplate,
  typographyTemplate,
} from '@equinor/eds-utils'
import { timePicker as tokens } from './TimePicker.tokens'

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 102px;
  display: flex;
  flex-direction: column;
  position: relative;
`

type StyledListItemType = {
  highlighted: string
  active?: string
}

const StyledList = styled(List as any)`
  background-color: ${tokens.background};
  box-shadow: ${tokens.boxShadow};
  overflow-y: scroll;
  max-height: 300px;
  padding: 0;
  ${bordersTemplate(tokens.border)}
  margin-top: 4px;
  position: absolute;
  top: 54px;
  right: 0;
  left: 0;
  z-index: 50;
`

const StyledListItem = styled(List.Item as any)<StyledListItemType>(({
  theme,
  highlighted,
  active,
}) => {
  const backgroundColor =
    highlighted === 'true'
      ? theme.states.hover.background
      : active === 'true'
        ? theme.states.active.background
        : theme.background

  return css`
    margin: 0;
    list-style: none;
    background-color: ${backgroundColor};
    ${typographyTemplate(theme.typography)};
    cursor: ${highlighted === 'true' ? 'pointer' : 'default'};
    max-width: 90px;
  `
})

const StyledButton = styled(Button as any)(({
  theme: {
    entities: { button },
  },
}) => {
  return css`
    position: absolute;
    right: ${button.spacings.right};
    height: ${button.height};
    width: ${button.height};
    top: ${button.spacings.top};
  `
})

const StyledInputWrapper = styled.div`
  position: relative;
`

const PaddedStyledListItem = styled(StyledListItem as any)`
  ${({ theme }) => spacingsTemplate(theme.spacings)}
`

const TimeIcon = styled(Icon as any)`
  position: absolute;
  z-index: 1;
  width: 18px;
  height: 18px;
  color: #616161;
  cursor: pointer;
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
        onValueChanged?.(changes.selectedItem)
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
      highlightedIndex,
      getItemProps,
      openMenu,
      selectedItem,
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
          <StyledInputWrapper>
            <Input
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
          <StyledList {...getMenuProps()} role="dialog">
            {isOpen &&
              timeValues.map((item, index) => (
                <PaddedStyledListItem
                  highlighted={highlightedIndex === index ? 'true' : 'false'}
                  active={selectedItem === item ? 'true' : 'false'}
                  key={`${item}`}
                  {...getItemProps({ item, index })}
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

export { TimePicker }
