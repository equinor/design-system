import { createContext, use } from 'react'
import { useAutocomplete } from './useAutocomplete'

export const AutocompleteContext = createContext<ReturnType<
  typeof useAutocomplete
> | null>(null)

export const useAutocompleteContext = () => {
  const context = use(AutocompleteContext)
  if (!context) {
    throw new Error(
      'Autocomplete compound components must be used within an Autocomplete component',
    )
  }
  return context
}
