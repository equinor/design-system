import * as React from 'react'
import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'
import { Divider } from '../Divider'
import { typographyTemplate } from '@utils'

import { popover as tokens } from './Popover.tokens'

const StyledPopoverTitle = styled.div`
  ${typographyTemplate(tokens.header)}
  margin-right: 48px;
  max-width: 498px;
  overflow: hidden;
`

const StyledDivider = styled(Divider)`
  margin-left: -16px;
  margin-right: -16px;
  width: auto;
  max-width: 560px;
`

type Props = HTMLAttributes<HTMLDivElement>

export const PopoverTitle = forwardRef<HTMLDivElement, Props>(
  function EdsPopoverTitle({ children, className, ...rest }, ref) {
    const props = {
      ...rest,
      className,
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

// PopoverTitle.displayName = 'eds-popover-title'
