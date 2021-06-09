import { forwardRef, SelectHTMLAttributes } from 'react'
import styled from 'styled-components'
import { nativeselect as tokens } from './Select.tokens'
import type { NativeSelectProps } from './NativeSelect'
import {
  typographyTemplate,
  spacingsTemplate,
  outlineTemplate,
} from '../../../utils'

const StyledSelect = styled.select`
  border: none;
  border-radius: 0;
  box-shadow: ${tokens.boxShadow};
  ${spacingsTemplate(tokens.entities.input.spacings)}
  ${typographyTemplate(tokens.typography)}
  padding-right: calc(${tokens.entities.input.spacings.right} *2 + ${tokens
    .entities.icon.width});
  display: block;
  margin: 0;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%236f6f6f' d='M7 9.5l5 5 5-5H7z'/%3E%3C/svg%3E"),
    linear-gradient(
      to bottom,
      ${tokens.background} 0%,
      ${tokens.background} 100%
    );
  background-repeat: no-repeat, repeat;
  background-position: right ${tokens.entities.input.spacings.right} top 50%;
  width: 100%;
  &:active,
  &:focus {
    box-shadow: none;
    ${outlineTemplate(tokens.states.focus.outline)}
  }

  &:disabled {
    color: ${tokens.states.disabled.typography.color};
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23bebebe' d='M7 9.5l5 5 5-5H7z'/%3E%3C/svg%3E"),
      linear-gradient(
        to bottom,
        ${tokens.background} 0%,
        ${tokens.background} 100%
      );
    cursor: not-allowed;
    box-shadow: none;
    outline: none;
    .arrow-icon {
      fill: red;
    }
    &:focus,
    &:active {
      outline: none;
    }
  }
`

type SelectProps = Pick<NativeSelectProps, 'multiple' | 'disabled' | 'id'> &
  SelectHTMLAttributes<HTMLSelectElement>

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { children, id, disabled = false, multiple = false, ...other },
    ref,
  ) {
    const selectProps = {
      ref,
      id,
      disabled,
      multiple,
      ...other,
    }

    return <StyledSelect {...selectProps}>{children}</StyledSelect>
  },
)
