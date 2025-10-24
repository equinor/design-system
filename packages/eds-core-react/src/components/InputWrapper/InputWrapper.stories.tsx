import { StoryFn, Meta } from '@storybook/react-vite'
import { InputWrapper, InputWrapperProps, Input } from '../..'

const meta: Meta<typeof InputWrapper> = {
  title: 'Inputs/InputWrapper',
  component: InputWrapper,
}

export default meta

export const Introduction: StoryFn<InputWrapperProps> = (args) => {
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
