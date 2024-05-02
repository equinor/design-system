import { createContext, ReactNode, useContext } from 'react'
import { DateFormatterOptions } from 'react-aria'

type DatePickerContextValue = {
  timezone: string
  formatOptions?: DateFormatterOptions
}

const intl = new Intl.DateTimeFormat()
export const defaultTimezone = intl.resolvedOptions().timeZone

const DatePickerContext = createContext<DatePickerContextValue>({
  timezone: defaultTimezone,
})

export const DatePickerProvider = ({
  timezone,
  formatOptions,
  children,
}: DatePickerContextValue & { children: ReactNode }) => {
  return (
    <DatePickerContext.Provider
      value={{ timezone: timezone ?? defaultTimezone, formatOptions }}
    >
      {children}
    </DatePickerContext.Provider>
  )
}

export const useDatePickerContext = () => useContext(DatePickerContext)
export const useTimezone = () => useDatePickerContext().timezone
export const useCustomFormat = () => useDatePickerContext().formatOptions
