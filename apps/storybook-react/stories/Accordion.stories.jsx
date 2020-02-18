import React from 'react'
import styled from 'styled-components'
// import { withKnobs, select, text } from '@storybook/addon-knobs'
import { Accordion, Typography } from '@equinor/eds-core-react'
import { tokens } from '@equinor/eds-tokens'

export default {
  title: 'Components|Accordion',
  component: Accordion,
}

const Wrapper = styled.div`
  margin: 32px;
`

export const allAccordion = () => (
  <Wrapper>
    <Typography>All the Accordion</Typography>
    <Accordion />
  </Wrapper>
)
