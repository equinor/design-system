import { forwardRef } from 'react'
import styled from 'styled-components'
import { group as tokens } from './Group.tokens'

const { border } = tokens

const GroupBase = styled.div`
  > * {
    border-radius: 0;
    @media (hover: hover) and (pointer: fine) {
      &:hover {
        border-radius: 0;
      }
    }
  }
  > :first-child {
    border-top-left-radius: ${border.type === 'border' && border.radius};
    border-bottom-left-radius: ${border.type === 'border' && border.radius};
  }
  > :last-child {
    border-top-right-radius: ${border.type === 'border' && border.radius};
    border-bottom-right-radius: ${border.type === 'border' && border.radius};
  }
  > :not(:last-child) {
    border-right: none;
  }
`

export type GroupProps = React.HTMLAttributes<HTMLDivElement>

export const Group = forwardRef<HTMLDivElement, GroupProps>(function Group(
  { children },
  ref,
) {
  return <GroupBase ref={ref}>{children}</GroupBase>
})
