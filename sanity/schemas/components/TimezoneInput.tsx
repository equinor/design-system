import { FormEvent } from 'react'

import { useId } from '@reach/auto-id'
import { Select } from '@sanity/ui'
import timezones from '../../helpers/timezones'
import { set, unset, StringInputProps } from 'sanity'

const TimezoneInput = (props: StringInputProps) => {
  const { value = '', onChange, elementProps } = props
  const id = useId()
  const handleChange = (event: FormEvent<HTMLSelectElement>) => {
    onChange(event.currentTarget.value === '' ? unset() : set(event.currentTarget.value))
  }

  return (
    <Select {...elementProps} id={id} value={value} onChange={handleChange}>
      {timezones.map((tz) => (
        <option key={tz} value={tz}>
          {tz.replace(/_/g, ' ')}
        </option>
      ))}
    </Select>
  )
}
export default TimezoneInput
