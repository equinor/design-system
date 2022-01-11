import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'
import type { CSSObject } from 'styled-components'
import { popover as tokens } from './Popover.tokens'

const { spacings } = tokens

export type PopoverActionsProps = HTMLAttributes<HTMLDivElement>

const StyledPopoverActions = styled.div<Pick<CSSObject, 'justifyContent'>>`
  display: grid;
  grid-gap: 8px;
  grid-auto-flow: column;
  align-items: center;
  padding: 0 ${spacings.right} 0 ${spacings.left};
  :first-child {
    padding-top: ${spacings.top};
  }
  :last-child {
    padding-bottom: ${spacings.bottom};
  }
`

export const PopoverActions = forwardRef<HTMLDivElement, PopoverActionsProps>(
  function PopoverActions({ children, ...rest }, ref) {
    const props = {
      ref,
      ...rest,
    }

    return <StyledPopoverActions {...props}>{children}</StyledPopoverActions>
  },
)
