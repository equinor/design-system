import * as React from 'react'
import { forwardRef, SelectHTMLAttributes } from 'react'
import styled from 'styled-components'
import { select as tokens } from './NativeSelect.tokens'
import { typographyTemplate, spacingsTemplate } from '../../_common/templates'

const StyledSelect = styled.select`
  background-color: ${tokens.background};
  /* height: 36px; */
  border: none;
  border-bottom-color: ${tokens.default.border.bottom.color};
  border-bottom-width: ${tokens.default.border.bottom.width};
  border-bottom-style: solid;
  ${spacingsTemplate(tokens.spacings.input)}
  ${typographyTemplate(tokens.typography)}
  display: block;
  margin: 0;
  appearance: none;
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
