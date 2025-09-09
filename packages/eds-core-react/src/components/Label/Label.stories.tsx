import { Label, LabelProps, Input } from '../..'
import { StoryFn, Meta } from '@storybook/react-vite'
import page from './Label.docs.mdx'

const meta: Meta<typeof Label> = {
  title: 'Inputs/Label',
  component: Label,
  parameters: {
    docs: {
      page,
    },
  },
}

export default meta

export const Introduction: StoryFn<LabelProps> = (args) => (
  <Label label="I'm a label, play with me!" {...args} />
)

export const WithMeta: StoryFn<LabelProps> = () => (
  <Label label="Speed" meta="km/h" />
)
WithMeta.storyName = 'With meta text'

export const Disabled: StoryFn<LabelProps> = () => (
  <Label
    label="I'm disabled, that means I belong to a disabled input field"
    disabled
  />
)

export const Accessiblity: StoryFn<LabelProps> = () => {
  // To wrap the input component inside the label element is not yet supported
  return (
    <>
      <Label label="I use the htmlFor prop" htmlFor="speed" />
      <Input type="text" id="speed" />
    </>
  )
}
