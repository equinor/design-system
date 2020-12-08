/* eslint camelcase: "off" */
import * as React from 'react'
import { forwardRef, Ref, InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import { checkbox as tokens } from './Checkbox.tokens'
import { typographyTemplate } from '@utils'
import { CheckboxInput } from './Input'

const { enabled } = tokens

type StyledCheckboxProps = {
  disabled: boolean
}

const StyledCheckbox = styled.label<StyledCheckboxProps>`
  display: inline-flex;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`

const LabelText = styled.span`
  ${typographyTemplate(enabled.typography)}
`

export type CheckboxProps = {
  /** Label for the checkbox */
  label: string
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
    { label, disabled = false, indeterminate, className, ...rest },
    ref,
  ) {
    return (
      <StyledCheckbox disabled={disabled} className={className}>
        <CheckboxInput
          {...rest}
          disabled={disabled}
          ref={ref}
          indeterminate={indeterminate}
        ></CheckboxInput>
        <LabelText>{label}</LabelText>
      </StyledCheckbox>
    )
  },
)

Checkbox.displayName = 'Checkbox'
