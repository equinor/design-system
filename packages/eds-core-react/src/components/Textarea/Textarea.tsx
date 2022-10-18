import {
  forwardRef,
  useState,
  TextareaHTMLAttributes,
  useCallback,
} from 'react'
import * as tokens from '../Input/Input.tokens'
import { mergeRefs, useAutoResize } from '@equinor/eds-utils'
import type { Variants } from '../types'
import { useEds } from '../EdsProvider'
import { Input } from '../Input'

const { input } = tokens

export type TextareaProps = {
  /** Placeholder */
  placeholder?: string
  /** Variant */
  variant?: Variants
  /** Disabled state */
  disabled?: boolean
  /** Type */
  type?: string
  /** Read Only */
  readOnly?: boolean
  /** Specifies max rows for multiline  */
  rowsMax?: number
} & TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { variant, disabled = false, type = 'text', rowsMax, ...other },
    ref,
  ) {
    const inputVariant = tokens[variant] ? tokens[variant] : tokens.input
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
      () => mergeRefs<HTMLTextAreaElement>(ref, setTextareaEl),
      [setTextareaEl, ref],
    )()

    const inputProps = {
      ref: combinedRef,
      type,
      disabled,
      variant,
      token: inputVariant,
      density,
      ...other,
    }

    const adornmentsToTop = { style: { alignItems: 'flex-start' } }

    return (
      <Input
        as="textarea"
        rightAdornmentsProps={adornmentsToTop}
        leftAdornmentsProps={adornmentsToTop}
        style={{ height: 'auto' }}
        {...inputProps}
      />
    )
  },
)
