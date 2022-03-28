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

export const Introduction: Story<DividerProps> = (args) => (
  <Stack>
    <Divider {...args} />
    <Divider {...args} />
    <Divider {...args} />
  </Stack>
)

/* export const Color: Story<DividerProps> = () => (
  <Stack>
    <Divider />
    <Divider color="lighter" />
    <Divider color="light" />
  </Stack>
) */

/* export const Small: Story<DividerProps> = () => (
  <Stack>
    <Divider variant="small" />
    <Divider variant="small" />
    <Divider variant="small" />
  </Stack>
) */

/* export const Medium: Story<DividerProps> = () => (
  <Stack>
    <Divider />
    <Divider />
    <Divider />
  </Stack>
) */
