import {
  forwardRef,
  useState,
  TextareaHTMLAttributes,
  useCallback,
  CSSProperties,
  ForwardedRef,
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

type TextareaSpecificProps = {
  /** Specifies max rows for multiline  */
  rowsMax?: number
  /** Textarea ref */
  textareaRef?: ForwardedRef<HTMLTextAreaElement>
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
      textareaRef,
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

    const [textareaEl, setTextareaEl] = useState<HTMLTextAreaElement>(null)
    const { density } = useEds()
    const spacings =
      density === 'compact' ? input.modes.compact.spacings : input.spacings
    const { lineHeight } = tokens.input.typography
    const { top, bottom } = spacings
    let fontSize = 16

    if (textareaEl) {
      fontSize = parseInt(window.getComputedStyle(textareaEl).fontSize)
    }

    const padding = parseInt(top) + parseInt(bottom)
    const maxHeight = parseFloat(lineHeight) * fontSize * rowsMax + padding
    useAutoResize(textareaEl, rowsMax ? maxHeight : null)

    const combinedRef = useCallback(
      () => mergeRefs<HTMLTextAreaElement>(ref || textareaRef, setTextareaEl),
      [setTextareaEl, ref, textareaRef],
    )()

    const leftAdornmentStyles = {
      style: { alignItems: 'flex-start' },
    }
    const rightAdornmentStyles = {
      style: {
        alignItems: 'flex-start',
        pointerEvents: 'none' as CSSProperties['pointerEvents'],
      },
    }

    const hasRightAdornments = Boolean(inputIcon)

    const fieldProps = {
      ...ariaProps,
      disabled,
      placeholder,
      variant,
      rightAdornments: hasRightAdornments && inputIcon,
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
