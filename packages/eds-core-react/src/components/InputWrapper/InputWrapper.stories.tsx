import { InputWrapper, InputWrapperProps, Input } from '../..'
import { Story } from '@storybook/react/types-6-0'
import { ComponentMeta } from '@storybook/react'

export default {
  title: 'Inputs/InputWrapper',
  component: InputWrapper,
} as ComponentMeta<typeof InputWrapper>

export const Introduction: Story<InputWrapperProps> = (args) => (
  <InputWrapper label="I'm a label, play with me!" {...args}>
    <Input />
  </InputWrapper>
)
