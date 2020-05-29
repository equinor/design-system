import React, { Fragment, useState } from 'react'
import { withKnobs, select, text } from '@storybook/addon-knobs'
import { Snackbar, Button, Typography } from '@equinor/eds-core-react'

import styled from 'styled-components'

const Wrapper = styled.div``

export default {
  title: 'Components|Snackbar',
  component: Snackbar,
}

export const Page = () => {
  return (
    <Wrapper>
      <Snackbar />
    </Wrapper>
  )
}
