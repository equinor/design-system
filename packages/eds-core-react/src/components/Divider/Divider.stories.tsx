import styled from 'styled-components'
import { Divider, DividerProps } from '../..'
import { Story, Meta } from '@storybook/react/types-6-0'
import { Stack as SBStack } from './../../../.storybook/components'
import page from './Divider.docs.mdx'

export default {
  title: 'Data Display/Divider',
  component: Divider,
  argTypes: {
    color: { control: 'radio' },
    variant: { control: 'radio' },
  },
  parameters: {
    docs: {
      page,
    },
  },
} as Meta

const Stack = styled(SBStack)`
  display: block;
  padding: 32px;
  background-color: #999;
`

export const Introduction: Story<DividerProps> = (args) => <Divider {...args} />

export const Small: Story<DividerProps> = () => (
  <Stack>
    <Divider color="lighter" variant="small" />
    <Divider color="light" variant="small" />
    <Divider variant="small" />
  </Stack>
)

export const Medium: Story<DividerProps> = () => (
  <Stack>
    <Divider color="lighter" />
    <Divider color="light" />
    <Divider />
  </Stack>
)
