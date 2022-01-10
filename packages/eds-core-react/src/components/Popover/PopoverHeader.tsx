import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { Divider } from '../Divider'

export type PopoverHeaderProps = HTMLAttributes<HTMLDivElement>

const StyledPopoverHeader = styled.div`
  display: grid;
  grid-auto-flow: column;
`

const StyledDivider = styled(Divider)(({ theme }) => {
  return css`
    margin-left: -${theme.spacings.left};
    margin-right: -${theme.spacings.right};
    margin-bottom: 0;
    width: auto;
    max-width: ${theme.maxWidth};
  `
})

export const PopoverHeader = forwardRef<HTMLDivElement, PopoverHeaderProps>(
  function PopoverHeader({ children, ...rest }, ref) {
    const props = {
      ...rest,
      ref,
    }

    return (
      <div {...props}>
        <StyledPopoverHeader>{children}</StyledPopoverHeader>
        <StyledDivider variant="small" />
      </div>
    )
  },
)
