import { ComponentMeta, Story } from '@storybook/react'
import { Textarea, TextareaProps } from '../Textarea'
import page from './Textarea.docs.mdx'

export default {
  title: 'Inputs/Textarea',
  component: Textarea,
  parameters: {
    docs: {
      page,
    },
  },
} as ComponentMeta<typeof Textarea>

export const Introduction: Story<TextareaProps> = (args) => (
  <Textarea {...args} />
)
