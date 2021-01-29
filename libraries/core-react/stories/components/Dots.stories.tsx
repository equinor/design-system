import React from 'react'
import { DotProgress, DotProgressProps, Typography, Button } from '@components'
import styled from 'styled-components'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'Components/Progress Indicators/Dots',
  component: DotProgress,
  parameters: {
    backgrounds: { default: 'light' },
    docs: {
      description: {
        component: `Progress indicators are animated helpers that indicate
        waiting time as content loads.
        `,
      },
    },
  },
  argTypes: {},
} as Meta

export const Default: Story<DotProgressProps> = (args) => (
  <DotProgress {...args} />
)

Default.bind({})
Default.args = {
  variant: 'green',
}

export const Variants: Story<DotProgressProps> = () => (
  <>
    <Typography variant="h4" as="h2">
      White
    </Typography>

    <DotProgress variant="white" />

    <Typography variant="h4" as="h2">
      Green
    </Typography>
    <DotProgress variant="green" />
  </>
)

export const InsideButton: Story<DotProgressProps> = () => (
  <Button>
    <DotProgress />
  </Button>
)
