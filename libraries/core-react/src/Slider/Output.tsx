import * as React from 'react'
import { forwardRef, OutputHTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'
import { typographyTemplate } from '../_common/templates'
import { slider as tokens } from './Slider.tokens'

const { enabled } = tokens

type StyledProps = Pick<OutputProps, 'value'>

const StyledOutput = styled.output<StyledProps>`
  --val: ${({ value }) => value};
  --realWidth: calc(100% - 12px);
  width: fit-content;
  position: relative;
  z-index: 1;
  color: ${enabled.output.text};
  ${typographyTemplate(enabled.output.typography)}
  background: ${enabled.background};
  padding: 0 5px;
  top: ${enabled.track.realHeight};
  pointer-events: none;
  /* Calculate the distance on the track*/
  margin-left: calc((var(--val) - var(--min)) / var(--dif) * var(--realWidth));
  /* Idea: Transform negative ((width of outline elem - handle width) / 2 (half of width for centering)) */
 transform: translate(calc(-1 * calc(var(--realWidth) / 2)));
  grid-row: 2;
  grid-column: 1 / -1;
`

type OutputProps = {
  /** Value */
  value: number
  /** HtmlFor */
  htmlFor: string
  /** Children are required */
  children: ReactNode
} & OutputHTMLAttributes<HTMLOutputElement>

export const Output = forwardRef<HTMLOutputElement, OutputProps>(
  function Output({ children, value, htmlFor }, ref) {
    return (
      <StyledOutput ref={ref} value={value} htmlFor={htmlFor}>
        {children}
      </StyledOutput>
    )
  },
)
