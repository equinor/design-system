import { FormEvent, useCallback, useState } from 'react'
import { useId } from '@reach/auto-id'
import { ResetIcon } from '@sanity/icons'
import { Box, Button, Flex, Select, Text } from '@sanity/ui'
import { set, unset, ObjectInputProps } from 'sanity'

export interface TimeInput {
  hours: string
  minutes: string
}

export const EMPTY = '--'
export const INVALID_TIME_FORMAT = 'Invalid time format'

const range = (start: number, stop: number, step = 1) =>
  Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x: number, y: number) => x + y * step)

const TIMESTEP = 5
const MINUTES = range(0, 60, TIMESTEP)
const HOURS_24 = range(0, 24)
const outgoingValue = ({ hours, minutes }: TimeType) => `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
const isValid = ({ hours, minutes }: TimeType) =>
  hours && minutes && Number.isInteger(Number(hours)) && Number.isInteger(Number(minutes))

const formatTime = (value: string | undefined): TimeType => {
  const time = value && value.includes(':') ? value.split(':') : false

  if (!time) {
    return {
      hours: EMPTY,
      minutes: EMPTY,
    }
  }

  return {
    hours: time[0] || EMPTY,
    minutes: time[1] || EMPTY,
  }
}

type TimeType = {
  hours: string
  minutes: string
}

const TimeInput = (props: ObjectInputProps<string>) => {
  const { value, onChange, elementProps } = props
  const [time, setTime] = useState(formatTime(value))

  const updateValue = useCallback(
    (time: TimeType) => {
      setTime(time)
      const newValue = outgoingValue(time)
      if (isValid(time)) {
        onChange(set(newValue))
      } else if (time.hours === EMPTY && time.minutes === EMPTY) {
        onChange(unset())
      } else {
        onChange(set(newValue))
      }
    },
    [onChange],
  )

  const handleHoursChange = useCallback(
    (event: FormEvent<HTMLSelectElement>) => {
      updateValue({ ...time, hours: event.currentTarget.value })
    },
    [time, updateValue],
  )

  const handleMinutesChange = useCallback(
    (event: FormEvent<HTMLSelectElement>) => {
      updateValue({ ...time, minutes: event.currentTarget.value })
    },
    [time, updateValue],
  )

  const handleReset = useCallback(() => {
    updateValue({ hours: EMPTY, minutes: EMPTY })
  }, [updateValue])
  const id = useId()

  return (
    <Flex align="center" flex={1}>
      <Box>
        <Select
          {...elementProps}
          id={id}
          aria-label="Select hour"
          value={value?.split(':')[0] ?? 'Pad'}
          onChange={handleHoursChange}
        >
          {[EMPTY, ...HOURS_24].map((h) => (
            <option key={h} value={`${h}`.padStart(2, '0')}>
              {`${h}`.padStart(2, '0')}
            </option>
          ))}
        </Select>
      </Box>
      <Box paddingX={1}>
        <Text>:</Text>
      </Box>
      <Box>
        <Select
          {...elementProps}
          aria-label="Select minutes"
          value={value?.split(':')[1] ?? EMPTY}
          onChange={handleMinutesChange}
        >
          {[EMPTY, ...MINUTES].map((m) => (
            <option key={m} value={`${m}`.padStart(2, '0')}>
              {`${m}`.padStart(2, '0')}
            </option>
          ))}
        </Select>
      </Box>
      <Box paddingLeft={2}>
        <Button icon={ResetIcon} text="Clear" onClick={handleReset} />
      </Box>
    </Flex>
  )
}

export default TimeInput
