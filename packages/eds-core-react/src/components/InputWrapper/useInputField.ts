import { useId } from 'react'
import type { LabelProps } from '../Label/Label'
import type { HelperTextProps } from './HelperText/HelperText'
import type { BaseInputFieldProps } from './types'
import type { Variants } from '../types'

export type InputFieldConfig = BaseInputFieldProps & {
  disabled?: boolean
  placeholder?: string
  className?: string
  style?: React.CSSProperties
}

export type UseInputFieldOptions = InputFieldConfig & {
  elementType: 'input' | 'textarea'
}

export type UseInputFieldReturn = {
  fieldId: string
  helperTextId: string | null
  containerProps: {
    className?: string
    style: React.CSSProperties
    color?: Variants
  }
  labelProps: LabelProps
  helperProps: HelperTextProps
  ariaProps: {
    id: string
    'aria-invalid'?: boolean
    'aria-describedby'?: string
  }
}

/**
 * Shared hook for TextField and Textarea that handles common logic
 * for IDs, labels, helper text, and ARIA attributes
 */
export const useInputField = ({
  id,
  label,
  meta,
  helperText,
  helperIcon,
  variant,
  disabled,
  className,
  style,
  elementType,
}: UseInputFieldOptions): UseInputFieldReturn => {
  const generatedFieldId = useId()
  const generatedHelperTextId = useId()

  // Use provided ID or fall back to generated one
  const fieldId = id ?? generatedFieldId
  const helperTextId = generatedHelperTextId
  const hasHelperText = Boolean(helperText)

  const containerProps = {
    className,
    style: {
      width: '100%',
      ...style,
    },
    color: variant,
  }

  const labelProps: LabelProps = {
    htmlFor: fieldId,
    label,
    meta,
    disabled,
  }

  const helperProps: HelperTextProps = {
    id: hasHelperText ? helperTextId : null,
    text: helperText,
    icon: helperIcon,
  }

  const ariaProps = {
    id: fieldId,
    'aria-invalid': variant === 'error' || undefined,
    ...(hasHelperText && { 'aria-describedby': helperTextId }),
  }

  return {
    fieldId,
    helperTextId: hasHelperText ? helperTextId : null,
    containerProps,
    labelProps,
    helperProps,
    ariaProps,
  }
}
