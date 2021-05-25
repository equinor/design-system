import { forwardRef, useState, TextareaHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import * as tokens from '../Input/Input.tokens'
import type { InputToken } from '../Input/Input.tokens'
import {
  typographyTemplate,
  spacingsTemplate,
  outlineTemplate,
} from '../../utils'
import type { Variants } from '../TextField/types'
import type { Spacing } from '@equinor/eds-tokens'
import { useAutoResize, useCombinedRefs } from '../../hooks'

const { input, inputVariants } = tokens

const Variation = ({
  variant,
  token,
}: {
  variant: string
  token: InputToken
}) => {
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

  return css`
    border: none;
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
  spacings: Spacing
  token: InputToken
  variant: string
}

const StyledTextarea = styled.textarea<StyledProps>`
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  border: none;
  appearance: none;
  background: ${input.background};
  height: 100%;
  overflow: hidden;
  ${({ spacings }) => spacingsTemplate(spacings)}
  ${typographyTemplate(input.typography)}

  ${Variation}
  &::placeholder {
    color: ${input.entities.placeholder.typography.color};
  }
  &:disabled {
    color: ${input.states.disabled.typography.color};
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
  readonly?: boolean
  /** Specifies max rows for multiline input */
  rowsMax?: number
} & TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      variant = 'default',
      disabled = false,
      type = 'text',
      rowsMax = 2,
      ...other
    },
    ref,
  ) {
    const inputVariant = inputVariants[variant]
    const spacings = tokens.comfortable.spacings
    const [textareaEl, setTextareaEl] = useState<HTMLTextAreaElement>(null)

    const { lineHeight } = tokens.input.typography
    const { top, bottom } = tokens.comfortable.spacings
    let fontSize = 16

    if (textareaEl) {
      fontSize = parseInt(window.getComputedStyle(textareaEl).fontSize)
    }

    const padding = parseInt(top) + parseInt(bottom)
    const maxHeight = parseFloat(lineHeight) * fontSize * rowsMax + padding
    useAutoResize(textareaEl, maxHeight)

    console.log()

    const inputProps = {
      ref: useCombinedRefs<HTMLTextAreaElement>(ref, setTextareaEl),
      type,
      disabled,
      variant,
      token: inputVariant,
      spacings,
      ...other,
    }

    return <StyledTextarea {...inputProps} />
  },
)
