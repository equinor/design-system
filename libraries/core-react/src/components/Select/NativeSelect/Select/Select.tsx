import * as React from 'react'
import { forwardRef, SelectHTMLAttributes } from 'react'
import styled from 'styled-components'
import { select as tokens } from './Select.tokens'
import type { NativeSelectProps } from '../NativeSelect'
import { typographyTemplate, spacingsTemplate } from '@utils'

const StyledSelect = styled.select`
  border: none;
  border-radius: 0;
  box-shadow: inset 0 -${tokens.default.border.bottom.width} 0 0 ${tokens.default.border.bottom.color};
  ${spacingsTemplate(tokens.spacings.input)}
  ${typographyTemplate(tokens.typography)}
  padding-right: calc(${tokens.spacings.input.right} *2 + ${tokens.default.icon
    .width});
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
  background-position: right ${tokens.spacings.input.right} top 50%;
  width: 100%;
  &:active,
  &:focus {
    outline-offset: 0;
    box-shadow: none;
    outline: ${tokens.default.focus.border.width} solid
      ${tokens.default.focus.border.color};
  }

  &:disabled {
    color: ${tokens.default.disabled.color};
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
