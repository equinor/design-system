import React, { Fragment, useState } from 'react'
import styled from 'styled-components'
import { Banner } from '@equinor/eds-core-react'

const Wrapper = styled.div`
  height: 100vh;
  overflow: auto;
`

export default {
  title: 'Components|Banner',
  component: Banner,
}

export const Examples = () => {
  return (
    <Wrapper>
      <Banner>Banner</Banner>
    </Wrapper>
  )
}
