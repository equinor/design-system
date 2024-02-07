import {
  forwardRef,
  OutputHTMLAttributes,
  ReactNode,
  CSSProperties,
} from 'react'
import styled from 'styled-components'
import { typographyTemplate } from '@equinor/eds-utils'
import { slider as tokens } from './Slider.tokens'

const {
  entities: { output },
} = tokens

const StyledOutput = styled.output`
  --realWidth: calc(100% - 12px);
  --background: var(--tooltip-background, ${output.background});
  width: fit-content;
  position: absolute;
  display: flex;
  align-items: center;
  border-radius: 4px;
  z-index: 1;
  ${typographyTemplate(output.typography)};
  color: white;
  background: var(--background);
  padding: 4px 4px 2px 4px;
  bottom: calc(100% + 1px);
  pointer-events: none;
  /* Calculate the distance on the track*/
  margin-left: calc((var(--val) - var(--min)) / var(--dif) * var(--realWidth));
  /* Idea: Transform negative ((width of outline elem - handle width) / 2 (half of width for centering)) */
  transform: translate(calc(-1 * calc(var(--realWidth) / 2)));
  grid-row: 2;
  grid-column: 1 / -1;
  opacity: var(--showTooltip);
  [data-disabled] & {
    background: ${output.states.disabled.background};
    color: ${output.states.disabled.typography.color};
  }
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
      <StyledOutput
        ref={ref}
        style={{ '--val': value } as CSSProperties}
        htmlFor={htmlFor}
      >
        {children}
      </StyledOutput>
    )
  },
)
