import * as React from 'react'
import { forwardRef, SelectHTMLAttributes } from 'react'
import styled from 'styled-components'
import { select as tokens } from './NativeSelect.tokens'
import { typographyTemplate, spacingsTemplate } from '../../_common/templates'
import { Label } from '../../Label'

const Container = styled.div`
  min-width: 100px;
  width: 100%;
`

const StyledSelect = styled.select`
/*   background-color: ${tokens.background};
 */
 border: none;
  box-shadow: inset 0 -${tokens.default.border.bottom.width} 0 0 ${
  tokens.default.border.bottom.color
};
  ${spacingsTemplate(tokens.spacings.input)}
  ${typographyTemplate(tokens.typography)}
  color: ${tokens.color};  
  padding-right: calc(${tokens.spacings.input.right} *2 + ${
  tokens.default.icon.width
});
  display: block;
  margin: 0;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%236f6f6f' d='M7 9.5l5 5 5-5H7z'/%3E%3C/svg%3E"),
  linear-gradient(to bottom, ${tokens.background} 0%, ${
  tokens.background
} 100%);
  background-repeat: no-repeat, repeat;
  background-position: right ${tokens.spacings.input.right} top 50%;
  width: 100%;
  &:active,
  &:focus {
    outline-offset: 0;
    box-shadow: none;
    outline: ${tokens.default.focus.border.width} solid ${
  tokens.default.focus.border.color
};
  }
  
  &:disabled {
    color: ${tokens.default.disabled.color};
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23bebebe' d='M7 9.5l5 5 5-5H7z'/%3E%3C/svg%3E"),
  linear-gradient(to bottom, ${tokens.background} 0%, ${
  tokens.background
} 100%);
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
  };
`

export type NativeSelectProps = {
  /** Input unique id */
  id: string
  /** Label for the select element */
  label: string
  /** Meta text, for instance unit */
  meta?: string
  /** Input ref */
  selectRef?: React.Ref<HTMLSelectElement>
  /** Disabled state */
  disabled?: boolean
  /** The user can choose multiple items */
  multiple?: boolean
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
      inputId: id,
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
