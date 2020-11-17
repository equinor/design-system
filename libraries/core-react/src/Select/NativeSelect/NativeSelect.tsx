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
  background-color: ${tokens.background};
  border: none;
  border-bottom-color: ${tokens.default.border.bottom.color};
  border-bottom-width: ${tokens.default.border.bottom.width};
  border-bottom-style: solid;
  ${spacingsTemplate(tokens.spacings.input)}
  ${typographyTemplate(tokens.typography)}
  padding-right: calc(${tokens.spacings.input.right} *2 + 24px);
  display: block;
  margin: 0;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 9.5l5 5 5-5H7z'/%3E%3C/svg%3E");
  background-repeat: no-repeat, repeat;
  background-position: right ${tokens.spacings.input.right} top 50%;
  width: 100%;
  &:active,
    &:focus {
      outline-offset: 0;
      border-bottom: 1px solid transparent;
      outline: ${tokens.default.focus.border.width} solid ${
  tokens.default.focus.border.color
};
    }

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
} & SelectHTMLAttributes<HTMLSelectElement>

export const NativeSelect = forwardRef<HTMLDivElement, NativeSelectProps>(
  function NativeSelect(
    { label, children, className, selectRef, id, meta, ...other },
    ref,
  ) {
    const containerProps = {
      ref,
      className,
    }

    const selectProps = {
      ref: selectRef,
      id,
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
