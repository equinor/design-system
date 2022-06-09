import { Story } from '@storybook/react/types-6-0'
import { ComponentMeta } from '@storybook/react'
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
