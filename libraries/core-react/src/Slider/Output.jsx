import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { typographyTemplate } from '../_common/templates'
import { slider as tokens } from './Slider.tokens'

const { enabled } = tokens

const StyledOutput = styled.output`
  --val: ${({ value }) => value};
  --realWidth: calc(100% - 12px);
  width: fit-content;
  position: relative;
  z-index: 1;
  color: ${enabled.output.text};
  ${typographyTemplate(enabled.output.typography)}
  background: ${enabled.background};
  padding: 0 5px;
  margin-top: 6px;
  /* Calculate the distance on the track*/
  margin-left: calc((var(--val) - var(--min)) / var(--dif) * var(--realWidth));
  /* Idea: Transform negative ((width of outline elem - handle width) / 2 (half of width for centering)) */
  transform: translate(calc(-1 * calc(var(--realWidth) / 2)));
  grid-row: 3;
  grid-column: 1 / 3;
`

export const Output = ({ children, value, htmlFor }) => {
  return (
    <StyledOutput value={value} htmlFor={htmlFor}>
      {children}
    </StyledOutput>
  )
}

Output.propTypes = {
  /** @ignore */
  children: PropTypes.node.isRequired,
  value: PropTypes.number.isRequired,
  htmlFor: PropTypes.string.isRequired,
}
