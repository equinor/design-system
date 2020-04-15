import React from 'react'
import styled from 'styled-components'
import { Box } from '@equinor/eds-core-react'

export default {
  title: 'Box Test',
  component: Box,
}

const Wrapper = styled.div`
  margin: 32px;
`

export const Small = () => (
  <Wrapper>
    <Box />
  </Wrapper>
)
