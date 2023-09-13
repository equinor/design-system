import {
  forwardRef,
  OutputHTMLAttributes,
  ReactNode,
  CSSProperties,
} from 'react'
import { styled } from 'styled-components'
import { typographyTemplate } from '@equinor/eds-utils'
import { slider as tokens } from './Slider.tokens'

const {
  entities: { track, output },
} = tokens

const StyledOutput = styled.output`
  --realWidth: calc(100% - 12px);
  width: fit-content;
  position: relative;
  z-index: 1;
  ${typographyTemplate(output.typography)}
  background: ${tokens.background};
  padding: 0 5px;
  top: ${track.spacings.top};
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
