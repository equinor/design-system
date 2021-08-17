import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'
import { Divider } from '../Divider'

import { popover as tokens } from './Popover.tokens'

const StyledPopoverTitle = styled.div`
  margin-right: ${tokens.entities.closeButton.width};
  max-width: calc(${tokens.maxWidth} - ${tokens.entities.closeButton.width});
  overflow: hidden;
  margin-top: -${tokens.entities.title.spacings.top};
`

const StyledDivider = styled(Divider)`
  margin-left: -${tokens.spacings.left};
  margin-right: -${tokens.spacings.right};
  margin-bottom: 0;
  width: auto;
  max-width: ${tokens.maxWidth};
`

export type PopoverTitleProps = HTMLAttributes<HTMLDivElement>

export const PopoverTitle = forwardRef<HTMLDivElement, PopoverTitleProps>(
  function PopoverTitle({ children, ...rest }, ref) {
    const props = {
      ...rest,
      ref,
    }

    return (
      <div {...props}>
        <StyledPopoverTitle>{children}</StyledPopoverTitle>
        <StyledDivider variant="small" />
      </div>
    )
  },
)
