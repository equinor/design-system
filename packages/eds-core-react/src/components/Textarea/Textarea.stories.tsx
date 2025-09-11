import { StoryFn, Meta } from '@storybook/react-vite'
import { Textarea, TextareaProps } from '../Textarea'
import page from './Textarea.docs.mdx'

const meta: Meta<typeof Textarea> = {
  title: 'Inputs/Textarea',
  component: Textarea,
  parameters: {
    docs: {
      page,
    },
  },
}
export default meta

export const Introduction: StoryFn<TextareaProps> = (args) => (
  <Textarea {...args} />
)
