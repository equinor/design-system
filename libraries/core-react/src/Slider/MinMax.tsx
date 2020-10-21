import React, { forwardRef, ReactNode } from 'react'
import styled from 'styled-components'
import { typographyTemplate } from '../_common/templates'
import { slider as tokens } from './Slider.tokens'

const { enabled } = tokens

const StyledMinMax = styled.span`
  grid-row: 2;
  ${typographyTemplate(enabled.output.typography)}
  position: absolute;
  left: 2px;
  top: ${enabled.track.realHeight};
  /* Avoid track hover on minmax mouse over */
  pointer-events: none;
  text-align: left;
  /** Center align the text with the dot */
  transform: translate(calc(-1 * calc((100% - 8px) / 2)));
  &:last-child {
    left: auto;
    right: 2px;
    transform: translate(calc((100% - 8px) / 2));
  }
`

type Props = {
  // Children is required
  children: ReactNode
} & JSX.IntrinsicElements['span']

export const MinMax = forwardRef<HTMLSpanElement, Props>(function EdsMinMax(
  { children },
  ref,
) {
  return <StyledMinMax ref={ref}>{children}</StyledMinMax>
})
