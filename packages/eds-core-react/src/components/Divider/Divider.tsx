import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import * as tokens from './Divider.tokens'

const { divider } = tokens

type StyleProps = {
  backgroundColor: string
  marginTop: string
  marginBottom: string
  dividerHeight: number
}

const StyledDivider = styled.hr<StyleProps>(
  ({ backgroundColor, marginTop, marginBottom, dividerHeight }) => {
    return css`
      border: none;
      background-color: ${backgroundColor};
      margin-top: ${marginTop};
      margin-bottom: calc(${marginBottom} - ${dividerHeight}px);
      height: ${dividerHeight}px;
    `
  },
)

export type DividerProps = {
  /** Color variants */
  color?: 'lighter' | 'light' | 'medium'
  /** Vertical spacings */
  variant?: 'small' | 'medium'
  /** Divider thickness in px*/
  thickness?: '1' | '2'
  /** @ignore */
  className?: string
} & HTMLAttributes<HTMLHRElement>

export const Divider = forwardRef<HTMLHRElement, DividerProps>(function Divider(
  { color = 'medium', variant = 'medium', thickness = '1', ...rest },
  ref,
) {
  const colorValue = color === 'medium' ? 'mediumColor' : color

  const props: StyleProps = {
    backgroundColor: divider[colorValue].background,
    marginTop: tokens[variant].spacings.top,
    marginBottom: tokens[variant].spacings.bottom,
    dividerHeight: parseInt(thickness),
    ...rest,
  }
  return <StyledDivider {...props} ref={ref} />
})
