/* eslint camelcase: "off" */
import { forwardRef, Ref, InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import { checkbox as tokens } from './Checkbox.tokens'
import { typographyTemplate } from '@equinor/eds-utils'
import { CheckboxInput } from './Input'

type StyledLabelProps = {
  disabled: boolean
}

const StyledLabel = styled.label<StyledLabelProps>`
  display: inline-flex;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`

const LabelText = styled.span`
  ${typographyTemplate(tokens.typography)};
`

export type CheckboxProps = {
  /** Label for the checkbox
   */
  label?: string
  /** If true, the checkbox will be disabled */
  disabled?: boolean
  /** If true, the checkbox appears indeterminate. Important! You'll have to
   * set the native element to indeterminate yourself.
   */
  indeterminate?: boolean
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'disabled'> & {
    ref?: Ref<HTMLInputElement>
  }

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { label, disabled = false, indeterminate, className, style, ...rest },
    ref,
  ) {
    return label ? (
      <StyledLabel disabled={disabled} className={className} style={style}>
        <CheckboxInput
          {...rest}
          disabled={disabled}
          ref={ref}
          indeterminate={indeterminate}
        ></CheckboxInput>
        <LabelText>{label}</LabelText>
      </StyledLabel>
    ) : (
      <CheckboxInput
        {...rest}
        className={className}
        style={style}
        disabled={disabled}
        ref={ref}
        indeterminate={indeterminate}
      ></CheckboxInput>
    )
  },
)

Checkbox.displayName = 'Checkbox'
