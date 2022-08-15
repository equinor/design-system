import { Story, ComponentMeta } from '@storybook/react'
import { accessible, dropper, search } from '@equinor/eds-icons'
import { InputWrapper, InputWrapperProps, Input, Icon, Button } from '../..'
import styled from 'styled-components'
import { useId } from '@equinor/eds-utils'

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
  const inputId = useId(null, 'inputwrapper-input')
  const helperTextId = useId(null, 'inputwrapper-helpertext')

  return (
    <InputWrapper
      label={"I'm a label, play with me!"}
      helperProps={{
        id: helperTextId,
        icon: <Icon data={accessible} size={18} />,
      }}
      labelProps={{
        htmlFor: inputId,
        meta: 'meta tag',
      }}
      {...args}
    >
      <Input
        id={inputId}
        variant={color}
        aria-describedby={helperTextId}
        leftAdornmentsWidth={24 + 8}
        leftAdornments={<Icon data={dropper} size={18} />}
        rightAdornmentsWidth={24 + 8}
        rightAdornments={
          <SmallButton aria-label="search" variant="contained_icon">
            <Icon data={search} size={18} />
          </SmallButton>
        }
      />
    </InputWrapper>
  )
}

Introduction.args = {}
