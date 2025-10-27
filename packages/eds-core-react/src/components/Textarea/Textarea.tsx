import {
  forwardRef,
  useRef,
  TextareaHTMLAttributes,
  useMemo,
  CSSProperties,
} from 'react'
import * as tokens from '../Input/Input.tokens'
import { mergeRefs, useAutoResize } from '@equinor/eds-utils'
import { useEds } from '../EdsProvider'
import { Input } from '../Input'
import {
  InputWrapper,
  useInputField,
  BaseInputFieldProps,
} from '../InputWrapper'

const { input } = tokens

const leftAdornmentStyles = {
  style: { alignItems: 'flex-start' as const },
}

const rightAdornmentStyles = {
  style: {
    alignItems: 'flex-start' as const,
    pointerEvents: 'none' as CSSProperties['pointerEvents'],
  },
}

type TextareaSpecificProps = {
  /** Specifies max rows for multiline  */
  rowsMax?: number
}

export type TextareaProps = BaseInputFieldProps &
  TextareaSpecificProps &
  TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      id,
      label,
      meta,
      helperText,
      placeholder,
      disabled,
      className,
      variant,
      inputIcon,
      helperIcon,
      style,
      rowsMax,
      ...other
    },
    ref,
  ) {
    const { ariaProps, containerProps, labelProps, helperProps } =
      useInputField({
        id,
        label,
        meta,
        helperText,
        helperIcon,
        variant,
        disabled,
        className,
        style,
        elementType: 'textarea',
      })

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const { density } = useEds()
    const spacings =
      density === 'compact' ? input.modes.compact.spacings : input.spacings
    const { lineHeight } = tokens.input.typography
    const { top, bottom } = spacings

    // Calculate maxHeight if rowsMax is provided
    // Using default fontSize of 16px for initial calculation
    // useAutoResize will handle actual resizing based on element's scrollHeight
    const maxHeight = rowsMax
      ? parseFloat(lineHeight) * 16 * rowsMax + parseInt(top) + parseInt(bottom)
      : null

    useAutoResize(textareaRef.current, maxHeight)

    const combinedRef = useMemo(
      () => mergeRefs<HTMLTextAreaElement>(ref, textareaRef),
      [ref],
    )

    const fieldProps = {
      ...ariaProps,
      disabled,
      placeholder,
      variant,
      rightAdornments: inputIcon,
      rightAdornmentsProps: rightAdornmentStyles,
      leftAdornmentsProps: leftAdornmentStyles,
      as: 'textarea' as const,
      ref: combinedRef,
      style: { height: 'auto' },
      ...other,
    }

    return (
      <InputWrapper
        helperProps={helperProps}
        labelProps={labelProps}
        {...containerProps}
      >
        <Input {...fieldProps} />
      </InputWrapper>
    )
  },
)
