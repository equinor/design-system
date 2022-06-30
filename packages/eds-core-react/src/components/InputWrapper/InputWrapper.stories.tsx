import { Story, ComponentMeta } from '@storybook/react'
import { accessible, dropper, clear, search } from '@equinor/eds-icons'
import { InputWrapper, InputWrapperProps, Input, Icon, Button } from '../..'
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

const SmallButton = styled(Button)`
  height: 24px;
  width: 24px;
`

export const Introduction: Story<InputWrapperProps> = (args) => (
  <InputWrapper
    label="I'm a label, play with me!"
    meta="meta tag"
    helperIcon={<Icon data={accessible} size={16} />}
    {...args}
  >
    <InputWrapper.Adornments>
      <Icon data={search} size={16} />
    </InputWrapper.Adornments>
    <Input />
    <InputWrapper.Adornments>
      right
      <Icon data={dropper} size={16} />
      <SmallButton variant="ghost_icon">
        <Icon data={clear} size={16} />
      </SmallButton>
    </InputWrapper.Adornments>
  </InputWrapper>
)

Introduction.args = {
  helperText: 'Helper text',
}
