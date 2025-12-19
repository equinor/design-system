import { createContext, useContext } from 'react'

export type FieldContextValue = {
  /** Base ID for the field, used to generate IDs for sub-components */
  id: string
  /** ID for the label element */
  labelId: string
  /** ID for the description element (if present) */
  descriptionId: string
  /** ID for the validation message (if present) */
  validationId: string
  /** Whether the field is required */
  required: boolean
  /** Whether the field is disabled */
  disabled: boolean
  /** Register that description is present */
  hasDescription: boolean
  /** Register that validation is present */
  hasValidation: boolean
  /** Set whether description is present */
  setHasDescription: (value: boolean) => void
  /** Set whether validation is present */
  setHasValidation: (value: boolean) => void
}

export const FieldContext = createContext<FieldContextValue | null>(null)

export function useFieldContext() {
  const context = useContext(FieldContext)
  if (!context) {
    throw new Error('Field components must be used within a Field')
  }
  return context
}

export function useOptionalFieldContext() {
  return useContext(FieldContext)
}
