import { forwardRef, HTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'
import { typographyTemplate } from '../../utils'
import { slider as tokens } from './Slider.tokens'

const {
  entities: { track, output },
} = tokens

const StyledMinMax = styled.span`
  grid-row: 2;
  ${typographyTemplate(output.typography)}
  position: absolute;
  left: 2px;
  top: ${track.spacings.top};
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

type MinMaxProps = {
  /** Children is required */
  children: ReactNode
} & HTMLAttributes<HTMLSpanElement>

export const MinMax = forwardRef<HTMLSpanElement, MinMaxProps>(function MinMax(
  { children },
  ref,
) {
  return <StyledMinMax ref={ref}>{children}</StyledMinMax>
})
