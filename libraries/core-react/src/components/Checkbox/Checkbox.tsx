/* eslint camelcase: "off" */
import { forwardRef, Ref, InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import { checkbox as tokens } from './Checkbox.tokens'
import { typographyTemplate, spacingsTemplate } from '../../utils'
import { CheckboxInput } from './Input'

type StyledCheckboxProps = {
  disabled: boolean
}

const StyledCheckbox = styled.label<StyledCheckboxProps>`
  display: inline-flex;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`

const LabelText = styled.span`
  ${typographyTemplate(tokens.typography)};
  ${spacingsTemplate(tokens.entities.label.spacings)}
`

export type CheckboxProps = {
  /** Label for the checkbox.
   * Allowed to leave this blank _only_ when using `aria-labelledby` instead.
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
        {label && <LabelText>{label}</LabelText>}
      </StyledCheckbox>
    )
  },
)

Checkbox.displayName = 'Checkbox'
