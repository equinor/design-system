import { LabelHTMLAttributes, forwardRef } from 'react'
import styled from 'styled-components'
import { typographyTemplate } from '@equinor/eds-utils'
import { label as tokens } from './Label.tokens'

type LabelBaseType = {
  disabledText: boolean
}

const LabelBase = styled.label<LabelBaseType>`
  display: flex;
  justify-content: space-between;
  position: relative;
  ${typographyTemplate(tokens.typography)}
  margin-left: ${tokens.spacings.left};
  margin-right: ${tokens.spacings.right};
  color: ${({ disabledText }) =>
    disabledText
      ? tokens.states.disabled.typography.color
      : tokens.typography.color};
`

const Text = styled.span`
  margin: 0;
`

export type LabelProps = {
  label: string
  meta?: string
  disabled?: boolean
} & LabelHTMLAttributes<HTMLLabelElement>

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  function Label(props, ref) {
    const { label = '', meta, disabled = false, ...other } = props

    return (
      /*  @TODO: Other props spread has to be at the end for downshift to create the for attribute */
      <LabelBase ref={ref} disabledText={disabled} {...other}>
        <Text>{label}</Text>
        {meta && <Text>{meta}</Text>}
      </LabelBase>
    )
  },
)

// Label.displayName = 'eds-text-field-label'
