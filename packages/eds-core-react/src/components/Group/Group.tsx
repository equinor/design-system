import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { group as tokens } from './Group.tokens'

const { border } = tokens

export type GroupProps = {
  /** Display Group in vertical direction. */
  vertical?: boolean
} & HTMLAttributes<HTMLDivElement>

const radius = border.type === 'border' && border.radius

const GroupBase = styled.div<GroupProps>`
  > * {
    border-radius: 0;
    @media (hover: hover) and (pointer: fine) {
      &:hover {
        border-radius: 0;
      }
    }
  }
  ${({ vertical }) =>
    vertical
      ? css`
          display: grid;
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

export const Group = forwardRef<HTMLDivElement, GroupProps>(function Group(
  { children, vertical, ...rest },
  ref,
) {
  const props = {
    ref,
    vertical,
    ...rest,
  }
  return <GroupBase {...props}>{children}</GroupBase>
})
