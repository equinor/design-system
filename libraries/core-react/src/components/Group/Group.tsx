import { forwardRef } from 'react'
import styled, { css } from 'styled-components'
import { group as tokens } from './Group.tokens'

const { border } = tokens

const GroupBase = styled.div(() => {
  const radius = border.type === 'border' && border.radius

  return css`
    > * {
      border-radius: 0;
      @media (hover: hover) and (pointer: fine) {
        &:hover {
          border-radius: 0;
        }
      }
    }
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
  `
})

export type GroupProps = React.HTMLAttributes<HTMLDivElement>

export const Group = forwardRef<HTMLDivElement, GroupProps>(function Group(
  { children, ...rest },
  ref,
) {
  return (
    <GroupBase ref={ref} {...rest}>
      {children}
    </GroupBase>
  )
})
