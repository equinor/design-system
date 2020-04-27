import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { typographyTemplate } from '../_common/templates'
import { slider as tokens } from './Slider.tokens'

const { enabled } = tokens

const StyledMinMax = styled.span`
  grid-row: 3;
  ${typographyTemplate(enabled.output.typography)}
  position: absolute;
  left: 2px;
  text-align: left;
  margin-top: 6px;
  /** Center align the text with the dot */
  transform: translate(calc(-1 * calc((100% - 8px) / 2)));
  &:last-child {
    left: auto;
    right: 2px;
    transform: translate(calc((100% - 8px) / 2));
  }
`

export const MinMax = ({ children }) => {
  return <StyledMinMax>{children}</StyledMinMax>
}

MinMax.propTypes = {
  /** @ignore */
  children: PropTypes.node.isRequired,
}
