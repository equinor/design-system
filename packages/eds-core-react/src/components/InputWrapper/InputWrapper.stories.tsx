import { Story, ComponentMeta } from '@storybook/react'
import { InputWrapper, InputWrapperProps, Input } from '../..'

export default {
  title: 'Inputs/InputWrapper',
  component: InputWrapper,
} as ComponentMeta<typeof InputWrapper>

export const Introduction: Story<InputWrapperProps> = (args) => {
  const helperProps = {
    text: 'helperText',
  }
  return (
    <InputWrapper
      helperProps={helperProps}
      labelProps={{
        label: "I'm a label, play with me!",
      }}
      {...args}
    >
      <Input />
    </InputWrapper>
  )
}

Introduction.args = {}
