import React from 'react'
import { tokens } from '@equinor/eds-tokens'
import styled from 'styled-components'

const { h1: h1Tokens } = tokens.typography.heading

const H1 = styled.h1(h1Tokens)

export default {
  title: 'Tokens/Example',
  component: H1,
}

export const TokensExample = () => (
  <div>
    <H1>Some header</H1>
  </div>
)
