import { useId } from 'react'

export interface FieldIds {
  /** ID for the input/checkbox/radio/switch element */
  inputId: string
  /**
   * ID for the label element.
   * Use with aria-labelledby for components without native label support.
   * @example
   * ```tsx
   * <Field.Label id={labelId}>Name</Field.Label>
   * <CustomInput aria-labelledby={labelId} />
   * ```
   */
  labelId: string
  /** ID for the description element */
  descriptionId: string
  /** ID for the helper message element */
  helperMessageId: string
  /**
   * Generate aria-describedby string from relevant IDs.
   * @param options - Which elements are present in the field
   * @returns Space-separated string of IDs, or undefined if none
   */
  getDescribedBy: (options?: {
    hasDescription?: boolean
    hasHelperMessage?: boolean
  }) => string | undefined
}

/**
 * Hook for generating consistent, accessible IDs for form field elements.
 *
 * @param providedId - Optional custom ID. If not provided, a unique ID will be generated.
 * @returns Object containing IDs for input, label, description, and helper message,
 *          plus a helper function to generate aria-describedby.
 *
 * @example
 * ```tsx
 * const ids = useFieldIds()
 *
 * <Field>
 *   <Field.Label htmlFor={ids.inputId}>Username</Field.Label>
 *   <Field.Description id={ids.descriptionId}>
 *     Choose a unique username
 *   </Field.Description>
 *   <input
 *     id={ids.inputId}
 *     aria-describedby={ids.getDescribedBy({
 *       hasDescription: true,
 *       hasHelperMessage: hasError,
 *     })}
 *   />
 *   {hasError && (
 *     <HelperMessage id={ids.helperMessageId}>
 *       Username is already taken
 *     </HelperMessage>
 *   )}
 * </Field>
 * ```
 */
export function useFieldIds(providedId?: string): FieldIds {
  const generatedId = useId()
  const baseId = providedId ?? generatedId

  return {
    inputId: `${baseId}-input`,
    labelId: `${baseId}-label`,
    descriptionId: `${baseId}-description`,
    helperMessageId: `${baseId}-helper-message`,
    getDescribedBy: (options = {}) => {
      const { hasDescription = true, hasHelperMessage = false } = options
      const ids: string[] = []

      // Description first, then helper message
      if (hasDescription) ids.push(`${baseId}-description`)
      if (hasHelperMessage) ids.push(`${baseId}-helper-message`)

      return ids.length > 0 ? ids.join(' ') : undefined
    },
  }
}
