import { useState, useEffect } from 'react'
import { StoryFn, Meta } from '@storybook/react-vite'
import { Textarea, TextareaProps, Icon, EdsProvider, Density } from '../..'
import { Stack } from '../../../.storybook/components'
import {
  thumbs_up,
  warning_filled,
  error_filled,
  comment,
  comment_important,
} from '@equinor/eds-icons'
import page from './Textarea.docs.mdx'

const icons = {
  thumbs_up,
  warning_filled,
  error_filled,
  comment,
  comment_important,
}

Icon.add(icons)

const meta: Meta<typeof Textarea> = {
  title: 'Inputs/Textarea',
  component: Textarea,
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
  argTypes: {
    inputIcon: {
      options: ['error', 'warning', 'success'],
      mapping: {
        error: [<Icon name="error_filled" key="error" size={18} />],
        warning: [<Icon name="warning_filled" key="warning" size={18} />],
        success: [<Icon name="thumbs_up" key="thumbs" size={18} />],
      },
      control: {
        type: 'select',
      },
      description:
        'Please note that the option list of icons is not complete, this selection is only for demo purposes',
    },
    helperIcon: {
      options: ['error', 'warning', 'success'],
      mapping: {
        error: [<Icon name="error_filled" key="error" size={16} />],
        warning: [<Icon name="warning_filled" key="warning" size={16} />],
        success: [<Icon name="thumbs_up" key="thumbs" size={16} />],
      },
      control: {
        type: 'select',
      },
      description:
        'Please note that the option list of icons is not complete, this selection is only for demo purposes',
    },
    textareaRef: { control: { type: null } },
  },
  decorators: [
    (Story) => {
      return (
        <Stack>
          <Story />
        </Stack>
      )
    },
  ],
}
export default meta

export const Introduction: StoryFn<TextareaProps> = (args) => (
  <Textarea {...args} />
)

Introduction.bind({})
Introduction.args = {
  label: 'Play with me',
  helperText: 'helper text',
  placeholder: 'Placeholder text',
  rows: 3,
}

export const Multiline: StoryFn<TextareaProps> = () => (
  <Textarea id="storybook-multiline" label="Multiline" rows={3} />
)

export const MultilineRowsMax: StoryFn<TextareaProps> = () => (
  <Textarea
    id="storybook-multiline-three"
    label="Multiline with max 10 rows"
    rows={3}
    rowsMax={10}
  />
)

export const MultilineFixedHeight: StoryFn<TextareaProps> = () => (
  <Textarea
    id="storybook-multiline-fixedheight"
    defaultValue="Lorem Ipsum is simply dummy text of the printing and
    typesetting industry. Lorem Ipsum has been the industry's
    standard dummy text ever since the 1500s, when an unknown
    printer took a galley of type and scrambled it to make a
    type specimen book. It has survived not only five centuries,
    but also the leap into electronic typesetting,
    remaining essentially unchanged. It has survived not only five centuries,
    but also the leap into electronic typesetting,
    remaining essentially unchanged. It has survived not only five centuries,
    but also the leap into electronic typesetting,
    remaining essentially unchanged."
    label="Multiline with fixed height"
    style={{ height: '100px' }}
  />
)
MultilineFixedHeight.storyName = 'Multiline with fixed height'

export const WithIcon: StoryFn<TextareaProps> = () => (
  <Textarea
    id="storybook-multiline-icon"
    placeholder="Placeholder text that spans multiple lines"
    label="With icon"
    rows={3}
    inputIcon={<Icon name="comment" title="Comment" />}
  />
)
WithIcon.storyName = 'With icon'

export const Variants: StoryFn<TextareaProps> = () => (
  <>
    <Textarea
      id="multi-error"
      defaultValue="Input value that spans multiple lines"
      label="Multiline"
      rows={3}
      helperText="Validation error"
      variant="error"
      helperIcon={<Icon name="error_filled" title="Error" size={16} />}
    />
    <Textarea
      id="multi-warning-two"
      defaultValue="Input value that spans multiple lines"
      label="Multiline"
      rows={3}
      helperText="Helper/warning text"
      variant="warning"
      inputIcon={<Icon name="warning_filled" title="Warning" />}
    />
    <Textarea
      id="multi-success"
      defaultValue="Input value that spans multiple lines"
      label="Multiline"
      rows={3}
      helperText="Helper text"
      variant="success"
      helperIcon={<Icon name="thumbs_up" title="Success" size={16} />}
    />
  </>
)
Variants.decorators = [
  (Story) => {
    return (
      <Stack
        align="baseline"
        style={{
          display: 'grid',
          gridGap: '32px',
          gridTemplateColumns: 'repeat(3, auto)',
        }}
      >
        <Story />
      </Stack>
    )
  },
]

export const ReadOnly: StoryFn<TextareaProps> = () => (
  <>
    <Textarea
      id="storybook-multi-readonly"
      label="Read only"
      placeholder="Placeholder text that spans multiple lines"
      readOnly
      rows={3}
    />
    <Textarea
      id="storybook-multi-readonly-two"
      label="Read only"
      defaultValue="Input value that spans multiple lines"
      meta="Meta"
      readOnly
      rows={3}
    />
    <Textarea
      id="storybook-multi-readonly-three"
      label="Read only icon"
      defaultValue="Input value that spans multiple lines"
      variant="error"
      readOnly
      rows={3}
      helperText="helper text"
      inputIcon={<Icon name="error_filled" title="Error" />}
    />
  </>
)
ReadOnly.storyName = 'Read only'
ReadOnly.decorators = [
  (Story) => {
    return (
      <Stack
        align="baseline"
        style={{
          display: 'grid',
          gridGap: '32px',
          gridTemplateColumns: 'repeat(3, auto)',
        }}
      >
        <Story />
      </Stack>
    )
  },
]

export const Disabled: StoryFn<TextareaProps> = () => (
  <Textarea
    id="storybook-multiline-disabled"
    defaultValue="Write a comment that spans multiple lines"
    label="Comment"
    disabled
    rows={3}
    helperText="helper text"
    inputIcon={<Icon name="comment_important" title="Comment important" />}
  />
)

export const Compact: StoryFn<TextareaProps> = () => {
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <Textarea
        id="compact-textarea"
        placeholder="Placeholder text that spans multiple lines as much as is possible."
        label="Multiline"
        rowsMax={10}
        variant="warning"
        inputIcon={<Icon name="warning_filled" title="Warning" />}
        helperText="Helper information text thats very very very loooonooooooong"
      />
    </EdsProvider>
  )
}
