import React from 'react'
import { DotProgress, DotProgressProps, Typography } from '@components'
import styled from 'styled-components'
import { Meta, Story } from '@storybook/react'

const Background = styled.div`
  background-color: #ebebeb;
  width: 36px;
  padding: 8px;
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
`

export default {
  title: 'Components/Progress Indicators/Dots',
  component: DotProgress,
} as Meta

export const Default: Story<DotProgressProps> = (args) => (
  <Background>
    <DotProgress {...args} />
  </Background>
)

export const Variants: Story<DotProgressProps> = () => (
  <>
    <Typography variant="h4" as="h2">
      White
    </Typography>

    <Background>
      <DotProgress variant="white" />
    </Background>

    <Typography variant="h4" as="h2">
      Green
    </Typography>
    <Background>
      <DotProgress variant="green" />
    </Background>
  </>
)
