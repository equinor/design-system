import { Story, ComponentMeta } from '@storybook/react'
import { accessible, dropper, search } from '@equinor/eds-icons'
import { Stack } from './../../../.storybook/components'
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

export const Introduction: Story<InputWrapperProps> = (args) => {
  const { color } = args
  const inputId = 'some-input-id'
  const helperTextId = 'some-helper-id'
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
