import { createContext, useContext } from 'react'
import type { ValidationMessageTone } from '../ValidationMessage/ValidationMessage.types'

export type FieldContextValue = {
  controlId: string
  disabled: boolean
  required: boolean
  registerDescription: (id: string) => void
  unregisterDescription: (id: string) => void
  registerValidation: (id: string, tone: ValidationMessageTone) => void
  unregisterValidation: (id: string) => void
}

export const FieldContext = createContext<FieldContextValue | null>(null)

export const useFieldContext = (): FieldContextValue => {
  const context = useContext(FieldContext)

  if (!context) {
    throw new Error('Field components must be used within a Field')
  }

  return context
}

export const useOptionalFieldContext = (): FieldContextValue | null => {
  return useContext(FieldContext)
}
