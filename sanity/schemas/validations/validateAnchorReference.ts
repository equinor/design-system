import type { ValidationContext, TypedObject } from 'sanity'

// Validation for anchor input value
export const validateAnchorReference = (value: string): true | string[] => {
  const errors: string[] = []

  if (/^#/.test(value)) {
    errors.push('Anchor reference should not start with the # symbol.')
  }

  // Only allow letters, numbers, hyphens, and underscores
  const regex = /^[A-Za-z0-9_-]*$/
  if (!regex.test(value)) {
    errors.push('Anchor reference may only contain letters, numbers, hyphens, and underscores.')
  }

  // No whitespace allowed
  if (/\s/.test(value)) {
    errors.push('Anchor reference may not contain whitespace. Use hyphens (-) to separate words.')
  }

  if (errors.length > 0) return errors

  return true
}

type TopicContentDocument = {
  document: {
    [key: string]: unknown
    content: TypedObject[]
  }
  parent: {
    [key: string]: unknown
    _key: string
  }
} & ValidationContext

// Validation for adding an anchor to a component
export const validateComponentAnchor = (value: string, context: TopicContentDocument) => {
  if (!value) return true

  const errors: string[] = []

  // Check for duplicate anchor values in the document
  const anchors = context.document.content
    .filter((item: TypedObject) => item._key !== context.parent._key && (item?.anchor || item?.anchorReference))
    .map((item) => item.anchor || item.anchorReference)

  if (anchors.includes(value)) {
    errors.push('Cannot have multiple components with the same anchor on the same page.')
  }

  // Validate the input value
  const inputValidation = validateAnchorReference(value)
  if (Array.isArray(inputValidation)) {
    return [...errors, ...inputValidation]
  }

  if (errors.length > 0) return errors

  return true
}
