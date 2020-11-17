import * as React from 'react'
import { forwardRef, SelectHTMLAttributes } from 'react'
import styled from 'styled-components'
import { select as tokens } from './NativeSelect.tokens'
import { typographyTemplate, spacingsTemplate } from '../../_common/templates'

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
  width: 280px;
`

export type NativeSelectProps = {
  /** Label for the select element */
  label: string
} & SelectHTMLAttributes<HTMLSelectElement>

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  function NativeSelect({ label, children }, ref) {
    return (
      <label>
        {label}
        <br /> {/* Temp hack */}
        <StyledSelect ref={ref}>{children}</StyledSelect>
      </label>
    )
  },
)
