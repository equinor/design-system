import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { group as tokens } from './ButtonGroup.tokens'

const { border } = tokens

export type ButtonGroupProps = {
  /** Display ButtonGroup vertically. */
  vertical?: boolean
} & HTMLAttributes<HTMLDivElement>

type StyledButtonGroupProps = { $vertical?: boolean }

const radius = border.type === 'border' && border.radius

const ButtonGroupBase = styled.div<StyledButtonGroupProps>`
  display: inline-flex;
  > * {
    border-radius: 0;
    @media (hover: hover) and (pointer: fine) {
      &:hover {
        border-radius: 0;
      }
    }
  }
  ${({ $vertical }) =>
    $vertical
      ? css`
          flex-direction: column;
          > :first-child {
            border-top-left-radius: ${radius};
            border-top-right-radius: ${radius};
          }
          > :last-child {
            border-bottom-left-radius: ${radius};
            border-bottom-right-radius: ${radius};
          }
          > :not(:last-child) {
            border-bottom: none;
          }
        `
      : css`
          > :first-child {
            border-top-left-radius: ${radius};
            border-bottom-left-radius: ${radius};
          }
          > :last-child {
            border-top-right-radius: ${radius};
            border-bottom-right-radius: ${radius};
          }
          > :not(:last-child) {
            border-right: none;
          }
        `}
`

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroup({ children, vertical, ...rest }, ref) {
    const props = {
      ref,
      $vertical: vertical,
      ...rest,
    }
    return (
      <ButtonGroupBase role="group" {...props}>
        {children}
      </ButtonGroupBase>
    )
  },
)
