import styled from 'styled-components'
import { Paper, PaperProps } from '../..'
import { Story, ComponentMeta } from '@storybook/react'
import { Stack as SBStack } from './../../../.storybook/components'
import page from './Paper.docs.mdx'

export default {
  title: 'Surfaces/Paper',
  component: Paper,
  parameters: {
    docs: {
      page,
    },
  },
} as ComponentMeta<typeof Paper>

const Stack = styled(SBStack)`
  padding: 32px;
  background: #ebebeb;
`

const Wrapper = styled(Paper)`
  height: 150px;
  width: 150px;
`

export const Introduction: Story<PaperProps> = (args) => (
  <Stack>
    <Wrapper {...args}>
      <Paper {...args} />
    </Wrapper>
  </Stack>
)
