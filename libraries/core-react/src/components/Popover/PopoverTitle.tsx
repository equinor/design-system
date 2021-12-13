import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { Divider } from '../Divider'

const StyledPopoverTitle = styled.div(({ theme }) => {
  return css`
    margin-right: ${theme.entities.closeButton.width};
    max-width: calc(${theme.maxWidth} - ${theme.entities.closeButton.width});
    overflow: hidden;
    margin-top: -${theme.entities.title.spacings.top};
  `
})

const StyledDivider = styled(Divider)(({ theme }) => {
  return css`
    margin-left: -${theme.spacings.left};
    margin-right: -${theme.spacings.right};
    margin-bottom: 0;
    width: auto;
    max-width: ${theme.maxWidth};
  `
})

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
