import type { Reference } from 'sanity'

export const validateInternalOrExternalUrl = (value: string, connectedField: string | Reference | undefined) => {
  if (value && connectedField) {
    return 'Can only have a single link. Choose either an internal or external link.'
  }

  if (!value && !connectedField) {
    return 'You must provide either an internal or external link.'
  }

  if (connectedField && !value) {
    return true
  }
  return true
}
