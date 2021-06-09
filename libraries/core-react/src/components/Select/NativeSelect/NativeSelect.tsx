import { forwardRef, SelectHTMLAttributes } from 'react'
import styled from 'styled-components'
import { Label } from '../../Label'
import { nativeselect as tokens } from './NativeSelect.tokens'
import {
  typographyTemplate,
  spacingsTemplate,
  outlineTemplate,
} from '../../../utils'

const Container = styled.div`
  min-width: 100px;
  width: 100%;
`

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

export type NativeSelectProps = {
  /** Input unique id */
  id: string
  /** Label for the select element */
  label: string
  /** Meta text, for instance unit */
  meta?: string
  /** Disabled state */
  disabled?: boolean
  /** The user can choose multiple items */
  multiple?: boolean
  /** Ref for the select element */
  selectRef?: React.Ref<HTMLSelectElement>
} & SelectHTMLAttributes<HTMLSelectElement>

export const NativeSelect = forwardRef<HTMLDivElement, NativeSelectProps>(
  function NativeSelect(
    {
      label,
      children,
      className,
      selectRef,
      id,
      meta,
      disabled = false,
      multiple = false,
      ...other
    },
    ref,
  ) {
    const containerProps = {
      ref,
      className,
    }

    const selectProps = {
      ref: selectRef,
      id,
      disabled,
      multiple,
      ...other,
    }

    const labelProps = {
      htmlFor: id,
      label,
      meta,
    }

    const showLabel = label || meta

    return (
      <Container {...containerProps}>
        {showLabel && <Label {...labelProps} />}
        <StyledSelect {...selectProps}>{children}</StyledSelect>
      </Container>
    )
  },
)
