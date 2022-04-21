import styled from 'styled-components'
import { Progress, DotProgressProps, Typography, Button } from '../../..'
import { ComponentMeta, Story } from '@storybook/react'
import { Stack as SBStack } from './../../../../.storybook/components'
import page from './Dots.docs.mdx'

const Stack = styled(SBStack)`
  padding: 32px;
  grid-template-columns: repeat(5, fit-content(100%));
`

export default {
  title: 'Feedback/Progress Indicators/Dots',
  component: Progress.Dots,
  parameters: {
    backgrounds: { default: 'light' },
    docs: {
      page,
    },
  },
  argTypes: {},
} as ComponentMeta<typeof Progress.Dots>

export const Introduction: Story<DotProgressProps> = (args) => (
  <Stack style={{ backgroundColor: '#ebebeb' }}>
    <Progress.Dots {...args} />
  </Stack>
)

Introduction.bind({})
Introduction.args = {
  color: 'primary',
}

export const Colors: Story<DotProgressProps> = () => (
  <Stack>
    <div>
      <Typography variant="h4" as="h2">
        Primary
      </Typography>
      <Progress.Dots color="primary" />
    </div>
    <div>
      <Typography variant="h4" as="h2">
        Tertiary
      </Typography>
      <Progress.Dots color="tertiary" />
    </div>
    <div>
      <Typography variant="h4" as="h2">
        Neutral
      </Typography>
      <Progress.Dots color="neutral" />
    </div>
  </Stack>
)

export const Sizes: Story<DotProgressProps> = () => (
  <Stack>
    <Progress.Dots color="primary" size={32} />
    <Progress.Dots color="primary" size={48} />
    <Progress.Dots color="primary" size={64} />
  </Stack>
)

export const InsideButton: Story<DotProgressProps> = () => (
  <Stack>
    <Button>
      <Progress.Dots />
    </Button>
    <Button variant="ghost_icon">
      <Progress.Dots color="primary" />
    </Button>
  </Stack>
)
