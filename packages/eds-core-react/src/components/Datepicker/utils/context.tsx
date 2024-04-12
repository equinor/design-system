import { createContext, ReactNode } from 'react'

type DatePickerContextValue = {
  timezone: string
}

const intl = new Intl.DateTimeFormat()
export const defaultTimezone = intl.resolvedOptions().timeZone

const DatePickerContext = createContext<DatePickerContextValue>({
  timezone: defaultTimezone,
})

export const DatePickerProvider = ({
  timezone,
  children,
}: DatePickerContextValue & { children: ReactNode }) => {
  return (
    <DatePickerContext.Provider
      value={{ timezone: timezone ?? defaultTimezone }}
    >
      {children}
    </DatePickerContext.Provider>
  )
}
