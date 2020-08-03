import React from 'react'
import styled from 'styled-components'

const StyledSkipLink = styled.a`
  background: #007079;
  color: #fff;
  font-weight: 700;
  left: 50%;
  padding: 8px;
  position: absolute;
  transform: translateY(-100%);
  z-index: 1010 !important;
  &:focus {
    outline: none;
    outline: 1px dashed rgba(0, 112, 121, 1);
    outline-offset: 2px;
    border-radius: 4px;
    transform: translateY(0%);
  }
`

export const SkipLink = () => {
  return <StyledSkipLink href="#main">Skip to content</StyledSkipLink>
}
