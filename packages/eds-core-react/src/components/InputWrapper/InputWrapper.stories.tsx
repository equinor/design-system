import { Story, ComponentMeta } from '@storybook/react'
import { accessible, dropper, search } from '@equinor/eds-icons'
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
  return (
    <InputWrapper
      label="I'm a label, play with me!"
      meta="meta tag"
      helperIcon={<Icon data={accessible} size={18} />}
      {...args}
    >
      <Input
        variant={color}
        leftAdornmentsWidth={24 + 8}
        leftAdornments={<Icon data={dropper} size={18} />}
        rightAdornments={
          <SmallButton aria-label="search" variant="contained_icon">
            <Icon data={search} size={18} />
          </SmallButton>
        }
      />
    </InputWrapper>
  )
}

Introduction.args = {
  helperText: 'Helper text',
}
