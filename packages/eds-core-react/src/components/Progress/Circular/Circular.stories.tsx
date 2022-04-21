import styled from 'styled-components'
import { Progress, CircularProgressProps, Button, Typography } from '../../..'
import { ComponentMeta, Story } from '@storybook/react'
import { useMockProgress } from '../../../stories'
import { Stack as SBStack } from './../../../../.storybook/components'
import page from './Circular.docs.mdx'

const Stack = styled(SBStack)`
  padding: 32px;
  grid-template-columns: repeat(5, fit-content(100%));
`

export default {
  title: 'Feedback/Progress Indicators/Circular',
  component: Progress.Circular,
  parameters: {
    backgrounds: { default: 'light' },
    docs: {
      page,
    },
  },
} as ComponentMeta<typeof Progress.Circular>

export const Introduction: Story<CircularProgressProps> = (args) => {
  const { value = 0, variant } = args
  const progress = useMockProgress(variant === 'indeterminate' ? null : value)

  return (
    <Stack style={{ backgroundColor: '#ebebeb' }}>
      <Progress.Circular {...args} value={progress} />
    </Stack>
  )
}

export const Indeterminate: Story<CircularProgressProps> = () => {
  return (
    <Stack>
      <Progress.Circular />
    </Stack>
  )
}

export const Determinate: Story<CircularProgressProps> = () => {
  const progress = useMockProgress(0)
  return (
    <Stack>
      <Progress.Circular variant="determinate" value={progress} />
    </Stack>
  )
}

export const Colors: Story<CircularProgressProps> = () => (
  <Stack style={{ backgroundColor: '#ebebeb' }}>
    <div>
      <Typography variant="h4" as="h2">
        Primary
      </Typography>
      <Progress.Circular color="primary" />
    </div>
    <div>
      <Typography variant="h4" as="h2">
        Neutral
      </Typography>
      <Progress.Circular color="neutral" />
    </div>
  </Stack>
)

export const Sizes: Story<CircularProgressProps> = () => (
  <Stack>
    <Progress.Circular size={16} />
    <Progress.Circular size={24} />
    <Progress.Circular size={32} />
    <Progress.Circular size={40} />
    <Progress.Circular size={48} />
  </Stack>
)

export const InsideButton: Story<CircularProgressProps> = () => (
  <Stack>
    <Button>
      <Progress.Circular size={16} color="neutral" />
      Loading...
    </Button>
    <Button variant="ghost_icon">
      <Progress.Circular size={24} />
    </Button>
  </Stack>
)
InsideButton.storyName = 'Inside button'
