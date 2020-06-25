/* eslint-disable react/prop-types */
import React from 'react'
import { Typography } from '@equinor/eds-core-react'
import styled, { css } from 'styled-components'
import { slugify } from '../utils/'

const tocAdjustment = css`
  display: block;
  content: ' ';
  margin-top: -80px;
  height: 80px;
  visibility: hidden;
`

const StyledH1 = styled(Typography)`
  line-height: 48px;
`
const StyledH2 = styled(Typography)`
  margin-bottom: 0.67em !important;
  &:before {
    ${tocAdjustment}
  }
  &:not(:first-child) {
    margin-top: 1em !important;
  }
`
const StyledH3 = styled(Typography)`
  margin-top: 1em !important;
  margin-bottom: 0.2em !important;
/*   &:before {
    ${tocAdjustment}
  } */
`
const StyledH4 = styled(Typography)`
  margin-top: 1.33em !important;
  margin-bottom: 0.5em !important;
`
const StyledH5 = styled(Typography)`
  margin-top: 1.67em;
  margin-bottom: 1.67em;
`
const StyledH6 = styled(Typography)`
  margin-top: 2.33em;
  margin-bottom: 2.33em;
`
export const H1 = ({ children }) => {
  return <StyledH1 variant="h1">{children}</StyledH1>
}
export const H2 = ({ children }) => {
  return (
    <StyledH2 variant="h2" id={slugify(children)}>
      {children}
    </StyledH2>
  )
}
export const H3 = ({ children }) => {
  return <StyledH3 variant="h3">{children}</StyledH3>
}
export const H4 = ({ children }) => {
  return <StyledH4 variant="h4">{children}</StyledH4>
}
export const H5 = ({ children }) => {
  return <StyledH5 variant="h4">{children}</StyledH5>
}
export const H6 = ({ children }) => {
  return <StyledH6 variant="h4">{children}</StyledH6>
}
