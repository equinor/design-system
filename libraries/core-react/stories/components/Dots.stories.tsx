import React from 'react'
import styled from 'styled-components'
import { Progress, DotProgressProps, Typography, Button } from '@components'
import { Meta, Story } from '@storybook/react'

const Wrapper = styled.div`
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(5, fit-content(100%));
`

export default {
  title: 'Components/Progress Indicators/Dots',
  component: Progress.Dots,
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
  <Progress.Dots {...args} />
)

Default.bind({})
Default.args = {
  color: 'primary',
}

export const Colors: Story<DotProgressProps> = () => (
  <Wrapper>
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
  </Wrapper>
)

export const InsideButton: Story<DotProgressProps> = () => (
  <Wrapper>
    <Button>
      <Progress.Dots />
    </Button>
    <Button variant="ghost_icon">
      <Progress.Dots color="primary" />
    </Button>
  </Wrapper>
)
