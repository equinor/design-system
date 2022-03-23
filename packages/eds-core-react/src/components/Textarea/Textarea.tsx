import { forwardRef, useState, TextareaHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import * as tokens from '../Input/Input.tokens'
import type { InputToken } from '../Input/Input.tokens'
import {
  typographyTemplate,
  spacingsTemplate,
  outlineTemplate,
  useAutoResize,
  useCombinedRefs,
} from '@equinor/eds-utils'
import type { Variants } from '../TextField/types'
import { useEds } from '../EdsProvider'

const { input } = tokens

const Variation = ({ variant, token, density }: StyledProps) => {
  if (!variant) {
    return ``
  }

  const {
    states: {
      focus: { outline: focusOutline },
      active: { outline: activeOutline },
    },
    boxShadow,
  } = token

  let spacings = input.spacings
  if (density === 'compact') {
    spacings = input.modes.compact.spacings
  }

  return css`
    border: none;
    ${spacingsTemplate(spacings)}
    ${outlineTemplate(activeOutline)}
    box-shadow: ${boxShadow};

    &:active,
    &:focus {
      outline-offset: 0;
      box-shadow: none;
      ${outlineTemplate(focusOutline)}
    }

    &:disabled {
      cursor: not-allowed;
      box-shadow: none;
      outline: none;
      &:focus,
      &:active {
        outline: none;
      }
    }
  `
}

type StyledProps = {
  token: InputToken
  variant: string
  density: string
}

const StyledTextarea = styled.textarea<StyledProps>`
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  border: none;
  appearance: none;
  background: ${input.background};
  height: auto;
  ${typographyTemplate(input.typography)}
  ${Variation}
  &::placeholder {
    color: ${input.entities.placeholder.typography.color};
  }
  &:disabled {
    color: ${input.states.disabled.typography.color};
  }
  &[readOnly] {
    box-shadow: ${input.states.readOnly.boxShadow};
    background: ${input.states.readOnly.background};
  }
`

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
  /** Specifies max rows for multiline input */
  rowsMax?: number
} & TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { variant = 'default', disabled = false, type = 'text', rowsMax, ...other },
    ref,
  ) {
    const actualVariant = variant === 'default' ? 'input' : variant
    const inputVariant = tokens[actualVariant]
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

    const inputProps = {
      ref: useCombinedRefs<HTMLTextAreaElement>(ref, setTextareaEl),
      type,
      disabled,
      variant,
      token: inputVariant,
      density,
      ...other,
    }

    return <StyledTextarea {...inputProps} />
  },
)
