import { Story, ComponentMeta } from '@storybook/react'
import { accessible, dropper, clear, search } from '@equinor/eds-icons'
import { InputWrapper, InputWrapperProps, Input, Icon, Button } from '../..'
import styled from 'styled-components'

export default {
  title: 'Inputs/InputWrapper',
  component: InputWrapper,
} as ComponentMeta<typeof InputWrapper>

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
    <Input />
  </InputWrapper>
)

Introduction.args = {
  helperText: 'Helper text',
}
