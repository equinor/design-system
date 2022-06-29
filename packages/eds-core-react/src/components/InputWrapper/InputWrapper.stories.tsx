import { Story, ComponentMeta } from '@storybook/react'
import { accessible, dropper } from '@equinor/eds-icons'
import { InputWrapper, InputWrapperProps, Input, Icon } from '../..'
import styled from 'styled-components'

export default {
  title: 'Inputs/InputWrapper',
  component: InputWrapper,
} as ComponentMeta<typeof InputWrapper>

const StrippedInput = styled(Input)`
  box-shadow: none;
  background: none;
  padding: 0;
  &:active,
  &:focus {
    outline: none;
  }
`

export const Introduction: Story<InputWrapperProps> = (args) => (
  <InputWrapper
    label="I'm a label, play with me!"
    helperIcon={<Icon data={accessible} />}
    {...args}
  >
    <InputWrapper.Adornments>left</InputWrapper.Adornments>
    <StrippedInput />
    <InputWrapper.Adornments>
      right
      <Icon data={dropper} />
    </InputWrapper.Adornments>
  </InputWrapper>
)

Introduction.args = {
  helperText: 'Helper text',
}
