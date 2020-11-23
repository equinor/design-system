import * as React from 'react'
import styled from 'styled-components'
import { typographyTemplate } from '@utils'
import { label as tokens } from './Label.tokens'

const LabelBase = styled.label`
  display: flex;
  justify-content: space-between;
  position: relative;

  ${typographyTemplate(tokens.typography)}
  margin-left: ${tokens.spacings.left};
  margin-right: ${tokens.spacings.right};
  color: ${tokens.color};
`

const Text = styled.span`
  margin: 0;
`

type TextfieldProps = {
  label: string
  meta: string
  inputId: string
}

const TextFieldLabel = React.forwardRef<HTMLLabelElement, TextfieldProps>(
  function TextFieldLabel(props, ref) {
    const { label = '', meta = '', inputId, ...other } = props

    return (
      /*  @TODO: Other props spread has to be at the end for downshift to create the for attribute */
      <LabelBase ref={ref} htmlFor={inputId} {...other}>
        <Text>{label}</Text>
        <Text>{meta}</Text>
      </LabelBase>
    )
  },
)

// Label.displayName = 'eds-text-field-label'

export { TextFieldLabel as Label }
