import * as React from 'react'
import styled from 'styled-components'
import { typographyTemplate } from '@utils'
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
    disabledText ? tokens.disabled.color : tokens.color};
`

const Text = styled.span`
  margin: 0;
`

type TextfieldProps = {
  label: string
  meta?: string
  inputId: string
  disabled?: boolean
}

const TextFieldLabel = React.forwardRef<HTMLLabelElement, TextfieldProps>(
  function TextFieldLabel(props, ref) {
    const { label = '', meta, inputId, disabled = false, ...other } = props

    return (
      /*  @TODO: Other props spread has to be at the end for downshift to create the for attribute */
      <LabelBase ref={ref} htmlFor={inputId} disabledText={disabled} {...other}>
        <Text>{label}</Text>
        {meta && <Text>{meta}</Text>}
      </LabelBase>
    )
  },
)

// Label.displayName = 'eds-text-field-label'

export { TextFieldLabel as Label }
